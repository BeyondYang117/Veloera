import React, { useEffect, useContext, useState } from 'react';
import { StyleContext } from '../../context/Style';
import { StatusContext } from '../../context/Status';
import { getSystemName } from '../../helpers';
import { useTheme } from '../../context/Theme';
import { Navigate } from 'react-router-dom';

const Docs = () => {
  const systemName = getSystemName();
  const theme = useTheme();
  const isDarkMode = theme === 'dark';
  const [styleState, styleDispatch] = useContext(StyleContext);
  const [statusState] = useContext(StatusContext);
  const [isLoading, setIsLoading] = useState(true);
  
  // 安全地获取docs_link，确保statusState和status都存在
  const docsLink = React.useMemo(() => {
    if (statusState && statusState.status && statusState.status.docs_link) {
      return statusState.status.docs_link;
    }
    return '';
  }, [statusState]);

  // 强制设置全屏显示
  useEffect(() => {
    // 隐藏侧边栏，实现全屏显示
    if (styleDispatch) {
      styleDispatch({ type: 'SET_SIDER', payload: false });
    }
    
    // 设置页面标题
    if (systemName) {
      document.title = `文档 - ${systemName}`;
    }
    
    // 设置加载状态
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // 组件卸载时的清理函数
    return () => {
      clearTimeout(timer);
    };
  }, [systemName, styleDispatch]);

  // 如果正在加载状态信息，显示加载界面
  if (isLoading || !statusState) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #202124 0%, #1a1a1a 100%)' 
          : 'linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%)',
        color: isDarkMode ? '#ffffff' : '#202124',
        fontSize: '18px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}>
        <span>加载中...</span>
      </div>
    );
  }

  // 如果没有docs_link配置，重定向到首页
  if (!docsLink) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #202124 0%, #1a1a1a 100%)' 
        : 'linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%)',
      margin: 0,
      padding: 0,
    }}>
      <iframe
        src={docsLink}
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          borderRadius: '0',
          background: 'transparent',
        }}
        title="文档"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
        loading="lazy"
      />
    </div>
  );
};

export default Docs; 