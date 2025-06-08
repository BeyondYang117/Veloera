import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/Theme';

const AdvantagesSection = styled.section`
  padding: 100px 0;
  background: var(--gradient-bg);
  position: relative;
  overflow: hidden;
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

const AdvantagesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
`;

const AdvantageItemContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.isDark ? '#2a2a2a' : 'white'};
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  &:nth-child(even) {
    flex-direction: row-reverse;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

const AdvantageContent = styled.div`
  flex: 1;
  padding: 40px;
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const AdvantageIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  &.blue {
    background: linear-gradient(135deg, #4cd2e4 0%, #5ce7fa 100%);
  }
  
  &.orange {
    background: linear-gradient(135deg, #ff6b4a 0%, #ff8e72 100%);
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
`;

const AdvantageTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const AdvantageDescription = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
`;

const AdvantagePoints = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AdvantagePoint = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    margin-right: 12px;
    flex-shrink: 0;
  }
`;

const AdvantageImage = styled.div`
  flex: 1;
  height: 350px;
  background-color: ${props => props.isDark ? '#3a3a3a' : '#f0f9ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.5;
  pointer-events: none;
`;

// 将使用Hook的部分提取为单独的组件
const AdvantageItem = ({ advantage, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const theme = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      <AdvantageItemContainer isDark={isDark}>
        <AdvantageContent>
          <AdvantageIcon className={advantage.color}>
            {advantage.icon}
          </AdvantageIcon>
          <AdvantageTitle>{advantage.title}</AdvantageTitle>
          <AdvantageDescription>{advantage.description}</AdvantageDescription>
          <AdvantagePoints>
            {advantage.points.map((point, i) => (
              <AdvantagePoint key={i}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke={advantage.color === 'blue' ? '#4cd2e4' : advantage.color === 'orange' ? '#ff6b4a' : advantage.color === 'purple' ? '#7c5cff' : '#4caf50'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {point}
              </AdvantagePoint>
            ))}
          </AdvantagePoints>
        </AdvantageContent>
        <AdvantageImage isDark={isDark}>
          <img src={advantage.image} alt={advantage.title} />
        </AdvantageImage>
      </AdvantageItemContainer>
    </motion.div>
  );
};

const Advantages = () => {
  const advantages = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14M5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "专业API",
      description: "我们提供专业的API服务，支持多种AI模型，满足不同场景的需求。",
      points: [
        "100%兼容OpenAI官方接口格式，无需改动代码",
        "支持多种模型，包括OpenAI、Claude、通义千问等",
        "提供丰富的API文档和示例代码"
      ],
      image: "https://placehold.co/600x400/e6f7ff/4cd2e4?text=API+Interface",
      color: "blue"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "高质量服务",
      description: "我们提供高质量的服务，保证API的稳定性和可靠性。",
      points: [
        "采用分布式架构，保证服务的高可用性",
        "全球多节点部署，提供低延迟的访问体验",
        "7*24小时技术支持，快速响应用户需求"
      ],
      image: "https://placehold.co/600x400/fff5e6/ffc107?text=High+Quality+Service",
      color: "orange"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 14L4 9L9 4M15 4L20 9L15 14M13 5L11 19M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "高效开发",
      description: "我们提供丰富的开发工具和资源，帮助开发者快速集成和使用AI能力。",
      points: [
        "提供多种编程语言的SDK，简化开发流程",
        "丰富的示例代码和教程，快速上手",
        "完善的开发者社区，分享最佳实践"
      ],
      image: "https://placehold.co/600x400/f0f0ff/7c5cff?text=Developer+Tools",
      color: "purple"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10H21M7 15H8M12 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "透明计费",
      description: "我们提供透明的计费方式，按实际使用量计费，无隐藏费用。",
      points: [
        "按Token计费，价格透明，无隐藏费用",
        "支持多种充值方式，满足不同用户需求",
        "提供详细的使用记录和账单，方便核对"
      ],
      image: "https://placehold.co/600x400/f0fff0/4caf50?text=Billing+System",
      color: "green"
    }
  ];
  
  return (
    <AdvantagesSection>
      <Container>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle>我们的优势</SectionTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionSubtitle>
              我们致力于提供最优质的AI接口聚合服务，让您的AI应用开发更加便捷高效。
            </SectionSubtitle>
          </motion.div>
        </SectionHeader>
        
        <AdvantagesList>
          {advantages.map((advantage, index) => (
            <AdvantageItem 
              key={index} 
              advantage={advantage} 
              index={index} 
            />
          ))}
        </AdvantagesList>
      </Container>
    </AdvantagesSection>
  );
};

export default Advantages;
