// Closing Wizard Types - 20-step wizard for live client calls

export interface ClosingWizardStep {
  id: string;
  label: string;
  icon: string; // lucide icon name
  category?: string; // maps to pricing feature category for feature steps
}

export const CLOSING_WIZARD_STEPS: ClosingWizardStep[] = [
  { id: 'client', label: 'Client', icon: 'Building2' },
  { id: 'project', label: 'Projet', icon: 'FileText' },
  { id: 'packs', label: 'Packs', icon: 'Package' },
  // Steps 3-15: one per feature category (13 total)
  { id: 'cat_auth', label: 'Authentification', icon: 'Lock', category: 'Authentification & Sécurité' },
  { id: 'cat_payment', label: 'Paiements', icon: 'CreditCard', category: 'Paiements & Monétisation' },
  { id: 'cat_database', label: 'Base de données', icon: 'Database', category: 'Base de Données & Données' },
  { id: 'cat_dashboard', label: 'Dashboard', icon: 'LayoutDashboard', category: 'Dashboard & Admin' },
  { id: 'cat_notifications', label: 'Notifications', icon: 'Bell', category: 'Notifications' },
  { id: 'cat_social', label: 'Social', icon: 'Users', category: 'Social & Communauté' },
  { id: 'cat_calendar', label: 'Calendrier', icon: 'Calendar', category: 'Calendrier & Planning' },
  { id: 'cat_integrations', label: 'Intégrations', icon: 'Plug', category: 'Intégrations Externes' },
  { id: 'cat_advanced', label: 'Avancé', icon: 'Bot', category: 'Fonctionnalités Avancées' },
  { id: 'cat_design_ui', label: 'Design & UI', icon: 'Layers', category: 'Design & UI/UX' },
  { id: 'cat_mobile', label: 'Mobile', icon: 'Smartphone', category: 'Mobile Spécifique' },
  { id: 'cat_seo', label: 'SEO & Perf', icon: 'BarChart3', category: 'SEO & Performance' },
  { id: 'cat_security', label: 'Sécurité', icon: 'ShieldCheck', category: 'Sécurité & Conformité' },
  // Non-category steps
  { id: 'design', label: 'Design', icon: 'Palette' },
  { id: 'logistics', label: 'Logistique', icon: 'Clock' },
  { id: 'notes', label: 'Notes', icon: 'StickyNote' },
  { id: 'review', label: 'Récapitulatif', icon: 'CheckCircle' },
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
  currentStep: number; // 0-19

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
