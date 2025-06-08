import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CarouselContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SlideImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  max-width: 80%;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 10;
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: white;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

// 轮播图数据
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    title: '智能数据分析',
    subtitle: '实时处理海量数据，提供深度洞察和预测分析'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1677442135136-760c813028c0',
    title: '自然语言处理',
    subtitle: '理解人类语言，实现智能对话和内容生成'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
    title: '计算机视觉',
    subtitle: '图像识别和分析，让机器理解视觉世界'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a',
    title: '智能决策系统',
    subtitle: '基于AI的智能决策支持，优化业务流程'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c',
    title: '未来智能交互',
    subtitle: '创新的人机交互方式，打造沉浸式体验'
  }
];

const DashboardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  
  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex(prevIndex => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };
  
  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };
  
  return (
    <CarouselContainer>
      <AnimatePresence initial={false} custom={direction}>
        <SlideImage
          key={currentIndex}
          src={`${slides[currentIndex].image}?auto=format&fit=crop&w=800&q=80`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        />
      </AnimatePresence>
      
      <OverlayText>
        <Title>{slides[currentIndex].title}</Title>
        <Subtitle>{slides[currentIndex].subtitle}</Subtitle>
      </OverlayText>
      
      <ArrowButton className="prev" onClick={prevSlide}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </ArrowButton>
      
      <ArrowButton className="next" onClick={nextSlide}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </ArrowButton>
      
      <DotsContainer>
        {slides.map((_, index) => (
          <Dot 
            key={index} 
            active={index === currentIndex} 
            onClick={() => goToSlide(index)}
          />
        ))}
      </DotsContainer>
    </CarouselContainer>
  );
};

export default DashboardCarousel;
