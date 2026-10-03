import { NextResponse } from 'next/server';

import { db } from '@/db/drizzle';

export async function GET() {
  try {
    await db.execute('select 1'); // Test query to check database connection

    return NextResponse.json(
      {
        success: true,
        message: 'Database connection successful!',
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to the database',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
