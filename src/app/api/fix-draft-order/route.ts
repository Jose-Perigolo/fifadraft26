import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    console.log('🔧 Fixing draft order...');
    
    // Get the active draft
    const draft = await prisma.draft.findFirst({
      where: { isComplete: false },
      include: {
        participants: true,
        picks: true
      }
    });
    
    if (!draft) {
      return NextResponse.json({ error: 'No active draft found' }, { status: 404 });
    }
    
    // If there are already picks, we can't change the order
    if (draft.picks.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot change draft order after picks have been made',
        picksCount: draft.picks.length
      }, { status: 400 });
    }
    
    // Define the correct draft order
    const correctOrder = [
      'Jamal', 'Leo', 'Jean', 'João Luiz', 'José', 'Pituca', 'Foguin', 'Jamir'
    ];
    
    // Get all users
    const allUsers = await prisma.user.findMany();
    
    // Sort users according to the correct order
    const sortedUsers = correctOrder.map(name => 
      allUsers.find(user => user.name === name)
    ).filter(Boolean);
    
    console.log('📋 Correct draft order:', sortedUsers.map(u => u?.name));
    
    // Remove all current participants
    await prisma.draft.update({
      where: { id: draft.id },
      data: {
        participants: {
          set: []
        }
      }
    });
    
    // Add participants in the correct order
    for (const user of sortedUsers) {
      await prisma.draft.update({
        where: { id: draft.id },
        data: {
          participants: {
            connect: { id: user!.id }
          }
        }
      });
      console.log(`✅ Added ${user!.name} to draft in correct position`);
    }
    
    // Reset currentTurn to 0 (Jamal's turn)
    await prisma.draft.update({
      where: { id: draft.id },
      data: {
        currentTurn: 0,
        round: 1,
        isComplete: false
      }
    });
    
    console.log('✅ Draft order fixed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Draft order fixed successfully',
      correctOrder: sortedUsers.map(u => u?.name)
    });
    
  } catch (error) {
    console.error('❌ Error fixing draft order:', error);
    return NextResponse.json(
      { error: 'Failed to fix draft order' },
      { status: 500 }
    );
  }
}
