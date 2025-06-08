import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/Theme';

const FeaturesSection = styled.section`
  padding: 100px 0;
  background-color: var(--card-bg);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: var(--card-bg);
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--card-shadow);
  transition: var(--transition);
  height: 100%;
  border: ${props => props.isDarkMode ? '1px solid #383838' : 'none'};
  
  &:hover {
    box-shadow: var(--card-hover-shadow);
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  &.orange {
    background: linear-gradient(135deg, #ff6b4a 0%, #ff8e72 100%);
  }
  
  &.blue {
    background: linear-gradient(135deg, #4cd2e4 0%, #5ce7fa 100%);
  }
  
  &.purple {
    background: linear-gradient(135deg, #7c5cff 0%, #9b83ff 100%);
  }
  
  &.green {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  }
  
  &.yellow {
    background: linear-gradient(135deg, #ffc107 0%, #ffd54f 100%);
  }
  
  &.pink {
    background: linear-gradient(135deg, #ec407a 0%, #f48fb1 100%);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
`;

// 将使用Hook的部分提取为单独的组件
const FeatureItem = ({ feature, index, variants, isDarkMode }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <FeatureCard isDarkMode={isDarkMode}>
        <FeatureIcon className={feature.color}>
          {feature.icon}
        </FeatureIcon>
        <FeatureTitle>{feature.title}</FeatureTitle>
        <FeatureDescription>{feature.description}</FeatureDescription>
      </FeatureCard>
    </motion.div>
  );
};

const Features = () => {
  const theme = useTheme();
  const isDarkMode = theme === 'dark';
  
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
      }
    })
  };
  
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2"/>
          <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "标准接口",
      description: "提供标准的RESTful API接口，与OpenAI接口格式兼容，便于开发者快速集成和使用。",
      color: "orange"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9L12 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="white" strokeWidth="2"/>
        </svg>
      ),
      title: "产品丰富",
      description: "支持OpenAI、Claude、通义千问等多种AI模型，满足不同场景的需求。",
      color: "blue"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16.01L12.01 15.9989" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12.01L12.01 11.9989" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8.01L12.01 7.99889" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
        </svg>
      ),
      title: "透明计费",
      description: "按实际使用量计费，价格透明，无隐藏费用，支持多种充值方式。",
      color: "purple"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
        </svg>
      ),
      title: "高可用性",
      description: "提供稳定、高可用的服务，确保您的应用随时可用。",
      color: "green"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <rect x="5" y="10" width="14" height="11" rx="2" stroke="white" strokeWidth="2"/>
          <path d="M12 16V15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "安全保障",
      description: "采用业界领先的安全技术，保障您的数据和隐私安全。",
      color: "yellow"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="6" width="12" height="12" rx="2" stroke="white" strokeWidth="2"/>
        </svg>
      ),
      title: "实时响应",
      description: "毫秒级响应速度，为您的应用提供流畅的用户体验。",
      color: "pink"
    }
  ];
  
  return (
    <FeaturesSection className="FeaturesSection">
      <Container>
        <SectionHeader>
          <SectionTitle>功能特性</SectionTitle>
          <SectionSubtitle>我们提供了一系列强大的功能，帮助您轻松构建智能应用</SectionSubtitle>
        </SectionHeader>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureItem 
              key={index} 
              feature={feature} 
              index={index}
              variants={featureVariants}
              isDarkMode={isDarkMode}
            />
          ))}
        </FeaturesGrid>
      </Container>
    </FeaturesSection>
  );
};

export default Features;
