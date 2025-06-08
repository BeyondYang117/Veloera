import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import DashboardCarousel from './DashboardCarousel';
import TechImagesCarousel from './TechImagesCarousel';
import { API, getSystemName } from '../helpers';

const HeroSection = styled.section`
  padding-top: 60px;
  padding-bottom: 80px;
  background: var(--gradient-bg);
  position: relative;
  overflow: hidden;
`;

// 移除之前的卡片样式，使用TechImagesCarousel组件

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 600px;
  z-index: 1;
  
  @media (max-width: 992px) {
    margin-bottom: 40px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 30px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(90deg, var(--primary-color), #ff8e72);
    color: white;
    box-shadow: 0 8px 20px rgba(255, 107, 74, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(255, 107, 74, 0.4);
    }
  }
  
  &.secondary {
    background: white;
    color: var(--text-color);
    border: 1px solid #e0e0e0;
    
    &:hover {
      transform: translateY(-3px);
      border-color: var(--primary-color);
      color: var(--primary-color);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
    }
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.5;
  pointer-events: none;
`;

const Circle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(76, 210, 228, 0.2), rgba(76, 210, 228, 0.05));
  
  &.circle1 {
    width: 300px;
    height: 300px;
    top: -100px;
    right: 10%;
  }
  
  &.circle2 {
    width: 200px;
    height: 200px;
    bottom: 10%;
    right: 20%;
  }
  
  &.circle3 {
    width: 150px;
    height: 150px;
    top: 30%;
    left: 10%;
    background: linear-gradient(135deg, rgba(255, 107, 74, 0.1), rgba(255, 107, 74, 0.05));
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 40px;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
`;

const StatItem = styled.div`
  .number {
    font-size: 36px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 5px;
  }
  
  .label {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;

// 添加文档页面样式
const DocsPageContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-bg);
  z-index: 10000;
  display: flex;
  flex-direction: column;
`;

const DocsHeader = styled.div`
  background: white;
  padding: 20px 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const DocsTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: "📚";
    font-size: 28px;
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color), #ff8e72);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 74, 0.3);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const DocsContent = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
`;

const DocsIframeContainer = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 16px;
  }
`;

const Hero = () => {
  const [serverAddress, setServerAddress] = useState('');
  const [docsLink, setDocsLink] = useState('');
  const [showDocsPage, setShowDocsPage] = useState(false);
  const systemName = getSystemName();

  // 获取系统配置
  useEffect(() => {
    const fetchSystemConfig = async () => {
      try {
        const res = await API.get('/api/status');
        const { success, data } = res.data;
        if (success) {
          // 获取服务器地址
          const address = data.server_address || window.location.origin;
          setServerAddress(address);
          
          // 获取文档链接
          const docs = data.docs_link || '';
          setDocsLink(docs);
        }
      } catch (error) {
        console.error('获取系统配置失败:', error);
        // 使用默认值
        setServerAddress(window.location.origin);
      }
    };

    fetchSystemConfig();
  }, []);

  // 处理注册按钮点击
  const handleRegisterClick = () => {
    const registerUrl = `${serverAddress}/register`;
    window.location.href = registerUrl;
  };

  // 处理文档按钮点击
  const handleDocsClick = () => {
    if (docsLink) {
      setShowDocsPage(true);
    } else {
      // 如果没有配置文档链接，使用默认链接
      window.open(`${serverAddress}/doc`, '_blank');
    }
  };

  // 返回首页
  const backToHome = () => {
    setShowDocsPage(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!showDocsPage ? (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection>
              <TechImagesCarousel />
              
              <BackgroundDecoration>
                <Circle 
                  className="circle1" 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
                <Circle 
                  className="circle2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                />
                <Circle 
                  className="circle3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                />
              </BackgroundDecoration>
              
              <HeroContainer>
                <HeroContent>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <HeroTitle>
                      智能API<br />
                      <span className="gradient-text">整合平台</span>
                    </HeroTitle>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <HeroSubtitle>
                      提供高效、稳定的AI接口整合方案。支持多种主流AI模型，包括OpenAI、Claude、通义千问等，适用于企业级应用和个人开发项目。
                    </HeroSubtitle>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <ButtonGroup>
                      <Button className="primary" onClick={handleRegisterClick}>免费注册</Button>
                      <Button className="secondary" onClick={handleDocsClick}>API文档</Button>
                    </ButtonGroup>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Stats>
                      <StatItem>
                        <div className="number">450+</div>
                        <div className="label">支持的AI模型</div>
                      </StatItem>
                      <StatItem>
                        <div className="number">99.9%</div>
                        <div className="label">服务可用性</div>
                      </StatItem>
                      <StatItem>
                        <div className="number">10000+</div>
                        <div className="label">活跃用户</div>
                      </StatItem>
                    </Stats>
                  </motion.div>
                </HeroContent>
                
                <HeroImage>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <DashboardCarousel />
                  </motion.div>
                </HeroImage>
              </HeroContainer>
            </HeroSection>
          </motion.div>
        ) : (
          <DocsPageContainer
            key="docspage"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <DocsHeader>
              <DocsTitle>{systemName} API 开发文档</DocsTitle>
              <BackButton onClick={backToHome}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                返回首页
              </BackButton>
            </DocsHeader>
            <DocsContent>
              <DocsIframeContainer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <iframe
                  src={docsLink}
                  title="API文档"
                  loading="lazy"
                />
              </DocsIframeContainer>
            </DocsContent>
          </DocsPageContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Hero;
