'use client';

import { useState, useEffect } from 'react';
import { db, Lead, SiteSettings } from '@/data/db';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminDashboard() {
  const { isRtl } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('analytics');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    id: '1',
    heroHeadlineEn: '',
    heroHeadlineAr: '',
    heroSubheadlineEn: '',
    heroSubheadlineAr: '',
    whatsappNumber: '',
    contactEmail: '',
    updatedAt: new Date()
  });

  useEffect(() => {
    const initData = async () => {
      if (isAuthenticated) {
        try {
          const [l, s] = await Promise.all([db.getLeads(), db.getSettings()]);
          setLeads(l || []);
          setSettings(s);
        } catch (error) {
          console.error("Dashboard failed to initialize:", error);
        }
      }
    };
    initData();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const exportLeadsToCSV = () => {
    const headers = ['Name', 'Email', 'Score', 'Total Questions', 'Level', 'Date'];
    const rows = leads.map(l => [l.name, l.email, l.score, l.totalQuestions, l.level, l.date]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "academy_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.saveSettings(settings);
    alert('Settings saved successfully!');
  };

  if (!isAuthenticated) {
    return (
      <main className="marble-pattern" style={{ minHeight: '100vh', background: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form className="glass-dark" style={{ padding: '4rem', width: '100%', maxWidth: '450px', borderRadius: '32px', textAlign: 'center' }} onSubmit={handleLogin}>
          <div style={{ width: '60px', height: '60px', background: 'var(--accent-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <i className="fa-solid fa-lock" style={{ color: 'var(--primary-navy)', fontSize: '1.5rem' }}></i>
          </div>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '2rem', fontFamily: 'var(--font-serif)' }}>Admin Access</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontSize: '0.9rem', letterSpacing: '1px' }}>Enter your security credential to enter the portal</p>
          
          <input 
            type="password" 
            placeholder="SECURITY PASSWORD" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '1.2rem',
              marginBottom: '2rem',
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center',
              letterSpacing: '4px',
              fontSize: '0.9rem'
            }}
          />
          <button type="submit" className="btn-master btn-gold" style={{ width: '100%', justifyContent: 'center' }}>UNLOCK PORTAL</button>
        </form>
      </main>
    );
  }

  return (
    <main className="marble-pattern" style={{ display: 'flex', minHeight: '100vh', background: 'var(--marble-white)' }}>
      <Navbar />
      
      {/* Sidebar */}
      <div style={{ 
        width: '320px', 
        background: 'var(--primary-navy)', 
        color: 'white', 
        padding: '10rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '20px 0 60px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div style={{ marginBottom: '4rem' }}>
          <span style={{ color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '4px' }}>ADMINISTRATION</span>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>Elite Control</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'analytics', label: 'ANALYTICS', icon: 'fa-chart-line' },
            { id: 'leads', label: 'STUDENT LEADS', icon: 'fa-users' },
            { id: 'content', label: 'CONTENT MANAGER', icon: 'fa-pen-to-square' },
            { id: 'test', label: 'TEST MANAGER', icon: 'fa-list-check' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              style={{ 
                background: activeTab === item.id ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                color: activeTab === item.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.6)',
                border: 'none',
                padding: '1.2rem 1.5rem',
                textAlign: 'left',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: '1rem', width: '20px' }}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ 
            marginTop: 'auto', 
            background: 'none', 
            border: '1px solid rgba(255,255,255,0.1)', 
            color: 'rgba(255,255,255,0.4)',
            padding: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '2px'
          }}
        >
          LOGOUT SESSION
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '10rem 4rem 4rem', position: 'relative' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', textTransform: 'capitalize' }}>{activeTab}</h1>
            <div style={{ height: '3px', width: '60px', background: 'var(--accent-gold)', marginTop: '1rem' }}></div>
          </div>
          {activeTab === 'leads' && (
            <button className="btn-master btn-gold" style={{ padding: '0.8rem 2rem', fontSize: '0.7rem' }} onClick={exportLeadsToCSV}>
              EXPORT DATA <i className="fa-solid fa-download" style={{ marginLeft: '1rem' }}></i>
            </button>
          )}
        </header>

        <div className="reveal">
          {activeTab === 'leads' && (
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', overflowX: 'auto', background: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--soft-gray)' }}>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '2px' }}>STUDENT NAME</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '2px' }}>EMAIL</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '2px' }}>SCORE</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '2px' }}>LEVEL</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '2px' }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '5rem', opacity: 0.3 }}>No student data available.</td></tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} style={{ background: 'var(--soft-gray)', transition: 'all 0.3s ease' }} className="hover-lift">
                        <td style={{ padding: '1.5rem', fontWeight: 700, borderRadius: '12px 0 0 12px' }}>{lead.name}</td>
                        <td style={{ padding: '1.5rem', opacity: 0.6 }}>{lead.email}</td>
                        <td style={{ padding: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{lead.score}/{lead.totalQuestions}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ padding: '0.4rem 1rem', background: 'var(--primary-navy)', color: 'white', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800 }}>{lead.level}</span>
                        </td>
                        <td style={{ padding: '1.5rem', opacity: 0.4, fontSize: '0.8rem', borderRadius: '0 12px 12px 0' }}>{lead.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <div className="card-premium" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800, letterSpacing: '2px' }}>TOTAL STUDENTS</span>
                <p style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary-navy)', fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>{leads.length}</p>
                <div style={{ width: '40px', height: '2px', background: 'var(--accent-gold)', margin: '0 auto' }}></div>
              </div>
              <div className="card-premium" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800, letterSpacing: '2px' }}>AVERAGE PROFICIENCY</span>
                <p className="gold-text" style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>
                  {leads.length > 0 ? (leads.reduce((acc, curr) => acc + curr.score, 0) / leads.length).toFixed(1) : 0}
                </p>
                <div style={{ width: '40px', height: '2px', background: 'var(--primary-navy)', margin: '0 auto' }}></div>
              </div>
              <div className="card-premium" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800, letterSpacing: '2px' }}>EXECUTIVE TRACKS</span>
                <p style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent-blue)', fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>
                  {leads.filter(l => l.level === 'C1' || l.level === 'C2').length}
                </p>
                <div style={{ width: '40px', height: '2px', background: 'var(--accent-gold)', margin: '0 auto' }}></div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <form onSubmit={handleSettingsSave} className="glass-card" style={{ padding: '4rem', background: 'white', borderRadius: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '3rem' }}>
                {/* English Content */}
                <div>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>GLOBAL (EN)</h4>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>HERO HEADLINE</label>
                    <input 
                      type="text" 
                      value={settings.heroHeadlineEn}
                      onChange={(e) => setSettings({ ...settings, heroHeadlineEn: e.target.value })}
                      style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)', fontWeight: 600 }} 
                    />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>HERO SUBHEADLINE</label>
                    <textarea 
                      value={settings.heroSubheadlineEn}
                      onChange={(e) => setSettings({ ...settings, heroSubheadlineEn: e.target.value })}
                      style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)', height: '150px', lineHeight: 1.6 }} 
                    />
                  </div>
                </div>

                {/* Arabic Content */}
                <div style={{ direction: 'rtl' }}>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>المحتوى العربي (AR)</h4>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>العنوان الرئيسي</label>
                    <input 
                      type="text" 
                      value={settings.heroHeadlineAr}
                      onChange={(e) => setSettings({ ...settings, heroHeadlineAr: e.target.value })}
                      style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)', fontWeight: 600, fontFamily: 'var(--font-sans)' }} 
                    />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>العنوان الفرعي</label>
                    <textarea 
                      value={settings.heroSubheadlineAr}
                      onChange={(e) => setSettings({ ...settings, heroSubheadlineAr: e.target.value })}
                      style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)', height: '150px', lineHeight: 1.8 }} 
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>WHATSAPP HOTLINE</label>
                  <input 
                    type="text" 
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>SUPPORT EMAIL</label>
                  <input 
                    type="email" 
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)' }} 
                  />
                </div>
              </div>
              <button type="submit" className="btn-master btn-gold" style={{ width: '100%', justifyContent: 'center' }}>PUBLISH ALL CHANGES</button>
            </form>
          )}

          {activeTab === 'test' && (
            <div className="glass-card" style={{ padding: '6rem 3rem', textAlign: 'center', background: 'white', borderRadius: '32px' }}>
              <i className="fa-solid fa-microchip" style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '2rem' }}></i>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test Manager Pro</h3>
              <p style={{ opacity: 0.5, maxWidth: '500px', margin: '0 auto' }}>Advanced question management and AI-powered evaluation tools are being synchronized. You can still modify questions via <code>questions.ts</code>.</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          background: white !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
      `}</style>
    </main>
  );
}
