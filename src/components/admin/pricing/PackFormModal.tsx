'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button, Input, Textarea, Badge } from '@/components/common';
import { PRICING_CATEGORIES } from '@/types/admin-pricing';
import type {
  PricingPackWithFeatures,
  PricingPackInput,
  PricingFeature,
  GroupedFeatures,
} from '@/types/admin-pricing';

interface PackFormModalProps {
  pack: PricingPackWithFeatures | null; // null = create mode
  allFeatures: PricingFeature[];
  allPacks?: PricingPackWithFeatures[];
  groupedFeatures: GroupedFeatures;
  onSave: (data: PricingPackInput & { feature_ids: string[] }) => Promise<void>;
  onClose: () => void;
}

export function PackFormModal({ pack, allFeatures, allPacks = [], groupedFeatures, onSave, onClose }: PackFormModalProps) {
  const [name, setName] = useState(pack?.name || '');
  const [description, setDescription] = useState(pack?.description || '');
  const [packType, setPackType] = useState<'main' | 'category'>(pack?.pack_type || 'main');
  const [price, setPrice] = useState(pack?.price || 0);
  const [recommended, setRecommended] = useState(pack?.recommended || false);
  const [discountPercentage, setDiscountPercentage] = useState(pack?.discount_percentage || 0);
  const [includesPackId, setIncludesPackId] = useState<string | null>(pack?.includes_pack_id || null);
  const [isActive, setIsActive] = useState(pack?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(pack?.sort_order || 0);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(
    new Set(pack?.features?.map((f) => f.id) || [])
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        name,
        description,
        pack_type: packType,
        price,
        discount_percentage: discountPercentage,
        includes_pack_id: includesPackId,
        recommended,
        is_active: isActive,
        sort_order: sortOrder,
        feature_ids: Array.from(selectedFeatureIds),
      });
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-[#0F1115] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">
            {pack ? 'Modifier le pack' : 'Nouveau pack'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du pack"
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du pack..."
            rows={2}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type de pack</label>
              <select
                value={packType}
                onChange={(e) => setPackType(e.target.value as 'main' | 'category')}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="main" className="bg-[#0F1115]">Pack principal</option>
                <option value="category" className="bg-[#0F1115]">Pack categorie</option>
              </select>
            </div>
            <Input
              label="Prix"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Remise (%)"
              type="number"
              min={0}
              max={100}
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Pack parent (cumulatif)</label>
              <select
                value={includesPackId || ''}
                onChange={(e) => setIncludesPackId(e.target.value || null)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="" className="bg-[#0F1115]">Aucun</option>
                {allPacks.filter(p => p.id !== pack?.id && p.pack_type === 'main').map(p => (
                  <option key={p.id} value={p.id} className="bg-[#0F1115]">{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Ordre de tri"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Recommande</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recommended}
                  onChange={(e) => setRecommended(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 relative"></div>
                <span className="text-sm text-gray-400">{recommended ? 'Oui' : 'Non'}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 relative"></div>
                <span className="text-sm text-gray-400">{isActive ? 'Actif' : 'Inactif'}</span>
              </label>
            </div>
          </div>

          {/* Feature assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Fonctionnalites incluses ({selectedFeatureIds.size} selectionnees)
            </label>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {PRICING_CATEGORIES.map((cat) => {
                const catFeatures = groupedFeatures[cat];
                if (!catFeatures || catFeatures.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">{cat}</p>
                    <div className="space-y-1">
                      {catFeatures.filter((f) => f.is_active).map((feature) => (
                        <label
                          key={feature.id}
                          className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5"
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-colors ${
                              selectedFeatureIds.has(feature.id)
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-white/20'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFeature(feature.id);
                            }}
                          >
                            {selectedFeatureIds.has(feature.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm text-white flex-1">{feature.name}</span>
                          <span className="text-xs text-gray-500">{feature.final_price.toLocaleString('fr-FR')} EUR</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" onClick={onClose} type="button" fullWidth>
              Annuler
            </Button>
            <Button type="submit" loading={isSaving} fullWidth>
              {pack ? 'Mettre a jour' : 'Creer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
