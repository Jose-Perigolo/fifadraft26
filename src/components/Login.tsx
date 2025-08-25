'use client';

import { useState } from 'react';
import { User } from '@/types';
import { DEFAULT_USER_NAMES, authenticateUser } from '@/utils/draft';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FIFA Draft 2026</h1>
          <p className="text-gray-600">Selecione seu usuário e digite sua senha</p>
        </div>

        <div className="space-y-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecione Seu Usuário
            </label>
            <div className="grid grid-cols-2 gap-3">
              {DEFAULT_USER_NAMES.map((name) => (
                <button
                  key={name}
                  onClick={() => handleUserSelect({ id: '', name, password: '', hasChangedPassword: false, isLoggedIn: false })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedUser?.name === name
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{name}</div>
                  <div className="text-xs text-gray-500">
                    Clique para entrar
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Password Input */}
          {selectedUser && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha para {selectedUser.name}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                placeholder="Digite sua senha"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedUser || !password || isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Senha inicial para todos os usuários: <strong>senha</strong></p>
          <p className="mt-1">Você será solicitado a alterá-la após o primeiro login</p>
        </div>
      </div>
    </div>
  );
}
