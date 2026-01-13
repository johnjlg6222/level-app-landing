// Calculator step definitions
export type CalculatorStep =
  | 'screens'
  | 'appType'
  | 'auth'
  | 'payments'
  | 'features'
  | 'design'
  | 'contact'
  | 'price'
  | 'booking'
  | 'confirmation';

export interface StepDefinition {
  id: CalculatorStep;
  title: string;
  description: string;
  order: number;
}

export const CALCULATOR_STEPS: StepDefinition[] = [
  { id: 'screens', title: 'Écrans', description: 'Nombre d\'écrans de votre application', order: 0 },
  { id: 'appType', title: 'Type', description: 'Application mobile ou site web', order: 1 },
  { id: 'auth', title: 'Authentification', description: 'Système de connexion utilisateur', order: 2 },
  { id: 'payments', title: 'Paiements', description: 'Intégration de paiement', order: 3 },
  { id: 'features', title: 'Fonctionnalités', description: 'Fonctionnalités additionnelles', order: 4 },
  { id: 'design', title: 'Design', description: 'Préférences de design', order: 5 },
  { id: 'contact', title: 'Contact', description: 'Vos coordonnées', order: 6 },
  { id: 'price', title: 'Estimation', description: 'Votre estimation personnalisée', order: 7 },
  { id: 'booking', title: 'Rendez-vous', description: 'Réservez un appel', order: 8 },
  { id: 'confirmation', title: 'Confirmation', description: 'Confirmation de votre demande', order: 9 },
];

// App type options
export type AppType = 'mobile' | 'web' | 'both';

export interface AppTypeOption {
  id: AppType;
  label: string;
  description: string;
  priceModifier: number;
}

export const APP_TYPE_OPTIONS: AppTypeOption[] = [
  { id: 'mobile', label: 'Application Mobile', description: 'iOS et Android avec React Native', priceModifier: 1 },
  { id: 'web', label: 'Application Web', description: 'Site web responsive', priceModifier: 0.8 },
  { id: 'both', label: 'Web + Mobile', description: 'Les deux plateformes', priceModifier: 1.5 },
];

// Auth options
export type AuthLevel = 'none' | 'email' | 'social' | 'multi_user';

export interface AuthOption {
  id: AuthLevel;
  label: string;
  description: string;
  price: number;
}

export const AUTH_OPTIONS: AuthOption[] = [
  { id: 'none', label: 'Pas de connexion', description: 'Application sans authentification', price: 0 },
  { id: 'email', label: 'Email / Mot de passe', description: 'Connexion classique par email', price: 500 },
  { id: 'social', label: 'Social Login', description: 'Google, Apple, Facebook + Email', price: 800 },
  { id: 'multi_user', label: 'Multi-utilisateurs', description: 'Rôles et permissions avancés', price: 1200 },
];

// Payment options
export type PaymentNeeds = 'none' | 'onetime' | 'subscription' | 'both';

export interface PaymentOption {
  id: PaymentNeeds;
  label: string;
  description: string;
  price: number;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'none', label: 'Pas de paiement', description: 'Application gratuite', price: 0 },
  { id: 'onetime', label: 'Paiement unique', description: 'Achats ponctuels (Stripe)', price: 800 },
  { id: 'subscription', label: 'Abonnement', description: 'Paiements récurrents', price: 1200 },
  { id: 'both', label: 'Les deux', description: 'Achat unique + Abonnement', price: 1500 },
];

// Additional features
export interface AdditionalFeature {
  id: string;
  label: string;
  description: string;
  price: number;
  icon?: string;
}

export const ADDITIONAL_FEATURES: AdditionalFeature[] = [
  { id: 'geolocation', label: 'Géolocalisation', description: 'Cartes et localisation', price: 1000, icon: 'MapPin' },
  { id: 'chat', label: 'Messagerie', description: 'Chat en temps réel', price: 1200, icon: 'MessageSquare' },
  { id: 'notifications', label: 'Notifications Push', description: 'Alertes et rappels', price: 600, icon: 'Bell' },
  { id: 'admin_dashboard', label: 'Dashboard Admin', description: 'Interface d\'administration', price: 1500, icon: 'Layout' },
  { id: 'analytics', label: 'Analytics', description: 'Suivi et statistiques', price: 800, icon: 'BarChart' },
  { id: 'file_upload', label: 'Upload de fichiers', description: 'Images, documents, médias', price: 500, icon: 'Upload' },
  { id: 'calendar', label: 'Calendrier', description: 'Gestion de rendez-vous', price: 900, icon: 'Calendar' },
  { id: 'search', label: 'Recherche avancée', description: 'Filtres et recherche', price: 600, icon: 'Search' },
];

// Design preferences
export type DesignStyle = 'minimal' | 'modern' | 'premium' | 'custom';

export interface DesignPreferences {
  hasBranding: boolean;
  style: DesignStyle;
}

export interface DesignStyleOption {
  id: DesignStyle;
  label: string;
  description: string;
  priceModifier: number;
}

export const DESIGN_STYLE_OPTIONS: DesignStyleOption[] = [
  { id: 'minimal', label: 'Minimaliste', description: 'Design épuré et fonctionnel', priceModifier: 0 },
  { id: 'modern', label: 'Moderne', description: 'Tendances actuelles', priceModifier: 500 },
  { id: 'premium', label: 'Premium', description: 'Design haut de gamme', priceModifier: 1500 },
  { id: 'custom', label: 'Sur mesure', description: 'Branding personnalisé complet', priceModifier: 2500 },
];

// Contact info
export interface ContactInfo {
  email: string;
  name: string;
  phone: string;
  company?: string;
}

// Booking info
export interface BookingInfo {
  scheduled: boolean;
  eventUri?: string;
  scheduledTime?: string;
}

// Calculated price
export interface CalculatedPrice {
  min: number;
  max: number;
  breakdown: PriceBreakdownItem[];
}

export interface PriceBreakdownItem {
  label: string;
  amount: number;
}

// Full calculator state
export interface CalculatorState {
  screenCount: number;
  appType: AppType;
  authLevel: AuthLevel;
  paymentNeeds: PaymentNeeds;
  additionalFeatures: string[];
  design: DesignPreferences;
  contact: ContactInfo;
  calculatedPrice: CalculatedPrice;
  booking: BookingInfo;
}

// Initial state
export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  screenCount: 5,
  appType: 'mobile',
  authLevel: 'none',
  paymentNeeds: 'none',
  additionalFeatures: [],
  design: {
    hasBranding: false,
    style: 'minimal',
  },
  contact: {
    email: '',
    name: '',
    phone: '',
    company: '',
  },
  calculatedPrice: {
    min: 2000,
    max: 3000,
    breakdown: [],
  },
  booking: {
    scheduled: false,
  },
};
