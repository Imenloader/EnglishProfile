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
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentQuestions = placementQuestions.filter(q => q.part === (currentPart === 1 ? 1 : 2));

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentQuestions[currentQuestion].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    
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

  if (!mounted) return <div style={{ background: 'var(--primary-navy)', minHeight: '100vh' }}></div>;

  if (isFinished) {
    return (
      <main className="marble-pattern" style={{ direction: isRtl ? 'rtl' : 'ltr', background: 'var(--primary-navy)', minHeight: '100vh' }}>
        <Navbar isDarkPage={true} />
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', padding: '8rem 2rem' }}>
          <div className="glass-dark animate-reveal" style={{ padding: '5rem', maxWidth: '800px', width: '100%', textAlign: 'center', borderRadius: '40px' }}>
            <span style={{ color: 'var(--accent-gold)', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 800 }}>{t('evaluationComplete')}</span>
            <h1 style={{ color: 'white', fontSize: 'clamp(4rem, 15vw, 10rem)', margin: '2rem 0', fontFamily: 'var(--font-serif)', fontWeight: 700 }} className="gold-text">
              {level}
            </h1>
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem' }}>{t('predictedLevel')}</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                {t('congrats') ? t('congrats').replace('{name}', leadData.name).replace('{score}', score.toString()).replace('{total}', placementQuestions.length.toString()) : (isRtl 
                  ? `تهانينا ${leadData.name}! لقد أظهرت كفاءة استثنائية. درجتك هي ${score} من ${placementQuestions.length}. بناءً على أدائك، نوصي بالمسار التالي:`
                  : `Congratulations ${leadData.name}! You have demonstrated exceptional proficiency. Your score is ${score}/${placementQuestions.length}. Based on your performance, we recommend the following track:`
                )}
              </p>
              <h3 style={{ color: 'var(--accent-gold)', marginTop: '2rem', fontSize: '1.8rem' }}>
                {level === 'A1' || level === 'A2' ? t('foundationTrack') : 
                 level === 'B1' || level === 'B2' ? t('professionalTrack') : 
                 t('executiveTrack')}
              </h3>
            </div>

            <Link href="/" className="btn-master btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              {t('returnToPortal')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const q = currentQuestions[currentQuestion];
  const totalSteps = 60;
  const currentStep = (currentPart === 3 ? 55 : (currentPart === 2 ? 30 + currentQuestion : currentQuestion));
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <main className="marble-pattern" style={{ direction: isRtl ? 'rtl' : 'ltr', background: 'var(--primary-navy)', minHeight: '100vh' }}>
      <Navbar isDarkPage={true} />
      
      {/* Progress Orbit */}
      <div style={{ position: 'fixed', top: '80px', left: 0, width: '100%', zIndex: 100 }}>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: 'var(--accent-gold)', 
            boxShadow: '0 0 20px var(--accent-gold)',
            transition: 'width 0.8s ease'
          }}></div>
        </div>
        <div className="container" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px' }}>
          <span>{t('part')} 0{currentPart} / {currentQuestion + 1}</span>
          <span>{progress}% {t('complete')}</span>
        </div>
      </div>

      <div className="container flex-center" style={{ minHeight: '100vh', padding: '10rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '850px' }}>
          {showLeadForm ? (
            <div className="glass-dark animate-reveal" style={{ padding: '5rem', borderRadius: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span style={{ color: 'var(--accent-gold)', letterSpacing: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{t('secureResults')}</span>
                <h2 style={{ color: 'white', fontSize: '2.5rem', marginTop: '1rem' }}>{t('finalStep')}</h2>
              </div>
              <form onSubmit={handleLeadSubmit} style={{ display: 'grid', gap: '2.5rem' }}>
                <div className="form-group">
                  <label className="immortal-label">{t('yourName').toUpperCase()}</label>
                  <input 
                    type="text" 
                    required 
                    className="immortal-input" 
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="immortal-label">{t('emailAddress').toUpperCase()}</label>
                  <input 
                    type="email" 
                    required 
                    className="immortal-input" 
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="immortal-label">{t('flexibilityTitle').toUpperCase()}</label>
                  <select 
                    required 
                    className="immortal-input"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    style={{ appearance: 'none' }}
                  >
                    <option value="">{t('selectRange')}</option>
                    <option value="kids">{t('kids')}</option>
                    <option value="teens">{t('teens')}</option>
                    <option value="adults">{t('adults')}</option>
                  </select>
                </div>
                <button type="submit" className="btn-master btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                  {t('generateReport')} <i className="fa-solid fa-bolt" style={{ [isRtl ? 'marginRight' : 'marginLeft']: '1rem' }}></i>
                </button>
              </form>
            </div>
          ) : currentPart < 3 ? (
            <div className="glass-dark animate-reveal" style={{ padding: '5rem', borderRadius: '40px', borderTop: '4px solid var(--accent-gold)' }}>
              <h2 dir="ltr" style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', lineHeight: 1.4, marginBottom: '4rem', fontWeight: 500, textAlign: 'left' }}>
                {q.question}
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {q.options.map((opt, i) => (
                  <button
                    key={opt}
                    dir="ltr"
                    onClick={() => handleAnswer(opt)}
                    className="choice-card"
                    style={{ textAlign: 'left' }}
                  >
                    <span className="choice-index" style={{ order: isRtl ? 2 : 0 }}>0{i+1}</span>
                    <span className="choice-text" style={{ flex: 1 }}>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-dark animate-reveal" style={{ padding: '5rem', borderRadius: '40px' }}>
              <div style={{ marginBottom: '4rem' }}>
                <span style={{ color: 'var(--accent-gold)', letterSpacing: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{t('finalAssessment')}</span>
                <h2 style={{ color: 'white', fontSize: '2.5rem', marginTop: '1rem' }}>{t('writingEvaluation')}</h2>
              </div>
              <div style={{ background: 'rgba(197, 160, 89, 0.05)', padding: '2rem', borderRadius: '15px', borderLeft: isRtl ? 'none' : '4px solid var(--accent-gold)', borderRight: isRtl ? '4px solid var(--accent-gold)' : 'none', marginBottom: '3rem', color: 'rgba(255,255,255,0.8)' }}>
                <p style={{ marginBottom: '1rem' }}>{t('writingPrompt')}</p>
                <ol style={{ [isRtl ? 'paddingRight' : 'paddingLeft']: '1.5rem', display: 'grid', gap: '1rem' }}>
                  <li>{t('writingTopic1')}</li>
                  <li>{t('writingTopic2')}</li>
                </ol>
              </div>
              <textarea 
                value={writingResponse}
                onChange={(e) => setWritingResponse(e.target.value)}
                placeholder="..."
                className="immortal-textarea"
              />
              <button 
                className="btn-master btn-gold" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setShowLeadForm(true)}
              >
                {t('submitAssessment')} <i className="fa-solid fa-paper-plane" style={{ [isRtl ? 'marginRight' : 'marginLeft']: '1rem' }}></i>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .immortal-label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 3px;
          font-weight: 800;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1.2rem;
        }
        .immortal-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1.2rem 1.5rem;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .immortal-input:focus {
          outline: none;
          border-color: var(--accent-gold);
          background: rgba(255,255,255,0.06);
        }
        .immortal-textarea {
          width: 100%;
          height: 300px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 2rem;
          border-radius: 15px;
          color: white;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 3rem;
          resize: none;
        }
        .immortal-textarea:focus {
          outline: none;
          border-color: var(--accent-gold);
        }
        .choice-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.8rem 2.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          color: rgba(255,255,255,0.8);
        }
        .choice-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--accent-gold);
          transform: translateX(10px);
          color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .choice-index {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--accent-gold);
          opacity: 0.4;
        }
        .choice-text {
          font-size: 1.1rem;
          font-weight: 400;
        }
      `}</style>
    </main>
  );
}
