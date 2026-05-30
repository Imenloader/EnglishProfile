<?php
$pageTitle = 'Linguaplanet | Where Success Becomes a Habit';
$pageDesc = 'Empowering language learners in Egypt with world-class English education.';
require_once __DIR__ . '/../includes/head.php';
?>
<?php require_once __DIR__ . '/../includes/navbar.php'; ?>

<div id="scrollProgress"></div>

<!-- HERO -->
<section class="hero-section" id="hero">
  <div class="hero-bg"></div>
  <div class="hero-bg-grid"></div>
  <div class="container hero-content">
    <div class="hero-badge animate-reveal" style="--aos-delay:0">
      <i class="fa-solid fa-circle-dot"></i>
      <span data-en="Egypt's Premier English Academy" data-ar="أكاديمية اللغة الإنجليزية الأولى في مصر">Egypt's Premier English Academy</span>
    </div>
    <h1 class="hero-headline animate-reveal">
      <span data-en="Where Success" data-ar="حيث يصبح">Where Success</span><br>
      <span class="gold-text" data-en="Becomes a Habit" data-ar="النجاح عادة">Becomes a Habit</span>
    </h1>
    <p class="hero-subheadline animate-reveal" data-en="We don't just teach English — we build the confidence, skills, and professional edge that transforms careers and opens global doors." data-ar="نحن لا ندرّس اللغة الإنجليزية فحسب — بل نبني الثقة والمهارات والميزة المهنية التي تغيّر المسيرات وتفتح الأبواب العالمية.">We don't just teach English — we build the confidence, skills, and professional edge that transforms careers and opens global doors.</p>
    <div class="hero-actions animate-reveal">
      <a href="/placement-test" class="btn-master btn-gold" data-en="START YOUR ASSESSMENT" data-ar="ابدأ اختبارك">START YOUR ASSESSMENT</a>
      <a href="#about" class="btn-master btn-white" data-en="DISCOVER MORE" data-ar="اكتشف المزيد">DISCOVER MORE</a>
    </div>
    <div class="hero-stats animate-reveal">
      <div>
        <span class="hero-stat-num">500+</span>
        <span class="hero-stat-label" data-en="Students Transformed" data-ar="طالب تم تحويلهم">Students Transformed</span>
      </div>
      <div>
        <span class="hero-stat-num">15+</span>
        <span class="hero-stat-label" data-en="Corporate Partners" data-ar="شراكات مؤسسية">Corporate Partners</span>
      </div>
      <div>
        <span class="hero-stat-num">6</span>
        <span class="hero-stat-label" data-en="CEFR Levels" data-ar="مستويات CEFR">CEFR Levels</span>
      </div>
    </div>
  </div>
</section>

