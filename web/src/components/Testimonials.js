import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Typography, Avatar, Card, Space, Row, Col } from '@douyinfe/semi-ui';
import { getSystemName } from '../helpers';
import { useTheme } from '../context/Theme';

const TestimonialsSection = styled.section`
  padding: 80px 0;
  background-color: var(--card-bg);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
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
  margin: 0 auto 40px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const TestimonialsContainer = styled.div`
  position: relative;
  max-width: 100%;
  overflow: hidden;
  padding: 20px 0;
`;

const TestimonialsTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
`;

const TestimonialCard = styled(motion.div)`
  flex: 0 0 auto;
  width: 350px;
  margin: 0 15px;
  padding: 25px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  text-align: left;
  border: ${props => props.isDarkMode ? '1px solid #383838' : 'none'};
  
  @media (max-width: 768px) {
    width: 280px;
  }
`;

const TestimonialContent = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 20px;
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CustomerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CustomerInitial = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), #ff8e72);
  color: white;
  font-weight: 600;
  font-size: 20px;
`;

const CustomerDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomerName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-color);
`;

const CustomerCompany = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
`;

const Rating = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  svg {
    width: 18px;
    height: 18px;
    margin-right: 2px;
    color: #FFD700;
  }
`;

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
  </svg>
);

const Testimonials = () => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const systemName = getSystemName();
  const theme = useTheme();
  const isDarkMode = theme === 'dark';
  
  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;
    
    const track = trackRef.current;
    const container = containerRef.current;
    
    // 复制评价卡片以实现无限滚动效果
    const clonedItems = [...track.children].map(item => item.cloneNode(true));
    clonedItems.forEach(item => {
      track.appendChild(item);
    });
    
    let animationId;
    let currentPosition = 0;
    let speed = 0.5; // 滚动速度
    
    const animate = () => {
      currentPosition -= speed;
      
      // 当滚动到一半时，重置位置以实现无限滚动
      if (currentPosition <= -(track.scrollWidth / 2)) {
        currentPosition = 0;
      }
      
      track.style.transform = `translateX(${currentPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    // 鼠标悬停时暂停滚动
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };
    
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };
    
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // 用户评价数据
  const testimonials = [
    {
      content: `${systemName}的API接口非常稳定，为我们的聊天机器人提供了强大的支持。我们能够轻松集成，快速上线产品。`,
      name: "张先生",
      company: "某科技公司CTO",
      avatar: null,
      rating: 5
    },
    {
      content: `使用${systemName}帮助我们降低了AI成本，同时提高了响应速度。客户支持也非常到位，遇到问题总是能够及时解决。`,
      name: "李女士",
      company: "创业公司创始人",
      avatar: null,
      rating: 5
    },
    {
      content: `我们在开发教育应用时使用了${systemName}的API，其准确性和稳定性给我们留下了深刻的印象。强烈推荐！`,
      name: "王先生",
      company: "教育科技公司产品经理",
      avatar: null,
      rating: 5
    },
    {
      content: `${systemName}的价格非常透明，没有隐藏费用，这让我们的成本预算更加准确。团队也非常专业，提供了详细的技术支持。`,
      name: "赵女士",
      company: "金融科技公司技术总监",
      avatar: null,
      rating: 5
    },
    {
      content: `作为一个小型开发团队，我们非常感谢${systemName}提供的稳定API服务，它帮助我们快速构建了几个AI驱动的应用。`,
      name: "陈先生",
      company: "独立开发者",
      avatar: null,
      rating: 5
    }
  ];
  
  return (
    <TestimonialsSection className="TestimonialsSection">
      <Container>
        <SectionTitle>用户评价</SectionTitle>
        <SectionSubtitle>来自各行各业用户的真实评价，他们正在使用我们的API构建令人惊叹的应用</SectionSubtitle>
        
        <TestimonialsContainer ref={containerRef}>
          <TestimonialsTrack ref={trackRef}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} isDarkMode={isDarkMode}>
                <Rating>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </Rating>
                <TestimonialContent>{testimonial.content}</TestimonialContent>
                <CustomerInfo>
                  <CustomerAvatar>
                    {testimonial.avatar ? (
                      <img src={testimonial.avatar} alt={`${testimonial.name} avatar`} />
                    ) : (
                      <CustomerInitial>{testimonial.name[0]}</CustomerInitial>
                    )}
                  </CustomerAvatar>
                  <CustomerDetails>
                    <CustomerName>{testimonial.name}</CustomerName>
                    <CustomerCompany>{testimonial.company}</CustomerCompany>
                  </CustomerDetails>
                </CustomerInfo>
              </TestimonialCard>
            ))}
          </TestimonialsTrack>
        </TestimonialsContainer>
      </Container>
    </TestimonialsSection>
  );
};

export default Testimonials;
