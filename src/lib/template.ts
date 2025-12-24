import { supabase } from './supabase';

export type TemplateSection = {
  id: string;
  enabled: boolean;
  title: string;
};

export type TemplateConfig = {
  sections: TemplateSection[];
  services: string[];
  ctaText: string;
  ctaButton: string;
};

export const defaultTemplateConfig: TemplateConfig = {
  sections: [
    { id: 'hero', enabled: true, title: 'Hero' },
    { id: 'contact_info', enabled: true, title: 'Contact Me' },
    { id: 'about', enabled: true, title: 'About Me' },
    { id: 'services', enabled: true, title: 'My Services' },
    { id: 'cta', enabled: true, title: 'Ready to Get Started?' },
    { id: 'contact_form', enabled: true, title: 'Send Me a Message' },
  ],
  services: [
    'First-Time Home Buyers',
    'Refinancing',
    'Investment Properties',
    'Pre-Approval',
    'Mortgage Renewal',
    'Debt Consolidation',
  ],
  ctaText: 'Let me help you find the perfect mortgage solution for your needs.',
  ctaButton: 'Call Now',
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
