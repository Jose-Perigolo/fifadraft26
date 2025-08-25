import { NextResponse } from 'next/server';
import { initializeDatabase, createDraft, getAllUsers, addParticipantToDraft } from '@/lib/draft-service';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    console.log('🔄 Starting database initialization...');
    
    // Test database connection first
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if users already exist
    const existingUsers = await prisma.user.count();
    console.log(`📊 Found ${existingUsers} existing users`);
    
    if (existingUsers === 0) {
      console.log('👥 Creating default users...');
      // Initialize database with default users
      await initializeDatabase();
      console.log('✅ Users created successfully');
    }

    // Get all users
    const users = await getAllUsers();
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
      draft = await createDraft("FIFA Draft 2026");
      console.log('✅ Draft created successfully');
    }

    // Add all users as participants if not already added
    console.log('👥 Adding users to draft...');
    for (const user of users) {
      try {
        await addParticipantToDraft(draft.id, user.id);
        console.log(`✅ Added ${user.name} to draft`);
      } catch (error) {
        console.log(`⚠️ User ${user.name} might already be in draft:`, error);
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
  } finally {
    await prisma.$disconnect();
  }
}
