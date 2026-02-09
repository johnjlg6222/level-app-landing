// Closing Wizard Types - 22-step wizard for live client calls

export interface ClosingWizardStep {
  id: string;
  label: string;
  icon: string; // lucide icon name
  category?: string; // maps to pricing_features.category for feature steps
}

export const CLOSING_WIZARD_STEPS: ClosingWizardStep[] = [
  { id: 'client', label: 'Client', icon: 'Building2' },
  { id: 'project', label: 'Projet', icon: 'FileText' },
  { id: 'packs', label: 'Packs', icon: 'Package' },
  // Steps 3-17: one per feature category (15 total)
  { id: 'cat_auth', label: 'Authentification', icon: 'Lock', category: 'Authentification & Gestion des utilisateurs' },
  { id: 'cat_payment', label: 'Paiements', icon: 'CreditCard', category: 'Paiements & Facturation' },
  { id: 'cat_database', label: 'Base de donnees', icon: 'Database', category: 'Base de donnees & Backend' },
  { id: 'cat_dashboard', label: 'Dashboard', icon: 'LayoutDashboard', category: 'Dashboard & Analytics' },
  { id: 'cat_notifications', label: 'Notifications', icon: 'Bell', category: 'Notifications' },
  { id: 'cat_calendar', label: 'Calendrier', icon: 'Calendar', category: 'Calendrier & Planning' },
  { id: 'cat_integrations', label: 'Integrations', icon: 'Plug', category: 'Integrations tierces' },
  { id: 'cat_media', label: 'Medias', icon: 'Image', category: 'Gestion de medias' },
  { id: 'cat_ai', label: 'IA & Chatbot', icon: 'Bot', category: 'IA & Chatbot' },
  { id: 'cat_search', label: 'Recherche', icon: 'Search', category: 'Recherche & Filtres' },
  { id: 'cat_analytics', label: 'Analytics', icon: 'BarChart3', category: 'Analytics avancee' },
  { id: 'cat_export', label: 'Export/Import', icon: 'FileDown', category: 'Export & Import de donnees' },
  { id: 'cat_i18n', label: 'Localisation', icon: 'Globe', category: 'Localisation & i18n' },
  { id: 'cat_uiux', label: 'UI/UX', icon: 'Layers', category: 'UI/UX avancee' },
  { id: 'cat_security', label: 'Securite', icon: 'ShieldCheck', category: 'Securite avancee' },
  // Non-category steps
  { id: 'design', label: 'Design', icon: 'Palette' },
  { id: 'logistics', label: 'Logistique', icon: 'Clock' },
  { id: 'notes', label: 'Notes', icon: 'StickyNote' },
  { id: 'review', label: 'Recapitulatif', icon: 'CheckCircle' },
];

export interface SelectedFeatureDetail {
  featureId: string;
  featureName: string;
  category: string;
  price: number;
  fromPack: string | null; // pack name if auto-included, null if a-la-carte
}

// Wizard state managed by useClosingWizard
export interface ClosingWizardState {
  currentStep: number; // 0-21

  // Client info
  clientInfo: {
    company: string;
    contact: string;
    email: string;
    phone: string;
    sector: string;
  };

  // Project context
  projectContext: {
    projectName: string;
    problemToSolve: string;
    projectType: string;
    targetUsers: string;
  };

  // Packs
  selectedMainPack: string | null; // pack ID (Starter/Business/Premium)
  selectedCategoryPacks: string[]; // pack IDs

  // Features
  selectedFeatureIds: string[]; // individual feature IDs (manually toggled by user)
  packFeatureIds: string[]; // computed from pack-feature junctions (auto-included)

  // Design
  design: {
    hasBranding: boolean;
    style: string;
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    animations: boolean;
  };

  // Logistics
  logistics: {
    deadline: string;
    urgency: string;
    maintenance: string;
  };

  // Notes
  notes: {
    indispensable: string;
    niceToHave: string;
    internal: string;
  };

  // Pricing
  discount: number;
  extraScreens: Record<string, number>;
}
