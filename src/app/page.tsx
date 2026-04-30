'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Hero from '@/components/Hero';
import CTASection from '@/components/CTASection';
import Link from 'next/link';
import { db } from '@/data/db';

export default function Home() {
  const { language, isRtl } = useLanguage();
  const [settings, setSettings] = useState<any>({
    contactEmail: "hello@linguaplanet.eg",
    facebookLink: "https://facebook.com/linguaplanet",
    instagramLink: "https://instagram.com/linguaplanet",
    linkedinLink: "https://linkedin.com/company/linkedin/linguaplanet",
    tiktokLink: "https://tiktok.com/@linguaplanet",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await db.getSettings();
      if (s) setSettings(s);
    };
    fetchSettings();
  }, []);

  return (
    <main className="marble-pattern">
      <Hero />

      {/* Corporate Trust Bar - Snippet Version */}
      <section id="clients" style={{ backgroundColor: '#f8fafc', padding: '5rem 0', overflow: 'hidden' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }} data-aos="fade-up">
            <span style={{ color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>
              <i className="fa-solid fa-circle-dot" style={{ marginRight: '0.5rem' }}></i> TRUSTED BY
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Companies that trust Linguaplanet</h2>
          </div>
          
          <div className="marquee-wrap" data-aos="fade-up" data-aos-delay="100">
            <div className="marquee-track">
              {[
                'Vodafone EG', 'Etisalat', 'CIB Bank', 'Orascom', 'Petrojet', 'Alamenda', 'Tamayyoz', 'Orange', 'WE', 'HSBC'
              ].map((partner, i) => (
                <div key={i} className="glass-card" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '200px',
                  height: '100px',
                  borderRadius: '16px',
                  filter: 'grayscale(100%)',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(100%)'}
                >
                  <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.9rem', letterSpacing: '1px' }}>{partner.toUpperCase()}</span>
                </div>
              ))}
              {/* Duplicate for infinite loop */}
              {[
                'Vodafone EG', 'Etisalat', 'CIB Bank', 'Orascom', 'Petrojet', 'Alamenda', 'Tamayyoz', 'Orange', 'WE', 'HSBC'
              ].map((partner, i) => (
                <div key={i + 20} className="glass-card" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '200px',
                  height: '100px',
                  borderRadius: '16px',
                  filter: 'grayscale(100%)',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(100%)'}
                >
                  <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.9rem', letterSpacing: '1px' }}>{partner.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Manifesto / About */}
      <section id="about" className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '8rem', alignItems: 'center' }}>
            <div data-aos="fade-up">
              <span className="gold-text" style={{ letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '2rem', display: 'block' }}>OUR PHILOSOPHY</span>
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '3rem' }}>
                Engineering <br/> <span className="gold-text">Excellence</span> <br/> Through Language
              </h2>
              <div style={{ width: '100px', height: '2px', background: 'var(--accent-gold)', marginBottom: '3rem' }}></div>
              <p style={{ marginBottom: '2rem', fontSize: '1.3rem', color: '#555', fontWeight: 300 }}>
                At Linguaplanet, we believe that language is more than just words—it's the key to unlocking your professional potential. 
              </p>
              <p style={{ opacity: 0.7, fontWeight: 300, lineHeight: 2 }}>
                Our curriculum integrates advanced English proficiency with essential soft skills like leadership, public speaking, and emotional intelligence. Whether you are a corporate executive or an aspiring professional, our tailored programs ensure you communicate with confidence and elegance on the global stage.
              </p>
            </div>
            <div style={{ position: 'relative' }} data-aos="zoom-in">
              <div className="glass" style={{ padding: '4rem', borderRadius: '40px', border: 'none', position: 'relative', zIndex: 2 }}>
                <i className="fa-solid fa-quote-left" style={{ fontSize: '3rem', color: 'var(--accent-gold)', opacity: 0.3, marginBottom: '2rem', display: 'block' }}></i>
                <p style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--primary-navy)' }}>
                  "The limit of your language is the limit of your world."
                </p>
                <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '50px', height: '1px', background: 'var(--accent-gold)' }}></div>
                  <span style={{ letterSpacing: '2px', fontSize: '0.7rem', fontWeight: 800 }}>LUDWIG WITTGENSTEIN</span>
                </div>
              </div>
              {/* Decorative Background Element */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100%',
                height: '100%',
                border: '1px solid var(--accent-gold)',
                borderRadius: '40px',
                zIndex: 1
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 01: Mastery Pillars (Bento Grid) - Responsive */}
      <section id="standards" style={{ padding: '10rem 0', background: 'var(--primary-navy)', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle Background Ornament */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }}>
          <div className="marble-pattern" style={{ width: '100%', height: '100%' }}></div>
        </div>

        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }} data-aos="fade-up">
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase' }}>Operational Excellence</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginTop: '1.5rem', color: 'white', fontFamily: 'var(--font-serif)' }}>The Linguaplanet Standard</h2>
          </div>

          <div className="bento-grid-container">
            {/* 01: Quality Assurance */}
            <div className="bento-item span-8 glass-dark" data-aos="fade-up">
              <div className="bento-content">
                <span className="pillar-tag">01 / PILLAR</span>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 600 }}>Quality Assurance</h3>
                <ul className="pillar-list" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
                  <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold)' }}></i> Ground-breaking and top-notch approaches.</li>
                  <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold)' }}></i> Universal standards of assessment.</li>
                  <li><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold)' }}></i> Measurable quick results.</li>
                </ul>
              </div>
            </div>

            {/* 02: Flexible Scheduling */}
            <div className="bento-item span-4 gold-pillar" data-aos="fade-up" data-aos-delay="100">
              <div className="bento-content dark-text">
                <span className="pillar-tag-dark" style={{ color: 'var(--primary-navy)', opacity: 0.4 }}>02 / PILLAR</span>
                <h3 style={{ color: 'var(--primary-navy)', fontSize: '2rem' }}>Flexible Scheduling</h3>
                <p style={{ color: 'var(--primary-navy)', opacity: 0.9 }}>Face-to-Face or Online delivery at our premises or yours, tailored to your elite schedule.</p>
              </div>
            </div>

            {/* 03: Transparent Pricing */}
            <div className="bento-item span-4 glass-dark" data-aos="fade-up" data-aos-delay="200">
              <div className="bento-content">
                <span className="pillar-tag">03 / PILLAR</span>
                <h3 style={{ fontSize: '2rem' }}>Transparent Pricing</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Competitive pricing plans and payment options designed to suit your professional needs.</p>
              </div>
            </div>

            {/* 04: Reporting & Follow-up */}
            <div className="bento-item span-5 glass-dark" data-aos="fade-up" data-aos-delay="300">
              <div className="bento-content">
                <span className="pillar-tag">04 / PILLAR</span>
                <h3 style={{ fontSize: '2rem' }}>Reporting & Follow-up</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Detailed performance accounts, punctuality notifications, and continuous progress tracking.</p>
              </div>
            </div>

            {/* 05: Guarantees */}
            <div className="bento-item span-3 glass-dark" data-aos="fade-up" data-aos-delay="400">
              <div className="bento-content">
                <span className="pillar-tag">05 / PILLAR</span>
                <h3 style={{ fontSize: '1.8rem' }}>Guarantees</h3>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>Extra support for learners and free review classes for failing students.</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .bento-grid-container {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 2rem;
          }
          .bento-item {
            border-radius: 24px;
            overflow: hidden;
            transition: var(--transition-master);
          }
          .bento-content { padding: 4rem; }
          .bento-content h3 { margin-top: 1.5rem; color: white; }
          .bento-content p { margin-top: 2rem; opacity: 0.7; line-height: 1.8; }
          .span-8 { grid-column: span 8; }
          .span-4 { grid-column: span 4; }
          .span-5 { grid-column: span 5; }
          .span-3 { grid-column: span 3; }
          .pillar-tag { color: var(--accent-gold); font-size: 0.7rem; font-weight: 800; letter-spacing: 4px; }
          .pillar-list { list-style: none; padding: 0; margin-top: 2.5rem; display: grid; gap: 1.5rem; color: white; }
          .pillar-list i { margin-right: 1.2rem; }

          @media (max-width: 991px) {
            .bento-grid-container { grid-template-columns: 1fr; }
            .span-8, .span-4, .span-5, .span-3 { grid-column: span 1 !important; }
            .bento-content { padding: 2.5rem; }
          }
        `}</style>
      </section>

      {/* 02: Our Values - From Snippet */}
      <section id="values" style={{ padding: '8rem 0', background: '#fdfcfb' }}>
        <div className="container text-center">
          <div data-aos="fade-up">
            <span style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px' }}>CORE PRINCIPLES</span>
            <h2 style={{ fontSize: '3rem', marginTop: '1rem', color: 'var(--primary-navy)' }}>What Drives Us Forward</h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '3rem', 
            marginTop: '5rem' 
          }}>
            {[
              { icon: 'fa-medal', title: 'Quality', text: 'We strive to provide excellence in every lesson and assessment.' },
              { icon: 'fa-sliders', title: 'Flexibility', text: 'Providing a variety of options and solutions tailored to your needs.' },
              { icon: 'fa-hand-holding-heart', title: 'Social Responsibility', text: 'Giving back to the community through scholarships and outreach.' }
            ].map((value, i) => (
              <div key={i} className="value-card" data-aos="fade-up" data-aos-delay={i * 100} style={{
                padding: '3.5rem',
                background: 'white',
                borderRadius: '32px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                transition: 'all 0.4s ease'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'rgba(10, 17, 40, 0.05)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  color: 'var(--primary-navy)',
                  margin: '0 auto 2rem'
                }}><i className={`fa-solid ${value.icon}`}></i></div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)' }}>{value.title}</h3>
                <p style={{ marginTop: '1rem', opacity: 0.6, lineHeight: 1.6 }}>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04: Academic Programs (Services) - Detailed Snippet Data */}
      <section id="services" style={{ padding: '10rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }}>
            <span style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px' }}>ACADEMIC TRACKS</span>
            <h2 style={{ fontSize: '3.5rem', marginTop: '1rem' }}>Our Programs</h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {[
              { icon: 'fa-book-open', title: 'General English', text: 'Structured courses from A1 to C2 covering all core language skills with modern materials.' },
              { icon: 'fa-comments', title: 'Conversation Classes', text: 'Build real-world fluency fast with small groups and immersive speaking exercises.' },
              { icon: 'fa-briefcase', title: 'Business English', text: 'Master professional communication for emails, presentations, and global negotiations.' },
              { icon: 'fa-graduation-cap', title: 'IG / SAT Prep', text: 'Expert coaching and proven strategies to excel in international academic exams.' },
              { icon: 'fa-certificate', title: 'IELTS / TOEFL', text: 'Achieve your target score with comprehensive prep, mock tests, and expert feedback.' },
              { icon: 'fa-lightbulb', title: 'Soft Skills', text: 'Leadership, critical thinking, and public speaking — the skills that set you apart.' }
            ].map((program, i) => (
              <div key={i} className="program-card" data-aos="fade-up" data-aos-delay={i * 50} style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '32px',
                border: '1px solid rgba(0,0,0,0.03)',
                transition: 'all 0.4s ease'
              }}>
                <div style={{ fontSize: '2.5rem', color: 'var(--accent-blue)', marginBottom: '1.5rem' }}>
                  <i className={`fa-solid ${program.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{program.title}</h3>
                <p style={{ opacity: 0.6, lineHeight: 1.7 }}>{program.text}</p>
                <Link href="#contact" style={{ 
                  display: 'inline-block', 
                  marginTop: '2rem', 
                  color: 'var(--accent-blue)', 
                  fontWeight: 800, 
                  fontSize: '0.8rem', 
                  letterSpacing: '1px',
                  textDecoration: 'none'
                }}>EXPLORE TRACK <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05: Leadership & Team - Premium Staggered */}
      <section id="team" style={{ padding: '8rem 0', background: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }}>
            <span style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px' }}>EXECUTIVE LEADERSHIP</span>
            <h2 style={{ fontSize: '3rem', marginTop: '1rem' }}>The Minds Behind Success</h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '3rem' 
          }}>
            {[
              { name: 'Maged Shabana', role: 'General Manager', img: '/images/GM-new.png' },
              { name: 'Muhammad Raafat', role: 'Recruitment Manager', img: '/images/Recruitment-new.png' },
              { name: 'Ibrahim ElEmam', role: 'Marketing Manager', img: '/images/Marketing-new.png' }
            ].map((member, i) => (
              <div key={i} className="team-card" data-aos="fade-up" data-aos-delay={i * 100} style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  margin: '0 auto 2rem',
                  border: '4px solid white',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  background: 'var(--primary-navy)'
                }}>
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy)' }}>{member.name}</h4>
                <p style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '1px', marginTop: '0.5rem', textTransform: 'uppercase' }}>{member.role}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                  <i className="fa-brands fa-linkedin" style={{ opacity: 0.2, cursor: 'pointer' }}></i>
                  <i className="fa-solid fa-envelope" style={{ opacity: 0.2, cursor: 'pointer' }}></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

      {/* WhatsApp Floating Action Button */}
      <a 
        href={`https://wa.me/${settings?.whatsappNumber || '201270068237'}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '40px',
          right: isRtl ? 'auto' : '40px',
          left: isRtl ? '40px' : 'auto',
          width: '70px',
          height: '70px',
          background: '#25D366',
          borderRadius: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2.5rem',
          boxShadow: '0 20px 40px rgba(37, 211, 102, 0.4)',
          zIndex: 9999,
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: 'whatsapp-pulse 2s infinite'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 30px 60px rgba(37, 211, 102, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 211, 102, 0.4)';
        }}
      >
        <svg viewBox="0 0 448 512" style={{ width: '35px', fill: 'white' }}>
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.5 2.4-11.2 2.5-2.4 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.2 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>

        <style jsx>{`
          @keyframes whatsapp-pulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
            70% { box-shadow: 0 0 0 20px rgba(37, 211, 102, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
          }
        `}</style>
      </a>

      {/* 06: Enterprise Institutional Footer */}
      <footer style={{ padding: '8rem 0 4rem', background: 'var(--primary-navy)', color: 'white', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '5rem', paddingBottom: '6rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Column 1: Brand & Identity */}
            <div style={{ gridColumn: 'span 1.5' }}>
              <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <svg viewBox="0 0 2272.86 1775.34" style={{ width: '38px' }}>
                  <path fill="#012169" d="M1782.58,1279.59c-201.86,148.03-411.38,220.51-628.43,217.17v-212.36c-17.78,12.22-35.43,24.32-53.09,36.05v173.71c-66.67-10-128.65-27.9-185.69-53.83-97.17,60.13-190.14,113.34-276.56,158.65,131,93.46,282.49,140.01,454.72,140.01,144.7,0,281.87-40.37,411.38-121.12,117.78-77.41,216.19-183.47,295.45-318.04l-17.78-20.25ZM735.97,1319.84c-23.33-22.35-45.43-46.67-66.42-72.97,132.97-112.85,201.99-171.62,207.05-176.68,62.1-68.89,93.22-154.82,93.22-257.42V297.92l131.24-108.65v1021.91c17.66-12.1,35.31-24.45,53.09-36.92v-419.53l408.91,12.47,133.59-232.11-290.14-7.41,197.54-198.9,7.16-7.28,151.12-152.23-9.14-21.48-5.93-13.95c-3.33,0-5.93.86-7.66,2.59h-27.78c-79.14,0-154.82-10.12-227.05-30.37-106.06-28.52-192.73-63.96-260.02-106.06l-494.6,393.85v585.47c0,18.52-.49,35.31-1.36,50.5-.74,15.19-2.1,28.64-3.7,40.37-8.4,45.31-37.9,90.87-88.4,136.3-29.38-43.95-54.2-89.88-74.33-137.91-12.47-29.88-23.21-60.5-31.98-91.98-21.73-76.79-32.59-158.28-32.59-244.58,0-68.89,12.22-135.32,36.42-199.39,52.1-138.03,160.26-264.95,324.59-381.01l-22.59-38.03c-178.41,96.05-309.65,202.98-393.73,320.51-38.52,52.23-69.51,108.15-92.97,167.91-37.41,94.45-56.05,198.28-56.05,311.62,0,89.02,11.36,172.73,34.32,251.13,9.14,31.85,20.37,62.84,33.46,92.97,9.38,21.85,19.75,43.09,31.11,63.95v.12c34.45,63.21,78.15,122.35,130.75,177.29,12.96,13.46,26.3,26.3,39.76,38.52,81.73-42.1,169.52-91.49,261.5-147.42-31.24-20.49-60.62-44.08-88.4-70.37ZM1154.15,219.52c82.97,48.64,171.86,84.82,266.68,107.91,15.93,4.07,31.98,7.53,48.15,10.74,14.32,2.96,29.01,5.31,43.58,7.65l-78.52,79.02-279.89,281.99V219.52Z" />
                </svg>
              </div>
              <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '0.95rem', maxWidth: '300px' }}>
                Where success becomes a habit. Empowering language learners in Egypt through institutional excellence since 2015.
              </p>
            </div>

            {/* Column 2: Academic Programs */}
            <div>
              <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>ACADEMIC TRACKS</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem' }}>
                <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>General English</Link></li>
                <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>Business Communication</Link></li>
                <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>Soft Skills Mastery</Link></li>
                <li><Link href="/placement-test" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>Placement Assessment</Link></li>
              </ul>
            </div>

            {/* Column 3: Corporate Identity */}
            <div>
              <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>CORPORATE</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem' }}>
                <li><Link href="/about" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>About the Academy</Link></li>
                <li><Link href="/#team" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>Leadership Team</Link></li>
                <li><span style={{ color: 'white', opacity: 0.3, fontSize: '0.8rem', letterSpacing: '1px' }}>TAX ID: 416-241-177</span></li>
                <li><span style={{ color: 'white', opacity: 0.3, fontSize: '0.8rem', letterSpacing: '1px' }}>EST. 2015</span></li>
              </ul>
            </div>

            {/* Column 4: Connectivity */}
            <div>
              <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>CONNECTIVITY</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem', opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>
                <li>{settings?.contactEmail || 'hello@linguaplanet.eg'}</li>
                <li>+20 127 006 8237</li>
                <li>Cairo, Egypt</li>
              </ul>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href={settings?.facebookLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.4 }}><i className="fa-brands fa-facebook-f" style={{ fontSize: '1.1rem' }}></i></a>
                <a href={settings?.instagramLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.4 }}><i className="fa-brands fa-instagram" style={{ fontSize: '1.1rem' }}></i></a>
                <a href={settings?.linkedinLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.4 }}><i className="fa-brands fa-linkedin-in" style={{ fontSize: '1.1rem' }}></i></a>
                <a href={settings?.tiktokLink || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.4 }}><i className="fa-brands fa-tiktok" style={{ fontSize: '1.1rem' }}></i></a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.2, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px' }}>
            <p>© 2025 LINGUAPLANET ACADEMY. ALL RIGHTS RESERVED.</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span>PRIVACY POLICY</span>
              <span>TERMS OF SERVICE</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
