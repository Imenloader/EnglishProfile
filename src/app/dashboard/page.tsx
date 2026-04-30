'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Lead } from '@/data/db';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        fetchResults(user.id);
      }
    };
    checkUser();
  }, []);

  const fetchResults = async (userId: string) => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error) {
      setLeads(data.map((l: any) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        score: l.score,
        totalQuestions: l.total_questions,
        level: l.level,
        date: l.created_at.split('T')[0]
      })));
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh' }}>LOADING...</div>;

  return (
    <main className="marble-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user?.user_metadata?.full_name || 'Student'}</h1>
            <p style={{ opacity: 0.6, letterSpacing: '1px' }}>YOUR PROFESSIONAL ASSESSMENT HISTORY</p>
          </div>
          <button onClick={handleSignOut} className="btn btn-outline" style={{ fontSize: '0.7rem' }}>SIGN OUT</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {leads.length === 0 ? (
            <div className="glass" style={{ padding: '4rem', gridColumn: '1 / -1', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem' }}>No tests taken yet.</h3>
              <p style={{ marginBottom: '2.5rem', opacity: 0.7 }}>Ready to discover your proficiency level?</p>
              <a href="/placement-test" className="btn btn-primary">START YOUR FIRST TEST</a>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="glass animate-reveal" style={{ 
                padding: '2.5rem', 
                borderTop: '3px solid var(--accent-gold)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 600 }}>{lead.date}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{lead.level}</span>
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>Placement Assessment</h3>
                <p style={{ opacity: 0.7, marginBottom: '2rem', fontSize: '0.9rem' }}>Score: {lead.score} / {lead.totalQuestions}</p>
                <div style={{ height: '4px', background: 'var(--gray-light)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(lead.score / lead.totalQuestions) * 100}%`, 
                    height: '100%', 
                    background: 'var(--accent-gold)' 
                  }}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
