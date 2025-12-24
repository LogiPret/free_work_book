-- Add this to your Supabase SQL Editor

-- Site settings table for global template config
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  template_config JSONB DEFAULT '{
    "sections": [
      {"id": "hero", "enabled": true, "title": "Hero"},
      {"id": "contact_info", "enabled": true, "title": "Contact Me"},
      {"id": "about", "enabled": true, "title": "About Me"},
      {"id": "services", "enabled": true, "title": "My Services"},
      {"id": "cta", "enabled": true, "title": "Ready to Get Started?"},
      {"id": "contact_form", "enabled": true, "title": "Send Me a Message"}
    ],
    "services": [
      "First-Time Home Buyers",
      "Refinancing",
      "Investment Properties",
      "Pre-Approval",
      "Mortgage Renewal",
      "Debt Consolidation"
    ],
    "ctaText": "Let me help you find the perfect mortgage solution for your needs.",
    "ctaButton": "Call Now"
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access
CREATE POLICY "Allow public read" ON site_settings FOR SELECT USING (true);

-- Allow update
CREATE POLICY "Allow update" ON site_settings FOR UPDATE USING (true);
