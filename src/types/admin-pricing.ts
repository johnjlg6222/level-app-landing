// Admin Pricing Types - DB-driven pricing management

// Pricing feature (individual feature with prices from 4 partners)
export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  price_john: number;
  price_harouna: number;
  price_andre: number;
  price_christophe: number;
  final_price: number; // AVG of non-zero partner prices - DB generated
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Create/update payload (without DB-generated fields)
export type PricingFeatureInput = Omit<PricingFeature, 'id' | 'final_price' | 'created_at' | 'updated_at'>;
export type PricingFeatureUpdate = Partial<Omit<PricingFeature, 'id' | 'final_price' | 'created_at' | 'updated_at'>>;

// Pricing pack (main: Starter/Business/Premium or category: Auth/Payment/etc.)
export interface PricingPack {
  id: string;
  name: string;
  description: string;
  pack_type: 'main' | 'category';
  price: number;
  discount_percentage: number;
  includes_pack_id: string | null;
  sort_order: number;
  is_active: boolean;
  recommended: boolean;
  created_at: string;
  updated_at: string;
}

export type PricingPackInput = Omit<PricingPack, 'id' | 'created_at' | 'updated_at'>;
export type PricingPackUpdate = Partial<Omit<PricingPack, 'id' | 'created_at' | 'updated_at'>>;

// Pack with resolved includes (for cumulative logic)
export interface PricingPackResolved extends PricingPack {
  includedPack?: PricingPack | null;
}

// Junction: pack <-> features
export interface PricingPackFeature {
  id: string;
  pack_id: string;
  feature_id: string;
}

// Global pricing config (urgency multipliers, maintenance tiers, screen prices)
export interface PricingConfig {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export type PricingConfigUpdate = {
  key: string;
  value: Record<string, unknown>;
};

// Feature categories from the Excel grid (13 categories)
export const PRICING_CATEGORIES = [
  'Authentification & Sécurité',
  'Paiements & Monétisation',
  'Base de Données & Données',
  'Dashboard & Admin',
  'Notifications',
  'Social & Communauté',
  'Calendrier & Planning',
  'Intégrations Externes',
  'Fonctionnalités Avancées',
  'Design & UI/UX',
  'Mobile Spécifique',
  'SEO & Performance',
  'Sécurité & Conformité',
] as const;

export type PricingCategory = (typeof PRICING_CATEGORIES)[number];

// Config keys
export const PRICING_CONFIG_KEYS = {
  URGENCY_MULTIPLIERS: 'urgency_multipliers',
  MAINTENANCE_TIERS: 'maintenance_tiers',
  SCREEN_PRICES: 'screen_prices',
} as const;

// Typed config values
export interface UrgencyMultiplierConfig {
  normal: { label: string; multiplier: number; description: string };
  fast: { label: string; multiplier: number; description: string };
  urgent: { label: string; multiplier: number; description: string };
}

export interface MaintenanceTierConfig {
  none: { label: string; monthlyPrice: number; description: string };
  basic: { label: string; monthlyPrice: number; description: string };
  standard: { label: string; monthlyPrice: number; description: string };
  premium: { label: string; monthlyPrice: number; description: string };
}

export interface ScreenPriceConfig {
  simple: number;
  standard: number;
  complex: number;
  very_complex: number;
}

// Grouped features for display
export interface GroupedFeatures {
  [category: string]: PricingFeature[];
}

// Pack with its assigned features
export interface PricingPackWithFeatures extends PricingPack {
  features: PricingFeature[];
}

// Pricing admin tab
export type PricingAdminTab = 'features' | 'packs' | 'config';
