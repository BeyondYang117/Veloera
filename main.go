package main

import (
	"embed"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"veloera/common"
	"veloera/constant"
	"veloera/controller"
	"veloera/middleware"
	"veloera/model"
	"veloera/router"
	"veloera/service"
	"veloera/setting"
	"veloera/setting/operation_setting"

	"github.com/bytedance/gopkg/util/gopool"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	_ "net/http/pprof"
)

//go:embed web/dist
var buildFS embed.FS

//go:embed web/dist/index.html
var indexPage []byte

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		common.SysLog("Support for .env file is disabled: " + err.Error())
	}

	common.LoadEnv()

	common.SetupLogger()
	common.SysLog("Veloera " + common.Version + " started")
	if os.Getenv("GIN_MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}
	if common.DebugEnabled {
		common.SysLog("running in debug mode")
	}
	
	// 判断是否为开发模式
	devMode := os.Getenv("DEV_MODE") == "true"
	if devMode {
		common.SysLog("running in development mode, frontend files will be served from filesystem")
	}
	
	// Initialize SQL Database
	err = model.InitDB()
	if err != nil {
		common.FatalLog("failed to initialize database: " + err.Error())
	}

	model.CheckSetup()

	// Initialize SQL Database
	err = model.InitLogDB()
	if err != nil {
		common.FatalLog("failed to initialize database: " + err.Error())
	}
	defer func() {
		err := model.CloseDB()
		if err != nil {
			common.FatalLog("failed to close database: " + err.Error())
		}
	}()

	// Initialize Redis
	err = common.InitRedisClient()
	if err != nil {
		common.FatalLog("failed to initialize Redis: " + err.Error())
	}

	// Initialize model settings
	operation_setting.InitModelSettings()
	// Initialize constants
	constant.InitEnv()
	// Initialize options
	model.InitOptionMap()
	// 初始化OAuth配置
	common.InitConfig()
	// 加载AI小助手设置
	setting.LoadAssistantSettings()

	if common.RedisEnabled {
		// for compatibility with old versions
		common.MemoryCacheEnabled = true
	}
	if common.MemoryCacheEnabled {
		common.SysLog("memory cache enabled")
		common.SysError(fmt.Sprintf("sync frequency: %d seconds", common.SyncFrequency))
		model.InitChannelCache()
	}
	if common.MemoryCacheEnabled {
		go model.SyncOptions(common.SyncFrequency)
		go model.SyncChannelCache(common.SyncFrequency)
	}

	// 数据看板
	go model.UpdateQuotaData()

	if os.Getenv("CHANNEL_UPDATE_FREQUENCY") != "" {
		frequency, err := strconv.Atoi(os.Getenv("CHANNEL_UPDATE_FREQUENCY"))
		if err != nil {
			common.FatalLog("failed to parse CHANNEL_UPDATE_FREQUENCY: " + err.Error())
		}
		go controller.AutomaticallyUpdateChannels(frequency)
	}
	if os.Getenv("CHANNEL_TEST_FREQUENCY") != "" {
		frequency, err := strconv.Atoi(os.Getenv("CHANNEL_TEST_FREQUENCY"))
		if err != nil {
			common.FatalLog("failed to parse CHANNEL_TEST_FREQUENCY: " + err.Error())
		}
		go controller.AutomaticallyTestChannels(frequency)
	}
	if common.IsMasterNode && constant.UpdateTask {
		gopool.Go(func() {
			controller.UpdateMidjourneyTaskBulk()
		})
		gopool.Go(func() {
			controller.UpdateTaskBulk()
		})
	}
	if os.Getenv("BATCH_UPDATE_ENABLED") == "true" {
		common.BatchUpdateEnabled = true
		common.SysLog("batch update enabled with interval " + strconv.Itoa(common.BatchUpdateInterval) + "s")
		model.InitBatchUpdater()
	}

	if os.Getenv("ENABLE_PPROF") == "true" {
		gopool.Go(func() {
			log.Println(http.ListenAndServe("0.0.0.0:8005", nil))
		})
		go common.Monitor()
		common.SysLog("pprof enabled")
	}

	service.InitTokenEncoders()

	// Initialize HTTP server
	server := gin.New()
	server.Use(gin.CustomRecovery(func(c *gin.Context, err any) {
		common.SysError(fmt.Sprintf("panic detected: %v", err))
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"message": fmt.Sprintf("Panic detected, error: %v. Please submit a issue here: https://github.com/Veloera/Veloera", err),
				"type":    "veloera_panic",
			},
		})
	}))
	// This will cause SSE not to work!!!
	//server.Use(gzip.Gzip(gzip.DefaultCompression))
	server.Use(middleware.RequestId())
	middleware.SetUpLogger(server)
	// Initialize session store
	store := cookie.NewStore([]byte(common.SessionSecret))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   2592000, // 30 days
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteStrictMode,
	})
	server.Use(sessions.Sessions("session", store))

	router.SetRouter(server, buildFS, indexPage, devMode)
	var port = os.Getenv("PORT")
	if port == "" {
		port = strconv.Itoa(*common.Port)
	}
	err = server.Run(":" + port)
	if err != nil {
		common.FatalLog("failed to start HTTP server: " + err.Error())
	}
}
