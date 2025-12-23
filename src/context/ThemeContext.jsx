import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Provide fallback values if context is not available
    return {
      theme: 'dark',
      toggleTheme: () => {},
      colors: {
        primary: 'slate-950',
        secondary: 'slate-900',
        accent: 'slate-800',
        text: 'white',
        textSecondary: 'slate-400',
        border: 'slate-700',
        gradient: 'from-blue-500 to-purple-600'
      },
      isDark: true
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('admin-theme');
      return savedTheme || 'dark';
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('admin-theme', theme);
      
      // Apply theme to document root
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const themes = {
    dark: {
      primary: 'slate-950',
      secondary: 'slate-900',
      accent: 'slate-800',
      text: 'white',
      textSecondary: 'slate-400',
      border: 'slate-700',
      gradient: 'from-blue-500 to-purple-600'
    },
    light: {
      primary: 'white',
      secondary: 'gray-50',
      accent: 'gray-100',
      text: 'gray-900',
      textSecondary: 'gray-600',
      border: 'gray-200',
      gradient: 'from-blue-500 to-purple-600'
    }
  };

  const value = {
    theme,
    toggleTheme,
    colors: themes[theme],
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};