<!-- PARTNERS MARQUEE -->
<section style="background:var(--bg-color-alt);padding:5rem 0;overflow:hidden">
  <div class="container">
    <div style="text-align:center;margin-bottom:3rem" data-aos="fade-up">
      <span style="color:var(--accent-gold);font-size:.75rem;font-weight:800;letter-spacing:2px;display:block;margin-bottom:1rem">
        <i class="fa-solid fa-circle-dot" style="margin-inline-end:.5rem"></i>
        <span data-en="TRUSTED BY" data-ar="موثوق من قبل">TRUSTED BY</span>
      </span>
      <h2 style="font-size:2rem;font-weight:800;color:var(--text-color)" data-en="Companies That Trust Us" data-ar="الشركات التي تثق بنا">Companies That Trust Us</h2>
    </div>
    <div class="marquee-wrap">
      <div class="marquee-track">
        <?php
        $partners = [
          ['name'=>'Etisalat International','logo'=>'/assets/images/partners/etisalat.jpg'],
          ['name'=>'Alameda','logo'=>'/assets/images/partners/alameda.jpg'],
          ['name'=>'Sonesta','logo'=>'/assets/images/partners/sonesta.jpg'],
          ['name'=>'Suez','logo'=>'/assets/images/partners/suez.jpg'],
          ['name'=>'Al-Azhar Graduates','logo'=>'/assets/images/partners/alazhar.jpg'],
          ['name'=>'Tamayyoz','logo'=>'/assets/images/partners/tamayyoz.jpg'],
          ['name'=>'GHC','logo'=>'/assets/images/partners/ghc.jpg'],
        ];
        // Triple for infinite loop
        $triplePartners = array_merge($partners, $partners, $partners);
        foreach ($triplePartners as $p): ?>
        <div class="glass-card" style="display:flex;align-items:center;justify-content:center;width:220px;height:140px;padding:1.5rem;border-radius:20px;flex-shrink:0;background:var(--card-bg);border:1px solid var(--border-color);overflow:hidden">
          <img src="<?= htmlspecialchars($p['logo']) ?>" alt="<?= htmlspecialchars($p['name']) ?>" style="max-width:100%;max-height:100%;object-fit:contain" loading="lazy">
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section id="about" style="padding:10rem 0;background:var(--bg-color)">
  <div class="container">
    <div class="grid-responsive" style="gap:clamp(3rem,10vw,8rem);align-items:center">
      <div data-aos="fade-up">
        <span class="overline">ABOUT</span>
        <h2 style="font-size:clamp(2.5rem,5vw,4rem);line-height:1.1;margin-bottom:3rem;color:var(--text-color)" data-en="Redefining English Education in Egypt" data-ar="إعادة تعريف تعليم اللغة الإنجليزية في مصر">Redefining English Education in Egypt</h2>
        <p style="font-size:1.2rem;line-height:1.8;color:var(--text-color-muted);margin-bottom:4rem;max-width:600px" data-en="Linguaplanet is Egypt's leading English language academy, offering bespoke corporate training, professional communication coaching, and internationally-recognized certification programs." data-ar="لينغوابلانيت هي الأكاديمية الرائدة لتعليم اللغة الإنجليزية في مصر.">Linguaplanet is Egypt's leading English language academy, offering bespoke corporate training, professional communication coaching, and internationally-recognized certification programs.</p>
        <div style="display:grid;gap:2.5rem">
          <?php
          $pillars = [
            ['icon'=>'fa-star','en_title'=>'World-Class Standards','ar_title'=>'معايير عالمية','en_desc'=>'Our methodology aligns with global CEFR standards.','ar_desc'=>'منهجيتنا تتوافق مع معايير CEFR العالمية.'],
            ['icon'=>'fa-tags','en_title'=>'Flexible & Accessible','ar_title'=>'مرن وميسور','en_desc'=>'Online and on-site options that fit your schedule.','ar_desc'=>'خيارات أونلاين وحضورية تناسب جدولك الزمني.'],
            ['icon'=>'fa-lightbulb','en_title'=>'Transformative Results','ar_title'=>'نتائج تحويلية','en_desc'=>'Measurable improvement, real-world application.','ar_desc'=>'تحسين قابل للقياس وتطبيق في العالم الحقيقي.'],
          ];
          foreach ($pillars as $i => $p): ?>
          <div style="display:flex;gap:1.5rem;align-items:flex-start" data-aos="fade-up" data-aos-delay="<?= $i*100 ?>">
            <div style="width:48px;height:48px;background:rgba(197,160,89,.1);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i class="fa-solid <?= $p['icon'] ?>" style="color:var(--accent-gold);font-size:1.2rem"></i>
            </div>
            <div>
              <h4 style="font-size:1.15rem;font-weight:700;color:var(--text-color);margin-bottom:.5rem" data-en="<?= $p['en_title'] ?>" data-ar="<?= $p['ar_title'] ?>"><?= $p['en_title'] ?></h4>
              <p style="font-size:.95rem;opacity:.7;line-height:1.6" data-en="<?= $p['en_desc'] ?>" data-ar="<?= $p['ar_desc'] ?>"><?= $p['en_desc'] ?></p>
            </div>
          </div>
          <?php endforeach; ?>
        </div>
      </div>
      <div data-aos="zoom-in" style="position:relative">
        <div style="border-radius:40px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.1)">
          <img src="/assets/images/about-vision.png" alt="About Linguaplanet" style="width:100%;height:auto;display:block" loading="lazy">
        </div>
        <div style="position:absolute;top:30px;inset-inline-end:-30px;width:100%;height:100%;border:2px solid var(--accent-gold);border-radius:40px;z-index:-1"></div>
      </div>
    </div>
  </div>
</section>

