import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Database backend removed. Knowledge import is unavailable.' },
    { status: 503 }
  );
}
