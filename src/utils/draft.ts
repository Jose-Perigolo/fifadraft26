import { User, Draft } from '@/types';

export const DEFAULT_USER_NAMES = [
  'Jamir', 'José', 'Jean', 'Foguin', 'Pituca', 'João Luiz', 'Leo', 'Jamal'
];

export const createInitialDraft = (): Draft => ({
  id: '',
  name: 'FIFA Draft 2026',
  currentTurn: 0,
  round: 1,
  totalRounds: 16,
  isComplete: false,
  participants: [],
  picks: [],
});

export const getCurrentUser = (draft: Draft): User | null => {
  if (!draft.participants || draft.participants.length === 0) return null;
  
  // Snake draft logic: reverse order for even rounds
  let actualTurn = draft.currentTurn;
  
  if (draft.round % 2 === 0) {
    // Even round: reverse the order
    // currentTurn 0 should map to last player (index 7)
    // currentTurn 1 should map to second-to-last player (index 6)
    // etc.
    actualTurn = draft.participants.length - 1 - draft.currentTurn;
  }
  
  if (actualTurn >= draft.participants.length) return null;
  return draft.participants[actualTurn];
};

export const isUserTurn = (draft: Draft, userId: string): boolean => {
  if (!draft.participants || draft.participants.length === 0) return false;
  
  // Snake draft logic: reverse order for even rounds
  let actualTurn = draft.currentTurn;
  
  if (draft.round % 2 === 0) {
    // Even round: reverse the order
    actualTurn = draft.participants.length - 1 - draft.currentTurn;
  }
  
  if (actualTurn >= draft.participants.length) return false;
  const currentUser = draft.participants[actualTurn];
  return currentUser?.id === userId;
};

export const canUserPick = (draft: Draft, userId: string): boolean => {
  return isUserTurn(draft, userId) && !draft.isComplete;
};

// pickPlayer function removed - now handled by database API

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const changePassword = async (user: User, newPassword: string): Promise<User> => {
  try {
    const response = await fetch('/api/auth/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id, newPassword }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    throw new Error('Failed to change password');
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

export const getDraftProgress = (draft: Draft) => {
  const participantsCount = draft.participants?.length || 8;
  const totalPicks = draft.totalRounds * participantsCount;
  const completedPicks = draft.picks?.length || 0;
  return {
    completedPicks,
    totalPicks,
    percentage: Math.round((completedPicks / totalPicks) * 100),
  };
};

export const getRoundDirection = (round: number): string => {
  return round % 2 === 0 ? 'Reverso' : 'Normal';
};
