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
  webhookUrl?: string;
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
  facebookLink: "https://www.facebook.com/Linguaplane25",
  instagramLink: "https://instagram.com/linguaplanet",
  linkedinLink: "https://linkedin.com/company/linguaplanet",
  tiktokLink: "https://tiktok.com/@linguaplanet",
  updatedAt: new Date(),
  webhookUrl: "",
};

// Optimization: In-memory cache for site settings to prevent redundant Supabase calls
let cachedSettings: SiteSettings | null = null;
let settingsPromise: Promise<SiteSettings> | null = null;

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
    // If we have cached settings, return them immediately
    if (cachedSettings) return cachedSettings;

    // If a request is already in flight, wait for it
    if (settingsPromise) return settingsPromise;

    // Create a new promise for fetching settings
    settingsPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) throw error;
        
        const settings: SiteSettings = {
          id: '1',
          heroHeadlineEn: data.hero_headline_en,
          heroHeadlineAr: data.hero_headline_ar,
          heroSubheadlineEn: data.hero_subheadline_en,
          heroSubheadlineAr: data.hero_subheadline_ar,
          whatsappNumber: data.whatsapp_number,
          contactEmail: data.contact_email,
          facebookLink: data.facebook_link || MOCK_SETTINGS.facebookLink,
          instagramLink: data.instagram_link || MOCK_SETTINGS.instagramLink,
          linkedinLink: data.linkedin_link || MOCK_SETTINGS.linkedinLink,
          tiktokLink: data.tiktok_link || MOCK_SETTINGS.tiktokLink,
          updatedAt: new Date(data.updated_at || Date.now()),
          webhookUrl: data.webhook_url || ""
        };

        cachedSettings = settings;
        return settings;
      } catch (error) {
        console.warn('⚠️ Fetching settings failed. Using Masterpiece fallback data.', error);
        return MOCK_SETTINGS;
      } finally {
        // Clear the promise once it's finished so next calls can refresh if needed
        // though we check cachedSettings first
        settingsPromise = null;
      }
    })();

    return settingsPromise;
  },

  saveSettings: async (settings: SiteSettings) => {
    try {
      let { error } = await supabase
        .from('site_settings')
        .update({
          hero_headline_en: settings.heroHeadlineEn,
          hero_headline_ar: settings.heroHeadlineAr,
          hero_subheadline_en: settings.heroSubheadlineEn,
          hero_subheadline_ar: settings.heroSubheadlineAr,
          whatsapp_number: settings.whatsappNumber,
          contact_email: settings.contactEmail,
          facebook_link: settings.facebookLink,
          instagram_link: settings.instagramLink,
          linkedin_link: settings.linkedinLink,
          tiktok_link: settings.tiktokLink,
          webhook_url: settings.webhookUrl
        })
        .eq('id', 1);
      
      if (error && (error.code === '42703' || error.code === 'PGRST204' || (error.message && error.message.includes('schema cache')))) {
        console.warn("Schema column missing in Supabase site_settings. Falling back to minimal payload.");
        const fallbackResult = await supabase
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
        error = fallbackResult.error;
      }

      if (error) throw error;
      
      // Update cache immediately on success
      cachedSettings = settings;
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
