'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import CTASection from '@/components/CTASection';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/data/db';

export default function Home() {
  const { language, isRtl, t } = useLanguage();
  const [settings, setSettings] = useState<any>({
    contactEmail: "hello@linguaplanet.eg",
    facebookLink: "https://facebook.com/linguaplanet",
    instagramLink: "https://instagram.com/linguaplanet",
    linkedinLink: "https://linkedin.com/company/linkedin/linguaplanet",
    tiktokLink: "https://tiktok.com/@linguaplanet",
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await db.getSettings();
      if (s) setSettings(s);
    };
    fetchSettings();

    // Performance Optimization: Throttled Scroll Listener
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
          setScrollProgress(progress);
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
    <main className="marble-pattern">
      <Navbar isDarkPage={false} />
      {/* Scroll Progress Bar */}
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

      <Hero />

      {/* Corporate Trust Bar - Snippet Version */}
      <section id="clients" style={{ backgroundColor: 'var(--bg-color-alt)', padding: '5rem 0', overflow: 'hidden' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }} data-aos="fade-up">
            <span style={{ color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>
              <i className="fa-solid fa-circle-dot" style={{ [isRtl ? 'marginLeft' : 'marginRight']: '0.5rem' }}></i> {t('trustedBy')}
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)' }}>{t('companiesTrust')}</h2>
          </div>
          
          <div className="marquee-wrap" style={{ marginTop: '2rem' }}>
            <div className="marquee-track">
              {(() => {
                const partners = [
                  'Vodafone', 'Etisalat', 'CIB Bank', 'Orascom', 'Petrojet', 'Alameda', 'Tamayyoz', 'Orange', 'WE', 'HSBC'
                ];
                // Multiply the partners array to ensure enough content for the infinite scroll marquee
                const triplePartners = [...partners, ...partners, ...partners];
                
                return triplePartners.map((partner, i) => (
                  <div key={`${partner}-${i}`} className="glass-card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '220px',
                    height: '120px',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    filter: 'grayscale(100%)',
                    flexShrink: 0,
                    transition: 'all 0.4s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'grayscale(0%)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'grayscale(100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-building" style={{ opacity: 0.2 }}></i>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--text-color)', fontSize: '0.85rem', letterSpacing: '1px' }}>{partner.toUpperCase()}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 01: The Manifesto / About */}
      <section id="about" style={{ padding: '10rem 0', background: 'var(--bg-color)' }}>
        <div className="container">
          <div className="grid-responsive" style={{ gap: 'clamp(3rem, 10vw, 8rem)', alignItems: 'center' }}>
            <div data-aos="fade-up">
              <span className="gold-text" style={{ letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '2rem', display: 'block' }}>{t('about').toUpperCase()}</span>
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '3rem', color: 'var(--primary-navy)' }} dangerouslySetInnerHTML={{ __html: t('aboutHeadline') }}></h2>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-color-muted)', marginBottom: '4rem', maxWidth: '600px' }}>
                {t('aboutDescription')}
              </p>
              
              <div style={{ display: 'grid', gap: '2.5rem' }}>
                {[
                  { title: t('pillar1Title'), desc: t('pillar1Desc'), icon: 'fa-star' },
                  { title: t('pillar2Title'), desc: t('pillar2Desc'), icon: 'fa-tags' },
                  { title: t('pillar3Title'), desc: t('pillar3Desc'), icon: 'fa-lightbulb' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }} data-aos="fade-up" data-aos-delay={i * 100}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: 'rgba(197, 160, 89, 0.1)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i className={`fa-solid ${item.icon}`} style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }} data-aos="zoom-in">
              <div style={{ borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                <Image 
                  src="/images/about-vision.png" 
                  alt="" 
                  width={600} 
                  height={800} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
              <div style={{
                position: 'absolute',
                top: '30px',
                right: isRtl ? 'auto' : '-30px',
                left: isRtl ? '-30px' : 'auto',
                width: '100%',
                height: '100%',
                border: '2px solid var(--accent-gold)',
                borderRadius: '40px',
                zIndex: -1
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 02: Core Values & Vision/Mission */}
      <section id="values" style={{ padding: '10rem 0', background: 'var(--bg-color-alt)', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }} data-aos="fade-up">
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase' }}>{t('ourValues')}</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: '1.5rem', color: 'var(--text-color)', fontFamily: 'var(--font-serif)' }}>{t('valuesSubtitle')}</h2>
          </div>

          <div className="grid-responsive" style={{ gap: '2rem' }}>
            {[
              { title: t('value1Title'), value: t('value1Desc'), icon: 'fa-award' },
              { title: t('value2Title'), value: t('value2Desc'), icon: 'fa-arrows-spin' },
              { title: t('value3Title'), value: t('value3Desc'), icon: 'fa-handshake-angle' }
            ].map((value, i) => (
              <div key={i} className="glass-card" style={{ padding: '4rem', borderRadius: '32px', textAlign: 'center' }} data-aos="fade-up" data-aos-delay={i * 100}>
                <div style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '2rem' }}>
                  <i className={`fa-solid ${value.icon}`}></i>
                </div>
                <h3 style={{ color: 'var(--text-color)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>{value.title}</h3>
                <p style={{ color: 'var(--text-color-muted)', fontSize: '1.1rem' }}>{value.value}</p>
              </div>
            ))}
          </div>

          {/* Integrated Vision & Mission */}
          <div className="grid-2-col" style={{ marginTop: '6rem', gap: '3rem' }}>
            <div className="glass-card" style={{ padding: '4.5rem', borderRadius: '40px' }} data-aos="fade-right">
              <span style={{ color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>{t('ourVision')}</span>
              <h3 style={{ color: 'var(--text-color)', fontSize: '2.5rem', margin: '1.5rem 0' }}>{t('visionTitle')}</h3>
              <p style={{ color: 'var(--text-color-muted)', fontSize: '1.2rem', lineHeight: 1.8 }}>{t('visionDesc')}</p>
            </div>
            <div className="glass-card" style={{ padding: '4.5rem', borderRadius: '40px' }} data-aos="fade-left">
              <span style={{ color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>{t('ourMission')}</span>
              <h3 style={{ color: 'var(--text-color)', fontSize: '2.5rem', margin: '1.5rem 0' }}>{t('missionTitle')}</h3>
              <p style={{ color: 'var(--text-color-muted)', fontSize: '1.2rem', lineHeight: 1.8 }}>{t('missionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 03: Why Choose Us (Why LinguaPlanet?) */}
      <section id="why-us" style={{ padding: '10rem 0', background: 'var(--bg-color)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }} data-aos="fade-up">
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase' }}>{t('whyChooseUs')}</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: '1.5rem', color: 'var(--text-color)', fontFamily: 'var(--font-serif)' }}>{t('whyLinguaPlanet')}</h2>
          </div>

          <div className="grid-responsive" style={{ gap: '2.5rem' }}>
            {[
              { 
                title: t('qualityTitle'), 
                bullets: [t('qualityBullet1'), t('qualityBullet2'), t('qualityBullet3')], 
                icon: 'fa-gem' 
              },
              { 
                title: t('flexibilityTitle'), 
                bullets: [t('flexibilityBullet1'), t('flexibilityBullet2')], 
                icon: 'fa-clock-rotate-left' 
              },
              { 
                title: t('pricingTitle'), 
                bullets: [t('pricingBullet1'), t('pricingBullet2'), t('pricingBullet3')], 
                icon: 'fa-wallet' 
              },
              { 
                title: t('reportingTitle'), 
                bullets: [t('reportingBullet1'), t('reportingBullet2'), t('reportingBullet3')], 
                icon: 'fa-chart-line' 
              },
              { 
                title: t('guaranteesTitle'), 
                bullets: [t('guaranteesBullet1'), t('guaranteesBullet2'), t('guaranteesBullet3')], 
                icon: 'fa-shield-halved' 
              }
            ].map((node, i) => (
              <div key={i} className="card-premium" style={{ borderTop: '4px solid var(--accent-gold)' }} data-aos="fade-up" data-aos-delay={i * 50}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(1, 33, 105, 0.05)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                  <i className={`fa-solid ${node.icon}`} style={{ color: 'var(--primary-navy)', fontSize: '1.5rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', color: 'var(--primary-navy)' }}>{node.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                  {node.bullets.map((bullet, j) => (
                    <li key={j} style={{ display: 'flex', gap: '1rem', opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.4 }}>
                      <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-gold)', marginTop: '3px' }}></i>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Challenges Nodes */}
      <section style={{ padding: '8rem 0', background: 'var(--bg-color-alt)' }}>
        <div className="container">
          <div className="grid-responsive" style={{ gap: '3rem' }}>
            
            {/* Facing Challenges Box */}
            <div className="glass" style={{ padding: '4.5rem', borderRadius: '40px', borderLeft: isRtl ? 'none' : '8px solid var(--primary-navy)', borderRight: isRtl ? '8px solid var(--primary-navy)' : 'none' }} data-aos="fade-right">
              <div className="flex items-center gap-4 mb-6">
                <div style={{ width: '50px', height: '50px', background: 'rgba(1, 33, 105, 0.05)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--primary-navy)', fontSize: '1.5rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-color)' }}>{t('facingChallenges')}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem', opacity: 0.7, lineHeight: 1.7 }}>
                <li><i className="fa-solid fa-chevron-right" style={{ [isRtl ? 'marginLeft' : 'marginRight']: '1rem', color: 'var(--accent-gold)', fontSize: '0.8rem', transform: isRtl ? 'rotate(180deg)' : 'none' }}></i> {t('challenges1')}</li>
                <li><i className="fa-solid fa-chevron-right" style={{ [isRtl ? 'marginLeft' : 'marginRight']: '1rem', color: 'var(--accent-gold)', fontSize: '0.8rem', transform: isRtl ? 'rotate(180deg)' : 'none' }}></i> {t('challenges2')}</li>
                <li><i className="fa-solid fa-chevron-right" style={{ [isRtl ? 'marginLeft' : 'marginRight']: '1rem', color: 'var(--accent-gold)', fontSize: '0.8rem', transform: isRtl ? 'rotate(180deg)' : 'none' }}></i> {t('challenges3')}</li>
              </ul>
            </div>

            {/* Safe Hands Box */}
            <div className="glass" style={{ padding: '4.5rem', borderRadius: '40px', borderLeft: isRtl ? 'none' : '8px solid var(--accent-gold)', borderRight: isRtl ? '8px solid var(--accent-gold)' : 'none' }} data-aos="fade-left">
              <div className="flex items-center gap-4 mb-6">
                <div style={{ width: '50px', height: '50px', background: 'rgba(197, 160, 89, 0.05)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-hands-holding" style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-color)' }}>{t('safeHands')}</h3>
              </div>
              <p style={{ opacity: 0.7, lineHeight: 1.8, marginBottom: '2rem' }}>
                {t('safeHandsDesc')}
              </p>
              <p style={{ opacity: 0.7, lineHeight: 1.8, marginBottom: '2rem' }}>
                {t('safeHandsDesc2')}
              </p>
              <p style={{ opacity: 0.9, fontWeight: 700, color: 'var(--primary-navy)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                {t('safeHandsDesc3')}
              </p>
              <div style={{ background: 'rgba(1, 33, 105, 0.03)', padding: '1.5rem 2rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary-navy)' }}></i>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--text-color)' }}>{t('institutionalGuarantee')}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 04: Academic Programs (Services) - Detailed Snippet Data */}
      <section id="services" style={{ padding: '10rem 0', background: 'var(--bg-color-alt)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }}>
            <span style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px' }}>{t('academicTracks')}</span>
            <h2 style={{ fontSize: '3.5rem', marginTop: '1rem', color: 'var(--text-color)' }}>{t('ourPrograms')}</h2>
          </div>
          
          <div className="grid-responsive" style={{ 
            gap: '2.5rem' 
          }}>
            {[
              { icon: 'fa-book-open', title: t('program1Title'), text: t('program1Desc') },
              { icon: 'fa-comments', title: t('program2Title'), text: t('program2Desc') },
              { icon: 'fa-briefcase', title: t('program3Title'), text: t('program3Desc') },
              { icon: 'fa-graduation-cap', title: t('program4Title'), text: t('program4Desc') },
              { icon: 'fa-certificate', title: t('program5Title'), text: t('program5Desc') },
              { icon: 'fa-lightbulb', title: t('program6Title'), text: t('program6Desc') }
            ].map((program, i) => (
              <div key={i} className="card-premium" data-aos="fade-up" data-aos-delay={i * 50} style={{
                background: 'var(--card-bg)',
                padding: '3rem',
                borderRadius: '32px',
                border: '1px solid var(--border-color)',
                transition: 'all 0.4s ease'
              }}>
                <div style={{ fontSize: '2.5rem', color: 'var(--accent-blue)', marginBottom: '1.5rem' }}>
                  <i className={`fa-solid ${program.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-color)' }}>{program.title}</h3>
                <p style={{ color: 'var(--text-color-muted)', lineHeight: 1.7 }}>{program.text}</p>
                <Link href="#contact" style={{ 
                  display: 'inline-block', 
                  marginTop: '2rem', 
                  color: 'var(--accent-blue)', 
                  fontWeight: 800, 
                  fontSize: '0.8rem', 
                  letterSpacing: '1px',
                  textDecoration: 'none'
                }}>{t('exploreTrack')} <i className={`fa-solid ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'}`} style={{ [isRtl ? 'marginRight' : 'marginLeft']: '0.5rem' }}></i></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05: Leadership & Team - Premium Staggered */}
      <section id="team" style={{ padding: '8rem 0', background: 'var(--bg-color)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }}>
            <span style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px' }}>{t('executiveLeadership')}</span>
            <h2 style={{ fontSize: '3rem', marginTop: '1rem', color: 'var(--text-color)' }}>{t('mindsBehindSuccess')}</h2>
          </div>

          <div className="grid-responsive" style={{ 
            gap: '3rem' 
          }}>
            {[
              { name: 'Maged Shabana', role: t('roleGM'), img: '/images/GM-new.png' },
              { name: 'Muhammad Raafat', role: 'Recruitment and Talent Acquisition Manager', img: '/images/Recruitment-new.png' },
              { name: 'Ibrahim ElEmam', role: t('roleMarketing'), img: '/images/Marketing-new.png' }
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
                  background: 'var(--primary-navy)',
                  position: 'relative'
                }}>
                  <Image src={member.img} alt={member.name} width={180} height={180} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-color)' }}>{member.name}</h4>
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

      {/* 06: The Mastery Journey (CEFR Path) */}
      <section id="trajectory" style={{ padding: '10rem 0', background: 'var(--primary-navy)', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ position: 'relative', height: '400px', width: '100%', maxWidth: '1000px', margin: '0 auto' }} data-aos="zoom-in">
            <svg viewBox="0 0 1000 400" fill="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <path d="M50,350 Q250,350 350,200 T700,200 T950,50" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
              <path className="journey-path" d="M50,350 Q250,350 350,200 T700,200 T950,50" stroke="var(--accent-gold)" strokeWidth="4" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="1000" />
            </svg>

            {[
              { id: 'A1', x: '8%', y: '85%', label: t('milestoneA1'), desc: t('milestoneA1Desc') },
              { id: 'A2', x: '24%', y: '75%', label: t('milestoneA2'), desc: t('milestoneA2Desc') },
              { id: 'B1', x: '42%', y: '42%', label: t('milestoneB1'), desc: t('milestoneB1Desc') },
              { id: 'B2', x: '63%', y: '50%', label: t('milestoneB2'), desc: t('milestoneB2Desc') },
              { id: 'C1', x: '83%', y: '60%', label: t('milestoneC1'), desc: t('milestoneC1Desc') },
              { id: 'C2', x: '94%', y: '15%', label: t('milestoneC2'), desc: t('milestoneC2Desc'), star: true }
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
            color: white;
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
                {t('footerDesc')}
              </p>
            </div>

            {/* Column 2: Academic Programs */}
            <div>
              <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>{t('academicTracks')}</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem' }}>
                <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('generalEnglish')}</Link></li>
                <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('businessCommunication')}</Link></li>
                <li><Link href="/#services" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('softSkillsMastery')}</Link></li>
                <li><Link href="/placement-test" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('placementAssessment')}</Link></li>
              </ul>
            </div>

            {/* Column 3: Corporate Identity */}
            <div>
              <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>{t('corporate')}</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem' }}>
                <li><Link href="/#about" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('aboutAcademy')}</Link></li>
                <li><Link href="/#team" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>{t('leadershipTeam')}</Link></li>
              </ul>
            </div>

            {/* Column 4: Connectivity */}
            <div>
              <h5 style={{ color: 'var(--accent-gold)', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px' }}>{t('connectivity')}</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.2rem', opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>
                <li>{settings?.contactEmail || 'hello@linguaplanet.eg'}</li>
                <li>+20 127 006 8237</li>
                <li>{t('cairoEgypt')}</li>
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
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.2, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <p>© 2026 LINGUAPLANET ACADEMY. {t('allRights').toUpperCase()}</p>
            <div style={{ display: 'flex', gap: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>{t('privacyPolicy').toUpperCase()}</Link>
              <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>{t('termsOfService').toUpperCase()}</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
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
    </main>
  );
}
