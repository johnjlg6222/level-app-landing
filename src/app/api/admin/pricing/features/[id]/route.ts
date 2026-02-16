import { NextResponse } from 'next/server';

const unavailable = () =>
  NextResponse.json(
    { error: 'Database backend removed. Admin pricing features are unavailable.' },
    { status: 503 }
  );

export async function PUT() { return unavailable(); }
export async function DELETE() { return unavailable(); }
