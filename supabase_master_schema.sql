-- ==========================================
-- LINGUAPLANET MASTER SCHEMA (PRODUCTION READY)
-- ==========================================

-- 1. CLEANUP (Optional - only if starting fresh)
-- DROP TABLE IF EXISTS leads CASCADE;
-- DROP TABLE IF EXISTS site_settings CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- 2. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. CREATE PROFILES (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE LEADS (Synced with Users)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREATE SITE SETTINGS (Bilingual)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_headline_en TEXT NOT NULL,
  hero_headline_ar TEXT NOT NULL,
  hero_subheadline_en TEXT NOT NULL,
  hero_subheadline_ar TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- 6. INSERT DEFAULT SETTINGS
INSERT INTO site_settings (id, hero_headline_en, hero_headline_ar, hero_subheadline_en, hero_subheadline_ar, whatsapp_number, contact_email)
VALUES (1, 
       'Master the Art of Communication', 
       'أتقن فن التواصل',
       'Elevate your professional profile with our world-class English and Soft Skills training designed for global leaders.', 
       'ارتقِ بملفك المهني من خلال تدريبنا المتميز في اللغة الإنجليزية والمهارات الشخصية المصمم للقادة العالميين.',
       '1234567890', 
       'info@linguaplanet.com')
ON CONFLICT (id) DO NOTHING;

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 8. POLICIES: PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 9. POLICIES: LEADS
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own leads" ON leads;
CREATE POLICY "Users can view their own leads" ON leads FOR SELECT USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
CREATE POLICY "Admins can view all leads" ON leads FOR ALL USING (auth.jwt() ->> 'email' = 'admin@linguaplanet.com');

-- 10. POLICIES: SETTINGS
DROP POLICY IF EXISTS "Anyone can view settings" ON site_settings;
CREATE POLICY "Anyone can view settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update settings" ON site_settings;
CREATE POLICY "Admins can update settings" ON site_settings FOR UPDATE USING (auth.jwt() ->> 'email' = 'admin@linguaplanet.com');

-- 11. TRIGGER FOR NEW USER PROFILE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
