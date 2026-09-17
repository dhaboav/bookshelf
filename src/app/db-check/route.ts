import { db } from '@/db/drizzle';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Eksekusi query paling simple buat tes koneksi
    await db.execute(sql`SELECT 1`);

    return NextResponse.json({
      status: 'success',
      message: 'Koneksi database berhasil!',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
