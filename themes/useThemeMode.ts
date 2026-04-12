'use client';

import { ThemeMode } from '@/types/theme-types';
import { useState, useEffect } from 'react';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e);
  }
  
  return 'light';
};

export const useThemeMode = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply dark class to html element
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to localStorage
    try {
      localStorage.setItem('theme', themeMode);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  }, [themeMode, mounted]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { themeMode, toggleTheme };
};
