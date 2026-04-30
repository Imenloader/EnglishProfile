'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Login() {
  const { t, isRtl, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="marble-pattern" style={{ 
      minHeight: '100vh', 
      direction: isRtl ? 'rtl' : 'ltr',
      background: 'var(--primary-navy)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Navbar isDarkPage={true} />
      
      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, transparent 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>
      
      <div className="container flex-center" style={{ position: 'relative', zIndex: 10, paddingTop: '10rem', paddingBottom: '5rem' }}>
        <div className="glass animate-reveal" style={{ 
          width: '100%', 
          maxWidth: '480px', 
          padding: '4rem',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
          borderRadius: '0'
        }}>
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '5px', display: 'block', marginBottom: '1.5rem' }}>
              {t('signIn').toUpperCase()}
            </span>
            <h1 style={{ 
              fontSize: '3rem', 
              color: 'white', 
              marginBottom: '1rem',
              fontFamily: 'var(--font-serif)'
            }}>
              {t('welcomeBack')}
            </h1>
            <p style={{ color: 'white', opacity: 0.5, fontSize: '0.9rem', letterSpacing: '1px' }}>{t('enterCredentials')}</p>
          </div>

          {error && (
            <div style={{ 
              padding: '1.2rem', 
              backgroundColor: 'rgba(216, 37, 72, 0.1)', 
              color: '#ff4d4d', 
              borderRadius: '0', 
              marginBottom: '2rem',
              fontSize: '0.85rem',
              borderLeft: isRtl ? 'none' : '2px solid var(--accent-red)',
              borderRight: isRtl ? '2px solid var(--accent-red)' : 'none'
            }}>
              <i className="fa-solid fa-circle-exclamation" style={{ [isRtl ? 'marginLeft' : 'marginRight']: '0.8rem' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '2px' }}>
                {t('emailAddress').toUpperCase()}
              </label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1.2rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.border = '1px solid var(--accent-gold)'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                placeholder="email@example.com"
              />
            </div>
            <div style={{ marginBottom: '3rem' }}>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '2px' }}>
                {t('password').toUpperCase()}
              </label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1.2rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.border = '1px solid var(--accent-gold)'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              className="btn-master btn-gold" 
              style={{ width: '100%', marginBottom: '2.5rem', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? t('authenticating') : t('signIn').toUpperCase()}
            </button>
          </form>

          <div className="text-center" style={{ fontSize: '0.9rem', color: 'white' }}>
            <p style={{ opacity: 0.5, marginBottom: '0.5rem' }}>{t('dontHaveAccount')}</p>
            <Link href="/signup" style={{ 
              color: 'var(--accent-gold)', 
              fontWeight: 700, 
              textDecoration: 'none',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontSize: '0.8rem'
            }}>
              {t('createProfile')} <i className={`fa-solid fa-arrow-${isRtl ? 'left' : 'right'}`} style={{ [isRtl ? 'marginRight' : 'marginLeft']: '0.5rem' }}></i>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
