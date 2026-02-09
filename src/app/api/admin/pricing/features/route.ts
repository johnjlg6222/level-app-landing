import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET all pricing features
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
      .from('pricing_features')
      .select('*')
      .order('category')
      .order('sort_order');

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching pricing features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing features' },
      { status: 500 }
    );
  }
}

// POST create a pricing feature
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, description, category, price_john, price_harouna, price_andre, sort_order = 0, is_active = true } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: 'name and category are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('pricing_features')
      .insert({
        name,
        description: description || '',
        category,
        price_john: price_john || 0,
        price_harouna: price_harouna || 0,
        price_andre: price_andre || 0,
        sort_order,
        is_active,
      })
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
    console.error('Error creating pricing feature:', error);
    return NextResponse.json(
      { error: 'Failed to create pricing feature' },
      { status: 500 }
    );
  }
}
