'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    about: 'About',
    portfolio: 'Portfolio',
    takeTest: 'Take Test',
    startAssessment: 'Start Assessment',
    learnMore: 'Learn More',
    experienceMagnificence: 'Experience Magnificence in Learning',
    aboutText1: 'At Linguaplanet, we believe that language is more than just words—it\'s the key to unlocking your professional potential. Our curriculum integrates advanced English proficiency with essential soft skills like leadership, public speaking, and emotional intelligence.',
    aboutText2: 'Whether you are a corporate executive or an aspiring professional, our tailored programs ensure you communicate with confidence and elegance on the global stage.',
    quote: '"The limit of your language is the limit of your world."',
    takeNextStep: 'Take the Next Step',
    chooseStart: 'Choose how you\'d like to begin your journey with us.',
    emailInquiries: 'Email Inquiries',
    emailDesc: 'Have specific questions? Send us an email and our advisors will get back to you within 24 hours.',
    sendEmail: 'Send Email',
    whatsappChat: 'WhatsApp Chat',
    whatsappDesc: 'Want a quick response? Message us directly on WhatsApp for immediate assistance.',
    chatWhatsapp: 'Chat on WhatsApp',
    placementTest: 'Placement Test',
    testDesc: 'Not sure where to start? Take our comprehensive assessment to find your proficiency level.',
    startTest: 'Start English Test',
    quickLinks: 'Quick Links',
    home: 'Home',
    aboutUs: 'About Us',
    contact: 'Contact',
    allRights: 'All rights reserved.'
  },
  ar: {
    about: 'عن الأكاديمية',
    portfolio: 'الملف المهني',
    takeTest: 'خض الاختبار',
    startAssessment: 'ابدأ التقييم',
    learnMore: 'تعرف على المزيد',
    experienceMagnificence: 'اختبر الروعة في التعلم',
    aboutText1: 'في أكاديمية إيليت، نؤمن بأن اللغة هي أكثر من مجرد كلمات - إنها المفتاح لفتح إمكاناتك المهنية. يدمج منهجنا بين إتقان اللغة الإنجليزية المتقدمة والمهارات الشخصية الأساسية مثل القيادة والخطابة والذكاء العاطفي.',
    aboutText2: 'سواء كنت مديراً تنفيذياً في شركة أو محترفاً طموحاً، تضمن برامجنا المصممة خصيصاً تواصلك بثقة وأناقة على الساحة العالمية.',
    quote: '"حدود لغتك هي حدود عالمك."',
    takeNextStep: 'اتخذ الخطوة التالية',
    chooseStart: 'اختر كيف ترغب في بدء رحلتك معنا.',
    emailInquiries: 'استفسارات البريد الإلكتروني',
    emailDesc: 'هل لديك أسئلة محددة؟ أرسل لنا بريداً إلكترونياً وسيقوم مستشارونا بالرد عليك في غضون 24 ساعة.',
    sendEmail: 'أرسل بريداً إلكترونياً',
    whatsappChat: 'محادثة واتساب',
    whatsappDesc: 'هل تريد رداً سريعاً؟ راسلنا مباشرة على واتساب للحصول على مساعدة فورية.',
    chatWhatsapp: 'تحدث على واتساب',
    placementTest: 'اختبار تحديد المستوى',
    testDesc: 'لست متأكداً من أين تبدأ؟ خض تقييمنا الشامل لمعرفة مستوى كفاءتك.',
    startTest: 'ابدأ اختبار الإنجليزية',
    quickLinks: 'روابط سريعة',
    home: 'الصفحة الرئيسية',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
    allRights: 'جميع الحقوق محفوظة.'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
