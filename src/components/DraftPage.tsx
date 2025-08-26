'use client';

import { useState, useEffect } from 'react';
import { User, Player, Draft } from '@/types';
import { canUserPick } from '@/utils/draft';
import { loadPlayers } from '@/utils/players';
import DraftBoard from './DraftBoard';
import PlayerSelection from './PlayerSelection';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

interface DraftPageProps {
  currentUser: User;
  onLogout: () => void;
}

export default function DraftPage({ currentUser, onLogout }: DraftPageProps) {
  const { theme } = useTheme();
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
      <>
        <ThemeToggle />
        <div style={{
          minHeight: '100vh',
          background: theme === 'dark' 
            ? 'linear-gradient(to bottom right, #1f2937, #111827, #0f172a)'
            : 'linear-gradient(to bottom right, #065f46, #047857, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="text-center text-white">
            <img 
              src="/ball.svg" 
              alt="Loading" 
              className="animate-spin h-12 w-12 mx-auto mb-4"
              style={{ filter: 'invert(1)' }}
            />
            <p>Inicializando FIFA Draft 2026...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
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
          justifyContent: 'center'
        }}>
          <div className="text-center text-white">
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`px-4 py-2 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-green-800 hover:bg-gray-100'
              }`}
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ThemeToggle />
      <div style={{
        minHeight: '100vh',
        background: theme === 'dark' 
          ? 'linear-gradient(to bottom right, #1f2937, #111827, #0f172a)'
          : 'linear-gradient(to bottom right, #065f46, #047857, #059669)'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'var(--bg-primary)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/trophy_logo.svg" 
                alt="FIFA Draft" 
                style={{
                  height: '48px',
                  width: 'auto',
                  filter: theme === 'dark' ? 'invert(1)' : 'none'
                }}
              />
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)'
                }}>FIFA Draft 2026</h1>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)'
                }}>Bem vindo, {currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)'
                }}>Your Team</div>
                <div style={{
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  {draft?.picks?.filter(pick => pick.userId === currentUser.id).length || 0}/16 players
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
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
          <div style={{
            marginTop: '32px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#047857',
              marginBottom: '8px'
            }}>Draft Complete!</h2>
            <p style={{
              color: '#065f46'
            }}>
              All teams have been assembled. The FIFA Draft 2026 is ready to begin!
            </p>
          </div>
        )}
      </main>
      </div>
    </>
  );
}
