'use client';

import { useState, useEffect } from 'react';
import { Draft, User, FormationPosition } from '@/types';
import { getCurrentUser, getDraftProgress } from '@/utils/draft';
import FootballField from './FootballField';
import PlayerCard from './PlayerCard';

interface DraftBoardProps {
  draft: Draft | null;
  currentUser: User;
  onFormationUpdate?: (positions: FormationPosition[]) => void;
}

export default function DraftBoard({ draft, currentUser, onFormationUpdate }: DraftBoardProps) {
  const [viewMode, setViewMode] = useState<'draft' | 'team'>('draft');
  const [formation, setFormation] = useState('4-4-2');
  const [positions, setPositions] = useState<FormationPosition[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  if (!draft) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading draft...</p>
        </div>
      </div>
    );
  }

  const currentTurnUser = getCurrentUser(draft);
  const progress = getDraftProgress(draft);

  const isUserTurn = currentTurnUser?.id === currentUser.id;



  const userPlayers = draft.picks
    ?.filter(pick => pick.userId === currentUser.id)
    .map(pick => pick.player)
    .filter((player): player is any => player !== null && player !== undefined) || [];

  const handleFormationUpdate = async (newFormation: string, newPositions: FormationPosition[]) => {
    setFormation(newFormation);
    setPositions(newPositions);
    setIsSaving(true);
    
    // Save formation to database
    try {
      console.log('💾 Saving formation to database...', {
        draftId: draft.id,
        userId: currentUser.id,
        formation: newFormation,
        positionsCount: newPositions.length,
        filledPositions: newPositions.filter(pos => pos.playerId).length
      });
      
      const response = await fetch('/api/formations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draftId: draft.id,
          userId: currentUser.id,
          formation: newFormation,
          positions: newPositions,
        }),
      });
      
      if (response.ok) {
        console.log('✅ Formation saved successfully!');
      } else {
        console.error('❌ Failed to save formation:', response.status);
      }
    } catch (error) {
      console.error('❌ Error saving formation:', error);
    } finally {
      setIsSaving(false);
    }
    
    if (onFormationUpdate) {
      onFormationUpdate(newPositions);
    }
  };

  // Load formation when switching to team view
  useEffect(() => {
    if (viewMode === 'team' && draft) {
      const loadFormation = async () => {
        try {
          const response = await fetch(`/api/formations?draftId=${draft.id}&userId=${currentUser.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.formation) {
              setFormation(data.formation.formation);
              setPositions(data.formation.positions);
            } else {
              // Initialize with default 4-4-2 formation
              const defaultPositions = [
                { position: 'GK', x: 50, y: 90, playerId: undefined },
                { position: 'LB', x: 20, y: 70, playerId: undefined },
                { position: 'CB', x: 35, y: 70, playerId: undefined },
                { position: 'CB', x: 65, y: 70, playerId: undefined },
                { position: 'RB', x: 80, y: 70, playerId: undefined },
                { position: 'LM', x: 20, y: 50, playerId: undefined },
                { position: 'CM', x: 35, y: 50, playerId: undefined },
                { position: 'CM', x: 65, y: 50, playerId: undefined },
                { position: 'RM', x: 80, y: 50, playerId: undefined },
                { position: 'ST', x: 35, y: 25, playerId: undefined },
                { position: 'ST', x: 65, y: 25, playerId: undefined },
              ];
              setPositions(defaultPositions);
            }
          }
        } catch (error) {
          console.error('Error loading formation:', error);
        }
      };
      
      loadFormation();
    }
  }, [viewMode, draft, currentUser.id]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('draft')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'draft'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quadro do Draft
          </button>
          <button
            onClick={() => setViewMode('team')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'team'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Meu Time
          </button>
        </div>
      </div>

      {viewMode === 'draft' ? (
        <>
          {/* Header */}
          <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Quadro do Draft</h2>
                      <div className="text-right">
              <div className="text-sm text-gray-600">Rodada {draft.round} de {draft.totalRounds}</div>
              <div className="text-lg font-semibold text-gray-900">
                {progress.completedPicks}/{progress.totalPicks} escolhas concluídas
              </div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>

        {/* Current Turn */}
        <div className={`p-4 rounded-lg border-2 ${
          isUserTurn 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Vez Atual:</span>
              <div className="text-lg font-semibold text-gray-900">
                                  {currentTurnUser ? currentTurnUser.name : "Draft Concluído"}
              </div>
            </div>
            {isUserTurn && (
              <div className="text-green-600 font-semibold">
                É a sua vez!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {draft.participants?.map((user) => {
          const userPicks = draft.picks?.filter(pick => pick.userId === user.id) || [];
          const userPlayers = userPicks.map(pick => pick.player).filter(Boolean);
          
          return (
            <div 
              key={user.id}
              className={`p-4 rounded-lg border-2 ${
                user.id === currentUser.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <span className="text-sm text-gray-700 font-medium">{userPlayers.length}/16</span>
              </div>

              {/* Team Players */}
              <div className="space-y-2">
                {userPlayers.length === 0 ? (
                  <div className="text-sm text-gray-600 italic">No players selected yet</div>
                ) : (
                  userPlayers.map((player, index) => (
                    player && (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPositionColor(player.position)}`}></div>
                          <span className="font-medium text-gray-900">{player.name}</span>
                        </div>
                        <span className="text-gray-700 font-medium">{player.overall}</span>
                      </div>
                    )
                  ))
                )}
              </div>

              {/* Turn Indicator */}
              {currentTurnUser?.id === user.id && !draft.isComplete && (
                <div className="mt-3 p-2 bg-green-100 rounded text-center">
                  <span className="text-sm font-medium text-green-800">Vez Atual</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Picks */}
      {draft.picks && draft.picks.length > 0 && (
        <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Escolhas Recentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
            {draft.picks.slice(-8).reverse().map((pick, index) => (
              pick.player && (
                <PlayerCard 
                  key={`${pick.id}-${index}`}
                  player={pick.player}
                  showStats={false}
                  isDisabled={true}
                />
              )
            ))}
          </div>
        </div>
      )}
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Formação do Meu Time</h2>
            {isSaving && (
              <div className="flex items-center text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                <span className="text-sm">Salvando...</span>
              </div>
            )}
          </div>
          <FootballField
            userPlayers={userPlayers}
            formation={formation}
            positions={positions}
            onPositionUpdate={handleFormationUpdate}
          />
        </div>
      )}
    </div>
  );
}

function getPositionColor(position: string): string {
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
}
