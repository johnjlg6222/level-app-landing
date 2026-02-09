import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { PricingPack, PricingPackFeature, PricingFeature } from '@/types/admin-pricing';

// GET all packs with their features
export async function GET() {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { data: packs, error: packsError } = await supabase
      .from('pricing_packs')
      .select('*')
      .order('pack_type')
      .order('sort_order');

    if (packsError) {
      return NextResponse.json(
        { error: packsError.message },
        { status: 500 }
      );
    }

    const { data: packFeatures, error: pfError } = await supabase
      .from('pricing_pack_features')
      .select('*');

    if (pfError) {
      return NextResponse.json(
        { error: pfError.message },
        { status: 500 }
      );
    }

    const { data: features, error: featError } = await supabase
      .from('pricing_features')
      .select('*');

    if (featError) {
      return NextResponse.json(
        { error: featError.message },
        { status: 500 }
      );
    }

    const featuresMap = new Map((features as PricingFeature[]).map((f) => [f.id, f]));

    const packsWithFeatures = (packs as PricingPack[]).map((pack) => {
      const pfForPack = (packFeatures as PricingPackFeature[]).filter((pf) => pf.pack_id === pack.id);
      const assignedFeatures = pfForPack
        .map((pf) => featuresMap.get(pf.feature_id))
        .filter(Boolean) as PricingFeature[];
      return { ...pack, features: assignedFeatures };
    });

    return NextResponse.json({ data: packsWithFeatures });
  } catch (error) {
    console.error('Error fetching pricing packs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing packs' },
      { status: 500 }
    );
  }
}

// POST create a pack
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
    const { name, description, pack_type, price, sort_order = 0, is_active = true, recommended = false, feature_ids } = body;

    if (!name || !pack_type) {
      return NextResponse.json(
        { error: 'name and pack_type are required' },
        { status: 400 }
      );
    }

    const { data: pack, error } = await supabase
      .from('pricing_packs')
      .insert({
        name,
        description: description || '',
        pack_type,
        price: price || 0,
        sort_order,
        is_active,
        recommended,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Assign features if provided
    if (feature_ids && feature_ids.length > 0) {
      const rows = feature_ids.map((feature_id: string) => ({
        pack_id: pack.id,
        feature_id,
      }));
      await supabase.from('pricing_pack_features').insert(rows);
    }

    return NextResponse.json({ data: { ...pack, features: [] } });
  } catch (error) {
    console.error('Error creating pricing pack:', error);
    return NextResponse.json(
      { error: 'Failed to create pricing pack' },
      { status: 500 }
    );
  }
}
