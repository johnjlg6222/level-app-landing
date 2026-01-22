'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Target,
  Users,
  CreditCard,
  Bell,
  Calendar,
  Plug,
  Palette,
  Clock,
  Wrench,
  StickyNote,
  Save,
  Download,
  LogOut,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Home,
  Database,
  LayoutDashboard,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuoteForm } from '@/hooks';
import { Button, Card, Input, Textarea, Badge } from '@/components/common';
import { AmbientBackground } from '@/components/landing';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { ChatWidget } from '@/components/chat';
import { BASE_PLANS, PACKS, URGENCY_OPTIONS, MAINTENANCE_OPTIONS, CLIENT_SECTORS, PROJECT_TYPES, TARGET_USERS_OPTIONS } from '@/types/pricing';
import { formatCurrency } from '@/utils/formatters';
import { downloadQuotePDF, downloadTechSpecPDF } from '@/lib/pdf-generator';

// Section wrapper component
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-semibold text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 border-t border-white/5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Checkbox component
function Checkbox({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-colors ${
          checked
            ? 'bg-blue-500 border-blue-500'
            : 'border-white/20 group-hover:border-white/40'
        }`}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <div className="flex-1">
        <span className="text-white text-sm">{label}</span>
        {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

// Plan card component
function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: (typeof BASE_PLANS)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border text-left transition-all ${
        selected
          ? 'bg-blue-500/10 border-blue-500/50'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-white">{plan.name}</span>
        {plan.recommended && (
          <Badge variant="primary" size="sm">
            Recommande
          </Badge>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-3">{plan.description}</p>
      <p className="text-2xl font-bold text-white mb-3">{formatCurrency(plan.basePrice)}</p>
      <ul className="space-y-1">
        {plan.features.slice(0, 3).map((feature, i) => (
          <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
            <Check className="w-3 h-3 text-blue-400" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  );
}

// Pack card component
function PackCard({
  pack,
  selected,
  onToggle,
}: {
  pack: (typeof PACKS)[0];
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full p-4 rounded-xl border text-left transition-all ${
        selected
          ? 'bg-blue-500/10 border-blue-500/50'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-white">{pack.name}</span>
        <span className="text-blue-400 font-semibold">{formatCurrency(pack.price)}</span>
      </div>
      <p className="text-xs text-gray-400">{pack.description}</p>
    </button>
  );
}

// Price sidebar component
function PriceSidebar({
  calculatedPrice,
  isSaving,
  isExporting,
  onSave,
  onExportQuote,
  onExportTechSpec,
}: {
  calculatedPrice: ReturnType<typeof useQuoteForm>['calculatedPrice'];
  isSaving: boolean;
  isExporting: boolean;
  onSave: () => void;
  onExportQuote: () => void;
  onExportTechSpec: () => void;
}) {
  return (
    <div className="sticky top-24 space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recapitulatif</h3>

        {/* Breakdown */}
        <div className="space-y-3 mb-6">
          {calculatedPrice.breakdown.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="border-t border-white/10 pt-3 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Sous-total</span>
            <span className="text-white">{formatCurrency(calculatedPrice.subtotal)}</span>
          </div>
        </div>

        {/* Discount */}
        {calculatedPrice.discount > 0 && (
          <div className="flex justify-between text-sm text-green-400 mb-3">
            <span>Remise</span>
            <span>-{formatCurrency(calculatedPrice.discount)}</span>
          </div>
        )}

        {/* Urgency */}
        {calculatedPrice.urgencyMultiplier > 1 && (
          <div className="flex justify-between text-sm text-orange-400 mb-3">
            <span>Urgence (x{calculatedPrice.urgencyMultiplier})</span>
            <span>Inclus</span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-white/10 pt-4 mb-6">
          <div className="flex justify-between items-end">
            <span className="text-gray-400">Total</span>
            <motion.span
              key={calculatedPrice.total}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white"
            >
              {formatCurrency(calculatedPrice.total)}
            </motion.span>
          </div>
          {calculatedPrice.monthlyMaintenance > 0 && (
            <p className="text-sm text-gray-500 text-right mt-1">
              + {formatCurrency(calculatedPrice.monthlyMaintenance)}/mois maintenance
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button fullWidth onClick={onSave} loading={isSaving} icon={<Save className="w-4 h-4" />}>
            Sauvegarder
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={onExportQuote}
            loading={isExporting}
            icon={<Download className="w-4 h-4" />}
          >
            Devis PDF
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={onExportTechSpec}
            loading={isExporting}
            icon={<FileText className="w-4 h-4" />}
          >
            Specs Techniques
          </Button>
          <Button fullWidth variant="ghost" icon={<Sparkles className="w-4 h-4" />}>
            Generer PRD
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Main form content
function AdminFormContent() {
  const { signOut, user } = useAuth();
  const {
    state,
    calculatedPrice,
    isSaving,
    savedId,
    error,
    setClientInfo,
    setProjectContext,
    setSelectedPlan,
    togglePack,
    setDiscount,
    setSimpleFeature,
    toggleAdvancedFeature,
    setDesign,
    setLogistics,
    setNotes,
    saveQuote,
  } = useQuoteForm();

  const [isExporting, setIsExporting] = useState(false);

  const handleExportQuote = async () => {
    setIsExporting(true);
    try {
      await downloadQuotePDF(state, calculatedPrice);
    } catch (err) {
      console.error('Error exporting PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportTechSpec = async () => {
    setIsExporting(true);
    try {
      await downloadTechSpecPDF(state);
    } catch (err) {
      console.error('Error exporting Tech Spec PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Simple features config
  const simpleFeaturesList = [
    {
      id: 'auth',
      label: 'Authentification',
      icon: Lock,
      levels: ['basic', 'social', 'multi_user'],
      levelLabels: ['Email/Password', '+ Social Login', '+ Multi-tenant'],
    },
    {
      id: 'payments',
      label: 'Paiements',
      icon: CreditCard,
      levels: ['simple', 'recurring', 'both'],
      levelLabels: ['Paiement unique', 'Abonnements', 'Les deux'],
    },
    {
      id: 'data',
      label: 'Donnees',
      icon: Database,
      levels: ['basic', 'complex', 'realtime'],
      levelLabels: ['CRUD simple', 'Relations complexes', 'Temps reel'],
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      levels: ['basic', 'charts'],
      levelLabels: ['Tableaux', 'Graphiques'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      types: ['push', 'email', 'sms'],
      typeLabels: ['Push', 'Email', 'SMS'],
    },
    {
      id: 'calendar',
      label: 'Calendrier',
      icon: Calendar,
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      options: ['stripe', 'google', 'slack', 'zapier', 'api_custom'],
      optionLabels: ['Stripe', 'Google', 'Slack', 'Zapier', 'API Custom'],
    },
  ];

  // Advanced features
  const advancedFeaturesList = [
    { id: 'ai_chat', label: 'Chat IA', description: 'Chatbot intelligent' },
    { id: 'search', label: 'Recherche avancee', description: 'Full-text search' },
    { id: 'analytics', label: 'Analytics', description: 'Tracking utilisateur' },
    { id: 'export', label: 'Export', description: 'PDF, CSV, Excel' },
    { id: 'import', label: 'Import', description: 'CSV, Excel' },
    { id: 'localization', label: 'Multi-langue', description: 'i18n' },
    { id: 'dark_mode', label: 'Mode sombre', description: 'Theme switching' },
    { id: 'offline', label: 'Offline', description: 'PWA capabilities' },
  ];

  return (
    <div className="font-sans antialiased bg-[#050507] min-h-screen text-white">
      <AmbientBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <h1 className="text-lg font-semibold text-white">Formulaire de Devis</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} icon={<LogOut className="w-4 h-4" />}>
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Success/Error messages */}
          {savedId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
            >
              <p className="text-green-400 text-sm">Devis sauvegarde avec succes (ID: {savedId})</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="flex gap-8">
            {/* Form sections */}
            <div className="flex-1 space-y-6">
              {/* Section 1: Client Info */}
              <Section title="Qui ?" icon={Building2}>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <Input
                    label="Entreprise"
                    value={state.clientInfo.company}
                    onChange={(e) => setClientInfo({ company: e.target.value })}
                    icon={<Building2 className="w-5 h-5" />}
                    placeholder="Nom de l'entreprise"
                  />
                  <Input
                    label="Contact"
                    value={state.clientInfo.contact}
                    onChange={(e) => setClientInfo({ contact: e.target.value })}
                    icon={<User className="w-5 h-5" />}
                    placeholder="Nom du contact"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={state.clientInfo.email}
                    onChange={(e) => setClientInfo({ email: e.target.value })}
                    icon={<Mail className="w-5 h-5" />}
                    placeholder="email@entreprise.com"
                  />
                  <Input
                    label="Telephone"
                    value={state.clientInfo.phone}
                    onChange={(e) => setClientInfo({ phone: e.target.value })}
                    icon={<Phone className="w-5 h-5" />}
                    placeholder="06 12 34 56 78"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Secteur</label>
                    <div className="flex flex-wrap gap-2">
                      {CLIENT_SECTORS.map((sector) => (
                        <button
                          key={sector.id}
                          onClick={() => setClientInfo({ sector: sector.id })}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            state.clientInfo.sector === sector.id
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 border'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {sector.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Section 2: Plan Selection */}
              <Section title="Votre Plan" icon={Briefcase}>
                <div className="pt-4 space-y-6">
                  {/* Plans */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Choisissez votre plan
                    </label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {BASE_PLANS.map((plan) => (
                        <PlanCard
                          key={plan.id}
                          plan={plan}
                          selected={state.selectedPlan === plan.id}
                          onSelect={() => setSelectedPlan(plan.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Packs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Packs additionnels
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {PACKS.map((pack) => (
                        <PackCard
                          key={pack.id}
                          pack={pack}
                          selected={state.selectedPacks.includes(pack.id)}
                          onToggle={() => togglePack(pack.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="max-w-xs">
                    <Input
                      label="Remise (%)"
                      type="number"
                      min={0}
                      max={100}
                      value={state.discount}
                      onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </Section>

              {/* Section 3: Project Context */}
              <Section title="Quoi ?" icon={FileText}>
                <div className="pt-4 space-y-4">
                  <Input
                    label="Nom du projet"
                    value={state.projectContext.projectName}
                    onChange={(e) => setProjectContext({ projectName: e.target.value })}
                    placeholder="Mon Super Projet"
                  />
                  <Textarea
                    label="Probleme a resoudre"
                    value={state.projectContext.problemToSolve}
                    onChange={(e) => setProjectContext({ problemToSolve: e.target.value })}
                    placeholder="Decrivez le probleme que ce projet va resoudre..."
                    rows={3}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type de projet
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setProjectContext({ projectType: type.id })}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            state.projectContext.projectType === type.id
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 border'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Utilisateurs cibles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TARGET_USERS_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setProjectContext({ targetUsers: option.id })}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            state.projectContext.targetUsers === option.id
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 border'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Section 4: Simple Features */}
              <Section title="Fonctionnalites" icon={Target}>
                <div className="pt-4 space-y-6">
                  {simpleFeaturesList.map((feature) => (
                    <div key={feature.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <feature.icon className="w-5 h-5 text-blue-400" />
                          <span className="font-medium text-white">{feature.label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              state.simpleFeatures[feature.id as keyof typeof state.simpleFeatures]
                                ?.enabled || false
                            }
                            onChange={(e) =>
                              setSimpleFeature(feature.id as keyof typeof state.simpleFeatures, {
                                enabled: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      {state.simpleFeatures[feature.id as keyof typeof state.simpleFeatures]
                        ?.enabled &&
                        feature.levels && (
                          <div className="flex flex-wrap gap-2">
                            {feature.levels.map((level, i) => (
                              <button
                                key={level}
                                onClick={() =>
                                  setSimpleFeature(feature.id as 'auth' | 'payments' | 'data', {
                                    level,
                                  })
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                  (
                                    state.simpleFeatures[
                                      feature.id as 'auth' | 'payments' | 'data'
                                    ] as { level: string }
                                  )?.level === level
                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 border'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                                }`}
                              >
                                {feature.levelLabels?.[i]}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </Section>

              {/* Section 5: Advanced Features */}
              <Section title="Fonctionnalites Avancees" icon={Sparkles} defaultOpen={false}>
                <div className="pt-4 grid md:grid-cols-2 gap-3">
                  {advancedFeaturesList.map((feature) => (
                    <Checkbox
                      key={feature.id}
                      label={feature.label}
                      description={feature.description}
                      checked={state.advancedFeatures.includes(feature.id)}
                      onChange={() => toggleAdvancedFeature(feature.id)}
                    />
                  ))}
                </div>
              </Section>

              {/* Section 6: Design */}
              <Section title="Design" icon={Palette}>
                <div className="pt-4 space-y-4">
                  <Checkbox
                    label="Le client a deja une charte graphique"
                    checked={state.design.hasBranding}
                    onChange={(checked) => setDesign({ hasBranding: checked })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Style de design
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['modern', 'minimal', 'bold', 'playful', 'corporate'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setDesign({ style })}
                          className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                            state.design.style === style
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 border'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Couleur principale
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={state.design.primaryColor}
                          onChange={(e) => setDesign({ primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <span className="text-gray-400 text-sm">{state.design.primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Couleur secondaire
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={state.design.secondaryColor}
                          onChange={(e) => setDesign({ secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0"
                        />
                        <span className="text-gray-400 text-sm">{state.design.secondaryColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <Checkbox
                      label="Mode sombre"
                      checked={state.design.darkMode}
                      onChange={(checked) => setDesign({ darkMode: checked })}
                    />
                    <Checkbox
                      label="Animations"
                      checked={state.design.animations}
                      onChange={(checked) => setDesign({ animations: checked })}
                    />
                  </div>
                </div>
              </Section>

              {/* Section 7: Logistics */}
              <Section title="Logistique" icon={Clock}>
                <div className="pt-4 space-y-4">
                  <Input
                    label="Deadline"
                    type="date"
                    value={state.logistics.deadline}
                    onChange={(e) => setLogistics({ deadline: e.target.value })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Urgence</label>
                    <div className="flex flex-wrap gap-2">
                      {URGENCY_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setLogistics({ urgency: option.id })}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            state.logistics.urgency === option.id
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 border'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {option.label}
                          <span className="text-xs text-gray-500 ml-2">
                            {option.multiplier > 1 && `x${option.multiplier}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Maintenance
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MAINTENANCE_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setLogistics({ maintenance: option.id })}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            state.logistics.maintenance === option.id
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 border'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {option.label}
                          {option.monthlyPrice > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                              {formatCurrency(option.monthlyPrice)}/mois
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Section 8: Notes */}
              <Section title="Notes" icon={StickyNote}>
                <div className="pt-4 space-y-4">
                  <Textarea
                    label="Indispensable"
                    value={state.notes.indispensable}
                    onChange={(e) => setNotes({ indispensable: e.target.value })}
                    placeholder="Ce qui doit absolument etre present..."
                    rows={3}
                  />
                  <Textarea
                    label="Nice to have"
                    value={state.notes.niceToHave}
                    onChange={(e) => setNotes({ niceToHave: e.target.value })}
                    placeholder="Ce qui serait bien d'avoir..."
                    rows={3}
                  />
                  <Textarea
                    label="Notes internes"
                    value={state.notes.internal}
                    onChange={(e) => setNotes({ internal: e.target.value })}
                    placeholder="Notes pour l'equipe (non visibles par le client)..."
                    rows={3}
                  />
                </div>
              </Section>
            </div>

            {/* Price sidebar */}
            <div className="hidden lg:block w-80">
              <PriceSidebar
                calculatedPrice={calculatedPrice}
                isSaving={isSaving}
                isExporting={isExporting}
                onSave={saveQuote}
                onExportQuote={handleExportQuote}
                onExportTechSpec={handleExportTechSpec}
              />
            </div>
          </div>

          {/* Mobile price bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0F1115]/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(calculatedPrice.total)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleExportQuote} loading={isExporting} icon={<Download className="w-4 h-4" />}>
                  PDF
                </Button>
                <Button onClick={saveQuote} loading={isSaving} icon={<Save className="w-4 h-4" />}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}

// Wrap with protected route
export default function AdminClosingPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminFormContent />
    </ProtectedRoute>
  );
}
