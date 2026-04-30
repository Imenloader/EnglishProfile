'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      padding: scrolled ? '1rem 0' : '2.2rem 0',
      transition: 'var(--transition-master)',
      background: scrolled ? 'rgba(255, 255, 255, 0.98)' : (isOpen ? 'var(--primary-navy)' : 'transparent'),
      backdropFilter: (scrolled || isOpen) ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : 'none',
      boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.03)' : 'none'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: isRtl ? 'row-reverse' : 'row'
      }}>
        {/* Brand Identity */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', textDecoration: 'none' }}>
          <div style={{ 
            width: scrolled ? '44px' : '52px', 
            height: scrolled ? '44px' : '52px', 
            background: 'white', 
            borderRadius: '12px', 
            padding: '7px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: scrolled ? '0 5px 15px rgba(0,0,0,0.05)' : 'none'
          }}>
            <svg viewBox="0 0 2272.86 1775.34">
              <path fill="#012169" d="M1782.58,1279.59c-201.86,148.03-411.38,220.51-628.43,217.17v-212.36c-17.78,12.22-35.43,24.32-53.09,36.05v173.71c-66.67-10-128.65-27.9-185.69-53.83-97.17,60.13-190.14,113.34-276.56,158.65,131,93.46,282.49,140.01,454.72,140.01,144.7,0,281.87-40.37,411.38-121.12,117.78-77.41,216.19-183.47,295.45-318.04l-17.78-20.25ZM735.97,1319.84c-23.33-22.35-45.43-46.67-66.42-72.97,132.97-112.85,201.99-171.62,207.05-176.68,62.1-68.89,93.22-154.82,93.22-257.42V297.92l131.24-108.65v1021.91c17.66-12.1,35.31-24.45,53.09-36.92v-419.53l408.91,12.47,133.59-232.11-290.14-7.41,197.54-198.9,7.16-7.28,151.12-152.23-9.14-21.48-5.93-13.95c-3.33,0-5.93.86-7.66,2.59h-27.78c-79.14,0-154.82-10.12-227.05-30.37-106.06-28.52-192.73-63.96-260.02-106.06l-494.6,393.85v585.47c0,18.52-.49,35.31-1.36,50.5-.74,15.19-2.1,28.64-3.7,40.37-8.4,45.31-37.9,90.87-88.4,136.3-29.38-43.95-54.2-89.88-74.33-137.91-12.47-29.88-23.21-60.5-31.98-91.98-21.73-76.79-32.59-158.28-32.59-244.58,0-68.89,12.22-135.32,36.42-199.39,52.1-138.03,160.26-264.95,324.59-381.01l-22.59-38.03c-178.41,96.05-309.65,202.98-393.73,320.51-38.52,52.23-69.51,108.15-92.97,167.91-37.41,94.45-56.05,198.28-56.05,311.62,0,89.02,11.36,172.73,34.32,251.13,9.14,31.85,20.37,62.84,33.46,92.97,9.38,21.85,19.75,43.09,31.11,63.95v.12c34.45,63.21,78.15,122.35,130.75,177.29,12.96,13.46,26.3,26.3,39.76,38.52,81.73-42.1,169.52-91.49,261.5-147.42-31.24-20.49-60.62-44.08-88.4-70.37ZM1154.15,219.52c82.97,48.64,171.86,84.82,266.68,107.91,15.93,4.07,31.98,7.53,48.15,10.74,14.32,2.96,29.01,5.31,43.58,7.65l-78.52,79.02-279.89,281.99V219.52Z" />
              <path fill="#0952d3" d="M562.38,1068.58c-73.83,65.31-141.24,128.77-201.12,189.15-90.38,91.12-163.71,175.07-215.94,247.79-57.16,79.26-89.39,145.19-91.73,192.11-18.4-4.82-32.22-13.21-41.36-25.68-7.53-10.25-11.48-22.59-12.1-37.29-4.2-90.87,119.64-263.72,327.67-469.91,60.74-60.25,128.65-123.34,202.61-188.16,8.77,31.48,19.51,62.1,31.98,91.98Z" />
              <circle fill="#d82548" cx="1933.29" cy="644.48" r="175.01" />
            </svg>
          </div>
          <span style={{ 
            fontSize: scrolled ? '1.4rem' : '1.8rem', 
            fontWeight: 900, 
            color: (scrolled || isOpen) ? 'var(--primary-navy)' : 'white',
            letterSpacing: '3px',
            transition: 'all 0.5s ease',
            fontFamily: 'var(--font-serif)'
          }}>LINGUAPLANET</span>
        </Link>

        {/* Desktop Interface */}
        <div className="hidden-mobile" style={{
          display: 'flex',
          gap: '3rem',
          alignItems: 'center',
          flexDirection: isRtl ? 'row-reverse' : 'row'
        }}>
          {[
            { name: t('about'), href: '/about' },
            { name: t('programs'), href: '/#services' },
            { name: t('team'), href: '/#team' },
            { name: t('placementTest'), href: '/placement-test' }
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              style={{
                textDecoration: 'none',
                color: scrolled ? 'var(--primary-navy)' : 'white',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                opacity: scrolled ? 1 : 0.8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-gold)';
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = scrolled ? 'var(--primary-navy)' : 'white';
                e.currentTarget.style.opacity = scrolled ? '1' : '0.8';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {item.name}
            </Link>
          ))}
          
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            style={{
              background: scrolled ? 'var(--primary-navy)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '0.7rem 1.4rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>
        </div>

        {/* Mobile Command Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-only"
          style={{
            background: 'none',
            border: 'none',
            color: (scrolled || isOpen) ? 'var(--primary-navy)' : 'white',
            fontSize: '1.8rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
        </button>
      </div>

      {/* Responsive Mobile Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '100%',
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'white',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
          zIndex: 999,
          animation: 'slideDown 0.4s ease-out forwards'
        }}>
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
                color: 'var(--primary-navy)',
                fontSize: '1.4rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '4px'
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
              marginTop: '2rem',
              padding: '1.2rem 3rem',
              background: 'var(--primary-navy)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '2px'
            }}
          >
            {language === 'en' ? 'ARABIC INTERFACE' : 'ENGLISH INTERFACE'}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
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
