export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getD1Database, executeQuery } from '@/lib/d1';
import { supabase } from '@/lib/supabase';

// Helper to safely parse JSON options in SQLite results
const formatSQLiteQuestion = (q: any) => {
  if (!q) return q;
  let parsedOptions = [];
  try {
    parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
  } catch (e) {
    parsedOptions = q.options ? String(q.options).split(',') : [];
  }
  return {
    ...q,
    options: parsedOptions,
    correctAnswer: q.correct_answer || q.correctAnswer
  };
};

// GET /api/questions - Fetch all questions sorted by part and ID
export async function GET() {
  try {
    const result = await executeQuery({
      d1Query: async (db) => {
        const { results } = await db.prepare("SELECT * FROM questions ORDER BY part ASC, id ASC").all();
        return (results || []).map(formatSQLiteQuestion);
      },
      supabaseFallback: async () => {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('part', { ascending: true })
          .order('id', { ascending: true });
        
        if (error) throw error;
        return (data || []).map(q => ({
          ...q,
          correctAnswer: q.correct_answer || q.correctAnswer
        }));
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ GET /api/questions failed:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch questions" }, { status: 500 });
  }
}

// POST /api/questions - Add, Update, or Sync questions
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a batch sync request (an array of questions)
    if (Array.isArray(body)) {
      const result = await executeQuery({
        d1Query: async (db) => {
          const stmts = [];
          
          // Clear existing questions for sync, ensuring clean synchronization
          stmts.push(db.prepare("DELETE FROM questions"));

          for (const q of body) {
            const questionId = q.id ? String(q.id) : crypto.randomUUID();
            const optionsStr = typeof q.options === 'string' ? q.options : JSON.stringify(q.options || []);
            const stmt = db.prepare(`
              INSERT INTO questions (id, question, options, correct_answer, part, level)
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
              questionId,
              q.question || '',
              optionsStr,
              q.correct_answer || q.correctAnswer || '',
              q.part || 1,
              q.level || 'A1'
            );
            stmts.push(stmt);
          }

          await db.batch(stmts);
          return { success: true, count: body.length };
        },
        supabaseFallback: async () => {
          // Sync with Supabase (clear existing first and insert)
          // We can delete existing first
          await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          
          const formatted = body.map(q => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer || q.correctAnswer,
            part: q.part,
            level: q.level
          }));

          const { error } = await supabase.from('questions').insert(formatted);
          if (error) throw error;

          return { success: true, count: body.length };
        }
      });

      return NextResponse.json(result);
    }

    // Individual Add or Update
    const { id, question, options, correct_answer, correctAnswer, part, level } = body;
    const ans = correct_answer || correctAnswer;

    const result = await executeQuery({
      d1Query: async (db) => {
        const optionsStr = typeof options === 'string' ? options : JSON.stringify(options || []);
        
        if (id) {
          // UPDATE
          await db.prepare(`
            UPDATE questions
            SET question = ?, options = ?, correct_answer = ?, part = ?, level = ?
            WHERE id = ?
          `).bind(question, optionsStr, ans, part, level, String(id)).run();

          const updated = await db.prepare("SELECT * FROM questions WHERE id = ?").bind(String(id)).first();
          return formatSQLiteQuestion(updated);
        } else {
          // INSERT
          const questionId = crypto.randomUUID();
          await db.prepare(`
            INSERT INTO questions (id, question, options, correct_answer, part, level)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(questionId, question, optionsStr, ans, part, level).run();

          const inserted = await db.prepare("SELECT * FROM questions WHERE id = ?").bind(questionId).first();
          return formatSQLiteQuestion(inserted);
        }
      },
      supabaseFallback: async () => {
        if (id) {
          const { data, error } = await supabase
            .from('questions')
            .update({
              question,
              options,
              correct_answer: ans,
              part,
              level
            })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          return data;
        } else {
          const { data, error } = await supabase
            .from('questions')
            .insert([{
              question,
              options,
              correct_answer: ans,
              part,
              level
            }])
            .select()
            .single();

          if (error) throw error;
          return data;
        }
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ POST /api/questions failed:", err);
    return NextResponse.json({ error: err.message || "Failed to save question" }, { status: 500 });
  }
}

// DELETE /api/questions - Delete a question by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 });
    }

    const result = await executeQuery({
      d1Query: async (db) => {
        await db.prepare("DELETE FROM questions WHERE id = ?").bind(String(id)).run();
        return { success: true };
      },
      supabaseFallback: async () => {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return { success: true };
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ DELETE /api/questions failed:", err);
    return NextResponse.json({ error: err.message || "Failed to delete question" }, { status: 500 });
  }
}
