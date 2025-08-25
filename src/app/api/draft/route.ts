import { NextRequest, NextResponse } from 'next/server';
import { 
  getActiveDraft, 
  createDraft, 
  createPick,
  updateDraftProgress,
  getDraftPicks,
  isPlayerPicked
} from '@/lib/draft-service';

// GET - Get active draft
export async function GET() {
  try {
    const draft = await getActiveDraft();
    
    if (!draft) {
      return NextResponse.json({ draft: null });
    }

    // Get all picks for this draft
    const picks = await getDraftPicks(draft.id);
    
    // Map picks to include player details (we'll load player details on the client side)
    const picksWithPlayers = picks.map((pick) => {
      const pickData = pick as Record<string, unknown>;
      return {
        ...pickData,
        player: null, // Player details will be loaded on client side
      };
    });

    return NextResponse.json({
      draft: {
        ...draft,
        picks: picksWithPlayers,
      },
    });
  } catch (error) {
    console.error('Error getting draft:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new draft
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    const draft = await createDraft(name);
    
    return NextResponse.json({ draft });
  } catch (error) {
    console.error('Error creating draft:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Make a pick
export async function PUT(request: NextRequest) {
  try {
    const { draftId, userId, playerId } = await request.json();

    if (!draftId || !userId || playerId === undefined) {
      return NextResponse.json(
        { error: 'Draft ID, user ID, and player ID are required' },
        { status: 400 }
      );
    }

    // Check if player is already picked
    const isPicked = await isPlayerPicked(draftId, playerId);
    if (isPicked) {
      return NextResponse.json(
        { error: 'Player is already picked' },
        { status: 400 }
      );
    }

    // Get current draft state
    const draft = await getActiveDraft();
    if (!draft || draft.id !== draftId) {
      return NextResponse.json(
        { error: 'Draft not found or not active' },
        { status: 404 }
      );
    }

    // Get all picks to determine pick order
    const picks = await getDraftPicks(draftId);
    const pickOrder = picks.length + 1;

    // Create the pick
    await createPick(draftId, userId, playerId, draft.round, pickOrder);

    // Update draft progress
    // const totalPicks = picks.length + 1; // Unused variable
    const participantsCount = draft.participants?.length || 8;
    
    let newTurn = draft.currentTurn + 1;
    let newRound = draft.round;
    let isComplete = false;

    // Check if we've completed a round (everyone has picked)
    if (newTurn >= participantsCount) {
      newTurn = 0; // Reset to first player
      newRound = draft.round + 1; // Move to next round
      
      // Check if we've completed all rounds
      if (newRound > draft.totalRounds) {
        isComplete = true;
        newRound = draft.totalRounds; // Keep it at the last round
      }
    }

    // Update draft progress
    const updatedDraft = await updateDraftProgress(draftId, newTurn, newRound, isComplete);

    return NextResponse.json({
      success: true,
      draft: updatedDraft,
    });
  } catch (error) {
    console.error('Error making pick:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
