import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    console.log('🔧 Force fixing draft order...');
    
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
    
    // Update pickOrder with correct user IDs
    const pickOrderUserIds = sortedUsers.map(user => user!.id);
    await prisma.draft.update({
      where: { id: draft.id },
      data: {
        pickOrder: pickOrderUserIds,
        currentTurn: 0, // Reset to Jamal's turn
        round: 1,
        isComplete: false
      }
    });
    
    console.log('✅ Draft order force fixed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Draft order force fixed successfully',
      correctOrder: sortedUsers.map(u => u?.name),
      picksKept: draft.picks.length
    });
    
  } catch (error) {
    console.error('❌ Error force fixing draft order:', error);
    return NextResponse.json(
      { error: 'Failed to force fix draft order' },
      { status: 500 }
    );
  }
}
