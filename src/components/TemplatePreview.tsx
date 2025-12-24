'use client';

import { TemplateConfig } from '@/lib/template';
import { Broker } from '@/lib/supabase';

// Sample broker data for preview
const sampleBroker: Broker = {
  id: 'preview',
  slug: 'preview',
  name: 'Jean Tremblay',
  company: 'Hypothèques Tremblay',
  title: 'Courtier Hypothécaire',
  photo_url: '',
  phone: '(514) 555-1234',
  email: 'jean@exemple.com',
  bio: "Avec plus de 15 ans d'expérience dans l'industrie hypothécaire, je me spécialise dans l'aide aux premiers acheteurs et aux familles pour trouver la solution de financement parfaite. Mon engagement envers la transparence et le service personnalisé a aidé des centaines de clients à réaliser leurs rêves de propriété.",
  license_number: 'ABC123456',
  years_experience: 15,
  primary_color: '#1e40af',
  accent_color: '#f59e0b',
  created_at: '',
  updated_at: '',
};

interface TemplatePreviewProps {
  config: TemplateConfig;
}

export default function TemplatePreview({ config }: TemplatePreviewProps) {
  const broker = sampleBroker;
  const primaryColor = broker.primary_color || '#1e40af';
  const accentColor = broker.accent_color || '#f59e0b';

  const getSectionById = (id: string) => config.sections.find((s) => s.id === id);

  const renderSection = (sectionId: string) => {
    const section = getSectionById(sectionId);
    if (!section?.enabled) return null;

    switch (sectionId) {
      case 'hero':
        return (
          <header
            key="hero"
            className="text-white py-12 px-4"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {broker.name.charAt(0)}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1">{broker.name}</h1>
                <p className="text-lg opacity-90">{broker.title}</p>
                <p className="opacity-80">{broker.company}</p>
                {broker.license_number && (
                  <p className="text-sm opacity-70 mt-1">Licence #{broker.license_number}</p>
                )}
              </div>
            </div>
          </header>
        );

      case 'contact_info':
        return (
          <div key="contact_info" className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
              {section.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  Tel
                </div>
                <div>
                  <p className="text-xs text-gray-500">Téléphone</p>
                  <p className="font-semibold text-sm">{broker.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  @
                </div>
                <div>
                  <p className="text-xs text-gray-500">Courriel</p>
                  <p className="font-semibold text-sm">{broker.email}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div key="about" className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
              {section.title}
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{broker.bio}</p>
            {broker.years_experience > 0 && (
              <div className="mt-4">
                <span
                  className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: accentColor }}
                >
                  {broker.years_experience}+ ans d&apos;expérience
                </span>
              </div>
            )}
          </div>
        );

      case 'services':
        return (
          <div key="services" className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
              {section.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-2">
              {config.services.map((service, i) => (
                <div key={i} className="flex items-center gap-2 p-2">
                  <span style={{ color: accentColor }}>✓</span>
                  <span className="text-gray-700 text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div
            key="cta"
            className="rounded-xl p-6 text-center text-white mb-6"
            style={{ backgroundColor: primaryColor }}
          >
            <h2 className="text-xl font-bold mb-3">{section.title}</h2>
            <p className="mb-4 opacity-90 text-sm">{config.ctaText}</p>
            <button
              className="px-6 py-2 rounded-full font-semibold text-sm"
              style={{ backgroundColor: accentColor }}
            >
              {config.ctaButton}
            </button>
          </div>
        );

      case 'contact_form':
        return (
          <div key="contact_form" className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
              {section.title}
            </h2>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="px-3 py-2 border rounded text-sm"
                  disabled
                />
                <input
                  type="email"
                  placeholder="Courriel"
                  className="px-3 py-2 border rounded text-sm"
                  disabled
                />
              </div>
              <input
                type="tel"
                placeholder="Téléphone"
                className="w-full px-3 py-2 border rounded text-sm"
                disabled
              />
              <textarea
                placeholder="Votre message..."
                rows={3}
                className="w-full px-3 py-2 border rounded text-sm"
                disabled
              />
              <button
                className="w-full py-2 rounded text-white font-semibold text-sm"
                style={{ backgroundColor: primaryColor }}
                disabled
              >
                Envoyer le message
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {config.sections.map((section) => (
        <div key={section.id}>
          {section.id === 'hero' ? (
            renderSection('hero')
          ) : (
            <div className="max-w-4xl mx-auto px-4">{renderSection(section.id)}</div>
          )}
        </div>
      ))}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-semibold">{broker.name}</p>
          <p className="text-gray-400 text-sm">{broker.company}</p>
          <p className="text-xs text-gray-500 mt-2">
            © {new Date().getFullYear()} Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
