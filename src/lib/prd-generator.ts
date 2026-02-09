// PRD Generator - AI-powered PRD question generation and document creation

import { createChatCompletion } from '@/lib/deepseek';
import type {
  GenerateQuestionsRequest,
  GeneratePRDRequest,
  PRDQuestion,
} from '@/types/prd';

/**
 * Extract valid JSON from AI response that may contain markdown fences or extra text.
 * Tries multiple strategies before giving up.
 */
function extractJSON<T>(raw: string): T {
  const trimmed = raw.trim();

  // Strategy 1: Direct parse (ideal case)
  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }

  // Strategy 2: Strip markdown code fences (```json ... ```)
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // continue
    }
  }

  // Strategy 3: Find first [ ... ] or { ... } in the text
  const bracketStart = trimmed.indexOf('[');
  const braceStart = trimmed.indexOf('{');
  let start = -1;
  let endChar = '';

  if (bracketStart >= 0 && (braceStart < 0 || bracketStart < braceStart)) {
    start = bracketStart;
    endChar = ']';
  } else if (braceStart >= 0) {
    start = braceStart;
    endChar = '}';
  }

  if (start >= 0) {
    // Find matching closing bracket/brace from end of string
    const lastEnd = trimmed.lastIndexOf(endChar);
    if (lastEnd > start) {
      try {
        return JSON.parse(trimmed.substring(start, lastEnd + 1));
      } catch {
        // continue
      }
    }
  }

  // Strategy 4: Try fixing common JSON issues (trailing commas, single quotes)
  try {
    const cleaned = trimmed
      .replace(/,\s*([}\]])/g, '$1') // trailing commas
      .replace(/'/g, '"'); // single quotes to double
    return JSON.parse(cleaned);
  } catch {
    // continue
  }

  throw new Error(
    `Impossible de parser la reponse IA comme JSON. Debut de la reponse: "${trimmed.substring(0, 200)}..."`
  );
}

/**
 * Generate targeted PRD questions based on quote data using DeepSeek AI
 */
export async function generatePRDQuestions(
  quoteData: GenerateQuestionsRequest
): Promise<PRDQuestion[]> {
  const systemPrompt = `Tu es un Product Manager senior specialise dans les projets web et mobile.
Tu analyses un devis pour un projet client afin d'identifier les informations manquantes qui sont cruciales pour l'equipe de developpement.

Ton role est de generer des questions ciblees, groupees en 4 categories:
1. user_flows: Questions sur les parcours utilisateurs pour chaque fonctionnalite selectionnee (3-6 questions)
2. data_content: Questions sur les entites de donnees, relations, structure du contenu (3-6 questions)
3. business_rules: Questions sur les regles metier, gestion des erreurs, cas limites (3-6 questions)
4. design_ux: Questions sur le layout, sites de reference, comportements UI (3-6 questions)

Pour chaque question, fournis:
- id: un identifiant unique (format uuid v4)
- stepId: la categorie (user_flows, data_content, business_rules, design_ux)
- question: la question en francais, claire et specifique
- context: pourquoi cette question est importante pour l'equipe dev (en francais)
- suggestedAnswer: une reponse suggeree basee sur les patterns courants du secteur (en francais, optionnel mais fortement recommande)
- relatedFeature: le nom de la fonctionnalite liee (optionnel)
- priority: "must_answer" pour les questions critiques, "recommended" pour les importantes, "optional" pour les complementaires

Concentre-toi sur:
- Les informations qu'un commercial aurait oublie de demander
- Les details techniques necessaires pour chaque fonctionnalite activee
- Les edge cases et scenarios d'erreur
- Les preferences UX specifiques au secteur du client

IMPORTANT: Reponds UNIQUEMENT avec un tableau JSON valide (commencant par [ et terminant par ]). Pas de texte, pas de markdown, pas de code fences. Juste le JSON.`;

  const userPrompt = `Voici les donnees du devis a analyser:

**Client:**
- Entreprise: ${quoteData.clientInfo.company || 'Non renseigne'}
- Secteur: ${quoteData.clientInfo.sector || 'Non renseigne'}

**Projet:**
- Nom: ${quoteData.projectContext.projectName || 'Non renseigne'}
- Probleme a resoudre: ${quoteData.projectContext.problemToSolve || 'Non renseigne'}
- Type: ${quoteData.projectContext.projectType || 'Non renseigne'}
- Utilisateurs cibles: ${quoteData.projectContext.targetUsers || 'Non renseigne'}

**Plan selectionne:** ${quoteData.selectedPlan || 'Non renseigne'}
**Packs additionnels:** ${quoteData.selectedPacks.length > 0 ? quoteData.selectedPacks.join(', ') : 'Aucun'}

**Fonctionnalites simples:** ${JSON.stringify(quoteData.simpleFeatures, null, 2)}

**Fonctionnalites avancees:** ${quoteData.advancedFeatures.length > 0 ? quoteData.advancedFeatures.join(', ') : 'Aucune'}

**Design:**
- Style: ${quoteData.design.style || 'Non renseigne'}
- Mode sombre: ${quoteData.design.darkMode ? 'Oui' : 'Non'}
- Animations: ${quoteData.design.animations ? 'Oui' : 'Non'}

**Notes:**
- Indispensable: ${quoteData.notes.indispensable || 'Aucune'}
- Nice to have: ${quoteData.notes.niceToHave || 'Aucune'}

Genere les questions PRD ciblees pour ce projet. Reponds avec un tableau JSON valide uniquement.`;

  const response = await createChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { temperature: 0.4, max_tokens: 4000 }
  );

  const content = response.choices[0].message.content;
  const questions: PRDQuestion[] = extractJSON(content);

  // Validate structure
  const validStepIds = ['user_flows', 'data_content', 'business_rules', 'design_ux'];
  const validPriorities = ['must_answer', 'recommended', 'optional'];

  return questions.filter(
    (q) =>
      q.id &&
      q.stepId &&
      validStepIds.includes(q.stepId) &&
      q.question &&
      q.context &&
      validPriorities.includes(q.priority)
  );
}

