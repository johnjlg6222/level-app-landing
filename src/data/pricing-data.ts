/**
 * Local pricing data — hardcoded from the Excel spreadsheet.
 * 125 features across 13 categories, 10 packs.
 * final_price = AVG of non-zero partner prices, rounded up to nearest 50.
 * No Supabase dependency.
 */

import type { PricingFeature, PricingPackWithFeatures } from '@/types/admin-pricing';

// Helper: compute AVG of non-zero prices, round up to nearest 50
function avg50(...prices: number[]): number {
  const nonZero = prices.filter(p => p > 0);
  if (nonZero.length === 0) return 0;
  const avg = nonZero.reduce((a, b) => a + b, 0) / nonZero.length;
  return Math.ceil(avg / 50) * 50;
}

// ─── Categories ──────────────────────────────────────────────
export const LOCAL_CATEGORIES = [
  'Authentification & Sécurité',
  'Paiements & Monétisation',
  'Base de Données & Données',
  'Dashboard & Admin',
  'Notifications',
  'Social & Communauté',
  'Calendrier & Planning',
  'Intégrations Externes',
  'Fonctionnalités Avancées',
  'Design & UI/UX',
  'Mobile Spécifique',
  'SEO & Performance',
  'Sécurité & Conformité',
] as const;

export type LocalCategory = (typeof LOCAL_CATEGORIES)[number];

// ─── Feature builder ─────────────────────────────────────────
let _sortCounter = 0;
function feat(
  id: string,
  name: string,
  description: string,
  category: string,
  pj: number, ph: number, pa: number, pc: number,
): PricingFeature {
  _sortCounter++;
  return {
    id,
    name,
    description,
    category,
    price_john: pj,
    price_harouna: ph,
    price_andre: pa,
    price_christophe: pc,
    final_price: avg50(pj, ph, pa, pc),
    sort_order: _sortCounter,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };
}

// ─── 125 Features ────────────────────────────────────────────

