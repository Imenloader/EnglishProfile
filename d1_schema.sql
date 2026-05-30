-- LINGUAPLANET CLOUDFLARE D1 DATABASE SCHEMA
-- This file defines the tables for Cloudflare D1 (SQLite)

-- 1. Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  level TEXT NOT NULL,
  writing_response TEXT,
  age_range TEXT,
  company TEXT,
  class_format TEXT DEFAULT 'online',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Create lead_answers table
CREATE TABLE IF NOT EXISTS lead_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  question_text TEXT NOT NULL,
  student_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL, -- 0 for false, 1 for true
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  hero_headline_en TEXT NOT NULL,
  hero_headline_ar TEXT NOT NULL,
  hero_subheadline_en TEXT NOT NULL,
  hero_subheadline_ar TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  facebook_link TEXT,
  instagram_link TEXT,
  linkedin_link TEXT,
  tiktok_link TEXT,
  webhook_url TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert Default Settings
INSERT OR IGNORE INTO site_settings (id, hero_headline_en, hero_headline_ar, hero_subheadline_en, hero_subheadline_ar, whatsapp_number, contact_email, facebook_link, instagram_link, linkedin_link, tiktok_link, webhook_url)
VALUES (1, 
       'Master the Art of Communication', 
       'أتقن فن التواصل',
       'Elevate your professional profile with our world-class English and Soft Skills training designed for global leaders.', 
       'ارتقِ بملفك المهني من خلال تدريبنا المتميز في اللغة الإنجليزية والمهارات الشخصية المصمم للقادة العالميين.',
       '+201270068237', 
       'hello@linguaplanet.eg',
       'https://facebook.com/linguaplanet',
       'https://instagram.com/linguaplanet',
       'https://linkedin.com/company/linguaplanet',
       'https://tiktok.com/@linguaplanet',
       '');

-- 4. Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON array of options stored as text string
  correct_answer TEXT NOT NULL,
  part INTEGER NOT NULL,
  level TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
