import React, { useEffect, useContext } from 'react';
import { StyleContext } from '../../context/Style';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import Testimonials from '../../components/Testimonials';
import Advantages from '../../components/Advantages';
import Support from '../../components/Support';
import AiAssistant from '../../components/AiAssistant';

const Home = () => {
  const [styleState, styleDispatch] = useContext(StyleContext);
  
  // 强制设置全屏显示
  useEffect(() => {
    // 隐藏侧边栏，实现全屏显示
    styleDispatch({ type: 'SET_SIDER', payload: false });
    
    // 组件卸载时的清理函数
    return () => {
      // 可以在这里重置侧边栏状态，如果需要的话
    };
  }, [styleDispatch]);
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Hero />
      <Features />
      <Testimonials />
      <Advantages />
      <Support />

      {/* AI助手组件 */}
      <AiAssistant />
    </div>
  );
};

export default Home;
