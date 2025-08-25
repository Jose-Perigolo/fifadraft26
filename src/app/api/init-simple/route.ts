import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    console.log('🔄 Starting simple database initialization...');
    
    // Test database connection first
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if users already exist
    const existingUsers = await prisma.user.count();
    console.log(`📊 Found ${existingUsers} existing users`);
    
    if (existingUsers === 0) {
      console.log('👥 Creating default users...');
      
      // Create the 8 default users
      const defaultUsers = [
        'Jamir', 'José', 'Jean', 'Foguin', 'Pituca', 'João', 'Leo', 'Jamal'
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

    // Get all users
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
    console.log(`👥 Retrieved ${users.length} users`);

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
      draft = await prisma.draft.create({
        data: {
          name: "FIFA Draft 2026",
          currentTurn: 0,
          round: 1,
          totalRounds: 16,
          isComplete: false,
        },
      });
      console.log('✅ Draft created successfully');
    }

    console.log('🎉 Simple database initialization completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      users: users.length,
      draftId: draft.id,
      existingUsers,
      draftExists: !!existingDraft
    });
  } catch (error) {
    console.error('❌ Simple initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
