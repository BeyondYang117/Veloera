package setting

import (
	"encoding/json"
	"veloera/common"
)

var (
	// AssistantAPIURL 是AI小助手使用的API地址
	AssistantAPIURL = ""

	// AssistantAPIKey 是AI小助手使用的API密钥
	AssistantAPIKey = ""

	// AssistantModel 是AI小助手使用的模型
	AssistantModel = "gpt-3.5-turbo"

	// AssistantEnabled 是否启用AI小助手功能
	AssistantEnabled = false
)

// AssistantSettings 结构体用于JSON序列化和反序列化
type AssistantSettings struct {
	APIURL  string `json:"api_url"`
	APIKey  string `json:"api_key"`
	Model   string `json:"model"`
	Enabled bool   `json:"enabled"`
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

	// 首先尝试解析为map，以便灵活处理不同的数据类型
	var rawSettings map[string]interface{}
	err := json.Unmarshal([]byte(settingsJSON), &rawSettings)
	if err != nil {
		common.SysError("解析AI小助手设置失败: " + err.Error())
		return
	}

	// 安全地提取各个字段
	if apiURL, ok := rawSettings["api_url"].(string); ok {
		AssistantAPIURL = apiURL
	}

	if apiKey, ok := rawSettings["api_key"].(string); ok {
		AssistantAPIKey = apiKey
	}

	if model, ok := rawSettings["model"].(string); ok {
		AssistantModel = model
	}

	// 处理enabled字段，支持多种类型
	if enabledRaw, ok := rawSettings["enabled"]; ok {
		switch v := enabledRaw.(type) {
		case bool:
			AssistantEnabled = v
		case string:
			AssistantEnabled = v == "true"
		default:
			AssistantEnabled = false
		}
	}
}

// SaveAssistantSettings 保存AI小助手设置到数据库
func SaveAssistantSettings() error {
	settings := AssistantSettings{
		APIURL:  AssistantAPIURL,
		APIKey:  AssistantAPIKey,
		Model:   AssistantModel,
		Enabled: AssistantEnabled,
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
	// 如果所有设置都是默认值，返回一个包含默认值的JSON
	if AssistantAPIURL == "" && AssistantAPIKey == "" && AssistantModel == "gpt-3.5-turbo" && !AssistantEnabled {
		defaultSettings := AssistantSettings{
			APIURL:  "https://api.openai.com/v1/chat/completions",
			APIKey:  "",
			Model:   "gpt-3.5-turbo",
			Enabled: false,
		}
		settingsJSON, err := json.Marshal(defaultSettings)
		if err != nil {
			common.SysError("序列化AI小助手默认设置失败: " + err.Error())
			return `{"api_url":"https://api.openai.com/v1/chat/completions","api_key":"","model":"gpt-3.5-turbo","enabled":false}`
		}
		return string(settingsJSON)
	}

	settings := AssistantSettings{
		APIURL:  AssistantAPIURL,
		APIKey:  AssistantAPIKey,
		Model:   AssistantModel,
		Enabled: AssistantEnabled,
	}

	settingsJSON, err := json.Marshal(settings)
	if err != nil {
		common.SysError("序列化AI小助手设置失败: " + err.Error())
		return `{"api_url":"https://api.openai.com/v1/chat/completions","api_key":"","model":"gpt-3.5-turbo","enabled":false}`
	}

	return string(settingsJSON)
}

// IsAssistantConfigured 检查AI小助手是否已正确配置
func IsAssistantConfigured() bool {
	return AssistantEnabled && AssistantAPIURL != "" && AssistantAPIKey != "" && AssistantModel != ""
}