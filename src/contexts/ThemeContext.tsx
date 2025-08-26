'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [initialized, setInitialized] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('fifa-draft-theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Default to light theme
      setTheme('light');
      localStorage.setItem('fifa-draft-theme', 'light');
    }
    setInitialized(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!initialized) return;

    console.log('🎨 Applying theme:', theme);
    console.log('📊 Before: HTML classes =', document.documentElement.className);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    console.log('📊 After: HTML classes =', document.documentElement.className);
    console.log('🔍 Dark class present:', document.documentElement.classList.contains('dark'));

    localStorage.setItem('fifa-draft-theme', theme);
  }, [theme, initialized]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 