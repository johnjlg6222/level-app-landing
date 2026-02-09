'use client';

import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import {
  CheckCircle, Package, Layers, FileText,
  Building2, User, Mail, Phone, Palette,
} from 'lucide-react';
import type { ClosingWizardState } from '@/types/closing-wizard';
import type { PricingFeature, PricingPackWithFeatures } from '@/types/admin-pricing';
import {
  PROJECT_TYPES,
  TARGET_USERS_OPTIONS,
  CLIENT_SECTORS,
  URGENCY_OPTIONS,
  MAINTENANCE_OPTIONS,
} from '@/types/pricing';

const STYLE_MAP: Record<string, string> = {
  minimal: 'Minimal',
  moderne: 'Moderne',
  corporate: 'Corporate',
  creatif: 'Creatif',
  luxe: 'Luxe',
  playful: 'Playful',
};

interface StepReviewProps {
  state: ClosingWizardState;
  features: PricingFeature[];
  packs: PricingPackWithFeatures[];
}

export const StepReview: React.FC<StepReviewProps> = ({
  state,
  features,
  packs,
}) => {
  const resolveLabel = <T extends { id: string; label: string }>(arr: T[], id: string) =>
    arr.find((i) => i.id === id)?.label || id;

  // Resolve selected packs
  const selectedMainPackData = packs.find((p) => p.id === state.selectedMainPack);
  const selectedCategoryPacksData = packs.filter((p) =>
    state.selectedCategoryPacks.includes(p.id)
  );

  // Group selected a-la-carte features by category
  const alaCarteFeatures = features.filter(
    (f) =>
      state.selectedFeatureIds.includes(f.id) &&
      !state.packFeatureIds.includes(f.id)
  );

  const featuresByCategory = alaCarteFeatures.reduce<Record<string, PricingFeature[]>>(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    },
    {}
  );

  // Pack features
  const packFeatures = features.filter((f) =>
    state.packFeatureIds.includes(f.id)
  );

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle size={24} className="text-green-400" />
          Récapitulatif du devis
        </h2>
        <p className="text-gray-400 mt-1">
          Vérifiez toutes les informations avant de générer le devis final.
        </p>
      </div>

      <div className="space-y-6">
        {/* Client info recap */}
        <Card variant="filled" padding="md">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Building2 size={16} className="text-gray-400" />
            Client
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Building2 size={14} />
              <span>{state.clientInfo.company || '--'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <User size={14} />
              <span>{state.clientInfo.contact || '--'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail size={14} />
              <span>{state.clientInfo.email || '--'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Phone size={14} />
              <span>{state.clientInfo.phone || '--'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 col-span-2">
              <Building2 size={14} />
              <span>Secteur: {resolveLabel(CLIENT_SECTORS, state.clientInfo.sector) || '--'}</span>
            </div>
          </div>
        </Card>

        {/* Project context recap */}
        <Card variant="filled" padding="md">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <FileText size={16} className="text-gray-400" />
            Projet
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="text-gray-500">Nom: </span>
              {state.projectContext.projectName || '--'}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-500">Type: </span>
              {resolveLabel(PROJECT_TYPES, state.projectContext.projectType) || '--'}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-500">Cibles: </span>
              {resolveLabel(TARGET_USERS_OPTIONS, state.projectContext.targetUsers) || '--'}
            </p>
            {state.projectContext.problemToSolve && (
              <p className="text-gray-300">
                <span className="text-gray-500">Problème: </span>
                {state.projectContext.problemToSolve}
              </p>
            )}
          </div>
        </Card>

        {/* Selected packs */}
        <Card variant="filled" padding="md">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Package size={16} className="text-blue-400" />
            Packs sélectionnés
          </h3>
          <div className="space-y-2">
            {selectedMainPackData && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">Principal</Badge>
                  <span className="text-sm font-medium text-white">
                    {selectedMainPackData.name}
                  </span>
                  <Badge variant="default" size="sm">
                    {selectedMainPackData.features.length} features
                  </Badge>
                </div>
                <span className="text-sm font-bold text-white">
                  {formatCurrency(selectedMainPackData.price)}
                </span>
              </div>
            )}
            {selectedCategoryPacksData.map((pack) => (
              <div
                key={pack.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="default" size="sm">Catégorie</Badge>
                  <span className="text-sm font-medium text-white">
                    {pack.name}
                  </span>
                  <Badge variant="default" size="sm">
                    {pack.features.length} features
                  </Badge>
                </div>
                <span className="text-sm font-bold text-white">
                  {formatCurrency(pack.price)}
                </span>
              </div>
            ))}
            {!selectedMainPackData && selectedCategoryPacksData.length === 0 && (
              <p className="text-sm text-gray-500">Aucun pack sélectionné</p>
            )}
          </div>
        </Card>

        {/* A-la-carte features grouped by category */}
        {Object.keys(featuresByCategory).length > 0 && (
          <Card variant="filled" padding="md">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Layers size={16} className="text-green-400" />
              Fonctionnalités à la carte
            </h3>
            <div className="space-y-4">
              {Object.entries(featuresByCategory).map(([category, catFeatures]) => (
                <div key={category}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {category}
                  </p>
                  <div className="space-y-1">
                    {catFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between py-1.5 text-sm"
                      >
                        <span className="text-gray-300">{feature.name}</span>
                        <span className="text-gray-400 font-medium">
                          {formatCurrency(feature.final_price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Pack features listed */}
        {packFeatures.length > 0 && (
          <Card variant="filled" padding="md">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Package size={16} className="text-gray-400" />
              Fonctionnalités incluses dans les packs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              {packFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center gap-2 py-1 text-sm text-gray-500"
                >
                  <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                  <span className="truncate">{feature.name}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Design & Logistics recap */}
        <Card variant="filled" padding="md">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Palette size={16} className="text-blue-400" />
            Design & Logistique
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Design */}
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="text-gray-500">Style: </span>
                {STYLE_MAP[state.design.style] || state.design.style}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Couleurs: </span>
                <span
                  className="inline-block w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: state.design.primaryColor }}
                />
                <span
                  className="inline-block w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: state.design.secondaryColor }}
                />
              </div>
              <p className="text-gray-300">
                <span className="text-gray-500">Dark mode: </span>
                {state.design.darkMode ? 'Oui' : 'Non'}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Animations: </span>
                {state.design.animations ? 'Oui' : 'Non'}
              </p>
            </div>
            {/* Logistics */}
            <div className="space-y-2">
              {(() => {
                const urgency = URGENCY_OPTIONS.find(o => o.id === state.logistics.urgency);
                return (
                  <p className="text-gray-300">
                    <span className="text-gray-500">Urgence: </span>
                    {urgency?.label || state.logistics.urgency}
                    {urgency && urgency.multiplier !== 1 && (
                      <span className="text-yellow-400 ml-1">x{urgency.multiplier}</span>
                    )}
                  </p>
                );
              })()}
              {(() => {
                const maint = MAINTENANCE_OPTIONS.find(o => o.id === state.logistics.maintenance);
                return (
                  <p className="text-gray-300">
                    <span className="text-gray-500">Maintenance: </span>
                    {maint?.label || state.logistics.maintenance}
                    {maint && maint.monthlyPrice > 0 && (
                      <span className="text-blue-400 ml-1">{formatCurrency(maint.monthlyPrice)}/mois</span>
                    )}
                  </p>
                );
              })()}
              {state.logistics.deadline && (
                <p className="text-gray-300">
                  <span className="text-gray-500">Deadline: </span>
                  {state.logistics.deadline}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Notes recap */}
        {(state.notes.indispensable || state.notes.niceToHave) && (
          <Card variant="filled" padding="md">
            <h3 className="text-base font-semibold text-white mb-3">Notes</h3>
            <div className="space-y-3 text-sm">
              {state.notes.indispensable && (
                <div>
                  <p className="text-red-400 text-xs font-semibold uppercase mb-1">
                    Indispensable
                  </p>
                  <p className="text-gray-300">{state.notes.indispensable}</p>
                </div>
              )}
              {state.notes.niceToHave && (
                <div>
                  <p className="text-yellow-400 text-xs font-semibold uppercase mb-1">
                    Nice-to-have
                  </p>
                  <p className="text-gray-300">{state.notes.niceToHave}</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
