'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {/* Debug Info - Commented out
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <div>Theme: {theme}</div>
        <div>HTML Dark: {document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}</div>
        <div>Storage: {localStorage.getItem('fifa-draft-theme')}</div>
        <div style={{
          backgroundColor: theme === 'dark' ? '#3b82f6' : '#ef4444', // Blue in dark, Red in light
          padding: '4px',
          marginTop: '4px',
          borderRadius: '2px'
        }}>Test Color</div>
      </div>
      */}
      
      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}
        title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      >
        {theme === 'light' ? (
          // Moon icon for dark mode
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          // Sun icon for light mode
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
} 