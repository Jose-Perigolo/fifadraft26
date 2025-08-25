import { NextRequest, NextResponse } from 'next/server';
import { getFormation, saveFormation } from '@/lib/draft-service';

// GET - Get user's formation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('draftId');
    const userId = searchParams.get('userId');

    if (!draftId || !userId) {
      return NextResponse.json(
        { error: 'Draft ID and User ID are required' },
        { status: 400 }
      );
    }

    const formation = await getFormation(draftId, userId);
    
    return NextResponse.json({ formation });
  } catch (error) {
    console.error('Error getting formation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Save user's formation
export async function POST(request: NextRequest) {
  try {
    const { draftId, userId, formation, positions } = await request.json();

    console.log('📥 Received formation save request:', {
      draftId,
      userId,
      formation,
      positionsCount: positions.length,
      filledPositions: positions.filter((pos: { playerId?: number }) => pos.playerId).length
    });

    if (!draftId || !userId || !formation || !positions) {
      console.error('❌ Missing required fields for formation save');
      return NextResponse.json(
        { error: 'Draft ID, User ID, formation, and positions are required' },
        { status: 400 }
      );
    }

    const savedFormation = await saveFormation(draftId, userId, formation, positions);
    
    console.log('✅ Formation saved successfully to database');
    
    return NextResponse.json({
      success: true,
      formation: savedFormation,
    });
  } catch (error) {
    console.error('❌ Error saving formation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
