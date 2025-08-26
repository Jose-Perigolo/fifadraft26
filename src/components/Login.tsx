'use client';

import { useState } from 'react';
import { User } from '@/types';
import { DEFAULT_USER_NAMES, authenticateUser } from '@/utils/draft';
import { useTheme } from '@/contexts/ThemeContext';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { theme } = useTheme();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setPassword('');
    setError('');
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!selectedUser) {
      setError('Por favor, selecione um usuário');
      return;
    }

    if (!password) {
      setError('Por favor, digite sua senha');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const authenticatedUser = await authenticateUser(selectedUser.name, password);
      
      if (authenticatedUser) {
        onLogin(authenticatedUser);
      } else {
        setError('Senha inválida');
      }
    } catch (error) {
      setError('Falha no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme === 'dark' 
        ? 'linear-gradient(to bottom right, #1f2937, #111827, #0f172a)'
        : 'linear-gradient(to bottom right, #065f46, #047857, #059669)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '32px',
        width: '100%',
        maxWidth: '384px'
      }}>
        <div className="text-center mb-8">
          <img 
            src="/trophy_logo.svg" 
            alt="FIFA Draft" 
            style={{
              height: '64px',
              width: 'auto',
              margin: '0 auto 16px',
              filter: theme === 'dark' ? 'invert(1)' : 'none'
            }}
          />
          <h1 style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>FIFA Draft 2026</h1>
          <p style={{
            color: 'var(--text-secondary)'
          }}>Selecione seu usuário e digite sua senha</p>
        </div>

        <div className="space-y-6">
          {/* User Selection */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '12px'
            }}>
              Selecione Seu Usuário
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {DEFAULT_USER_NAMES.map((name) => (
                <button
                  key={name}
                  onClick={() => handleUserSelect({ id: '', name, password: '', hasChangedPassword: false, isLoggedIn: false })}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `2px solid ${selectedUser?.name === name ? '#10b981' : 'var(--border-color)'}`,
                    backgroundColor: selectedUser?.name === name 
                      ? (theme === 'dark' ? '#064e3b' : '#ecfdf5') 
                      : 'var(--bg-secondary)',
                    color: selectedUser?.name === name 
                      ? (theme === 'dark' ? '#6ee7b7' : '#047857') 
                      : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '500' }}>{name}</div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    Clique para entrar
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Password Input */}
          {selectedUser && (
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Senha para {selectedUser.name}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid var(--border-color)`,
                  borderRadius: '6px',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)'
                }}
                placeholder="Digite sua senha"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              color: '#dc2626',
              fontSize: '14px',
              textAlign: 'center',
              backgroundColor: '#fef2f2',
              padding: '12px',
              borderRadius: '6px'
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedUser || !password || isLoading}
            style={{
              width: '100%',
              backgroundColor: '#059669',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: !selectedUser || !password || isLoading ? 'not-allowed' : 'pointer',
              opacity: !selectedUser || !password || isLoading ? 0.5 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  animation: 'spin 1s linear infinite',
                  borderRadius: '50%',
                  height: '16px',
                  width: '16px',
                  border: '2px solid transparent',
                  borderTopColor: 'white',
                  marginRight: '8px'
                }}></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </div>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          <p>Senha inicial para todos os usuários: <strong>senha</strong></p>
          <p style={{ marginTop: '4px' }}>Você será solicitado a alterá-la após o primeiro login</p>
        </div>
      </div>
    </div>
  );
}