export const LOCAL_FEATURES: PricingFeature[] = [

  // ═══ Authentification & Sécurité (10 features) ═══
  feat('auth_email_password', 'Login Email/Password', 'Connexion classique par email et mot de passe', 'Authentification & Sécurité', 200, 180, 220, 200),
  feat('auth_social_login', 'Social Login (Google, Facebook)', 'Connexion via réseaux sociaux', 'Authentification & Sécurité', 300, 280, 350, 300),
  feat('auth_apple_signin', 'Apple Sign In', 'Connexion via Apple ID', 'Authentification & Sécurité', 250, 230, 280, 260),
  feat('auth_2fa', 'Authentification 2FA', 'Double authentification SMS ou app', 'Authentification & Sécurité', 400, 380, 450, 420),
  feat('auth_profile', 'Gestion de profil utilisateur', 'Edition profil, avatar, préférences', 'Authentification & Sécurité', 300, 280, 320, 300),
  feat('auth_roles', 'Système de rôles et permissions', 'Admin, modérateur, utilisateur, etc.', 'Authentification & Sécurité', 500, 450, 550, 480),
  feat('auth_password_reset', 'Mot de passe oublié / Reset', 'Flow de récupération de mot de passe', 'Authentification & Sécurité', 150, 140, 180, 160),
  feat('auth_multi_tenant', 'Multi-tenant / Organisations', 'Gestion de plusieurs organisations', 'Authentification & Sécurité', 800, 750, 900, 820),
  feat('auth_sso', 'SSO (Single Sign-On)', 'SAML / OIDC pour entreprises', 'Authentification & Sécurité', 700, 650, 800, 720),
  feat('auth_rate_limiting', 'Rate limiting', 'Protection contre le brute force', 'Authentification & Sécurité', 250, 230, 300, 260),

  // ═══ Paiements & Monétisation (9 features) ═══
  feat('pay_stripe_one', 'Paiement unique Stripe', 'Paiement one-shot par carte bancaire', 'Paiements & Monétisation', 400, 380, 450, 420),
  feat('pay_subscriptions', 'Abonnements récurrents', 'Plans mensuels/annuels avec Stripe Billing', 'Paiements & Monétisation', 600, 550, 700, 620),
  feat('pay_invoices', 'Gestion des factures', 'Génération et envoi de factures PDF', 'Paiements & Monétisation', 500, 450, 550, 500),
  feat('pay_refunds', 'Remboursements', 'Gestion des remboursements partiels/complets', 'Paiements & Monétisation', 300, 280, 350, 320),
  feat('pay_coupons', 'Coupons et codes promo', 'Système de réduction', 'Paiements & Monétisation', 350, 320, 400, 360),
  feat('pay_cart', 'Panier d\'achats', 'Panier multi-produits', 'Paiements & Monétisation', 450, 420, 500, 460),
  feat('pay_marketplace', 'Paiement marketplace (Stripe Connect)', 'Split de paiements entre vendeurs', 'Paiements & Monétisation', 900, 850, 1000, 920),
  feat('pay_history', 'Historique des transactions', 'Liste et détails des transactions', 'Paiements & Monétisation', 250, 230, 280, 260),
  feat('pay_webhooks', 'Webhooks de paiement', 'Gestion des événements Stripe (webhook)', 'Paiements & Monétisation', 300, 280, 350, 310),

  // ═══ Base de Données & Données (10 features) ═══
  feat('data_crud', 'CRUD basique', 'Opérations Create/Read/Update/Delete standard', 'Base de Données & Données', 200, 180, 220, 200),
  feat('data_relations', 'Relations complexes', 'Many-to-many, polymorphisme, nested data', 'Base de Données & Données', 400, 380, 450, 420),
  feat('data_api_rest', 'API REST', 'Endpoints REST documentées', 'Base de Données & Données', 350, 320, 400, 360),
  feat('data_api_graphql', 'API GraphQL', 'Schema GraphQL avec resolvers', 'Base de Données & Données', 600, 550, 700, 620),
  feat('data_realtime', 'Temps réel (Websockets)', 'Synchronisation en temps réel', 'Base de Données & Données', 500, 480, 550, 520),
  feat('data_queue', 'File d\'attente (Jobs/Queue)', 'Traitement asynchrone de tâches', 'Base de Données & Données', 450, 420, 500, 460),
  feat('data_cache', 'Cache (Redis)', 'Mise en cache pour performance', 'Base de Données & Données', 400, 380, 450, 410),
  feat('data_migrations', 'Migrations et seeds', 'Scripts de migration et données de test', 'Base de Données & Données', 200, 180, 250, 210),
  feat('data_export_csv', 'Export CSV', 'Export des données en CSV', 'Base de Données & Données', 200, 180, 250, 210),
  feat('data_import_csv', 'Import CSV/Excel', 'Import en masse depuis fichier', 'Base de Données & Données', 350, 320, 400, 360),

  // ═══ Dashboard & Admin (10 features) ═══
  feat('dash_overview', 'Dashboard vue d\'ensemble', 'KPIs principaux, statistiques', 'Dashboard & Admin', 400, 380, 450, 420),
  feat('dash_charts', 'Graphiques interactifs', 'Charts, diagrammes, camemberts', 'Dashboard & Admin', 350, 320, 400, 360),
  feat('dash_tables', 'Tableaux de données avancés', 'Tri, filtres, pagination, export', 'Dashboard & Admin', 400, 380, 450, 420),
  feat('dash_user_mgmt', 'Gestion des utilisateurs (admin)', 'CRUD utilisateurs, suspension, reset', 'Dashboard & Admin', 500, 450, 550, 500),
  feat('dash_reports', 'Rapports automatiques', 'Génération de rapports périodiques', 'Dashboard & Admin', 450, 420, 500, 460),
  feat('dash_widgets', 'Widgets personnalisables', 'Dashboard modulaire drag & drop', 'Dashboard & Admin', 600, 550, 700, 620),
  feat('dash_date_filters', 'Filtres de date et périodes', 'Sélection de périodes pour analytics', 'Dashboard & Admin', 200, 180, 250, 210),
  feat('dash_export_reports', 'Export de rapports (PDF/CSV)', 'Téléchargement des rapports', 'Dashboard & Admin', 300, 280, 350, 320),
  feat('dash_tracking', 'Tracking utilisateur', 'Suivi des actions et comportements', 'Dashboard & Admin', 350, 320, 400, 360),
  feat('dash_funnel', 'Funnel d\'analyse', 'Analyse des tunnels de conversion', 'Dashboard & Admin', 500, 480, 550, 520),

  // ═══ Notifications (8 features) ═══
  feat('notif_push_mobile', 'Notifications push mobile', 'Push iOS et Android (FCM/APNS)', 'Notifications', 400, 380, 450, 420),
  feat('notif_push_web', 'Notifications push web', 'Push navigateur', 'Notifications', 300, 280, 350, 310),
  feat('notif_email', 'Emails transactionnels', 'Confirmation, reset, bienvenue', 'Notifications', 300, 280, 350, 300),
  feat('notif_templates', 'Templates email personnalisés', 'Templates HTML éditables', 'Notifications', 350, 320, 400, 360),
  feat('notif_sms', 'SMS / WhatsApp', 'Notifications par SMS ou WhatsApp', 'Notifications', 400, 380, 450, 420),
  feat('notif_center', 'Centre de notifications in-app', 'Liste de notifications dans l\'app', 'Notifications', 350, 320, 400, 360),
  feat('notif_prefs', 'Préférences de notifications', 'Opt-in/opt-out par canal et type', 'Notifications', 250, 230, 300, 260),
  feat('notif_scheduled', 'Notifications planifiées', 'Envoi programmé à une date/heure', 'Notifications', 300, 280, 350, 310),

  // ═══ Social & Communauté (10 features) ═══
  feat('social_chat', 'Chat en direct (live chat)', 'Messagerie temps réel humain-to-humain', 'Social & Communauté', 500, 480, 550, 520),
  feat('social_forum', 'Forum / Discussions', 'Fils de discussion communautaires', 'Social & Communauté', 450, 420, 500, 460),
  feat('social_comments', 'Commentaires', 'Système de commentaires sur le contenu', 'Social & Communauté', 250, 230, 300, 260),
  feat('social_likes', 'Likes / Réactions', 'Système de likes et réactions', 'Social & Communauté', 200, 180, 250, 210),
  feat('social_followers', 'Abonnements / Followers', 'Suivre d\'autres utilisateurs', 'Social & Communauté', 300, 280, 350, 310),
  feat('social_sharing', 'Partage social', 'Partager du contenu sur les réseaux', 'Social & Communauté', 200, 180, 250, 210),
  feat('social_messaging', 'Messagerie privée', 'Messages directs entre utilisateurs', 'Social & Communauté', 450, 420, 500, 460),
  feat('social_groups', 'Groupes / Communautés', 'Création et gestion de groupes', 'Social & Communauté', 400, 380, 450, 420),
  feat('social_feed', 'Fil d\'actualité', 'Feed personnalisé type réseau social', 'Social & Communauté', 500, 480, 550, 520),
  feat('social_moderation', 'Modération de contenu', 'Outils de modération communautaire', 'Social & Communauté', 350, 320, 400, 360),

  // ═══ Calendrier & Planning (7 features) ═══
  feat('cal_monthly', 'Calendrier mensuel/hebdo', 'Vue calendrier avec événements', 'Calendrier & Planning', 400, 380, 450, 420),
  feat('cal_booking', 'Prise de rendez-vous', 'Booking en ligne avec créneaux', 'Calendrier & Planning', 500, 480, 550, 520),
  feat('cal_google_sync', 'Sync Google Calendar', 'Synchronisation bidirectionnelle', 'Calendrier & Planning', 400, 380, 450, 410),
  feat('cal_reminders', 'Rappels automatiques', 'Rappels email/push avant événements', 'Calendrier & Planning', 250, 230, 300, 260),
  feat('cal_availability', 'Gestion des disponibilités', 'Définition des heures disponibles', 'Calendrier & Planning', 350, 320, 400, 360),
  feat('cal_team', 'Planning d\'équipe', 'Vue planning multi-collaborateurs', 'Calendrier & Planning', 500, 480, 550, 520),
  feat('cal_ical', 'Export iCal', 'Export au format iCalendar', 'Calendrier & Planning', 150, 140, 180, 160),

  // ═══ Intégrations Externes (9 features) ═══
  feat('int_stripe', 'Intégration Stripe', 'Paiements, facturation', 'Intégrations Externes', 400, 380, 450, 420),
  feat('int_google', 'Intégration Google (Maps, Calendar)', 'APIs Google', 'Intégrations Externes', 350, 320, 400, 360),
  feat('int_slack', 'Intégration Slack', 'Notifications et commandes Slack', 'Intégrations Externes', 300, 280, 350, 310),
  feat('int_zapier', 'Intégration Zapier/Make', 'Webhooks pour automatisations', 'Intégrations Externes', 300, 280, 350, 310),
  feat('int_api_custom', 'API custom (REST)', 'API publique documentée', 'Intégrations Externes', 500, 480, 550, 520),
  feat('int_oauth2', 'OAuth2 provider', 'Login avec votre app sur d\'autres sites', 'Intégrations Externes', 600, 550, 700, 620),
  feat('int_crm', 'Intégration CRM (HubSpot, Salesforce)', 'Sync contacts et deals', 'Intégrations Externes', 500, 480, 550, 520),
  feat('int_email_service', 'Intégration email (SendGrid, Mailgun)', 'Envoi d\'emails en masse', 'Intégrations Externes', 300, 280, 350, 310),
  feat('int_analytics', 'Intégration analytics (Mixpanel, Amplitude)', 'Tracking avancé', 'Intégrations Externes', 350, 320, 400, 360),

  // ═══ Fonctionnalités Avancées (12 features) ═══
  feat('adv_chatbot', 'Chatbot IA (GPT/Claude)', 'Assistant conversationnel intelligent', 'Fonctionnalités Avancées', 600, 550, 700, 620),
  feat('adv_rag', 'RAG (Knowledge base)', 'IA alimentée par vos documents', 'Fonctionnalités Avancées', 800, 750, 900, 820),
  feat('adv_content_gen', 'Génération de contenu IA', 'Textes, descriptions, résumés par IA', 'Fonctionnalités Avancées', 500, 480, 550, 520),
  feat('adv_sentiment', 'Analyse de sentiments', 'Détection du ton dans les messages', 'Fonctionnalités Avancées', 450, 420, 500, 460),
  feat('adv_recommendations', 'Recommandations IA', 'Suggestions personnalisées', 'Fonctionnalités Avancées', 550, 520, 600, 560),
  feat('adv_transcription', 'Transcription vocale', 'Speech-to-text', 'Fonctionnalités Avancées', 400, 380, 450, 420),
  feat('adv_search_fulltext', 'Recherche full-text', 'Recherche textuelle dans tout le contenu', 'Fonctionnalités Avancées', 350, 320, 400, 360),
  feat('adv_search_filters', 'Filtres avancés', 'Filtres multi-critères combinés', 'Fonctionnalités Avancées', 300, 280, 350, 310),
  feat('adv_search_autocomplete', 'Autocomplétion / Suggestions', 'Suggestions pendant la saisie', 'Fonctionnalités Avancées', 250, 230, 300, 260),
  feat('adv_search_geo', 'Recherche géographique', 'Recherche par proximité / carte', 'Fonctionnalités Avancées', 450, 420, 500, 460),
  feat('adv_search_elastic', 'Recherche Elasticsearch/Algolia', 'Moteur de recherche avancé', 'Fonctionnalités Avancées', 600, 550, 700, 620),
  feat('adv_ab_testing', 'A/B Testing', 'Tests de variantes', 'Fonctionnalités Avancées', 600, 550, 700, 620),

  // ═══ Design & UI/UX (10 features) ═══
  feat('ui_dark_mode', 'Mode sombre', 'Thème dark/light switch', 'Design & UI/UX', 300, 280, 350, 310),
  feat('ui_animations', 'Animations et micro-interactions', 'Transitions fluides, feedback visuel', 'Design & UI/UX', 400, 380, 450, 420),
  feat('ui_responsive', 'Design responsive avancé', 'Adaptation tablette + mobile fine', 'Design & UI/UX', 350, 320, 400, 360),
  feat('ui_drag_drop', 'Drag & Drop', 'Interface de glisser-déposer', 'Design & UI/UX', 400, 380, 450, 420),
  feat('ui_infinite_scroll', 'Infinite scroll', 'Chargement continu au scroll', 'Design & UI/UX', 200, 180, 250, 210),
  feat('ui_skeleton', 'Skeleton loading', 'Placeholders animés pendant le chargement', 'Design & UI/UX', 150, 140, 180, 160),
  feat('ui_onboarding', 'Onboarding / Tour guide', 'Tutoriel interactif pour nouveaux utilisateurs', 'Design & UI/UX', 400, 380, 450, 420),
  feat('ui_pwa', 'PWA (Progressive Web App)', 'Installation sur mobile, offline', 'Design & UI/UX', 500, 480, 550, 520),
  feat('ui_a11y', 'Accessibilité (WCAG AA)', 'Conformité accessibilité', 'Design & UI/UX', 400, 380, 450, 420),
  feat('ui_i18n', 'Multi-langue (2 langues)', 'Interface en 2 langues', 'Design & UI/UX', 400, 380, 450, 420),

  // ═══ Mobile Spécifique (10 features) ═══
  feat('mob_expo_setup', 'Setup Expo / React Native', 'Configuration projet mobile cross-platform', 'Mobile Spécifique', 500, 480, 550, 520),
  feat('mob_native_nav', 'Navigation native (tabs, stack)', 'Navigation iOS/Android native', 'Mobile Spécifique', 350, 320, 400, 360),
  feat('mob_push_native', 'Push notifications natives', 'Notifications push iOS et Android', 'Mobile Spécifique', 400, 380, 450, 420),
  feat('mob_offline', 'Mode offline', 'Fonctionnement hors connexion avec sync', 'Mobile Spécifique', 600, 550, 700, 620),
  feat('mob_camera', 'Accès caméra / galerie', 'Prise de photo et sélection d\'images', 'Mobile Spécifique', 250, 230, 300, 260),
  feat('mob_geolocation', 'Géolocalisation', 'GPS et cartes intégrées', 'Mobile Spécifique', 350, 320, 400, 360),
  feat('mob_biometric', 'Authentification biométrique', 'Face ID / empreinte digitale', 'Mobile Spécifique', 300, 280, 350, 310),
  feat('mob_app_store', 'Publication App Store / Play Store', 'Mise en ligne et configuration stores', 'Mobile Spécifique', 400, 380, 450, 420),
  feat('mob_deep_links', 'Deep linking / Universal links', 'Liens vers des écrans spécifiques', 'Mobile Spécifique', 300, 280, 350, 310),
  feat('mob_in_app_purchase', 'Achats in-app', 'Achats intégrés iOS/Android', 'Mobile Spécifique', 600, 550, 700, 620),

  // ═══ SEO & Performance (10 features) ═══
  feat('seo_meta', 'SEO Meta tags', 'Balises title, description, Open Graph', 'SEO & Performance', 150, 140, 180, 160),
  feat('seo_sitemap', 'Sitemap XML', 'Génération automatique du sitemap', 'SEO & Performance', 100, 100, 150, 120),
  feat('seo_schema', 'Schema.org / Rich Snippets', 'Données structurées pour Google', 'SEO & Performance', 200, 180, 250, 210),
  feat('seo_ssr', 'SSR / SSG', 'Server-side rendering ou static generation', 'SEO & Performance', 400, 380, 450, 420),
  feat('seo_cdn', 'CDN et optimisation images', 'Images optimisées, lazy loading, CDN', 'SEO & Performance', 300, 280, 350, 310),
  feat('seo_lighthouse', 'Audit Lighthouse 90+', 'Optimisation Core Web Vitals', 'SEO & Performance', 350, 320, 400, 360),
  feat('seo_analytics_ga', 'Google Analytics / Tag Manager', 'Tracking GA4 et GTM', 'SEO & Performance', 200, 180, 250, 210),
  feat('seo_perf_monitoring', 'Monitoring de performance', 'Alertes et métriques de performance', 'SEO & Performance', 300, 280, 350, 310),
  feat('seo_cache_strategy', 'Stratégie de cache', 'Cache navigateur, CDN, API', 'SEO & Performance', 250, 230, 300, 260),
  feat('seo_code_splitting', 'Code splitting / Lazy loading', 'Chargement optimisé des bundles', 'SEO & Performance', 200, 180, 250, 210),

  // ═══ Sécurité & Conformité (10 features) ═══
  feat('sec_encryption', 'Chiffrement des données', 'Encryption at rest et in transit', 'Sécurité & Conformité', 400, 380, 450, 420),
  feat('sec_audit_logs', 'Logs d\'audit', 'Traçabilité de toutes les actions', 'Sécurité & Conformité', 400, 380, 450, 420),
  feat('sec_rgpd', 'RGPD / Conformité', 'Export, suppression, consentement', 'Sécurité & Conformité', 500, 480, 550, 520),
  feat('sec_backup', 'Backup automatique', 'Sauvegardes quotidiennes', 'Sécurité & Conformité', 300, 280, 350, 310),
  feat('sec_waf', 'WAF / Protection DDoS', 'Pare-feu applicatif', 'Sécurité & Conformité', 350, 320, 400, 360),
  feat('sec_pentest', 'Pentest / Audit sécurité', 'Test de pénétration et audit', 'Sécurité & Conformité', 600, 550, 700, 620),
  feat('sec_content_moderation', 'Modération de contenu IA', 'Détection de contenu inapproprié', 'Sécurité & Conformité', 350, 320, 400, 360),
  feat('sec_cors', 'CORS / CSP configuration', 'Politiques de sécurité navigateur', 'Sécurité & Conformité', 150, 140, 180, 160),
  feat('sec_vulnerability_scan', 'Scan de vulnérabilités', 'Analyse automatique des failles', 'Sécurité & Conformité', 400, 380, 450, 420),
  feat('sec_incident_response', 'Plan de réponse aux incidents', 'Procédure en cas de faille', 'Sécurité & Conformité', 350, 320, 400, 360),
];

