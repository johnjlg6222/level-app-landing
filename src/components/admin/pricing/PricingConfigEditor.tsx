'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button, Card, Input } from '@/components/common';
import { PRICING_CONFIG_KEYS } from '@/types/admin-pricing';
import type { PricingConfig, PricingConfigUpdate } from '@/types/admin-pricing';

interface PricingConfigEditorProps {
  config: PricingConfig[];
  onUpdate: (input: PricingConfigUpdate) => Promise<void>;
}

function ConfigSection({
  title,
  description,
  configKey,
  config,
  onUpdate,
  renderForm,
}: {
  title: string;
  description: string;
  configKey: string;
  config: PricingConfig[];
  onUpdate: (input: PricingConfigUpdate) => Promise<void>;
  renderForm: (value: Record<string, unknown>, onChange: (val: Record<string, unknown>) => void) => React.ReactNode;
}) {
  const existing = config.find((c) => c.key === configKey);
  const [value, setValue] = useState<Record<string, unknown>>(existing?.value || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = config.find((c) => c.key === configKey);
    if (existing) setValue(existing.value);
  }, [config, configKey]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await onUpdate({ key: configKey, value });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          loading={isSaving}
          variant={saved ? 'secondary' : 'primary'}
          icon={<Save className="w-3 h-3" />}
        >
          {saved ? 'Sauvegarde' : 'Sauvegarder'}
        </Button>
      </div>
      {renderForm(value, setValue)}
    </Card>
  );
}

export function PricingConfigEditor({ config, onUpdate }: PricingConfigEditorProps) {
  return (
    <div className="space-y-6">
      {/* Urgency Multipliers */}
      <ConfigSection
        title="Multiplicateurs d'urgence"
        description="Coefficients appliques selon le niveau d'urgence du projet"
        configKey={PRICING_CONFIG_KEYS.URGENCY_MULTIPLIERS}
        config={config}
        onUpdate={onUpdate}
        renderForm={(value, onChange) => {
          const urgencyLevels = ['normal', 'fast', 'urgent'] as const;
          return (
            <div className="space-y-3">
              {urgencyLevels.map((level) => {
                const data = (value[level] || { label: '', multiplier: 1, description: '' }) as {
                  label: string;
                  multiplier: number;
                  description: string;
                };
                return (
                  <div key={level} className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-white/5">
                    <Input
                      label="Label"
                      value={data.label}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          [level]: { ...data, label: e.target.value },
                        })
                      }
                      placeholder={level}
                    />
                    <Input
                      label="Multiplicateur"
                      type="number"
                      step={0.1}
                      min={1}
                      value={data.multiplier}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          [level]: { ...data, multiplier: parseFloat(e.target.value) || 1 },
                        })
                      }
                    />
                    <Input
                      label="Description"
                      value={data.description}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          [level]: { ...data, description: e.target.value },
                        })
                      }
                      placeholder="Description..."
                    />
                  </div>
                );
              })}
            </div>
          );
        }}
      />

      {/* Maintenance Tiers */}
      <ConfigSection
        title="Niveaux de maintenance"
        description="Tarifs mensuels par niveau de maintenance"
        configKey={PRICING_CONFIG_KEYS.MAINTENANCE_TIERS}
        config={config}
        onUpdate={onUpdate}
        renderForm={(value, onChange) => {
          const tiers = ['none', 'basic', 'standard', 'premium'] as const;
          return (
            <div className="space-y-3">
              {tiers.map((tier) => {
                const data = (value[tier] || { label: '', monthlyPrice: 0, description: '' }) as {
                  label: string;
                  monthlyPrice: number;
                  description: string;
                };
                return (
                  <div key={tier} className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-white/5">
                    <Input
                      label="Label"
                      value={data.label}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          [tier]: { ...data, label: e.target.value },
                        })
                      }
                      placeholder={tier}
                    />
                    <Input
                      label="Prix mensuel"
                      type="number"
                      min={0}
                      value={data.monthlyPrice}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          [tier]: { ...data, monthlyPrice: Number(e.target.value) },
                        })
                      }
                    />
                    <Input
                      label="Description"
                      value={data.description}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          [tier]: { ...data, description: e.target.value },
                        })
                      }
                      placeholder="Description..."
                    />
                  </div>
                );
              })}
            </div>
          );
        }}
      />

      {/* Screen Prices */}
      <ConfigSection
        title="Prix par ecran"
        description="Tarifs par type de complexite d'ecran"
        configKey={PRICING_CONFIG_KEYS.SCREEN_PRICES}
        config={config}
        onUpdate={onUpdate}
        renderForm={(value, onChange) => {
          const screenTypes = [
            { key: 'simple', label: 'Simple' },
            { key: 'standard', label: 'Standard' },
            { key: 'complex', label: 'Complexe' },
            { key: 'very_complex', label: 'Tres complexe' },
          ];
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {screenTypes.map(({ key, label }) => (
                <Input
                  key={key}
                  label={label}
                  type="number"
                  min={0}
                  value={(value[key] as number) || 0}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [key]: Number(e.target.value),
                    })
                  }
                />
              ))}
            </div>
          );
        }}
      />
    </div>
  );
}
