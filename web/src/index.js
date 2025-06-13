import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import HeaderBar from './components/HeaderBar';
import 'semantic-ui-offline/semantic.min.css';
import './index.css';
import './styles/global.scss';
import './styles/auth-fixes.css';
import { UserProvider } from './context/User';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StatusProvider } from './context/Status';
import { Layout } from '@douyinfe/semi-ui';
import SiderBar from './components/SiderBar';
import { ThemeProvider } from './context/Theme';
import { StyleProvider } from './context/Style/index.js';
import PageLayout from './components/PageLayout.js';
import './i18n/i18n.js';

// Footer暗色模式现在通过styled-components和主题上下文处理，无需全局修复

// initialization

const root = ReactDOM.createRoot(document.getElementById('root'));
const { Sider, Content, Header, Footer } = Layout;
root.render(
  <StatusProvider>
    <UserProvider>
      <BrowserRouter>
        <ThemeProvider>
          <StyleProvider>
            <PageLayout />
          </StyleProvider>
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>
  </StatusProvider>
);
