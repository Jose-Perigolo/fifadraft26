import { NextRequest, NextResponse } from 'next/server';
import { getUserByName, setUserLoginStatus } from '@/lib/draft-service';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await getUserByName(username);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Set user as logged in
    const updatedUser = await setUserLoginStatus(user.id, true);

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        hasChangedPassword: updatedUser.hasChangedPassword,
        isLoggedIn: updatedUser.isLoggedIn,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
