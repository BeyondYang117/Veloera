import { createContext, useCallback, useContext, useState } from 'react';

const ThemeContext = createContext(null);
export { ThemeContext };
export const useTheme = () => useContext(ThemeContext);

const SetThemeContext = createContext(null);
export const useSetTheme = () => useContext(SetThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, _setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme-mode') || null;
    } catch {
      return null;
    }
  });

  const setTheme = useCallback((input) => {
    _setTheme(input ? 'dark' : 'light');

    const body = document.body;
    if (!input) {
      body.removeAttribute('theme-mode');
      localStorage.setItem('theme-mode', 'light');
      // 重置CSS变量为亮色模式
      document.documentElement.style.setProperty('--text-color', '#333');
      document.documentElement.style.setProperty('--text-secondary', '#666');
      document.documentElement.style.setProperty('--primary-color', '#ff6b4a');
    } else {
      body.setAttribute('theme-mode', 'dark');
      localStorage.setItem('theme-mode', 'dark');
      // 强制更新CSS变量为暗色模式
      document.documentElement.style.setProperty('--text-color', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#cccccc');
      document.documentElement.style.setProperty('--primary-color', '#40a9ff');
    }
  }, []);

  return (
    <SetThemeContext.Provider value={setTheme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </SetThemeContext.Provider>
  );
};
