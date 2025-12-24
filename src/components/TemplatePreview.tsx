'use client';

import { TemplateConfig } from '@/lib/template';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface TemplatePreviewProps {
  config: TemplateConfig;
}

const iconList = [BookOpen, TrendingUp, Users, AlertCircle, Building];

// Sample broker for preview
const sampleBroker = {
  name: 'Marie Tremblay',
  agence: 'Groupe Hypothécaire MT',
  equipe: 'Équipe Tremblay',
  title: 'Courtière hypothécaire',
  phone: '(514) 555-1234',
  email: 'marie@groupemt.ca',
  photo_url: '',
};

export default function TemplatePreview({ config }: TemplatePreviewProps) {
  const isSectionEnabled = (id: string) => {
    const section = config.sections.find((s) => s.id === id);
    return section?.enabled ?? true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="w-full border-b border-border/40 bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
              {sampleBroker.name.charAt(0)}
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">{sampleBroker.name}</p>
              <p className="text-xs text-muted-foreground">{sampleBroker.agence}</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        {isSectionEnabled('hero') && (
          <section className="relative px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs text-accent font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {config.heroBadge}
              </div>

              <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                {config.heroTitle}
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {config.heroSubtitle}
              </p>

              <div className="mt-6">
                <Button size="default" className="group gap-2">
                  {config.heroButtonText}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">{config.heroNote}</p>
            </div>
          </section>
        )}

        {/* Guide Preview / Broker Info Section */}
        {isSectionEnabled('guide') && (
          <section className="px-4 py-10">
            <div className="mx-auto max-w-3xl">
              <Card className="overflow-hidden border-border/60 shadow-sm">
                <CardContent className="p-0">
                  <div className="grid gap-0 md:grid-cols-2">
                    {/* Guide Info */}
                    <div className="flex flex-col justify-center bg-secondary/30 p-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="font-serif text-lg font-medium text-foreground">
                        {config.guideTitle}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {config.guideDescription}
                      </p>
                      <div className="mt-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          {config.guideBadge}
                        </span>
                      </div>
                    </div>

                    {/* Broker Info */}
                    <div className="flex flex-col justify-center p-6">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                          {sampleBroker.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-foreground">
                            {sampleBroker.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">{sampleBroker.title}</p>
                          <p className="text-xs text-muted-foreground">{sampleBroker.agence}</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {sampleBroker.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {sampleBroker.email}
                        </div>
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
          <section className="bg-card px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <h2 className="font-serif text-xl font-medium text-foreground sm:text-2xl">
                  {config.valueTitle}
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground">
                  {config.valueSubtitle}
                </p>
              </div>

              {/* Cards grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {config.learningPoints.slice(0, 3).map((point, index) => {
                  const Icon = iconList[index % iconList.length];
                  return (
                    <Card key={index} className="border-border/40 bg-background">
                      <CardContent className="p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                          <Icon className="h-4 w-4 text-accent" />
                        </div>
                        <h3 className="text-sm font-medium text-foreground">{point.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {point.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {config.learningPoints.length > 3 && (
                <div className="mt-3 flex flex-wrap justify-center gap-3">
                  {config.learningPoints.slice(3).map((point, index) => {
                    const Icon = iconList[(index + 3) % iconList.length];
                    return (
                      <Card
                        key={index + 3}
                        className="w-full max-w-xs border-border/40 bg-background"
                      >
                        <CardContent className="p-4">
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                            <Icon className="h-4 w-4 text-accent" />
                          </div>
                          <h3 className="text-sm font-medium text-foreground">{point.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
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
          <section className="bg-primary px-4 py-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-xl font-medium text-primary-foreground sm:text-2xl">
                {config.ctaTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-primary-foreground/80">
                {config.ctaText}
              </p>

              <div className="mt-6">
                <Button size="default" variant="secondary" className="group gap-2">
                  {config.ctaButton}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <p className="mt-3 text-xs text-primary-foreground/60">{config.ctaNote}</p>
            </div>
          </section>
        )}

        {/* Contact Form Preview */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-serif text-xl font-medium text-foreground">Contactez-moi</h2>
            <p className="mt-2 text-xs text-muted-foreground">Formulaire de contact (aperçu)</p>
            <Card className="mt-6">
              <CardContent className="p-4 text-left">
                <div className="space-y-3">
                  <div className="h-8 rounded bg-input/50"></div>
                  <div className="h-8 rounded bg-input/50"></div>
                  <div className="h-16 rounded bg-input/50"></div>
                  <Button size="sm" className="w-full">
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base font-semibold text-foreground">{sampleBroker.name}</p>
          <p className="text-xs text-muted-foreground">{sampleBroker.agence}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
