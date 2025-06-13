import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Typography, Notification } from '@douyinfe/semi-ui';
import { IconMail, IconLock, IconCopy } from '@douyinfe/semi-icons';
import { API, copy, showError, showNotice, showSuccess } from '../helpers';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/Theme';

const PasswordResetConfirm = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [inputs, setInputs] = useState({
    email: '',
    token: '',
  });
  const { email, token } = inputs;

  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [newPassword, setNewPassword] = useState('');

  const [searchParams] = useSearchParams();
  
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
    passwordField: {
      cursor: 'pointer',
      background: isDarkMode ? '#3e3e3e' : '#f0f0f0',
    }
  };

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (token && email) {
      setInputs({
        token,
        email,
      });
    } else {
      showError(t('无效的重置链接'));
    }
    
    // 设置页面标题
    document.title = `${t('密码重置确认')} - ${t('Veloera')}`;
  }, [searchParams, t]);

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

  const handleSubmit = async () => {
    if (!email || !token) {
      showError(t('无效的重置链接'));
      return;
    }
    
    setDisableButton(true);
    setLoading(true);
    
    try {
      const res = await API.post(`/api/user/reset`, {
        email,
        token,
      });
      
      const { success, message, data } = res.data;
      
      if (success) {
        setNewPassword(data);
        await copy(data);
        showSuccess(t('密码已重置并已复制到剪贴板'));
        Notification.success({
          title: t('密码重置成功'),
          content: t('新密码已复制到剪贴板，请立即登录并修改密码'),
          duration: 8,
        });
      } else {
        showError(message || t('重置链接非法或已过期'));
      }
    } catch (error) {
      showError(t('请求失败，请稍后重试'));
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = () => {
    if (newPassword) {
      copy(newPassword);
      showSuccess(t('密码已复制到剪贴板'));
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.header}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
          <Typography.Title heading={3} style={styles.title}>
            {t('密码重置确认')}
          </Typography.Title>
        </div>
        
        <Form style={styles.form}>
          <Form.Input
            field="email"
            label={t('邮箱地址')}
            value={email}
            prefix={<IconMail />}
            readOnly
          />
          
          {newPassword && (
            <Form.Input
              field="newPassword"
              label={t('新密码')}
              value={newPassword}
              prefix={<IconLock />}
              suffix={<IconCopy onClick={copyPassword} style={{ cursor: 'pointer' }} />}
              readOnly
              style={styles.passwordField}
              onClick={copyPassword}
            />
          )}
          
          <Button
            theme="solid"
            type="primary"
            style={styles.button}
            onClick={handleSubmit}
            loading={loading}
            disabled={disableButton || newPassword}
          >
            {newPassword ? t('密码重置完成') : disableButton ? t('处理中...') : t('确认重置密码')}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default PasswordResetConfirm;
