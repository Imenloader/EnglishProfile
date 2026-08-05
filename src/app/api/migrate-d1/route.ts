export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/d1';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    
    if (!token || token.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await executeQuery({
      d1Query: async (db) => {
        const results = [];
        try {
          await db.prepare("ALTER TABLE leads ADD COLUMN phone TEXT").run();
          results.push("Added phone column to leads table.");
        } catch (e: any) {
          results.push("Failed to add phone (might already exist): " + e.message);
        }

        try {
          await db.prepare(`
            CREATE TABLE IF NOT EXISTS lead_answers (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              lead_id TEXT NOT NULL,
              student_name TEXT,
              question_text TEXT,
              student_answer TEXT,
              correct_answer TEXT,
              is_correct INTEGER,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `).run();
          results.push("Ensured lead_answers table exists.");
        } catch (e: any) {
          results.push("Failed to create lead_answers table: " + e.message);
        }

        return { success: true, messages: results };
      },
      supabaseFallback: async () => {
        return { success: true, messages: ["D1 fallback skipped (Supabase migration not handled here)."] };
      }
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
