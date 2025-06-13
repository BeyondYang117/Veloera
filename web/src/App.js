import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loading from './components/Loading';
import User from './pages/User';
import { PrivateRoute } from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import Setting from './pages/Setting';
import EditUser from './pages/User/EditUser';
import PasswordResetForm from './components/PasswordResetForm';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import Auth from './pages/Auth';
import Channel from './pages/Channel';
import Token from './pages/Token';
import EditChannel from './pages/Channel/EditChannel';
import Redemption from './pages/Redemption';
import TopUp from './pages/TopUp';
import Log from './pages/Log';
import Chat from './pages/Chat';
import Chat2Link from './pages/Chat2Link';
import { Layout, BackTop } from '@douyinfe/semi-ui';
import Midjourney from './pages/Midjourney';
import Pricing from './pages/Pricing/index.js';
import Task from './pages/Task/index.js';
import Playground from './pages/Playground/Playground.js';
import OAuth2Callback from './components/OAuth2Callback.js';
import PersonalSetting from './components/PersonalSetting.js';
import Setup from './pages/Setup/index.js';
import SetupCheck from './components/SetupCheck';
import Docs from './pages/Docs';

const Home = lazy(() => import('./pages/Home'));
const Detail = lazy(() => import('./pages/Detail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

const routing = [
  {
    path: '/user',
    element: <User />,
    isPrivate: true,
  },
  {
    path: '/user/edit/:id',
    element: <EditUser />,
    isPrivate: true,
  },
  {
    path: '/user/reset',
    element: <PasswordResetForm />,
  },
  {
    path: '/user/reset/:id',
    element: <PasswordResetConfirm />,
  },
  {
    path: '/channel',
    element: <Channel />,
    isPrivate: true,
  },
  {
    path: '/channel/edit/:id',
    element: <EditChannel />,
    isPrivate: true,
  },
  {
    path: '/token',
    element: <Token />,
    isPrivate: true,
  },
  {
    path: '/redemption',
    element: <Redemption />,
    isPrivate: true,
  },
  {
    path: '/topup',
    element: <TopUp />,
    isPrivate: true,
  },
  {
    path: '/user/topup',
    element: <TopUp />,
    isPrivate: true,
  },
  {
    path: '/log',
    element: <Log />,
    isPrivate: true,
  },
  {
    path: '/midjourney',
    element: <Midjourney />,
    isPrivate: true,
  },
  {
    path: '/task',
    element: <Task />,
    isPrivate: true,
  },
  {
    path: '/setting',
    element: <Setting />,
    isPrivate: true,
  },
  {
    path: '/detail',
    element: <Detail />,
    isPrivate: true,
  },
  {
    path: '/chat/:chatId',
    element: <Chat />,
    isPrivate: true,
  },
  {
    path: '/chat2link/:chatId',
    element: <Chat2Link />,
    isPrivate: true,
  },
  {
    path: '/playground',
    element: <Playground />,
    isPrivate: true,
  },
  {
    path: '/personal',
    element: <PersonalSetting />,
    isPrivate: true,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/docs',
    element: <Docs />,
  },
  {
    path: '/setup',
    element: <Setup />,
  },
  {
    path: '/login',
    element: <Auth />,
  },
  {
    path: '/register',
    element: <Auth />,
  },
  {
    path: '/oauth/github',
    element: <OAuth2Callback type="github" />,
  },
  {
    path: '/oauth/oidc',
    element: <OAuth2Callback type="oidc" />,
  },
  {
    path: '/oauth/linuxdo',
    element: <OAuth2Callback type="linuxdo" />,
  },
  {
    path: '/',
    element: <Home />,
  },
];

const App = () => {
  const location = useLocation();

  return (
    <SetupCheck>
      <div style={{ minHeight: '100vh' }}>
        <Suspense fallback={<Loading prompt="page" />}>
          <Routes>
            {routing.map((route, index) => {
              if (route.isPrivate) {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={<PrivateRoute>{route.element}</PrivateRoute>}
                  />
                );
              } else {
                return (
                  <Route key={index} path={route.path} element={route.element} />
                );
              }
            })}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
        <BackTop />
      </div>
    </SetupCheck>
  );
};

export default App;
