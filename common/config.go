package common

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path/filepath"
	"sync"
)

// OAuthConfig 结构体用于存储OAuth配置
type OAuthConfig struct {
	LinuxDOOAuthEnabled bool   `json:"LinuxDOOAuthEnabled"`
	LinuxDOClientId     string `json:"LinuxDOClientId"`
	LinuxDOClientSecret string `json:"LinuxDOClientSecret"`
	GitHubOAuthEnabled  bool   `json:"GitHubOAuthEnabled"`
	GitHubClientId      string `json:"GitHubClientId"`
	GitHubClientSecret  string `json:"GitHubClientSecret"`
}

var (
	oauthConfig     OAuthConfig
	oauthConfigLock sync.RWMutex
	configFilePath  string
)

// InitConfig 初始化配置
func InitConfig() {
	configFilePath = os.Getenv("CONFIG_FILE_PATH")
	if configFilePath == "" {
		configFilePath = "config/oauth.json"
	}

	// 确保配置目录存在
	configDir := filepath.Dir(configFilePath)
	if _, err := os.Stat(configDir); os.IsNotExist(err) {
		err = os.MkdirAll(configDir, 0755)
		if err != nil {
			SysError("创建配置目录失败: " + err.Error())
		}
	}

	// 加载配置
	LoadOAuthConfig()
}

// LoadOAuthConfig 从文件加载OAuth配置
func LoadOAuthConfig() {
	oauthConfigLock.Lock()
	defer oauthConfigLock.Unlock()

	// 如果配置文件不存在，创建默认配置
	if _, err := os.Stat(configFilePath); os.IsNotExist(err) {
		// 使用当前内存中的配置值
		defaultConfig := OAuthConfig{
			LinuxDOOAuthEnabled: LinuxDOOAuthEnabled,
			LinuxDOClientId:     LinuxDOClientId,
			LinuxDOClientSecret: LinuxDOClientSecret,
			GitHubOAuthEnabled:  GitHubOAuthEnabled,
			GitHubClientId:      GitHubClientId,
			GitHubClientSecret:  GitHubClientSecret,
		}
		
		// 保存默认配置
		configData, err := json.MarshalIndent(defaultConfig, "", "  ")
		if err != nil {
			SysError("序列化默认配置失败: " + err.Error())
			return
		}
		
		err = ioutil.WriteFile(configFilePath, configData, 0644)
		if err != nil {
			SysError("保存默认配置失败: " + err.Error())
			return
		}
		
		oauthConfig = defaultConfig
		return
	}

	// 读取配置文件
	configData, err := ioutil.ReadFile(configFilePath)
	if err != nil {
		SysError("读取配置文件失败: " + err.Error())
		return
	}

	// 解析配置
	err = json.Unmarshal(configData, &oauthConfig)
	if err != nil {
		SysError("解析配置文件失败: " + err.Error())
		return
	}

	// 将配置应用到全局变量
	LinuxDOOAuthEnabled = oauthConfig.LinuxDOOAuthEnabled
	LinuxDOClientId = oauthConfig.LinuxDOClientId
	LinuxDOClientSecret = oauthConfig.LinuxDOClientSecret
	GitHubOAuthEnabled = oauthConfig.GitHubOAuthEnabled
	GitHubClientId = oauthConfig.GitHubClientId
	GitHubClientSecret = oauthConfig.GitHubClientSecret

	SysLog("OAuth配置已加载")
}

// SaveOAuthConfig 保存OAuth配置到文件
func SaveOAuthConfig() error {
	oauthConfigLock.Lock()
	defer oauthConfigLock.Unlock()

	// 更新配置对象
	oauthConfig = OAuthConfig{
		LinuxDOOAuthEnabled: LinuxDOOAuthEnabled,
		LinuxDOClientId:     LinuxDOClientId,
		LinuxDOClientSecret: LinuxDOClientSecret,
		GitHubOAuthEnabled:  GitHubOAuthEnabled,
		GitHubClientId:      GitHubClientId,
		GitHubClientSecret:  GitHubClientSecret,
	}

	// 序列化配置
	configData, err := json.MarshalIndent(oauthConfig, "", "  ")
	if err != nil {
		SysError("序列化配置失败: " + err.Error())
		return err
	}

	// 保存配置
	err = ioutil.WriteFile(configFilePath, configData, 0644)
	if err != nil {
		SysError("保存配置失败: " + err.Error())
		return err
	}

	SysLog("OAuth配置已保存")
	return nil
} 