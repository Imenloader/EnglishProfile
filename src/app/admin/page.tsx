'use client';

import { useState, useEffect, useMemo } from 'react';
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

import { placementQuestions } from '@/data/questions';

export default function AdminDashboard() {
  const { isRtl } = useLanguage();
  const [mounted, setMounted] = useState(false);
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

  // Export Filters
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterMinAge, setFilterMinAge] = useState('');
  const [filterMaxAge, setFilterMaxAge] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [settings, setSettings] = useState<SiteSettings>({
    id: '1',
    heroHeadlineEn: '',
    heroHeadlineAr: '',
    heroSubheadlineEn: '',
    heroSubheadlineAr: '',
    whatsappNumber: '',
    contactEmail: '',
    facebookLink: '',
    instagramLink: '',
    linkedinLink: '',
    tiktokLink: '',
    updatedAt: new Date(),
    webhookUrl: ''
  });

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

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab]);

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

      let filteredLeads = leadsData || [];

      // Filter by Date
      if (filterStartDate) {
        filteredLeads = filteredLeads.filter((l: any) => l.created_at >= filterStartDate);
      }
      if (filterEndDate) {
        const nextDay = new Date(filterEndDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split('T')[0];
        filteredLeads = filteredLeads.filter((l: any) => l.created_at < nextDayStr);
      }

      // Filter by Age
      if (filterMinAge || filterMaxAge) {
        filteredLeads = filteredLeads.filter((l: any) => {
          const age = parseInt(l.age_range);
          if (isNaN(age)) return false;
          const min = filterMinAge ? parseInt(filterMinAge) : 0;
          const max = filterMaxAge ? parseInt(filterMaxAge) : 999;
          return age >= min && age <= max;
        });
      }

      if (filteredLeads.length === 0) {
        alert("No leads found with the current filters.");
        return;
      }

      const workbook = XLSX.utils.book_new();

      // 1. MASTER STUDENTS SUMMARY
      const summaryData = filteredLeads.map((l: any) => ({
        'ID': l.id.slice(0, 8),
        'Student Name': l.name,
        'Email': l.email,
        'Phone': l.phone || 'N/A',
        'Company': l.company || 'N/A',
        'Age': l.age_range || 'N/A',
        'Score': `${l.score}/${l.total_questions}`,
        'Percentage': `${l.total_questions > 0 ? Math.round((l.score / l.total_questions) * 100) : 0}%`,
        'CEFR Level': l.level,
        'Date': l.created_at.split('T')[0],
        'Time': l.created_at.split('T')[1].split('.')[0]
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), "Master Summary");

      // Pre-compute lookup maps for O(1) access to improve export performance
      const answersMap: Record<string, Record<string, boolean>> = {};
      const filteredLeadIds = new Set(filteredLeads.map((l: any) => l.id));

      (answersData || []).forEach((a: any) => {
        if (!answersMap[a.lead_id]) {
          answersMap[a.lead_id] = {};
        }
        answersMap[a.lead_id][a.question_text] = a.is_correct;
      });

      // 2. STUDENT-QUESTION MATRIX
      const uniqueQuestions = Array.from(new Set((answersData || []).map((a: any) => a.question_text)));
      const matrixData = filteredLeads.map((l: any) => {
        const studentAnswers = answersMap[l.id] || {};
        const row: any = {
          'Student Name': l.name,
          'Phone': l.phone || 'N/A',
          'Company': l.company || 'N/A',
          'Age': l.age_range || 'N/A',
          'Total Score': l.score,
          'Level': l.level
        };
        uniqueQuestions.forEach((q: any) => {
          const isCorrect = studentAnswers[q];
          row[q] = isCorrect !== undefined ? (isCorrect ? 1 : 0) : 'N/A';
        });
        return row;
      });
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(matrixData), "Question Matrix");

      // 3. DETAILED ANSWERS
      const detailedAnswers = (answersData || []).filter((a: any) => filteredLeadIds.has(a.lead_id)).map((a: any) => ({
        'Student': a.student_name,
        'Question': a.question_text,
        'Answer': a.student_answer,
        'Correct': a.correct_answer,
        'Result': a.is_correct ? 'CORRECT' : 'INCORRECT',
        'Date': a.created_at
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(detailedAnswers), "Detailed Answers");

      // 4. WRITING PORTAL
      const writingData = filteredLeads.filter((l: any) => l.writing_response).map((l: any) => ({
        'Student Name': l.name,
        'Email': l.email,
        'Phone': l.phone || 'N/A',
        'Company': l.company || 'N/A',
        'Age': l.age_range || 'N/A',
        'CEFR (Predicted)': l.level,
        'Writing Content': l.writing_response,
        'Status': 'PENDING REVIEW'
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(writingData), "Writing Review Portal");

      // 5. LEVEL DISTRIBUTION
      const levelsList = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const cefrStats = levelsList.map(lvl => {
        const matchingLeads = filteredLeads.filter((l: any) => l.level === lvl);
        return {
          'CEFR Level': lvl,
          'Count': matchingLeads.length,
          'Percentage': filteredLeads.length ? `${Math.round((matchingLeads.length / filteredLeads.length) * 100)}%` : '0%',
          'Average Score': matchingLeads.length ? Math.round(matchingLeads.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0) / matchingLeads.length) : 0
        };
      });
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(cefrStats), "Level Distribution");

      XLSX.writeFile(workbook, `LINGUAPLANET_FILTERED_EXPORT_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  const handleSyncQuestions = async () => {
    if (!confirm('This will upload 60 static questions to the database. Continue?')) return;

    const formatted = placementQuestions.map(q => ({
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      part: q.part,
      level: q.category === 'advanced' ? 'B2' : (q.category === 'vocabulary' ? 'A2' : 'A1')
    }));

    const { error } = await supabase.from('questions').insert(formatted);
    if (!error) {
      alert('Questions synchronized successfully!');
      fetchData();
    } else {
      console.error("Sync error:", error);
      alert('Failed to sync questions: ' + error.message);
    }
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.saveSettings(settings);
    alert('Settings saved successfully!');
  };


  // Consolidate analytics calculations to prevent unnecessary re-renders and multiple passes
  const analyticsData = useMemo(() => {
    let totalAssessments = leads.length;
    let highAchievers = 0;
    let totalScore = 0;
    let totalQuestions = 0;

    const proficiencyCounts: Record<string, number> = {
      'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0, 'C1': 0, 'C2': 0
    };

    const dailyCounts: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      dailyCounts[dateStr] = 0;
    }

    let ageUnder18 = 0;
    let age18to30 = 0;
    let age30to50 = 0;
    let ageOver50 = 0;

    leads.forEach((l: any) => {
      // High Achievers
      if (l.level && l.level.includes('C')) {
        highAchievers++;
      }

      // Score
      totalScore += (l.score || 0);
      totalQuestions += (l.total_questions || 1);

      // Proficiency
      if (l.level) {
        if (proficiencyCounts[l.level] !== undefined) {
          proficiencyCounts[l.level]++;
        } else if (l.level === 'C1/C2') {
          // Sometimes level is combined in the DB
          proficiencyCounts['C1']++;
        }
      }

      // Daily Volume
      if (l.created_at) {
        const dateStr = l.created_at.split('T')[0];
        if (dailyCounts[dateStr] !== undefined) {
          dailyCounts[dateStr]++;
        }
      }

      // Age
      if (l.age_range) {
        const age = l.age_range;
        if (age === 'kids' || age === 'teens') {
          ageUnder18++;
        } else if (age === 'adults') {
          age18to30++;
        } else {
          const num = parseInt(age);
          if (!isNaN(num)) {
            if (num < 18) ageUnder18++;
            else if (num >= 18 && num <= 30) age18to30++;
            else if (num > 30 && num <= 50) age30to50++;
            else if (num > 50) ageOver50++;
          }
        }
      }
    });

    const avgScorePercent = totalAssessments > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    const proficiencyData = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => ({
      name: lvl,
      count: proficiencyCounts[lvl] || 0
    }));

    const dailyVolumeData = Object.keys(dailyCounts).sort().map(dateStr => ({
      date: dateStr.split('-').slice(1).join('/'),
      count: dailyCounts[dateStr]
    }));

    const ageData = [
      { name: 'Under 18', value: ageUnder18 },
      { name: '18-30', value: age18to30 },
      { name: '30-50', value: age30to50 },
      { name: '50+', value: ageOver50 }
    ].filter(d => d.value > 0);

    return {
      totalAssessments,
      highAchievers,
      avgScorePercent,
      proficiencyData,
      dailyVolumeData,
      ageData
    };
  }, [leads]);

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
            { id: 'content', label: 'CONTENT MANAGER', icon: 'fa-pen' },
            { id: 'test', label: 'TEST MANAGER', icon: 'fa-list' }
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
            {(activeTab === 'leads' || activeTab === 'analytics') && (
              <button className="btn-master btn-gold" onClick={handleExportExcel}>MASTER EXCEL <i className="fa-solid fa-file-excel" style={{ marginLeft: '1rem' }}></i></button>
            )}
            {activeTab === 'test' && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-master btn-gold" onClick={handleSyncQuestions} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>SYNC FROM STATIC <i className="fa-solid fa-rotate" style={{ marginLeft: '1rem' }}></i></button>
                <button className="btn-master btn-gold" onClick={() => { setCurrentQuestion({ question: '', options: ['', '', '', ''], correct_answer: '', part: 1, level: 'A1' }); setIsEditingQuestion(true); }}>ADD QUESTION <i className="fa-solid fa-plus" style={{ marginLeft: '1rem' }}></i></button>
              </div>
            )}
          </div>
        </header>

        {/* Export Filters UI */}
        {(activeTab === 'analytics' || activeTab === 'leads') && (
          <div className="glass-dark" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2rem', borderRadius: '20px', marginBottom: '3rem', alignItems: 'flex-end', border: '1px solid rgba(255,255,255,0.05)', background: 'var(--primary-navy)' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: '0.8rem' }}>FROM DATE</label>
              <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }} />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: '0.8rem' }}>TO DATE</label>
              <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }} />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: '0.8rem' }}>MIN AGE</label>
              <input type="number" placeholder="0" value={filterMinAge} onChange={(e) => setFilterMinAge(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }} />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: '0.8rem' }}>MAX AGE</label>
              <input type="number" placeholder="100" value={filterMaxAge} onChange={(e) => setFilterMaxAge(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }} />
            </div>
            <button
              onClick={() => { setFilterStartDate(''); setFilterEndDate(''); setFilterMinAge(''); setFilterMaxAge(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', cursor: 'pointer', padding: '0.8rem' }}
            >
              RESET FILTERS
            </button>
          </div>
        )}

        <div>
          {activeTab === 'analytics' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                <div className="card-premium" style={{ textAlign: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--primary-navy)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>TOTAL ASSESSMENTS</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0' }}>{analyticsData.totalAssessments}</div>
                </div>
                <div className="card-premium" style={{ textAlign: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--primary-navy)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>HIGH ACHIEVERS</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--accent-gold)' }}>{analyticsData.highAchievers}</div>
                </div>
                <div className="card-premium" style={{ textAlign: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--primary-navy)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800 }}>AVG SCORE %</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--accent-blue)' }}>{analyticsData.avgScorePercent}%</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-navy)' }}>Proficiency Distribution</h3>
                  <div style={{ height: '300px' }}>
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.proficiencyData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="count" fill="var(--accent-gold)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-navy)' }}>Daily Leads Volume</h3>
                  <div style={{ height: '300px' }}>
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.dailyVolumeData}>
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
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-navy)' }}>Age Distribution</h3>
                <div style={{ height: '300px' }}>
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.ageData}
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
                  )}
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
                      <tr key={lead.id} onClick={async () => {
                        const { data: ans } = await supabase.from('lead_answers').select('*').eq('lead_id', lead.id);
                        setSelectedLead({ ...lead, answers: ans });
                      }} style={{ background: 'var(--soft-gray)', transition: 'all 0.3s ease', cursor: 'pointer' }} className="hover-lift">
                        <td style={{ padding: '1.5rem', borderRadius: '12px 0 0 12px' }}>
                          <div style={{ fontWeight: 800, color: 'var(--primary-navy)' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{lead.email}</div>
                        </td>
                        <td style={{ padding: '1.5rem', fontWeight: 800 }}>{lead.score}/{lead.total_questions}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ padding: '0.4rem 1rem', background: 'var(--primary-navy)', color: 'white', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800 }}>{lead.level}</span>
                        </td>
                        <td style={{ padding: '1.5rem', borderRadius: '0 12px 12px 0' }}>
                          <button style={{ color: 'var(--accent-gold)', border: 'none', background: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>VIEW DETAILS</button>
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
                {/* English Content */}
                <div>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>GLOBAL (EN)</h4>
                  <div style={{ marginBottom: '2rem' }}>
                    <input type="text" value={settings.heroHeadlineEn} onChange={(e) => setSettings({ ...settings, heroHeadlineEn: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', fontWeight: 600, color: 'var(--primary-navy)' }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>HERO SUBHEADLINE</label>
                    <textarea value={settings.heroSubheadlineEn} onChange={(e) => setSettings({ ...settings, heroSubheadlineEn: e.target.value })} style={{ width: '100%', height: '100px', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', fontWeight: 600, resize: 'none', color: 'var(--primary-navy)' }} />
                  </div>
                </div>

                {/* Arabic Content */}
                <div style={{ direction: 'rtl' }}>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>المحتوى العربي (AR)</h4>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>العنوان الرئيسي</label>
                    <input type="text" value={settings.heroHeadlineAr} onChange={(e) => setSettings({ ...settings, heroHeadlineAr: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', fontWeight: 600, color: 'var(--primary-navy)' }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>العنوان الفرعي</label>
                    <textarea value={settings.heroSubheadlineAr} onChange={(e) => setSettings({ ...settings, heroSubheadlineAr: e.target.value })} style={{ width: '100%', height: '100px', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', fontWeight: 600, resize: 'none', color: 'var(--primary-navy)' }} />
                  </div>
                </div>
              </div>

              {/* Contact & Socials */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--soft-gray)', marginBottom: '3rem' }}>
                <div>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>CONTACT INFO</h4>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.4 }}>WHATSAPP NUMBER</label>
                    <input type="text" value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', color: 'var(--primary-navy)' }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.4 }}>CONTACT EMAIL</label>
                    <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', color: 'var(--primary-navy)' }} />
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>SOCIAL CHANNELS</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.4 }}>FACEBOOK</label>
                      <input type="text" value={settings.facebookLink || ''} onChange={(e) => setSettings({ ...settings, facebookLink: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', color: 'var(--primary-navy)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.4 }}>INSTAGRAM</label>
                      <input type="text" value={settings.instagramLink || ''} onChange={(e) => setSettings({ ...settings, instagramLink: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', color: 'var(--primary-navy)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.4 }}>LINKEDIN</label>
                      <input type="text" value={settings.linkedinLink || ''} onChange={(e) => setSettings({ ...settings, linkedinLink: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', color: 'var(--primary-navy)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.4 }}>TIKTOK</label>
                      <input type="text" value={settings.tiktokLink || ''} onChange={(e) => setSettings({ ...settings, tiktokLink: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', color: 'var(--primary-navy)' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--soft-gray)', paddingTop: '3rem', marginTop: '1rem', marginBottom: '3rem' }}>
                <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>AUTOMATION</h4>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.4 }}>NOTIFICATIONS WEBHOOK URL (ZAPIER / MAKE)</label>
                  <input
                    type="url"
                    placeholder="https://hooks.zapier.com/..."
                    value={settings.webhookUrl || ''}
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                    style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)', fontWeight: 600, color: 'var(--primary-navy)' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-master btn-gold" style={{ width: '100%', justifyContent: 'center' }}>PUBLISH ALL CHANGES TO LIVE SITE</button>
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

      {/* Lead Details Modal */}
      {selectedLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(1, 22, 39, 0.9)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-dark" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '40px', padding: '4rem', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setSelectedLead(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>

            <div style={{ marginBottom: '4rem' }}>
              <span style={{ color: 'var(--accent-gold)', letterSpacing: '4px', fontSize: '0.7rem', fontWeight: 800 }}>STUDENT DOSSIER</span>
              <h2 style={{ color: 'white', fontSize: '2.5rem', marginTop: '1rem', fontFamily: 'var(--font-serif)' }}>{selectedLead.name}</h2>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', opacity: 0.6, fontSize: '0.9rem', color: 'white' }}>
                <span><i className="fa-solid fa-envelope" style={{ marginRight: '0.5rem' }}></i>{selectedLead.email}</span>
                <span><i className="fa-solid fa-phone" style={{ marginRight: '0.5rem' }}></i>{selectedLead.phone}</span>
                {selectedLead.company && <span><i className="fa-solid fa-building" style={{ marginRight: '0.5rem' }}></i>{selectedLead.company}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800, color: 'white' }}>ACADEMIC SCORE</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '0.5rem' }}>{selectedLead.score}/{selectedLead.total_questions}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 800, color: 'white' }}>PREDICTED LEVEL</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '0.5rem' }}>{selectedLead.level}</div>
              </div>
            </div>

            {selectedLead.writing_response && (
              <div style={{ marginBottom: '4rem' }}>
                <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Writing Assessment</h4>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2.5rem', borderRadius: '24px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {selectedLead.writing_response}
                </div>
              </div>
            )}

            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Detailed Answers</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(!selectedLead.answers || selectedLead.answers.length === 0) ? (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.3, color: 'white' }}>No detailed answer data found for this student.</div>
              ) : (
                selectedLead.answers.map((ans: any, i: number) => (
                  <div key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '0.5rem' }}>{ans.question_text}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.5, color: 'white' }}>Student: <span style={{ color: ans.is_correct ? '#4ade80' : '#f87171' }}>{ans.student_answer}</span> | Correct: {ans.correct_answer}</div>
                    </div>
                    <i className={`fa-solid ${ans.is_correct ? 'fa-circle-check' : 'fa-circle-xmark'}`} style={{ color: ans.is_correct ? '#4ade80' : '#f87171', fontSize: '1.2rem' }}></i>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Question Editor Modal */}
      {isEditingQuestion && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(1, 22, 39, 0.9)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-dark" style={{ width: '100%', maxWidth: '700px', borderRadius: '40px', padding: '4rem', position: 'relative' }}>
            <button onClick={() => setIsEditingQuestion(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '3rem', fontFamily: 'var(--font-serif)' }}>{currentQuestion.id ? 'Edit Question' : 'Add New Question'}</h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 800 }}>QUESTION TEXT</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: '12px', color: 'white', resize: 'none', height: '100px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 800 }}>PART (1-3)</label>
                  <input type="number" value={currentQuestion.part} onChange={(e) => setCurrentQuestion({...currentQuestion, part: parseInt(e.target.value)})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: '12px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 800 }}>CEFR LEVEL</label>
                  <select value={currentQuestion.level} onChange={(e) => setCurrentQuestion({...currentQuestion, level: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: '12px', color: 'white' }}>
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 800 }}>OPTIONS (Comma separated)</label>
                <input
                  type="text"
                  value={currentQuestion.options?.join(', ')}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, options: e.target.value.split(',').map(o => o.trim())})}
                  placeholder="Option 1, Option 2, Option 3, Option 4"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: '12px', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 800 }}>CORRECT ANSWER</label>
                <input type="text" value={currentQuestion.correct_answer} onChange={(e) => setCurrentQuestion({...currentQuestion, correct_answer: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: '12px', color: 'white' }} />
              </div>

              <button onClick={handleSaveQuestion} className="btn-master btn-gold" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>SAVE QUESTION</button>
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
      `}</style>
    </main>
  );
}