// ─── Feature lookup by ID ────────────────────────────────────
const _featureMap = new Map(LOCAL_FEATURES.map(f => [f.id, f]));
export function getFeatureById(id: string): PricingFeature | undefined {
  return _featureMap.get(id);
}

// ─── Pack definitions ────────────────────────────────────────

function makePack(
  id: string,
  name: string,
  description: string,
  pack_type: 'main' | 'category',
  price: number,
  discount_percentage: number,
  sort_order: number,
  recommended: boolean,
  includes_pack_id: string | null,
  featureIds: string[],
): PricingPackWithFeatures {
  return {
    id,
    name,
    description,
    pack_type,
    price,
    discount_percentage,
    includes_pack_id,
    sort_order,
    is_active: true,
    recommended,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    features: featureIds.map(fid => _featureMap.get(fid)!).filter(Boolean),
  };
}

// Starter features (10)
const STARTER_FEATURE_IDS = [
  'auth_email_password', 'auth_profile', 'auth_password_reset',
  'pay_stripe_one',
  'data_crud', 'data_api_rest',
  'data_export_csv',
  'notif_email',
  'ui_responsive',
  'seo_meta',
];

// Business features (16 additional on top of Starter)
const BUSINESS_OWN_FEATURE_IDS = [
  'auth_social_login', 'auth_roles',
  'pay_subscriptions', 'pay_invoices', 'pay_history',
  'data_relations', 'data_realtime',
  'dash_overview', 'dash_charts', 'dash_tables',
  'notif_push_web', 'notif_center',
  'cal_monthly', 'cal_reminders',
  'int_stripe', 'int_google',
];

