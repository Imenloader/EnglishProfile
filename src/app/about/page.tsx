'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { db, SiteSettings } from '@/data/db';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AboutPage() {
  const { t, isRtl } = useLanguage();
  const [, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await db.getSettings();
      setSettings(s);
    };
    fetchSettings();
  }, []);

  return (
    <main className="marble-pattern" style={{ background: 'var(--primary-navy)', minHeight: '100vh' }}>
      <Navbar isDarkPage={true} />
      
      {/* 01: Hero / Vision Header */}
      <section style={{ padding: '12rem 0 6rem', textAlign: 'center' }}>
        <div className="container">
          <div data-aos="fade-up">
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '5px' }}>INSTITUTIONAL CORE</span>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'white', marginTop: '2rem', fontFamily: 'var(--font-serif)' }}>Our Vision & Mission</h1>
          </div>
        </div>
      </section>

      {/* 02: Vision & Mission Cards */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '3rem'
          }}>
            <div data-aos="fade-right" style={{ background: 'rgba(255,255,255,0.03)', padding: '5rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <i className="fa-solid fa-eye" style={{ fontSize: '3rem', marginBottom: '2.5rem', color: 'var(--accent-gold)' }}></i>
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.6, marginBottom: '1.5rem', color: 'white' }}>OUR VISION</span>
              <h2 style={{ fontSize: '2.8rem', color: 'white' }}>Achieve Effortlessly</h2>
              <p style={{ marginTop: '2rem', fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.8, color: 'white' }}>Provide opportunities for language learners to unlock their full potentials and achieve their goals effortlessly.</p>
            </div>
            <div data-aos="fade-left" style={{ background: 'rgba(255,255,255,0.03)', padding: '5rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <i className="fa-solid fa-bullseye" style={{ fontSize: '3rem', marginBottom: '2.5rem', color: 'var(--accent-gold)' }}></i>
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.6, marginBottom: '1.5rem', color: 'white' }}>OUR MISSION</span>
              <h2 style={{ fontSize: '2.8rem', color: 'white' }}>Lead and Support</h2>
              <p style={{ marginTop: '2rem', fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.8, color: 'white' }}>Support and lead the English learning community in Egypt through innovation and excellence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 03: The Mastery Journey (CEFR Path) */}
      <section style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }} data-aos="fade-up">
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '5px' }}>LEARNING EVOLUTION</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', marginTop: '1.5rem' }}>Your Professional Trajectory</h2>
          </div>

          <div style={{ position: 'relative', height: '400px', width: '100%', maxWidth: '1000px', margin: '0 auto' }} data-aos="zoom-in">
            <svg viewBox="0 0 1000 400" fill="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <path d="M50,350 Q250,350 350,200 T700,200 T950,50" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
              <path className="journey-path" d="M50,350 Q250,350 350,200 T700,200 T950,50" stroke="var(--accent-gold)" strokeWidth="4" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="1000" />
            </svg>

            {[
              { id: 'A1', x: '5%', y: '87%', label: 'Beginner', desc: 'Foundation skills' },
              { id: 'A2', x: '25%', y: '87%', label: 'Elementary', desc: 'Social basics' },
              { id: 'B1', x: '40%', y: '50%', label: 'Intermediate', desc: 'Workplace ready' },
              { id: 'B2', x: '65%', y: '50%', label: 'Upper-Int', desc: 'Professional fluency' },
              { id: 'C1', x: '82%', y: '35%', label: 'Advanced', desc: 'Academic excellence' },
              { id: 'C2', x: '95%', y: '12%', label: 'Mastery', desc: 'Native-level executive', star: true }
            ].map((m) => (
              <div key={m.id} className="milestone-node" style={{ position: 'absolute', left: m.x, top: m.y, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                <div className="milestone-circle">
                  {m.star ? <i className="fa-solid fa-star" style={{ color: 'var(--accent-gold)' }}></i> : m.id}
                  <div className="milestone-tooltip">
                    <span style={{ fontWeight: 800, color: 'var(--accent-gold)', display: 'block', fontSize: '0.9rem' }}>{m.id} / {m.label}</span>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8, color: 'white' }}>{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04: Executive Contact Form */}
      <section id="contact" style={{ padding: '8rem 0 12rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-dark" style={{ padding: '5rem', borderRadius: '40px' }} data-aos="fade-up">
              <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '3.5rem', textAlign: 'center' }}>{t('sendMessage')}</h2>
              
              <AboutContactForm onSave={db.saveInquiry} t={t} />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .journey-path {
          animation: path-reveal 3s ease-out forwards;
        }
        @keyframes path-reveal {
          to { stroke-dashoffset: 0; }
        }
        .milestone-circle {
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .milestone-circle:hover {
          background: var(--accent-gold);
          color: var(--primary-navy);
          transform: scale(1.2);
        }
        .milestone-tooltip {
          position: absolute;
          bottom: 110%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: var(--primary-navy);
          padding: 1.5rem;
          border-radius: 15px;
          width: 200px;
          text-align: center;
          opacity: 0;
          pointer-events: none;
          transition: all 0.4s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .milestone-circle:hover .milestone-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>

      {/* Corporate Copyright Footer */}
      <footer style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.2, color: 'white', fontSize: '0.7rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <p>© 2026 LINGUAPLANET ACADEMY. {t('allRights').toUpperCase()}</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>{t('privacyPolicy').toUpperCase()}</Link>
            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>{t('termsOfService').toUpperCase()}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function AboutContactForm({ onSave, t }: { onSave: (data: { name: string, email: string, message: string }) => Promise<unknown>, t: (key: string) => string }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', program: 'General English', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const result = await onSave({ 
      name: formData.name, 
      email: formData.email, 
      message: `[Program: ${formData.program}] [Phone: ${formData.phone}] ${formData.message}` 
    });
    if (result) {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', program: 'General English', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="form-group">
          <label className="form-label">{t('yourName')}</label>
          <input 
            required
            type="text" 
            placeholder="Ahmed Ali" 
            className="form-input" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('emailAddress')}</label>
          <input 
            required
            type="email" 
            placeholder="ahmed@example.com" 
            className="form-input" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="form-group">
          <label className="form-label">{t('phone') || 'PHONE'}</label>
          <input 
            type="text" 
            placeholder="+20 100 000 0000" 
            className="form-input" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('flexibilityTitle').toUpperCase()}</label>
          <select 
            className="form-input" 
            style={{ appearance: 'none' }}
            value={formData.program}
            onChange={(e) => setFormData({...formData, program: e.target.value})}
          >
            <option>{t('home')}</option>
            <option>General English</option>
            <option>Business English</option>
            <option>IELTS Preparation</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('message')}</label>
        <textarea 
          required
          rows={4} 
          placeholder={t('chooseStart')} 
          className="form-input" 
          style={{ resize: 'none' }}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        ></textarea>
      </div>

      <button 
        disabled={status === 'loading' || status === 'success'}
        className="btn-master" 
        style={{ 
          background: status === 'success' ? '#25D366' : 'var(--accent-blue)', 
          color: 'white', 
          width: '100%', 
          justifyContent: 'center', 
          borderRadius: '15px',
          padding: '1.5rem',
          fontSize: '1rem'
        }}>
        {status === 'loading' ? t('sending') : status === 'success' ? t('messageSent') : t('sendMessage')} 
        <i className="fa-solid fa-paper-plane" style={{ [t('language') === 'ar' ? 'marginRight' : 'marginLeft']: '1rem' }}></i>
      </button>

      <style jsx>{`
        .form-label {
          font-size: 0.7rem; 
          letter-spacing: 2px; 
          font-weight: 800; 
          color: rgba(255,255,255,0.4); 
          marginBottom: 1rem; 
          display: block;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1.2rem 1.5rem;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--accent-gold);
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </form>
  );
}

