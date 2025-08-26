import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/draft-service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { isValid: false },
        { status: 200 }
      );
    }

    // Check if user is still logged in
    const isValid = user.isLoggedIn === true;

    return NextResponse.json({
      isValid,
      user: isValid ? {
        id: user.id,
        name: user.name,
        hasChangedPassword: user.hasChangedPassword,
        isLoggedIn: user.isLoggedIn,
      } : null,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { isValid: false },
      { status: 200 }
    );
  }
} 