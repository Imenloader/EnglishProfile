import { supabase } from '@/lib/supabase';

export interface Lead {
  id: string;
  name: string;
  email: string;
  score: number;
  totalQuestions: number;
  level: string;
  date: string;
  user_id?: string;
}

export interface SiteSettings {
  id: string;
  heroHeadlineEn: string;
  heroHeadlineAr: string;
  heroSubheadlineEn: string;
  heroSubheadlineAr: string;
  contactEmail: string;
  whatsappNumber: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  tiktokLink?: string;
  updatedAt: Date;
}

// Fallback data in case of connection failure
const MOCK_SETTINGS: SiteSettings = {
  id: '1',
  heroHeadlineEn: 'Experience Educational Magnificence',
  heroHeadlineAr: 'اختبر الروعة التعليمية',
  heroSubheadlineEn: "Elevate your professional profile with Linguaplanet's world-class English training.",
  heroSubheadlineAr: "ارتقِ بملفك المهني من خلال تدريب لنجوابلانيت المتميز في اللغة الإنجليزية.",
  whatsappNumber: "+201270068237",
  contactEmail: "hello@linguaplanet.eg",
  facebookLink: "https://facebook.com/linguaplanet",
  instagramLink: "https://instagram.com/linguaplanet",
  linkedinLink: "https://linkedin.com/company/linguaplanet",
  tiktokLink: "https://tiktok.com/@linguaplanet",
  updatedAt: new Date(),
};

export const db = {
  // Leads
  getLeads: async (): Promise<Lead[]> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        score: l.score,
        totalQuestions: l.total_questions,
        level: l.level,
        date: l.created_at.split('T')[0],
        user_id: l.user_id
      }));
    } catch (error) {
      console.warn('⚠️ Fetching leads failed. This may be due to ad-blockers or network issues:', error);
      return [];
    }
  },
  
  saveLead: async (lead: Omit<Lead, 'id' | 'date'>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: lead.name,
          email: lead.email,
          score: lead.score,
          total_questions: lead.totalQuestions,
          level: lead.level,
          user_id: lead.user_id
        }])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('❌ Saving lead failed:', error);
      return null;
    }
  },

  // Settings
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        heroHeadlineEn: data.hero_headline_en,
        heroHeadlineAr: data.hero_headline_ar,
        heroSubheadlineEn: data.hero_subheadline_en,
        heroSubheadlineAr: data.hero_subheadline_ar,
        whatsappNumber: data.whatsapp_number,
        contactEmail: data.contact_email,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.warn('⚠️ Fetching settings failed. Using Masterpiece fallback data.', error);
      return MOCK_SETTINGS;
    }
  },

  saveSettings: async (settings: SiteSettings) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          hero_headline_en: settings.heroHeadlineEn,
          hero_headline_ar: settings.heroHeadlineAr,
          hero_subheadline_en: settings.heroSubheadlineEn,
          hero_subheadline_ar: settings.heroSubheadlineAr,
          whatsapp_number: settings.whatsappNumber,
          contact_email: settings.contactEmail
        })
        .eq('id', 1);
      
      if (error) throw error;
    } catch (error) {
      console.error('❌ Updating settings failed:', error);
    }
  },

  saveInquiry: async (inquiry: { name: string, email: string, message: string }) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: inquiry.name,
          email: inquiry.email,
          score: 0,
          total_questions: 0,
          level: `INQUIRY: ${inquiry.message}`,
        }])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('❌ Saving inquiry failed:', error);
      return null;
    }
  }
};
