'use client';

import { useState, useEffect } from 'react';
import { Draft, User, FormationPosition, Player } from '@/types';
import { getCurrentUser, getDraftProgress, getRoundDirection } from '@/utils/draft';
import { formatTimer, getTimeSince } from '@/utils/time';
import FootballField from './FootballField';
import PlayerCard from './PlayerCard';
import { useTheme } from '@/contexts/ThemeContext';

interface DraftBoardProps {
  draft: Draft | null;
  currentUser: User;
  onFormationUpdate?: (positions: FormationPosition[]) => void;
}

export default function DraftBoard({ draft, currentUser, onFormationUpdate }: DraftBoardProps) {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'draft' | 'team' | 'picks'>('draft');
  const [formation, setFormation] = useState('4-4-2');
  const [positions, setPositions] = useState<FormationPosition[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [turnTimer, setTurnTimer] = useState(0);

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
              // Normalize loaded positions to ensure consistent property order
              const normalizedPositions = data.formation.positions.map((pos: any) => ({
                position: pos.position,
                x: pos.x,
                y: pos.y,
                playerId: pos.playerId || undefined
              }));
              setPositions(normalizedPositions);
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

  // Timer logic for time since last pick
  useEffect(() => {
    if (!draft || draft.isComplete) return;

    const interval = setInterval(() => {
      setTurnTimer(getTimeSinceLastPick());
    }, 1000);

    return () => clearInterval(interval);
  }, [draft]);

  if (!draft) {
    return (
      <div className={`rounded-lg shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center py-8">
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>Loading draft...</p>
        </div>
      </div>
    );
  }

  const currentTurnUser = getCurrentUser(draft);
  const progress = getDraftProgress(draft);
  const isUserTurn = currentTurnUser?.id === currentUser.id;
  const roundDirection = getRoundDirection(draft.round);

  const userPlayers = draft.picks
    ?.filter(pick => pick.userId === currentUser.id)
    .map(pick => pick.player)
    .filter((player): player is Player => player !== null && player !== undefined) || [];

  // Calculate time since last pick
  const getTimeSinceLastPick = () => {
    if (!draft.picks || draft.picks.length === 0) {
      return 0;
    }
    
    // Find the most recent pick
    const lastPick = draft.picks.reduce((latest, pick) => {
      if (!latest || !pick.createdAt) return pick;
      if (!latest.createdAt) return latest;
      return new Date(pick.createdAt) > new Date(latest.createdAt) ? pick : latest;
    });
    
    if (!lastPick || !lastPick.createdAt) {
      return 0;
    }
    
    return getTimeSince(new Date(lastPick.createdAt));
  };

  // Group players by position and sort by rating for the picks view
  const groupedPlayers = userPlayers.reduce((acc, player) => {
    const position = player.position;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(player);
    return acc;
  }, {} as { [key: string]: Player[] });

  // Sort players within each position by rating (descending)
  Object.keys(groupedPlayers).forEach(position => {
    groupedPlayers[position].sort((a, b) => b.overall - a.overall);
  });

  // Sort positions in a logical order
  const positionOrder = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF'];
  const sortedPositions = Object.keys(groupedPlayers).sort((a, b) => {
    const aIndex = positionOrder.indexOf(a);
    const bIndex = positionOrder.indexOf(b);
    return aIndex - bIndex;
  });

  const handleFormationUpdate = async (newFormation: string, newPositions: FormationPosition[]) => {
    setFormation(newFormation);
    setPositions(newPositions);
    setIsSaving(true);
    
    // Normalize positions to ensure consistent property order
    const normalizedPositions = newPositions.map(pos => ({
      position: pos.position,
      x: pos.x,
      y: pos.y,
      playerId: pos.playerId || null
    }));
    
    // Save formation to database
    try {
      console.log('💾 Saving formation to database...', {
        draftId: draft.id,
        userId: currentUser.id,
        formation: newFormation,
        positionsCount: normalizedPositions.length,
        filledPositions: normalizedPositions.filter(pos => pos.playerId).length
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
          positions: normalizedPositions,
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

  return (
    <div className={`rounded-lg shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex space-x-1 rounded-lg p-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <button
            onClick={() => setViewMode('draft')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'draft'
                ? `${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} shadow-sm`
                : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
            }`}
          >
            Quadro do Draft
          </button>
          <button
            onClick={() => setViewMode('team')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'team'
                ? `${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} shadow-sm`
                : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
            }`}
          >
            Meu Time
          </button>
          <button
            onClick={() => setViewMode('picks')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'picks'
                ? `${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} shadow-sm`
                : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
            }`}
          >
            Meus Picks
          </button>
        </div>
      </div>

      {viewMode === 'draft' && (
        <>
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quadro do Draft</h2>
              <div className="text-right">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Rodada {draft.round} de {draft.totalRounds} ({roundDirection})</div>
                <div className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {progress.completedPicks}/{progress.totalPicks} escolhas concluídas
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`w-full rounded-full h-3 mb-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>

            {/* Current Turn */}
            <div className={`p-4 rounded-lg border-2 ${
              isUserTurn 
                ? `${theme === 'dark' ? 'border-green-400 bg-green-900' : 'border-green-500 bg-green-50'}` 
                : `${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Vez Atual:</span>
                  <div className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {currentTurnUser ? currentTurnUser.name : "Draft Concluído"}
                  </div>
                  {currentTurnUser && !draft.isComplete && (
                    <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tempo aguardando escolha: {formatTimer(turnTimer)}
                    </div>
                  )}
                </div>
                {isUserTurn && (
                  <div className="text-green-400 font-semibold">
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
                      ? `${theme === 'dark' ? 'border-blue-400 bg-blue-900' : 'border-blue-500 bg-blue-50'}` 
                      : `${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{userPlayers.length}/16</span>
                  </div>

                  {/* Team Players */}
                  <div className="space-y-2">
                    {userPlayers.length === 0 ? (
                      <div className={`text-sm italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No players selected yet</div>
                    ) : (
                      userPlayers.map((player, index) => (
                        player && (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getPositionColor(player.position)}`}></div>
                              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{player.name}</span>
                            </div>
                            <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{player.overall}</span>
                          </div>
                        )
                      ))
                    )}
                  </div>

                  {/* Turn Indicator */}
                  {currentTurnUser?.id === user.id && !draft.isComplete && (
                    <div className={`mt-3 p-2 rounded text-center ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Vez Atual</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recent Picks */}
          {draft.picks && draft.picks.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Escolhas Recentes</h3>
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
      )}

      {viewMode === 'team' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Formação do Meu Time</h2>
            {isSaving && (
              <div className="flex items-center text-green-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
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

      {viewMode === 'picks' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Meus Picks</h2>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {userPlayers.length}/16 jogadores
            </div>
          </div>
          
          {userPlayers.length === 0 ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-lg">Nenhum jogador selecionado ainda</p>
              <p className="text-sm mt-2">Seus picks aparecerão aqui quando você fizer suas escolhas</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedPositions.map(position => (
                <div key={position} className={`rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getPositionColor(position)}`}></div>
                      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {position} ({groupedPlayers[position].length})
                      </h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Jogador</th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Clube</th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Posição</th>
                          <th className={`px-4 py-3 text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Rating</th>
                          <th className={`px-4 py-3 text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pace</th>
                          <th className={`px-4 py-3 text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Shooting</th>
                          <th className={`px-4 py-3 text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Passing</th>
                          <th className={`px-4 py-3 text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Dribbling</th>
                          <th className={`px-4 py-3 text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Defending</th>
                          <th className={`px-4 py-3 text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Physical</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedPlayers[position].map((player) => (
                          <tr 
                            key={player.id} 
                            className={`border-b ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-100'} transition-colors`}
                          >
                            <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              <div className="font-medium">{player.name}</div>
                            </td>
                            <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {player.team}
                            </td>
                            <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {player.position}
                            </td>
                            <td className={`px-4 py-3 text-center font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {player.overall}
                            </td>
                            <td className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {player.pace}
                            </td>
                            <td className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {player.shooting}
                            </td>
                            <td className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {player.passing}
                            </td>
                            <td className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {player.dribbling}
                            </td>
                            <td className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {player.defending}
                            </td>
                            <td className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {player.physical}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
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
