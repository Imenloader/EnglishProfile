'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { db } from '@/data/db';

export default function Footer() {
  const { t, isRtl, language } = useLanguage();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await db.getSettings();
      setSettings(s);
    };
    fetchSettings();
  }, []);

  return (
    <footer style={{ padding: '8rem 0 4rem', background: 'var(--primary-navy)', color: 'white', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '5rem', paddingBottom: '6rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          
          {/* Column 1: Brand & Identity */}
          <div style={{ gridColumn: 'span 1.5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'white', 
                borderRadius: '15px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '5px'
              }}>
                <img 
                  src="/images/logo/logo-icon.jpg" 
                  alt="Linguaplanet" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <img 
                  src="/images/logo/logo-text.jpg" 
                  alt="Linguaplanet" 
                  style={{ height: '30px', filter: 'brightness(0) invert(1)' }} 
                />
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: 'white', 
                  opacity: 0.6, 
                  letterSpacing: '1px', 
                  marginTop: '5px',
                  fontWeight: 500,
                  textTransform: 'uppercase'
                }}>{language === 'ar' ? 'حيث يصبح النجاح عادة' : 'Where Success Becomes A Habit'}</span>
              </div>
            </div>
            <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '0.95rem', maxWidth: '300px' }}>
              {t('footerDesc') || 'Empowering language learners with world-class education and professional skills.'}
            </p>
          </div>

          {/* Column 2: Academic Programs */}
          <div>
            <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>{t('academicTracks')}</h5>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem' }}>
              <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('generalEnglish')}</Link></li>
              <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('businessCommunication')}</Link></li>
              <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('softSkillsMastery')}</Link></li>
              <li><Link href="/placement-test" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('placementAssessment')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Corporate Identity */}
          <div>
            <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>{t('corporate')}</h5>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem' }}>
              <li><Link href="/about" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('aboutAcademy')}</Link></li>
              <li><Link href="/#team" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('leadershipTeam')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Connectivity */}
          <div>
            <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>{t('connectivity')}</h5>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem', opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>
              <li>{settings?.contactEmail || 'hello@linguaplanet.eg'}</li>
              <li>+20 127 006 8237</li>
              <li>{t('cairoEgypt')}</li>
            </ul>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href={settings?.facebookLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.4 }}><i className="fa-brands fa-facebook-f" style={{ fontSize: '1.1rem' }}></i></a>
              <a href={settings?.instagramLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.4 }}><i className="fa-brands fa-instagram" style={{ fontSize: '1.1rem' }}></i></a>
              <a href={settings?.linkedinLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.4 }}><i className="fa-brands fa-linkedin-in" style={{ fontSize: '1.1rem' }}></i></a>
              <a href={settings?.tiktokLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.4 }}><i className="fa-brands fa-tiktok" style={{ fontSize: '1.1rem' }}></i></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.2, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <p>© 2026 LINGUAPLANET ACADEMY. {t('allRights').toUpperCase()}</p>
          <div style={{ display: 'flex', gap: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>{t('privacyPolicy').toUpperCase()}</Link>
            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>{t('termsOfService').toUpperCase()}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
