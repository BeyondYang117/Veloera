import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@douyinfe/semi-ui';
import { getSystemName, getLogo } from '../helpers';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  background-color: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  box-shadow: ${props => props.scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 24px;
  color: var(--primary-color);
  
  span {
    margin-left: 8px;
  }
  
  .beta {
    font-size: 12px;
    background: linear-gradient(90deg, #ff6b4a, #ff8e72);
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 8px;
    font-weight: 500;
  }
`;

const LogoText = styled.span`
  margin-left: 8px;
`;

const Nav = styled.nav`
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 30px;
`;

const NavItem = styled.li`
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(90deg, var(--primary-color), #ff8e72);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 74, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 74, 0.4);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--text-color);
    border: 1px solid #e0e0e0;
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-right: 15px;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #4cd137;
    margin-right: 6px;
  }
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const LanguageSelector = styled.div`
  position: relative;
  margin-right: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  .current-lang {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--text-color);
  }
  
  .flag {
    width: 20px;
    height: 14px;
    margin-right: 6px;
    border-radius: 2px;
  }
  
  svg {
    width: 12px;
    height: 12px;
    margin-left: 4px;
  }
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 15px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--text-color);
  }
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const systemName = getSystemName();
  const logo = getLogo();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <HeaderContainer scrolled={isScrolled}>
      <HeaderContent>
        <LogoContainer>
          <Link to="/">
            <img src={logo} alt={systemName} width="40" height="40" />
            <LogoText>{systemName}</LogoText>
          </Link>
        </LogoContainer>
        
        <Nav>
          <NavList>
            <NavItem>首页</NavItem>
            <NavItem>API文档</NavItem>
            <NavItem>产品特点</NavItem>
            <NavItem>价格方案</NavItem>
            <NavItem>关于我们</NavItem>
          </NavList>
        </Nav>
        
        <ButtonGroup>
          <StatusIndicator>
            <div className="dot"></div>
            <span>服务正常</span>
          </StatusIndicator>
          
          <ThemeToggle title="切换主题">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ThemeToggle>
          
          <LanguageSelector>
            <div className="current-lang">
              <img className="flag" src="https://cdn-icons-png.flaticon.com/512/197/197375.png" alt="Chinese flag" />
              <span>中文</span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </LanguageSelector>
          
          <Button className="secondary">API文档</Button>
          <Button className="primary">免费注册</Button>
        </ButtonGroup>
        
        <MobileMenuButton>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </MobileMenuButton>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
