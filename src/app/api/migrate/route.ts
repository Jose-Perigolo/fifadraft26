import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Run Prisma db push
    execSync('npx prisma db push', {
      env: { ...process.env },
      stdio: 'pipe'
    });
    
    console.log('✅ Database schema created successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Database schema created successfully'
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
