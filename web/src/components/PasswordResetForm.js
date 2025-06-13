import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Typography, Row, Col } from '@douyinfe/semi-ui';
import { IconMail } from '@douyinfe/semi-icons';
import { API, showError, showInfo, showSuccess, getLogo } from '../helpers';
import Turnstile from 'react-turnstile';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/Theme';

const PasswordResetForm = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [inputs, setInputs] = useState({
    email: '',
  });
  const { email } = inputs;

  const [loading, setLoading] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [logoUrl, setLogoUrl] = useState('/logo.png');

  // 根据主题设置样式
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: isDarkMode ? '#1C1C1C' : '#f5f5f5',
    },
    card: {
      width: '100%',
      maxWidth: '450px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      background: isDarkMode ? '#2c2c2c' : '#fff',
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    logo: {
      width: '64px',
      height: 'auto',
      marginBottom: '16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 600,
      color: isDarkMode ? '#e9e9e9' : '#333',
      margin: '10px 0',
    },
    form: {
      width: '100%',
    },
    button: {
      width: '100%',
      height: '42px',
      fontSize: '16px',
      marginTop: '24px',
    },
    turnstileContainer: {
      marginTop: '16px',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'center',
    }
  };

  useEffect(() => {
    // 获取Logo图片地址
    setLogoUrl(getLogo());
    
    // 获取Turnstile配置
    const fetchTurnstileConfig = async () => {
      try {
        const res = await API.get('/api/status');
        const { success, data } = res.data;
        if (success && data) {
          setTurnstileEnabled(data.turnstile_check);
          setTurnstileSiteKey(data.turnstile_site_key);
        }
      } catch (error) {
        console.error('Failed to fetch turnstile config:', error);
      }
    };
    
    fetchTurnstileConfig();
    
    // 设置页面标题
    document.title = `${t('密码重置')} - ${t('Veloera')}`;
  }, [t]);

  useEffect(() => {
    let countdownInterval = null;
    if (disableButton && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setDisableButton(false);
      setCountdown(30);
    }
    return () => clearInterval(countdownInterval);
  }, [disableButton, countdown]);

  const handleChange = (value) => {
    setInputs((inputs) => ({ ...inputs, email: value }));
  };

  const handleSubmit = async () => {
    if (!email) {
      showError(t('请输入邮箱地址'));
      return;
    }
    
    setDisableButton(true);
    
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(t('请稍后几秒重试，Turnstile 正在检查用户环境！'));
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await API.get(
        `/api/reset_password?email=${email}&turnstile=${turnstileToken}`,
      );
      const { success, message } = res.data;
      
      if (success) {
        showSuccess(t('重置邮件发送成功，请检查邮箱！'));
        setInputs({ ...inputs, email: '' });
      } else {
        showError(message || t('发送重置邮件失败'));
      }
    } catch (error) {
      showError(t('请求失败，请稍后重试'));
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.header}>
          <img src={logoUrl} alt="Logo" style={styles.logo} />
          <Typography.Title heading={3} style={styles.title}>
            {t('密码重置')}
          </Typography.Title>
        </div>
        
        <Form style={styles.form}>
          <Form.Input
            field="email"
            label={t('邮箱地址')}
            placeholder={t('请输入您的邮箱地址')}
            value={email}
            onChange={handleChange}
            prefix={<IconMail />}
            showClear
          />
          
          {turnstileEnabled && (
            <div style={styles.turnstileContainer}>
              <Turnstile
                sitekey={turnstileSiteKey}
                onVerify={(token) => {
                  setTurnstileToken(token);
                }}
              />
            </div>
          )}
          
          <Button
            theme="solid"
            type="primary"
            style={styles.button}
            onClick={handleSubmit}
            loading={loading}
            disabled={disableButton}
          >
            {disableButton ? `${t('重试')} (${countdown})` : t('发送重置邮件')}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default PasswordResetForm;