<!-- VALUES -->
<section style="padding:10rem 0;background:var(--bg-color-alt)">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="overline"><span data-en="OUR VALUES" data-ar="قيمنا">OUR VALUES</span></span>
      <h2 class="section-title" data-en="Built on Pillars That Matter" data-ar="مبني على أسس مهمة">Built on Pillars That Matter</h2>
    </div>
    <div class="grid-responsive" style="gap:2rem">
      <?php
      $values = [
        ['icon'=>'fa-award','en_title'=>'Excellence','ar_title'=>'التميز','en_desc'=>'We set the highest standards in English language education across Egypt.','ar_desc'=>'نضع أعلى المعايير في تعليم اللغة الإنجليزية في مصر.'],
        ['icon'=>'fa-arrows-spin','en_title'=>'Innovation','ar_title'=>'الابتكار','en_desc'=>'Our methods evolve constantly, blending pedagogy with modern tech.','ar_desc'=>'أساليبنا تتطور باستمرار، تجمع بين التعليم والتكنولوجيا الحديثة.'],
        ['icon'=>'fa-handshake-angle','en_title'=>'Community','ar_title'=>'المجتمع','en_desc'=>'We build lasting relationships between learners and mentors.','ar_desc'=>'نبني علاقات دائمة بين المتعلمين والمرشدين.'],
      ];
      foreach ($values as $i => $v): ?>
      <div class="glass-card" style="padding:4rem;border-radius:32px;text-align:center" data-aos="fade-up" data-aos-delay="<?= $i*100 ?>">
        <div style="font-size:3rem;color:var(--accent-gold);margin-bottom:2rem"><i class="fa-solid <?= $v['icon'] ?>"></i></div>
        <h3 style="color:var(--text-color);font-size:1.8rem;margin-bottom:1.5rem" data-en="<?= $v['en_title'] ?>" data-ar="<?= $v['ar_title'] ?>"><?= $v['en_title'] ?></h3>
        <p style="color:var(--text-color-muted)" data-en="<?= $v['en_desc'] ?>" data-ar="<?= $v['ar_desc'] ?>"><?= $v['en_desc'] ?></p>
      </div>
      <?php endforeach; ?>
    </div>
    <!-- Vision & Mission -->
    <div class="grid-2" style="margin-top:6rem;gap:3rem">
      <div class="glass-card" style="padding:4.5rem;border-radius:40px" data-aos="fade-right">
        <span class="overline"><span data-en="OUR VISION" data-ar="رؤيتنا">OUR VISION</span></span>
        <h3 style="color:var(--text-color);font-size:2.5rem;margin:1.5rem 0" data-en="To Be Egypt's #1 English Academy" data-ar="أن نكون الأكاديمية الأولى للغة الإنجليزية في مصر">To Be Egypt's #1 English Academy</h3>
        <p style="color:var(--text-color-muted);font-size:1.2rem;line-height:1.8" data-en="We envision a future where every Egyptian professional communicates with global confidence." data-ar="نتخيل مستقبلاً يتواصل فيه كل محترف مصري بثقة عالمية.">We envision a future where every Egyptian professional communicates with global confidence.</p>
      </div>
      <div class="glass-card" style="padding:4.5rem;border-radius:40px" data-aos="fade-left">
        <span class="overline"><span data-en="OUR MISSION" data-ar="مهمتنا">OUR MISSION</span></span>
        <h3 style="color:var(--text-color);font-size:2.5rem;margin:1.5rem 0" data-en="Empower Through Language" data-ar="التمكين من خلال اللغة">Empower Through Language</h3>
        <p style="color:var(--text-color-muted);font-size:1.2rem;line-height:1.8" data-en="To deliver world-class English language and soft-skills training that transforms Egyptian professionals." data-ar="تقديم تدريب عالمي المستوى على اللغة الإنجليزية والمهارات الشخصية.">To deliver world-class English language and soft-skills training that transforms Egyptian professionals.</p>
      </div>
    </div>
  </div>
</section>

