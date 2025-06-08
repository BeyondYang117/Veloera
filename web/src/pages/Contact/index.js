import React, { useEffect, useContext } from 'react';
import { getSystemName } from '../../helpers';
import { useTheme } from '../../context/Theme';
import { StyleContext } from '../../context/Style';
import '../../index.css';

const Contact = () => {
  const systemName = getSystemName();
  const theme = useTheme();
  const isDarkMode = theme === 'dark';
  const [styleState, styleDispatch] = useContext(StyleContext);

  // 组件挂载后执行初始化
  useEffect(() => {
    // 确保页面已加载完成
    document.title = `联系我们 - ${systemName}`;
    
    // 强制隐藏侧边栏，实现全屏显示
    styleDispatch({ type: 'SET_SIDER', payload: false });
    
    // 组件卸载时的清理函数
    return () => {
      // 可以在这里重置侧边栏状态，如果需要的话
    };
  }, [systemName, styleDispatch]);

  // 复制QQ号到剪贴板
  const copyQQ = () => {
    const qq = '87448221';
    copyToClipboard(qq, 'QQ号已复制到剪贴板！');
  };

  // 复制邮箱到剪贴板
  const copyEmail = () => {
    const email = 'support@bigaipro.com';
    copyToClipboard(email, '邮箱地址已复制到剪贴板！');
  };

  // 通用复制功能
  const copyToClipboard = (text, successMessage) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showSuccessMessage(successMessage);
        })
        .catch(() => {
          if (fallbackCopyTextToClipboard(text)) {
            showSuccessMessage(successMessage);
          } else {
            alert('复制失败，请手动复制');
          }
        });
    } else {
      if (fallbackCopyTextToClipboard(text)) {
        showSuccessMessage(successMessage);
      } else {
        alert('复制失败，请手动复制');
      }
    }
  };

  // 备用复制方法
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (!successful) throw new Error('复制失败');
      return true;
    } catch (err) {
      console.error('复制失败:', err);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // 显示成功信息
  const showSuccessMessage = (message) => {
    // 创建或获取提示元素
    let successMsg = document.getElementById('copySuccess');
    if (!successMsg) {
      successMsg = document.createElement('div');
      successMsg.id = 'copySuccess';
      successMsg.style.position = 'fixed';
      successMsg.style.top = '20px';
      successMsg.style.right = '20px';
      successMsg.style.background = '#4caf50';
      successMsg.style.color = 'white';
      successMsg.style.padding = '10px 20px';
      successMsg.style.borderRadius = '5px';
      successMsg.style.zIndex = '1000';
      document.body.appendChild(successMsg);
    }

    successMsg.textContent = message;
    successMsg.style.display = 'block';
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 2000);
  };

  // 基于主题调整样式
  const themeStyles = {
    rootStyle: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: 1.6,
      color: isDarkMode ? '#ffffff' : '#202124',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #202124 0%, #1a1a1a 100%)' 
        : 'linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      margin: 0,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    container: {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: '40px',
      background: isDarkMode ? '#2d2d2d' : '#ffffff',
      borderRadius: '16px',
      boxShadow: isDarkMode 
        ? '0 8px 30px rgba(0, 0, 0, 0.3)' 
        : '0 8px 30px rgba(26, 115, 232, 0.1)',
      position: 'relative',
      overflow: 'hidden',
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginTop: '40px',
    },
    contactCard: {
      background: isDarkMode ? '#2d2d2d' : '#ffffff',
      borderRadius: '16px',
      padding: '30px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: isDarkMode 
        ? '1px solid rgba(255, 255, 255, 0.1)' 
        : '1px solid rgba(26, 115, 232, 0.1)',
      position: 'relative',
    },
    cardTitle: {
      fontSize: '20px',
      color: '#1a73e8',
      marginBottom: '20px',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    qrWrapper: {
      width: '220px',
      height: '220px',
      margin: '0 auto 20px',
      padding: '10px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    },
    qrImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      borderRadius: '8px',
    },
    description: {
      color: isDarkMode ? '#9aa0a6' : '#5f6368',
      fontSize: '15px',
      marginTop: '15px',
      lineHeight: 1.6,
    },
    tags: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '15px',
      flexWrap: 'wrap',
    },
    tag: {
      background: isDarkMode ? 'rgba(26, 115, 232, 0.1)' : '#e8f0fe',
      color: '#1a73e8',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 500,
    },
    qqButton: {
      background: '#1a73e8',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '15px',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      marginBottom: '15px',
    },
    qqInfo: {
      margin: '15px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      color: '#1a73e8',
      fontSize: '16px',
    },
    copyButton: {
      background: '#1a73e8',
      color: 'white',
      border: 'none',
      padding: '5px 12px',
      borderRadius: '15px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    },
    emailIcon: {
      fontSize: '64px',
      color: '#1a73e8',
      marginBottom: '20px',
    },
    emailAddress: {
      fontSize: '18px',
      color: '#1a73e8',
      margin: '15px 0',
      wordBreak: 'break-all',
    },
    brandTitle: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    brandLogo: {
      fontSize: '32px',
      fontWeight: 700,
      color: '#1a73e8',
      marginBottom: '10px',
      letterSpacing: '-0.5px',
    },
    brandSubtitle: {
      fontSize: '16px',
      color: isDarkMode ? '#9aa0a6' : '#5f6368',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.6,
    },
  };

  return (
    <div style={themeStyles.rootStyle}>
      <div style={themeStyles.container}>
        <div style={themeStyles.brandTitle}>
          <div style={themeStyles.brandLogo}>{systemName} API</div>
          <p style={themeStyles.brandSubtitle}>高效可靠的API转发服务，为您提供专业稳定的技术支持</p>
        </div>
        
        <div style={themeStyles.contactGrid}>
          {/* QQ交流群 */}
          <div style={themeStyles.contactCard}>
            <h2 style={themeStyles.cardTitle}>
              <i className="fab fa-qq"></i>QQ交流群
            </h2>
            <div style={themeStyles.qrWrapper}>
              <img 
                src="/contact-qr.png" 
                alt="QQ群二维码" 
                style={themeStyles.qrImage}
                loading="lazy"
              />
            </div>
            <p style={themeStyles.description}>加入我们的技术交流群，与开发者共同探讨</p>
            <a 
              href="https://qm.qq.com/q/LhNaE5GskQ" 
              target="_blank" 
              rel="noopener noreferrer"
              style={themeStyles.qqButton}
            >
              <i className="fab fa-qq"></i>点击加入QQ群
            </a>
            <div style={themeStyles.tags}>
              <span style={themeStyles.tag}>技术交流</span>
              <span style={themeStyles.tag}>问题解答</span>
              <span style={themeStyles.tag}>资源共享</span>
            </div>
          </div>
          
          {/* 客服咨询 */}
          <div style={themeStyles.contactCard}>
            <h2 style={themeStyles.cardTitle}>
              <i className="fas fa-headset"></i>客服咨询
            </h2>
            <div style={themeStyles.qrWrapper}>
              <img 
                src="/contact-qr.png" 
                alt="客服二维码" 
                style={themeStyles.qrImage}
                loading="lazy"
              />
            </div>
            <p style={themeStyles.description}>专业的客服团队，为您提供贴心服务</p>
            <div style={themeStyles.qqInfo}>
              <span>客服QQ：87448221</span>
              <button style={themeStyles.copyButton} onClick={copyQQ}>
                <i className="fas fa-copy"></i>复制
              </button>
            </div>
            <div style={themeStyles.tags}>
              <span style={themeStyles.tag}>快速响应</span>
              <span style={themeStyles.tag}>专业解答</span>
              <span style={themeStyles.tag}>7×24小时</span>
            </div>
          </div>
          
          {/* 邮件联系 */}
          <div style={themeStyles.contactCard}>
            <h2 style={themeStyles.cardTitle}>
              <i className="fas fa-envelope"></i>邮件联系
            </h2>
            <i className="fas fa-envelope" style={themeStyles.emailIcon}></i>
            <p style={themeStyles.description}>发送邮件给我们</p>
            <div style={themeStyles.emailAddress}>support@bigaipro.com</div>
            <button style={themeStyles.qqButton} onClick={copyEmail}>
              <i className="fas fa-copy"></i>复制邮箱地址
            </button>
            <div style={themeStyles.tags}>
              <span style={themeStyles.tag}>商务合作</span>
              <span style={themeStyles.tag}>技术支持</span>
              <span style={themeStyles.tag}>建议反馈</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 