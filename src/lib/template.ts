import { supabase } from './supabase';

export type TemplateSection = {
  id: string;
  enabled: boolean;
  title: string;
};

export type LearningPoint = {
  title: string;
  description: string;
};

export type TemplateConfig = {
  sections: TemplateSection[];
  // Hero section
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroNote: string;
  // Guide/About section
  guideTitle: string;
  guideDescription: string;
  guideBadge: string;
  // Value section (learning points)
  valueTitle: string;
  valueSubtitle: string;
  learningPoints: LearningPoint[];
  // Final CTA
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  ctaNote: string;
};

export const defaultTemplateConfig: TemplateConfig = {
  sections: [
    { id: 'hero', enabled: true, title: 'Hero' },
    { id: 'guide', enabled: true, title: 'Guide & Contact' },
    { id: 'value', enabled: true, title: 'Learning Points' },
    { id: 'cta', enabled: true, title: 'Call to Action' },
  ],
  // Hero
  heroBadge: 'Guide gratuit disponible',
  heroTitle: 'Guide Cash Damming Locatif',
  heroSubtitle:
    'Comprendre la stratégie, pourquoi elle fonctionne, et comment la mettre en place à haut niveau.',
  heroButtonText: 'Recevoir le guide gratuit',
  heroNote: 'PDF gratuit - Aucun engagement',
  // Guide
  guideTitle: 'Guide Cash Damming Locatif',
  guideDescription:
    'Un guide éducatif complet pour comprendre cette stratégie fiscale et son application dans le contexte immobilier québécois.',
  guideBadge: 'Format PDF - 15+ pages',
  // Value
  valueTitle: 'Ce que vous apprendrez',
  valueSubtitle: 'Un aperçu du contenu éducatif inclus dans ce guide gratuit.',
  learningPoints: [
    {
      title: 'Comment fonctionne le Cash Damming',
      description:
        'Une explication claire et accessible de la mécanique derrière cette stratégie fiscale.',
    },
    {
      title: 'Améliorer votre flux de trésorerie',
      description: 'Comprendre pourquoi cette approche peut optimiser vos finances à long terme.',
    },
    {
      title: 'Pour qui est cette stratégie',
      description: 'Identifier si le Cash Damming convient à votre situation et vos objectifs.',
    },
    {
      title: 'Les erreurs courantes à éviter',
      description: 'Les pièges fréquents et comment les contourner pour une mise en place réussie.',
    },
    {
      title: 'Structure hypothécaire optimale',
      description: "L'importance d'une structure de financement adaptée à cette stratégie.",
    },
  ],
  // CTA
  ctaTitle: 'Recevez le guide gratuit',
  ctaText:
    "Découvrez comment le Cash Damming locatif peut s'intégrer dans votre stratégie d'investissement immobilier.",
  ctaButton: 'Recevoir le guide en PDF',
  ctaNote: 'Guide éducatif gratuit - Sans engagement - Contenu québécois',
};

export async function getTemplateConfig(): Promise<TemplateConfig> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('template_config')
    .eq('id', 'global')
    .single();

  if (error || !data?.template_config) {
    return defaultTemplateConfig;
  }

  return data.template_config as TemplateConfig;
}

export async function saveTemplateConfig(config: TemplateConfig): Promise<boolean> {
  const { error } = await supabase.from('site_settings').upsert({
    id: 'global',
    template_config: config,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving template config:', error);
    return false;
  }

  return true;
}
