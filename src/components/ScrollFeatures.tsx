'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: `${scrollProgress}%`,
      height: '4px',
      background: 'var(--accent-gold)',
      zIndex: 2000,
      transition: 'width 0.2s ease-out'
    }}></div>
  );
}

export function BackToTopButton() {
  const { isRtl } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: '130px',
        right: isRtl ? 'auto' : '40px',
        left: isRtl ? '40px' : 'auto',
        width: '50px',
        height: '50px',
        background: 'var(--primary-navy)',
        color: 'var(--accent-gold)',
        border: '1px solid var(--accent-gold)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        cursor: 'pointer',
        zIndex: 9998,
        opacity: showScrollTop ? 1 : 0,
        visibility: showScrollTop ? 'visible' : 'hidden',
        transform: showScrollTop ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--accent-gold)';
        e.currentTarget.style.color = 'var(--primary-navy)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--primary-navy)';
        e.currentTarget.style.color = 'var(--accent-gold)';
      }}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}
