import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Debugging draft state...');
    
    // Get the active draft with all details
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
    
    // Get all users to check their order
    const allUsers = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    });
    
    // Check if pickOrder column exists and has data
    const hasPickOrder = draft.pickOrder && draft.pickOrder.length > 0;
    
    // Get participants in current order
    const participantNames = draft.participants.map(p => p.name);
    
    // Get participants in correct order
    const correctOrder = [
      'Jamal', 'Leo', 'Jean', 'João Luiz', 'José', 'Pituca', 'Foguin', 'Jamir'
    ];
    
    return NextResponse.json({
      draft: {
        id: draft.id,
        currentTurn: draft.currentTurn,
        round: draft.round,
        isComplete: draft.isComplete,
        pickOrder: draft.pickOrder,
        hasPickOrder,
        participantCount: draft.participants.length,
        picksCount: draft.picks.length
      },
      participants: {
        currentOrder: participantNames,
        correctOrder,
        allUsers: allUsers.map(u => ({ id: u.id, name: u.name }))
      },
      analysis: {
        firstParticipant: participantNames[0],
        shouldBeFirst: correctOrder[0],
        orderMatches: participantNames[0] === correctOrder[0],
        needsPickOrderColumn: !hasPickOrder
      }
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json(
      { error: 'Failed to debug draft', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
