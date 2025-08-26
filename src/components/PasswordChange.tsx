'use client';

import { useState } from 'react';
import { User } from '@/types';
import { changePassword } from '@/utils/draft';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface PasswordChangeProps {
  user: User;
  onPasswordChanged: (updatedUser: User) => void;
}

export default function PasswordChange({ user, onPasswordChanged }: PasswordChangeProps) {
  const { theme } = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError('Por favor, digite uma nova senha');
      return;
    }

    if (newPassword.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const updatedUser = await changePassword(user, newPassword);
      onPasswordChanged(updatedUser);
    } catch {
      setError('Falha ao alterar senha. Tente novamente.');
    }
  };

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
        justifyContent: 'center',
        padding: '16px'
      }}>
      <div className={`rounded-lg shadow-xl p-8 w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Bem-vindo, {user.name}!</h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Por favor, altere sua senha para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Nova Senha
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900'
              }`}
              placeholder="Digite a nova senha"
              minLength={4}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900'
              }`}
              placeholder="Confirme a nova senha"
              minLength={4}
            />
          </div>

          {error && (
            <div className={`text-sm text-center p-3 rounded-md ${
              theme === 'dark' ? 'text-red-400 bg-red-900' : 'text-red-600 bg-red-50'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Alterar Senha e Continuar
          </button>
        </form>

        <div className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>Sua senha deve ter pelo menos 4 caracteres</p>
        </div>
      </div>
      </div>
    </>
  );
}
