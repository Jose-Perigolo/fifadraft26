import { NextResponse } from 'next/server';
import { initializeDatabase, createDraft, getAllUsers, addParticipantToDraft } from '@/lib/draft-service';

export async function POST() {
  try {
    // Initialize database with default users
    await initializeDatabase();

    // Get all users
    const users = await getAllUsers();

    // Create a new draft if none exists
    const draft = await createDraft("FIFA Draft 2026");

    // Add all users as participants
    for (const user of users) {
      await addParticipantToDraft(draft.id, user.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      users: users.length,
      draftId: draft.id,
    });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
