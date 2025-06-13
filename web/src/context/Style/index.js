// contexts/User/index.jsx

import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

// 创建样式上下文
export const StyleContext = createContext();

// 初始状态
const initialState = {
  // 是否显示侧边栏 - 默认显示，不依赖localStorage
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
      try {
        // 如果设置为显示，保存到localStorage
        if (action.payload === true) {
          localStorage.setItem('forceShowSider', 'true');
        } else if (action.payload === false) {
          localStorage.removeItem('forceShowSider');
        }
      } catch (e) {
        console.log('localStorage error:', e);
      }
      return { ...state, showSider: action.payload };
    // 设置侧边栏折叠状态
    case 'SET_SIDER_COLLAPSED':
      try {
        localStorage.setItem('default_collapse_sidebar', action.payload);
      } catch (e) {
        console.log('localStorage error:', e);
      }
      return { ...state, siderCollapsed: action.payload };
    // 设置是否为移动设备
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload };
    // 设置是否应该内边距
    case 'SET_INNER_PADDING':
      return { ...state, shouldInnerPadding: action.payload };
    default:
      return state;
  }
};

// 样式上下文提供者
export const StyleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(styleReducer, initialState);
  const location = useLocation();

  // 需要隐藏侧边栏的路径
  const hideSiderPaths = ['/login', '/register', '/404', '/chat', '/home', '/playground'];
  
  // 需要强制显示侧边栏的路径
  const forceSiderPaths = ['/detail', '/user', '/channel', '/token', '/redemption', '/topup', '/log', '/midjourney', '/task', '/setting'];

  useEffect(() => {
    // 监听窗口大小变化
    const handleResize = () => {
      dispatch({ type: 'SET_IS_MOBILE', payload: window.innerWidth <= 768 });
    };
    window.addEventListener('resize', handleResize);

    // 根据当前路径决定是否显示侧边栏
    const currentPath = location.pathname;
    
    // 如果当前路径需要隐藏侧边栏，则强制隐藏
    if (hideSiderPaths.some(path => currentPath.startsWith(path))) {
      dispatch({ type: 'SET_SIDER', payload: false });
      dispatch({ type: 'SET_INNER_PADDING', payload: false });
      try {
        localStorage.removeItem('forceShowSider');
      } catch (e) {
        console.log('localStorage error:', e);
      }
    } 
    // 如果当前路径需要强制显示侧边栏，则强制显示
    else if (forceSiderPaths.some(path => currentPath.startsWith(path))) {
      dispatch({ type: 'SET_SIDER', payload: true });
      dispatch({ type: 'SET_INNER_PADDING', payload: true });
      try {
        localStorage.setItem('forceShowSider', 'true');
      } catch (e) {
        console.log('localStorage error:', e);
      }
    }
    // 其他情况，根据localStorage决定
    else {
      try {
        const forceShowSider = localStorage.getItem('forceShowSider') === 'true';
        if (forceShowSider) {
          dispatch({ type: 'SET_SIDER', payload: true });
        }
      } catch (e) {
        console.log('localStorage error:', e);
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  return (
    <StyleContext.Provider value={[state, dispatch]}>
      {children}
    </StyleContext.Provider>
  );
};

// 自定义hook，用于获取样式上下文
export const useStyle = () => {
  return useContext(StyleContext);
};
