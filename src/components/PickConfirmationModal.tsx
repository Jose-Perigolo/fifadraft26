'use client';

import { useEffect } from 'react';
import { Player } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface PickConfirmationModalProps {
  isOpen: boolean;
  selectedPlayer: Player | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function PickConfirmationModal({
  isOpen,
  selectedPlayer,
  onConfirm,
  onCancel,
  isSubmitting = false
}: PickConfirmationModalProps) {
  const { theme } = useTheme();

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onCancel]);

  if (!isOpen || !selectedPlayer) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: '#000000ad' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onCancel();
        }
      }}
    >
      <div className={`max-w-md w-full rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Confirmar Escolha
          </h3>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="text-center mb-4">
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Você tem certeza que quer escolher este jogador?
            </p>
            
            {/* Player Card Preview */}
            <div className={`border rounded-lg p-4 mb-4 ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    selectedPlayer.overall >= 90 ? 'bg-red-500' :
                    selectedPlayer.overall >= 85 ? 'bg-orange-500' :
                    selectedPlayer.overall >= 80 ? 'bg-yellow-500' :
                    selectedPlayer.overall >= 75 ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}>
                    {selectedPlayer.overall}
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedPlayer.name}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedPlayer.position} • {selectedPlayer.age} anos • {selectedPlayer.team}
                  </p>
                </div>
              </div>
            </div>

            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Esse pick só poderá ser trocado após o fim do draft.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end space-x-3 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirmando...
              </div>
            ) : (
              'Confirmar Escolha'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