<!-- WHY CHOOSE US -->
<section id="why-us" style="padding:10rem 0;background:var(--bg-color)">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="overline"><span data-en="WHY CHOOSE US" data-ar="لماذا نختارنا">WHY CHOOSE US</span></span>
      <h2 class="section-title" data-en="Why Linguaplanet?" data-ar="لماذا لينغوابلانيت؟">Why Linguaplanet?</h2>
    </div>
    <div class="grid-responsive" style="gap:2.5rem">
      <?php
      $whys = [
        ['icon'=>'fa-gem','en_title'=>'Quality Teaching','ar_title'=>'جودة التدريس','bullets_en'=>['Native & near-native instructors','Internationally certified trainers','Bespoke learning pathways'],'bullets_ar'=>['مدرسون أصليون وشبه أصليون','مدربون معتمدون دولياً','مسارات تعلم مخصصة']],
        ['icon'=>'fa-clock-rotate-left','en_title'=>'Flexible Learning','ar_title'=>'تعلم مرن','bullets_en'=>['Online & offline options','Morning, evening & weekend slots'],'bullets_ar'=>['خيارات أونلاين وحضورية','مواعيد صباح ومساء وعطل']],
        ['icon'=>'fa-wallet','en_title'=>'Competitive Pricing','ar_title'=>'أسعار تنافسية','bullets_en'=>['Transparent fee structure','Group & corporate discounts','Flexible payment plans'],'bullets_ar'=>['هيكل رسوم شفاف','خصومات جماعية ومؤسسية','خطط دفع مرنة']],
        ['icon'=>'fa-chart-line','en_title'=>'Progress Reporting','ar_title'=>'تقارير التقدم','bullets_en'=>['Monthly performance reports','CEFR level tracking','Detailed analytics'],'bullets_ar'=>['تقارير أداء شهرية','تتبع مستوى CEFR','تحليلات تفصيلية']],
        ['icon'=>'fa-shield-halved','en_title'=>'Our Guarantee','ar_title'=>'ضمانتنا','bullets_en'=>['Satisfaction guarantee','Progress guarantee','Make-up sessions included'],'bullets_ar'=>['ضمان الرضا','ضمان التقدم','جلسات تعويضية مشمولة']],
      ];
      foreach ($whys as $i => $w): ?>
      <div class="card-premium" style="border-top:4px solid var(--accent-gold)" data-aos="fade-up" data-aos-delay="<?= $i*50 ?>">
        <div style="width:60px;height:60px;background:rgba(197,160,89,.1);border-radius:15px;display:flex;align-items:center;justify-content:center;margin-bottom:2rem">
          <i class="fa-solid <?= $w['icon'] ?>" style="color:var(--accent-gold);font-size:1.5rem"></i>
        </div>
        <h3 style="font-size:1.6rem;margin-bottom:1.5rem;color:var(--text-color)" data-en="<?= $w['en_title'] ?>" data-ar="<?= $w['ar_title'] ?>"><?= $w['en_title'] ?></h3>
        <ul style="list-style:none;padding:0;display:grid;gap:1rem">
          <?php foreach ($w['bullets_en'] as $j => $b): ?>
          <li style="display:flex;gap:1rem;opacity:.7;font-size:.95rem;line-height:1.4">
            <i class="fa-solid fa-circle-check" style="color:var(--accent-gold);margin-top:3px"></i>
            <span data-en="<?= htmlspecialchars($b) ?>" data-ar="<?= htmlspecialchars($w['bullets_ar'][$j]) ?>"><?= htmlspecialchars($b) ?></span>
          </li>
          <?php endforeach; ?>
        </ul>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- PROGRAMS -->
