import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SupportSection = styled.section`
  padding: 80px 0;
  background-color: white;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SupportTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SupportSubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 40px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SupportButton = styled(motion.button)`
  padding: 16px 32px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 18px;
  background: linear-gradient(90deg, var(--primary-color), #ff8e72);
  color: white;
  box-shadow: 0 8px 20px rgba(255, 107, 74, 0.3);
  transition: all 0.3s ease;
  margin-top: 20px;
  border: none;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(255, 107, 74, 0.4);
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 14px 28px;
  }
`;

const Support = () => {
  return (
    <SupportSection>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SupportTitle>24/7/365 全天候支持</SupportTitle>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SupportSubtitle>
            我们的技术支持团队全天候待命，随时为您解决问题，确保您的AI应用顺利运行。
          </SupportSubtitle>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SupportTitle>我们时刻陪伴您</SupportTitle>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <SupportButton>联系我们</SupportButton>
          </Link>
        </motion.div>
      </Container>
    </SupportSection>
  );
};

export default Support;
