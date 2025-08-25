import { prisma } from './db';
import { User, Draft } from '@/types';

// User Management
export async function createUser(name: string, password: string): Promise<User> {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        password,
        hasChangedPassword: false,
        isLoggedIn: false,
      },
    });
    return user as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function getUserByName(name: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { name },
    });
    return user as User | null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
        hasChangedPassword: true,
      },
    });
    return user as User;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw new Error('Failed to update password');
  }
}

export async function setUserLoginStatus(userId: string, isLoggedIn: boolean): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isLoggedIn },
    });
    return user as User;
  } catch (error) {
    console.error('Error updating user login status:', error);
    throw new Error('Failed to update login status');
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
    return users as User[];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Draft Management
export async function createDraft(name: string = "FIFA Draft 2026"): Promise<Draft> {
  try {
    const draft = await prisma.draft.create({
      data: {
        name,
        currentTurn: 0,
        round: 1,
        totalRounds: 16,
        isComplete: false,
      },
    });
    return draft as Draft;
  } catch (error) {
    console.error('Error creating draft:', error);
    throw new Error('Failed to create draft');
  }
}

export async function getActiveDraft(): Promise<Draft | null> {
  try {
    const draft = await prisma.draft.findFirst({
      where: { isComplete: false },
      include: {
        participants: true,
        picks: {
          include: {
            user: true,
          },
        },
      },
    });
    return draft as Draft | null;
  } catch (error) {
    console.error('Error getting active draft:', error);
    return null;
  }
}

export async function updateDraftProgress(
  draftId: string,
  currentTurn: number,
  round: number,
  isComplete: boolean = false
): Promise<Draft> {
  try {
    const draft = await prisma.draft.update({
      where: { id: draftId },
      data: {
        currentTurn,
        round,
        isComplete,
      },
      include: {
        participants: true,
        picks: {
          include: {
            user: true,
          },
        },
      },
    });
    return draft as Draft;
  } catch (error) {
    console.error('Error updating draft progress:', error);
    throw new Error('Failed to update draft progress');
  }
}

export async function addParticipantToDraft(draftId: string, userId: string): Promise<void> {
  try {
    await prisma.draft.update({
      where: { id: draftId },
      data: {
        participants: {
          connect: { id: userId },
        },
      },
    });
  } catch (error) {
    console.error('Error adding participant to draft:', error);
    throw new Error('Failed to add participant to draft');
  }
}

// Pick Management
export async function createPick(
  draftId: string,
  userId: string,
  playerId: number,
  round: number,
  pickOrder: number
): Promise<void> {
  try {
    await prisma.pick.create({
      data: {
        draftId,
        userId,
        playerId,
        round,
        pickOrder,
      },
    });
  } catch (error) {
    console.error('Error creating pick:', error);
    throw new Error('Failed to create pick');
  }
}

export async function getDraftPicks(draftId: string): Promise<unknown[]> {
  try {
    const picks = await prisma.pick.findMany({
      where: { draftId },
      include: {
        user: true,
      },
      orderBy: [
        { round: 'asc' },
        { pickOrder: 'asc' },
      ],
    });
    return picks;
  } catch (error) {
    console.error('Error getting draft picks:', error);
    return [];
  }
}

export async function getUserPicks(draftId: string, userId: string): Promise<unknown[]> {
  try {
    const picks = await prisma.pick.findMany({
      where: {
        draftId,
        userId,
      },
      orderBy: [
        { round: 'asc' },
        { pickOrder: 'asc' },
      ],
    });
    return picks;
  } catch (error) {
    console.error('Error getting user picks:', error);
    return [];
  }
}

export async function isPlayerPicked(draftId: string, playerId: number): Promise<boolean> {
  try {
    const pick = await prisma.pick.findFirst({
      where: {
        draftId,
        playerId,
      },
    });
    return !!pick;
  } catch (error) {
    console.error('Error checking if player is picked:', error);
    return false;
  }
}

// Initialization
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if users already exist
    const existingUsers = await prisma.user.count();
    if (existingUsers === 0) {
      // Create the 8 default users
      const defaultUsers = [
        'Jamir', 'José', 'Jean', 'Foguin', 'Pituca', 'João', 'Leo', 'Jamal'
      ];
      
      for (const name of defaultUsers) {
        await createUser(name, 'senha');
      }
      
      console.log('Database initialized with default users');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Failed to initialize database');
  }
}

// Formation Management
export async function getFormation(draftId: string, userId: string): Promise<unknown> {
  try {
    const formation = await prisma.formation.findUnique({
      where: {
        userId_draftId: {
          userId,
          draftId,
        },
      },
    });
    return formation;
  } catch (error) {
    console.error('Error getting formation:', error);
    return null;
  }
}

export async function saveFormation(
  draftId: string,
  userId: string,
  formation: string,
  positions: Record<string, unknown>[]
): Promise<unknown> {
  try {
    console.log('🔍 Attempting to save formation:', { draftId, userId, formation, positionsCount: positions.length });
    
    // First check if user and draft exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const draft = await prisma.draft.findUnique({ where: { id: draftId } });
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    if (!draft) {
      throw new Error(`Draft with ID ${draftId} not found`);
    }
    
    console.log('✅ User and draft found, proceeding with formation save');
    
    const savedFormation = await prisma.formation.upsert({
      where: {
        userId_draftId: {
          userId,
          draftId,
        },
      },
      update: {
        formation,
        positions: positions as any,
      },
      create: {
        userId,
        draftId,
        formation,
        positions: positions as any,
      },
    });
    
    console.log('✅ Formation saved successfully:', savedFormation.id);
    return savedFormation;
  } catch (error) {
    console.error('❌ Error saving formation:', error);
    throw error; // Re-throw the actual error instead of a generic one
  }
}
