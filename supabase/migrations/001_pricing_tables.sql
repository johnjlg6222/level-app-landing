-- Migration: Create pricing management tables
-- Run this in your Supabase SQL editor

-- Features catalogue (individual features with prices from 3 partners)
CREATE TABLE IF NOT EXISTS pricing_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  price_john NUMERIC(10,2) DEFAULT 0,
  price_harouna NUMERIC(10,2) DEFAULT 0,
  price_andre NUMERIC(10,2) DEFAULT 0,
  final_price NUMERIC(10,2) GENERATED ALWAYS AS (GREATEST(price_john, price_harouna, price_andre)) STORED,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packs (main: Starter/Business/Premium + category: Auth/Payment/etc.)
CREATE TABLE IF NOT EXISTS pricing_packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  pack_type TEXT NOT NULL CHECK (pack_type IN ('main', 'category')),
  price NUMERIC(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction: packs <-> features
CREATE TABLE IF NOT EXISTS pricing_pack_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id UUID REFERENCES pricing_packs(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES pricing_features(id) ON DELETE CASCADE,
  UNIQUE(pack_id, feature_id)
);

-- Global config (urgency multipliers, maintenance tiers, screen prices)
CREATE TABLE IF NOT EXISTS pricing_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pricing_features_category ON pricing_features(category);
CREATE INDEX IF NOT EXISTS idx_pricing_features_active ON pricing_features(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_features_sort ON pricing_features(sort_order);
CREATE INDEX IF NOT EXISTS idx_pricing_packs_type ON pricing_packs(pack_type);
CREATE INDEX IF NOT EXISTS idx_pricing_packs_active ON pricing_packs(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_pack_features_pack ON pricing_pack_features(pack_id);
CREATE INDEX IF NOT EXISTS idx_pricing_pack_features_feature ON pricing_pack_features(feature_id);

-- Seed default config values
INSERT INTO pricing_config (key, value) VALUES
  ('urgency_multipliers', '{
    "normal": { "label": "Normal", "multiplier": 1, "description": "4-6 semaines" },
    "fast": { "label": "Rapide", "multiplier": 1.3, "description": "2-3 semaines" },
    "urgent": { "label": "Urgent", "multiplier": 1.6, "description": "1-2 semaines" }
  }'::jsonb),
  ('maintenance_tiers', '{
    "none": { "label": "Sans maintenance", "monthlyPrice": 0, "description": "Support limite apres livraison" },
    "basic": { "label": "Maintenance Basic", "monthlyPrice": 200, "description": "Corrections de bugs" },
    "standard": { "label": "Maintenance Standard", "monthlyPrice": 400, "description": "Bugs + petites evolutions" },
    "premium": { "label": "Maintenance Premium", "monthlyPrice": 800, "description": "Support complet + evolutions" }
  }'::jsonb),
  ('screen_prices', '{
    "simple": 150,
    "standard": 300,
    "complex": 600,
    "very_complex": 1200
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed default packs (main plans)
INSERT INTO pricing_packs (name, description, pack_type, price, sort_order, recommended) VALUES
  ('Starter', 'Pour les MVPs et premiers lancements', 'main', 2000, 1, false),
  ('Business', 'Pour les projets etablis', 'main', 5000, 2, true),
  ('Premium', 'Solutions entreprise', 'main', 12000, 3, false)
ON CONFLICT DO NOTHING;

-- Seed category packs
INSERT INTO pricing_packs (name, description, pack_type, price, sort_order) VALUES
  ('Pack Authentification', 'Systeme de connexion complet', 'category', 800, 1),
  ('Pack Paiement', 'Integration Stripe complete', 'category', 1200, 2),
  ('Pack Admin', 'Dashboard d''administration', 'category', 1500, 3),
  ('Pack Notifications', 'Notifications push et emails', 'category', 600, 4)
ON CONFLICT DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE pricing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_pack_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read (admin check happens in API layer)
CREATE POLICY "Allow authenticated read on pricing_features"
  ON pricing_features FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on pricing_packs"
  ON pricing_packs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on pricing_pack_features"
  ON pricing_pack_features FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on pricing_config"
  ON pricing_config FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to write (admin check happens in API layer)
CREATE POLICY "Allow authenticated write on pricing_features"
  ON pricing_features FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated write on pricing_packs"
  ON pricing_packs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated write on pricing_pack_features"
  ON pricing_pack_features FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated write on pricing_config"
  ON pricing_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anon access for the bypass admin flow
CREATE POLICY "Allow anon read on pricing_features"
  ON pricing_features FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon read on pricing_packs"
  ON pricing_packs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon read on pricing_pack_features"
  ON pricing_pack_features FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon read on pricing_config"
  ON pricing_config FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon write on pricing_features"
  ON pricing_features FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon write on pricing_packs"
  ON pricing_packs FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon write on pricing_pack_features"
  ON pricing_pack_features FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon write on pricing_config"
  ON pricing_config FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
