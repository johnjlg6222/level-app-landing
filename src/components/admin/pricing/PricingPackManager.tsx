'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Button, Card, Badge } from '@/components/common';
import type {
  PricingPackWithFeatures,
  PricingPackInput,
  PricingPackUpdate,
  PricingFeature,
  GroupedFeatures,
} from '@/types/admin-pricing';
import { PackFormModal } from './PackFormModal';

interface PricingPackManagerProps {
  packs: PricingPackWithFeatures[];
  allFeatures: PricingFeature[];
  groupedFeatures: GroupedFeatures;
  onCreate: (input: PricingPackInput & { feature_ids?: string[] }) => Promise<void>;
  onUpdate: (id: string, input: PricingPackUpdate & { feature_ids?: string[] }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function PricingPackManager({
  packs,
  allFeatures,
  groupedFeatures,
  onCreate,
  onUpdate,
  onDelete,
}: PricingPackManagerProps) {
  const [editingPack, setEditingPack] = useState<PricingPackWithFeatures | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const mainPacks = packs.filter((p) => p.pack_type === 'main');
  const categoryPacks = packs.filter((p) => p.pack_type === 'category');

  const handleToggleActive = async (pack: PricingPackWithFeatures) => {
    await onUpdate(pack.id, { is_active: !pack.is_active });
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

  const renderPackCard = (pack: PricingPackWithFeatures) => (
    <div
      key={pack.id}
      className={`p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/10 ${
        pack.is_active
          ? 'bg-white/5 border-white/10'
          : 'bg-white/[0.02] border-white/5 opacity-60'
      }`}
      onClick={() => setEditingPack(pack)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{pack.name}</span>
          {pack.recommended && (
            <Badge variant="primary" size="sm">
              <Star size={10} className="mr-1" />
              Recommande
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleToggleActive(pack)}
            className={`w-8 h-4 rounded-full relative transition-colors ${
              pack.is_active ? 'bg-green-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                pack.is_active ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
          <button
            onClick={() => setEditingPack(pack)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => handleDelete(pack.id)}
            className={`p-1 transition-colors ${
              deletingId === pack.id
                ? 'text-red-400 hover:text-red-300'
                : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-3">{pack.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-blue-400">{pack.price.toLocaleString('fr-FR')} EUR</span>
        <span className="text-xs text-gray-500">{pack.features.length} fonctionnalites</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{packs.length} packs au total</p>
        <Button
          size="sm"
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Nouveau pack
        </Button>
      </div>

      {/* Main packs */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Packs principaux</h3>
        {mainPacks.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun pack principal</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {mainPacks.map(renderPackCard)}
          </div>
        )}
      </div>

      {/* Category packs */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Packs categorie</h3>
        {categoryPacks.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun pack categorie</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {categoryPacks.map(renderPackCard)}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <PackFormModal
          pack={null}
          allFeatures={allFeatures}
          groupedFeatures={groupedFeatures}
          onSave={async (data) => {
            await onCreate(data);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingPack && (
        <PackFormModal
          pack={editingPack}
          allFeatures={allFeatures}
          groupedFeatures={groupedFeatures}
          onSave={async (data) => {
            await onUpdate(editingPack.id, data);
          }}
          onClose={() => setEditingPack(null)}
        />
      )}
    </div>
  );
}
