package setting

import (
	"encoding/json"
	"veloera/common"
)

var (
	// DefaultAssistantModel 是AI小助手默认使用的模型
	DefaultAssistantModel = "gpt-4o"
	
	// SystemAssistantToken 是AI小助手默认使用的系统令牌
	SystemAssistantToken = ""
	
	// EnableUserToken 是否启用用户的令牌（如果用户已登录）
	EnableUserToken = false
)

// AssistantSettings 结构体用于JSON序列化和反序列化
type AssistantSettings struct {
	DefaultModel   string `json:"default_model"`
	SystemToken    string `json:"system_token"`
	EnableUserToken bool   `json:"enable_user_token"`
}

// LoadAssistantSettings 从数据库加载AI小助手设置
func LoadAssistantSettings() {
	common.OptionMapRWMutex.RLock()
	defer common.OptionMapRWMutex.RUnlock()
	
	// 从OptionMap中获取设置
	settingsJSON, ok := common.OptionMap["AssistantSettings"]
	if !ok || settingsJSON == "" {
		return
	}
	
	var settings AssistantSettings
	err := json.Unmarshal([]byte(settingsJSON), &settings)
	if err != nil {
		common.SysError("解析AI小助手设置失败: " + err.Error())
		return
	}
	
	// 更新全局变量
	DefaultAssistantModel = settings.DefaultModel
	SystemAssistantToken = settings.SystemToken
	EnableUserToken = settings.EnableUserToken
}

// SaveAssistantSettings 保存AI小助手设置到数据库
func SaveAssistantSettings() error {
	settings := AssistantSettings{
		DefaultModel:   DefaultAssistantModel,
		SystemToken:    SystemAssistantToken,
		EnableUserToken: EnableUserToken,
	}
	
	settingsJSON, err := json.Marshal(settings)
	if err != nil {
		return err
	}
	
	// 使用model.UpdateOption保存设置
	return common.UpdateOption("AssistantSettings", string(settingsJSON))
}

// AssistantSettings2JSONString 将AI小助手设置转换为JSON字符串
func AssistantSettings2JSONString() string {
	settings := AssistantSettings{
		DefaultModel:   DefaultAssistantModel,
		SystemToken:    SystemAssistantToken,
		EnableUserToken: EnableUserToken,
	}
	
	settingsJSON, err := json.Marshal(settings)
	if err != nil {
		common.SysError("序列化AI小助手设置失败: " + err.Error())
		return "{}"
	}
	
	return string(settingsJSON)
} 