/**
 * Generate a comprehensive PRD document from quote data and wizard answers
 */
export async function generatePRDDocument(
  request: GeneratePRDRequest
): Promise<string> {
  const { quoteData, answers, questions, selectedFeatures } = request;

  const featureScopeBlock = selectedFeatures && selectedFeatures.length > 0
    ? `\n\nREGLE CRITIQUE: Le PRD ne doit couvrir QUE les fonctionnalites listees ci-dessous.
Ne jamais ajouter, suggerer ou specifier de fonctionnalites qui ne sont pas dans cette liste.
Si une fonctionnalite connexe serait utile mais n'est pas selectionnee, l'ajouter dans
une section "Annexe: Suggestions d'upsell" en fin de document avec son prix.

Fonctionnalites selectionnees et payees:
${selectedFeatures.map(f => `- ${f.featureName} (${f.category}) - Prix: ${f.price} EUR ${f.fromPack ? `[Inclus ${f.fromPack}]` : '[A la carte]'}`).join('\n')}`
    : '';

  const systemPrompt = `Tu es un Product Manager technique senior qui genere des PRD (Product Requirements Document) prets pour le vibecoding.
Le PRD sera utilise par une equipe dev qui travaille avec Claude Opus comme assistant de code.

Genere un PRD complet en markdown avec les sections suivantes:
1. **Vue d'ensemble du projet** - contexte business, objectifs
2. **Personas utilisateurs** - deduits du secteur et des utilisateurs cibles
3. **Specifications par fonctionnalite** - pour chaque fonctionnalite:
   - User stories (format: En tant que [persona], je veux [action] afin de [benefice])
   - Criteres d'acceptation (concrets et testables)
   - Flux utilisateur (etapes detaillees)
   - Modele de donnees (entites, relations)
   - Regles metier
   - Cas limites et gestion d'erreurs
   - Notes techniques (ex: "Utiliser Supabase RLS pour l'authentification")
   - Priorite: must_have / should_have / nice_to_have
4. **Direction design & UX** - notes sur le design, references
5. **Approche technique suggeree** - stack, architecture, patterns recommandes
6. **Ordre de priorite** - dans quel ordre implementer
7. **Metriques de succes** - comment mesurer le succes du projet
8. **Annexe: Suggestions d'upsell** - fonctionnalites non selectionnees mais utiles, avec prix

Regles:
- Tout en francais
- Criteres d'acceptation concrets, pas vagues
- Suggestions techniques specifiques (ex: "utiliser Supabase RLS", "React Hook Form pour les formulaires")
- Structure markdown claire avec headers, listes, code blocks
- Le PRD doit etre directement utilisable par Claude Opus pour generer du code${featureScopeBlock}`;

  // Build a question lookup for matching answers to their question text
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // Format answers with FULL question text so the AI understands context
  const formattedAnswers = answers
    .map((a) => {
      const q = questionMap.get(a.questionId);
      const questionText = q?.question || `Question ID: ${a.questionId}`;
      const featureTag = q?.relatedFeature ? ` [${q.relatedFeature}]` : '';
      return `**Q:** ${questionText}${featureTag}\n**R:** ${a.answer}${a.isAISuggested ? ' _(suggestion IA acceptee)_' : ''}`;
    })
    .join('\n\n');

  const userPrompt = `Genere le PRD complet pour ce projet:

**Client:**
- Entreprise: ${quoteData.clientInfo.company || 'Non renseigne'}
- Secteur: ${quoteData.clientInfo.sector || 'Non renseigne'}

**Projet:**
- Nom: ${quoteData.projectContext.projectName || 'Non renseigne'}
- Probleme a resoudre: ${quoteData.projectContext.problemToSolve || 'Non renseigne'}
- Type: ${quoteData.projectContext.projectType || 'Non renseigne'}
- Utilisateurs cibles: ${quoteData.projectContext.targetUsers || 'Non renseigne'}

**Plan selectionne:** ${quoteData.selectedPlan || 'Non renseigne'}
**Packs additionnels:** ${quoteData.selectedPacks.length > 0 ? quoteData.selectedPacks.join(', ') : 'Aucun'}

**Fonctionnalites simples:** ${JSON.stringify(quoteData.simpleFeatures, null, 2)}

**Fonctionnalites avancees:** ${quoteData.advancedFeatures.length > 0 ? quoteData.advancedFeatures.join(', ') : 'Aucune'}

**Design:**
- Style: ${quoteData.design.style || 'Non renseigne'}
- Mode sombre: ${quoteData.design.darkMode ? 'Oui' : 'Non'}
- Animations: ${quoteData.design.animations ? 'Oui' : 'Non'}

**Notes:**
- Indispensable: ${quoteData.notes.indispensable || 'Aucune'}
- Nice to have: ${quoteData.notes.niceToHave || 'Aucune'}

---

**Reponses detaillees aux questions PRD:**

${formattedAnswers || 'Aucune reponse fournie'}

---

Genere le PRD complet en markdown.`;

  const response = await createChatCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { temperature: 0.3, max_tokens: 8000 }
  );

  return response.choices[0].message.content;
}
