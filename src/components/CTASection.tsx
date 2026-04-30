'use client';

import { useEffect, useState } from 'react';
import { db, SiteSettings } from '@/data/db';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function CTASection() {
  // Provide immediate default state to prevent loading flicker
  const [settings, setSettings] = useState<SiteSettings>({
    id: '1',
    heroHeadlineEn: '',
    heroHeadlineAr: '',
    heroSubheadlineEn: '',
    heroSubheadlineAr: '',
    whatsappNumber: "+201270068237",
    contactEmail: "hello@linguaplanet.eg",
    updatedAt: new Date()
  });
  const { t, isRtl } = useLanguage();

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await db.getSettings();
      if (s) setSettings(s);
    };
    fetchSettings();
  }, []);

  return (
    <section id="contact" className="section-padding" style={{ position: 'relative', overflow: 'hidden', direction: isRtl ? 'rtl' : 'ltr', background: 'white' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem',
          alignItems: 'stretch' 
        }}>
          
          {/* Card 1: The Assessment */}
          <div className="card-premium" data-aos="fade-up" style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '4px', fontWeight: 800, color: 'var(--accent-gold)', display: 'block', marginBottom: '1.5rem' }}>01 / {t('placementTest').toUpperCase()}</span>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>{t('placementTest')}</h3>
            <p style={{ opacity: 0.6, marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px' }}>{t('testDesc')}</p>
            <div style={{ flex: 1 }}></div>
            <Link href="/placement-test" className="btn-master btn-gold" style={{ padding: '1rem 2rem', fontSize: '0.75rem' }}>
              {t('startTest').toUpperCase()}
            </Link>
          </div>

          {/* Card 2: Direct Dialogue */}
          <div className="card-premium" data-aos="fade-up" data-aos-delay="200" style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '4px', fontWeight: 800, color: 'var(--accent-gold)', display: 'block', marginBottom: '1.5rem' }}>02 / {t('whatsappChat').toUpperCase()}</span>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>{t('whatsappChat')}</h3>
            <p style={{ opacity: 0.6, marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px' }}>{t('whatsappDesc')}</p>
            <div style={{ flex: 1 }}></div>
            <a href={`https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(t('whatsappMessage'))}`} className="btn-master btn-gold" style={{ padding: '1rem 2rem', fontSize: '0.75rem' }}>
              {t('chatWhatsapp').toUpperCase()}
            </a>
          </div>

          {/* Card 3: Formal Inquiries */}
          <div className="card-premium" data-aos="fade-up" data-aos-delay="400" style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '4px', fontWeight: 800, color: 'var(--accent-gold)', display: 'block', marginBottom: '1.5rem' }}>03 / {t('contact').toUpperCase()}</span>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>{t('emailInquiries')}</h3>
            <p style={{ opacity: 0.6, marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px' }}>{t('emailDesc')}</p>
            <div style={{ flex: 1 }}></div>
            <Link href="/about#contact" className="btn-master btn-gold" style={{ padding: '1rem 2rem', fontSize: '0.75rem' }}>
              {t('sendEmail').toUpperCase()}
            </Link>
          </div>

        </div>
      </div>

      {/* Background Decorative Text */}
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '15vw',
        fontWeight: 900,
        color: 'rgba(10, 17, 40, 0.015)',
        whiteSpace: 'nowrap',
        zIndex: 1,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        {t('excellence').toUpperCase()}
      </div>
    </section>
  );
}
