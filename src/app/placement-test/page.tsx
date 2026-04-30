'use client';

import { useState, useEffect } from 'react';
import { placementQuestions } from '@/data/questions';
import { db } from '@/data/db';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PlacementTest() {
  const { language, t, isRtl } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '' });
  const [writingResponse, setWritingResponse] = useState('');
  const [ageRange, setAgeRange] = useState('');

  const currentQuestions = placementQuestions.filter(q => q.part === (currentPart === 1 ? 1 : 2));

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentQuestions[currentQuestion].correctAnswer;
    if (isCorrect) setScore(score + 1);
    
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (currentPart === 1) {
        setCurrentPart(2);
        setCurrentQuestion(0);
      } else if (currentPart === 2) {
        setCurrentPart(3);
      }
    }
  };

  const calculateLevel = (totalScore: number) => {
    if (totalScore <= 15) return 'A1';
    if (totalScore <= 30) return 'A2';
    if (totalScore <= 45) return 'B1';
    if (totalScore <= 55) return 'B2';
    return 'C1/C2';
  };

  const currentLevel = calculateLevel(score);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    await db.saveLead({
      name: leadData.name,
      email: leadData.email,
      score: score,
      totalQuestions: placementQuestions.length,
      level: currentLevel,
      user_id: user?.id
    });
    setShowLeadForm(false);
    setLevel(currentLevel);
    setIsFinished(true);
  };

  if (isFinished) {
    return (
      <main style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <Navbar />
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', padding: '2rem' }}>
          {showLeadForm ? (
            <div className="glass animate-reveal" style={{ padding: '3.5rem', width: '100%', maxWidth: '500px', borderTop: '4px solid var(--accent-gold)' }}>
              <h2 style={{ marginBottom: '1rem', color: 'var(--accent-gold)', textAlign: 'center' }}>{isRtl ? 'احفظ نتائجك' : 'Save Your Results'}</h2>
              <p style={{ marginBottom: '2.5rem', textAlign: 'center', opacity: 0.7 }}>{isRtl ? 'أدخل بياناتك للحصول على تقريرك المفصل وتوصيات الدورة التدريبية.' : 'Enter your details to receive your detailed report and course recommendations.'}</p>
              <form onSubmit={handleLeadSubmit}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{isRtl ? 'الاسم بالكامل' : 'FULL NAME'}</label>
                  <input 
                    type="text" 
                    placeholder={isRtl ? 'الاسم بالكامل' : 'Full Name'} 
                    required 
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                    style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--gray-light)', textAlign: isRtl ? 'right' : 'left' }} 
                  />
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{isRtl ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}</label>
                  <input 
                    type="email" 
                    placeholder={isRtl ? 'البريد الإلكتروني' : 'Email Address'} 
                    required 
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--gray-light)', textAlign: isRtl ? 'right' : 'left' }} 
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{isRtl ? 'الفئة العمرية' : 'AGE RANGE'}</label>
                  <select 
                    required 
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--gray-light)', background: 'white', textAlign: isRtl ? 'right' : 'left' }}
                  >
                    <option value="">Select Age Range</option>
                    <option value="kids">Kids (6-12)</option>
                    <option value="teens">Teens (13-17)</option>
                    <option value="adults">Adults (18+)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{isRtl ? 'إرسال وعرض النتيجة' : 'Submit & View Result'}</button>
              </form>
            </div>
          ) : (
            <div className="glass text-center animate-fade-in" style={{ padding: '4rem', maxWidth: '600px' }}>
              <h1 style={{ color: 'var(--accent-gold)', fontSize: '4rem', marginBottom: '1rem' }}>{level}</h1>
              <h2 style={{ marginBottom: '1.5rem' }}>{isRtl ? 'مستوى كفاءتك' : 'Your Proficiency Level'}</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                {isRtl ? `تهانينا ${leadData.name}! لقد أكملت التقييم. نتيجتك هي ${score}/${placementQuestions.length}.` : `Congratulations ${leadData.name}! You've completed the assessment. Your score is ${score}/${placementQuestions.length}.`}
              </p>
              <div style={{ backgroundColor: 'var(--primary-bg)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>{isRtl ? 'الدورة الموصى بها:' : 'Recommended Course:'}</h4>
                <p style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                  {level === 'A1' || level === 'A2' ? (isRtl ? 'أساسيات اللغة الإنجليزية' : 'Foundations of English') : 
                   level === 'B1' || level === 'B2' ? (isRtl ? 'اتصالات مهنية للمحترفين' : 'Professional Communication Pro') : 
                   (isRtl ? 'القيادة التنفيذية والبلاغة المتقدمة' : 'Executive Leadership & Advanced Rhetoric')}
                </p>
              </div>
              <Link href="/" className="btn btn-primary" style={{ width: '100%' }}>{t('home')}</Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  const q = currentQuestions[currentQuestion];

  return (
    <main style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <Navbar />
      <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
        <div style={{ width: '100%', maxWidth: '700px', marginBottom: '2rem', marginTop: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.7, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <span>{isRtl ? `الجزء ${currentPart} - السؤال ${currentQuestion + 1}` : `Part ${currentPart} - Question ${currentQuestion + 1}`}</span>
            <span>{Math.round(((currentPart === 3 ? 60 : (currentPart === 2 ? 40 + currentQuestion : currentQuestion)) / 60) * 100)}% {isRtl ? 'مكتمل' : 'Complete'}</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--gray-light)', borderRadius: '2px' }}>
            <div style={{ 
              width: `${((currentPart === 3 ? 60 : (currentPart === 2 ? 40 + currentQuestion : currentQuestion)) / 60) * 100}%`, 
              height: '100%', 
              backgroundColor: 'var(--accent-gold)', 
              borderRadius: '2px',
              transition: 'width 0.5s ease',
              float: isRtl ? 'right' : 'left'
            }}></div>
          </div>
        </div>

        <div className="glass animate-reveal" style={{ padding: '3.5rem', width: '100%', maxWidth: '750px', borderTop: '4px solid var(--accent-gold)' }}>
          {currentPart < 3 ? (
            <>
              <h2 style={{ marginBottom: '2.5rem', fontSize: '1.6rem', fontFamily: 'var(--font-sans)', fontWeight: 500, textAlign: isRtl ? 'right' : 'left', lineHeight: 1.5 }}>
                {q.question}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    style={{
                      textAlign: isRtl ? 'right' : 'left',
                      padding: '1.2rem',
                      borderRadius: '8px',
                      border: `2px solid var(--gray-light)`,
                      backgroundColor: 'transparent',
                      fontSize: '1rem',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--gray-light)')}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Part Three: Writing Assessment</h2>
              <p style={{ marginBottom: '2rem', opacity: 0.8 }}>{isRtl ? 'اختر أحد المواضيع التالية واكتب بين 100-150 كلمة:' : 'Choose ONE of the following topics and write between 100-150 words:'}</p>
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: '2rem', borderRadius: '8px', marginBottom: '2.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
                <p style={{ marginBottom: '1rem', fontWeight: 600 }}>1. Write an email to your friend telling him about your first job and your daily work routine.</p>
                <p style={{ fontWeight: 600 }}>2. Describe a country you have been to on your last vacation.</p>
              </div>
              <textarea 
                value={writingResponse}
                onChange={(e) => setWritingResponse(e.target.value)}
                placeholder={isRtl ? 'اكتب إجابتك هنا...' : 'Type your response here...'}
                style={{ width: '100%', height: '300px', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--gray-light)', marginBottom: '2.5rem', fontFamily: 'var(--font-sans)', fontSize: '1rem' }}
              />
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => setShowLeadForm(true)}
              >
                {isRtl ? 'إرسال التقييم' : 'Submit Assessment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
