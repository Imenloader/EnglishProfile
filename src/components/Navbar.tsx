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
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 50;
        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
      });
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + L shortcut for Admin
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    handleScroll(); // Initial check

    // Theme Check (SSR Safe)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      setTheme(savedTheme);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const handleSignOut = async () => {
    setIsOpen(false);
  };

  // Theme-aware Nav Logic
  const navBg = scrolled 
    ? (theme === 'dark' ? 'rgba(1, 33, 105, 0.95)' : 'rgba(255, 255, 255, 0.98)') 
    : (isOpen ? 'var(--primary-navy)' : (theme === 'dark' || (isDarkPage && !scrolled) ? 'transparent' : 'rgba(255, 255, 255, 0.95)'));
  
  const effectiveTextColor = (theme === 'dark' || (isDarkPage && !scrolled && !isOpen)) 
    ? 'white' 
    : 'var(--primary-navy)';

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
        {/* Official Brand Identity */}
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(0.5rem, 2vw, 1.2rem)', 
          textDecoration: 'none',
          position: 'relative',
          zIndex: 10
        }}>
          <div className="nav-logo" style={{ 
            width: scrolled ? '44px' : '52px', 
            height: scrolled ? '44px' : '52px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.1)' : 'none',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img 
              src="/images/logo/logo-icon.jpg" 
              alt="Linguaplanet Logo" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                mixBlendMode: 'multiply'
              }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ 
              height: scrolled ? '18px' : '24px', 
              transition: 'all 0.5s ease',
              display: 'flex',
              alignItems: 'center'
            }}>
              <img 
                src="/images/logo/logo-text.jpg" 
                alt="Linguaplanet" 
                style={{ 
                  height: '100%', 
                  filter: (theme === 'dark' || (isDarkPage && !scrolled)) ? 'invert(1)' : 'none',
                  mixBlendMode: (theme === 'dark' || (isDarkPage && !scrolled)) ? 'screen' : 'multiply',
                  transition: 'all 0.5s ease',
                  opacity: (theme === 'dark' || (isDarkPage && !scrolled)) ? 0.9 : 1
                }} 
              />
            </div>
            <span style={{ 
              fontSize: '0.6rem', 
              color: effectiveTextColor, 
              opacity: 0.8, 
              letterSpacing: '2px',
              fontWeight: 800,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              transition: 'all 0.5s ease'
            }}>{language === 'ar' ? 'حيث يصبح النجاح عادة' : 'Where Success Becomes A Habit'}</span>
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
              { name: t('placementTest'), href: '/placement-test' }
            ];

            return navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                style={{
                  textDecoration: 'none',
                  color: effectiveTextColor,
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
                background: (theme === 'dark' || (isDarkPage && !scrolled)) ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
                border: (theme === 'dark' || (isDarkPage && !scrolled)) ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
                color: effectiveTextColor,
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
                background: (theme === 'dark' || (isDarkPage && !scrolled)) ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: (theme === 'dark' || (isDarkPage && !scrolled)) ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
                color: effectiveTextColor,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} style={{ fontSize: '1rem' }}></i>
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
            color: effectiveTextColor,
            fontSize: '1.8rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
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
            background: (theme === 'dark' || isDarkPage) ? 'var(--primary-navy)' : 'white',
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
                  color: (theme === 'dark' || isDarkPage) ? 'white' : 'var(--primary-navy)',
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

            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'ar' : 'en');
                  setIsOpen(false);
                }}
                style={{
                  marginTop: '0.5rem',
                  padding: '1.2rem 2rem',
                  background: (theme === 'dark' || isDarkPage) ? 'var(--accent-gold)' : 'var(--primary-navy)',
                  color: (theme === 'dark' || isDarkPage) ? 'var(--primary-navy)' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  letterSpacing: '2px',
                  flex: 1
                }}
              >
                {language === 'en' ? t('arabicInterface') : t('englishInterface')}
              </button>
              
              <button
                onClick={toggleTheme}
                style={{
                  marginTop: '0.5rem',
                  padding: '1.2rem',
                  background: (theme === 'dark' || isDarkPage) ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: (theme === 'dark' || isDarkPage) ? 'white' : 'var(--primary-navy)',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} style={{ fontSize: '1.2rem' }}></i>
              </button>
            </div>

            {/* Social Links to fill space */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '1rem 0' }}>
              <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.5rem', opacity: 0.5 }}></i>
              <i className="fa-brands fa-instagram" style={{ fontSize: '1.5rem', opacity: 0.5 }}></i>
              <i className="fa-brands fa-facebook" style={{ fontSize: '1.5rem', opacity: 0.5 }}></i>
            </div>

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
        .nav-link-premium:hover {
          color: var(--accent-gold) !important;
          opacity: 1 !important;
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
          width: 25px;
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
