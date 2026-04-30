'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function TermsPage() {
  const { isRtl, t } = useLanguage();

  return (
    <main className="marble-pattern" style={{ background: 'var(--primary-navy)', minHeight: '100vh', direction: isRtl ? 'rtl' : 'ltr' }}>
      <Navbar isDarkPage={true} />
      
      <section style={{ padding: '12rem 0 8rem' }}>
        <div className="container">
          <div className="glass-dark" style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            padding: '6rem', 
            borderRadius: '40px',
            color: 'white'
          }} data-aos="fade-up">
            
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase' }}>{t('quickLinks')}</span>
            <h1 style={{ fontSize: '3.5rem', marginTop: '1.5rem', marginBottom: '4rem', fontFamily: 'var(--font-serif)' }}>{t('termsOfService')}</h1>
            
            <div className="policy-content" style={{ opacity: 0.8, lineHeight: 1.8, fontSize: '1.1rem' }}>
              <p style={{ marginBottom: '3rem', fontSize: '1.2rem', color: 'var(--accent-gold)' }}>
                {t('aboutText2')}
              </p>

              <h3 style={{ color: 'white', marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>1. {t('flexibilityTitle')}</h3>
              <p>
                {t('flexibilityDesc')}
              </p>

              <h3 style={{ color: 'white', marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>2. {t('pricingTitle')}</h3>
              <p>
                {t('pricingDesc')}
              </p>

              <div style={{ marginTop: '5rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.9rem' }}>
                  {t('guaranteesDesc')}
                </p>
              </div>

              <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px' }}>
                  {isRtl ? '← ' + t('returnHome') : '← ' + t('returnHome')}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.3, color: 'white', fontSize: '0.7rem' }}>
        © 2026 LINGUAPLANET ACADEMY. {t('allRights').toUpperCase()}
      </footer>
    </main>
  );
}
