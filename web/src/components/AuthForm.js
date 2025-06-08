import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/User';
import {
  API,
  showError,
  showInfo,
  showSuccess,
  updateAPI,
} from '../helpers';
import {
  onGitHubOAuthClicked,
  onOIDCClicked,
  onLinuxDOOAuthClicked,
} from './utils';
import Turnstile from 'react-turnstile';
import {
  Button,
  Divider,
  Form,
  Modal,
  Typography,
  Space,
  Card,
} from '@douyinfe/semi-ui';
import TelegramLoginButton from 'react-telegram-login';
import { IconGithubLogo } from '@douyinfe/semi-icons';
import OIDCIcon from './OIDCIcon.js';
import WeChatIcon from './WeChatIcon';
import LinuxDoIcon from './LinuxDoIcon.js';
import { setUserData } from '../helpers/data.js';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/Theme';

const { Title, Text } = Typography;

const AuthForm = ({ mode, onModeChange }) => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    verification_code: '',
    wechat_verification_code: '',
  });
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { username, password, password2 } = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  let navigate = useNavigate();
  const [status, setStatus] = useState({});
  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme === 'dark';

  let affCode = new URLSearchParams(window.location.search).get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  const darkModeStyles = {
    formTitle: {
      color: isDarkMode ? '#ffffff' : undefined,
      textShadow: isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.2)' : undefined,
    },
    formText: {
      color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : undefined,
      textShadow: isDarkMode ? '0 1px 1px rgba(0, 0, 0, 0.2)' : undefined,
    },
    formLink: {
      color: isDarkMode ? '#40a9ff' : undefined,
      textShadow: isDarkMode ? '0 1px 1px rgba(0, 0, 0, 0.2)' : undefined,
    },
    buttonText: {
      color: '#ffffff',
      fontWeight: 600,
    },
    oauthButton: {
      backgroundColor: isDarkMode ? '#2a2a2a' : undefined,
      border: isDarkMode ? '1px solid #444' : undefined,
      color: isDarkMode ? '#ffffff' : undefined,
    },
    dividerText: {
      color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : undefined,
    },
    cardOverride: {
      boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : undefined,
    }
  };

  useEffect(() => {
    if (searchParams.get('expired')) {
      showError(t('未登录或登录已过期，请重新登录'));
    }
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
      setShowEmailVerification(status.email_verification);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  }, []);

  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  const onSubmitWeChatVerificationCode = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechat_verification_code}`,
    );
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      setUserData(data);
      updateAPI();
      navigate('/');
      showSuccess('登录成功！');
      setShowWeChatLoginModal(false);
    } else {
      showError(message);
    }
  };

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  // 登录处理
  async function handleLogin() {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setSubmitted(true);
    if (username && password) {
      const res = await API.post(
        `/api/user/login?turnstile=${turnstileToken}`,
        {
          username,
          password,
        },
      );
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        setUserData(data);
        updateAPI();
        showSuccess('登录成功！');
        if (username === 'root' && password === '123456') {
          Modal.error({
            title: '您正在使用默认密码！',
            content: '请立刻修改默认密码！',
            centered: true,
          });
        }
        navigate('/token');
      } else {
        showError(message);
      }
    } else {
      showError('请输入用户名和密码！');
    }
  }

  // 注册处理
  async function handleRegister() {
    if (password.length < 8) {
      showInfo('密码长度不得小于 8 位！');
      return;
    }
    if (password !== password2) {
      showInfo('两次输入的密码不一致');
      return;
    }
    if (username && password) {
      if (turnstileEnabled && turnstileToken === '') {
        showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
        return;
      }
      setLoading(true);
      if (!affCode) {
        affCode = localStorage.getItem('aff');
      }
      const res = await API.post(
        `/api/user/register?turnstile=${turnstileToken}`,
        {
          username,
          password,
          email: inputs.email,
          verification_code: inputs.verification_code,
          aff_code: affCode,
        },
      );
      const { success, message, data } = res.data;
      if (success) {
        if (data.length === 0) {
          showSuccess('注册成功！请等待管理员审核！');
          setLoading(false);
          onModeChange('login');
          return;
        }
        userDispatch({ type: 'login', payload: data });
        setUserData(data);
        updateAPI();
        showSuccess('注册成功！');
        navigate('/');
      } else {
        showError(message);
      }
      setLoading(false);
    } else {
      showError('请输入用户名和密码！');
    }
  }

  const sendVerificationCode = async () => {
    if (!inputs.email) {
      showInfo('请输入邮箱！');
      return;
    }
    const res = await API.get(`/api/verification?email=${inputs.email}`);
    const { success, message } = res.data;
    if (success) {
      showSuccess('验证码发送成功，请检查邮箱！');
    } else {
      showError(message);
    }
  };

  const onTelegramLoginClicked = async (response) => {
    const fields = [
      'id',
      'first_name',
      'last_name',
      'username',
      'photo_url',
      'auth_date',
      'hash',
      'lang',
    ];
    const params = {};
    fields.forEach((field) => {
      if (response[field]) {
        params[field] = response[field];
      }
    });
    const res = await API.get(`/api/oauth/telegram/login`, { params });
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      showSuccess('登录成功！');
      setUserData(data);
      updateAPI();
      navigate('/');
    } else {
      showError(message);
    }
  };

  const handleSubmit = () => {
    if (mode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Title heading={3} style={{ ...darkModeStyles.formTitle, marginBottom: '24px', textAlign: 'center' }}>
        {mode === 'login' ? t('登录') : t('注册')}
      </Title>

        <Form onSubmit={handleSubmit}>
          <Form.Input
          field='username'
            label={t('用户名')}
            placeholder={t('请输入用户名')}
          value={username}
            onChange={(value) => handleChange('username', value)}
          style={{ width: '100%' }}
          showClear
          />
        
          <Form.Input
          field='password'
            label={t('密码')}
            placeholder={t('请输入密码')}
          type='password'
          value={password}
            onChange={(value) => handleChange('password', value)}
          style={{ width: '100%' }}
          showClear
          />
        
          {mode === 'register' && (
            <>
              <Form.Input
              field='password2'
                label={t('确认密码')}
                placeholder={t('请再次输入密码')}
              type='password'
              value={password2}
                onChange={(value) => handleChange('password2', value)}
              style={{ width: '100%' }}
              showClear
              />
            
              {showEmailVerification && (
                  <Form.Input
                field='email'
                    label={t('邮箱')}
                    placeholder={t('请输入邮箱')}
                    value={inputs.email}
                    onChange={(value) => handleChange('email', value)}
                style={{ width: '100%' }}
                showClear
                addonAfter={
                  <Button
                    theme='borderless'
                    type='primary'
                    style={{ color: isDarkMode ? '#ffffff' : undefined, fontWeight: 'bold' }}
                    onClick={sendVerificationCode}
                    loading={loading}
                    disabled={!inputs.email}
                  >
                    {t('发送验证码')}
                  </Button>
                }
              />
            )}
            
            {showEmailVerification && (
                  <Form.Input
                field='verification_code'
                    label={t('验证码')}
                    placeholder={t('请输入验证码')}
                    value={inputs.verification_code}
                    onChange={(value) => handleChange('verification_code', value)}
                style={{ width: '100%' }}
                showClear
              />
              )}
            </>
          )}

        {turnstileEnabled && (
          <div style={{ marginBottom: '20px' }}>
            <Turnstile
              sitekey={turnstileSiteKey}
              onVerify={setTurnstileToken}
            />
          </div>
        )}
        
        <div style={{ marginTop: '30px' }}>
            <Button
            theme='solid'
            type='primary'
            htmlType='submit'
            className='btn-login'
            style={{ width: '100%', height: '42px', fontSize: '16px' }}
              loading={loading}
            >
            <span style={darkModeStyles.buttonText}>
              {mode === 'login' ? t('登录') : t('注册')}
            </span>
            </Button>
          </div>
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          {mode === 'login' ? (
            <Space>
              <Text type='tertiary' style={darkModeStyles.formText}>
                {t('还没有账号？')}
              </Text>
              <Text
                link
                onClick={() => onModeChange('register')}
                style={darkModeStyles.formLink}
              >
                {t('立即注册')}
              </Text>
              <Text
                link
                onClick={() => navigate('/reset')}
                style={darkModeStyles.formLink}
              >
                {t('忘记密码')}
              </Text>
            </Space>
          ) : (
            <Space>
              <Text type='tertiary' style={darkModeStyles.formText}>
                {t('已有账号？')}
              </Text>
              <Text
                link
                onClick={() => onModeChange('login')}
                style={darkModeStyles.formLink}
            >
                {t('立即登录')}
              </Text>
            </Space>
        )}
      </div>

        {(status.github_oauth || status.oidc_oauth || status.telegram_oauth || status.wechat_login_enabled || status.linuxdo_oauth) && (
          <>
            <Divider align='center' style={{ margin: '24px 0' }}>
              <Text type='tertiary' style={darkModeStyles.dividerText}>{t('或通过以下方式')}</Text>
          </Divider>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {status.github_oauth && (
              <Button
                  icon={<IconGithubLogo size='large' />}
                  theme='borderless'
                  style={{ padding: '8px 16px', ...darkModeStyles.oauthButton }}
                  onClick={onGitHubOAuthClicked}
                >
                  {t('GitHub 登录')}
                </Button>
            )}
              
              {status.oidc_oauth && (
              <Button
                icon={<OIDCIcon />}
                  theme='borderless'
                  style={{ padding: '8px 16px', ...darkModeStyles.oauthButton }}
                  onClick={onOIDCClicked}
                >
                  {t('OIDC 登录')}
                </Button>
            )}
              
            {status.linuxdo_oauth && (
              <Button
                icon={<LinuxDoIcon />}
                  theme='borderless'
                  style={{ padding: '8px 16px', ...darkModeStyles.oauthButton }}
                  onClick={onLinuxDOOAuthClicked}
                >
                  {t('Linux Do 登录')}
                </Button>
            )}
              
              {status.wechat_login_enabled && (
              <Button
                icon={<WeChatIcon />}
                  theme='borderless'
                  style={{ padding: '8px 16px', ...darkModeStyles.oauthButton }}
                onClick={onWeChatLoginClicked}
                >
                  {t('微信登录')}
                </Button>
            )}
              
          {status.telegram_oauth && (
                <div
                  style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
              <TelegramLoginButton
                dataOnauth={onTelegramLoginClicked}
                botName={status.telegram_bot_name}
              />
            </div>
          )}
        </div>
          </>
        )}
      </Form>

      {/* 微信登录模态框 */}
      <Modal
        title={t('微信验证码登录')}
        visible={showWeChatLoginModal}
        onCancel={() => setShowWeChatLoginModal(false)}
        footer={null}
        centered
        style={{ width: '400px' }}
        bodyStyle={{ padding: '20px' }}
      >
        <Card style={darkModeStyles.cardOverride}>
          <p style={{ ...darkModeStyles.formText, textAlign: 'center', marginBottom: '20px' }}>
            {t('请打开微信，扫描二维码后，回复验证码')}
          </p>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={status.wechat_qrcode}
              alt='WeChat QR Code'
              style={{ maxWidth: '200px', borderRadius: '8px' }}
            />
        </div>
          
          <Form onSubmit={onSubmitWeChatVerificationCode}>
          <Form.Input
              field='wechat_verification_code'
            label={t('验证码')}
              placeholder={t('请输入微信回复的验证码')}
            value={inputs.wechat_verification_code}
            onChange={(value) => handleChange('wechat_verification_code', value)}
              style={{ width: '100%' }}
              showClear
          />

      {turnstileEnabled && (
              <div style={{ marginBottom: '20px' }}>
          <Turnstile
            sitekey={turnstileSiteKey}
                  onVerify={setTurnstileToken}
          />
        </div>
      )}
            
            <Button
              theme='solid'
              type='primary'
              htmlType='submit'
              style={{ width: '100%', marginTop: '20px' }}
              loading={loading}
            >
              <span style={darkModeStyles.buttonText}>
                {t('登录')}
              </span>
            </Button>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default AuthForm; 