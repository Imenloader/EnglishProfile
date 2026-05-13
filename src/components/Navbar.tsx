'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavbarProps {
  isDarkPage?: boolean;
}

export default function Navbar({ isDarkPage = false }: NavbarProps) {
  const { language, setLanguage, toggleLanguage, t, isRtl } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 50;
        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Theme Check (SSR Safe)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSignOut = async () => {
    setIsOpen(false);
  };

  // Theme Logic
  const isDarkTheme = isDarkPage || (isOpen && !scrolled);
  const navBg = scrolled 
    ? (isDarkPage ? 'rgba(1, 33, 105, 0.8)' : 'rgba(255, 255, 255, 0.98)') 
    : (isOpen ? 'var(--primary-navy)' : 'transparent');
  
  const textColor = (scrolled && !isDarkPage) || (isOpen && !isDarkPage) 
    ? 'var(--primary-navy)' 
    : 'white';

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      padding: scrolled ? '0.8rem 0' : '1.8rem 0',
      transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      background: navBg,
      backdropFilter: (scrolled || isOpen) ? 'blur(30px)' : 'none',
      borderBottom: scrolled ? (isDarkPage ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)') : '1px solid rgba(255,255,255,0.03)',
      boxShadow: scrolled ? '0 20px 60px rgba(0,0,0,0.08)' : 'none'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: isRtl ? 'row-reverse' : 'row'
      }}>
        {/* Brand Identity */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1.2rem)', textDecoration: 'none' }}>
          <div className="nav-logo" style={{ 
            width: scrolled ? 'clamp(32px, 5vw, 44px)' : 'clamp(40px, 6vw, 52px)', 
            height: scrolled ? 'clamp(32px, 5vw, 44px)' : 'clamp(40px, 6vw, 52px)', 
            background: 'white', 
            borderRadius: '10px', 
            padding: '6px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.5s ease',
            boxShadow: scrolled ? '0 5px 15px rgba(0,0,0,0.05)' : 'none'
          }}>
            <svg viewBox="0 0 2272.86 1775.34">
              <path fill="#012169" d="M1782.58,1279.59c-201.86,148.03-411.38,220.51-628.43,217.17v-212.36c-17.78,12.22-35.43,24.32-53.09,36.05v173.71c-66.67-10-128.65-27.9-185.69-53.83-97.17,60.13-190.14,113.34-276.56,158.65,131,93.46,282.49,140.01,454.72,140.01,144.7,0,281.87-40.37,411.38-121.12,117.78-77.41,216.19-183.47,295.45-318.04l-17.78-20.25ZM735.97,1319.84c-23.33-22.35-45.43-46.67-66.42-72.97,132.97-112.85,201.99-171.62,207.05-176.68,62.1-68.89,93.22-154.82,93.22-257.42V297.92l131.24-108.65v1021.91c17.66-12.1,35.31-24.45,53.09-36.92v-419.53l408.91,12.47,133.59-232.11-290.14-7.41,197.54-198.9,7.16-7.28,151.12-152.23-9.14-21.48-5.93-13.95c-3.33,0-5.93.86-7.66,2.59h-27.78c-79.14,0-154.82-10.12-227.05-30.37-106.06-28.52-192.73-63.96-260.02-106.06l-494.6,393.85v585.47c0,18.52-.49,35.31-1.36,50.5-.74,15.19-2.1,28.64-3.7,40.37-8.4,45.31-37.9,90.87-88.4,136.3-29.38-43.95-54.2-89.88-74.33-137.91-12.47-29.88-23.21-60.5-31.98-91.98-21.73-76.79-32.59-158.28-32.59-244.58,0-68.89,12.22-135.32,36.42-199.39,52.1-138.03,160.26-264.95,324.59-381.01l-22.59-38.03c-178.41,96.05-309.65,202.98-393.73,320.51-38.52,52.23-69.51,108.15-92.97,167.91-37.41,94.45-56.05,198.28-56.05,311.62,0,89.02,11.36,172.73,34.32,251.13,9.14,31.85,20.37,62.84,33.46,92.97,9.38,21.85,19.75,43.09,31.11,63.95v.12c34.45,63.21,78.15,122.35,130.75,177.29,12.96,13.46,26.3,26.3,39.76,38.52,81.73-42.1,169.52-91.49,261.5-147.42-31.24-20.49-60.62-44.08-88.4-70.37ZM1154.15,219.52c82.97,48.64,171.86,84.82,266.68,107.91,15.93,4.07,31.98,7.53,48.15,10.74,14.32,2.96,29.01,5.31,43.58,7.65l-78.52,79.02-279.89,281.99V219.52Z" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="nav-brand-text" style={{ 
              fontSize: scrolled ? 'clamp(1rem, 2.5vw, 1.3rem)' : 'clamp(1.1rem, 3vw, 1.6rem)', 
              fontWeight: 900, 
              color: textColor,
              letterSpacing: '2px',
              transition: 'all 0.5s ease',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1
            }}>LINGUAPLANET</span>
            <span style={{ 
              fontSize: '0.6rem', 
              color: textColor, 
              opacity: 0.7, 
              letterSpacing: '1px',
              marginTop: '4px',
              fontWeight: 500,
              textTransform: 'uppercase'
            }}>{t('tagline')}</span>
          </div>
        </Link>

        {/* Desktop Interface */}
        <div className="hidden-mobile" style={{
          display: 'flex',
          gap: 'clamp(1.5rem, 4vw, 4rem)',
          alignItems: 'center',
          flexDirection: isRtl ? 'row-reverse' : 'row'
        }}>
          {(() => {
            const navItems = [
              { name: t('about'), href: '/#about' },
              { name: t('programs'), href: '/#services' },
              { name: t('team'), href: '/#team' },
              { name: t('placementTest'), href: '/placement-test' },
              { name: 'ADMIN', href: '/admin' }
            ];

            return navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                style={{
                  textDecoration: 'none',
                  color: textColor,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  transition: 'all 0.4s ease',
                  opacity: scrolled ? 1 : 0.85,
                  position: 'relative',
                  padding: '0.5rem 0'
                }}
                className="nav-link-premium"
              >
                {item.name}
                <span className="nav-indicator"></span>
              </Link>
            ));
          })()}
          {/* Desktop CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', [isRtl ? 'marginRight' : 'marginLeft']: 'auto' }}>
            <button 
              onClick={toggleLanguage}
              style={{ 
                background: scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)', 
                border: scrolled ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.2)',
                color: textColor,
                padding: '0.5rem 0.8rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {language.toUpperCase()}
            </button>

            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: scrolled ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.2)',
                color: textColor,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="fa-solid fa-moon"></i>
            </button>
          </div>
        </div>

        {/* Mobile Command Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-only"
          style={{
            background: 'none',
            border: 'none',
            color: textColor,
            fontSize: '1.8rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
        </button>
      </div>

      {/* Responsive Mobile Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(10, 17, 40, 0.6)',
              backdropFilter: 'blur(10px)',
              zIndex: 19999,
              animation: 'fadeIn 0.4s ease-out'
            }}
          />
          
          {/* Drawer */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: isRtl ? 'auto' : 0,
            left: isRtl ? 0 : 'auto',
            width: '85%',
            maxWidth: '350px',
            height: '100vh',
            background: isDarkPage ? 'var(--primary-navy)' : 'white',
            padding: '6rem 2.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            zIndex: 20000,
            overflowY: 'auto',
            boxShadow: `-20px 0 60px rgba(0,0,0,0.3)`,
            animation: `drawerSlide${isRtl ? 'Left' : 'Right'} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`
          }}>
            {/* Dedicated Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '2rem',
                right: isRtl ? 'auto' : '2rem',
                left: isRtl ? '2rem' : 'auto',
                background: 'none',
                border: 'none',
                color: isDarkPage ? 'white' : 'var(--primary-navy)',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* ⚡ Bolt: Smart Drawer Links */}
            <div style={{ padding: '1rem', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '12px', marginBottom: '1rem' }}>
              <Link href="/admin" onClick={() => setIsOpen(false)} style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem' }}>
                <i className="fa-solid fa-user-shield" style={{ [isRtl ? 'marginLeft' : 'marginRight']: '1rem' }}></i>
                ADMIN PORTAL
              </Link>
            </div>

            {[
              { name: t('about'), href: '/about' },
              { name: t('programs'), href: '/#services' },
              { name: t('team'), href: '/#team' },
              { name: t('placementTest'), href: '/placement-test' }
            ].map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                style={{
                  textDecoration: 'none',
                  color: isDarkPage ? 'white' : 'var(--primary-navy)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  paddingBottom: '1rem'
                }}
              >
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={() => {
                setLanguage(language === 'en' ? 'ar' : 'en');
                setIsOpen(false);
              }}
              style={{
                marginTop: '0.5rem',
                padding: '1.2rem 2rem',
                background: isDarkPage ? 'var(--accent-gold)' : 'var(--primary-navy)',
                color: isDarkPage ? 'var(--primary-navy)' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '2px',
                width: '100%'
              }}
            >
              {language === 'en' ? t('arabicInterface') : t('englishInterface')}
            </button>

            {/* Social Links to fill space */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '1rem 0' }}>
              <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.5rem', opacity: 0.5 }}></i>
              <i className="fa-brands fa-instagram" style={{ fontSize: '1.5rem', opacity: 0.5 }}></i>
              <i className="fa-brands fa-facebook" style={{ fontSize: '1.5rem', opacity: 0.5 }}></i>
            </div>

            <Link href="/placement-test" onClick={() => setIsOpen(false)} className="btn-master btn-gold" style={{ textAlign: 'center', width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
              {t('startFreeTest').toUpperCase()}
            </Link>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerSlideRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes drawerSlideLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .nav-indicator {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--accent-gold);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateX(-50%);
        }
        .nav-link-premium:hover .nav-indicator {
          width: 20px;
        }
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 1025px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
