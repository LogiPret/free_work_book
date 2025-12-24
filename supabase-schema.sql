-- Supabase SQL Schema for Brokers
-- Run this in your Supabase SQL Editor

-- Create the brokers table
CREATE TABLE IF NOT EXISTS brokers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  agence TEXT NOT NULL,
  agence_photo_url TEXT,
  equipe TEXT,
  equipe_photo_url TEXT,
  title TEXT DEFAULT 'Courtier hypothécaire',
  photo_url TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  pdf_url TEXT,
  pdf_token TEXT UNIQUE,
  years_experience INTEGER DEFAULT 0,
  primary_color TEXT DEFAULT '#1e40af',
  accent_color TEXT DEFAULT '#f59e0b',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_brokers_slug ON brokers(slug);

-- Create an index on pdf_token for PDF access lookups
CREATE INDEX IF NOT EXISTS idx_brokers_pdf_token ON brokers(pdf_token);

-- Enable Row Level Security (RLS)
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read brokers (public pages)
CREATE POLICY "Allow public read access" ON brokers
  FOR SELECT
  USING (true);

-- Create a policy that allows authenticated users to insert/update/delete
-- For simplicity, we're using anon key with service role for admin actions
-- In production, you'd want proper authentication
CREATE POLICY "Allow anon insert" ON brokers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anon update" ON brokers
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow anon delete" ON brokers
  FOR DELETE
  USING (true);

-- Optional: Insert a sample broker for testing
INSERT INTO brokers (slug, name, company, title, phone, email, bio, years_experience, primary_color, accent_color)
VALUES (
  'john-smith',
  'John Smith',
  'Smith Mortgage Co',
  'Senior Mortgage Broker',
  '(555) 123-4567',
  'john@smithmortgage.com',
  'With over 15 years of experience in the mortgage industry, I specialize in helping first-time homebuyers and families find the perfect financing solution. My commitment to transparency and personalized service has helped hundreds of clients achieve their homeownership dreams.',
  15,
  '#1e40af',
  '#f59e0b'
);
