export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getD1Database, executeQuery } from '@/lib/d1';
import { supabase } from '@/lib/supabase';

// GET /api/settings - Fetch the single site settings row (id = 1)
export async function GET() {
  try {
    const result = await executeQuery({
      d1Query: async (db) => {
        let settings = await db.prepare("SELECT * FROM site_settings WHERE id = 1").first();
        if (!settings) {
          // If for some reason default row is not inserted, return mock/fallback structure
          return null;
        }
        return settings;
      },
      supabaseFallback: async () => {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) throw error;
        return data;
      }
    });

    if (!result) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ GET /api/settings failed:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch settings" }, { status: 500 });
  }
}

// POST /api/settings - Update the site settings row (id = 1)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      hero_headline_en,
      hero_headline_ar,
      hero_subheadline_en,
      hero_subheadline_ar,
      whatsapp_number,
      contact_email,
      facebook_link,
      instagram_link,
      linkedin_link,
      tiktok_link,
      webhook_url
    } = body;

    const result = await executeQuery({
      d1Query: async (db) => {
        // Use INSERT OR REPLACE or UPDATE since id = 1
        await db.prepare(`
          INSERT INTO site_settings (
            id, hero_headline_en, hero_headline_ar, hero_subheadline_en, hero_subheadline_ar,
            whatsapp_number, contact_email, facebook_link, instagram_link, linkedin_link, tiktok_link, webhook_url, updated_at
          ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT(id) DO UPDATE SET
            hero_headline_en = excluded.hero_headline_en,
            hero_headline_ar = excluded.hero_headline_ar,
            hero_subheadline_en = excluded.hero_subheadline_en,
            hero_subheadline_ar = excluded.hero_subheadline_ar,
            whatsapp_number = excluded.whatsapp_number,
            contact_email = excluded.contact_email,
            facebook_link = excluded.facebook_link,
            instagram_link = excluded.instagram_link,
            linkedin_link = excluded.linkedin_link,
            tiktok_link = excluded.tiktok_link,
            webhook_url = excluded.webhook_url,
            updated_at = datetime('now')
        `).bind(
          hero_headline_en || '',
          hero_headline_ar || '',
          hero_subheadline_en || '',
          hero_subheadline_ar || '',
          whatsapp_number || '',
          contact_email || '',
          facebook_link || null,
          instagram_link || null,
          linkedin_link || null,
          tiktok_link || null,
          webhook_url || null
        ).run();

        return { success: true };
      },
      supabaseFallback: async () => {
        let { error } = await supabase
          .from('site_settings')
          .update({
            hero_headline_en,
            hero_headline_ar,
            hero_subheadline_en,
            hero_subheadline_ar,
            whatsapp_number,
            contact_email,
            facebook_link,
            instagram_link,
            linkedin_link,
            tiktok_link,
            webhook_url
          })
          .eq('id', 1);

        if (error && (error.code === '42703' || error.code === 'PGRST204' || (error.message && error.message.includes('schema cache')))) {
          console.warn("Schema column missing in Supabase site_settings. Falling back to minimal payload.");
          const fallbackResult = await supabase
            .from('site_settings')
            .update({
              hero_headline_en,
              hero_headline_ar,
              hero_subheadline_en,
              hero_subheadline_ar,
              whatsapp_number,
              contact_email
            })
            .eq('id', 1);
          error = fallbackResult.error;
        }

        if (error) throw error;
        return { success: true };
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ POST /api/settings failed:", err);
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}
