import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// PUT update a pricing feature
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price_john !== undefined) updateData.price_john = body.price_john;
    if (body.price_harouna !== undefined) updateData.price_harouna = body.price_harouna;
    if (body.price_andre !== undefined) updateData.price_andre = body.price_andre;
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('pricing_features')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Feature not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating pricing feature:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing feature' },
      { status: 500 }
    );
  }
}

// DELETE a pricing feature
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { error } = await supabase
      .from('pricing_features')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pricing feature:', error);
    return NextResponse.json(
      { error: 'Failed to delete pricing feature' },
      { status: 500 }
    );
  }
}
