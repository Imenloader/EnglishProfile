import { supabase } from '@/lib/supabase';

export interface Lead {
  id: string;
  name: string;
  email: string;
  score: number;
  total_questions: number;
  level: string;
  created_at: string;
}

export interface SiteSettings {
  hero_headline: string;
  hero_subheadline: string;
  whatsapp_number: string;
  contact_email: string;
}

export const db = {
  // Leads
  getLeads: async (): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
    return data || [];
  },
  
  saveLead: async (lead: Omit<Lead, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select();
    
    if (error) console.error('Error saving lead:', error);
    return data?.[0];
  },

  // Settings
  getSettings: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.error('Error fetching settings:', error);
      return {
        hero_headline: "Master the Art of Communication",
        hero_subheadline: "Elevate your professional profile with our world-class English training.",
        whatsapp_number: "1234567890",
        contact_email: "info@linguaplanet-eg.com"
      };
    }
    return data;
  },

  saveSettings: async (settings: SiteSettings) => {
    const { error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', 1);
    
    if (error) console.error('Error updating settings:', error);
  }
};