// Premium features (22 additional on top of Business)
const PREMIUM_OWN_FEATURE_IDS = [
  'auth_2fa', 'auth_apple_signin', 'auth_multi_tenant', 'auth_sso',
  'pay_marketplace', 'pay_cart', 'pay_coupons',
  'dash_user_mgmt', 'dash_reports', 'dash_widgets',
  'notif_push_mobile', 'notif_sms', 'notif_templates',
  'adv_chatbot', 'adv_rag', 'adv_content_gen',
  'int_crm', 'int_oauth2', 'int_api_custom',
  'sec_encryption', 'sec_rgpd', 'sec_audit_logs',
];

// Category pack feature IDs
const PACK_AUTH_FEATURES = [
  'auth_email_password', 'auth_social_login', 'auth_apple_signin',
  'auth_2fa', 'auth_profile', 'auth_roles', 'auth_password_reset',
];
const PACK_PAYMENT_FEATURES = [
  'pay_stripe_one', 'pay_subscriptions', 'pay_invoices',
  'pay_refunds', 'pay_coupons', 'pay_history',
];
const PACK_ADMIN_FEATURES = [
  'dash_overview', 'dash_charts', 'dash_tables',
  'dash_user_mgmt', 'dash_reports', 'dash_date_filters', 'dash_export_reports',
];
const PACK_NOTIF_FEATURES = [
  'notif_push_mobile', 'notif_email', 'notif_templates',
  'notif_center', 'notif_prefs',
];
const PACK_SOCIAL_FEATURES = [
  'social_chat', 'social_comments', 'social_likes',
  'social_followers', 'social_messaging', 'social_groups', 'social_feed',
];
const PACK_CALENDAR_FEATURES = [
  'cal_monthly', 'cal_booking', 'cal_google_sync',
  'cal_reminders', 'cal_availability',
];
const PACK_INTEGRATIONS_FEATURES = [
  'int_stripe', 'int_google', 'int_slack',
  'int_zapier', 'int_api_custom', 'int_crm',
];

