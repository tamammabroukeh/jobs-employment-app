'use client';

import { ConfigProvider, ThemeConfig } from 'antd';
import { ThemeContext } from '@/context/ThemeContext';
import { useThemeMode } from '../themes/useThemeMode';
import { createThemeConfig } from '../themes/themeConfig';
import { useState, useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeMode, toggleTheme } = useThemeMode();
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => createThemeConfig(themeMode));

  useEffect(() => {
    // Wait for DOM to update after class change, then read CSS variables
    const timer = setTimeout(() => {
      const newTheme = createThemeConfig(themeMode);
      setCurrentTheme(newTheme);
    }, 0);

    return () => clearTimeout(timer);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider theme={currentTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
