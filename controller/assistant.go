package controller

import (
	"fmt"
	"net/http"
	"veloera/common"
	"veloera/model"
	"veloera/setting"

	"github.com/gin-gonic/gin"
)

// ChatAssistant 处理AI小助手的聊天请求
func ChatAssistant(c *gin.Context) {
	// 获取用户ID（如果已登录）
	userId := c.GetInt("id")
	
	// 获取请求体
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "无效的请求格式",
		})
		return
	}
	
	// 设置默认模型为gpt-4o
	if _, ok := requestBody["model"]; !ok {
		requestBody["model"] = setting.DefaultAssistantModel
	}
	
	// 获取适当的令牌
	token, err := GetAssistantToken(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	
	// 设置认证头
	c.Request.Header.Set("Authorization", "Bearer "+token)
	
	// 转发请求到标准的聊天补全API
	Relay(c)
}

// GetAssistantToken 根据用户登录状态返回合适的令牌
func GetAssistantToken(userId int) (string, error) {
	// 默认使用系统设置的令牌
	if setting.SystemAssistantToken == "" {
		return "", fmt.Errorf("未配置系统令牌")
	}
	
	// 如果启用了用户令牌且用户已登录，尝试使用用户令牌
	if setting.EnableUserToken && userId != 0 {
		// 获取用户的第一个令牌
		tokens, err := model.GetAllUserTokens(userId, 0, 1)
		if err == nil && len(tokens) > 0 && tokens[0].Status == common.TokenStatusEnabled {
			return tokens[0].Key, nil
		}
		// 如果用户没有可用令牌，回退到系统令牌
	}
	
	return setting.SystemAssistantToken, nil
} 