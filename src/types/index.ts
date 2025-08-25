export interface Player {
  id: number;
  name: string;
  overall: number;
  position: string;
  age: number;
  nation: string;
  league: string;
  team: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  height: string;
  weight: string;
  weakFoot: number;
  skillMoves: number;
  preferredFoot: string;
  playStyle: string;
  url: string;
}

export interface User {
  id: string;
  name: string;
  password: string;
  hasChangedPassword: boolean;
  isLoggedIn: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Draft {
  id: string;
  name: string;
  currentTurn: number;
  round: number;
  totalRounds: number;
  isComplete: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  participants?: User[];
  picks?: Pick[];
  formations?: Formation[];
}

export interface Pick {
  id: string;
  round: number;
  pickOrder: number;
  createdAt: Date;
  userId: string;
  draftId: string;
  playerId: number;
  user?: User;
  player?: Player;
}

export interface FormationPosition {
  position: string; // e.g., "GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "ST"
  playerId?: number; // The player assigned to this position
  x: number; // X coordinate on the field (0-100)
  y: number; // Y coordinate on the field (0-100)
}

export interface Formation {
  id: string;
  userId: string;
  draftId: string;
  formation: string; // e.g., "4-4-2", "4-3-3", "3-5-2"
  positions: FormationPosition[];
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  draft?: Draft;
}

export interface DraftState {
  draft: Draft;
  currentUser: User | null;
  players: Player[];
  isLoading: boolean;
  error: string | null;
}
