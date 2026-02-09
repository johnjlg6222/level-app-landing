/**
 * Seed script for pricing data.
 * Inserts 120+ features across 15 categories with 4 partner prices,
 * 3 main packs + 7 category packs, and pack-feature junctions.
 *
 * Usage: npx tsx scripts/seed-pricing.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * environment variables (from .env.local).
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Feature data (120+ features across 15 categories, 4 partner prices) ---
interface FeatureSeed {
  name: string;
  description: string;
  category: string;
  price_john: number;
  price_harouna: number;
  price_andre: number;
  price_christophe: number;
  sort_order: number;
}

const features: FeatureSeed[] = [
  // === Authentification & Gestion des utilisateurs (8 features) ===
  { name: 'Login Email/Password', description: 'Connexion classique par email et mot de passe', category: 'Authentification & Gestion des utilisateurs', price_john: 200, price_harouna: 180, price_andre: 220, price_christophe: 200, sort_order: 1 },
  { name: 'Social Login (Google, Facebook)', description: 'Connexion via reseaux sociaux', category: 'Authentification & Gestion des utilisateurs', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 300, sort_order: 2 },
  { name: 'Apple Sign In', description: 'Connexion via Apple ID', category: 'Authentification & Gestion des utilisateurs', price_john: 250, price_harouna: 230, price_andre: 280, price_christophe: 260, sort_order: 3 },
  { name: 'Authentification 2FA', description: 'Double authentification SMS ou app', category: 'Authentification & Gestion des utilisateurs', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 4 },
  { name: 'Gestion de profil utilisateur', description: 'Edition profil, avatar, preferences', category: 'Authentification & Gestion des utilisateurs', price_john: 300, price_harouna: 280, price_andre: 320, price_christophe: 300, sort_order: 5 },
  { name: 'Systeme de roles et permissions', description: 'Admin, moderateur, utilisateur, etc.', category: 'Authentification & Gestion des utilisateurs', price_john: 500, price_harouna: 450, price_andre: 550, price_christophe: 480, sort_order: 6 },
  { name: 'Mot de passe oublie / Reset', description: 'Flow de recuperation de mot de passe', category: 'Authentification & Gestion des utilisateurs', price_john: 150, price_harouna: 140, price_andre: 180, price_christophe: 160, sort_order: 7 },
  { name: 'Multi-tenant / Organisations', description: 'Gestion de plusieurs organisations', category: 'Authentification & Gestion des utilisateurs', price_john: 800, price_harouna: 750, price_andre: 900, price_christophe: 820, sort_order: 8 },

  // === Paiements & Facturation (9 features) ===
  { name: 'Paiement unique Stripe', description: 'Paiement one-shot par carte bancaire', category: 'Paiements & Facturation', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 1 },
  { name: 'Abonnements recurrents', description: 'Plans mensuels/annuels avec Stripe Billing', category: 'Paiements & Facturation', price_john: 600, price_harouna: 550, price_andre: 700, price_christophe: 620, sort_order: 2 },
  { name: 'Gestion des factures', description: 'Generation et envoi de factures PDF', category: 'Paiements & Facturation', price_john: 500, price_harouna: 450, price_andre: 550, price_christophe: 500, sort_order: 3 },
  { name: 'Remboursements', description: 'Gestion des remboursements partiels/complets', category: 'Paiements & Facturation', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 320, sort_order: 4 },
  { name: 'Coupons et codes promo', description: 'Systeme de reduction', category: 'Paiements & Facturation', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 5 },
  { name: 'Panier d\'achats', description: 'Panier multi-produits', category: 'Paiements & Facturation', price_john: 450, price_harouna: 420, price_andre: 500, price_christophe: 460, sort_order: 6 },
  { name: 'Paiement marketplace (Stripe Connect)', description: 'Split de paiements entre vendeurs', category: 'Paiements & Facturation', price_john: 900, price_harouna: 850, price_andre: 1000, price_christophe: 920, sort_order: 7 },
  { name: 'Historique des transactions', description: 'Liste et details des transactions', category: 'Paiements & Facturation', price_john: 250, price_harouna: 230, price_andre: 280, price_christophe: 260, sort_order: 8 },
  { name: 'Webhooks de paiement', description: 'Gestion des evenements Stripe (webhook)', category: 'Paiements & Facturation', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 9 },

  // === Base de donnees & Backend (8 features) ===
  { name: 'CRUD basique', description: 'Operations Create/Read/Update/Delete standard', category: 'Base de donnees & Backend', price_john: 200, price_harouna: 180, price_andre: 220, price_christophe: 200, sort_order: 1 },
  { name: 'Relations complexes', description: 'Many-to-many, polymorphisme, nested data', category: 'Base de donnees & Backend', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 2 },
  { name: 'API REST', description: 'Endpoints REST documentees', category: 'Base de donnees & Backend', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 3 },
  { name: 'API GraphQL', description: 'Schema GraphQL avec resolvers', category: 'Base de donnees & Backend', price_john: 600, price_harouna: 550, price_andre: 700, price_christophe: 620, sort_order: 4 },
  { name: 'Temps reel (Websockets)', description: 'Synchronisation en temps reel', category: 'Base de donnees & Backend', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 5 },
  { name: 'File d\'attente (Jobs/Queue)', description: 'Traitement asynchrone de taches', category: 'Base de donnees & Backend', price_john: 450, price_harouna: 420, price_andre: 500, price_christophe: 460, sort_order: 6 },
  { name: 'Cache (Redis)', description: 'Mise en cache pour performance', category: 'Base de donnees & Backend', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 410, sort_order: 7 },
  { name: 'Migrations et seeds', description: 'Scripts de migration et donnees de test', category: 'Base de donnees & Backend', price_john: 200, price_harouna: 180, price_andre: 250, price_christophe: 210, sort_order: 8 },

  // === Dashboard & Analytics (8 features) ===
  { name: 'Dashboard vue d\'ensemble', description: 'KPIs principaux, statistiques', category: 'Dashboard & Analytics', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 1 },
  { name: 'Graphiques interactifs', description: 'Charts, diagrammes, camemberts', category: 'Dashboard & Analytics', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 2 },
  { name: 'Tableaux de donnees avances', description: 'Tri, filtres, pagination, export', category: 'Dashboard & Analytics', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 3 },
  { name: 'Gestion des utilisateurs (admin)', description: 'CRUD utilisateurs, suspension, reset', category: 'Dashboard & Analytics', price_john: 500, price_harouna: 450, price_andre: 550, price_christophe: 500, sort_order: 4 },
  { name: 'Rapports automatiques', description: 'Generation de rapports periodiques', category: 'Dashboard & Analytics', price_john: 450, price_harouna: 420, price_andre: 500, price_christophe: 460, sort_order: 5 },
  { name: 'Widgets personnalisables', description: 'Dashboard modulaire drag & drop', category: 'Dashboard & Analytics', price_john: 600, price_harouna: 550, price_andre: 700, price_christophe: 620, sort_order: 6 },
  { name: 'Filtres de date et periodes', description: 'Selection de periodes pour analytics', category: 'Dashboard & Analytics', price_john: 200, price_harouna: 180, price_andre: 250, price_christophe: 210, sort_order: 7 },
  { name: 'Export de rapports (PDF/CSV)', description: 'Telechargement des rapports', category: 'Dashboard & Analytics', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 320, sort_order: 8 },

  // === Notifications (8 features) ===
  { name: 'Notifications push mobile', description: 'Push iOS et Android (FCM/APNS)', category: 'Notifications', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 1 },
  { name: 'Notifications push web', description: 'Push navigateur', category: 'Notifications', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 2 },
  { name: 'Emails transactionnels', description: 'Confirmation, reset, bienvenue', category: 'Notifications', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 300, sort_order: 3 },
  { name: 'Templates email personnalises', description: 'Templates HTML editables', category: 'Notifications', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 4 },
  { name: 'SMS / WhatsApp', description: 'Notifications par SMS ou WhatsApp', category: 'Notifications', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 5 },
  { name: 'Centre de notifications in-app', description: 'Liste de notifications dans l\'app', category: 'Notifications', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 6 },
  { name: 'Preferences de notifications', description: 'Opt-in/opt-out par canal et type', category: 'Notifications', price_john: 250, price_harouna: 230, price_andre: 300, price_christophe: 260, sort_order: 7 },
  { name: 'Notifications planifiees', description: 'Envoi programme a une date/heure', category: 'Notifications', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 8 },

  // === Calendrier & Planning (7 features) ===
  { name: 'Calendrier mensuel/hebdo', description: 'Vue calendrier avec evenements', category: 'Calendrier & Planning', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 1 },
  { name: 'Prise de rendez-vous', description: 'Booking en ligne avec creneaux', category: 'Calendrier & Planning', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 2 },
  { name: 'Sync Google Calendar', description: 'Synchronisation bidirectionnelle', category: 'Calendrier & Planning', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 410, sort_order: 3 },
  { name: 'Rappels automatiques', description: 'Rappels email/push avant evenements', category: 'Calendrier & Planning', price_john: 250, price_harouna: 230, price_andre: 300, price_christophe: 260, sort_order: 4 },
  { name: 'Gestion des disponibilites', description: 'Definition des heures disponibles', category: 'Calendrier & Planning', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 5 },
  { name: 'Planning d\'equipe', description: 'Vue planning multi-collaborateurs', category: 'Calendrier & Planning', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 6 },
  { name: 'Export iCal', description: 'Export au format iCalendar', category: 'Calendrier & Planning', price_john: 150, price_harouna: 140, price_andre: 180, price_christophe: 160, sort_order: 7 },

  // === Integrations tierces (9 features) ===
  { name: 'Integration Stripe', description: 'Paiements, facturation', category: 'Integrations tierces', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 1 },
  { name: 'Integration Google (Maps, Calendar)', description: 'APIs Google', category: 'Integrations tierces', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 2 },
  { name: 'Integration Slack', description: 'Notifications et commandes Slack', category: 'Integrations tierces', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 3 },
  { name: 'Integration Zapier/Make', description: 'Webhooks pour automatisations', category: 'Integrations tierces', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 4 },
  { name: 'API custom (REST)', description: 'API publique documentee', category: 'Integrations tierces', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 5 },
  { name: 'OAuth2 provider', description: 'Login avec votre app sur d\'autres sites', category: 'Integrations tierces', price_john: 600, price_harouna: 550, price_andre: 700, price_christophe: 620, sort_order: 6 },
  { name: 'Integration CRM (HubSpot, Salesforce)', description: 'Sync contacts et deals', category: 'Integrations tierces', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 7 },
  { name: 'Integration email (SendGrid, Mailgun)', description: 'Envoi d\'emails en masse', category: 'Integrations tierces', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 8 },
  { name: 'Integration analytics (Mixpanel, Amplitude)', description: 'Tracking avance', category: 'Integrations tierces', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 9 },

  // === Gestion de medias (8 features) ===
  { name: 'Upload de fichiers', description: 'Upload images, documents, videos', category: 'Gestion de medias', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 1 },
  { name: 'Galerie d\'images', description: 'Grille et lightbox d\'images', category: 'Gestion de medias', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 2 },
  { name: 'Crop et redimensionnement', description: 'Edition d\'image inline', category: 'Gestion de medias', price_john: 250, price_harouna: 230, price_andre: 300, price_christophe: 260, sort_order: 3 },
  { name: 'Video player embarque', description: 'Lecture video avec controles', category: 'Gestion de medias', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 4 },
  { name: 'CDN et optimisation', description: 'Images optimisees, lazy loading', category: 'Gestion de medias', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 5 },
  { name: 'Stockage cloud (S3/Supabase)', description: 'Stockage securise dans le cloud', category: 'Gestion de medias', price_john: 250, price_harouna: 230, price_andre: 300, price_christophe: 260, sort_order: 6 },
  { name: 'Gestion de documents PDF', description: 'Upload, preview, generation PDF', category: 'Gestion de medias', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 7 },
  { name: 'Avatar et photos de profil', description: 'Upload et crop d\'avatar', category: 'Gestion de medias', price_john: 200, price_harouna: 180, price_andre: 250, price_christophe: 210, sort_order: 8 },

  // === IA & Chatbot (8 features) ===
  { name: 'Chatbot IA (GPT/Claude)', description: 'Assistant conversationnel intelligent', category: 'IA & Chatbot', price_john: 600, price_harouna: 550, price_andre: 700, price_christophe: 620, sort_order: 1 },
  { name: 'RAG (Knowledge base)', description: 'IA alimentee par vos documents', category: 'IA & Chatbot', price_john: 800, price_harouna: 750, price_andre: 900, price_christophe: 820, sort_order: 2 },
  { name: 'Generation de contenu', description: 'Textes, descriptions, resumes par IA', category: 'IA & Chatbot', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 3 },
  { name: 'Analyse de sentiments', description: 'Detection du ton dans les messages', category: 'IA & Chatbot', price_john: 450, price_harouna: 420, price_andre: 500, price_christophe: 460, sort_order: 4 },
  { name: 'Recommandations IA', description: 'Suggestions personnalisees', category: 'IA & Chatbot', price_john: 550, price_harouna: 520, price_andre: 600, price_christophe: 560, sort_order: 5 },
  { name: 'Transcription vocale', description: 'Speech-to-text', category: 'IA & Chatbot', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 6 },
  { name: 'Moderation de contenu IA', description: 'Detection de contenu inapproprie', category: 'IA & Chatbot', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 7 },
  { name: 'Chat en direct (live chat)', description: 'Messagerie temps reel humain-to-humain', category: 'IA & Chatbot', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 8 },

  // === Recherche & Filtres (7 features) ===
  { name: 'Recherche full-text', description: 'Recherche textuelle dans tout le contenu', category: 'Recherche & Filtres', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 1 },
  { name: 'Filtres avances', description: 'Filtres multi-criteres combines', category: 'Recherche & Filtres', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 2 },
  { name: 'Autocompletion / Suggestions', description: 'Suggestions pendant la saisie', category: 'Recherche & Filtres', price_john: 250, price_harouna: 230, price_andre: 300, price_christophe: 260, sort_order: 3 },
  { name: 'Tri par pertinence', description: 'Classement intelligent des resultats', category: 'Recherche & Filtres', price_john: 200, price_harouna: 180, price_andre: 250, price_christophe: 210, sort_order: 4 },
  { name: 'Recherche geographique', description: 'Recherche par proximite / carte', category: 'Recherche & Filtres', price_john: 450, price_harouna: 420, price_andre: 500, price_christophe: 460, sort_order: 5 },
  { name: 'Facettes de recherche', description: 'Compteurs par categorie dans les filtres', category: 'Recherche & Filtres', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 6 },
  { name: 'Recherche Elasticsearch/Algolia', description: 'Moteur de recherche avance', category: 'Recherche & Filtres', price_john: 600, price_harouna: 550, price_andre: 700, price_christophe: 620, sort_order: 7 },

  // === Analytics avancee (8 features) ===
  { name: 'Tracking utilisateur', description: 'Suivi des actions et comportements', category: 'Analytics avancee', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 1 },
  { name: 'Funnel d\'analyse', description: 'Analyse des tunnels de conversion', category: 'Analytics avancee', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 2 },
  { name: 'Cohortes utilisateurs', description: 'Analyse par groupes d\'utilisateurs', category: 'Analytics avancee', price_john: 450, price_harouna: 420, price_andre: 500, price_christophe: 460, sort_order: 3 },
  { name: 'A/B Testing', description: 'Tests de variantes', category: 'Analytics avancee', price_john: 600, price_harouna: 550, price_andre: 700, price_christophe: 620, sort_order: 4 },
  { name: 'Heatmaps', description: 'Cartes de chaleur des clics', category: 'Analytics avancee', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 5 },
  { name: 'Dashboard analytics temps reel', description: 'Metriques en direct', category: 'Analytics avancee', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 6 },
  { name: 'Metriques de revenus', description: 'MRR, churn, LTV, ARPU', category: 'Analytics avancee', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 7 },
  { name: 'Alertes et seuils', description: 'Notifications quand un KPI depasse un seuil', category: 'Analytics avancee', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 8 },

  // === Export & Import de donnees (7 features) ===
  { name: 'Export CSV', description: 'Export des donnees en CSV', category: 'Export & Import de donnees', price_john: 200, price_harouna: 180, price_andre: 250, price_christophe: 210, sort_order: 1 },
  { name: 'Export Excel', description: 'Export XLSX avec mise en forme', category: 'Export & Import de donnees', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 2 },
  { name: 'Export PDF', description: 'Generation de rapports PDF', category: 'Export & Import de donnees', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 3 },
  { name: 'Import CSV/Excel', description: 'Import en masse depuis fichier', category: 'Export & Import de donnees', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 4 },
  { name: 'Import avec mapping de colonnes', description: 'Interface de mapping pour import', category: 'Export & Import de donnees', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 5 },
  { name: 'Export planifie', description: 'Export automatique periodique', category: 'Export & Import de donnees', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 6 },
  { name: 'API d\'export en masse', description: 'Endpoint pour export programmatique', category: 'Export & Import de donnees', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 7 },

  // === Localisation & i18n (7 features) ===
  { name: 'Multi-langue (2 langues)', description: 'Interface en 2 langues', category: 'Localisation & i18n', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 1 },
  { name: 'Multi-langue (5+ langues)', description: 'Interface en 5 langues ou plus', category: 'Localisation & i18n', price_john: 700, price_harouna: 650, price_andre: 800, price_christophe: 720, sort_order: 2 },
  { name: 'Detection automatique de langue', description: 'Detection basee sur le navigateur/IP', category: 'Localisation & i18n', price_john: 200, price_harouna: 180, price_andre: 250, price_christophe: 210, sort_order: 3 },
  { name: 'Traduction IA automatique', description: 'Traduction du contenu par IA', category: 'Localisation & i18n', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 4 },
  { name: 'Multi-devises', description: 'Prix affiches dans la devise locale', category: 'Localisation & i18n', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 5 },
  { name: 'Formats de date regionaux', description: 'Dates et nombres au format local', category: 'Localisation & i18n', price_john: 150, price_harouna: 140, price_andre: 180, price_christophe: 160, sort_order: 6 },
  { name: 'RTL support', description: 'Support des langues droite-a-gauche', category: 'Localisation & i18n', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 7 },

  // === UI/UX avancee (9 features) ===
  { name: 'Mode sombre', description: 'Theme dark/light switch', category: 'UI/UX avancee', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 1 },
  { name: 'Animations et micro-interactions', description: 'Transitions fluides, feedback visuel', category: 'UI/UX avancee', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 2 },
  { name: 'Design responsive avance', description: 'Adaptation tablette + mobile fine', category: 'UI/UX avancee', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 3 },
  { name: 'Drag & Drop', description: 'Interface de glisser-deposer', category: 'UI/UX avancee', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 4 },
  { name: 'Infinite scroll', description: 'Chargement continu au scroll', category: 'UI/UX avancee', price_john: 200, price_harouna: 180, price_andre: 250, price_christophe: 210, sort_order: 5 },
  { name: 'Skeleton loading', description: 'Placeholders animes pendant le chargement', category: 'UI/UX avancee', price_john: 150, price_harouna: 140, price_andre: 180, price_christophe: 160, sort_order: 6 },
  { name: 'Onboarding / Tour guide', description: 'Tutoriel interactif pour nouveaux utilisateurs', category: 'UI/UX avancee', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 7 },
  { name: 'PWA (Progressive Web App)', description: 'Installation sur mobile, offline', category: 'UI/UX avancee', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 8 },
  { name: 'Accessibilite (WCAG AA)', description: 'Conformite accessibilite', category: 'UI/UX avancee', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 9 },

  // === Securite avancee (8 features) ===
  { name: 'Chiffrement des donnees', description: 'Encryption at rest et in transit', category: 'Securite avancee', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 1 },
  { name: 'Rate limiting', description: 'Protection contre le brute force', category: 'Securite avancee', price_john: 250, price_harouna: 230, price_andre: 300, price_christophe: 260, sort_order: 2 },
  { name: 'Logs d\'audit', description: 'Traçabilite de toutes les actions', category: 'Securite avancee', price_john: 400, price_harouna: 380, price_andre: 450, price_christophe: 420, sort_order: 3 },
  { name: 'RGPD / Conformite', description: 'Export, suppression, consentement', category: 'Securite avancee', price_john: 500, price_harouna: 480, price_andre: 550, price_christophe: 520, sort_order: 4 },
  { name: 'Backup automatique', description: 'Sauvegardes quotidiennes', category: 'Securite avancee', price_john: 300, price_harouna: 280, price_andre: 350, price_christophe: 310, sort_order: 5 },
  { name: 'WAF / Protection DDoS', description: 'Pare-feu applicatif', category: 'Securite avancee', price_john: 350, price_harouna: 320, price_andre: 400, price_christophe: 360, sort_order: 6 },
  { name: 'Pentest / Audit securite', description: 'Test de penetration et audit', category: 'Securite avancee', price_john: 600, price_harouna: 550, price_andre: 700, price_christophe: 620, sort_order: 7 },
  { name: 'SSO (Single Sign-On)', description: 'SAML / OIDC pour entreprises', category: 'Securite avancee', price_john: 700, price_harouna: 650, price_andre: 800, price_christophe: 720, sort_order: 8 },
];

// --- Pack definitions ---
interface PackSeed {
  name: string;
  description: string;
  pack_type: 'main' | 'category';
  price: number;
  discount_percentage: number;
  sort_order: number;
  recommended: boolean;
  includes_pack_name?: string; // reference by name, resolved at insert time
  featureCategories?: string[]; // categories whose features are included
}

const packs: PackSeed[] = [
  // Main packs (cumulative)
  { name: 'Starter', description: 'Pour les MVPs et premiers lancements', pack_type: 'main', price: 2000, discount_percentage: 27, sort_order: 1, recommended: false },
  { name: 'Business', description: 'Pour les projets etablis', pack_type: 'main', price: 5000, discount_percentage: 29, sort_order: 2, recommended: true, includes_pack_name: 'Starter' },
  { name: 'Premium', description: 'Solutions entreprise', pack_type: 'main', price: 12000, discount_percentage: 29, sort_order: 3, recommended: false, includes_pack_name: 'Business' },

  // Category packs (~20% discount)
  { name: 'Pack Authentification', description: 'Systeme de connexion complet', pack_type: 'category', price: 1800, discount_percentage: 20, sort_order: 1, recommended: false, featureCategories: ['Authentification & Gestion des utilisateurs'] },
  { name: 'Pack Paiement', description: 'Integration Stripe complete', pack_type: 'category', price: 3200, discount_percentage: 20, sort_order: 2, recommended: false, featureCategories: ['Paiements & Facturation'] },
  { name: 'Pack Dashboard', description: 'Dashboard d\'administration complet', pack_type: 'category', price: 2500, discount_percentage: 20, sort_order: 3, recommended: false, featureCategories: ['Dashboard & Analytics'] },
  { name: 'Pack Notifications', description: 'Systeme de notifications multi-canal', pack_type: 'category', price: 2000, discount_percentage: 20, sort_order: 4, recommended: false, featureCategories: ['Notifications'] },
  { name: 'Pack Calendrier', description: 'Planification et rendez-vous', pack_type: 'category', price: 2000, discount_percentage: 20, sort_order: 5, recommended: false, featureCategories: ['Calendrier & Planning'] },
  { name: 'Pack IA', description: 'Intelligence artificielle et chatbot', pack_type: 'category', price: 3500, discount_percentage: 20, sort_order: 6, recommended: false, featureCategories: ['IA & Chatbot'] },
  { name: 'Pack Securite', description: 'Securite avancee et conformite', pack_type: 'category', price: 2800, discount_percentage: 20, sort_order: 7, recommended: false, featureCategories: ['Securite avancee'] },
];

async function seed() {
  console.log('Starting pricing seed...');

  // 1. Clear existing data (in order to avoid duplicates)
  console.log('Clearing existing data...');
  await supabase.from('pricing_pack_features').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('pricing_packs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('pricing_features').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Insert features
  console.log(`Inserting ${features.length} features...`);
  const { data: insertedFeatures, error: featError } = await supabase
    .from('pricing_features')
    .insert(features.map(f => ({
      name: f.name,
      description: f.description,
      category: f.category,
      price_john: f.price_john,
      price_harouna: f.price_harouna,
      price_andre: f.price_andre,
      price_christophe: f.price_christophe,
      sort_order: f.sort_order,
      is_active: true,
    })))
    .select();

  if (featError) {
    console.error('Error inserting features:', featError);
    process.exit(1);
  }
  console.log(`Inserted ${insertedFeatures?.length || 0} features`);

  // Build lookup by name
  const featuresByName = new Map((insertedFeatures || []).map(f => [f.name, f]));
  const featuresByCategory = new Map<string, typeof insertedFeatures>();
  for (const f of insertedFeatures || []) {
    const existing = featuresByCategory.get(f.category) || [];
    existing.push(f);
    featuresByCategory.set(f.category, existing);
  }

  // 3. Insert packs (without includes_pack_id first)
  console.log(`Inserting ${packs.length} packs...`);
  const { data: insertedPacks, error: packError } = await supabase
    .from('pricing_packs')
    .insert(packs.map(p => ({
      name: p.name,
      description: p.description,
      pack_type: p.pack_type,
      price: p.price,
      discount_percentage: p.discount_percentage,
      sort_order: p.sort_order,
      recommended: p.recommended,
      is_active: true,
    })))
    .select();

  if (packError) {
    console.error('Error inserting packs:', packError);
    process.exit(1);
  }
  console.log(`Inserted ${insertedPacks?.length || 0} packs`);

  // Build pack lookup
  const packsByName = new Map((insertedPacks || []).map(p => [p.name, p]));

  // 4. Update cumulative pack relationships
  for (const packDef of packs) {
    if (packDef.includes_pack_name) {
      const pack = packsByName.get(packDef.name);
      const includesPack = packsByName.get(packDef.includes_pack_name);
      if (pack && includesPack) {
        await supabase
          .from('pricing_packs')
          .update({ includes_pack_id: includesPack.id })
          .eq('id', pack.id);
        console.log(`Set ${packDef.name} includes ${packDef.includes_pack_name}`);
      }
    }
  }

  // 5. Insert pack-feature junctions for category packs
  const junctions: { pack_id: string; feature_id: string }[] = [];

  for (const packDef of packs) {
    if (packDef.featureCategories) {
      const pack = packsByName.get(packDef.name);
      if (!pack) continue;

      for (const category of packDef.featureCategories) {
        const catFeatures = featuresByCategory.get(category) || [];
        for (const f of catFeatures) {
          junctions.push({ pack_id: pack.id, feature_id: f.id });
        }
      }
    }
  }

  // For main packs, assign a selection of features
  const starterPack = packsByName.get('Starter');
  const businessPack = packsByName.get('Business');
  const premiumPack = packsByName.get('Premium');

  // Starter: basic auth, basic payments, basic database features
  const starterFeatureNames = [
    'Login Email/Password', 'Gestion de profil utilisateur', 'Mot de passe oublie / Reset',
    'Paiement unique Stripe', 'CRUD basique', 'API REST',
    'Upload de fichiers', 'Export CSV',
  ];

  // Business: Starter + dashboard, notifications, calendar, more auth, more payment
  const businessFeatureNames = [
    ...starterFeatureNames,
    'Social Login (Google, Facebook)', 'Systeme de roles et permissions',
    'Abonnements recurrents', 'Gestion des factures', 'Historique des transactions',
    'Relations complexes', 'Temps reel (Websockets)',
    'Dashboard vue d\'ensemble', 'Graphiques interactifs', 'Tableaux de donnees avances',
    'Notifications push web', 'Emails transactionnels', 'Centre de notifications in-app',
    'Calendrier mensuel/hebdo', 'Rappels automatiques',
    'Integration Stripe', 'Integration Google (Maps, Calendar)',
    'Galerie d\'images', 'CDN et optimisation',
    'Recherche full-text', 'Filtres avances',
    'Tracking utilisateur',
    'Export Excel', 'Import CSV/Excel',
    'Mode sombre', 'Design responsive avance',
    'Rate limiting', 'Backup automatique',
  ];

  // Premium: Business + everything else
  const premiumFeatureNames = features.map(f => f.name);

  if (starterPack) {
    for (const name of starterFeatureNames) {
      const f = featuresByName.get(name);
      if (f) junctions.push({ pack_id: starterPack.id, feature_id: f.id });
    }
  }
  if (businessPack) {
    for (const name of businessFeatureNames) {
      const f = featuresByName.get(name);
      if (f) junctions.push({ pack_id: businessPack.id, feature_id: f.id });
    }
  }
  if (premiumPack) {
    for (const name of premiumFeatureNames) {
      const f = featuresByName.get(name);
      if (f) junctions.push({ pack_id: premiumPack.id, feature_id: f.id });
    }
  }

  // Deduplicate junctions
  const seen = new Set<string>();
  const uniqueJunctions = junctions.filter(j => {
    const key = `${j.pack_id}-${j.feature_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`Inserting ${uniqueJunctions.length} pack-feature junctions...`);
  // Insert in batches of 100
  for (let i = 0; i < uniqueJunctions.length; i += 100) {
    const batch = uniqueJunctions.slice(i, i + 100);
    const { error: juncError } = await supabase.from('pricing_pack_features').insert(batch);
    if (juncError) {
      console.error(`Error inserting junctions batch ${i}:`, juncError);
    }
  }

  // 6. Update maintenance config
  console.log('Updating config...');
  await supabase
    .from('pricing_config')
    .upsert({
      key: 'maintenance_tiers',
      value: {
        none: { label: 'Sans maintenance', monthlyPrice: 0, description: 'Support limite apres livraison' },
        basic: { label: 'Maintenance Basic', monthlyPrice: 350, description: 'Corrections de bugs' },
        standard: { label: 'Maintenance Standard', monthlyPrice: 700, description: 'Bugs + petites evolutions' },
        premium: { label: 'Maintenance Premium', monthlyPrice: 1133, description: 'Support complet + evolutions' },
      },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });

  console.log('Seed complete!');
  console.log(`Summary: ${insertedFeatures?.length} features, ${insertedPacks?.length} packs, ${uniqueJunctions.length} junctions`);
}

seed().catch(console.error);