<section id="services" style="padding:10rem 0;background:var(--bg-color-alt)">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="overline"><span data-en="ACADEMIC TRACKS" data-ar="المسارات الأكاديمية">ACADEMIC TRACKS</span></span>
      <h2 class="section-title" data-en="Our Programs" data-ar="برامجنا">Our Programs</h2>
    </div>
    <div class="grid-responsive" style="gap:2.5rem">
      <?php
      $programs = [
        ['icon'=>'fa-book-open','en_title'=>'General English','ar_title'=>'الإنجليزية العامة','en_desc'=>'A comprehensive English language program covering speaking, listening, reading, and writing.','ar_desc'=>'برنامج إنجليزي شامل يغطي التحدث والاستماع والقراءة والكتابة.'],
        ['icon'=>'fa-comments','en_title'=>'Conversational English','ar_title'=>'الإنجليزية المحادثة','en_desc'=>'Build confidence and fluency through immersive conversation practice with native-like instructors.','ar_desc'=>'بناء الثقة والطلاقة من خلال ممارسة المحادثة المكثفة.'],
        ['icon'=>'fa-briefcase','en_title'=>'Business English','ar_title'=>'إنجليزية الأعمال','en_desc'=>'Professional language skills for boardrooms, negotiations, presentations, and corporate communication.','ar_desc'=>'مهارات لغوية مهنية لغرف الاجتماعات والمفاوضات والعروض التقديمية.'],
        ['icon'=>'fa-graduation-cap','en_title'=>'IELTS Preparation','ar_title'=>'تحضير IELTS','en_desc'=>'Expert-led preparation for IELTS Academic and General Training with proven score improvement strategies.','ar_desc'=>'تحضير متخصص لـ IELTS مع استراتيجيات مجربة لتحسين الدرجات.'],
        ['icon'=>'fa-certificate','en_title'=>'Cambridge Exams','ar_title'=>'امتحانات كامبريدج','en_desc'=>'Full preparation for B2 First (FCE), C1 Advanced (CAE), and C2 Proficiency (CPE) exams.','ar_desc'=>'تحضير كامل لامتحانات كامبريدج B2 و C1 و C2.'],
        ['icon'=>'fa-lightbulb','en_title'=>'Soft Skills Training','ar_title'=>'تدريب المهارات الشخصية','en_desc'=>'Leadership, presentation, emotional intelligence, and professional communication workshops.','ar_desc'=>'ورش عمل في القيادة والعروض التقديمية والذكاء العاطفي.'],
      ];
      foreach ($programs as $i => $p): ?>
      <div class="card-premium" style="border-radius:32px;padding:3rem" data-aos="fade-up" data-aos-delay="<?= $i*50 ?>">
        <div style="font-size:2.5rem;color:var(--accent-gold);margin-bottom:1.5rem"><i class="fa-solid <?= $p['icon'] ?>"></i></div>
        <h3 style="font-size:1.8rem;margin-bottom:1rem;color:var(--text-color)" data-en="<?= $p['en_title'] ?>" data-ar="<?= $p['ar_title'] ?>"><?= $p['en_title'] ?></h3>
        <p style="color:var(--text-color-muted);line-height:1.7" data-en="<?= htmlspecialchars($p['en_desc']) ?>" data-ar="<?= htmlspecialchars($p['ar_desc']) ?>"><?= htmlspecialchars($p['en_desc']) ?></p>
        <button onclick="openContactModal()" style="display:inline-block;margin-top:2rem;color:var(--accent-gold);font-weight:800;font-size:.8rem;letter-spacing:1px;text-decoration:none;background:none;border:none;cursor:pointer;font-family:inherit">
          <span data-en="Explore Track" data-ar="استكشف المسار">Explore Track</span> <i class="fa-solid fa-arrow-right" style="margin-inline-start:.5rem"></i>
        </button>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- TEAM -->
<section id="team" style="padding:8rem 0;background:var(--bg-color)">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="overline" style="color:var(--accent-blue)"><span data-en="EXECUTIVE LEADERSHIP" data-ar="القيادة التنفيذية">EXECUTIVE LEADERSHIP</span></span>
      <h2 class="section-title" data-en="The Minds Behind Success" data-ar="العقول وراء النجاح">The Minds Behind Success</h2>
    </div>
    <div class="grid-responsive" style="gap:3rem">
      <?php
      $team = [
        ['name_en'=>'Maged','name_ar'=>'ماجد','role_en'=>'General Manager','role_ar'=>'المدير العام','img'=>'/assets/images/team/GM-new.png'],
        ['name_en'=>'Raafat','name_ar'=>'رأفت','role_en'=>'Recruitment Director','role_ar'=>'مدير التوظيف','img'=>'/assets/images/team/Recruitment-new.png'],
        ['name_en'=>'Ibrahim','name_ar'=>'إبراهيم','role_en'=>'Marketing Director','role_ar'=>'مدير التسويق','img'=>'/assets/images/team/Marketing-new.png'],
      ];
      foreach ($team as $i => $m): ?>
      <div style="text-align:center" data-aos="fade-up" data-aos-delay="<?= $i*100 ?>">
        <div style="width:180px;height:180px;border-radius:50%;margin:0 auto 2rem;border:4px solid white;box-shadow:0 15px 40px rgba(0,0,0,.1);overflow:hidden;background:var(--bg-color-alt)">
          <img src="<?= $m['img'] ?>" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy">
        </div>
        <h4 style="font-size:1.4rem;font-weight:800;color:var(--text-color)" data-en="<?= $m['name_en'] ?>" data-ar="<?= $m['name_ar'] ?>"><?= $m['name_en'] ?></h4>
        <p style="color:var(--accent-gold);font-weight:700;font-size:.75rem;letter-spacing:1px;margin-top:.5rem;text-transform:uppercase" data-en="<?= $m['role_en'] ?>" data-ar="<?= $m['role_ar'] ?>"><?= $m['role_en'] ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- CEFR JOURNEY -->
