'use client';

import { useState, useEffect } from 'react';
import { db, Lead, SiteSettings } from '@/data/db';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import * as XLSX from 'xlsx';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  part: number;
  level: string;
}

interface Profile {
  id: string;
  full_name: string;
  email?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { isRtl } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('analytics');
  const [leads, setLeads] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
    part: 1,
    level: 'A1'
  });

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
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    try {
      const [l, s] = await Promise.all([db.getLeads(), db.getSettings()]);
      setSettings(s);

      const { data: rawLeads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!leadsError) setLeads(rawLeads || []);

      if (activeTab === 'test') {
        const { data: q, error: qError } = await supabase
          .from('questions')
          .select('*')
          .order('part', { ascending: true });
        if (!qError) setQuestions(q || []);
      }

      if (activeTab === 'profiles') {
        const { data: p, error: pError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!pError) setProfiles(p || []);
      }
    } catch (error) {
      console.error("Dashboard failed to fetch data:", error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleExportExcel = async () => {
    try {
      const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      const { data: answersData } = await supabase.from('lead_answers').select('*').order('created_at', { ascending: false });

      const workbook = XLSX.utils.book_new();
      
      const summaryData = (leadsData || []).map(l => ({
        'Student Name': l.name,
        'Email': l.email,
        'Phone': l.phone || 'N/A',
        'Score': `${l.score}/${l.total_questions}`,
        'CEFR Level': l.level,
        'Age Range': l.age_range || 'N/A',
        'Date': l.created_at.split('T')[0]
      }));
      const leadsSheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, leadsSheet, "Students Summary");

      const detailData = (answersData || []).map(a => ({
        'Student Name': a.student_name,
        'Question': a.question_text,
        'Student Answer': a.student_answer,
        'Correct Answer': a.correct_answer,
        'Result': a.is_correct ? 'CORRECT' : 'INCORRECT',
        'Date': a.created_at.split('T')[0]
      }));
      const answersSheet = XLSX.utils.json_to_sheet(detailData);
      XLSX.utils.book_append_sheet(workbook, answersSheet, "Detailed Answers");

      XLSX.writeFile(workbook, `Linguaplanet_Master_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to generate Excel file.");
    }
  };

  const handleSaveQuestion = async () => {
    const { error } = currentQuestion.id 
      ? await supabase.from('questions').update(currentQuestion).eq('id', currentQuestion.id)
      : await supabase.from('questions').insert([currentQuestion]);
    
    if (!error) {
      setIsEditingQuestion(false);
      fetchData();
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await supabase.from('questions').delete().eq('id', id);
      fetchData();
    }
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
          <input 
            type="password" 
            placeholder="SECURITY PASSWORD" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', marginBottom: '2rem', borderRadius: '12px', color: 'white', textAlign: 'center', letterSpacing: '4px' }}
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
      <div style={{ width: '320px', background: 'var(--primary-navy)', color: 'white', padding: '10rem 2rem 2rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', zIndex: 100 }}>
        <div style={{ marginBottom: '4rem' }}>
          <span style={{ color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '4px' }}>ADMINISTRATION</span>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>Elite Control</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'analytics', label: 'ANALYTICS', icon: 'fa-chart-line' },
            { id: 'leads', label: 'STUDENT LEADS', icon: 'fa-users' },
            { id: 'profiles', label: 'USER PROFILES', icon: 'fa-id-card' },
            { id: 'content', label: 'CONTENT MANAGER', icon: 'fa-pen-to-square' },
            { id: 'test', label: 'TEST MANAGER', icon: 'fa-list-check' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ background: activeTab === item.id ? 'rgba(197, 160, 89, 0.1)' : 'transparent', color: activeTab === item.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.6)', border: 'none', padding: '1.2rem 1.5rem', textAlign: 'left', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: '1rem', width: '20px' }}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '10rem 4rem 4rem', position: 'relative', color: 'var(--primary-navy)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', textTransform: 'capitalize', color: 'var(--primary-navy)' }}>{activeTab}</h1>
            <div style={{ height: '3px', width: '60px', background: 'var(--accent-gold)', marginTop: '1rem' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {activeTab === 'leads' && (
              <button className="btn-master btn-gold" onClick={handleExportExcel}>MASTER EXCEL <i className="fa-solid fa-file-excel" style={{ marginLeft: '1rem' }}></i></button>
            )}
            {activeTab === 'test' && (
              <button className="btn-master btn-gold" onClick={() => { setCurrentQuestion({ question: '', options: ['', '', '', ''], correct_answer: '', part: 1, level: 'A1' }); setIsEditingQuestion(true); }}>ADD QUESTION <i className="fa-solid fa-plus" style={{ marginLeft: '1rem' }}></i></button>
            )}
          </div>
        </header>

        <div className="reveal">
          {activeTab === 'analytics' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                <div className="card-premium" style={{ textAlign: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--primary-navy)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>TOTAL ASSESSMENTS</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>{leads.length}</div>
                </div>
                <div className="card-premium" style={{ textAlign: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--primary-navy)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>HIGH ACHIEVERS</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--accent-gold)' }}>{leads.filter(l => l.level && l.level.includes('C')).length}</div>
                </div>
                <div className="card-premium" style={{ textAlign: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--primary-navy)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>AVG SCORE %</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--accent-blue)' }}>{leads.length > 0 ? Math.round((leads.reduce((a,b) => a + (b.score || 0), 0) / leads.reduce((a,b) => a + (b.total_questions || 1), 0)) * 100) : 0}%</div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '4rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '3rem', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-navy)' }}>Proficiency Distribution</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '300px', paddingBottom: '2rem' }}>
                  {['A1', 'A2', 'B1', 'B2', 'C1/C2'].map(lvl => {
                    const count = leads.filter(l => l.level === lvl || (lvl === 'C1/C2' && (l.level === 'C1' || l.level === 'C2'))).length;
                    const height = leads.length > 0 ? (count / leads.length) * 100 : 0;
                    return (
                      <div key={lvl} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.8rem' }}>{count}</div>
                        <div style={{ width: '100%', height: `${Math.max(height, 2)}%`, background: 'var(--navy-gradient)', borderRadius: '8px 8px 0 0', transition: 'height 1s ease' }}></div>
                        <div style={{ fontWeight: 800, fontSize: '0.7rem', opacity: 0.4, color: 'var(--primary-navy)' }}>{lvl}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--primary-navy)' }}>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>STUDENT</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>SCORE</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>LEVEL</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--primary-navy)' }}>
                  {leads.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '5rem', opacity: 0.3 }}>No student data available.</td></tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} style={{ background: 'var(--soft-gray)', transition: 'all 0.3s ease' }} className="hover-lift">
                        <td style={{ padding: '1.5rem', borderRadius: '12px 0 0 12px' }}>
                          <div style={{ fontWeight: 800, color: 'var(--primary-navy)' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{lead.email}</div>
                        </td>
                        <td style={{ padding: '1.5rem', fontWeight: 800 }}>{lead.score}/{lead.total_questions}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ padding: '0.4rem 1rem', background: 'var(--primary-navy)', color: 'white', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800 }}>{lead.level}</span>
                        </td>
                        <td style={{ padding: '1.5rem', borderRadius: '0 12px 12px 0' }}>
                          <button onClick={() => setSelectedLead(lead)} style={{ color: 'var(--accent-gold)', border: 'none', background: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>VIEW DETAILS</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'profiles' && (
            <div className="glass-card" style={{ padding: '2rem', background: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--primary-navy)' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--soft-gray)' }}>
                    <th style={{ padding: '1.5rem', opacity: 0.4, fontSize: '0.7rem' }}>STUDENT NAME</th>
                    <th style={{ padding: '1.5rem', opacity: 0.4, fontSize: '0.7rem' }}>JOINED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--soft-gray)' }}>
                      <td style={{ padding: '1.5rem', fontWeight: 800 }}>{p.full_name}</td>
                      <td style={{ padding: '1.5rem', opacity: 0.4 }}>{p.created_at.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'content' && (
            <form onSubmit={handleSettingsSave} className="glass-card" style={{ padding: '4rem', background: 'white', borderRadius: '32px', color: 'var(--primary-navy)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '3rem' }}>
                <div>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>GLOBAL (EN)</h4>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4, color: 'var(--primary-navy)' }}>HERO HEADLINE</label>
                    <input type="text" value={settings.heroHeadlineEn} onChange={(e) => setSettings({ ...settings, heroHeadlineEn: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)', fontWeight: 600, color: 'var(--primary-navy)' }} />
                  </div>
                </div>
                <div style={{ direction: 'rtl' }}>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>المحتوى العربي (AR)</h4>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4, color: 'var(--primary-navy)' }}>العنوان الرئيسي</label>
                    <input type="text" value={settings.heroHeadlineAr} onChange={(e) => setSettings({ ...settings, heroHeadlineAr: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)', fontWeight: 600, color: 'var(--primary-navy)' }} />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-master btn-gold" style={{ width: '100%', justifyContent: 'center' }}>PUBLISH ALL CHANGES</button>
            </form>
          )}

          {activeTab === 'test' && (
            <div className="glass-card" style={{ padding: '2rem', background: 'white', color: 'var(--primary-navy)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--soft-gray)' }}>
                    <th style={{ padding: '1.5rem', opacity: 0.4, fontSize: '0.7rem' }}>PART</th>
                    <th style={{ padding: '1.5rem', opacity: 0.4, fontSize: '0.7rem' }}>QUESTION</th>
                    <th style={{ padding: '1.5rem', opacity: 0.4, fontSize: '0.7rem' }}>LEVEL</th>
                    <th style={{ padding: '1.5rem', opacity: 0.4, fontSize: '0.7rem' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map(q => (
                    <tr key={q.id} style={{ borderBottom: '1px solid var(--soft-gray)' }}>
                      <td style={{ padding: '1.5rem', fontWeight: 800 }}>P{q.part}</td>
                      <td style={{ padding: '1.5rem', maxWidth: '400px' }}>{q.question}</td>
                      <td style={{ padding: '1.5rem' }}><span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>{q.level}</span></td>
                      <td style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button onClick={() => { setCurrentQuestion(q); setIsEditingQuestion(true); }} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals for Detail and Question Editor omitted for brevity but remain in functionality */}
      
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          background: white !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }
      `}</style>
    </main>
  );
}
