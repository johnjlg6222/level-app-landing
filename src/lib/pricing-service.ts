import { getSupabase } from '@/lib/supabase';
import type {
  PricingFeature,
  PricingFeatureInput,
  PricingFeatureUpdate,
  PricingPack,
  PricingPackInput,
  PricingPackUpdate,
  PricingPackFeature,
  PricingConfig,
  PricingConfigUpdate,
  PricingPackWithFeatures,
} from '@/types/admin-pricing';

// Pricing features CRUD
export const pricingFeaturesService = {
  async list() {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('pricing_features')
      .select('*')
      .order('category')
      .order('sort_order');
  },

  async create(input: PricingFeatureInput) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('pricing_features').insert(input).select().single();
  },

  async update(id: string, input: PricingFeatureUpdate) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('pricing_features')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },

  async delete(id: string) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('pricing_features').delete().eq('id', id);
  },
};

// Pricing packs CRUD
export const pricingPacksService = {
  async list() {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('pricing_packs')
      .select('*')
      .order('pack_type')
      .order('sort_order');
  },

  async listWithFeatures(): Promise<{ data: PricingPackWithFeatures[] | null; error: Error | null }> {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };

    const { data: packs, error: packsError } = await client
      .from('pricing_packs')
      .select('*')
      .order('pack_type')
      .order('sort_order');

    if (packsError) return { data: null, error: packsError };

    const { data: packFeatures, error: pfError } = await client
      .from('pricing_pack_features')
      .select('*');

    if (pfError) return { data: null, error: pfError };

    const { data: features, error: featError } = await client
      .from('pricing_features')
      .select('*');

    if (featError) return { data: null, error: featError };

    const featuresMap = new Map((features as PricingFeature[]).map((f) => [f.id, f]));

    const packsWithFeatures: PricingPackWithFeatures[] = (packs as PricingPack[]).map((pack) => {
      const pfForPack = (packFeatures as PricingPackFeature[]).filter((pf) => pf.pack_id === pack.id);
      const assignedFeatures = pfForPack
        .map((pf) => featuresMap.get(pf.feature_id))
        .filter(Boolean) as PricingFeature[];
      return { ...pack, features: assignedFeatures };
    });

    return { data: packsWithFeatures, error: null };
  },

  async create(input: PricingPackInput) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('pricing_packs').insert(input).select().single();
  },

  async update(id: string, input: PricingPackUpdate) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('pricing_packs')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },

  async delete(id: string) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    // Delete pack features first, then the pack
    await client.from('pricing_pack_features').delete().eq('pack_id', id);
    return client.from('pricing_packs').delete().eq('id', id);
  },
};

// Pack-feature junction CRUD
export const pricingPackFeaturesService = {
  async listForPack(packId: string) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('pricing_pack_features')
      .select('*')
      .eq('pack_id', packId);
  },

  async setFeaturesForPack(packId: string, featureIds: string[]) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };

    // Delete existing
    const { error: delError } = await client
      .from('pricing_pack_features')
      .delete()
      .eq('pack_id', packId);

    if (delError) return { data: null, error: delError };

    if (featureIds.length === 0) return { data: [], error: null };

    // Insert new
    const rows = featureIds.map((feature_id) => ({ pack_id: packId, feature_id }));
    return client.from('pricing_pack_features').insert(rows).select();
  },
};

// Pricing config CRUD
export const pricingConfigService = {
  async list() {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('pricing_config').select('*').order('key');
  },

  async getByKey(key: string) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('pricing_config').select('*').eq('key', key).single();
  },

  async upsert(input: PricingConfigUpdate) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('pricing_config')
      .upsert(
        { key: input.key, value: input.value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      .select()
      .single();
  },
};
