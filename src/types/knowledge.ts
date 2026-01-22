// Knowledge types for chatbot knowledge base

export type KnowledgeSection =
  | 'pricing'
  | 'faq'
  | 'company_info'
  | 'case_studies'
  | 'process'
  | 'custom_context';

export interface KnowledgeEntry {
  id: string;
  section: KnowledgeSection;
  title: string;
  content: KnowledgeContent;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

// Different content structures for different sections
export interface PricingContent {
  plans: Array<{
    name: string;
    basePrice: number;
    description: string;
    features: string[];
  }>;
  packs: Array<{
    name: string;
    price: number;
    description: string;
    features: string[];
  }>;
  urgency: Array<{
    label: string;
    multiplier: number;
    description: string;
  }>;
  maintenance: Array<{
    label: string;
    monthlyPrice: number;
    description: string;
  }>;
  extraScreens: Record<string, number>;
}

export interface FAQContent {
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface CompanyInfoContent {
  name: string;
  description: string;
  mission: string;
  values: string[];
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface CaseStudyContent {
  projects: Array<{
    name: string;
    type: string;
    shortDesc: string;
    problem: string;
    solution: string;
    results: string[];
    tags: string[];
  }>;
}

export interface ProcessContent {
  steps: Array<{
    title: string;
    description: string;
    duration?: string;
  }>;
}

export interface CustomContextContent {
  text: string;
  instructions?: string;
}

export type KnowledgeContent =
  | PricingContent
  | FAQContent
  | CompanyInfoContent
  | CaseStudyContent
  | ProcessContent
  | CustomContextContent;

export interface ChatbotConfig {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

export interface SystemPromptConfig {
  prompt: string;
  personality?: string;
  language?: string;
  tone?: string;
}

// Section metadata for display
export const KNOWLEDGE_SECTIONS: Record<KnowledgeSection, { label: string; description: string; icon: string }> = {
  pricing: {
    label: 'Tarification',
    description: 'Plans, packs et options de prix',
    icon: '💰',
  },
  faq: {
    label: 'FAQ',
    description: 'Questions fréquemment posées',
    icon: '❓',
  },
  company_info: {
    label: 'Entreprise',
    description: 'Informations sur Level App',
    icon: '🏢',
  },
  case_studies: {
    label: 'Études de cas',
    description: 'Projets réalisés et résultats',
    icon: '📊',
  },
  process: {
    label: 'Processus',
    description: 'Notre méthode de travail',
    icon: '⚙️',
  },
  custom_context: {
    label: 'Contexte personnalisé',
    description: 'Instructions supplémentaires',
    icon: '✏️',
  },
};
