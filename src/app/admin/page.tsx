'use client';

import { useState, useEffect } from 'react';
import { db, Lead, SiteSettings } from '@/data/db';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

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
      // Note: db.getLeads needs to be updated to return the new columns, 
      // but for now we fetch directly to get writing_response
      const { data: rawLeads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      setLeads(rawLeads || []);
      setSettings(s);

      if (activeTab === 'test') {
        const { data: q } = await supabase.from('questions').select('*').order('part', { ascending: true });
        setQuestions(q || []);
      }

      if (activeTab === 'profiles') {
        const { data: p } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        setProfiles(p || []);
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
            { id: 'profiles', label: 'USER PROFILES', icon: 'fa-id-card' },
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
          {activeTab === 'test' && (
            <button className="btn-master btn-gold" onClick={() => {
              setCurrentQuestion({ question: '', options: ['', '', '', ''], correct_answer: '', part: 1, level: 'A1' });
              setIsEditingQuestion(true);
            }}>
              ADD QUESTION <i className="fa-solid fa-plus" style={{ marginLeft: '1rem' }}></i>
            </button>
          )}
        </header>

        <div className="reveal">
          {activeTab === 'leads' && (
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>STUDENT</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>SCORE</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>LEVEL</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} style={{ background: 'var(--soft-gray)' }} className="hover-lift">
                      <td style={{ padding: '1.5rem', borderRadius: '12px 0 0 12px' }}>
                        <div style={{ fontWeight: 800 }}>{lead.name}</div>
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
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                <div className="card-premium" style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>TOTAL ASSESSMENTS</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>{leads.length}</div>
                </div>
                <div className="card-premium" style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>HIGH ACHIEVERS (C1/C2)</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--accent-gold)' }}>
                    {leads.filter(l => l.level.includes('C')).length}
                  </div>
                </div>
                <div className="card-premium" style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>AVG SCORE %</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--accent-blue)' }}>
                    {leads.length > 0 ? Math.round((leads.reduce((a,b) => a + b.score, 0) / leads.reduce((a,b) => a + b.total_questions, 0)) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '4rem', background: 'white' }}>
                <h3 style={{ marginBottom: '3rem', fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Proficiency Distribution</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '300px', paddingBottom: '2rem' }}>
                  {['A1', 'A2', 'B1', 'B2', 'C1/C2'].map(lvl => {
                    const count = leads.filter(l => l.level === lvl).length;
                    const height = leads.length > 0 ? (count / leads.length) * 100 : 0;
                    return (
                      <div key={lvl} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.8rem' }}>{count}</div>
                        <div style={{ 
                          width: '100%', 
                          height: `${height}%`, 
                          background: 'var(--navy-gradient)', 
                          borderRadius: '8px 8px 0 0',
                          minHeight: '4px',
                          transition: 'height 1s ease'
                        }}></div>
                        <div style={{ fontWeight: 800, fontSize: '0.7rem', opacity: 0.4 }}>{lvl}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="glass-card" style={{ padding: '2rem', background: 'white' }}>
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

          {activeTab === 'profiles' && (
            <div className="glass-card" style={{ padding: '2rem', background: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="flex-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, padding: '2rem' }}>
          <div className="glass-card reveal" style={{ background: 'white', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '4rem', borderRadius: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
              <div>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '4px', fontSize: '0.7rem' }}>STUDENT DOSSIER</span>
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem' }}>{selectedLead.name}</h2>
                <p style={{ opacity: 0.5, marginTop: '0.5rem' }}>{selectedLead.email}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'var(--soft-gray)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
              <div className="card-premium">
                <h4 style={{ opacity: 0.4, fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>EVALUATION</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{selectedLead.level}</div>
                    <div style={{ opacity: 0.5 }}>CEFR Grade</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedLead.score} / {selectedLead.total_questions}</div>
                    <div style={{ opacity: 0.5 }}>Total Score</div>
                  </div>
                </div>
              </div>
              <div className="card-premium">
                <h4 style={{ opacity: 0.4, fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>STUDENT DATA</h4>
                <p><strong>Age Range:</strong> {selectedLead.age_range || 'Not specified'}</p>
                <p><strong>Date:</strong> {selectedLead.created_at.split('T')[0]}</p>
              </div>
            </div>

            <div style={{ marginBottom: '4rem' }}>
              <h4 style={{ opacity: 0.4, fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>WRITING ASSESSMENT RESPONSE</h4>
              <div style={{ background: 'var(--soft-gray)', padding: '2.5rem', borderRadius: '24px', lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                {selectedLead.writing_response || 'No writing response provided for this assessment.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href={`https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}`} className="btn-master btn-gold" style={{ flex: 1, justifyContent: 'center' }}>
                CONTACT VIA WHATSAPP
              </a>
              <a href={`mailto:${selectedLead.email}`} className="btn-master btn-navy" style={{ flex: 1, justifyContent: 'center', background: 'var(--primary-navy)', color: 'white' }}>
                SEND EMAIL
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Question Editor Modal */}
      {isEditingQuestion && (
        <div className="flex-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, padding: '2rem' }}>
          <div className="glass-card" style={{ background: 'white', width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>{currentQuestion.id ? 'Edit Question' : 'New Question'}</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <textarea 
                placeholder="Question Text" 
                value={currentQuestion.question}
                onChange={e => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--soft-gray)' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select value={currentQuestion.part} onChange={e => setCurrentQuestion({...currentQuestion, part: parseInt(e.target.value)})} style={{ padding: '1rem', borderRadius: '8px' }}>
                  <option value={1}>Part 1 (MCQ)</option>
                  <option value={2}>Part 2 (Advanced MCQ)</option>
                  <option value={3}>Part 3 (Writing)</option>
                </select>
                <select value={currentQuestion.level} onChange={e => setCurrentQuestion({...currentQuestion, level: e.target.value})} style={{ padding: '1rem', borderRadius: '8px' }}>
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              {currentQuestion.options?.map((opt, i) => (
                <input 
                  key={i}
                  placeholder={`Option ${i+1}`}
                  value={opt}
                  onChange={e => {
                    const newOpts = [...(currentQuestion.options || [])];
                    newOpts[i] = e.target.value;
                    setCurrentQuestion({...currentQuestion, options: newOpts});
                  }}
                  style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--soft-gray)' }}
                />
              ))}
              <input 
                placeholder="Correct Answer (Copy exact text)"
                value={currentQuestion.correct_answer}
                onChange={e => setCurrentQuestion({...currentQuestion, correct_answer: e.target.value})}
                style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-gold)' }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setIsEditingQuestion(false)} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--soft-gray)', cursor: 'pointer' }}>CANCEL</button>
                <button onClick={handleSaveQuestion} className="btn-master btn-gold" style={{ flex: 1, justifyContent: 'center' }}>SAVE QUESTION</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          background: white !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }
        .btn-navy:hover {
          background: var(--accent-blue) !important;
        }
      `}</style>
    </main>
  );
}
