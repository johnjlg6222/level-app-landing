export interface ProjectDetail {
  slug: string;
  name: string;
  type: string;
  tags: string[];
  shortDesc: string;
  image: string;
  imagePosition?: string;
  model?: string;
  features: string[];
  // Extended info for detail page
  heroTagline: string;
  heroSubtitle: string;
  problem: string;
  objectives: string[];
  solution: string;
  results: string[];
}

export const projects: ProjectDetail[] = [
  {
    slug: 'patrimonia',
    name: 'Patrimonia',
    type: 'Fintech',
    tags: ['React Native', 'Node.js', 'PostgreSQL', 'Charts'],
    shortDesc: 'Application mobile interne pour gestionnaires de patrimoine - piloter, projeter et présenter les placements clients.',
    image: '/images/projects/patrimonia.jpg',
    imagePosition: 'center center',
    features: [
      'Dashboard patrimonial global',
      'Projections 5/10/20 ans',
      'Simulations fiscales',
      'Espace client sécurisé',
      'Rapports PDF',
    ],
    heroTagline: 'Piloter le patrimoine.\nPrésenter avec impact.',
    heroSubtitle: 'Une application mobile interne pour les gestionnaires de patrimoine, conçue pour visualiser, projeter et présenter les placements clients avec clarté.',
    problem: 'Les gestionnaires de patrimoine jonglaient entre plusieurs outils (Excel, PDF, présentations PowerPoint) pour suivre et présenter les portefeuilles de leurs clients. Le manque de centralisation et de visuels professionnels rendait les rendez-vous clients moins percutants et le suivi quotidien chronophage.',
    objectives: [
      'Centraliser toutes les données patrimoniales en un seul endroit',
      'Offrir des projections visuelles sur 5, 10 et 20 ans',
      'Permettre des simulations fiscales en temps réel',
      'Générer des rapports PDF professionnels en un clic',
      'Sécuriser l\'accès aux données sensibles',
    ],
    solution: 'Nous avons développé une application mobile React Native avec un backend Node.js sécurisé. L\'interface offre des graphiques interactifs pour visualiser l\'évolution du patrimoine, des outils de simulation intégrés, et la génération automatique de rapports PDF personnalisés pour chaque client.',
    results: [
      'Temps de préparation des rendez-vous réduit de 60%',
      'Présentation client professionnelle et interactive',
      'Adoption complète par l\'équipe en moins de 2 semaines',
      'Satisfaction client améliorée grâce aux visuels clairs',
    ],
  },
  {
    slug: 'interior-ai',
    name: 'Interior AI',
    type: 'AI / Real Estate',
    tags: ['React Native', 'API IA', 'Firebase', 'Cloud storage'],
    shortDesc: "App mobile pour agents immobiliers - générer des propositions de déco intérieure par IA.",
    image: '/images/projects/interior-ai.png',
    features: [
      'Upload photo',
      'Génération IA styles',
      'Avant/après instantané',
      'Visuels pour annonces',
      'Galerie partageable',
    ],
    heroTagline: 'Transformer les espaces.\nSéduire les acheteurs.',
    heroSubtitle: 'Une application IA pour agents immobiliers permettant de générer instantanément des propositions de décoration intérieure à partir d\'une simple photo.',
    problem: 'Les agents immobiliers peinent à aider les acheteurs à se projeter dans un bien vide ou mal agencé. Les services de home staging traditionnels sont coûteux et longs. Les annonces avec des photos brutes génèrent moins d\'intérêt que celles avec des visuels attractifs.',
    objectives: [
      'Permettre de visualiser un intérieur meublé en quelques secondes',
      'Proposer plusieurs styles de décoration (moderne, scandinave, industriel...)',
      'Créer des visuels avant/après pour les annonces',
      'Offrir une solution accessible et rapide pour tous les agents',
    ],
    solution: 'Nous avons créé une application mobile connectée à une API d\'intelligence artificielle spécialisée dans la génération d\'images. L\'agent prend une photo de la pièce, choisit un style, et reçoit en quelques secondes un visuel réaliste de l\'espace meublé et décoré.',
    results: [
      'Génération d\'un visuel déco en moins de 30 secondes',
      'Augmentation du taux de clics sur les annonces',
      'Réduction des coûts vs home staging traditionnel',
      'Outil adopté par plus de 50 agents en 3 mois',
    ],
  },
  {
    slug: 'neurocase',
    name: 'Neurocase',
    type: 'Medtech',
    tags: ['React Native', 'Node.js sécurisé', 'Chiffrement', 'Auth renforcée'],
    shortDesc: 'App mobile sécurisée pour chirurgiens en neurologie - suivi de cas cliniques et préparation opératoire.',
    image: '/images/projects/neurocase.png',
    features: [
      'Centralisation dossiers anonymisés',
      'Timeline opératoire',
      'Imagerie médicale (IRM, scanner)',
      'Notes cliniques',
      'Historique décisions',
    ],
    heroTagline: 'Préparer. Opérer.\nProgresser.',
    heroSubtitle: 'Une application mobile ultra-sécurisée pour les neurochirurgiens, permettant le suivi de cas cliniques et la préparation opératoire en toute confidentialité.',
    problem: 'Les neurochirurgiens avaient besoin d\'un outil personnel pour centraliser leurs cas cliniques, revoir les imageries médicales avant une opération, et suivre l\'évolution de leurs patients dans le temps. Les solutions existantes ne répondaient pas aux exigences de sécurité et de confidentialité du secteur médical.',
    objectives: [
      'Centraliser les dossiers patients de manière anonymisée',
      'Permettre la consultation d\'imageries médicales (IRM, scanner)',
      'Créer une timeline opératoire pour chaque cas',
      'Garantir un niveau de sécurité conforme aux standards médicaux',
      'Offrir un accès hors-ligne aux données critiques',
    ],
    solution: 'Nous avons développé une application React Native avec un backend Node.js intégrant un chiffrement de bout en bout et une authentification renforcée. L\'application permet de stocker et consulter des imageries médicales, de prendre des notes cliniques, et de suivre l\'historique des décisions pour chaque cas.',
    results: [
      'Adoption par une équipe de 12 chirurgiens',
      'Conformité aux exigences de confidentialité médicale',
      'Accès aux cas critiques même hors connexion',
      'Amélioration de la préparation pré-opératoire',
    ],
  },
  {
    slug: 'scaneat',
    name: 'ScanEat',
    type: 'FoodTech',
    tags: ['React Native', 'API IA', 'Firebase', 'Analytics'],
    shortDesc: "Analyse instantanée d'un repas par photo pour estimer calories et macronutriments.",
    image: '/images/projects/scaneat.png',
    model: 'Freemium - Abonnement mensuel',
    features: [
      'Scan photo du repas',
      'Estimation calories & macros',
      'Historique des repas',
      'Partage des résultats',
    ],
    heroTagline: 'Scanner. Comprendre.\nMieux manger.',
    heroSubtitle: 'Une application mobile qui analyse instantanément vos repas par photo pour estimer les calories et macronutriments, sans effort de saisie manuelle.',
    problem: 'Suivre son alimentation est fastidieux : il faut peser les aliments, chercher les valeurs nutritionnelles, tout saisir manuellement. La plupart des utilisateurs abandonnent leur suivi alimentaire après quelques jours à cause de cette friction.',
    objectives: [
      'Permettre l\'analyse nutritionnelle d\'un repas en une photo',
      'Estimer automatiquement calories, protéines, glucides et lipides',
      'Offrir un historique simple et visuel des repas',
      'Créer une expérience utilisateur sans friction',
    ],
    solution: 'Nous avons développé une application React Native connectée à une API d\'intelligence artificielle capable de reconnaître les aliments dans une photo et d\'estimer leurs valeurs nutritionnelles. L\'utilisateur prend simplement une photo de son assiette et reçoit instantanément une estimation détaillée.',
    results: [
      'Analyse d\'un repas en moins de 5 secondes',
      'Taux de rétention utilisateur 3x supérieur aux apps classiques',
      'Modèle freemium avec conversion premium à 8%',
      'Plus de 10 000 repas analysés le premier mois',
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
