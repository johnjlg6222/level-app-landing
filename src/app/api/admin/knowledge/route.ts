import { NextResponse } from 'next/server';

const unavailable = () =>
  NextResponse.json(
    { error: 'Database backend removed. Knowledge management is unavailable.' },
    { status: 503 }
  );

export async function GET() { return unavailable(); }
export async function POST() { return unavailable(); }
