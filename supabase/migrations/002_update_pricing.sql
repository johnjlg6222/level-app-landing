-- Migration: Update pricing schema for 4 partners + AVG pricing + pack enhancements
-- Run this in your Supabase SQL editor AFTER 001_pricing_tables.sql

-- 1. Add Christophe column
ALTER TABLE pricing_features ADD COLUMN IF NOT EXISTS price_christophe NUMERIC(10,2) DEFAULT 0;

-- 2. Drop old GREATEST generated column, replace with AVG of non-zero partners
ALTER TABLE pricing_features DROP COLUMN IF EXISTS final_price;
ALTER TABLE pricing_features ADD COLUMN final_price NUMERIC(10,2)
  GENERATED ALWAYS AS (
    (COALESCE(price_john,0) + COALESCE(price_harouna,0) + COALESCE(price_andre,0) + COALESCE(price_christophe,0))
    / NULLIF(
        (CASE WHEN price_john > 0 THEN 1 ELSE 0 END) +
        (CASE WHEN price_harouna > 0 THEN 1 ELSE 0 END) +
        (CASE WHEN price_andre > 0 THEN 1 ELSE 0 END) +
        (CASE WHEN price_christophe > 0 THEN 1 ELSE 0 END)
      , 0)
  ) STORED;

-- 3. Add discount_percentage to packs
ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5,2) DEFAULT 0;

-- 4. Add includes_pack_id for cumulative packs (Business includes Starter, Premium includes Business)
ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS includes_pack_id UUID REFERENCES pricing_packs(id);

-- 5. Update maintenance tiers in config
UPDATE pricing_config
SET value = '{
  "none": { "label": "Sans maintenance", "monthlyPrice": 0, "description": "Support limite apres livraison" },
  "basic": { "label": "Maintenance Basic", "monthlyPrice": 350, "description": "Corrections de bugs" },
  "standard": { "label": "Maintenance Standard", "monthlyPrice": 700, "description": "Bugs + petites evolutions" },
  "premium": { "label": "Maintenance Premium", "monthlyPrice": 1133, "description": "Support complet + evolutions" }
}'::jsonb,
    updated_at = NOW()
WHERE key = 'maintenance_tiers';
