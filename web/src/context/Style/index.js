// contexts/User/index.jsx

import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

// 创建样式上下文
export const StyleContext = createContext();

// 初始状态
const initialState = {
  // 是否显示侧边栏
  showSider: true,
  // 侧边栏是否折叠
  siderCollapsed: localStorage.getItem('default_collapse_sidebar') === 'true',
  // 是否为移动设备
  isMobile: window.innerWidth <= 768,
  // 是否应该内边距
  shouldInnerPadding: true,
};

// 样式reducer
const styleReducer = (state, action) => {
  switch (action.type) {
    // 设置侧边栏显示状态
    case 'SET_SIDER':
      return { ...state, showSider: action.payload };
    // 设置侧边栏折叠状态
    case 'SET_SIDER_COLLAPSED':
      localStorage.setItem('default_collapse_sidebar', action.payload);
      return { ...state, siderCollapsed: action.payload };
    // 设置移动设备状态
    case 'SET_MOBILE':
      return { ...state, isMobile: action.payload };
    // 设置内边距状态
    case 'SET_INNER_PADDING':
      return { ...state, shouldInnerPadding: action.payload };
    default:
      return state;
  }
};

// 样式提供者组件
export const StyleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(styleReducer, initialState);
  const location = useLocation();
  const { pathname } = location;

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      dispatch({ type: 'SET_MOBILE', payload: isMobile });
      
      // 如果是移动设备，自动折叠侧边栏
      if (isMobile && state.showSider) {
        dispatch({ type: 'SET_SIDER_COLLAPSED', payload: true });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [state.showSider]);

  // 根据路由路径决定是否显示侧边栏
  useEffect(() => {
    // 不需要显示侧边栏的路径
    const noSiderPaths = ['/', '/login', '/register', '/reset', '/oauth', '/setup', '/contact', '/docs'];
    
    // 检查当前路径是否在noSiderPaths中
    const shouldHideSider = noSiderPaths.some(path => pathname.startsWith(path));
    
    if (shouldHideSider) {
      dispatch({ type: 'SET_SIDER', payload: false });
    } else {
      // 如果不是移动设备，则显示侧边栏
      dispatch({ type: 'SET_SIDER', payload: !state.isMobile || pathname === '/chat' });
    }
    
    // 设置内边距状态
    const noPaddingPaths = ['/chat'];
    const shouldHavePadding = !noPaddingPaths.some(path => pathname.startsWith(path));
    dispatch({ type: 'SET_INNER_PADDING', payload: shouldHavePadding });
    
  }, [pathname, state.isMobile]);

  return (
    <StyleContext.Provider value={[state, dispatch]}>
      {children}
    </StyleContext.Provider>
  );
};

// 自定义hook，用于获取样式上下文
export const useStyle = () => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
};
