'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import Login from '@/components/Login';
import PasswordChange from '@/components/PasswordChange';
import DraftPage from '@/components/DraftPage';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleLogin = (user: User) => {
    if (!user.hasChangedPassword) {
      setCurrentUser(user);
      setShowPasswordChange(true);
    } else {
      setCurrentUser(user);
      setShowPasswordChange(false);
    }
  };

  const handlePasswordChanged = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setShowPasswordChange(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowPasswordChange(false);
  };

  // Initialize database on first load
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const response = await fetch('/api/init', { method: 'POST' });
        if (response.ok) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setIsInitialized(true); // Continue anyway
      }
    };

    if (!isInitialized) {
      initializeDatabase();
    }
  }, [isInitialized]);

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

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Inicializando FIFA Draft 2026...</p>
        </div>
      </div>
    );
  }

  // Show login screen
  return <Login onLogin={handleLogin} />;
}
