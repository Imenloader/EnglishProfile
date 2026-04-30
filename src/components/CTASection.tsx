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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          {/* Card 1: The Assessment */}
          <div className="card-premium" data-aos="fade-up" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '4px', fontWeight: 800, color: 'var(--accent-gold)', display: 'block', marginBottom: '1.5rem' }}>01 / EVALUATION</span>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>The Placement <br/><span className="gold-text">Test</span></h3>
            <p style={{ opacity: 0.6, marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px', margin: '0 auto 2.5rem' }}>{t('testDesc')}</p>
            <Link href="/placement-test" className="btn-master btn-gold" style={{ padding: '1rem 2rem', fontSize: '0.75rem', margin: '0 auto' }}>
              {t('startTest')}
            </Link>
          </div>

          {/* Card 2: Direct Dialogue */}
          <div className="card-premium" data-aos="fade-up" data-aos-delay="200" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '4px', fontWeight: 800, color: 'var(--accent-gold)', display: 'block', marginBottom: '1.5rem' }}>02 / DIALOGUE</span>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>Direct <br/><span className="gold-text">Consultation</span></h3>
            <p style={{ opacity: 0.6, marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px', margin: '0 auto 2.5rem' }}>{t('whatsappDesc')}</p>
            <a href={`https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}?text=Hello, I'm interested in your English and Soft Skills courses.`} className="btn-master btn-gold" style={{ padding: '1rem 2rem', fontSize: '0.75rem', margin: '0 auto' }}>
              {t('chatWhatsapp')}
            </a>
          </div>

          {/* Card 3: Formal Inquiries */}
          <div className="card-premium" data-aos="fade-up" data-aos-delay="400" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '4px', fontWeight: 800, color: 'var(--accent-gold)', display: 'block', marginBottom: '1.5rem' }}>03 / INQUIRY</span>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>Formal <br/><span className="gold-text">Request</span></h3>
            <p style={{ opacity: 0.6, marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px', margin: '0 auto 2.5rem' }}>{t('emailDesc')}</p>
            <a href={`mailto:${settings.contactEmail}?subject=Course Inquiry`} className="btn-master btn-gold" style={{ padding: '1rem 2rem', fontSize: '0.75rem', margin: '0 auto' }}>
              {t('sendEmail')}
            </a>
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
        EXCELLENCE
      </div>
    </section>
  );
}
