'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import Login from '@/components/Login';
import PasswordChange from '@/components/PasswordChange';
import DraftPage from '@/components/DraftPage';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const handleLogin = (user: User) => {
    // Save user to localStorage for persistence
    localStorage.setItem('fifa-draft-user', JSON.stringify(user));
    
    if (!user.hasChangedPassword) {
      setCurrentUser(user);
      setShowPasswordChange(true);
    } else {
      setCurrentUser(user);
      setShowPasswordChange(false);
    }
  };

  const handlePasswordChanged = (updatedUser: User) => {
    // Update user in localStorage
    localStorage.setItem('fifa-draft-user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setShowPasswordChange(false);
  };

  const handleLogout = () => {
    // Remove user from localStorage
    localStorage.removeItem('fifa-draft-user');
    setCurrentUser(null);
    setShowPasswordChange(false);
  };

  // Initialize database and restore user session on first load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        const response = await fetch('/api/init', { method: 'POST' });
        if (response.ok) {
          setIsInitialized(true);
        }
        
        // Restore user session from localStorage
        const savedUser = localStorage.getItem('fifa-draft-user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser) as User;
            
            // Validate if user is still logged in on server
            const validationResponse = await fetch('/api/auth/validate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: user.id }),
            });
            
            if (validationResponse.ok) {
              const { isValid } = await validationResponse.json();
              if (isValid) {
                setCurrentUser(user);
                setShowPasswordChange(false);
              } else {
                // User is no longer logged in on server, remove from localStorage
                localStorage.removeItem('fifa-draft-user');
              }
            } else {
              // Validation failed, remove from localStorage
              localStorage.removeItem('fifa-draft-user');
            }
          } catch (error) {
            console.error('Error restoring user session:', error);
            localStorage.removeItem('fifa-draft-user');
          }
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setIsInitialized(true); // Continue anyway
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initializeApp();
  }, []);

  // Show loading screen while initializing or checking authentication
  if (!isInitialized || isCheckingAuth) {
    return (
      <>
        <ThemeToggle />
        <div style={{
          minHeight: '100vh',
          background: theme === 'dark' 
            ? 'linear-gradient(to bottom right, #1f2937, #111827, #0f172a)'
            : 'linear-gradient(to bottom right, #065f46, #047857, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="text-center text-white">
            <img 
              src="/ball.svg" 
              alt="Loading" 
              className="animate-spin h-12 w-12 mx-auto mb-4"
              style={{ filter: 'invert(1)' }}
            />
            <p>Inicializando FIFA Draft 2026...</p>
          </div>
        </div>
      </>
    );
  }

  // Show password change screen for first-time users
  if (showPasswordChange && currentUser) {
    return (
      <PasswordChange 
        user={currentUser} 
        onPasswordChanged={handlePasswordChanged} 
      />
    );
  }

  // Show draft page for logged-in users
  if (currentUser && !showPasswordChange) {
    return (
      <DraftPage 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />
    );
  }

  // Show login screen
  return (
    <>
      <ThemeToggle />
      <Login onLogin={handleLogin} />
    </>
  );
}
