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
    allRights: 'All rights reserved.',
    standardsTitle: 'The Linguaplanet Standard',
    operationalExcellence: 'Operational Excellence',
    qualityAssurance: 'Quality Assurance',
    eliteAcademicRigor: 'Elite Academic Rigor',
    qa1: 'Ground-breaking and top-notch approaches in language teaching.',
    qa2: 'Universal standards of assessment and testing.',
    qa3: 'Guaranteed quick results through engineering success.',
    flexibilityTitle: 'Flexibility',
    adaptiveDelivery: 'Adaptive Delivery',
    flexibilityDesc: 'Methods of delivery (F2F/Online) at our own premises or the Client\'s. Flexible Dates, Timing, and Scheduling tailored to your life.',
    pricingTitle: 'Pricing',
    transparentInvestment: 'Transparent Investment',
    pricingDesc: 'Variety of plans to suit your needs at very competitive prices. Multiple flexible payment options available for all programs.',
    trackingTitle: 'Tracking',
    reportingFollowup: 'Reporting & Follow-up',
    trackingDesc: 'Detailed accounts of student performance, immediate notification of punctuality, and systematic tracking of progress.',
    guaranteesTitle: 'Guarantees',
    institutionalSupport: 'Institutional Support',
    guaranteesDesc: 'Extra support for weak students, free review classes, and absolute openness to feedback and adaptability.',
    facingChallenges: 'Facing Challenges?',
    challenges1: 'Many candidates have great potentials but are short of the English requirement.',
    challenges2: 'Poor language abilities often hinder entry into prestigious programmes.',
    challenges3: 'We bridge the gap between potential and achievement.',
    safeHands: 'You\'re in Safe Hands',
    safeHandsDesc: 'At Linguaplanet, the dilemma of low-quality providers and high costs has ceased to exist. We provide excellent language services at a fraction of the market price.',
    institutionalGuarantee: 'INSTITUTIONAL GRADE GUARANTEE',
    sendMessage: 'Send us a message',
    yourName: 'YOUR NAME',
    emailAddress: 'EMAIL ADDRESS',
    message: 'MESSAGE',
    sending: 'SENDING...',
    messageSent: 'MESSAGE SENT!',
    tryAgain: 'TRY AGAIN',
    thankYouMessage: 'Thank you! We will get back to you shortly.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    returnHome: 'RETURN TO HOME',
    pillars: 'Foundational Pillars',
    valuesTitle: 'The Values We Stand By',
    excellence: 'Excellence',
    excellenceDesc: 'We strive for the highest quality in every educational program we deliver.',
    integrity: 'Integrity',
    integrityDesc: 'Honesty and transparency are at the core of our institutional relationships.',
    innovation: 'Innovation',
    innovationDesc: 'Constantly evolving our methods to meet the future of global communication.',
    worldClassAcademy: 'WORLD CLASS LANGUAGE ACADEMY',
    programs: 'Programs',
    team: 'Our Team',
    arabicInterface: 'ARABIC INTERFACE',
    englishInterface: 'ENGLISH INTERFACE',
    evaluationComplete: 'EVALUATION COMPLETE',
    predictedLevel: 'Your Predicted Level',
    foundationTrack: 'Foundations of English',
    professionalTrack: 'Professional Communication Pro',
    executiveTrack: 'Executive Leadership & Advanced Rhetoric',
    returnToPortal: 'RETURN TO PORTAL',
    secureResults: 'SECURE YOUR RESULTS',
    finalStep: 'Final Step',
    generateReport: 'GENERATE MASTERY REPORT',
    selectRange: 'Select range...',
    kids: 'Kids (6-12)',
    teens: 'Teens (13-17)',
    adults: 'Adults (18+)',
    finalAssessment: 'FINAL ASSESSMENT',
    writingEvaluation: 'Writing Evaluation',
    writingPrompt: 'Choose ONE of the following topics (100-150 words):',
    writingTopic1: 'Your first job and daily routine.',
    writingTopic2: 'A country you visited on your last vacation.',
    submitAssessment: 'SUBMIT ASSESSMENT',
    phone: 'PHONE',
    part: 'PART',
    complete: 'COMPLETE',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    welcomeBack: 'Welcome Back',
    enterCredentials: 'ENTER YOUR CREDENTIALS',
    dontHaveAccount: "Don't have an account?",
    createProfile: 'CREATE A STUDENT PROFILE',
    authenticating: 'AUTHENTICATING...',
    joinAcademy: 'Join Linguaplanet',
    startJourney: 'START YOUR PROFESSIONAL JOURNEY',
    creatingProfile: 'CREATING PROFILE...',
    alreadyHaveAccount: 'Already have an account?',
    signInToDashboard: 'SIGN IN TO YOUR DASHBOARD',
    checkEmail: 'Check your email for the confirmation link!',
    password: 'PASSWORD',
    minCharacters: 'Minimum 6 characters'
  },
  ar: {
    about: 'عن الأكاديمية',
    portfolio: 'الملف المهني',
    takeTest: 'خض الاختبار',
    startAssessment: 'ابدأ التقييم',
    learnMore: 'تعرف على المزيد',
    experienceMagnificence: 'اختبر الروعة في التعلم',
    aboutText1: 'في لنجوابلانيت، نؤمن بأن اللغة هي أكثر من مجرد كلمات - إنها المفتاح لفتح إمكاناتك المهنية. يدمج منهجنا بين إتقان اللغة الإنجليزية المتقدمة والمهارات الشخصية الأساسية مثل القيادة والخطابة والذكاء العاطفي.',
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
    allRights: 'جميع الحقوق محفوظة.',
    standardsTitle: 'معيار لنجوابلانيت',
    operationalExcellence: 'التميز التشغيلي',
    qualityAssurance: 'ضمان الجودة',
    eliteAcademicRigor: 'الصرامة الأكاديمية المتميزة',
    qa1: 'نهج مبتكرة وعالية المستوى في تعليم اللغة.',
    qa2: 'معايير عالمية للتقييم والاختبار.',
    qa3: 'نتائج سريعة مضمونة من خلال هندسة النجاح.',
    flexibilityTitle: 'المرونة',
    adaptiveDelivery: 'تقديم الخدمة المرنة',
    flexibilityDesc: 'طرق تقديم الخدمة (حضورياً/عبر الإنترنت) في مقرنا أو مقر العميل. مواعيد وتوقيتات مرنة مصممة لتناسب حياتك.',
    pricingTitle: 'التسعير',
    transparentInvestment: 'استثمار شفاف',
    pricingDesc: 'مجموعة متنوعة من الخطط لتناسب احتياجاتك بأسعار تنافسية للغاية. خيارات دفع مرنة متعددة متاحة لجميع البرامج.',
    trackingTitle: 'المتابعة',
    reportingFollowup: 'التقارير والمتابعة',
    trackingDesc: 'تقارير مفصلة عن أداء الطلاب، إخطار فوري بالمواعيد، وتتبع منهجي للتقدم.',
    guaranteesTitle: 'الضمانات',
    institutionalSupport: 'الدعم المؤسسي',
    guaranteesDesc: 'دعم إضافي للطلاب الضعاف، حصص مراجعة مجانية، وانفتاح تام على الملاحظات والقدرة على التكيف.',
    facingChallenges: 'هل تواجه تحديات؟',
    challenges1: 'يمتلك العديد من المرشحين إمكانات كبيرة ولكنهم يفتقرون إلى متطلبات اللغة الإنجليزية.',
    challenges2: 'غالباً ما تعيق القدرات اللغوية الضعيفة الدخول إلى البرامج المرموقة.',
    challenges3: 'نحن نسد الفجوة بين الإمكانات والإنجاز.',
    safeHands: 'أنت في أيدٍ أمينة',
    safeHandsDesc: 'في لنجوابلانيت، انتهت معضلة مقدمي الخدمات ذوي الجودة المنخفضة والتكاليف المرتفعة. نحن نقدم خدمات لغوية ممتازة بجزء بسيط من سعر السوق.',
    institutionalGuarantee: 'ضمان الدرجة المؤسسية',
    sendMessage: 'أرسل لنا رسالة',
    yourName: 'اسمك',
    emailAddress: 'البريد الإلكتروني',
    message: 'الرسالة',
    sending: 'جاري الإرسال...',
    messageSent: 'تم إرسال الرسالة!',
    tryAgain: 'حاول مرة أخرى',
    thankYouMessage: 'شكراً لك! سنرد عليك قريباً.',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    returnHome: 'العودة للرئيسية',
    pillars: 'أركاننا الأساسية',
    valuesTitle: 'القيم التي نؤمن بها',
    excellence: 'التميز',
    excellenceDesc: 'نسعى لتحقيق أعلى مستويات الجودة في كل برنامج تعليمي نقدمه.',
    integrity: 'النزاهة',
    integrityDesc: 'الصدق والشفافية هما جوهر علاقاتنا المؤسسية.',
    innovation: 'الابتكار',
    innovationDesc: 'تطوير مستمر لأساليبنا لمواكبة مستقبل التواصل العالمي.',
    worldClassAcademy: 'أكاديمية لغات عالمية المستوى',
    programs: 'البرامج',
    team: 'فريقنا',
    arabicInterface: 'الواجهة العربية',
    englishInterface: 'الإجهة الإنجليزية',
    evaluationComplete: 'اكتمل التقييم',
    predictedLevel: 'مستوى كفاءتك التنبؤي',
    foundationTrack: 'أساسيات اللغة الإنجليزية',
    professionalTrack: 'اتصالات مهنية للمحترفين',
    executiveTrack: 'القيادة التنفيذية والبلاغة المتقدمة',
    returnToPortal: 'العودة للرئيسية',
    secureResults: 'احفظ نتائجك',
    finalStep: 'الخطوة الأخيرة',
    generateReport: 'إنشاء تقرير الإتقان',
    selectRange: 'اختر الفئة...',
    kids: 'الأطفال (6-12)',
    teens: 'الناشئين (13-17)',
    adults: 'الكبار (18+)',
    finalAssessment: 'التقييم النهائي',
    writingEvaluation: 'تقييم الكتابة',
    writingPrompt: 'اختر أحد المواضيع التالية (100-150 كلمة):',
    writingTopic1: 'وظيفتك الأولى وروتينك اليومي.',
    writingTopic2: 'بلد زرته في عطلتك الأخيرة.',
    submitAssessment: 'إرسال التقييم',
    phone: 'رقم الهاتف',
    part: 'الجزء',
    complete: 'مكتمل',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    welcomeBack: 'مرحباً بعودتك',
    enterCredentials: 'أدخل بيانات الاعتماد الخاصة بك',
    dontHaveAccount: 'ليس لديك حساب؟',
    createProfile: 'إنشاء ملف تعريف طالب',
    authenticating: 'جاري التحقق...',
    joinAcademy: 'انضم إلى لنجوابلانيت',
    startJourney: 'ابدأ رحلتك المهنية',
    creatingProfile: 'جاري إنشاء ملف التعريف...',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInToDashboard: 'تسجيل الدخول إلى لوحة التحكم الخاصة بك',
    checkEmail: 'تحقق من بريدك الإلكتروني للحصول على رابط التأكيد!',
    password: 'كلمة المرور',
    minCharacters: '6 أحرف على الأقل'
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
