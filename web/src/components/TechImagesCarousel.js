import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// 科技感和未来感的AI图片URLs - 使用更可靠的图片源
const aiImages = [
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1965&q=80', // 蓝色数字网络
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // 人工智能芯片
  'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', // 机器人手
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1806&q=80', // 虚拟现实
  'https://images.unsplash.com/photo-1558346547-4439467bd1d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // 科技网格
];

const CarouselContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 170px;
  z-index: 10;
  width: 380px;
  height: 480px;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const ImageWrapper = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Caption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  
  h3 {
    font-size: 22px;
    margin: 0 0 10px 0;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: 16px;
    margin: 0;
    opacity: 0.9;
    line-height: 1.4;
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: flex;
  gap: 8px;
  z-index: 20;
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: white;
  }
`;

// 图片对应的说明文本
const captions = [
  {
    title: '智能网络',
    description: '连接无限可能的AI神经网络'
  },
  {
    title: '量子计算',
    description: '突破性能极限的AI处理技术'
  },
  {
    title: '人机协作',
    description: '无缝融合的智能交互体验'
  },
  {
    title: '沉浸体验',
    description: '虚拟与现实的智能边界'
  },
  {
    title: '未来科技',
    description: '引领创新的前沿技术'
  }
];

const TechImagesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % aiImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 手动切换到指定图片
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 300 : -300,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0
      };
    }
  };

  return (
    <CarouselContainer>
      <AnimatePresence initial={false} custom={1}>
        <ImageWrapper
          key={currentIndex}
          custom={1}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          <Image src={aiImages[currentIndex]} alt={captions[currentIndex].title} />
          <Caption>
            <h3>{captions[currentIndex].title}</h3>
            <p>{captions[currentIndex].description}</p>
          </Caption>
        </ImageWrapper>
      </AnimatePresence>
      
      <Indicators>
        {aiImages.map((_, index) => (
          <Indicator 
            key={index} 
            active={currentIndex === index} 
            onClick={() => goToSlide(index)}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
};

export default TechImagesCarousel;
