package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
	"veloera/common"
	"veloera/setting"

	"github.com/gin-gonic/gin"
)

// getSystemPrompt 获取系统提示词
func getSystemPrompt() string {
	systemName := common.SystemName
	if systemName == "" {
		systemName = "本平台" // 如果系统名称为空，使用通用名称
	}

	// 获取服务器地址
	serverAddress := setting.ServerAddress
	if serverAddress == "" {
		serverAddress = "https://your-domain.com" // 默认地址
	} else {
		// 确保地址不以斜杠结尾
		serverAddress = strings.TrimSuffix(serverAddress, "/")
	}

	return fmt.Sprintf(`你是%s的AI客服助手，专门为用户提供友好、专业的帮助。

## 关于%s平台

%s是一个专业的AI API管理平台，主要功能包括：

### 🔑 核心功能
- **API密钥管理** - 创建和管理API令牌，设置使用限制
- **多模型支持** - 支持OpenAI、Claude、Gemini等主流AI模型
- **使用监控** - 实时查看API调用情况和额度使用
- **渠道管理** - 配置多个AI服务提供商，灵活切换
- **数据统计** - 详细的使用报告和数据分析

### 📋 常用操作指南

**创建API密钥：**
1. 登录%s平台
2. 进入"令牌"页面
3. 点击"新建令牌"
4. 设置令牌名称和额度限制
5. 点击"提交"并复制生成的密钥

**查看使用情况：**
- 📊 **首页** - 查看总体使用概况
- 📈 **数据看板** - 详细的使用统计图表
- 📝 **日志页面** - 具体的API调用记录

**API使用方法：**
- 🌐 **API地址：** %s/v1/chat/completions
- 🔐 **请求头：** Authorization: Bearer your-api-key
- 📄 **格式：** 标准OpenAI API格式
- 🛠️ **兼容工具：** ChatGPT Next Web、Lobe Chat等

### 💡 回答风格要求
- 使用清晰的markdown格式，让信息更易读
- 适当使用emoji图标增加友好感
- 用标题和列表组织信息结构
- 重要信息用粗体突出显示
- 保持专业但亲切的语调
- 结尾友好地邀请用户继续咨询

请用结构化、美观的格式回答用户问题，让信息清晰易懂。`, systemName, systemName, systemName, systemName, serverAddress)
}

// ChatRequest 聊天请求结构
type ChatRequest struct {
	Messages []ChatMessage `json:"messages"`
	Model    string        `json:"model"`
	Stream   bool          `json:"stream,omitempty"`
}

// ChatMessage 聊天消息结构
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatAssistant 处理AI小助手的聊天请求
func ChatAssistant(c *gin.Context) {
	// 检查AI助手是否已配置
	if !setting.IsAssistantConfigured() {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": gin.H{
				"message": "AI小助手未配置，请联系管理员设置API地址、密钥和模型",
				"type":    "configuration_error",
			},
		})
		return
	}

	// 读取请求体
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{
				"message": "无法读取请求体",
				"type":    "invalid_request_error",
			},
		})
		return
	}

	// 解析请求
	var chatRequest ChatRequest
	if err := json.Unmarshal(body, &chatRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{
				"message": "请求格式错误",
				"type":    "invalid_request_error",
			},
		})
		return
	}

	// 验证请求
	if len(chatRequest.Messages) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{
				"message": "消息不能为空",
				"type":    "invalid_request_error",
			},
		})
		return
	}

	// 使用系统配置的模型
	chatRequest.Model = setting.AssistantModel

	// 添加系统提示词
	systemPrompt := getSystemPrompt()
	if len(chatRequest.Messages) > 0 && chatRequest.Messages[0].Role != "system" {
		// 在消息开头插入系统提示词
		chatRequest.Messages = append([]ChatMessage{{Role: "system", Content: systemPrompt}}, chatRequest.Messages...)
	}

	// 调用配置的AI API
	response, err := callAssistantAPI(chatRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"message": fmt.Sprintf("调用AI服务失败: %v", err),
				"type":    "api_error",
			},
		})
		return
	}

	// 直接返回API响应
	c.Header("Content-Type", "application/json")
	c.Data(http.StatusOK, "application/json", response)
}

// callAssistantAPI 调用配置的AI API
func callAssistantAPI(chatRequest ChatRequest) ([]byte, error) {
	// 准备请求数据
	requestData, err := json.Marshal(chatRequest)
	if err != nil {
		return nil, fmt.Errorf("序列化请求数据失败: %v", err)
	}

	// 创建HTTP请求
	req, err := http.NewRequest("POST", setting.AssistantAPIURL, bytes.NewBuffer(requestData))
	if err != nil {
		return nil, fmt.Errorf("创建HTTP请求失败: %v", err)
	}

	// 设置请求头
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+setting.AssistantAPIKey)

	// 创建HTTP客户端
	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	// 发送请求
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("发送HTTP请求失败: %v", err)
	}
	defer resp.Body.Close()

	// 读取响应
	responseData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应数据失败: %v", err)
	}

	// 检查HTTP状态码
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API返回错误状态码 %d: %s", resp.StatusCode, string(responseData))
	}

	return responseData, nil
}

