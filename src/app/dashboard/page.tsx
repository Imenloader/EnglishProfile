'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Lead } from '@/data/db';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function Dashboard() {
  const { t, isRtl } = useLanguage();
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

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--primary-navy)', color: 'white' }}>{t('loading')}</div>;

  return (
    <main className="marble-pattern" style={{ minHeight: '100vh', direction: isRtl ? 'rtl' : 'ltr', background: 'var(--marble-white)', color: 'var(--primary-navy)' }}>
      <Navbar />
      
      {/* Decorative Background Element */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '400px',
        background: 'var(--navy-gradient)',
        zIndex: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)'
      }}></div>

      <div className="container" style={{ paddingTop: '10rem', paddingBottom: '8rem', position: 'relative', zIndex: 1 }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '5rem', 
          flexDirection: isRtl ? 'row-reverse' : 'row',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '2.5rem'
        }}>
          <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
              {t('studentPortal').toUpperCase()}
            </span>
            <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
              {t('welcomeStudent').replace('{name}', user?.user_metadata?.full_name || t('student'))}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              <i className="fa-solid fa-graduation-cap" style={{ [isRtl ? 'marginLeft' : 'marginRight']: '1rem' }}></i>
              {t('historyTitle')}
            </p>
          </div>
          <button 
            onClick={handleSignOut} 
            className="btn-master btn-white" 
            style={{ 
              padding: '0.8rem 2rem', 
              fontSize: '0.7rem', 
              background: 'transparent', 
              border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white' 
            }}
          >
            {t('signOut').toUpperCase()}
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {leads.length === 0 ? (
            <div className="glass" style={{ 
              padding: '6rem 3rem', 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              background: 'white',
              boxShadow: '0 40px 100px rgba(0,0,0,0.05)',
              borderRadius: '24px'
            }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--soft-gray)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <i className="fa-solid fa-clipboard-list" style={{ fontSize: '2rem', color: 'var(--accent-gold)' }}></i>
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('noTests')}</h3>
              <p style={{ marginBottom: '3rem', opacity: 0.6, maxWidth: '500px', margin: '0 auto 3rem' }}>{t('readyDiscover')}</p>
              <Link href="/placement-test" className="btn-master btn-gold" style={{ display: 'inline-flex' }}>
                {t('startFirstTest')}
              </Link>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="card-premium reveal" style={{ 
                padding: '3rem',
                borderRadius: '4px',
                background: 'white',
                boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
                      {lead.date}
                    </span>
                    <h3 style={{ fontSize: '1.5rem', textAlign: isRtl ? 'right' : 'left' }}>{t('placementTest')}</h3>
                  </div>
                  <div style={{ 
                    padding: '0.8rem 1.5rem', 
                    background: 'var(--primary-navy)', 
                    borderRadius: '50px', 
                    fontSize: '0.9rem', 
                    fontWeight: 800, 
                    color: 'white',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    {lead.level}
                  </div>
                </div>
                
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ opacity: 0.5 }}>{isRtl ? 'دقة الإجابة' : 'Accuracy Score'}</span>
                    <span>{Math.round((lead.score / lead.totalQuestions) * 100)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(lead.score / lead.totalQuestions) * 100}%`, 
                      height: '100%', 
                      background: 'var(--gold-gradient)',
                      borderRadius: '10px'
                    }}></div>
                  </div>
                </div>

                <Link href="/placement-test" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  textDecoration: 'none', 
                  color: 'var(--primary-navy)', 
                  fontSize: '0.8rem', 
                  fontWeight: 800, 
                  letterSpacing: '1px' 
                }}>
                  {isRtl ? 'إعادة الاختبار' : 'RETAKE ASSESSMENT'}
                  <i className={`fa-solid ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'}`} style={{ color: 'var(--accent-gold)' }}></i>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
