'use client';

import { useState, useEffect } from 'react';
import { db, Lead, SiteSettings } from '@/data/db';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    id: '',
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
      <div className="container flex-center" style={{ minHeight: '100vh' }}>
        <form className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }} onSubmit={handleLogin}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '4px',
              border: '1px solid var(--gray-light)'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: 'var(--accent-blue)', color: 'var(--white)', padding: '2rem' }}>
        <h2 style={{ marginBottom: '3rem', color: 'var(--accent-gold)' }}>LINGUAPLANET ADMIN</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={() => setActiveTab('analytics')} style={{ color: activeTab === 'analytics' ? 'var(--accent-gold)' : 'var(--white)', textAlign: 'left' }}>Analytics</button>
          <button onClick={() => setActiveTab('leads')} style={{ color: activeTab === 'leads' ? 'var(--accent-gold)' : 'var(--white)', textAlign: 'left' }}>Student Leads</button>
          <button onClick={() => setActiveTab('content')} style={{ color: activeTab === 'content' ? 'var(--accent-gold)' : 'var(--white)', textAlign: 'left' }}>Content Manager</button>
          <button onClick={() => setActiveTab('test')} style={{ color: activeTab === 'test' ? 'var(--accent-gold)' : 'var(--white)', textAlign: 'left' }}>Test Manager</button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem', backgroundColor: '#f0f2f5' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ textTransform: 'capitalize' }}>{activeTab}</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {activeTab === 'leads' && (
              <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={exportLeadsToCSV}>Export CSV</button>
            )}
            <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setIsAuthenticated(false)}>Logout</button>
          </div>
        </header>

        <div className="glass" style={{ padding: '2rem', backgroundColor: 'var(--white)' }}>
          {activeTab === 'leads' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-light)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Score</th>
                    <th style={{ padding: '1rem' }}>Level</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No leads yet.</td></tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                        <td style={{ padding: '1rem' }}>{lead.name}</td>
                        <td style={{ padding: '1rem' }}>{lead.email}</td>
                        <td style={{ padding: '1rem' }}>{lead.score}/{lead.totalQuestions}</td>
                        <td style={{ padding: '1rem' }}>{lead.level}</td>
                        <td style={{ padding: '1rem' }}>{lead.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--gray-light)', borderRadius: '8px' }}>
                <h3>Total Leads</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{leads.length}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--gray-light)', borderRadius: '8px' }}>
                <h3>Avg Score</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                  {leads.length > 0 ? (leads.reduce((acc, curr) => acc + curr.score, 0) / leads.length).toFixed(1) : 0}
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--gray-light)', borderRadius: '8px' }}>
                <h3>High Achievers</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'green' }}>
                  {leads.filter(l => l.level === 'C1' || l.level === 'C2').length}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <form onSubmit={handleSettingsSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
                {/* English Content */}
                <div>
                  <h4 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>English Content</h4>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hero Headline (EN)</label>
                    <input 
                      type="text" 
                      value={settings.heroHeadlineEn}
                      onChange={(e) => setSettings({ ...settings, heroHeadlineEn: e.target.value })}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--gray-light)' }} 
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hero Subheadline (EN)</label>
                    <textarea 
                      value={settings.heroSubheadlineEn}
                      onChange={(e) => setSettings({ ...settings, heroSubheadlineEn: e.target.value })}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--gray-light)', height: '100px' }} 
                    />
                  </div>
                </div>

                {/* Arabic Content */}
                <div style={{ direction: 'rtl' }}>
                  <h4 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>المحتوى العربي</h4>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>العنوان الرئيسي (AR)</label>
                    <input 
                      type="text" 
                      value={settings.heroHeadlineAr}
                      onChange={(e) => setSettings({ ...settings, heroHeadlineAr: e.target.value })}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--gray-light)' }} 
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>العنوان الفرعي (AR)</label>
                    <textarea 
                      value={settings.heroSubheadlineAr}
                      onChange={(e) => setSettings({ ...settings, heroSubheadlineAr: e.target.value })}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--gray-light)', height: '100px' }} 
                    />
                  </div>
                </div>
              </div>

              <hr style={{ margin: '2rem 0', opacity: 0.1 }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--gray-light)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contact Email</label>
                  <input 
                    type="email" 
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--gray-light)' }} 
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save All Changes</button>
            </form>
          )}

          {activeTab === 'test' && (
            <p>Question management UI is coming in the next update. You can currently edit questions directly in <code>src/data/questions.ts</code>.</p>
          )}
        </div>
      </div>
    </div>
  );
}
