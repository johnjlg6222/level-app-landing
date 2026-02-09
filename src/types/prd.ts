// PRD Wizard Types - AI-powered PRD generation

// Wizard step identifiers
export type PRDWizardStepId = 'user_flows' | 'data_content' | 'business_rules' | 'design_ux';

// Wizard step definition
export interface PRDWizardStep {
  id: PRDWizardStepId;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export const PRD_WIZARD_STEPS: PRDWizardStep[] = [
  {
    id: 'user_flows',
    title: 'Parcours Utilisateurs',
    description: 'Definissez les flux utilisateurs pour chaque fonctionnalite selectionnee',
    icon: 'Route',
  },
  {
    id: 'data_content',
    title: 'Donnees & Contenu',
    description: 'Precisez les entites de donnees, relations et structure du contenu',
    icon: 'Database',
  },
  {
    id: 'business_rules',
    title: 'Regles Metier & Cas Limites',
    description: 'Definissez les regles metier, gestion des erreurs et cas limites',
    icon: 'Shield',
  },
  {
    id: 'design_ux',
    title: 'Design & UX',
    description: 'Preferences de layout, sites de reference et comportements UI',
    icon: 'Palette',
  },
];

// AI-generated question
export interface PRDQuestion {
  id: string;
  stepId: PRDWizardStepId;
  question: string;
  context: string; // Why this question matters
  suggestedAnswer?: string; // AI-suggested answer the closer can accept or modify
  relatedFeature?: string; // Which feature this relates to
  priority: 'must_answer' | 'recommended' | 'optional';
}

// Answer to a PRD question
export interface PRDAnswer {
  questionId: string;
  answer: string;
  isAISuggested: boolean; // Did they accept the AI suggestion as-is?
}

// Wizard state
export interface PRDWizardState {
  currentStep: number; // 0-3
  questions: PRDQuestion[];
  answers: Record<string, PRDAnswer>; // keyed by questionId
  isGeneratingQuestions: boolean;
  isGeneratingPRD: boolean;
  isCancelling: boolean;
  generatedPRD: string | null; // markdown content
  error: string | null;
}

// API request: generate questions
export interface GenerateQuestionsRequest {
  clientInfo: {
    company: string;
    sector: string;
  };
  projectContext: {
    projectName: string;
    problemToSolve: string;
    projectType: string;
    targetUsers: string;
  };
  selectedPlan: string;
  selectedPacks: string[];
  simpleFeatures: Record<string, unknown>;
  advancedFeatures: string[];
  design: {
    style: string;
    darkMode: boolean;
    animations: boolean;
  };
  notes: {
    indispensable: string;
    niceToHave: string;
  };
}

// API response: generate questions
export interface GenerateQuestionsResponse {
  questions: PRDQuestion[];
}

// API request: generate PRD document
export interface GeneratePRDRequest {
  quoteData: GenerateQuestionsRequest;
  answers: PRDAnswer[];
  questions: PRDQuestion[]; // Full question objects so AI gets question text, not just IDs
}

// API response: generate PRD document
export interface GeneratePRDResponse {
  prdContent: string; // markdown
}

// PRD feature spec (parsed from PRD for PDF rendering)
export interface PRDFeatureSpec {
  name: string;
  description: string;
  userStories: string[];
  acceptanceCriteria: string[];
  userFlow: string;
  dataModel: string;
  businessRules: string[];
  edgeCases: string[];
  technicalNotes: string;
  priority: 'must_have' | 'should_have' | 'nice_to_have';
}

// Full PRD document structure (for PDF)
export interface PRDDocument {
  projectName: string;
  clientCompany: string;
  date: string;
  version: string;
  overview: string;
  personas: string[];
  features: PRDFeatureSpec[];
  designDirection: string;
  technicalApproach: string;
  priorityOrder: string[];
  successMetrics: string[];
}
