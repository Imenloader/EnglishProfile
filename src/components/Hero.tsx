'use client';

import { useEffect, useState } from 'react';
import { db, SiteSettings } from '@/data/db';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function Hero() {
  const { language, t, isRtl } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>({
    heroHeadlineEn: 'Experience Educational Magnificence',
    heroHeadlineAr: 'اختبر الروعة التعليمية',
    heroSubheadlineEn: "Elevate your professional profile with Linguaplanet's world-class English training.",
    heroSubheadlineAr: "ارتقِ بملفك المهني من خلال تدريب لنجوابلانيت المتميز في اللغة الإنجليزية.",
  });

  useEffect(() => {
    setMounted(true);
    const fetchSettings = async () => {
      const s = await db.getSettings();
      if (s) setSettings(s);
    };
    fetchSettings();
  }, []);

  // Prevent hydration mismatch by returning a stable skeleton/base if not mounted
  if (!mounted) {
    return <section style={{ minHeight: '100vh', backgroundColor: 'var(--primary-navy)' }}></section>;
  }

  const headline = language === 'en' ? settings.heroHeadlineEn : settings.heroHeadlineAr;
  const subheadline = language === 'en' ? settings.heroSubheadlineEn : settings.heroSubheadlineAr;

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: 'var(--primary-navy)',
      overflow: 'hidden',
      direction: isRtl ? 'rtl' : 'ltr'
    }}>
      {/* Cinematic Background Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `linear-gradient(to right, var(--primary-navy) 40%, transparent 100%), url("/images/hero.webp")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.6,
        zIndex: 1
      }}></div>

      {/* Decorative Light Orbs */}
      <div className="float" style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.1) 0%, transparent 70%)',
        top: '-10%',
        right: '-5%',
        zIndex: 2
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '800px' }}>
          <div data-aos="fade-right" data-aos-delay="200">
            <span style={{ 
              color: 'var(--accent-gold)', 
              letterSpacing: '5px', 
              fontSize: '0.8rem', 
              fontWeight: 600, 
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '2rem'
            }}>
              {t('worldClassAcademy')}
            </span>
            <h1 style={{ 
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', 
              color: 'white',
              lineHeight: 0.95,
              marginBottom: '2.5rem',
              fontFamily: 'var(--font-serif)'
            }}>
              {headline}
            </h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '1.25rem', 
              maxWidth: '600px', 
              marginBottom: '4rem',
              lineHeight: 1.8,
              fontWeight: 300
            }}>
              {subheadline}
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <Link href="/placement-test" className="btn-master btn-gold">
                {t('startAssessment')}
                <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '1.2rem', transform: isRtl ? 'rotate(180deg)' : 'none', [isRtl ? 'marginRight' : 'marginLeft']: '1rem' }}></i>
              </Link>
              <a href="/about" className="btn-master btn-white" style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white' }}>
                {t('learnMore')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Side Label */}
      <div style={{
        position: 'absolute',
        right: '4rem',
        bottom: '4rem',
        writingMode: 'vertical-rl',
        color: 'rgba(255,255,255,0.2)',
        fontSize: '0.7rem',
        letterSpacing: '5px',
        textTransform: 'uppercase',
        zIndex: 10
      }}>
        ESTABLISHED MMXXIV • LINGUAPLANET
      </div>
    </section>
  );
}
