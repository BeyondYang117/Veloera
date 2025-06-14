import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSystemName, showSuccess, API } from '../helpers';
import { useTheme } from '../context/Theme';
import ReactMarkdown from 'react-markdown';
import './AiAssistant.css';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const systemName = getSystemName();
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isDarkMode = theme === 'dark';

  // 窗口大小和位置状态
  const [windowSize, setWindowSize] = useState(() => {
    const saved = localStorage.getItem('ai-assistant-window-size');
    return saved ? JSON.parse(saved) : { width: 450, height: 650 };
  });
  const [windowPosition, setWindowPosition] = useState(() => {
    const saved = localStorage.getItem('ai-assistant-window-position');
    return saved ? JSON.parse(saved) : { right: 30, bottom: 100 };
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const windowRef = useRef(null);

  // 最小和最大窗口尺寸
  const MIN_WIDTH = 320;
  const MIN_HEIGHT = 400;
  const MAX_WIDTH = window.innerWidth - 60;
  const MAX_HEIGHT = window.innerHeight - 60;
  
  // 根据主题定义样式变量 - 增强对比度
  const themeStyles = {
    // 聊天窗口背景
    chatWindowBg: isDarkMode ? '#1a1a1a' : 'white',
    // 窗口边框和阴影
    chatWindowBorder: isDarkMode ? '1px solid #383838' : 'none',
    chatWindowShadow: isDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.5)' : '0 10px 40px rgba(0, 0, 0, 0.15)',
    // 聊天窗口头部
    headerBg: '#1890ff',
    headerText: 'white',
    // 聊天内容区域背景
    contentBg: isDarkMode ? '#1a1a1a' : 'white',
    // 消息气泡样式 - 用户
    userBubbleBg: isDarkMode ? '#1366ca' : '#e6f7ff',
    userBubbleBorder: isDarkMode ? '1px solid #1a88ff' : '1px solid #91d5ff',
    userBubbleText: isDarkMode ? '#ffffff' : '#1890ff',
    // 消息气泡样式 - AI
    aiBubbleBg: isDarkMode ? '#323232' : 'rgba(24, 144, 255, 0.05)',
    aiBubbleBorder: isDarkMode ? '1px solid #4a4a4a' : '1px solid rgba(24, 144, 255, 0.1)',
    aiBubbleText: isDarkMode ? '#ffffff' : '#333',
    // 输入区域
    inputAreaBg: isDarkMode ? '#1a1a1a' : 'white',
    inputAreaBorder: isDarkMode ? '1px solid #383838' : '1px solid #eaeaea',
    // 输入框
    inputBg: isDarkMode ? '#323232' : 'white',
    inputBorder: isDarkMode ? '1px solid #4a4a4a' : '1px solid #d9d9d9',
    inputText: isDarkMode ? '#ffffff' : 'inherit',
    inputPlaceholder: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#bfbfbf',
    // 常见问题
    suggestionBg: isDarkMode ? '#323232' : '#f0f0f0',
    suggestionText: isDarkMode ? '#ffffff' : '#666',
    suggestionHoverBg: isDarkMode ? '#1366ca' : '#e6f7ff',
    // 加载状态文字
    loadingText: isDarkMode ? '#ffffff' : '#666',
    // 助手按钮
    assistantButtonBg: '#1890ff',
    assistantButtonShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.15)',
    // 错误文本颜色
    errorText: isDarkMode ? '#ff4d4f' : '#ff4d4f',
    // 发送按钮
    sendButtonBg: isDarkMode ? '#1890ff' : '#1890ff',
    sendButtonHoverBg: isDarkMode ? '#40a9ff' : '#40a9ff',
    sendButtonText: 'white',
    // 滚动条
    scrollbarThumb: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
    scrollbarTrack: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
    // 文字阴影 (新增)
    textShadow: isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.5)' : 'none',
  };
  
  // 保存窗口设置到本地存储
  const saveWindowSettings = useCallback(() => {
    localStorage.setItem('ai-assistant-window-size', JSON.stringify(windowSize));
    localStorage.setItem('ai-assistant-window-position', JSON.stringify(windowPosition));
  }, [windowSize, windowPosition]);

  // 窗口控制功能
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const closeWindow = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // 鼠标事件处理
  const handleMouseDown = useCallback((e, action, direction = '') => {
    e.preventDefault();
    if (action === 'drag') {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (action === 'resize') {
      setIsResizing(true);
      setResizeDirection(direction);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: windowSize.width,
        height: windowSize.height
      });
    }
  }, [windowSize]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && !isFullscreen) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setWindowPosition(prev => ({
        right: Math.max(10, Math.min(window.innerWidth - windowSize.width - 10, prev.right - deltaX)),
        bottom: Math.max(10, Math.min(window.innerHeight - windowSize.height - 10, prev.bottom - deltaY))
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing && !isFullscreen) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStart.width + deltaX));
      }
      if (resizeDirection.includes('left')) {
        newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStart.width - deltaX));
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStart.height + deltaY));
      }
      if (resizeDirection.includes('top')) {
        newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStart.height - deltaY));
      }

      setWindowSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDirection, windowSize, isFullscreen]);

  const handleMouseUp = useCallback(() => {
    if (isDragging || isResizing) {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
      saveWindowSettings();
    }
  }, [isDragging, isResizing, saveWindowSettings]);

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // 检查是否需要显示缓存警告
  useEffect(() => {
    if (systemName === 'BigAiPro') {
      setShowBadge(true);
    }

    // 初始化欢迎消息
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: `您好！我是${systemName}的AI助手，有什么可以帮助您的吗？` }
      ]);
    }
  }, [systemName, messages.length]);
  
  // 消息滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  // 清理缓存并刷新页面
  const clearCache = () => {
    localStorage.removeItem('system_name');
    localStorage.removeItem('status');
    showSuccess('缓存已清理，正在刷新页面...');
    setTimeout(() => window.location.reload(), 1000);
  };
  
  // 处理输入变化
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  // 处理按键事件，支持回车发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // 发送消息到大模型
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    // 添加用户消息到聊天历史
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // 准备请求数据
      const requestData = {
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000
      };

      // 发送请求到AI助手专用API（无需登录，后端会自动处理token）
      const response = await API.post('/api/chat/assistant', requestData);

      // 处理响应
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const assistantMessage = {
          role: 'assistant',
          content: response.data.choices[0].message.content
        };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      } else {
        throw new Error('未收到有效的模型响应');
      }
    } catch (err) {
      console.error('调用AI模型出错:', err);
      // 处理特殊错误情况
      if (err.response?.status === 500 && err.response?.data?.message?.includes('未配置系统令牌')) {
        setError('AI助手服务暂时不可用，请联系管理员配置系统令牌');
      } else {
        setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || '调用AI模型出错，请稍后再试');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 常见问题列表
  const commonQuestions = [
    `${systemName}有哪些功能？`,
    `如何创建API密钥？`,
    `如何查看使用额度？`,
    `支持哪些模型？`
  ];
  
  // 选择常见问题
  const handleSelectQuestion = (question) => {
    setInput(question);
  };
  
  return (
    <>
      {/* AI助手按钮 */}
      {!isOpen && (
        <div
          onClick={toggleChat}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 999,
            cursor: 'pointer',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: themeStyles.assistantButtonBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: themeStyles.assistantButtonShadow
            }}
          >
            {showBadge && (
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '10px',
                height: '10px',
                background: 'red',
                borderRadius: '50%'
              }}></div>
            )}
            AI
          </div>
        </div>
      )}

      {/* 最小化状态的任务栏 */}
      {isOpen && isMinimized && (
        <div
          onClick={toggleChat}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 999,
            cursor: 'pointer',
            padding: '8px 16px',
            background: themeStyles.headerBg,
            color: 'white',
            borderRadius: '20px',
            boxShadow: themeStyles.assistantButtonShadow,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          <span>AI</span>
          <span>{systemName} 助手</span>
        </div>
      )}
      
      {/* 系统名称异常时显示重置按钮 */}
      {systemName === 'BigAiPro' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '30px', 
          right: '100px', 
          zIndex: 1000,
          backgroundColor: 'rgba(255,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }} 
        onClick={clearCache}
        title="检测到系统名称显示错误，点击重置缓存">
          重置系统名称
        </div>
      )}
      
      {/* 聊天窗口 */}
      {isOpen && !isMinimized && (
        <div
          ref={windowRef}
          style={{
            position: 'fixed',
            right: isFullscreen ? 0 : `${windowPosition.right}px`,
            bottom: isFullscreen ? 0 : `${windowPosition.bottom}px`,
            width: isFullscreen ? '100vw' : `${windowSize.width}px`,
            height: isFullscreen ? '100vh' : `${windowSize.height}px`,
            background: themeStyles.chatWindowBg,
            borderRadius: isFullscreen ? '0' : '16px',
            boxShadow: themeStyles.chatWindowShadow,
            border: themeStyles.chatWindowBorder,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            transition: isFullscreen ? 'all 0.3s ease' : 'none',
          }}>

          {/* 调整大小的手柄 */}
          {!isFullscreen && (
            <>
              {/* 右边缘 */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '20px',
                  bottom: '20px',
                  width: '4px',
                  cursor: 'ew-resize',
                  zIndex: 1001,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'resize', 'right')}
              />
              {/* 底边缘 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20px',
                  right: '20px',
                  height: '4px',
                  cursor: 'ns-resize',
                  zIndex: 1001,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'resize', 'bottom')}
              />
              {/* 右下角 */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '20px',
                  height: '20px',
                  cursor: 'nw-resize',
                  zIndex: 1001,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'resize', 'right bottom')}
              />
            </>
          )}

          {/* 聊天窗口头部 */}
          <div
            style={{
              background: themeStyles.headerBg,
              padding: '12px 16px',
              color: themeStyles.headerText,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              cursor: isFullscreen ? 'default' : 'move',
              userSelect: 'none',
            }}
            onMouseDown={(e) => !isFullscreen && handleMouseDown(e, 'drag')}
          >
            <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '16px' }}>
              {systemName} 助手
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* 最小化按钮 */}
              <div
                onClick={toggleMinimize}
                style={{
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#ffffff',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                title="最小化"
              >
                −
              </div>
              {/* 全屏/窗口切换按钮 */}
              <div
                onClick={toggleFullscreen}
                style={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#ffffff',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                title={isFullscreen ? "退出全屏" : "全屏"}
              >
                {isFullscreen ? '⧉' : '□'}
              </div>
              {/* 关闭按钮 */}
              <div
                onClick={closeWindow}
                style={{
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#ffffff',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,0,0,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                title="关闭"
              >
                ✕
              </div>
            </div>
          </div>
          
          {/* 聊天内容区域 */}
          <div
            className={`chat-content-area ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: themeStyles.contentBg,
            }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: msg.role === 'user' ? themeStyles.userBubbleBg : themeStyles.aiBubbleBg,
                    color: msg.role === 'user' ? themeStyles.userBubbleText : themeStyles.aiBubbleText,
                    border: msg.role === 'user' ? themeStyles.userBubbleBorder : themeStyles.aiBubbleBorder,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '12px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                    wordBreak: 'break-word',
                    lineHeight: '1.5',
                    textShadow: themeStyles.textShadow,
                    fontWeight: isDarkMode ? 600 : 'normal'
                  }}
                >
                  {msg.role === 'assistant' ? (
                    <div style={{
                      color: 'inherit',
                      fontSize: 'inherit',
                      lineHeight: 'inherit'
                    }}>
                      <ReactMarkdown
                        components={{
                          // 自定义组件样式以匹配主题
                          p: ({children}) => <p style={{margin: '0 0 8px 0', lineHeight: '1.5'}}>{children}</p>,
                          ul: ({children}) => <ul style={{margin: '8px 0', paddingLeft: '20px'}}>{children}</ul>,
                          ol: ({children}) => <ol style={{margin: '8px 0', paddingLeft: '20px'}}>{children}</ol>,
                          li: ({children}) => <li style={{margin: '2px 0'}}>{children}</li>,
                          code: ({children}) => (
                            <code style={{
                              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                              padding: '2px 4px',
                              borderRadius: '3px',
                              fontSize: '0.9em'
                            }}>{children}</code>
                          ),
                          pre: ({children}) => (
                            <pre style={{
                              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                              padding: '8px',
                              borderRadius: '6px',
                              overflow: 'auto',
                              margin: '8px 0'
                            }}>{children}</pre>
                          ),
                          blockquote: ({children}) => (
                            <blockquote style={{
                              borderLeft: `3px solid ${isDarkMode ? '#4a4a4a' : '#ddd'}`,
                              paddingLeft: '12px',
                              margin: '8px 0',
                              fontStyle: 'italic'
                            }}>{children}</blockquote>
                          ),
                          h1: ({children}) => <h1 style={{fontSize: '1.2em', margin: '8px 0 4px 0', fontWeight: 'bold'}}>{children}</h1>,
                          h2: ({children}) => <h2 style={{fontSize: '1.1em', margin: '8px 0 4px 0', fontWeight: 'bold'}}>{children}</h2>,
                          h3: ({children}) => <h3 style={{fontSize: '1.05em', margin: '8px 0 4px 0', fontWeight: 'bold'}}>{children}</h3>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    marginTop: '4px',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.45)',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    textShadow: themeStyles.textShadow
                  }}
                >
                  {msg.role === 'user' ? '您' : systemName}
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '12px 16px',
                borderRadius: '12px',
                background: themeStyles.aiBubbleBg,
                color: themeStyles.loadingText,
                border: themeStyles.aiBubbleBorder,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                borderBottomLeftRadius: '4px',
                marginBottom: '16px',
                textShadow: themeStyles.textShadow,
                fontWeight: isDarkMode ? 600 : 'normal'
              }}>
                正在思考...
              </div>
            )}
            
            {error && (
              <div style={{
                alignSelf: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isDarkMode ? 'rgba(255, 77, 79, 0.2)' : 'rgba(255, 77, 79, 0.05)',
                color: themeStyles.errorText,
                border: '1px solid rgba(255, 77, 79, 0.3)',
                marginBottom: '16px',
                maxWidth: '90%',
                textAlign: 'center',
                textShadow: themeStyles.textShadow,
                fontWeight: isDarkMode ? 600 : 'normal'
              }}>
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* 常见问题 */}
          {messages.length <= 1 && (
            <div style={{
              padding: '12px 16px',
              borderTop: isDarkMode ? '1px solid #383838' : '1px solid #f0f0f0',
              background: themeStyles.contentBg
            }}>
              <div style={{ 
                fontSize: '14px', 
                marginBottom: '8px', 
                color: isDarkMode ? '#ffffff' : '#666',
                textShadow: themeStyles.textShadow,
                fontWeight: isDarkMode ? 600 : 'normal'
              }}>
                常见问题:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {commonQuestions.map((q, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectQuestion(q)}
                    className="suggestion-button"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      background: themeStyles.suggestionBg,
                      color: themeStyles.suggestionText,
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                      border: isDarkMode ? '1px solid #4a4a4a' : 'none',
                      textShadow: themeStyles.textShadow,
                      fontWeight: isDarkMode ? 600 : 'normal',
                    }}
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 输入区域 */}
          <div style={{
            padding: '12px 16px',
            borderTop: isDarkMode ? '1px solid #383838' : '1px solid #f0f0f0',
            background: themeStyles.inputAreaBg,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="输入问题..."
              className={`chat-input ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '20px',
                border: themeStyles.inputBorder,
                background: themeStyles.inputBg,
                color: themeStyles.inputText,
                outline: 'none',
                fontWeight: isDarkMode ? 600 : 'normal',
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="send-button"
              style={{
                background: themeStyles.sendButtonBg,
                color: themeStyles.sendButtonText,
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
                transition: 'all 0.3s',
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant; 