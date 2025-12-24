'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TemplateConfig, defaultTemplateConfig, LearningPoint } from '@/lib/template';
import TemplatePreview from '@/components/TemplatePreview';

export default function TemplateEditorPage() {
  const [config, setConfig] = useState<TemplateConfig>(defaultTemplateConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'hero' | 'guide' | 'value' | 'cta'>(
    'sections'
  );

  useEffect(() => {
    fetch('/api/template')
      .then((res) => res.json())
      .then((data) => {
        // Merge with defaults to handle missing fields
        setConfig({ ...defaultTemplateConfig, ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/template', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const toggleSection = (id: string) => {
    setConfig({
      ...config,
      sections: config.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setConfig({ ...config, sections: newSections });
  };

  const updateLearningPoint = (index: number, field: keyof LearningPoint, value: string) => {
    const newPoints = [...config.learningPoints];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setConfig({ ...config, learningPoints: newPoints });
  };

  const addLearningPoint = () => {
    setConfig({
      ...config,
      learningPoints: [
        ...config.learningPoints,
        { title: 'Nouveau point', description: 'Description du point' },
      ],
    });
  };

  const removeLearningPoint = (index: number) => {
    setConfig({
      ...config,
      learningPoints: config.learningPoints.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'sections', label: 'Sections' },
    { id: 'hero', label: 'Hero' },
    { id: 'guide', label: 'Guide' },
    { id: 'value', label: 'Points clés' },
    { id: 'cta', label: 'CTA' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-gray-200">
              &larr; Retour
            </Link>
            <h1 className="text-xl font-bold text-white">Éditeur de gabarit</h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-green-400 text-sm">Sauvegardé!</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Settings Panel */}
        <div className="w-[450px] bg-gray-800 border-r border-gray-700 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-blue-500 bg-gray-700/50'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Sections Tab */}
            {activeTab === 'sections' && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-white">Sections</h2>
                <p className="text-sm text-gray-400 mb-4">Activer/désactiver et réordonner</p>
                <div className="space-y-2">
                  {config.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`border rounded-lg p-3 ${
                        section.enabled
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-gray-800 border-gray-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={() => toggleSection(section.id)}
                          className="w-4 h-4"
                        />
                        <span className="flex-1 text-white text-sm">{section.title}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === config.sections.length - 1}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hero Tab */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Section Hero</h2>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Badge</label>
                  <input
                    type="text"
                    value={config.heroBadge}
                    onChange={(e) => setConfig({ ...config, heroBadge: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Titre</label>
                  <input
                    type="text"
                    value={config.heroTitle}
                    onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Sous-titre</label>
                  <textarea
                    value={config.heroSubtitle}
                    onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Texte du bouton
                  </label>
                  <input
                    type="text"
                    value={config.heroButtonText}
                    onChange={(e) => setConfig({ ...config, heroButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Note sous le bouton
                  </label>
                  <input
                    type="text"
                    value={config.heroNote}
                    onChange={(e) => setConfig({ ...config, heroNote: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>
              </div>
            )}

            {/* Guide Tab */}
            {activeTab === 'guide' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Section Guide</h2>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Titre du guide
                  </label>
                  <input
                    type="text"
                    value={config.guideTitle}
                    onChange={(e) => setConfig({ ...config, guideTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={config.guideDescription}
                    onChange={(e) => setConfig({ ...config, guideDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Badge</label>
                  <input
                    type="text"
                    value={config.guideBadge}
                    onChange={(e) => setConfig({ ...config, guideBadge: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>
              </div>
            )}

            {/* Value/Learning Points Tab */}
            {activeTab === 'value' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Points clés</h2>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Titre de la section
                  </label>
                  <input
                    type="text"
                    value={config.valueTitle}
                    onChange={(e) => setConfig({ ...config, valueTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Sous-titre</label>
                  <input
                    type="text"
                    value={config.valueSubtitle}
                    onChange={(e) => setConfig({ ...config, valueSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300">Points</label>
                    <button
                      onClick={addLearningPoint}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      + Ajouter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {config.learningPoints.map((point, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Point {index + 1}</span>
                          <button
                            onClick={() => removeLearningPoint(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Supprimer
                          </button>
                        </div>
                        <input
                          type="text"
                          value={point.title}
                          onChange={(e) => updateLearningPoint(index, 'title', e.target.value)}
                          placeholder="Titre"
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded text-sm"
                        />
                        <textarea
                          value={point.description}
                          onChange={(e) =>
                            updateLearningPoint(index, 'description', e.target.value)
                          }
                          placeholder="Description"
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Tab */}
            {activeTab === 'cta' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Call to Action</h2>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Titre</label>
                  <input
                    type="text"
                    value={config.ctaTitle}
                    onChange={(e) => setConfig({ ...config, ctaTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Texte</label>
                  <textarea
                    value={config.ctaText}
                    onChange={(e) => setConfig({ ...config, ctaText: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Texte du bouton
                  </label>
                  <input
                    type="text"
                    value={config.ctaButton}
                    onChange={(e) => setConfig({ ...config, ctaButton: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Note sous le bouton
                  </label>
                  <input
                    type="text"
                    value={config.ctaNote}
                    onChange={(e) => setConfig({ ...config, ctaNote: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-y-auto bg-gray-700">
          <div className="max-w-4xl mx-auto my-6">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <TemplatePreview config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
