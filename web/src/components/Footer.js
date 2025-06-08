import React, { useContext } from 'react';
import styled from 'styled-components';
import { Typography, Layout, Row, Col, Space, Button } from '@douyinfe/semi-ui';
import { IconGithubLogo, IconBookStroked, IconUserCircleStroked } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/User';
import { useTheme } from '../context/Theme';
import { getFooterHTML, getSystemName } from '../helpers';

const FooterContainer = styled.footer`
  padding: 60px 0 30px;
  transition: all 0.3s ease;

  /* 使用props控制主题样式 */
  background-color: ${props => props.isDark ? '#161a1a' : '#f8fafc'};
  border-top: 1px solid ${props => props.isDark ? '#333' : '#eaeaea'};
  color: ${props => props.isDark ? '#ffffff' : '#333'};

  /* 确保所有子元素继承正确的文字颜色 */
  * {
    color: ${props => props.isDark ? '#ffffff' : 'inherit'} !important;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 16px;
`;

const FooterDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: ${props => props.isDark ? '#ffffff' : '#666'} !important;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color);
    
    svg {
      fill: white;
    }
  }
  
  svg {
    width: 18px;
    height: 18px;
    fill: #666;
    transition: all 0.3s ease;
  }
`;

const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.isDark ? '#ffffff' : '#333'} !important;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 12px;

  a {
    font-size: 14px;
    transition: all 0.3s ease;
    color: ${props => props.isDark ? '#ffffff' : '#666'} !important;

    &:hover {
      color: ${props => props.isDark ? '#40a9ff' : '#ff6b4a'} !important;
    }
  }
`;

const FooterBottom = styled.div`
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Copyright = styled.p`
  font-size: 14px;
  color: ${props => props.isDark ? '#ffffff' : '#666'} !important;
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    font-size: 14px;
    transition: all 0.3s ease;
    color: ${props => props.isDark ? '#ffffff' : '#666'} !important;

    &:hover {
      color: ${props => props.isDark ? '#40a9ff' : '#ff6b4a'} !important;
    }
  }
`;

const FooterBar = () => {
  const [userState, _] = useContext(UserContext);
  const theme = useTheme();
  const footerHTML = getFooterHTML();
  const systemName = getSystemName();

  // 判断是否为暗色模式 - 兼容多种情况
  const isDark = theme === 'dark' || localStorage.getItem('theme-mode') === 'dark' || document.body.getAttribute('theme-mode') === 'dark';

  return (
    <FooterContainer isDark={isDark}>
      <Container>
        <FooterContent>
          <FooterColumn>
            <FooterLogo>{systemName}</FooterLogo>
            <FooterDescription isDark={isDark}>
              专业的人工智能接口聚合平台，提供高效、稳定的API整合方案，助力企业应用和个人开发者项目。
            </FooterDescription>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="GitHub">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </SocialLink>
            </SocialLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle isDark={isDark}>产品</FooterTitle>
            <FooterLinks>
              <FooterLink isDark={isDark}><a href="#">API文档</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">价格方案</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">示例代码</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">SDK下载</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">更新日志</a></FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle isDark={isDark}>资源</FooterTitle>
            <FooterLinks>
              <FooterLink isDark={isDark}><a href="#">开发者社区</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">技术博客</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">API状态</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">常见问题</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">使用教程</a></FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle isDark={isDark}>公司</FooterTitle>
            <FooterLinks>
              <FooterLink isDark={isDark}><a href="#">关于我们</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">联系我们</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">加入我们</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">合作伙伴</a></FooterLink>
              <FooterLink isDark={isDark}><a href="#">媒体报道</a></FooterLink>
            </FooterLinks>
          </FooterColumn>
        </FooterContent>

        <FooterBottom>
          <Copyright isDark={isDark}>© {new Date().getFullYear()} {systemName}. All Rights Reserved.</Copyright>
          <FooterBottomLinks isDark={isDark}>
            <a href="#">隐私政策</a>
            <a href="#">服务条款</a>
            <a href="#">网站地图</a>
          </FooterBottomLinks>
        </FooterBottom>
      </Container>
    </FooterContainer>
  );
};

export default FooterBar;