<section style="padding:10rem 0;background:var(--bg-color-alt);border-top:1px solid var(--border-color);border-bottom:1px solid var(--border-color);overflow:hidden">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="overline"><span data-en="YOUR JOURNEY" data-ar="رحلتك">YOUR JOURNEY</span></span>
      <h2 class="section-title" data-en="The Path to Mastery" data-ar="طريق الإتقان">The Path to Mastery</h2>
    </div>
    <!-- Desktop -->
    <div class="desktop-trajectory" data-aos="zoom-in" style="padding:4rem 0;overflow-x:auto">
      <div style="min-width:900px;position:relative">
        <div style="position:absolute;top:30px;left:8%;right:8%;height:4px;background:linear-gradient(90deg,var(--accent-gold) 0%,rgba(197,160,89,.2) 100%);border-radius:2px;z-index:1"></div>
        <div style="display:flex;justify-content:space-between;position:relative;z-index:2;padding:0 5%">
          <?php
          $cefr = [
            ['id'=>'A1','label_en'=>'Beginner','label_ar'=>'مبتدئ','desc_en'=>'Basic communication in familiar contexts.','desc_ar'=>'تواصل أساسي في السياقات المألوفة.'],
            ['id'=>'A2','label_en'=>'Elementary','label_ar'=>'ابتدائي','desc_en'=>'Simple phrases and everyday expressions.','desc_ar'=>'عبارات بسيطة وتعبيرات يومية.'],
            ['id'=>'B1','label_en'=>'Intermediate','label_ar'=>'متوسط','desc_en'=>'Handle most situations while traveling.','desc_ar'=>'التعامل مع معظم المواقف أثناء السفر.'],
            ['id'=>'B1+','label_en'=>'Upper-Int','label_ar'=>'متوسط متقدم','desc_en'=>'Expanding fluency and vocabulary.','desc_ar'=>'توسيع الطلاقة والمفردات.'],
            ['id'=>'B2','label_en'=>'Upper-Adv','label_ar'=>'متقدم','desc_en'=>'Complex texts and abstract topics.','desc_ar'=>'النصوص المعقدة والمواضيع المجردة.'],
            ['id'=>'C1','label_en'=>'Advanced','label_ar'=>'متمكن','desc_en'=>'Flexible, effective language use.','desc_ar'=>'استخدام لغوي مرن وفعّال.','star'=>true],
          ];
          foreach ($cefr as $m): ?>
          <div style="display:flex;flex-direction:column;align-items:center;text-align:center;width:140px">
            <div class="milestone-circle" style="width:60px;height:60px;background:var(--bg-color);border:2.5px solid var(--accent-gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--text-color);box-shadow:0 0 25px rgba(197,160,89,.35);cursor:pointer;transition:all .4s ease">
              <?= !empty($m['star']) ? '<i class="fa-solid fa-star"></i>' : htmlspecialchars($m['id']) ?>
            </div>
            <div style="margin-top:1.5rem">
              <h4 style="color:var(--accent-gold);font-size:1.1rem;font-weight:800;text-transform:uppercase;margin-bottom:.5rem;letter-spacing:1px"><?= htmlspecialchars($m['id']) ?></h4>
              <span style="color:var(--text-color);font-size:.85rem;display:block;font-weight:700" data-en="<?= htmlspecialchars($m['label_en']) ?>" data-ar="<?= htmlspecialchars($m['label_ar']) ?>"><?= htmlspecialchars($m['label_en']) ?></span>
              <p style="color:var(--text-color-muted);font-size:.75rem;margin-top:.5rem;line-height:1.5" data-en="<?= htmlspecialchars($m['desc_en']) ?>" data-ar="<?= htmlspecialchars($m['desc_ar']) ?>"><?= htmlspecialchars($m['desc_en']) ?></p>
            </div>
          </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
    <!-- Mobile -->
    <div class="mobile-trajectory" data-aos="fade-up">
      <div style="display:flex;flex-direction:column;gap:3rem;align-items:center;position:relative">
        <div style="position:absolute;left:50%;top:0;bottom:0;width:2px;background:var(--accent-gold);opacity:.3;transform:translateX(-50%)"></div>
        <?php foreach ($cefr as $m): ?>
        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;width:100%;max-width:280px;position:relative;z-index:2">
          <div style="width:45px;height:45px;border-radius:50%;background:var(--accent-gold);display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:800;color:var(--primary-navy);margin-bottom:1.2rem;box-shadow:0 0 30px var(--accent-gold)">
            <?= !empty($m['star']) ? '<i class="fa-solid fa-star" style="font-size:.8rem"></i>' : htmlspecialchars($m['id']) ?>
          </div>
          <h4 style="color:var(--accent-gold);font-size:1.1rem;font-weight:800;margin-bottom:.5rem" data-en="<?= htmlspecialchars($m['label_en']) ?>" data-ar="<?= htmlspecialchars($m['label_ar']) ?>"><?= htmlspecialchars($m['label_en']) ?></h4>
          <p style="color:var(--text-color);opacity:.8;font-size:.9rem;line-height:1.6" data-en="<?= htmlspecialchars($m['desc_en']) ?>" data-ar="<?= htmlspecialchars($m['desc_ar']) ?>"><?= htmlspecialchars($m['desc_en']) ?></p>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
  <style>
    .desktop-trajectory { display:block; }
    .mobile-trajectory { display:none; }
    @media(max-width:768px) { .desktop-trajectory{display:none;} .mobile-trajectory{display:block;} }
    .milestone-circle:hover { background:var(--accent-gold)!important;color:var(--primary-navy)!important;transform:scale(1.15); }
  </style>
