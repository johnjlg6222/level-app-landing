import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET all pricing config
export async function GET() {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('pricing_config')
      .select('*')
      .order('key');

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing config' },
      { status: 500 }
    );
  }
}

// PUT update a config key
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'key and value are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('pricing_config')
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating pricing config:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing config' },
      { status: 500 }
    );
  }
}
