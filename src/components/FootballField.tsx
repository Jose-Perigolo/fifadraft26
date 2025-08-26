'use client';

import { useState, useEffect } from 'react';
import { Player, FormationPosition } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface FootballFieldProps {
  userPlayers: Player[];
  formation: string;
  positions: FormationPosition[];
  onPositionUpdate: (formation: string, positions: FormationPosition[]) => void;
}

const FORMATION_POSITIONS = {
  '4-4-2': [
    { position: 'GK', x: 50, y: 90 },
    { position: 'LB', x: 20, y: 70 },
    { position: 'CB', x: 35, y: 70 },
    { position: 'CB', x: 65, y: 70 },
    { position: 'RB', x: 80, y: 70 },
    { position: 'LM', x: 20, y: 50 },
    { position: 'CM', x: 35, y: 50 },
    { position: 'CM', x: 65, y: 50 },
    { position: 'RM', x: 80, y: 50 },
    { position: 'ST', x: 35, y: 25 },
    { position: 'ST', x: 65, y: 25 },
  ],
  '4-3-3': [
    { position: 'GK', x: 50, y: 90 },
    { position: 'LB', x: 20, y: 70 },
    { position: 'CB', x: 35, y: 70 },
    { position: 'CB', x: 65, y: 70 },
    { position: 'RB', x: 80, y: 70 },
    { position: 'CM', x: 30, y: 50 },
    { position: 'CM', x: 50, y: 50 },
    { position: 'CM', x: 70, y: 50 },
    { position: 'LW', x: 25, y: 25 },
    { position: 'ST', x: 50, y: 25 },
    { position: 'RW', x: 75, y: 25 },
  ],
  '3-5-2': [
    { position: 'GK', x: 50, y: 90 },
    { position: 'CB', x: 30, y: 70 },
    { position: 'CB', x: 50, y: 70 },
    { position: 'CB', x: 70, y: 70 },
    { position: 'LM', x: 15, y: 50 },
    { position: 'CM', x: 35, y: 50 },
    { position: 'CM', x: 50, y: 50 },
    { position: 'CM', x: 65, y: 50 },
    { position: 'RM', x: 85, y: 50 },
    { position: 'ST', x: 40, y: 25 },
    { position: 'ST', x: 60, y: 25 },
  ],
  '4-2-3-1': [
    { position: 'GK', x: 50, y: 90 },
    { position: 'LB', x: 20, y: 70 },
    { position: 'CB', x: 35, y: 70 },
    { position: 'CB', x: 65, y: 70 },
    { position: 'RB', x: 80, y: 70 },
    { position: 'CDM', x: 35, y: 55 },
    { position: 'CDM', x: 65, y: 55 },
    { position: 'CAM', x: 50, y: 40 },
    { position: 'LM', x: 25, y: 30 },
    { position: 'RM', x: 75, y: 30 },
    { position: 'ST', x: 50, y: 20 },
  ],
  '5-3-2': [
    { position: 'GK', x: 50, y: 90 },
    { position: 'LWB', x: 15, y: 70 },
    { position: 'CB', x: 30, y: 70 },
    { position: 'CB', x: 50, y: 70 },
    { position: 'CB', x: 70, y: 70 },
    { position: 'RWB', x: 85, y: 70 },
    { position: 'CM', x: 35, y: 50 },
    { position: 'CM', x: 50, y: 50 },
    { position: 'CM', x: 65, y: 50 },
    { position: 'ST', x: 40, y: 25 },
    { position: 'ST', x: 60, y: 25 },
  ],
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

export default function FootballField({ userPlayers, formation, positions, onPositionUpdate }: FootballFieldProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  
  // Get theme from context
  const { theme } = useTheme();

  useEffect(() => {
    // Filter out players that are already positioned
    const positionedPlayerIds = positions
      .filter(pos => pos.playerId !== undefined)
      .map(pos => pos.playerId);
    
    setAvailablePlayers(userPlayers.filter(player => !positionedPlayerIds.includes(player.id)));
  }, [userPlayers, positions]);

  const handlePlayerDragStart = (player: Player) => {
    setDraggedPlayer(player);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-4', 'ring-yellow-400');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-4', 'ring-yellow-400');
  };

  const handlePositionDrop = (positionIndex: number) => {
    if (!draggedPlayer) return;

    const newPositions = [...positions];
    newPositions[positionIndex] = {
      ...newPositions[positionIndex],
      playerId: draggedPlayer.id,
    };

    onPositionUpdate(formation, newPositions);
    setDraggedPlayer(null);
    
    // Clean up visual indicator
    const element = document.querySelector(`[data-position="${positionIndex}"]`);
    if (element) {
      element.classList.remove('ring-4', 'ring-yellow-400');
    }
  };

  const handlePositionClick = (positionIndex: number) => {
    if (!draggedPlayer) return;
    handlePositionDrop(positionIndex);
  };

  const removePlayerFromPosition = (positionIndex: number) => {
    const newPositions = [...positions];
    newPositions[positionIndex] = {
      ...newPositions[positionIndex],
      playerId: undefined,
    };

    onPositionUpdate(formation, newPositions);
  };

  const getPlayerAtPosition = (playerId?: number) => {
    if (!playerId) return null;
    return userPlayers.find(player => player.id === playerId);
  };

  const getPlayerInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Formation Selector */}
      <div className="flex items-center gap-4">
        <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Formação:</label>
        <select
          value={formation}
          onChange={(e) => {
            const newFormation = e.target.value;
            const newPositions = FORMATION_POSITIONS[newFormation as keyof typeof FORMATION_POSITIONS].map(pos => ({
              ...pos,
              playerId: undefined,
            }));
            onPositionUpdate(newFormation, newPositions);
          }}
          className={`px-3 py-1 border rounded-md ${
            theme === 'dark' 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 text-gray-900'
          }`}
        >
          <option value="4-4-2">4-4-2</option>
          <option value="4-3-3">4-3-3</option>
          <option value="3-5-2">3-5-2</option>
          <option value="4-2-3-1">4-2-3-1</option>
          <option value="5-3-2">5-3-2</option>
        </select>
      </div>

      {/* Football Field */}
      <div className="relative bg-green-600 rounded-lg p-4">
        <div className="relative w-full h-96 bg-green-500 rounded-lg border-4 border-white">
          {/* Hidden Field Lines (for reference only) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/2 border border-white border-opacity-20 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white bg-opacity-20"></div>
          
          {/* Goals */}
          {/* Top Goal */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-white rounded-t-lg"></div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-white"></div>
          
          {/* Bottom Goal */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-white rounded-b-lg"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-white"></div>

          {/* Position Markers */}
          {positions.map((pos, index) => (
            <div
              key={index}
              data-position={index}
              className={`absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                pos.playerId ? 'opacity-100' : 'opacity-60 hover:opacity-80'
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={() => handlePositionDrop(index)}
              onClick={() => handlePositionClick(index)}
            >
              <div className={`w-full h-full rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${getPositionColor(pos.position)}`}>
                {pos.playerId ? (
                  <div className="text-center">
                    <div className="text-xs font-bold text-white">
                      {getPlayerInitials(getPlayerAtPosition(pos.playerId)?.name || '')}
                    </div>
                    <div className="text-xs text-white">
                      {getPlayerAtPosition(pos.playerId)?.overall}
                    </div>
                  </div>
                ) : (
                  pos.position
                )}
              </div>
              
              {/* Remove Button */}
              {pos.playerId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePlayerFromPosition(index);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Players */}
      <div>
        <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Jogadores Disponíveis</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availablePlayers.map((player) => (
            <div
              key={player.id}
              draggable
              onDragStart={() => handlePlayerDragStart(player)}
              className={`rounded-lg shadow-md border-2 p-3 cursor-move transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 hover:border-green-400'
                  : 'bg-white border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getPositionColor(player.position)}`}>
                  {player.overall}
                </div>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{player.position}</span>
              </div>
              <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{player.name}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{player.team}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
