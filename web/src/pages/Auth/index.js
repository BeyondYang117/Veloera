import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import AuthForm from '../../components/AuthForm';
import { getLogo, getSystemName } from '../../helpers';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  const logo = getLogo();
  const systemName = getSystemName();

  useEffect(() => {
    // 根据路径确定当前模式
    if (location.pathname === '/register') {
      setAuthMode('register');
    } else {
      setAuthMode('login');
    }
  }, [location.pathname]);

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    navigate(mode === 'login' ? '/login' : '/register', { replace: true });
  };

  const features = [
    { icon: '🚀', text: '高速 AI 接口聚合' },
    { icon: '🔐', text: '企业级安全保障' },
    { icon: '📊', text: '实时数据分析' },
    { icon: '💡', text: '智能成本优化' }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 50%, #4776E6 100%)',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.25) 0%, transparent 40%),
            radial-gradient(circle at 40% 70%, rgba(142, 84, 233, 0.4) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite'
        }}
      />

      {/* 品牌区域 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem',
          color: 'white',
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0 24px 24px 0',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
      >
        <img
          src={logo}
          alt={systemName}
          style={{
            width: '80px',
            height: '80px',
            marginBottom: '2rem',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            border: '3px solid rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease'
          }}
        />
        
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#ffffff',
            letterSpacing: '-0.5px',
            textShadow: '0 2px 15px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {systemName}
        </h1>
        
        <div
          style={{
            fontSize: '1.4rem',
            marginBottom: '2rem',
            color: '#ffffff',
            fontWeight: 500,
            opacity: 0.95,
            lineHeight: 1.6,
            textShadow: '0 1px 10px rgba(0, 0, 0, 0.15)',
            letterSpacing: '0.2px'
          }}
        >
          <TypeAnimation
            sequence={[
              '智能API整合平台',
              2000,
              '提供高效、稳定的AI接口整合方案',
              2000,
              '适用于企业级应用和个人开发项目',
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </div>
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '2rem'
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                transform: 'translateZ(0)'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'var(--semi-color-white)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease'
                }}
              >
                {feature.icon}
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '0.3px',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
                }}
              >
                {feature.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 表单区域 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            width: '100%',
            maxWidth: '450px',
            transition: 'all 0.3s ease'
          }}
        >
          <AuthForm 
            mode={authMode} 
            onModeChange={handleModeChange}
          />
        </div>
      </div>

      {/* 添加全局动画样式 */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(1deg); }
            66% { transform: translateY(10px) rotate(-1deg); }
          }
          
          @media (max-width: 768px) {
            .auth-container {
              flex-direction: column;
            }
            
            .brand-section {
              flex: none;
              padding: 2rem;
              min-height: 40vh;
            }
            
            .form-section {
              flex: 1;
              padding: 1rem;
            }
            
            .brand-title {
              font-size: 2.5rem;
            }
            
            .brand-subtitle {
              font-size: 1.2rem;
            }
            
            .form-card {
              padding: 2rem;
              margin: 1rem;
              border-radius: 20px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Auth; 