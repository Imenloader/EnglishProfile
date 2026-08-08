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

import { useRouter } from 'next/navigation';

import { placementQuestions } from '@/data/questions';

export default function AdminDashboard() {
  const { isRtl } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [leads, setLeads] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
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
      // 1. Fetch site settings
      try {
        const resSettings = await fetch('/api/settings');
        if (resSettings.ok) {
          const sData = await resSettings.json();
          setSettings({
            id: '1',
            heroHeadlineEn: sData.hero_headline_en || '',
            heroHeadlineAr: sData.hero_headline_ar || '',
            heroSubheadlineEn: sData.hero_subheadline_en || '',
            heroSubheadlineAr: sData.hero_subheadline_ar || '',
            whatsappNumber: sData.whatsapp_number || '',
            contactEmail: sData.contact_email || '',
            facebookLink: sData.facebook_link || '',
            instagramLink: sData.instagram_link || '',
            linkedinLink: sData.linkedin_link || '',
            tiktokLink: sData.tiktok_link || '',
            updatedAt: new Date(sData.updated_at || Date.now()),
            webhookUrl: sData.webhook_url || ""
          });
        } else {
          throw new Error("Settings API failed");
        }
      } catch (e) {
        console.warn("⚠️ Settings API failed, using db.getSettings() fallback:", e);
        const s = await db.getSettings();
        setSettings(s);
      }

      // 2. Fetch leads & answers
      try {
        const resLeads = await fetch('/api/leads?include_answers=true');
        if (resLeads.ok) {
          const lData = await resLeads.json();
          setLeads(lData.leads || []);
          setAnswers(lData.answers || []);
        } else {
          throw new Error("Leads API failed");
        }
      } catch (e) {
        console.warn("⚠️ Leads API failed, using direct Supabase fallback:", e);
        const { data: rawLeads, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!leadsError) setLeads(rawLeads || []);
      }

      // 3. Fetch questions (if active tab is test)
      if (activeTab === 'test') {
        try {
          const resQuestions = await fetch('/api/questions');
          if (resQuestions.ok) {
            let qData = await resQuestions.json();
            if (qData && qData.questions) { qData = qData.questions; }
            setQuestions(qData || []);
          } else {
            throw new Error("Questions API failed");
          }
        } catch (e) {
          console.warn("⚠️ Questions API failed, using direct Supabase fallback:", e);
          const { data: q, error: qError } = await supabase
            .from('questions')
            .select('*')
            .order('part', { ascending: true });
          if (!qError) setQuestions(q || []);
        }
      }
    } catch (error) {
      console.error("Dashboard failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleExportExcel = async () => {
    try {
      let leadsData = [];
      let answersData = [];

      try {
        const res = await fetch('/api/leads?include_answers=true');
        if (res.ok) {
          const data = await res.json();
          leadsData = data.leads || [];
          answersData = data.answers || [];
        } else {
          throw new Error("Leads API failed");
        }
      } catch (e) {
        console.warn("⚠️ Export Excel API failed, using direct Supabase fallback:", e);
        const { data: l } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        const { data: a } = await supabase.from('lead_answers').select('*').order('created_at', { ascending: false });
        leadsData = l || [];
        answersData = a || [];
      }

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

      // Helper to extract format preference resiliently
      const getFormatPreference = (lead: any) => {
        if (lead.class_format) return lead.class_format.toUpperCase();
        if (lead.company && lead.company.includes('Prefers:')) {
          try {
            return lead.company.split('Prefers:')[1].replace(')', '').trim().toUpperCase();
          } catch (e) {}
        }
        return 'ONLINE';
      };

      // 1. MASTER STUDENTS SUMMARY
      const summaryData = filteredLeads.map((l: any) => ({
        'ID': l.id.slice(0, 8),
        'Student Name': l.name,
        'Email': l.email,
        'Phone': l.phone || 'N/A',
        'Company': l.company && l.company.includes('Prefers:') ? l.company.split('Prefers:')[0].replace('(', '').trim() || 'N/A' : l.company || 'N/A',
        'Preferred Format': getFormatPreference(l),
        'Age': l.age_range || 'N/A',
        'Score': `${l.score}/${l.total_questions}`,
        'Percentage': `${l.total_questions > 0 ? Math.round((l.score / l.total_questions) * 100) : 0}%`,
        'CEFR Level': l.level,
        'Date': l.created_at ? l.created_at.split(/[T ]/)[0] : 'N/A',
        'Time': l.created_at && l.created_at.includes('T') ? l.created_at.split('T')[1].split('.')[0] : (l.created_at ? l.created_at.split(' ')[1] || 'N/A' : 'N/A')
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), "Master Summary");

      // 2. STUDENT-QUESTION MATRIX
      // ⚡ Bolt Performance Optimization:
      // Replaced O(N^2) nested array iterations (.filter, .find inside .map) with O(N) hash map lookups.
      // We pre-compute a map of answers grouped by lead_id and then by question_text for O(1) access.
      const answersMap = new Map<string, Map<string, any>>();
      (answersData || []).forEach((a: any) => {
        if (!answersMap.has(a.lead_id)) {
          answersMap.set(a.lead_id, new Map());
        }
        answersMap.get(a.lead_id)!.set(a.question_text, a);
      });

      const uniqueQuestions = Array.from(new Set((answersData || []).map((a: any) => a.question_text)));
      const matrixData = filteredLeads.map((l: any) => {
        const studentAnswersMap = answersMap.get(l.id) || new Map();
        const row: any = {
          'Student Name': l.name,
          'Phone': l.phone || 'N/A',
          'Company': l.company && l.company.includes('Prefers:') ? l.company.split('Prefers:')[0].replace('(', '').trim() || 'N/A' : l.company || 'N/A',
          'Preferred Format': getFormatPreference(l),
          'Age': l.age_range || 'N/A',
          'Total Score': l.score,
          'Level': l.level
        };
        uniqueQuestions.forEach((q: any) => {
          const ans = studentAnswersMap.get(q);
          row[q] = ans ? (ans.is_correct ? 1 : 0) : 'N/A';
        });
        return row;
      });
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(matrixData), "Question Matrix");

      // 3. DETAILED ANSWERS
      // ⚡ Bolt Performance Optimization:
      // Replaced O(N*M) lookup (.some) with O(1) Set lookup.
      const filteredLeadIds = new Set(filteredLeads.map((l: any) => l.id));
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
        'Company': l.company && l.company.includes('Prefers:') ? l.company.split('Prefers:')[0].replace('(', '').trim() || 'N/A' : l.company || 'N/A',
        'Preferred Format': getFormatPreference(l),
        'Age': l.age_range || 'N/A',
        'CEFR (Predicted)': l.level,
        'Writing Content': l.writing_response,
        'Status': 'PENDING REVIEW'
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(writingData), "Writing Review Portal");

      // 5. LEVEL DISTRIBUTION
      const levelsList = ['A1', 'A2', 'B1', 'B1+', 'B2', 'C1'];
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

      // Use Blob download instead of XLSX.writeFile (not available in edge/CF Workers)
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LINGUAPLANET_FILTERED_EXPORT_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 100);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to generate Excel file.");
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentQuestion)
      });
      if (res.ok) {
        setIsEditingQuestion(false);
        fetchData();
      } else {
        throw new Error("Questions API failed");
      }
    } catch (e) {
      console.warn("⚠️ Save question API failed, using direct Supabase fallback:", e);
      const { error } = currentQuestion.id
        ? await supabase.from('questions').update(currentQuestion).eq('id', currentQuestion.id)
        : await supabase.from('questions').insert([currentQuestion]);

      if (!error) {
        setIsEditingQuestion(false);
        fetchData();
      }
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/questions?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      } else {
        throw new Error("Questions API failed");
      }
    } catch (e) {
      console.warn("⚠️ Delete question API failed, using direct Supabase fallback:", e);
      await supabase.from('questions').delete().eq('id', id);
      fetchData();
    }
  };

  const handleDeleteAllQuestions = async () => {
    if (!confirm('Are you ABSOLUTELY sure you want to delete ALL questions? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/questions?action=delete_all`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      } else {
        throw new Error("Questions API failed");
      }
    } catch (e) {
      console.warn("⚠️ Delete all question API failed, using direct Supabase fallback:", e);
      await supabase.from('questions').delete().not('id', 'is', null);
      fetchData();
    }
  };

  const handleSyncQuestions = async () => {
    if (!confirm('This will upload 60 static questions to the database. Continue?')) return;

    const formatted = placementQuestions.map((q, i) => ({
      id: `static-q-${q.part}-${i}`,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      part: q.part,
      level: q.category === 'advanced' ? 'B2' : (q.category === 'vocabulary' ? 'A2' : 'A1')
    }));

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted)
      });
      if (res.ok) {
        alert('Questions synchronized successfully!');
        fetchData();
      } else {
        throw new Error("Sync API failed");
      }
    } catch (e) {
      console.warn("⚠️ Questions Sync API failed, using direct Supabase fallback:", e);
      const { error } = await supabase.from('questions').insert(formatted);
      if (!error) {
        alert('Questions synchronized successfully!');
        fetchData();
      } else {
        console.error("Sync error:", error);
        alert('Failed to sync questions: ' + error.message);
      }
    }
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      hero_headline_en: settings.heroHeadlineEn,
      hero_headline_ar: settings.heroHeadlineAr,
      hero_subheadline_en: settings.heroSubheadlineEn,
      hero_subheadline_ar: settings.heroSubheadlineAr,
      whatsapp_number: settings.whatsappNumber,
      contact_email: settings.contactEmail,
      facebook_link: settings.facebookLink,
      instagram_link: settings.instagramLink,
      linkedin_link: settings.linkedinLink,
      tiktok_link: settings.tiktokLink,
      webhook_url: settings.webhookUrl
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        throw new Error("Settings API failed");
      }
    } catch (err) {
      console.warn("⚠️ Settings save API failed, using db.saveSettings() fallback:", err);
      await db.saveSettings(settings);
      alert('Settings saved successfully!');
    }
  };


  // Dynamically filter leads based on user selection in real-time
  const filteredLeads = useMemo(() => {
    let result = leads || [];

    // Filter by Date
    if (filterStartDate) {
      result = result.filter((l: any) => l.created_at >= filterStartDate);
    }
    if (filterEndDate) {
      const nextDay = new Date(filterEndDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];
      result = result.filter((l: any) => l.created_at < nextDayStr);
    }

    // Filter by Age
    if (filterMinAge || filterMaxAge) {
      result = result.filter((l: any) => {
        const age = parseInt(l.age_range);
        if (isNaN(age)) return false;
        const min = filterMinAge ? parseInt(filterMinAge) : 0;
        const max = filterMaxAge ? parseInt(filterMaxAge) : 999;
        return age >= min && age <= max;
      });
    }

    return result;
  }, [leads, filterStartDate, filterEndDate, filterMinAge, filterMaxAge]);

  // Consolidate analytics calculations to prevent unnecessary re-renders and multiple passes
  const analyticsData = useMemo(() => {
    let totalAssessments = filteredLeads.length;
    let highAchievers = 0;
    let totalScore = 0;
    let totalQuestions = 0;

    const proficiencyCounts: Record<string, number> = {
      'A1': 0, 'A2': 0, 'B1': 0, 'B1+': 0, 'B2': 0, 'C1': 0
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

    filteredLeads.forEach((l: any) => {
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
        } else if (l.level === 'C1/C2' || l.level === 'C2') {
          proficiencyCounts['C1']++;
        }
      }

      // Daily Volume
      if (l.created_at) {
        // Handle both ISO 'T' and SQLite ' ' formats
        const dateStr = l.created_at.split(/[T ]/)[0];
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

    const proficiencyData = ['A1', 'A2', 'B1', 'B1+', 'B2', 'C1'].map(lvl => ({
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
  }, [filteredLeads]);



  return (
    <main className="marble-pattern" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <Navbar />

      {/* Horizontal Top Header & Tab Menu */}
      <div style={{ padding: '8rem 4rem 2rem', background: 'var(--bg-color-alt)', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '4px' }}>ADMINISTRATION</span>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem', fontWeight: 700, color: 'var(--text-color)' }}>Elite Control</h2>
          </div>
          
          <nav style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.4rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'analytics', label: 'ANALYTICS', icon: 'fa-chart-line' },
              { id: 'leads', label: 'STUDENT LEADS', icon: 'fa-users' },
              { id: 'content', label: 'CONTENT MANAGER', icon: 'fa-pen' },
              { id: 'test', label: 'TEST MANAGER', icon: 'fa-list' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                style={{ 
                  background: activeTab === item.id ? 'var(--accent-gold)' : 'transparent', 
                  color: activeTab === item.id ? 'var(--primary-navy)' : 'var(--text-color)', 
                  border: 'none',
                  padding: '0.8rem 1.8rem', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: 800, 
                  fontSize: '0.75rem', 
                  letterSpacing: '1px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.8rem',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <i className={`fa-solid ${item.icon}`} style={{ fontSize: '0.9rem' }}></i>
                {item.label}
              </button>
            ))}
            <button 
              onClick={handleLogout} 
              style={{ 
                background: 'rgba(255, 77, 79, 0.1)', 
                color: '#ff4d4f', 
                border: '1px solid rgba(255, 77, 79, 0.2)',
                padding: '0.8rem 1.8rem', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontWeight: 800, 
                fontSize: '0.75rem', 
                letterSpacing: '1px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.8rem',
                marginLeft: 'auto',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '0.9rem' }}></i>
              LOGOUT
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '4rem', position: 'relative', color: 'var(--text-color)', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', textTransform: 'capitalize', color: 'var(--text-color)' }}>{activeTab}</h1>
            <div style={{ height: '3px', width: '60px', background: 'var(--accent-gold)', marginTop: '1rem' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {activeTab === 'leads' && (
              <button className="btn-master btn-gold" onClick={handleExportExcel}>MASTER EXCEL <i className="fa-solid fa-file-excel" style={{ marginLeft: '1rem' }}></i></button>
            )}
            {activeTab === 'test' && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn-master" onClick={handleDeleteAllQuestions} style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d' }}>DELETE ALL <i className="fa-solid fa-trash-can" style={{ marginLeft: '1rem' }}></i></button>
                <button className="btn-master btn-gold" onClick={handleSyncQuestions}>SYNC FROM STATIC <i className="fa-solid fa-rotate" style={{ marginLeft: '1rem' }}></i></button>
                <button className="btn-master btn-gold" onClick={() => { setCurrentQuestion({ question: '', options: ['', '', '', ''], correct_answer: '', part: 1, level: 'A1' }); setIsEditingQuestion(true); }}>ADD QUESTION <i className="fa-solid fa-plus" style={{ marginLeft: '1rem' }}></i></button>
              </div>
            )}
          </div>
        </header>

        {/* Export Filters UI */}
        {activeTab === 'leads' && (
          <div className="glass-card animate-reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2.5rem', borderRadius: '24px', marginBottom: '3rem', alignItems: 'flex-end', border: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-color)', opacity: 0.6, letterSpacing: '2px', marginBottom: '0.8rem' }}>FROM DATE</label>
              <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', color: 'var(--text-color)', fontSize: '0.9rem' }} />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-color)', opacity: 0.6, letterSpacing: '2px', marginBottom: '0.8rem' }}>TO DATE</label>
              <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', color: 'var(--text-color)', fontSize: '0.9rem' }} />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-color)', opacity: 0.6, letterSpacing: '2px', marginBottom: '0.8rem' }}>MIN AGE</label>
              <input type="number" placeholder="0" value={filterMinAge} onChange={(e) => setFilterMinAge(e.target.value)} style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', color: 'var(--text-color)', fontSize: '0.9rem' }} />
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-color)', opacity: 0.6, letterSpacing: '2px', marginBottom: '0.8rem' }}>MAX AGE</label>
              <input type="number" placeholder="100" value={filterMaxAge} onChange={(e) => setFilterMaxAge(e.target.value)} style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '8px', color: 'var(--text-color)', fontSize: '0.9rem' }} />
            </div>
            <button
              onClick={() => { setFilterStartDate(''); setFilterEndDate(''); setFilterMinAge(''); setFilterMaxAge(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', cursor: 'pointer', padding: '0.8rem' }}
            >
              RESET FILTERS
            </button>
          </div>
        )}

        <div>
          {activeTab === 'analytics' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                <div className="card-premium" style={{ textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 800, color: 'var(--text-color)' }}>TOTAL ASSESSMENTS</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--text-color)' }}>{analyticsData.totalAssessments}</div>
                </div>
                <div className="card-premium" style={{ textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 800, color: 'var(--text-color)' }}>HIGH ACHIEVERS</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--accent-gold)' }}>{analyticsData.highAchievers}</div>
                </div>
                <div className="card-premium" style={{ textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 800, color: 'var(--text-color)' }}>AVG SCORE %</span>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', margin: '1rem 0', color: 'var(--accent-blue)' }}>{analyticsData.avgScorePercent}%</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-color)' }}>Proficiency Distribution</h3>
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

                <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-color)' }}>Daily Leads Volume</h3>
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

              <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-color)' }}>Age Distribution</h3>
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
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--text-color)' }}>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>STUDENT</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>SCORE</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>LEVEL</th>
                    <th style={{ padding: '1.5rem', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-color)' }}>
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '5rem', opacity: 0.3 }}>No student data available.</td></tr>
                  ) : (
                    filteredLeads.map(lead => {
                      const prefFormat = lead.class_format || (lead.company && lead.company.includes('Prefers:') ? lead.company.split('Prefers:')[1].replace(')', '').trim() : 'ONLINE');
                      const displayCompany = lead.company && lead.company.includes('Prefers:') ? lead.company.split('Prefers:')[0].replace('(', '').trim() || 'N/A' : lead.company || 'N/A';
                      return (
                        <tr key={lead.id} onClick={async () => {
                          let ans = answers.filter((a: any) => a.lead_id === lead.id);
                          if (ans.length === 0) {
                            try {
                              const { data } = await supabase.from('lead_answers').select('*').eq('lead_id', lead.id);
                              ans = data || [];
                            } catch (e) {
                              console.warn("⚠️ Failed to load answers for lead from fallback:", e);
                            }
                          }
                          setSelectedLead({ ...lead, answers: ans });
                        }} style={{ background: 'rgba(128,128,128,0.05)', transition: 'all 0.3s ease', cursor: 'pointer' }} className="hover-lift">
                          <td style={{ padding: '1.5rem', borderRadius: '12px 0 0 12px' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              {lead.name}
                              <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(197, 160, 89, 0.12)', color: 'var(--accent-gold)', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 0 10px rgba(197, 160, 89, 0.1)' }}>
                                {prefFormat.toUpperCase()}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{lead.email} | {displayCompany !== 'N/A' ? displayCompany : 'No Company'}</div>
                          </td>
                        <td style={{ padding: '1.5rem', fontWeight: 800 }}>{lead.score}/{lead.total_questions}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ padding: '0.4rem 1rem', background: 'var(--primary-navy)', color: 'white', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800 }}>{lead.level}</span>
                        </td>
                        <td style={{ padding: '1.5rem', borderRadius: '0 12px 12px 0' }}>
                          <button style={{ color: 'var(--accent-gold)', border: 'none', background: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>VIEW DETAILS</button>
                        </td>
                      </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}



          {activeTab === 'content' && (
            <form onSubmit={handleSettingsSave} className="glass-card animate-reveal" style={{ padding: '4rem', borderRadius: '32px', color: 'var(--text-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '3rem' }}>
                {/* English Content */}
                <div>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>GLOBAL (EN)</h4>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>HERO HEADLINE</label>
                    <input type="text" value={settings.heroHeadlineEn} onChange={(e) => setSettings({ ...settings, heroHeadlineEn: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', fontWeight: 600, color: 'var(--text-color)' }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>HERO SUBHEADLINE</label>
                    <textarea value={settings.heroSubheadlineEn} onChange={(e) => setSettings({ ...settings, heroSubheadlineEn: e.target.value })} style={{ width: '100%', height: '100px', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', fontWeight: 600, resize: 'none', color: 'var(--text-color)' }} />
                  </div>
                </div>

                {/* Arabic Content */}
                <div style={{ direction: 'rtl' }}>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>المحتوى العربي (AR)</h4>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>العنوان الرئيسي</label>
                    <input type="text" value={settings.heroHeadlineAr} onChange={(e) => setSettings({ ...settings, heroHeadlineAr: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', fontWeight: 600, color: 'var(--text-color)' }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>العنوان الفرعي</label>
                    <textarea value={settings.heroSubheadlineAr} onChange={(e) => setSettings({ ...settings, heroSubheadlineAr: e.target.value })} style={{ width: '100%', height: '100px', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', fontWeight: 600, resize: 'none', color: 'var(--text-color)' }} />
                  </div>
                </div>
              </div>

              {/* Contact & Socials */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)', marginBottom: '3rem' }}>
                <div>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>CONTACT INFO</h4>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.6 }}>WHATSAPP NUMBER</label>
                    <input type="text" value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', color: 'var(--text-color)' }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.6 }}>CONTACT EMAIL</label>
                    <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', color: 'var(--text-color)' }} />
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>SOCIAL CHANNELS</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.6 }}>FACEBOOK</label>
                      <input type="text" value={settings.facebookLink || ''} onChange={(e) => setSettings({ ...settings, facebookLink: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', color: 'var(--text-color)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.6 }}>INSTAGRAM</label>
                      <input type="text" value={settings.instagramLink || ''} onChange={(e) => setSettings({ ...settings, instagramLink: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', color: 'var(--text-color)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.6 }}>LINKEDIN</label>
                      <input type="text" value={settings.linkedinLink || ''} onChange={(e) => setSettings({ ...settings, linkedinLink: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', color: 'var(--text-color)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.7rem', opacity: 0.6 }}>TIKTOK</label>
                      <input type="text" value={settings.tiktokLink || ''} onChange={(e) => setSettings({ ...settings, tiktokLink: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', color: 'var(--text-color)' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem', marginTop: '1rem', marginBottom: '3rem' }}>
                <h4 style={{ marginBottom: '2rem', color: 'var(--accent-gold)', letterSpacing: '2px', fontWeight: 800, fontSize: '0.8rem' }}>AUTOMATION</h4>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '0.8rem', opacity: 0.6 }}>NOTIFICATIONS WEBHOOK URL (ZAPIER / MAKE)</label>
                  <input
                    type="url"
                    placeholder="https://hooks.zapier.com/..."
                    value={settings.webhookUrl || ''}
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                    style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', fontWeight: 600, color: 'var(--text-color)' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-master btn-gold" style={{ width: '100%', justifyContent: 'center' }}>PUBLISH ALL CHANGES TO LIVE SITE</button>
            </form>
          )}

          {activeTab === 'test' && (
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-color)' }}>
                    <th style={{ padding: '1.5rem', opacity: 0.5, fontSize: '0.7rem' }}>PART</th>
                    <th style={{ padding: '1.5rem', opacity: 0.5, fontSize: '0.7rem' }}>QUESTION</th>
                    <th style={{ padding: '1.5rem', opacity: 0.5, fontSize: '0.7rem' }}>LEVEL</th>
                    <th style={{ padding: '1.5rem', opacity: 0.5, fontSize: '0.7rem' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-color)' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(1, 22, 39, 0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card animate-reveal" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '40px', padding: '4rem', position: 'relative', color: 'var(--text-color)' }}>
            <button onClick={() => setSelectedLead(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'var(--text-color)', fontSize: '1.5rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>

            <div style={{ marginBottom: '4rem' }}>
              <span style={{ color: 'var(--accent-gold)', letterSpacing: '4px', fontSize: '0.7rem', fontWeight: 800 }}>STUDENT DOSSIER</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-color)' }}>{selectedLead.name}</h2>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', opacity: 0.6, fontSize: '0.9rem', color: 'var(--text-color)' }}>
                <span><i className="fa-solid fa-envelope" style={{ marginRight: '0.5rem' }}></i>{selectedLead.email}</span>
                <span><i className="fa-solid fa-phone" style={{ marginRight: '0.5rem' }}></i>{selectedLead.phone}</span>
                {selectedLead.company && <span><i className="fa-solid fa-building" style={{ marginRight: '0.5rem' }}></i>{selectedLead.company}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
              <div style={{ background: 'var(--bg-color-alt)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 800, color: 'var(--text-color)' }}>ACADEMIC SCORE</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '0.5rem' }}>{selectedLead.score}/{selectedLead.total_questions}</div>
              </div>
              <div style={{ background: 'var(--bg-color-alt)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 800, color: 'var(--text-color)' }}>PREDICTED LEVEL</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '0.5rem' }}>{selectedLead.level}</div>
              </div>
              <div style={{ background: 'var(--bg-color-alt)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 800, color: 'var(--text-color)' }}>CLASS FORMAT</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '0.5rem', textTransform: 'uppercase' }}>
                  {selectedLead.class_format || (selectedLead.company && selectedLead.company.includes('Prefers:') ? selectedLead.company.split('Prefers:')[1].replace(')', '').trim() : 'ONLINE')}
                </div>
              </div>
            </div>

            {selectedLead.writing_response && (
              <div style={{ marginBottom: '4rem' }}>
                <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Writing Assessment</h4>
                <div style={{ background: 'var(--bg-color-alt)', padding: '2.5rem', borderRadius: '24px', color: 'var(--text-color)', lineHeight: 1.8, fontSize: '1.1rem', border: '1px solid var(--border-color)' }}>
                  {selectedLead.writing_response}
                </div>
              </div>
            )}

            <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Detailed Answers</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(!selectedLead.answers || selectedLead.answers.length === 0) ? (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.3, color: 'var(--text-color)' }}>No detailed answer data found for this student.</div>
              ) : (
                selectedLead.answers.map((ans: any, i: number) => (
                  <div key={i} style={{ padding: '1.5rem', background: 'var(--bg-color-alt)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '0.5rem' }}>{ans.question_text}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6, color: 'var(--text-color)' }}>Student: <span style={{ color: ans.is_correct ? '#4ade80' : '#f87171', fontWeight: 700 }}>{ans.student_answer}</span> | Correct: <span style={{ fontWeight: 700 }}>{ans.correct_answer}</span></div>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(1, 22, 39, 0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card animate-reveal" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '40px', padding: '4rem', position: 'relative', color: 'var(--text-color)' }}>
            <button onClick={() => setIsEditingQuestion(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'var(--text-color)', fontSize: '1.5rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
            <h2 style={{ fontSize: '2rem', marginBottom: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--text-color)' }}>{currentQuestion.id ? 'Edit Question' : 'Add New Question'}</h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-color)', opacity: 0.6, fontSize: '0.8rem', fontWeight: 800 }}>QUESTION TEXT</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '1.2rem', borderRadius: '12px', color: 'var(--text-color)', resize: 'none', height: '100px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-color)', opacity: 0.6, fontSize: '0.8rem', fontWeight: 800 }}>PART (1-3)</label>
                  <input type="number" value={currentQuestion.part} onChange={(e) => setCurrentQuestion({...currentQuestion, part: parseInt(e.target.value)})} style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '1.2rem', borderRadius: '12px', color: 'var(--text-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-color)', opacity: 0.6, fontSize: '0.8rem', fontWeight: 800 }}>CEFR LEVEL</label>
                  <select value={currentQuestion.level} onChange={(e) => setCurrentQuestion({...currentQuestion, level: e.target.value})} style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '1.2rem', borderRadius: '12px', color: 'var(--text-color)' }}>
                    {['A1', 'A2', 'B1', 'B1+', 'B2', 'C1'].map(lvl => <option key={lvl} value={lvl} style={{ background: 'var(--bg-color)', color: 'var(--text-color)' }}>{lvl}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-color)', opacity: 0.6, fontSize: '0.8rem', fontWeight: 800 }}>OPTIONS (Comma separated)</label>
                <input
                  type="text"
                  value={currentQuestion.options?.join(', ')}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, options: e.target.value.split(',').map(o => o.trim())})}
                  placeholder="Option 1, Option 2, Option 3, Option 4"
                  style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '1.2rem', borderRadius: '12px', color: 'var(--text-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-color)', opacity: 0.6, fontSize: '0.8rem', fontWeight: 800 }}>CORRECT ANSWER</label>
                <input type="text" value={currentQuestion.correct_answer} onChange={(e) => setCurrentQuestion({...currentQuestion, correct_answer: e.target.value})} style={{ width: '100%', background: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', padding: '1.2rem', borderRadius: '12px', color: 'var(--text-color)' }} />
              </div>

              <button onClick={handleSaveQuestion} className="btn-master btn-gold" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>SAVE QUESTION</button>
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          background: var(--bg-color-alt) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
      `}</style>
    </main>
  );
}
