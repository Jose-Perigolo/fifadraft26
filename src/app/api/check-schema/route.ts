import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Try to get user count first
    const userCount = await prisma.user.count();
    console.log(`📊 User count: ${userCount}`);
    
    // Try to get one user to see the structure
    const user = await prisma.user.findFirst();
    console.log('👤 Sample user:', user);
    
    return NextResponse.json({
      success: true,
      userCount,
      sampleUser: user,
      message: 'Schema check completed'
    });
  } catch (error) {
    console.error('❌ Schema check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
