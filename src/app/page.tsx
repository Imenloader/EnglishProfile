'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>
              <i className="fa-solid fa-circle-dot" style={{ [isRtl ? 'marginLeft' : 'marginRight']: '0.5rem' }}></i> {t('trustedBy')}
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)' }}>{t('companiesTrust')}</h2>
          </div>
          
          <div className="marquee-wrap" style={{ marginTop: '2rem' }}>
            <div className="marquee-track">
              {(() => {
                const partners = [
                  { name: 'Etisalat International', logo: '/images/partners/etisalat.jpg' },
                  { name: 'Alameda', logo: '/images/partners/alameda.jpg' },
                  { name: 'Sonesta', logo: '/images/partners/sonesta.jpg' },
                  { name: 'Suez', logo: '/images/partners/suez.jpg' },
                  { name: 'Al-Azhar Graduates', logo: '/images/partners/alazhar.jpg' },
                  { name: 'Tamayyoz', logo: '/images/partners/tamayyoz.jpg' },
                  { name: 'GHC', logo: '/images/partners/ghc.jpg' }
                ];
                // Multiply for infinite marquee
                const triplePartners = [...partners, ...partners, ...partners];
                
                return triplePartners.map((partner, i) => (
                  <div key={`${partner.name}-${i}`} className="glass-card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '220px',
                    height: '140px',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    flexShrink: 0,
                    transition: 'all 0.4s ease',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    {partner.logo ? (
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          objectFit: 'contain'
                        }} 
                      />
                    ) : (
                      <span style={{ 
                        fontWeight: 800, 
                        fontSize: '0.9rem', 
                        color: 'var(--text-color)', 
                        textAlign: 'center',
                        fontFamily: 'var(--font-serif)',
                        opacity: 0.8
                      }}>{partner.name}</span>
                    )}
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
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '3rem', color: 'var(--text-color)' }} dangerouslySetInnerHTML={{ __html: t('aboutHeadline') }}></h2>
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
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.5rem' }}>{item.title}</h4>
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

      {/* 03: Why Choose Us (Why Linguaplanet?) */}
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
                <div style={{ width: '60px', height: '60px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                  <i className={`fa-solid ${node.icon}`} style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>{node.title}</h3>
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
            <div className="glass" style={{ padding: '4.5rem', borderRadius: '40px', borderLeft: isRtl ? 'none' : '8px solid var(--accent-gold)', borderRight: isRtl ? '8px solid var(--accent-gold)' : 'none' }} data-aos="fade-right">
              <div className="flex items-center gap-4 mb-6">
                <div style={{ width: '50px', height: '50px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }}></i>
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
                <div style={{ width: '50px', height: '50px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <p style={{ opacity: 0.9, fontWeight: 700, color: 'var(--text-color)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                {t('safeHandsDesc3')}
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* 04: Academic Programs (Services) - Detailed Snippet Data */}
      <section id="services" style={{ padding: '10rem 0', background: 'var(--bg-color-alt)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '6rem' }}>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px' }}>{t('academicTracks')}</span>
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
                <div style={{ fontSize: '2.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                  <i className={`fa-solid ${program.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-color)' }}>{program.title}</h3>
                <p style={{ color: 'var(--text-color-muted)', lineHeight: 1.7 }}>{program.text}</p>
                <Link href="#contact" style={{ 
                  display: 'inline-block', 
                  marginTop: '2rem', 
                  color: 'var(--accent-gold)', 
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
              { name: t('memberMaged'), role: t('roleGM'), img: '/images/GM-new.png' },
              { name: t('memberRaafat'), role: t('roleRecruitment'), img: '/images/Recruitment-new.png' },
              { name: t('memberIbrahim'), role: t('roleMarketing'), img: '/images/Marketing-new.png' }
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
                  background: 'var(--bg-color-alt)',
                  position: 'relative'
                }}>
                  <Image src={member.img} alt={member.name} width={180} height={180} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-color)' }}>{member.name}</h4>
                <p style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '1px', marginTop: '0.5rem', textTransform: 'uppercase' }}>{member.role}</p>
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
          {/* Desktop Trajectory */}
          <div className="desktop-trajectory" data-aos="zoom-in" style={{ padding: '6rem 0' }}>
            <div style={{ minWidth: '900px', position: 'relative' }}>
              {/* Connecting Gold Line */}
              <div style={{
                position: 'absolute',
                top: '30px', /* Exactly in the vertical middle of the 60px circles! */
                left: '8%',
                right: '8%',
                height: '4px',
                background: 'linear-gradient(90deg, var(--accent-gold) 0%, rgba(197, 160, 89, 0.2) 100%)',
                borderRadius: '2px',
                zIndex: 1
              }}></div>

              {/* Flex Container for Nodes */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
                padding: '0 5%'
              }}>
                {[
                  { id: 'A1', label: t('milestoneA1'), desc: t('milestoneA1Desc') },
                  { id: 'A2', label: t('milestoneA2'), desc: t('milestoneA2Desc') },
                  { id: 'B1', label: t('milestoneB1'), desc: t('milestoneB1Desc') },
                  { id: 'B1+', label: t('milestoneB1Plus'), desc: t('milestoneB1PlusDesc') },
                  { id: 'B2', label: t('milestoneB2'), desc: t('milestoneB2Desc') },
                  { id: 'C1', label: t('milestoneC1'), desc: t('milestoneC1Desc'), star: true }
                ].map((m) => (
                  <div key={m.id} className="milestone-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '140px' }}>
                    <div className="milestone-circle" style={{
                      width: '60px',
                      height: '60px',
                      background: 'var(--primary-navy)',
                      border: '2px solid var(--accent-gold)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: 'white',
                      cursor: 'pointer',
                      boxShadow: '0 0 20px rgba(197, 160, 89, 0.2)',
                      transition: 'all 0.4s ease'
                    }}>
                      {m.star ? <i className="fa-solid fa-star" style={{ color: 'var(--accent-gold)' }}></i> : m.id}
                    </div>
                    {/* Level Label & Desc below */}
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{m.id}</h4>
                      <span style={{ color: 'white', fontSize: '0.85rem', opacity: 0.9, display: 'block', fontWeight: 600 }}>{m.label}</span>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '0.5rem', lineHeight: 1.4 }}>{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                { id: 'B1+', label: t('milestoneB1Plus'), desc: t('milestoneB1PlusDesc') },
                { id: 'B2', label: t('milestoneB2'), desc: t('milestoneB2Desc') },
                { id: 'C1', label: t('milestoneC1'), desc: t('milestoneC1Desc'), star: true }
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

      <Footer />

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