</section>

<!-- CTA / CONTACT -->
<section id="contact" style="padding:10rem 0;background:var(--bg-color);position:relative;overflow:hidden">
  <div class="container" style="position:relative;z-index:2">
    <div class="grid-responsive" style="gap:3rem;align-items:stretch">
      <!-- Card 1: Placement Test -->
      <div class="card-premium" data-aos="fade-up" style="text-align:center;padding:3rem 2rem;display:flex;flex-direction:column;align-items:center">
        <span class="overline">01 / <span data-en="PLACEMENT TEST" data-ar="اختبار تحديد المستوى">PLACEMENT TEST</span></span>
        <h3 style="font-size:2rem;margin-bottom:1rem;color:var(--text-color)" data-en="Placement Test" data-ar="اختبار تحديد المستوى">Placement Test</h3>
        <p style="color:var(--text-color-muted);margin-bottom:2.5rem;font-size:.95rem;max-width:280px" data-en="Discover your CEFR level instantly with our free online assessment." data-ar="اكتشف مستواك في CEFR فوراً مع اختبارنا المجاني.">Discover your CEFR level instantly with our free online assessment.</p>
        <div style="flex:1"></div>
        <a href="/placement-test" class="btn-master btn-gold" style="padding:1rem 2rem;font-size:.75rem" data-en="START TEST NOW" data-ar="ابدأ الاختبار الآن">START TEST NOW</a>
      </div>
      <!-- Card 2: WhatsApp -->
      <div class="card-premium" data-aos="fade-up" data-aos-delay="200" style="text-align:center;padding:3rem 2rem;display:flex;flex-direction:column;align-items:center">
        <span class="overline">02 / <span data-en="WHATSAPP CHAT" data-ar="واتساب">WHATSAPP CHAT</span></span>
        <h3 style="font-size:2rem;margin-bottom:1rem;color:var(--text-color)" data-en="Direct Dialogue" data-ar="حوار مباشر">Direct Dialogue</h3>
        <p style="color:var(--text-color-muted);margin-bottom:2.5rem;font-size:.95rem;max-width:280px" data-en="Chat directly with our team for immediate support and inquiries." data-ar="تحدث مباشرة مع فريقنا للحصول على دعم فوري.">Chat directly with our team for immediate support and inquiries.</p>
        <div style="flex:1"></div>
        <a href="https://wa.me/201270068237" target="_blank" class="btn-master btn-gold" style="padding:1rem 2rem;font-size:.75rem" data-en="CHAT ON WHATSAPP" data-ar="تحدث على واتساب">CHAT ON WHATSAPP</a>
      </div>
      <!-- Card 3: Email -->
      <div class="card-premium" data-aos="fade-up" data-aos-delay="400" style="text-align:center;padding:3rem 2rem;display:flex;flex-direction:column;align-items:center">
        <span class="overline">03 / <span data-en="EMAIL INQUIRY" data-ar="استفسار بريد إلكتروني">EMAIL INQUIRY</span></span>
        <h3 style="font-size:2rem;margin-bottom:1rem;color:var(--text-color)" data-en="Formal Inquiries" data-ar="استفسارات رسمية">Formal Inquiries</h3>
        <p style="color:var(--text-color-muted);margin-bottom:2.5rem;font-size:.95rem;max-width:280px" data-en="Send a formal inquiry and our team will respond within 24 hours." data-ar="أرسل استفساراً رسمياً وسيرد فريقنا خلال 24 ساعة.">Send a formal inquiry and our team will respond within 24 hours.</p>
        <div style="flex:1"></div>
        <button onclick="openContactModal()" class="btn-master btn-gold" style="padding:1rem 2rem;font-size:.75rem" data-en="SEND EMAIL" data-ar="إرسال بريد">SEND EMAIL</button>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:-30px;left:50%;transform:translateX(-50%);font-size:15vw;font-weight:900;color:rgba(10,17,40,0.015);white-space:nowrap;z-index:1;pointer-events:none;user-select:none" data-en="EXCELLENCE" data-ar="التميز">EXCELLENCE</div>
