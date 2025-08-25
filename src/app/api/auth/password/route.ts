import { NextRequest, NextResponse } from 'next/server';
import { updateUserPassword } from '@/lib/draft-service';

export async function PUT(request: NextRequest) {
  try {
    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'User ID and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long' },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserPassword(userId, newPassword);

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        hasChangedPassword: updatedUser.hasChangedPassword,
        isLoggedIn: updatedUser.isLoggedIn,
      },
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
