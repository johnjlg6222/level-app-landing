import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import {
  BASE_PLANS,
  PACKS,
  URGENCY_OPTIONS,
  MAINTENANCE_OPTIONS,
  EXTRA_SCREEN_PRICES,
} from '@/types/pricing';
import { projects } from '@/data/projects';
import type { KnowledgeSection } from '@/types/knowledge';

// FAQ data (from FAQSection.tsx)
const faqs = [
  {
    question: "Combien coûte le développement d'une application ?",
    answer: "Le budget démarre à partir de 2 000 € pour un MVP avec un périmètre défini. Le coût final dépend des fonctionnalités, du design et de la complexité du projet. Une estimation claire est fournie avant tout engagement.",
  },
  {
    question: "En combien de temps mon application est-elle développée ?",
    answer: "La majorité des projets sont livrés en 30 jours, une fois le périmètre validé. Les applications plus complexes peuvent évoluer par itérations successives.",
  },
  {
    question: "L'application sera-t-elle disponible sur l'App Store et Google Play ?",
    answer: "Oui, si vous le souhaitez. Nous développons aussi des applications privées, non listées sur les stores, pour des projets internes, confidentiels ou en phase de test.",
  },
  {
    question: "Je n'ai pas de connaissances techniques, est-ce un problème ?",
    answer: "Absolument pas. Level App vous accompagne de la définition du projet jusqu'à la livraison. Vous n'avez pas besoin d'être développeur pour lancer une application.",
  },
  {
    question: "Puis-je commencer avec un MVP et faire évoluer l'app ensuite ?",
    answer: "Oui, c'est même notre approche recommandée. Nous construisons une première version utile et fonctionnelle, puis faisons évoluer l'application selon vos retours et objectifs.",
  },
  {
    question: "Mon projet est-il confidentiel ?",
    answer: "Oui. Tous les projets sont traités avec confidentialité, et peuvent être couverts par un accord de confidentialité si nécessaire.",
  },
  {
    question: "Travaillez-vous uniquement sur des apps grand public ?",
    answer: "Non. Nous développons aussi bien des applications B2B, des apps métiers, que des applications grand public avec abonnement.",
  },
  {
    question: "Que se passe-t-il après la livraison ?",
    answer: "Vous êtes libre : d'utiliser l'application telle quelle, de la faire évoluer avec Level App, ou de poursuivre le développement à votre rythme. Aucune dépendance imposée.",
  },
  {
    question: "Comment démarrer un projet ?",
    answer: "Il suffit de réserver un appel gratuit. Nous échangeons sur votre idée, votre besoin et votre budget, puis vous recevez une proposition claire.",
  },
];

// Process steps (from ProcessSection concept)
const processSteps = [
  {
    title: "Appel découverte",
    description: "Échange gratuit de 30 minutes pour comprendre votre projet, vos objectifs et votre budget.",
    duration: "30 min",
  },
  {
    title: "Proposition & Devis",
    description: "Vous recevez une proposition claire avec périmètre, prix et délais. Pas de surprise.",
    duration: "24-48h",
  },
  {
    title: "Développement",
    description: "Nous développons votre application avec des points d'avancement réguliers.",
    duration: "2-6 semaines",
  },
  {
    title: "Livraison & Support",
    description: "Votre application est livrée, déployée et vous gardez la main sur les évolutions futures.",
    duration: "Continu",
  },
];

// Company info
const companyInfo = {
  name: "Level App",
  description: "Agence de développement d'applications mobiles et web spécialisée dans la création de solutions sur mesure pour les entrepreneurs et entreprises.",
  mission: "Transformer vos idées en applications performantes et rentables, avec un accompagnement de A à Z.",
  values: [
    "Transparence totale sur les prix et les délais",
    "Qualité premium sans compromis",
    "Accompagnement personnalisé",
    "Pas de dépendance imposée",
  ],
  contact: {
    email: "contact@levelapp.fr",
  },
};

// POST import existing data into knowledge base
export async function POST() {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const knowledgeEntries: Array<{
      section: KnowledgeSection;
      title: string;
      content: unknown;
      priority: number;
    }> = [
      {
        section: 'pricing',
        title: 'Tarification Level App',
        content: {
          plans: BASE_PLANS.map(plan => ({
            name: plan.name,
            basePrice: plan.basePrice,
            description: plan.description,
            features: plan.features,
          })),
          packs: PACKS.map(pack => ({
            name: pack.name,
            price: pack.price,
            description: pack.description,
            features: pack.features,
          })),
          urgency: URGENCY_OPTIONS.map(opt => ({
            label: opt.label,
            multiplier: opt.multiplier,
            description: opt.description,
          })),
          maintenance: MAINTENANCE_OPTIONS.map(opt => ({
            label: opt.label,
            monthlyPrice: opt.monthlyPrice,
            description: opt.description,
          })),
          extraScreens: EXTRA_SCREEN_PRICES,
        },
        priority: 100,
      },
      {
        section: 'faq',
        title: 'Questions Fréquentes',
        content: {
          items: faqs,
        },
        priority: 90,
      },
      {
        section: 'company_info',
        title: 'À propos de Level App',
        content: companyInfo,
        priority: 80,
      },
      {
        section: 'case_studies',
        title: 'Études de cas',
        content: {
          projects: projects.map(p => ({
            name: p.name,
            type: p.type,
            shortDesc: p.shortDesc,
            problem: p.problem,
            solution: p.solution,
            results: p.results,
            tags: p.tags,
          })),
        },
        priority: 70,
      },
      {
        section: 'process',
        title: 'Notre Processus',
        content: {
          steps: processSteps,
        },
        priority: 60,
      },
      {
        section: 'custom_context',
        title: 'Contexte personnalisé',
        content: {
          text: '',
          instructions: 'Ajoutez ici des instructions supplémentaires pour le chatbot.',
        },
        priority: 50,
      },
    ];

    // Upsert each entry (insert or update if exists)
    const results = [];
    for (const entry of knowledgeEntries) {
      const { data, error } = await supabase
        .from('chatbot_knowledge')
        .upsert(
          {
            section: entry.section,
            title: entry.title,
            content: entry.content,
            priority: entry.priority,
            is_active: true,
          },
          {
            onConflict: 'section',
          }
        )
        .select()
        .single();

      if (error) {
        results.push({ section: entry.section, success: false, error: error.message });
      } else {
        results.push({ section: entry.section, success: true, data });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `Import completed: ${successCount} success, ${failCount} failed`,
      results,
    });
  } catch (error) {
    console.error('Error importing knowledge:', error);
    return NextResponse.json(
      { error: 'Failed to import knowledge' },
      { status: 500 }
    );
  }
}
