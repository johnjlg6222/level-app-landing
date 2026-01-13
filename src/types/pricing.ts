// Base plan definitions
export type PlanId = 'starter' | 'business' | 'premium';

export interface BasePlan {
  id: PlanId;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
  recommended?: boolean;
}

export const BASE_PLANS: BasePlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Pour les MVPs et premiers lancements',
    basePrice: 2000,
    features: [
      'Jusqu\'à 10 écrans',
      'Design standard',
      'Support email',
      'Livraison 4 semaines',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Pour les projets établis',
    basePrice: 5000,
    features: [
      'Jusqu\'à 25 écrans',
      'Design premium',
      'Support prioritaire',
      'Dashboard admin',
      'Livraison 6 semaines',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Solutions entreprise',
    basePrice: 12000,
    features: [
      'Écrans illimités',
      'Design sur mesure',
      'Support dédié',
      'Architecture scalable',
      'Maintenance 6 mois incluse',
    ],
  },
];

// Pack definitions (add-ons for Starter plan)
export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export const PACKS: Pack[] = [
  {
    id: 'auth_pack',
    name: 'Pack Authentification',
    description: 'Système de connexion complet',
    price: 800,
    features: ['Email/Password', 'Social Login', 'Gestion de profil'],
  },
  {
    id: 'payment_pack',
    name: 'Pack Paiement',
    description: 'Intégration Stripe complète',
    price: 1200,
    features: ['Paiement unique', 'Abonnements', 'Factures automatiques'],
  },
  {
    id: 'admin_pack',
    name: 'Pack Admin',
    description: 'Dashboard d\'administration',
    price: 1500,
    features: ['Vue d\'ensemble', 'Gestion utilisateurs', 'Analytics'],
  },
  {
    id: 'notification_pack',
    name: 'Pack Notifications',
    description: 'Notifications push et emails',
    price: 600,
    features: ['Push iOS/Android', 'Emails transactionnels', 'Templates'],
  },
];

// Feature category for detailed pricing
export type FeatureCategory =
  | 'auth'
  | 'payments'
  | 'database'
  | 'dashboard'
  | 'notifications'
  | 'integrations'
  | 'media'
  | 'advanced';

export interface DetailedFeature {
  id: string;
  category: FeatureCategory;
  name: string;
  description: string;
  complexity: 'simple' | 'standard' | 'complex' | 'very_complex';
  price: number;
}

// Complexity pricing
export const COMPLEXITY_PRICES = {
  simple: 200,
  standard: 400,
  complex: 800,
  very_complex: 1500,
};

// Extra screens pricing
export const EXTRA_SCREEN_PRICES = {
  simple: 150,
  standard: 300,
  complex: 600,
  very_complex: 1200,
};

// Urgency multipliers
export interface UrgencyOption {
  id: string;
  label: string;
  description: string;
  multiplier: number;
}

export const URGENCY_OPTIONS: UrgencyOption[] = [
  { id: 'normal', label: 'Normal', description: '4-6 semaines', multiplier: 1 },
  { id: 'fast', label: 'Rapide', description: '2-3 semaines', multiplier: 1.3 },
  { id: 'urgent', label: 'Urgent', description: '1-2 semaines', multiplier: 1.6 },
];

// Maintenance options
export interface MaintenanceOption {
  id: string;
  label: string;
  description: string;
  monthlyPrice: number;
}

export const MAINTENANCE_OPTIONS: MaintenanceOption[] = [
  { id: 'none', label: 'Sans maintenance', description: 'Support limité après livraison', monthlyPrice: 0 },
  { id: 'basic', label: 'Maintenance Basic', description: 'Corrections de bugs', monthlyPrice: 200 },
  { id: 'standard', label: 'Maintenance Standard', description: 'Bugs + petites évolutions', monthlyPrice: 400 },
  { id: 'premium', label: 'Maintenance Premium', description: 'Support complet + évolutions', monthlyPrice: 800 },
];

// Client sector options
export type ClientSector =
  | 'tech'
  | 'commerce'
  | 'sante'
  | 'finance'
  | 'education'
  | 'immobilier'
  | 'autre';

export const CLIENT_SECTORS: { id: ClientSector; label: string }[] = [
  { id: 'tech', label: 'Tech / Startup' },
  { id: 'commerce', label: 'Commerce / Retail' },
  { id: 'sante', label: 'Santé / Médical' },
  { id: 'finance', label: 'Finance / Assurance' },
  { id: 'education', label: 'Éducation / Formation' },
  { id: 'immobilier', label: 'Immobilier' },
  { id: 'autre', label: 'Autre' },
];

// Project types
export type ProjectType = 'webapp' | 'mobile' | 'landing' | 'dashboard' | 'automation';

export const PROJECT_TYPES: { id: ProjectType; label: string; description: string }[] = [
  { id: 'webapp', label: 'Application Web', description: 'SaaS, plateforme, marketplace' },
  { id: 'mobile', label: 'Application Mobile', description: 'iOS et/ou Android' },
  { id: 'landing', label: 'Landing Page', description: 'Site vitrine, conversion' },
  { id: 'dashboard', label: 'Dashboard', description: 'Interface d\'administration' },
  { id: 'automation', label: 'Automatisation', description: 'Workflows, intégrations' },
];

// Target users
export type TargetUsers = 'solo' | 'employees' | 'b2b_b2c' | 'public';

export const TARGET_USERS_OPTIONS: { id: TargetUsers; label: string; description: string }[] = [
  { id: 'solo', label: 'Usage personnel', description: 'Client seul' },
  { id: 'employees', label: 'Équipe interne', description: 'Employés de l\'entreprise' },
  { id: 'b2b_b2c', label: 'Clients B2B/B2C', description: 'Utilisateurs externes' },
  { id: 'public', label: 'Grand public', description: 'Application publique' },
];
