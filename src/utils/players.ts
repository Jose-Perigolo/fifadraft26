import { Player } from '@/types';

export const loadPlayers = async (): Promise<Player[]> => {
  try {
    const response = await fetch('/api/players');
    const data = await response.json();
    return data.players;
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
};

export const filterPlayers = (
  players: Player[],
  searchTerm: string,
  position?: string,
  minOverall?: number,
  maxOverall?: number
): Player[] => {
  return players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.nation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = !position || player.position.includes(position);
    const matchesOverall = (!minOverall || player.overall >= minOverall) &&
                          (!maxOverall || player.overall <= maxOverall);
    
    return matchesSearch && matchesPosition && matchesOverall;
  });
};

export const getAvailablePlayers = (
  allPlayers: Player[],
  selectedPlayers: Player[]
): Player[] => {
  const selectedIds = selectedPlayers
    .filter(p => p !== null && p !== undefined)
    .map(p => p.id);
  return allPlayers.filter(player => !selectedIds.includes(player.id));
};

export const sortPlayers = (players: Player[], sortBy: string): Player[] => {
  const sorted = [...players];
  
  switch (sortBy) {
    case 'overall-desc':
      return sorted.sort((a, b) => b.overall - a.overall);
    case 'overall-asc':
      return sorted.sort((a, b) => a.overall - b.overall);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'age-asc':
      return sorted.sort((a, b) => a.age - b.age);
    case 'age-desc':
      return sorted.sort((a, b) => b.age - a.age);
    case 'pace-desc':
      return sorted.sort((a, b) => b.pace - a.pace);
    case 'pace-asc':
      return sorted.sort((a, b) => a.pace - b.pace);
    case 'shooting-desc':
      return sorted.sort((a, b) => b.shooting - a.shooting);
    case 'shooting-asc':
      return sorted.sort((a, b) => a.shooting - b.shooting);
    case 'passing-desc':
      return sorted.sort((a, b) => b.passing - a.passing);
    case 'passing-asc':
      return sorted.sort((a, b) => a.passing - b.passing);
    case 'dribbling-desc':
      return sorted.sort((a, b) => b.dribbling - a.dribbling);
    case 'dribbling-asc':
      return sorted.sort((a, b) => a.dribbling - b.dribbling);
    case 'defending-desc':
      return sorted.sort((a, b) => b.defending - a.defending);
    case 'defending-asc':
      return sorted.sort((a, b) => a.defending - b.defending);
    case 'physical-desc':
      return sorted.sort((a, b) => b.physical - a.physical);
    case 'physical-asc':
      return sorted.sort((a, b) => a.physical - b.physical);
    default:
      return sorted;
  }
};
