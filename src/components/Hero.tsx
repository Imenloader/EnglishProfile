'use client';

import { useEffect, useState } from 'react';
import { db, SiteSettings } from '@/data/db';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const { language, t, isRtl } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>({
    heroHeadlineEn: 'Language learning, reimagined',
    heroHeadlineAr: 'تعلم اللغة، برؤية جديدة',
    heroSubheadlineEn: "Every Egyptian deserves access to world-class English education. We blend ground-breaking pedagogy with genuine care for our students' futures.",
    heroSubheadlineAr: "يستحق كل مصري الحصول على تعليم لغة إنجليزية عالمي المستوى. نحن نمزج بين أساليب التدريس المبتكرة والرعاية الحقيقية لمستقبل طلابنا.",
  });

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
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

  const headline = language === 'en' ? 'Where success becomes a habit' : 'حيث يصبح النجاح عادة';
  const subheadline = language === 'en' 
    ? 'Empowering language learners in Egypt with ground-breaking teaching methods that unlock your full potential.' 
    : 'تمكين متعلمي اللغة في مصر بطرق تدريس مبتكرة تطلق العنان لإمكاناتك الكاملة.';

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: 'var(--bg-color)',
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
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <Image 
          src="/images/hero.webp" 
          alt="Linguaplanet Hero Background" 
          fill 
          priority 
          quality={85}
          style={{ objectFit: 'cover', opacity: 0.6 }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(to ${isRtl ? 'left' : 'right'}, var(--bg-color) 40%, transparent 100%)`,
          zIndex: 2
        }}></div>
      </div>

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
              fontSize: 'clamp(3rem, 8vw, 6rem)', 
              color: 'var(--text-color)',
              lineHeight: 1,
              marginBottom: '2.5rem',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700
            }}>
              {headline}
            </h1>
            <p style={{ 
              color: 'var(--text-color)', 
              fontSize: '1.25rem', 
              maxWidth: '650px', 
              marginBottom: '4rem',
              lineHeight: 1.6,
              fontWeight: 400,
              opacity: 0.8
            }}>
              {subheadline}
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <Link href="/placement-test" className="btn-master btn-gold-solid" style={{ padding: '1.4rem 3.5rem' }}>
                <span style={{ position: 'relative', zIndex: 2 }}>{t('startAssessment').toUpperCase()}</span>
                <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '1.2rem', transform: isRtl ? 'rotate(180deg)' : 'none', [isRtl ? 'marginRight' : 'marginLeft']: '1rem', position: 'relative', zIndex: 2 }}></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Side Label */}
      <div className="hidden-mobile" style={{
        position: 'absolute',
        right: '4rem',
        bottom: '4rem',
        writingMode: 'vertical-rl',
        color: 'var(--text-color)',
        opacity: 0.2,
        fontSize: '0.7rem',
        letterSpacing: '5px',
        textTransform: 'uppercase',
        zIndex: 10
      }}>
        ESTABLISHED MMXV • LINGUAPLANET
      </div>
    </section>
  );
}
