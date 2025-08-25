import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('🧪 Testing snake draft logic...');
    
    // Get the active draft
    const draft = await prisma.draft.findFirst({
      where: { isComplete: false },
      include: {
        participants: true,
        picks: true
      }
    });
    
    if (!draft) {
      return NextResponse.json({ error: 'No active draft found' });
    }
    
    // Sort participants by pickOrder
    const sortedParticipants = draft.pickOrder
      ?.map(userId => draft.participants.find(p => p.id === userId))
      .filter(Boolean) || draft.participants;
    
    const participantsCount = sortedParticipants.length;
    
    // Test the logic for current state
    const currentTurn = draft.currentTurn;
    const round = draft.round;
    
    // Calculate who should be current user
    let actualTurn = currentTurn;
    if (round % 2 === 0) {
      // Even round: reverse order
      actualTurn = participantsCount - 1 - currentTurn;
    }
    
    const currentUser = sortedParticipants[actualTurn];
    
    // Show what should happen next
    let nextTurn = currentTurn + 1;
    let nextRound = round;
    
    if (nextTurn >= participantsCount) {
      nextRound = round + 1;
      nextTurn = 0; // Always reset to 0 for new round
    }
    
    let nextActualTurn = nextTurn;
    if (nextRound % 2 === 0) {
      // Even round: reverse order
      nextActualTurn = participantsCount - 1 - nextTurn;
    }
    
    const nextUser = sortedParticipants[nextActualTurn];
    
    return NextResponse.json({
      currentState: {
        round,
        currentTurn,
        actualTurn,
        currentUser: currentUser?.name,
        participantsCount
      },
      nextState: {
        nextRound,
        nextTurn,
        nextActualTurn,
        nextUser: nextUser?.name
      },
      snakeLogic: {
        isEvenRound: round % 2 === 0,
        willBeEvenRound: nextRound % 2 === 0,
        direction: round % 2 === 0 ? 'Reverse' : 'Normal',
        nextDirection: nextRound % 2 === 0 ? 'Reverse' : 'Normal'
      },
      participants: sortedParticipants.map((p, i) => ({
        index: i,
        name: p?.name,
        id: p?.id
      }))
    });
    
  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json(
      { error: 'Failed to test snake draft' },
      { status: 500 }
    );
  }
}
