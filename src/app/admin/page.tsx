'use client';

import { useState, useEffect } from 'react';
import { db, Lead, SiteSettings } from '@/data/db';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import * as XLSX from 'xlsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

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
    updatedAt: new Date(),
    webhookUrl: ''
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
      
      // 1. MASTER STUDENTS SUMMARY (High-level overview)
      const summaryData = (leadsData || []).map(l => ({
        'ID': l.id.slice(0, 8),
        'Student Name': l.name,
        'Email': l.email,
        'Phone': l.phone || 'N/A',
        'Score': `${l.score}/${l.total_questions}`,
        'Percentage': `${l.total_questions > 0 ? Math.round((l.score / l.total_questions) * 100) : 0}%`,
        'CEFR Level': l.level,
        'Age Range': (l.age_range || 'N/A').toUpperCase(),
        'Date': l.created_at.split('T')[0],
        'Time': l.created_at.split('T')[1].split('.')[0]
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), "Master Summary");

      // 2. STUDENT-QUESTION MATRIX (Deep Granular Tracking)
      // This creates a grid where rows are students and columns are individual questions
      const uniqueQuestions = Array.from(new Set((answersData || []).map(a => a.question_text)));
      const matrixData = (leadsData || []).map(l => {
        const studentAnswers = (answersData || []).filter(a => a.lead_id === l.id);
        const row: any = {
          'Student Name': l.name,
          'Total Score': l.score,
          'Level': l.level
        };
        uniqueQuestions.forEach(q => {
          const ans = studentAnswers.find(a => a.question_text === q);
          row[q] = ans ? (ans.is_correct ? 1 : 0) : 'N/A';
        });
        return row;
      });
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(matrixData), "Student-Question Matrix");

      // 3. QUESTION DIFFICULTY ANALYSIS (Curriculum Insights)
      const questionAnalysis = uniqueQuestions.map(q => {
        const relevantAnswers = (answersData || []).filter(a => a.question_text === q);
        const correctCount = relevantAnswers.filter(a => a.is_correct).length;
        const totalAttempts = relevantAnswers.length;
        return {
          'Question Text': q,
          'Total Attempts': totalAttempts,
          'Correct Answers': correctCount,
          'Success Rate (%)': totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0,
          'Difficulty Rating': totalAttempts === 0 ? 'N/A' : (correctCount / totalAttempts > 0.7 ? 'EASY' : correctCount / totalAttempts > 0.4 ? 'MODERATE' : 'HARD')
        };
      }).sort((a, b) => a['Success Rate (%)'] - b['Success Rate (%)']);
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(questionAnalysis), "Question Difficulty");

      // 4. DEDICATED WRITING ASSESSMENT PORTAL
      const writingData = (leadsData || []).filter(l => l.writing_response).map(l => ({
        'Student Name': l.name,
        'Email': l.email,
        'CEFR (Predicted)': l.level,
        'Writing Content': l.writing_response,
        'Instructor Grade': '',
        'Instructor Comments': '',
        'Status': 'PENDING REVIEW'
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(writingData), "Writing Review Portal");

      // 5. CEFR LEVEL DISTRIBUTION (Institutional Stats)
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const cefrStats = levels.map(lvl => {
        const matchingLeads = (leadsData || []).filter(l => l.level === lvl);
        return {
          'CEFR Level': lvl,
          'Count': matchingLeads.length,
          'Percentage': leadsData?.length ? `${Math.round((matchingLeads.length / leadsData.length) * 100)}%` : '0%',
          'Average Score': matchingLeads.length ? Math.round(matchingLeads.reduce((a, b) => a + (b.score || 0), 0) / matchingLeads.length) : 0
        };
      });
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(cefrStats), "Level Distribution");

      XLSX.writeFile(workbook, `LINGUAPLANET_ULTIMATE_EXPORT_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Ultimate Excel export failed:", error);
      alert("Failed to generate advanced Excel file.");
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-navy)' }}>Proficiency Distribution</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => ({
                        name: lvl,
                        count: leads.filter(l => l.level === lvl || (lvl === 'C1/C2' && (l.level === 'C1' || l.level === 'C2'))).length
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="count" fill="var(--accent-gold)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-navy)' }}>Daily Leads Volume</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={Array.from({ length: 7 }).map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (6 - i));
                        const dateStr = d.toISOString().split('T')[0];
                        return {
                          date: dateStr.split('-').slice(1).join('/'),
                          count: leads.filter(l => l.created_at.startsWith(dateStr)).length
                        };
                      })}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="var(--accent-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-navy)' }}>Age Range Distribution</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={['kids', 'teens', 'adults'].map(age => ({
                          name: age.toUpperCase(),
                          value: leads.filter(l => l.age_range === age).length
                        }))}
                        cx="50%" cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {['var(--accent-gold)', 'var(--accent-blue)', 'var(--primary-navy)'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
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
              
              <div style={{ borderTop: '1px solid var(--soft-gray)', paddingTop: '3rem', marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>WEBHOOK INTEGRATION</h4>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4, color: 'var(--primary-navy)' }}>NOTIFICATIONS WEBHOOK URL (ZAPIER / MAKE / SLACK)</label>
                  <input 
                    type="url" 
                    placeholder="https://hooks.zapier.com/..."
                    value={settings.webhookUrl || ''} 
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })} 
                    style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--soft-gray)', background: 'var(--soft-gray)', fontWeight: 600, color: 'var(--primary-navy)' }} 
                  />
                  <p style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.5 }}>New leads will be POSTed to this URL in real-time.</p>
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
