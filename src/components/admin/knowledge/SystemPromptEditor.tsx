'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import type { SystemPromptConfig } from '@/types/knowledge';

interface SystemPromptEditorProps {
  onPreview: () => Promise<{ prompt: string; estimatedTokens: number } | null>;
}

export function SystemPromptEditor({ onPreview }: SystemPromptEditorProps) {
  const [config, setConfig] = useState<SystemPromptConfig>({
    prompt: '',
    personality: 'professional',
    language: 'fr',
    tone: 'friendly',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch config on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('chatbot_config')
        .select('*')
        .eq('key', 'system_prompt')
        .single();

      if (!error && data) {
        setConfig(data.value as SystemPromptConfig);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('chatbot_config')
        .update({ value: config })
        .eq('key', 'system_prompt');

      if (error) throw error;
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving config:', err);
      alert('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    const result = await onPreview();
    if (result) {
      setPreviewContent(result.prompt);
      setEstimatedTokens(result.estimatedTokens);
      setShowPreview(true);
    }
  };

  const updateConfig = (updates: Partial<SystemPromptConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-medium text-white">Configuration du Chatbot</h3>
              <p className="text-xs text-gray-500">Prompt systeme et parametres</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                         bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              Apercu
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-all ${
                hasChanges
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* System Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prompt Systeme
          </label>
          <textarea
            value={config.prompt}
            onChange={(e) => updateConfig({ prompt: e.target.value })}
            className="w-full h-32 px-4 py-3 bg-black/30 border border-white/10 rounded-xl
                       text-gray-300 text-sm
                       focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
                       resize-none"
            placeholder="Instructions pour le chatbot..."
          />
        </div>

        {/* Settings row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Personality */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Personnalite
            </label>
            <select
              value={config.personality}
              onChange={(e) => updateConfig({ personality: e.target.value })}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg
                         text-gray-300 text-sm
                         focus:outline-none focus:border-blue-500/50"
            >
              <option value="professional">Professionnel</option>
              <option value="casual">Decontracte</option>
              <option value="formal">Formel</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Langue
            </label>
            <select
              value={config.language}
              onChange={(e) => updateConfig({ language: e.target.value })}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg
                         text-gray-300 text-sm
                         focus:outline-none focus:border-blue-500/50"
            >
              <option value="fr">Francais</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ton
            </label>
            <select
              value={config.tone}
              onChange={(e) => updateConfig({ tone: e.target.value })}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg
                         text-gray-300 text-sm
                         focus:outline-none focus:border-blue-500/50"
            >
              <option value="friendly">Amical</option>
              <option value="neutral">Neutre</option>
              <option value="enthusiastic">Enthousiaste</option>
            </select>
          </div>
        </div>

        {/* Preview section */}
        {showPreview && (
          <div className="mt-4 p-4 bg-black/30 border border-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-300">
                Apercu du prompt complet
              </h4>
              <span className="text-xs text-gray-500">
                ~{estimatedTokens} tokens estimes
              </span>
            </div>
            <pre className="text-xs text-gray-400 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {previewContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemPromptEditor;
