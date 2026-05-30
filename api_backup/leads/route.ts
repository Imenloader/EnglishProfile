export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getD1Database, executeQuery } from '@/lib/d1';
import { supabase } from '@/lib/supabase';

// GET /api/leads - Fetch all leads and detailed answers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAnswers = searchParams.get('include_answers') !== 'false';

    const result = await executeQuery({
      d1Query: async (db) => {
        const leadsQuery = db.prepare("SELECT * FROM leads ORDER BY created_at DESC");
        
        if (includeAnswers) {
          const answersQuery = db.prepare("SELECT * FROM lead_answers ORDER BY created_at DESC");
          // Execute batch selects
          const [leadsRes, answersRes] = await db.batch([leadsQuery, answersQuery]);
          
          return {
            leads: leadsRes.results || [],
            answers: answersRes.results || []
          };
        } else {
          const { results } = await leadsQuery.all();
          return { leads: results || [], answers: [] };
        }
      },
      supabaseFallback: async () => {
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (leadsError) throw leadsError;

        let answers: any[] = [];
        if (includeAnswers) {
          const { data: answersData, error: answersError } = await supabase
            .from('lead_answers')
            .select('*')
            .order('created_at', { ascending: false });
          if (!answersError) {
            answers = answersData || [];
          }
        }

        return {
          leads: leads || [],
          answers: answers
        };
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ GET /api/leads failed:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch leads" }, { status: 500 });
  }
}

// POST /api/leads - Create a new lead and its answers
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      score,
      total_questions,
      level,
      writing_response,
      age_range,
      company,
      class_format,
      answers
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields: name, email" }, { status: 400 });
    }

    // Generate unique ID for SQLite lead
    const leadId = crypto.randomUUID();

    const result = await executeQuery({
      d1Query: async (db) => {
        const stmtLead = db.prepare(`
          INSERT INTO leads (id, name, email, phone, score, total_questions, level, writing_response, age_range, company, class_format)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          leadId,
          name,
          email,
          phone || null,
          score,
          total_questions,
          level,
          writing_response || null,
          age_range || null,
          company || null,
          class_format || 'online'
        );

        const stmts = [stmtLead];

        if (answers && Array.isArray(answers)) {
          for (const ans of answers) {
            const stmtAns = db.prepare(`
              INSERT INTO lead_answers (lead_id, student_name, question_text, student_answer, correct_answer, is_correct)
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
              leadId,
              name,
              ans.question_text || ans.questionText || '',
              ans.student_answer || ans.studentAnswer || '',
              ans.correct_answer || ans.correctAnswer || '',
              (ans.is_correct || ans.isCorrect) ? 1 : 0
            );
            stmts.push(stmtAns);
          }
        }

        // Execute batch transaction in SQLite/D1
        await db.batch(stmts);

        // Fetch and return the newly inserted lead
        const lead = await db.prepare("SELECT * FROM leads WHERE id = ?").bind(leadId).first();
        return { success: true, data: lead };
      },
      supabaseFallback: async () => {
        const insertPayload: any = {
          name,
          email,
          phone,
          score,
          total_questions,
          level,
          writing_response,
          age_range,
          company,
          class_format
        };

        let { data: lead, error: leadError } = await supabase
          .from('leads')
          .insert([insertPayload])
          .select()
          .single();

        // Resilient fallback in case column class_format does not exist on remote database yet
        if (leadError && leadError.code === '42703') {
          console.warn("class_format column missing in Supabase. Falling back to company override.");
          const fallbackCompany = company
            ? `${company} (Prefers: ${(class_format || 'online').toUpperCase()})`
            : `Prefers: ${(class_format || 'online').toUpperCase()}`;
          
          delete insertPayload.class_format;
          insertPayload.company = fallbackCompany;

          const fallbackResult = await supabase
            .from('leads')
            .insert([insertPayload])
            .select()
            .single();
          lead = fallbackResult.data;
          leadError = fallbackResult.error;
        }

        if (leadError) throw leadError;

        if (lead && answers && Array.isArray(answers)) {
          const answersToSave = answers.map((ans: any) => ({
            lead_id: lead.id,
            student_name: name,
            question_text: ans.question_text || ans.questionText || '',
            student_answer: ans.student_answer || ans.studentAnswer || '',
            correct_answer: ans.correct_answer || ans.correctAnswer || '',
            is_correct: ans.is_correct || ans.isCorrect || false
          }));
          const { error: answersError } = await supabase.from('lead_answers').insert(answersToSave);
          if (answersError) {
            console.error("❌ Saving lead answers to Supabase failed:", answersError);
          }
        }

        return { success: true, data: lead };
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ POST /api/leads failed:", err);
    return NextResponse.json({ error: err.message || "Failed to save lead" }, { status: 500 });
  }
}
