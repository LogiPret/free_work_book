'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Broker } from '@/lib/supabase';
import { TemplateConfig, defaultTemplateConfig } from '@/lib/template';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PdfRequestModal from '@/components/PdfRequestModal';
import {
  ArrowRight,
  FileText,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  Users,
  AlertCircle,
  Building,
} from 'lucide-react';

interface BrokerLandingProps {
  broker: Broker;
  templateConfig?: TemplateConfig;
}

const iconList = [BookOpen, TrendingUp, Users, AlertCircle, Building];

export default function BrokerLanding({
  broker,
  templateConfig = defaultTemplateConfig,
}: BrokerLandingProps) {
  // Merge with defaults to ensure all fields exist
  const config: TemplateConfig = {
    ...defaultTemplateConfig,
    ...templateConfig,
    sections: templateConfig?.sections ?? defaultTemplateConfig.sections,
    learningPoints: templateConfig?.learningPoints ?? defaultTemplateConfig.learningPoints,
  };
  const [showPdfModal, setShowPdfModal] = useState(false);
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
          brokerId: broker.id,
          brokerName: broker.name,
          brokerEmail: broker.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setFormStatus('error');
      setFormError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const isSectionEnabled = (id: string) => {
    const section = config.sections.find((s) => s.id === id);
    return section?.enabled ?? true;
  };

  // Get broker colors with fallbacks
  const primaryColor = broker.primary_color || '#1e40af';
  const accentColor = broker.accent_color || '#f59e0b';

  return (
    <div
      className="min-h-screen bg-background"
      style={
        {
          '--broker-primary': primaryColor,
          '--broker-accent': accentColor,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {broker.photo_url ? (
              <Image
                src={broker.photo_url}
                alt={broker.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
                {broker.name.charAt(0)}
              </div>
            )}
            <div className="text-center">
              <p className="text-xl font-semibold text-foreground">{broker.name}</p>
              <p className="text-sm text-muted-foreground">{broker.agence}</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        {isSectionEnabled('hero') && (
          <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderColor: `${accentColor}30`,
                  color: accentColor,
                  border: '1px solid',
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                {config.heroBadge}
              </div>

              <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                {config.heroTitle}
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {config.heroSubtitle}
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="group inline-flex items-center gap-2 rounded-lg px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  {config.heroButtonText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{config.heroNote}</p>
            </div>
          </section>
        )}

        {/* Guide Preview / Broker Info Section */}
        {isSectionEnabled('guide') && (
          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <Card className="overflow-hidden border-border/60 shadow-sm">
                <CardContent className="p-0">
                  <div className="grid gap-0 md:grid-cols-2">
                    {/* Guide Info */}
                    <div className="flex flex-col justify-center bg-secondary/30 p-8 lg:p-10">
                      <div
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <FileText className="h-6 w-6" style={{ color: primaryColor }} />
                      </div>
                      <h2 className="font-serif text-2xl font-medium text-foreground">
                        {config.guideTitle}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {config.guideDescription}
                      </p>
                      <div className="mt-6">
                        <span
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            color: accentColor,
                          }}
                        >
                          {config.guideBadge}
                        </span>
                      </div>
                    </div>

                    {/* Broker Info */}
                    <div className="flex flex-col justify-center p-8 lg:p-10">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                          {broker.photo_url ? (
                            <Image
                              src={broker.photo_url}
                              alt={broker.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                              {broker.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{broker.name}</h3>
                          <p className="text-sm text-muted-foreground">{broker.title}</p>
                          <p className="text-sm text-muted-foreground">{broker.agence}</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <a
                          href={`tel:${broker.phone}`}
                          className="flex items-center gap-3 text-sm text-muted-foreground transition-colors"
                          onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                        >
                          <Phone className="h-4 w-4" />
                          {broker.phone}
                        </a>
                        <a
                          href={`mailto:${broker.email}`}
                          className="flex items-center gap-3 text-sm text-muted-foreground transition-colors"
                          onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                        >
                          <Mail className="h-4 w-4" />
                          {broker.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Value Section - Learning Points */}
        {isSectionEnabled('value') && (
          <section className="bg-card px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-12 text-center">
                <h2 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
                  {config.valueTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                  {config.valueSubtitle}
                </p>
              </div>

              {/* Top row: first 3 cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {config.learningPoints.slice(0, 3).map((point, index) => {
                  const Icon = iconList[index % iconList.length];
                  return (
                    <Card
                      key={index}
                      className="border-border/40 bg-background transition-shadow hover:shadow-sm"
                    >
                      <CardContent className="p-6">
                        <div
                          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${accentColor}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: accentColor }} />
                        </div>
                        <h3 className="font-medium text-foreground">{point.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {point.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Bottom row: remaining cards centered */}
              {config.learningPoints.length > 3 && (
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  {config.learningPoints.slice(3).map((point, index) => {
                    const Icon = iconList[(index + 3) % iconList.length];
                    return (
                      <Card
                        key={index + 3}
                        className="w-full max-w-sm border-border/40 bg-background transition-shadow hover:shadow-sm"
                      >
                        <CardContent className="p-6">
                          <div
                            className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${accentColor}15` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: accentColor }} />
                          </div>
                          <h3 className="font-medium text-foreground">{point.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {point.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Final CTA Section */}
        {isSectionEnabled('cta') && (
          <section className="px-4 py-20 sm:px-6 lg:px-8" style={{ backgroundColor: primaryColor }}>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium text-white sm:text-4xl">
                {config.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">{config.ctaText}</p>

              <div className="mt-8">
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold transition-opacity hover:opacity-90"
                  style={{ color: primaryColor }}
                >
                  {config.ctaButton}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <p className="mt-4 text-sm text-white/60">{config.ctaNote}</p>
            </div>
          </section>
        )}

        {/* Contact Form Section */}
        <section id="contact" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
                Contactez-moi
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Remplissez le formulaire ci-dessous et je vous répondrai dans les plus brefs délais.
              </p>
            </div>

            {formStatus === 'success' ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <svg
                      className="h-8 w-8"
                      style={{ color: accentColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Message envoyé!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Merci de m&apos;avoir contacté. Je vous répondrai bientôt.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setFormStatus('idle')}>
                    Envoyer un autre message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formStatus === 'error' && (
                      <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                        {formError}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Votre nom *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                          placeholder="Jean Tremblay"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Courriel *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                          placeholder="jean@exemple.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                        placeholder="(514) 555-1234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
                        placeholder="Je souhaite en savoir plus sur le guide..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className="w-full rounded-lg px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {formStatus === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">{broker.name}</p>
              <p className="text-base text-muted-foreground">{broker.agence}</p>
              <p className="text-sm text-muted-foreground">{broker.title}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {broker.agence}. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* PDF Request Modal */}
      <PdfRequestModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        brokerId={broker.id}
        brokerName={broker.name}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />
    </div>
  );
}