export const LOCAL_PACKS: PricingPackWithFeatures[] = [
  // Main packs (cumulative)
  makePack('pack_starter', 'Starter', 'Pour les MVPs et premiers lancements', 'main', 2000, 27, 1, false, null, STARTER_FEATURE_IDS),
  makePack('pack_business', 'Business', 'Pour les projets établis', 'main', 5000, 29, 2, true, 'pack_starter', [...STARTER_FEATURE_IDS, ...BUSINESS_OWN_FEATURE_IDS]),
  makePack('pack_premium', 'Premium', 'Solutions entreprise', 'main', 12000, 29, 3, false, 'pack_business', [...STARTER_FEATURE_IDS, ...BUSINESS_OWN_FEATURE_IDS, ...PREMIUM_OWN_FEATURE_IDS]),

  // Category packs (~20% discount)
  makePack('pack_auth', 'Pack Authentification', 'Système de connexion complet', 'category', 1800, 20, 4, false, null, PACK_AUTH_FEATURES),
  makePack('pack_payment', 'Pack Paiement', 'Intégration Stripe complète', 'category', 1800, 20, 5, false, null, PACK_PAYMENT_FEATURES),
  makePack('pack_admin', 'Pack Admin', 'Dashboard d\'administration complet', 'category', 2250, 20, 6, false, null, PACK_ADMIN_FEATURES),
  makePack('pack_notifications', 'Pack Notifications', 'Système de notifications multi-canal', 'category', 1300, 20, 7, false, null, PACK_NOTIF_FEATURES),
  makePack('pack_social', 'Pack Social', 'Social et communauté', 'category', 1900, 20, 8, false, null, PACK_SOCIAL_FEATURES),
  makePack('pack_calendar', 'Pack Calendrier', 'Planification et rendez-vous', 'category', 1200, 20, 9, false, null, PACK_CALENDAR_FEATURES),
  makePack('pack_integrations', 'Pack Intégrations', 'Intégrations tierces essentielles', 'category', 2050, 20, 10, false, null, PACK_INTEGRATIONS_FEATURES),
];

// Pack lookup
const _packMap = new Map(LOCAL_PACKS.map(p => [p.id, p]));
export function getPackById(id: string): PricingPackWithFeatures | undefined {
  return _packMap.get(id);
}
