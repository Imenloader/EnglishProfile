import { supabase } from './supabase';
import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Resilient Cloudflare D1 Database Binder
 * Dynamically resolves the D1 database binding 'DB' from process.env or global environment
 */
export const getD1Database = (): any => {
  if (typeof process !== 'undefined' && (process.env as any).DB) {
    return (process.env as any).DB;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).env?.DB) {
    return (globalThis as any).env.DB;
  }
  // next-on-pages context check
  try {
    const ctx = getRequestContext();
    if (ctx?.env?.DB) return ctx.env.DB;
  } catch (e) {}
  return null;
};

/**
 * Executes a resilient query that executes on Cloudflare D1 if available,
 * and falls back to Supabase client if not.
 */
export const executeQuery = async <T = any>({
  d1Query,
  supabaseFallback
}: {
  d1Query: (db: any) => Promise<T>;
  supabaseFallback: () => Promise<T>;
}): Promise<T> => {
  const db = getD1Database();
  if (db) {
    try {
      return await d1Query(db);
    } catch (err) {
      console.warn("⚠️ Cloudflare D1 execution failed, falling back to Supabase:", err);
    }
  }
  return await supabaseFallback();
};
