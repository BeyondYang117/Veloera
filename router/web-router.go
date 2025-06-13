package router

import (
	"embed"
	"net/http"
	"strings"
	"veloera/common"
	"veloera/controller"
	"veloera/middleware"

	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func SetWebRouter(router *gin.Engine, buildFS embed.FS, indexPage []byte, devMode bool) {
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())
	
	// 在开发模式下，从文件系统读取前端文件
	if devMode {
		router.Use(static.Serve("/", static.LocalFile("web/dist", false)))
		common.SysLog("serving frontend files from filesystem in development mode")
	} else {
		// 生产模式下，使用嵌入式文件系统
		router.Use(static.Serve("/", common.EmbedFolder(buildFS, "web/dist")))
	}

	router.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") || strings.HasPrefix(c.Request.RequestURI, "/assets") {
			controller.RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		if devMode {
			// 开发模式下，从文件系统读取 index.html
			c.File("web/dist/index.html")
		} else {
			// 生产模式下，使用嵌入式 index.html
			c.Data(http.StatusOK, "text/html; charset=utf-8", indexPage)
		}
	})
}
