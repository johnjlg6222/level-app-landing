import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// PUT update a pack
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
    if (body.pack_type !== undefined) updateData.pack_type = body.pack_type;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.recommended !== undefined) updateData.recommended = body.recommended;

    if (Object.keys(updateData).length === 0 && !body.feature_ids) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    let pack = null;

    if (Object.keys(updateData).length > 0) {
      const { data, error } = await supabase
        .from('pricing_packs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Pack not found' },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      pack = data;
    }

    // Update feature assignments if provided
    if (body.feature_ids !== undefined) {
      // Delete existing
      await supabase
        .from('pricing_pack_features')
        .delete()
        .eq('pack_id', id);

      // Insert new
      if (body.feature_ids.length > 0) {
        const rows = body.feature_ids.map((feature_id: string) => ({
          pack_id: id,
          feature_id,
        }));
        await supabase.from('pricing_pack_features').insert(rows);
      }
    }

    return NextResponse.json({ data: pack });
  } catch (error) {
    console.error('Error updating pricing pack:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing pack' },
      { status: 500 }
    );
  }
}

// DELETE a pack
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

    // Delete pack features first
    await supabase.from('pricing_pack_features').delete().eq('pack_id', id);

    const { error } = await supabase
      .from('pricing_packs')
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
    console.error('Error deleting pricing pack:', error);
    return NextResponse.json(
      { error: 'Failed to delete pricing pack' },
      { status: 500 }
    );
  }
}
