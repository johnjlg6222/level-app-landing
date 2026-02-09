'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Badge } from '@/components/common';
import { PRICING_CATEGORIES } from '@/types/admin-pricing';
import type {
  PricingFeature,
  PricingFeatureInput,
  PricingFeatureUpdate,
  GroupedFeatures,
} from '@/types/admin-pricing';
import { FeatureFormModal } from './FeatureFormModal';

interface PricingFeaturesTableProps {
  features: PricingFeature[];
  groupedFeatures: GroupedFeatures;
  onCreate: (input: PricingFeatureInput) => Promise<void>;
  onUpdate: (id: string, input: PricingFeatureUpdate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function PricingFeaturesTable({
  features,
  groupedFeatures,
  onCreate,
  onUpdate,
  onDelete,
}: PricingFeaturesTableProps) {
  const [editingFeature, setEditingFeature] = useState<PricingFeature | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createCategory, setCreateCategory] = useState<string | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddForCategory = (category: string) => {
    setCreateCategory(category);
    setShowCreateModal(true);
  };

  const handleToggleActive = async (feature: PricingFeature) => {
    await onUpdate(feature.id, { is_active: !feature.is_active });
  };

  const handleDelete = async (id: string) => {
    if (deletingId === id) {
      await onDelete(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{features.length} fonctionnalites au total</p>
        <Button
          size="sm"
          onClick={() => {
            setCreateCategory(undefined);
            setShowCreateModal(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Ajouter
        </Button>
      </div>

      {PRICING_CATEGORIES.map((category) => {
        const catFeatures = groupedFeatures[category] || [];
        return (
          <div key={category} className="rounded-xl border border-white/5 overflow-hidden">
            {/* Category header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{category}</h3>
                <Badge variant="default" size="sm">{catFeatures.length}</Badge>
              </div>
              <button
                onClick={() => handleAddForCategory(category)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <Plus size={14} />
                Ajouter
              </button>
            </div>

            {catFeatures.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">Aucune fonctionnalite dans cette categorie</p>
            ) : (
              <div className="divide-y divide-white/5">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-gray-500 uppercase">
                  <div className="col-span-3">Nom</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-1 text-right">John</div>
                  <div className="col-span-1 text-right">Harouna</div>
                  <div className="col-span-1 text-right">Andre</div>
                  <div className="col-span-1 text-right">Final</div>
                  <div className="col-span-1 text-center">Statut</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {catFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setEditingFeature(feature)}
                  >
                    <div className="col-span-3 text-sm text-white truncate">{feature.name}</div>
                    <div className="col-span-3 text-xs text-gray-400 truncate">{feature.description}</div>
                    <div className="col-span-1 text-sm text-gray-300 text-right">{feature.price_john}</div>
                    <div className="col-span-1 text-sm text-gray-300 text-right">{feature.price_harouna}</div>
                    <div className="col-span-1 text-sm text-gray-300 text-right">{feature.price_andre}</div>
                    <div className="col-span-1 text-sm font-semibold text-blue-400 text-right">
                      {feature.final_price}
                    </div>
                    <div className="col-span-1 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleActive(feature)}
                        className={`w-8 h-4 rounded-full relative transition-colors ${
                          feature.is_active ? 'bg-green-500' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                            feature.is_active ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="col-span-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setEditingFeature(feature)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(feature.id)}
                        className={`p-1 transition-colors ${
                          deletingId === feature.id
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-gray-400 hover:text-red-400'
                        }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Modals */}
      {showCreateModal && (
        <FeatureFormModal
          feature={null}
          defaultCategory={createCategory}
          onSave={async (data) => {
            await onCreate(data);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingFeature && (
        <FeatureFormModal
          feature={editingFeature}
          onSave={async (data) => {
            await onUpdate(editingFeature.id, data);
          }}
          onClose={() => setEditingFeature(null)}
        />
      )}
    </div>
  );
}
