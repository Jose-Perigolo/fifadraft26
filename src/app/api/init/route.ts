import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    console.log('🔄 Starting database initialization...');
    
    // Check if users already exist
    const existingUsers = await prisma.user.count();
    console.log(`📊 Found ${existingUsers} existing users`);
    
    if (existingUsers === 0) {
      console.log('👥 Creating default users...');
      
      // Create the 8 default users in the new draft order
      const defaultUsers = [
        'Jamal', 'Leo', 'Jean', 'João Luiz', 'José', 'Pituca', 'Foguin', 'Jamir'
      ];
      
      for (const name of defaultUsers) {
        try {
          await prisma.user.create({
            data: {
              name,
              password: 'senha',
              hasChangedPassword: false,
              isLoggedIn: false,
            },
          });
          console.log(`✅ Created user: ${name}`);
        } catch (error) {
          console.log(`⚠️ Error creating user ${name}:`, error);
        }
      }
      
      console.log('✅ Users created successfully');
    }

    // Get all users in the correct draft order
    const defaultUserOrder = [
      'Jamal', 'Leo', 'Jean', 'João Luiz', 'José', 'Pituca', 'Foguin', 'Jamir'
    ];
    
    const users = await prisma.user.findMany();
    console.log(`👥 Retrieved ${users.length} users`);
    
    // Sort users according to the default draft order
    const sortedUsers = defaultUserOrder.map(name => 
      users.find(user => user.name === name)
    ).filter(Boolean);
    
    console.log('📋 Users in draft order:', sortedUsers.map(u => u?.name));

    // Check if draft already exists
    const existingDraft = await prisma.draft.findFirst({
      where: { isComplete: false }
    });
    
    let draft;
    if (existingDraft) {
      console.log('📋 Using existing draft');
      draft = existingDraft;
    } else {
      console.log('📋 Creating new draft...');
      // Create a new draft if none exists
      const pickOrderUserIds = sortedUsers.map(user => user!.id);
      draft = await prisma.draft.create({
        data: {
          name: "FIFA Draft 2026",
          currentTurn: 0,
          round: 1,
          totalRounds: 16,
          isComplete: false,
          pickOrder: pickOrderUserIds,
        },
      });
      console.log('✅ Draft created successfully');
    }

    // Add all users as participants if not already added
    console.log('👥 Adding users to draft...');
    for (const user of sortedUsers) {
      try {
        // Check if user is already in draft
        const existingParticipant = await prisma.draft.findFirst({
          where: {
            id: draft.id,
            participants: {
              some: {
                id: user.id
              }
            }
          }
        });
        
        if (!existingParticipant) {
          await prisma.draft.update({
            where: { id: draft.id },
            data: {
              participants: {
                connect: { id: user.id },
              },
            },
          });
          console.log(`✅ Added ${user.name} to draft`);
        } else {
          console.log(`ℹ️ User ${user.name} already in draft`);
        }
      } catch (error) {
        console.log(`⚠️ Error adding ${user.name} to draft:`, error);
      }
    }

    console.log('🎉 Database initialization completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      users: users.length,
      draftId: draft.id,
      existingUsers,
      draftExists: !!existingDraft
    });
  } catch (error) {
    console.error('❌ Initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
