import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isConfigured = !!(supabaseUrl && supabaseAnonKey);

// Validate configuration (only warn in browser)
if (!isConfigured && typeof window !== 'undefined') {
  console.warn(
    'Supabase URL or Anon Key not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}

// Create Supabase client only if configured
let _supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isConfigured) return null;

  if (!_supabase) {
    _supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return _supabase;
};

// Legacy export for backwards compatibility
export const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Database types (for TypeScript)
export type Tables = {
  leads: {
    id: string;
    created_at: string;
    email: string;
    name: string;
    phone: string;
    company: string | null;
    screen_count: number;
    app_type: string;
    auth_level: string;
    payment_needs: string;
    additional_features: string[];
    design_style: string;
    has_branding: boolean;
    estimated_price_min: number;
    estimated_price_max: number;
    booking_scheduled: boolean;
    booking_event_uri: string | null;
    booking_scheduled_time: string | null;
    status: string;
    source: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
  };
  chatbot_knowledge: {
    id: string;
    section: string;
    title: string;
    content: Record<string, unknown>;
    is_active: boolean;
    priority: number;
    created_at: string;
    updated_at: string;
  };
  chatbot_config: {
    id: string;
    key: string;
    value: Record<string, unknown>;
    updated_at: string;
  };
  quotes: {
    id: string;
    created_at: string;
    updated_at: string;
    client_company: string;
    client_contact: string;
    client_email: string;
    client_phone: string;
    client_sector: string;
    project_name: string;
    problem_to_solve: string;
    project_type: string;
    target_users: string;
    simple_features: Record<string, unknown>;
    advanced_features: string[];
    selected_features: string[];
    selected_plan: string;
    selected_packs: string[];
    extra_screens: Record<string, number>;
    discount: number;
    design_has_branding: boolean;
    design_style: string;
    design_primary_color: string;
    design_secondary_color: string;
    design_dark_mode: boolean;
    design_animations: boolean;
    deadline: string;
    urgency: string;
    maintenance: string;
    notes_indispensable: string;
    notes_nice_to_have: string;
    notes_internal: string;
    total_price: number;
    monthly_maintenance: number;
    status: string;
    spec_markdown: string | null;
    prd_content: string | null;
  };
  admin_users: {
    id: string;
    email: string;
    role: string;
    created_at: string;
  };
};

// Helper function to check if user is admin
export async function checkIsAdmin(userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { data, error } = await client
    .from('admin_users')
    .select('id, role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return ['admin', 'super_admin'].includes(data.role);
}

// Lead operations
export const leadsService = {
  async create(leadData: Omit<Tables['leads'], 'id' | 'created_at'>) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('leads').insert(leadData).select().single();
  },

  async updateBooking(
    leadId: string,
    bookingData: {
      booking_scheduled: boolean;
      booking_event_uri?: string;
      booking_scheduled_time?: string;
    }
  ) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('leads').update(bookingData).eq('id', leadId).select().single();
  },

  async getById(id: string) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('leads').select('*').eq('id', id).single();
  },

  async list(limit = 50) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
  },
};

// Quote operations
export const quotesService = {
  async create(quoteData: Omit<Tables['quotes'], 'id' | 'created_at' | 'updated_at'>) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('quotes').insert(quoteData).select().single();
  },

  async update(id: string, quoteData: Partial<Tables['quotes']>) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('quotes')
      .update({ ...quoteData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },

  async getById(id: string) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('quotes').select('*').eq('id', id).single();
  },

  async list(limit = 50) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  async delete(id: string) {
    const client = getSupabase();
    if (!client) return { data: null, error: new Error('Supabase not configured') };
    return client.from('quotes').delete().eq('id', id);
  },
};
