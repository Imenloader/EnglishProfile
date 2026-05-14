'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/data/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  const { language, t, isRtl } = useLanguage();
  const [settings, setSettings] = useState<any>(null);

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
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '5px' }}>{t('institutionalCore')}</span>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'white', marginTop: '2rem', fontFamily: 'var(--font-serif)' }}>{t('visionMission')}</h1>
          </div>
        </div>
      </section>

      {/* 02: Vision & Mission Cards */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="grid-responsive" style={{ 
            gap: '3rem'
          }}>
            <div data-aos="fade-right" style={{ background: 'rgba(255,255,255,0.03)', padding: '5rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <i className="fa-solid fa-eye" style={{ fontSize: '3rem', marginBottom: '2.5rem', color: 'var(--accent-gold)' }}></i>
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.6, marginBottom: '1.5rem', color: 'white' }}>{t('ourVision')}</span>
              <h2 style={{ fontSize: '2.8rem', color: 'white' }}>{t('visionTitle')}</h2>
              <p style={{ marginTop: '2rem', fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.8, color: 'white' }}>{t('visionDesc')}</p>
            </div>
            <div data-aos="fade-left" style={{ background: 'rgba(255,255,255,0.03)', padding: '5rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <i className="fa-solid fa-bullseye" style={{ fontSize: '3rem', marginBottom: '2.5rem', color: 'var(--accent-gold)' }}></i>
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.6, marginBottom: '1.5rem', color: 'white' }}>{t('ourMission')}</span>
              <h2 style={{ fontSize: '2.8rem', color: 'white' }}>{t('missionTitle')}</h2>
              <p style={{ marginTop: '2rem', fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.8, color: 'white' }}>{t('missionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 03: The Mastery Journey (CEFR Path) */}
      <section style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }} data-aos="fade-up">
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '5px' }}>{t('learningEvolution')}</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', marginTop: '1.5rem' }}>{t('professionalTrajectory')}</h2>
          </div>

          {/* Desktop Trajectory */}
          <div className="desktop-trajectory" data-aos="zoom-in">
            <div style={{ minWidth: '800px', height: '400px', position: 'relative' }}>
              <svg viewBox="0 0 1000 400" fill="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <path d="M50,350 Q250,350 350,200 T700,200 T950,50" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
                <path className="journey-path" d="M50,350 Q250,350 350,200 T700,200 T950,50" stroke="var(--accent-gold)" strokeWidth="4" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="1000" />
              </svg>

              {[
                { id: 'A1', x: '5%', y: '87%', label: t('milestoneA1'), desc: t('milestoneA1Desc') },
                { id: 'A2', x: '25%', y: '87%', label: t('milestoneA2'), desc: t('milestoneA2Desc') },
                { id: 'B1', x: '40%', y: '50%', label: t('milestoneB1'), desc: t('milestoneB1Desc') },
                { id: 'B2', x: '65%', y: '50%', label: t('milestoneB2'), desc: t('milestoneB2Desc') },
                { id: 'C1', x: '82%', y: '35%', label: t('milestoneC1'), desc: t('milestoneC1Desc') },
                { id: 'C2', x: '95%', y: '12%', label: t('milestoneC2'), desc: t('milestoneC2Desc'), star: true }
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

          {/* Mobile Trajectory */}
          <div className="mobile-trajectory" data-aos="fade-up">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', position: 'relative', alignItems: 'center' }}>
              <div style={{ 
                position: 'absolute', 
                left: '50%', 
                top: 0, 
                bottom: 0, 
                width: '2px', 
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), var(--accent-gold), rgba(255,255,255,0.1), transparent)',
                transform: 'translateX(-50%)',
                zIndex: 1
              }}></div>
              {[
                { id: 'A1', label: t('milestoneA1'), desc: t('milestoneA1Desc') },
                { id: 'A2', label: t('milestoneA2'), desc: t('milestoneA2Desc') },
                { id: 'B1', label: t('milestoneB1'), desc: t('milestoneB1Desc') },
                { id: 'B2', label: t('milestoneB2'), desc: t('milestoneB2Desc') },
                { id: 'C1', label: t('milestoneC1'), desc: t('milestoneC1Desc') },
                { id: 'C2', label: t('milestoneC2'), desc: t('milestoneC2Desc'), star: true }
              ].map((m) => (
                <div key={m.id} style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '280px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    background: 'var(--accent-gold)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '0.9rem', 
                    fontWeight: 800, 
                    color: 'var(--primary-navy)',
                    marginBottom: '1.2rem',
                    boxShadow: '0 0 30px var(--accent-gold), 0 0 10px rgba(255,255,255,0.5)',
                    border: '3px solid rgba(255,255,255,0.3)',
                    flexShrink: 0
                  }}>
                    {m.star ? <i className="fa-solid fa-star" style={{ fontSize: '0.8rem' }}></i> : m.id}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{m.label}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 300 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04: Executive Contact Form */}
      <section id="contact" style={{ padding: '8rem 0 12rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-dark" style={{ padding: '5rem', borderRadius: '40px' }} data-aos="fade-up">
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-color)', marginBottom: '3.5rem', textAlign: 'center' }}>{t('sendMessage')}</h2>
              
              <AboutContactForm onSave={db.saveInquiry} t={t} />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .desktop-trajectory {
          display: block;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 2rem;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-trajectory {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-trajectory {
            display: none;
          }
          .mobile-trajectory {
            display: block;
          }
        }
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

      <Footer />
    </main>
  );
}

function AboutContactForm({ onSave, t }: { onSave: any, t: any }) {
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
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
      <div className="grid-2-col" style={{ gap: '2rem' }}>
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

      <div className="grid-2-col" style={{ gap: '2rem' }}>
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
          color: var(--text-color-muted); 
          margin-bottom: 1rem; 
          display: block;
        }
        .form-input {
          width: 100%;
          background: rgba(128,128,128,0.05);
          border: 1px solid var(--border-color);
          padding: 1.2rem 1.5rem;
          border-radius: 12px;
          color: var(--text-color);
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .form-input::placeholder {
          color: var(--text-color-muted);
          opacity: 0.5;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--accent-gold);
          background: rgba(128,128,128,0.08);
        }
      `}</style>
    </form>
  );
}

