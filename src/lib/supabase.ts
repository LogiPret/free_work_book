import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Broker = {
  id: string;
  slug: string;
  name: string;
  company: string;
  title: string;
  photo_url: string;
  phone: string;
  email: string;
  bio: string;
  license_number: string;
  years_experience: number;
  primary_color: string;
  accent_color: string;
  created_at: string;
  updated_at: string;
};
