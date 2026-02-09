'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/common';
import { PRICING_CATEGORIES } from '@/types/admin-pricing';
import type { PricingFeature, PricingFeatureInput, PricingCategory } from '@/types/admin-pricing';

interface FeatureFormModalProps {
  feature: PricingFeature | null; // null = create mode
  defaultCategory?: string;
  onSave: (data: PricingFeatureInput) => Promise<void>;
  onClose: () => void;
}

export function FeatureFormModal({ feature, defaultCategory, onSave, onClose }: FeatureFormModalProps) {
  const [name, setName] = useState(feature?.name || '');
  const [description, setDescription] = useState(feature?.description || '');
  const [category, setCategory] = useState<string>(feature?.category || defaultCategory || PRICING_CATEGORIES[0]);
  const [priceJohn, setPriceJohn] = useState(feature?.price_john || 0);
  const [priceHarouna, setPriceHarouna] = useState(feature?.price_harouna || 0);
  const [priceAndre, setPriceAndre] = useState(feature?.price_andre || 0);
  const [isActive, setIsActive] = useState(feature?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(feature?.sort_order || 0);
  const [isSaving, setIsSaving] = useState(false);

  const finalPrice = Math.max(priceJohn, priceHarouna, priceAndre);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        name,
        description,
        category,
        price_john: priceJohn,
        price_harouna: priceHarouna,
        price_andre: priceAndre,
        sort_order: sortOrder,
        is_active: isActive,
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
      <div className="relative bg-[#0F1115] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">
            {feature ? 'Modifier la fonctionnalite' : 'Nouvelle fonctionnalite'}
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
            placeholder="Nom de la fonctionnalite"
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            rows={2}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Categorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
            >
              {PRICING_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0F1115]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Prix John"
              type="number"
              min={0}
              value={priceJohn}
              onChange={(e) => setPriceJohn(Number(e.target.value))}
            />
            <Input
              label="Prix Harouna"
              type="number"
              min={0}
              value={priceHarouna}
              onChange={(e) => setPriceHarouna(Number(e.target.value))}
            />
            <Input
              label="Prix Andre"
              type="number"
              min={0}
              value={priceAndre}
              onChange={(e) => setPriceAndre(Number(e.target.value))}
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-gray-400">Prix final (max des 3)</p>
            <p className="text-xl font-bold text-blue-400">{finalPrice.toLocaleString('fr-FR')} EUR</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ordre de tri"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
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
                <span className="text-sm text-gray-400">{isActive ? 'Active' : 'Inactive'}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" onClick={onClose} type="button" fullWidth>
              Annuler
            </Button>
            <Button type="submit" loading={isSaving} fullWidth>
              {feature ? 'Mettre a jour' : 'Creer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
