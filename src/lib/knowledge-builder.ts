// Build system prompt from knowledge base entries

import { getSupabase } from './supabase';
import type {
  KnowledgeEntry,
  KnowledgeSection,
  PricingContent,
  FAQContent,
  CompanyInfoContent,
  CaseStudyContent,
  ProcessContent,
  CustomContextContent,
  SystemPromptConfig,
} from '@/types/knowledge';

/**
 * Fetch all active knowledge entries from Supabase
 */
export async function fetchKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn('Supabase not configured, using fallback knowledge');
    return [];
  }

  const { data, error } = await supabase
    .from('chatbot_knowledge')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false });

  if (error) {
    console.error('Error fetching knowledge:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch system prompt configuration
 */
export async function fetchSystemPromptConfig(): Promise<SystemPromptConfig> {
  const supabase = getSupabase();
  const defaultConfig: SystemPromptConfig = {
    prompt: `Tu es l'assistant virtuel de Level App, une agence de développement d'applications mobiles et web.
Tu aides les prospects à comprendre nos services, tarifs et processus.
Sois professionnel, amical et précis. Réponds en français.
Utilise les informations ci-dessous pour répondre aux questions.`,
    personality: 'professional',
    language: 'fr',
    tone: 'friendly',
  };

  if (!supabase) {
    return defaultConfig;
  }

  const { data, error } = await supabase
    .from('chatbot_config')
    .select('*')
    .eq('key', 'system_prompt')
    .single();

  if (error || !data) {
    return defaultConfig;
  }

  return data.value as SystemPromptConfig;
}

/**
 * Format pricing content for the prompt
 */
function formatPricingContent(content: PricingContent): string {
  const sections: string[] = ['## TARIFICATION\n'];

  // Plans
  if (content.plans?.length) {
    sections.push('### Plans disponibles:');
    content.plans.forEach((plan) => {
      sections.push(`- **${plan.name}** (${plan.basePrice}€): ${plan.description}`);
      if (plan.features?.length) {
        sections.push(`  Inclus: ${plan.features.join(', ')}`);
      }
    });
    sections.push('');
  }

  // Packs
  if (content.packs?.length) {
    sections.push('### Packs additionnels:');
    content.packs.forEach((pack) => {
      sections.push(`- **${pack.name}** (${pack.price}€): ${pack.description}`);
    });
    sections.push('');
  }

  // Urgency
  if (content.urgency?.length) {
    sections.push('### Options d\'urgence:');
    content.urgency.forEach((opt) => {
      sections.push(`- ${opt.label}: ${opt.description} (x${opt.multiplier})`);
    });
    sections.push('');
  }

  // Maintenance
  if (content.maintenance?.length) {
    sections.push('### Options de maintenance:');
    content.maintenance.forEach((opt) => {
      sections.push(`- ${opt.label}: ${opt.description} (${opt.monthlyPrice}€/mois)`);
    });
    sections.push('');
  }

  // Extra screens
  if (content.extraScreens) {
    sections.push('### Prix des écrans supplémentaires:');
    Object.entries(content.extraScreens).forEach(([complexity, price]) => {
      sections.push(`- Écran ${complexity}: ${price}€`);
    });
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Format FAQ content for the prompt
 */
function formatFAQContent(content: FAQContent): string {
  const sections: string[] = ['## FAQ\n'];

  content.items?.forEach((item) => {
    sections.push(`**Q: ${item.question}**`);
    sections.push(`R: ${item.answer}\n`);
  });

  return sections.join('\n');
}

/**
 * Format company info content for the prompt
 */
function formatCompanyInfoContent(content: CompanyInfoContent): string {
  const sections: string[] = ['## À PROPOS DE LEVEL APP\n'];

  if (content.name) {
    sections.push(`**Nom:** ${content.name}`);
  }
  if (content.description) {
    sections.push(`**Description:** ${content.description}`);
  }
  if (content.mission) {
    sections.push(`**Mission:** ${content.mission}`);
  }
  if (content.values?.length) {
    sections.push(`**Valeurs:** ${content.values.join(', ')}`);
  }
  if (content.contact) {
    sections.push('**Contact:**');
    if (content.contact.email) sections.push(`  - Email: ${content.contact.email}`);
    if (content.contact.phone) sections.push(`  - Téléphone: ${content.contact.phone}`);
    if (content.contact.address) sections.push(`  - Adresse: ${content.contact.address}`);
  }

  return sections.join('\n');
}

/**
 * Format case studies content for the prompt
 */
function formatCaseStudiesContent(content: CaseStudyContent): string {
  const sections: string[] = ['## ÉTUDES DE CAS\n'];

  content.projects?.forEach((project) => {
    sections.push(`### ${project.name} (${project.type})`);
    sections.push(`${project.shortDesc}`);
    if (project.problem) sections.push(`**Problème:** ${project.problem}`);
    if (project.solution) sections.push(`**Solution:** ${project.solution}`);
    if (project.results?.length) {
      sections.push(`**Résultats:** ${project.results.join(', ')}`);
    }
    if (project.tags?.length) {
      sections.push(`**Technologies:** ${project.tags.join(', ')}`);
    }
    sections.push('');
  });

  return sections.join('\n');
}

/**
 * Format process content for the prompt
 */
function formatProcessContent(content: ProcessContent): string {
  const sections: string[] = ['## NOTRE PROCESSUS\n'];

  content.steps?.forEach((step, index) => {
    sections.push(`${index + 1}. **${step.title}**`);
    sections.push(`   ${step.description}`);
    if (step.duration) {
      sections.push(`   Durée: ${step.duration}`);
    }
  });

  return sections.join('\n');
}

/**
 * Format custom context content for the prompt
 */
function formatCustomContextContent(content: CustomContextContent): string {
  const sections: string[] = ['## CONTEXTE ADDITIONNEL\n'];

  if (content.instructions) {
    sections.push(`**Instructions:** ${content.instructions}\n`);
  }
  if (content.text) {
    sections.push(content.text);
  }

  return sections.join('\n');
}

/**
 * Format a knowledge entry based on its section type
 */
function formatKnowledgeEntry(entry: KnowledgeEntry): string {
  const sectionFormatters: Record<KnowledgeSection, (content: unknown) => string> = {
    pricing: (c) => formatPricingContent(c as PricingContent),
    faq: (c) => formatFAQContent(c as FAQContent),
    company_info: (c) => formatCompanyInfoContent(c as CompanyInfoContent),
    case_studies: (c) => formatCaseStudiesContent(c as CaseStudyContent),
    process: (c) => formatProcessContent(c as ProcessContent),
    custom_context: (c) => formatCustomContextContent(c as CustomContextContent),
  };

  const formatter = sectionFormatters[entry.section as KnowledgeSection];
  if (formatter) {
    return formatter(entry.content);
  }

  return '';
}

/**
 * Build the complete system prompt from knowledge base
 */
export async function buildSystemPrompt(): Promise<string> {
  const [config, entries] = await Promise.all([
    fetchSystemPromptConfig(),
    fetchKnowledgeEntries(),
  ]);

  const parts: string[] = [config.prompt, '\n---\n'];

  // Add knowledge sections
  if (entries.length > 0) {
    entries.forEach((entry) => {
      const formatted = formatKnowledgeEntry(entry);
      if (formatted) {
        parts.push(formatted);
        parts.push('\n---\n');
      }
    });
  } else {
    // Use fallback knowledge if no entries in database
    parts.push(getFallbackKnowledge());
  }

  return parts.join('\n');
}

/**
 * Fallback knowledge when database is empty
 */
function getFallbackKnowledge(): string {
  return `
## TARIFICATION

### Plans disponibles:
- **Starter** (2000€): Pour les MVPs et premiers lancements
  Inclus: Jusqu'à 10 écrans, Design standard, Support email, Livraison 4 semaines
- **Business** (5000€): Pour les projets établis (Recommandé)
  Inclus: Jusqu'à 25 écrans, Design premium, Support prioritaire, Dashboard admin, Livraison 6 semaines
- **Premium** (12000€): Solutions entreprise
  Inclus: Écrans illimités, Design sur mesure, Support dédié, Architecture scalable, Maintenance 6 mois incluse

### Packs additionnels:
- **Pack Authentification** (800€): Email/Password, Social Login, Gestion de profil
- **Pack Paiement** (1200€): Paiement unique, Abonnements, Factures automatiques
- **Pack Admin** (1500€): Vue d'ensemble, Gestion utilisateurs, Analytics
- **Pack Notifications** (600€): Push iOS/Android, Emails transactionnels, Templates

### Options d'urgence:
- Normal: 4-6 semaines (x1)
- Rapide: 2-3 semaines (x1.3)
- Urgent: 1-2 semaines (x1.6)

## FAQ

**Q: Combien coûte le développement d'une application ?**
R: Le budget démarre à partir de 2 000€ pour un MVP avec un périmètre défini. Le coût final dépend des fonctionnalités, du design et de la complexité du projet.

**Q: En combien de temps mon application est-elle développée ?**
R: La majorité des projets sont livrés en 30 jours, une fois le périmètre validé. Les applications plus complexes peuvent évoluer par itérations successives.

**Q: L'application sera-t-elle disponible sur l'App Store et Google Play ?**
R: Oui, si vous le souhaitez. Nous développons aussi des applications privées, non listées sur les stores.

**Q: Je n'ai pas de connaissances techniques, est-ce un problème ?**
R: Absolument pas. Level App vous accompagne de la définition du projet jusqu'à la livraison.

**Q: Puis-je commencer avec un MVP et faire évoluer l'app ensuite ?**
R: Oui, c'est même notre approche recommandée.

**Q: Mon projet est-il confidentiel ?**
R: Oui. Tous les projets sont traités avec confidentialité.

**Q: Comment démarrer un projet ?**
R: Réservez un appel gratuit. Nous échangeons sur votre idée, votre besoin et votre budget, puis vous recevez une proposition claire.

## À PROPOS DE LEVEL APP

Level App est une agence de développement d'applications mobiles et web spécialisée dans la création de solutions sur mesure pour les entrepreneurs et entreprises.

**Mission:** Transformer vos idées en applications performantes et rentables.

**Services:**
- Développement d'applications mobiles (iOS, Android)
- Applications web et SaaS
- Automatisations et intégrations
- Landing pages et sites vitrines
`;
}
