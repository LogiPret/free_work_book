'use client';

import { useState } from 'react';
import { Broker } from '@/lib/supabase';
import { TemplateConfig, defaultTemplateConfig } from '@/lib/template';
import Image from 'next/image';

interface BrokerLandingProps {
  broker: Broker;
  templateConfig?: TemplateConfig;
}

export default function BrokerLanding({
  broker,
  templateConfig = defaultTemplateConfig,
}: BrokerLandingProps) {
  const primaryColor = broker.primary_color || '#1e40af';
  const accentColor = broker.accent_color || '#f59e0b';
  const config = templateConfig;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brokerSlug: broker.slug,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setFormStatus('error');
      setFormError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const getSection = (id: string) => config.sections.find((s) => s.id === id);
  const isSectionEnabled = (id: string) => getSection(id)?.enabled ?? true;
  const getSectionTitle = (id: string, fallback: string) => getSection(id)?.title ?? fallback;

  // Render sections in order from config
  const renderSection = (sectionId: string) => {
    if (!isSectionEnabled(sectionId)) return null;

    switch (sectionId) {
      case 'hero':
        return (
          <header
            key="hero"
            className="text-white py-16 px-4"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0 bg-gray-200">
                {broker.photo_url ? (
                  <Image
                    src={broker.photo_url}
                    alt={broker.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {broker.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{broker.name}</h1>
                <p className="text-xl opacity-90">{broker.title}</p>
                <p className="text-lg opacity-80">{broker.company}</p>
                {broker.license_number && (
                  <p className="text-sm opacity-70 mt-2">Licence #{broker.license_number}</p>
                )}
              </div>
            </div>
          </header>
        );

      case 'contact_info':
        return (
          <div key="contact_info" className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
              {getSectionTitle('contact_info', 'Me contacter')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href={`tel:${broker.phone}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-semibold">{broker.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${broker.email}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courriel</p>
                  <p className="font-semibold">{broker.email}</p>
                </div>
              </a>
            </div>
          </div>
        );

      case 'about':
        return (
          <div key="about" className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
              {getSectionTitle('about', 'À propos de moi')}
            </h2>
            <p className="text-gray-700 leading-relaxed">{broker.bio}</p>
            {broker.years_experience > 0 && (
              <div className="mt-6 flex items-center gap-2">
                <span
                  className="px-4 py-2 rounded-full text-white text-sm font-semibold"
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
          <div key="services" className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
              {getSectionTitle('services', 'Mes services')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {config.services.map((service) => (
                <div key={service} className="flex items-center gap-3 p-3">
                  <svg
                    className="w-5 h-5 shrink-0"
                    style={{ color: accentColor }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div
            key="cta"
            className="rounded-xl p-8 text-center text-white mb-8"
            style={{ backgroundColor: primaryColor }}
          >
            <h2 className="text-2xl font-bold mb-4">
              {getSectionTitle('cta', 'Prêt à commencer?')}
            </h2>
            <p className="mb-6 opacity-90">{config.ctaText}</p>
            <a
              href={`tel:${broker.phone}`}
              className="inline-block px-8 py-3 rounded-full font-semibold transition hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              {config.ctaButton}
            </a>
          </div>
        );

      case 'contact_form':
        return (
          <div key="contact_form" className="bg-white rounded-xl shadow-lg p-8 mb-8" id="contact">
            <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
              {getSectionTitle('contact_form', 'Envoyez-moi un message')}
            </h2>

            {formStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Message envoyé!</h3>
                <p>Merci de m&apos;avoir contacté. Je vous répondrai bientôt.</p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="mt-4 text-green-600 hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Votre nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      placeholder="Jean Tremblay"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Courriel *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      placeholder="jean@exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    placeholder="(514) 555-1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
                    placeholder="Je souhaite en savoir plus sur les options hypothécaires..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {formStatus === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render sections in order */}
      {config.sections.map((section) => {
        if (section.id === 'hero') {
          return renderSection('hero');
        }
        return null;
      })}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {config.sections.filter((s) => s.id !== 'hero').map((section) => renderSection(section.id))}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold">{broker.name}</p>
          <p className="text-gray-400">{broker.company}</p>
          <p className="text-sm text-gray-500 mt-4">
            © {new Date().getFullYear()} Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
