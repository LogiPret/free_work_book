'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TemplateConfig, defaultTemplateConfig } from '@/lib/template';
import TemplatePreview from '@/components/TemplatePreview';

export default function TemplateEditorPage() {
  const [config, setConfig] = useState<TemplateConfig>(defaultTemplateConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newService, setNewService] = useState('');

  useEffect(() => {
    fetch('/api/template')
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
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

  const updateSectionTitle = (id: string, title: string) => {
    setConfig({
      ...config,
      sections: config.sections.map((s) => (s.id === id ? { ...s, title } : s)),
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setConfig({ ...config, sections: newSections });
  };

  const addService = () => {
    if (!newService.trim()) return;
    setConfig({ ...config, services: [...config.services, newService.trim()] });
    setNewService('');
  };

  const removeService = (index: number) => {
    setConfig({ ...config, services: config.services.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-gray-200">
              &larr; Back
            </Link>
            <h1 className="text-xl font-bold text-white">Template Editor</h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-green-400 text-sm">Saved!</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Settings Panel */}
        <div className="w-[400px] bg-gray-800 border-r border-gray-700 overflow-y-auto p-6">
          {/* Sections */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-white">Sections</h2>
            <p className="text-sm text-gray-400 mb-4">Toggle and reorder sections</p>
            <div className="space-y-2">
              {config.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`border rounded-lg p-3 ${section.enabled ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 border-gray-700 opacity-60'}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => toggleSection(section.id)}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 text-white rounded text-sm"
                      disabled={section.id === 'hero'}
                    />
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

          {/* Services */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-white">Services List</h2>
            <div className="space-y-2 mb-3">
              {config.services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => {
                      const newServices = [...config.services];
                      newServices[index] = e.target.value;
                      setConfig({ ...config, services: newServices });
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                  />
                  <button
                    onClick={() => removeService(index)}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add new service..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addService()}
              />
              <button
                onClick={addService}
                className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-500"
              >
                Add
              </button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-white">Call to Action</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">CTA Text</label>
                <textarea
                  value={config.ctaText}
                  onChange={(e) => setConfig({ ...config, ctaText: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Button Text</label>
                <input
                  type="text"
                  value={config.ctaButton}
                  onChange={(e) => setConfig({ ...config, ctaButton: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                />
              </div>
            </div>
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
