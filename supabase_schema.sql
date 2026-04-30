-- ELITE ACADEMY SUPABASE SCHEMA (CLEANUP & SETUP)
-- WARNING: Running this will delete existing lead data!

-- 1. Drop existing tables to ensure a clean state with new bilingual columns
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS site_settings;

-- 2. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Create Leads Table
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Settings Table (Bilingual)
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_headline_en TEXT NOT NULL,
  hero_headline_ar TEXT NOT NULL,
  hero_subheadline_en TEXT NOT NULL,
  hero_subheadline_ar TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- 5. Insert Default Settings
INSERT INTO site_settings (id, hero_headline_en, hero_headline_ar, hero_subheadline_en, hero_subheadline_ar, whatsapp_number, contact_email)
VALUES (1, 
       'Master the Art of Communication', 
       'أتقن فن التواصل',
       'Elevate your professional profile with our world-class English and Soft Skills training designed for global leaders.', 
       'ارتقِ بملفك المهني من خلال تدريبنا المتميز في اللغة الإنجليزية والمهارات الشخصية المصمم للقادة العالميين.',
       '1234567890', 
       'info@eliteacademy.com');

-- 6. Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 7. Policies for Leads
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view leads" ON leads FOR SELECT USING (true);

-- 8. Policies for Settings
CREATE POLICY "Anyone can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can update settings" ON site_settings FOR UPDATE USING (true);
