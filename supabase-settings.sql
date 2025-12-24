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

-- PDF Requests tracking table
CREATE TABLE IF NOT EXISTS pdf_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster broker lookups
CREATE INDEX IF NOT EXISTS idx_pdf_requests_broker ON pdf_requests(broker_id);

-- Enable RLS
ALTER TABLE pdf_requests ENABLE ROW LEVEL SECURITY;

-- Allow insert (public can submit requests)
CREATE POLICY "Allow public insert" ON pdf_requests FOR INSERT WITH CHECK (true);

-- Allow read for admins
CREATE POLICY "Allow read" ON pdf_requests FOR SELECT USING (true);

-- Supabase Storage bucket for PDFs
-- Run this in your Supabase dashboard > Storage > Create new bucket
-- Bucket name: broker-pdfs
-- Public bucket: Yes (so PDFs are accessible via URL)
