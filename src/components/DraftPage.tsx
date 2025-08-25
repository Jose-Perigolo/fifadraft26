'use client';

import { useState, useEffect } from 'react';
import { User, Player, Draft } from '@/types';
import { canUserPick } from '@/utils/draft';
import { loadPlayers } from '@/utils/players';
import DraftBoard from './DraftBoard';
import PlayerSelection from './PlayerSelection';

interface DraftPageProps {
  currentUser: User;
  onLogout: () => void;
}

export default function DraftPage({ currentUser, onLogout }: DraftPageProps) {
  const [draft, setDraft] = useState<Draft | null>(null);
  // const [draftId, setDraftId] = useState<string | null>(null); // Unused variable
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load players
        const playerData = await loadPlayers();
        setPlayers(playerData);
        
        // Load draft data
        const response = await fetch('/api/draft');
        if (response.ok) {
          const data = await response.json();
  
          const draftWithPlayers = {
            ...data.draft,
            picks: data.draft.picks?.map((pick: { playerId: number }) => ({
              ...pick,
              player: playerData.find(p => p.id === pick.playerId) || null,
            })) || [],
          };
          setDraft(draftWithPlayers);
        } else {
          // If no draft exists, create one
          const initResponse = await fetch('/api/init', { method: 'POST' });
          if (initResponse.ok) {
            const draftResponse = await fetch('/api/draft');
            if (draftResponse.ok) {
              const data = await draftResponse.json();

              const draftWithPlayers = {
                ...data.draft,
                picks: data.draft.picks?.map((pick: { playerId: number }) => ({
                  ...pick,
                  player: playerData.find(p => p.id === pick.playerId) || null,
                })) || [],
              };
              setDraft(draftWithPlayers);
            }
          }
        }
      } catch (err) {
        setError('Falha ao carregar dados');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePlayerSelect = async (player: Player) => {
    if (!draft || !canUserPick(draft, currentUser.id)) {
      return;
    }

    try {
      const response = await fetch('/api/draft', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draftId: draft.id,
          userId: currentUser.id,
          playerId: player.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const draftWithPlayers = {
          ...data.draft,
          picks: data.draft.picks?.map((pick: { playerId: number }) => ({
            ...pick,
            player: players.find(p => p.id === pick.playerId) || null,
          })) || [],
        };
        setDraft(draftWithPlayers);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to make pick');
      }
    } catch (error) {
      console.error('Error making pick:', error);
      alert('Failed to make pick. Please try again.');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading FIFA Draft 2026...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-green-800 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FIFA Draft 2026</h1>
              <p className="text-sm text-gray-600">Bem vindo, {currentUser.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Your Team</div>
                <div className="font-semibold text-gray-900">
                  {draft?.picks?.filter(pick => pick.userId === currentUser.id).length || 0}/16 players
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Draft Board */}
          <div>
            <DraftBoard draft={draft} currentUser={currentUser} />
          </div>

          {/* Player Selection */}
          <div>
            <PlayerSelection
              allPlayers={players}
              selectedPlayers={draft?.picks?.map(pick => pick.player).filter((player): player is Player => player !== undefined) || []}
              onPlayerSelect={handlePlayerSelect}
              isDisabled={!draft || !canUserPick(draft, currentUser.id)}
            />
          </div>
        </div>

        {/* Draft Complete Message */}
        {draft?.isComplete && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Draft Complete!</h2>
            <p className="text-green-700">
              All teams have been assembled. The FIFA Draft 2026 is ready to begin!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
