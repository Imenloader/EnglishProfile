'use client';

import { useEffect, useState } from 'react';
import { db, SiteSettings } from '@/data/db';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

function ContactModal({ onClose, t, isRtl }: { onClose: () => void; t: any; isRtl: boolean }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', program: 'General English', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    let success = false;
    const inquiryData = {
      name: formData.name,
      email: formData.email,
      score: 0,
      total_questions: 0,
      level: `INQUIRY: [Program: ${formData.program}] [Phone: ${formData.phone}] ${formData.message}`
    };

    try {
      const res = await fetch('/api/leads.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      if (res.ok) {
        success = true;
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn("⚠️ API failed, falling back to direct Supabase call for Inquiry");
      const { data, error } = await supabase.from('leads').insert([inquiryData]);
      if (!error) success = true;
    }

    if (success) {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', program: 'General English', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', direction: isRtl ? 'rtl' : 'ltr'
      }}
    >
      <div style={{
        background: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '30px',
        padding: '3rem',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            [isRtl ? 'left' : 'right']: '1.5rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            color: 'var(--text-color)',
            fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '2.5rem', textAlign: 'center' }}>
          {t('sendMessage')}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 800, color: 'var(--text-color-muted)', marginBottom: '0.8rem', display: 'block' }}>
                {t('yourName')}
              </label>
              <input
                required type="text" placeholder="Ahmed Ali"
                style={{ width: '100%', background: 'rgba(128,128,128,0.05)', border: '1px solid var(--border-color)', padding: '1rem 1.2rem', borderRadius: '12px', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 800, color: 'var(--text-color-muted)', marginBottom: '0.8rem', display: 'block' }}>
                {t('emailAddress')}
              </label>
              <input
                required type="email" placeholder="ahmed@example.com"
                style={{ width: '100%', background: 'rgba(128,128,128,0.05)', border: '1px solid var(--border-color)', padding: '1rem 1.2rem', borderRadius: '12px', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 800, color: 'var(--text-color-muted)', marginBottom: '0.8rem', display: 'block' }}>
                {t('phone') || 'PHONE'}
              </label>
              <input
                type="text" placeholder="+20 100 000 0000"
                style={{ width: '100%', background: 'rgba(128,128,128,0.05)', border: '1px solid var(--border-color)', padding: '1rem 1.2rem', borderRadius: '12px', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 800, color: 'var(--text-color-muted)', marginBottom: '0.8rem', display: 'block' }}>
                {t('flexibilityTitle').toUpperCase()}
              </label>
              <select
                style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '1rem 1.2rem', borderRadius: '12px', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', appearance: 'none', boxSizing: 'border-box' }}
                value={formData.program}
                onChange={e => setFormData({ ...formData, program: e.target.value })}
              >
                <option>{t('home')}</option>
                <option>General English</option>
                <option>Business English</option>
                <option>IELTS Preparation</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 800, color: 'var(--text-color-muted)', marginBottom: '0.8rem', display: 'block' }}>
              {t('message')}
            </label>
            <textarea
              required rows={4} placeholder={t('chooseStart')}
              style={{ width: '100%', background: 'rgba(128,128,128,0.05)', border: '1px solid var(--border-color)', padding: '1rem 1.2rem', borderRadius: '12px', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="btn-master btn-gold"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '1.2rem',
              fontSize: '0.85rem',
              opacity: status === 'loading' ? 0.7 : 1,
              background: status === 'success' ? '#25D366' : undefined
            }}
          >
            {status === 'loading' ? t('sending') : status === 'success' ? t('messageSent') : t('sendMessage')}
            <i className="fa-solid fa-paper-plane" style={{ [isRtl ? 'marginRight' : 'marginLeft']: '0.8rem' }}></i>
          </button>

          {status === 'error' && (
            <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.85rem' }}>
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function CTASection() {
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
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await db.getSettings();
      if (s) setSettings(s);
    };
    fetchSettings();
  }, []);

  return (
    <section id="contact" className="section-padding" style={{ position: 'relative', overflow: 'hidden', direction: isRtl ? 'rtl' : 'ltr', background: 'var(--bg-color)' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="grid-responsive" style={{ 
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
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2, color: 'var(--text-color)' }}>{t('placementTest')}</h3>
            <p style={{ color: 'var(--text-color-muted)', marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px' }}>{t('testDesc')}</p>
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
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2, color: 'var(--text-color)' }}>{t('whatsappChat')}</h3>
            <p style={{ color: 'var(--text-color-muted)', marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px' }}>{t('whatsappDesc')}</p>
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
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2, color: 'var(--text-color)' }}>{t('emailInquiries')}</h3>
            <p style={{ color: 'var(--text-color-muted)', marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: '280px' }}>{t('emailDesc')}</p>
            <div style={{ flex: 1 }}></div>
            <button
              onClick={() => setShowContactModal(true)}
              className="btn-master btn-gold"
              style={{ padding: '1rem 2rem', fontSize: '0.75rem' }}
            >
              {t('sendEmail').toUpperCase()}
            </button>
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

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          onClose={() => setShowContactModal(false)}
          t={t}
          isRtl={isRtl}
        />
      )}
    </section>
  );
}
