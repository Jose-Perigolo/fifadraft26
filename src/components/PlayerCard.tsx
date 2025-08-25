'use client';

import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  onSelect?: (player: Player) => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  showStats?: boolean;
}

export default function PlayerCard({ 
  player, 
  onSelect, 
  isSelected = false, 
  isDisabled = false,
  showStats = true 
}: PlayerCardProps) {
  const handleClick = () => {
    if (!isDisabled && onSelect) {
      onSelect(player);
    }
  };

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      'GK': 'bg-yellow-500',
      'CB': 'bg-red-500',
      'LB': 'bg-red-400',
      'RB': 'bg-red-400',
      'CDM': 'bg-orange-500',
      'CM': 'bg-orange-400',
      'CAM': 'bg-blue-500',
      'LM': 'bg-blue-400',
      'RM': 'bg-blue-400',
      'LW': 'bg-green-500',
      'RW': 'bg-green-500',
      'ST': 'bg-purple-500',
      'CF': 'bg-purple-400',
    };

    for (const [pos, color] of Object.entries(colors)) {
      if (position.includes(pos)) {
        return color;
      }
    }
    return 'bg-gray-500';
  };

  const getOverallColor = (overall: number) => {
    if (overall >= 90) {
      return 'bg-blue-500';
    } else if (overall >= 80) {
      return 'bg-green-500';
    } else {
      return 'bg-yellow-500';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative bg-white rounded-lg shadow-md border-2 transition-all cursor-pointer ${
        isSelected 
          ? 'border-green-500 bg-green-50' 
          : isDisabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
            : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
      }`}
    >


      {/* Player Info */}
      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-900">{player.name}</h3>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getOverallColor(player.overall)}`}>
              {player.overall}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getPositionColor(player.position)}`}>
              {player.position}
            </span>
            <span className="font-medium">{player.age} years</span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-600">Team:</span>
            <span className="font-medium text-gray-900 text-right">{player.team}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nation:</span>
            <span className="font-medium text-gray-900 text-right">{player.nation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">League:</span>
            <span className="font-medium text-gray-900 text-right">{player.league}</span>
          </div>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="mt-3 space-y-1">
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">PAC:</span>
                <span className="font-medium text-gray-900">{player.pace}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SHO:</span>
                <span className="font-medium text-gray-900">{player.shooting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PAS:</span>
                <span className="font-medium text-gray-900">{player.passing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DRI:</span>
                <span className="font-medium text-gray-900">{player.dribbling}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DEF:</span>
                <span className="font-medium text-gray-900">{player.defending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PHY:</span>
                <span className="font-medium text-gray-900">{player.physical}</span>
              </div>
            </div>
          </div>
        )}

        {/* Physical Attributes */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-600">
            <span className="font-medium">{player.height}</span>
            <span className="font-medium">{player.weight}</span>
          </div>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