</section>

<!-- CONTACT MODAL -->
<div class="modal-backdrop" id="contactModal" onclick="if(event.target===this)closeContactModal()">
  <div class="modal-box">
    <button class="modal-close" onclick="closeContactModal()"><i class="fa-solid fa-xmark"></i></button>
    <h2 style="font-size:1.8rem;color:var(--text-color);margin-bottom:2.5rem;text-align:center" data-en="Send us a message" data-ar="أرسل لنا رسالة">Send us a message</h2>
    <form onsubmit="submitContactForm(event)" style="display:grid;gap:1.5rem">
      <div class="grid-2" style="gap:1.5rem">
        <div class="form-group">
          <label class="form-label" data-en="YOUR NAME" data-ar="اسمك">YOUR NAME</label>
          <input type="text" name="name" required class="form-input" placeholder="Ahmed Ali">
        </div>
        <div class="form-group">
          <label class="form-label" data-en="EMAIL ADDRESS" data-ar="البريد الإلكتروني">EMAIL ADDRESS</label>
          <input type="email" name="email" required class="form-input" placeholder="ahmed@example.com">
        </div>
      </div>
      <div class="grid-2" style="gap:1.5rem">
        <div class="form-group">
          <label class="form-label" data-en="PHONE" data-ar="الهاتف">PHONE</label>
          <input type="text" name="phone" class="form-input" placeholder="+20 100 000 0000">
        </div>
        <div class="form-group">
          <label class="form-label" data-en="PROGRAM" data-ar="البرنامج">PROGRAM</label>
          <select name="program" class="form-input" style="appearance:none;color-scheme:dark">
            <option>General English</option>
            <option>Business English</option>
            <option>IELTS Preparation</option>
            <option>Cambridge Exams</option>
            <option>Soft Skills</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" data-en="MESSAGE" data-ar="الرسالة">MESSAGE</label>
        <textarea name="message" required rows="4" class="form-input" style="resize:none" placeholder="Tell us about your goals..."></textarea>
      </div>
      <button type="submit" class="btn-master btn-gold" style="width:100%;justify-content:center;padding:1.2rem;font-size:.85rem">
        <span data-en="SEND MESSAGE" data-ar="إرسال الرسالة">SEND MESSAGE</span> <i class="fa-solid fa-paper-plane" style="margin-inline-start:.8rem"></i>
      </button>
    </form>
  </div>
</div>

<!-- WHATSAPP FAB -->
<a href="https://wa.me/201270068237" target="_blank" rel="noopener noreferrer" style="position:fixed;bottom:40px;inset-inline-end:40px;width:70px;height:70px;background:#25D366;border-radius:22px;display:flex;align-items:center;justify-content:center;color:white;font-size:2.5rem;box-shadow:0 20px 40px rgba(37,211,102,.4);z-index:9999;transition:all .5s ease;animation:whatsapp-pulse 2s infinite">
  <i class="fa-brands fa-whatsapp"></i>
</a>
<style>
@keyframes whatsapp-pulse {
  0%{box-shadow:0 0 0 0 rgba(37,211,102,.4);}
  70%{box-shadow:0 0 0 20px rgba(37,211,102,0);}
  100%{box-shadow:0 0 0 0 rgba(37,211,102,0);}
}
</style>

<!-- SCROLL TOP -->
<button id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})" style="position:fixed;bottom:130px;inset-inline-end:40px;width:50px;height:50px;background:var(--primary-navy);color:var(--accent-gold);border:1px solid var(--accent-gold);border-radius:12px;display:none;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;z-index:9998;transition:all .4s ease" class="">
  <i class="fa-solid fa-arrow-up"></i>
</button>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
<?php require_once __DIR__ . '/../includes/foot.php'; ?>
