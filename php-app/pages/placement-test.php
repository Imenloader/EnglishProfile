<?php
$pageTitle = 'Placement Test | Linguaplanet';
$pageDesc = 'Discover your CEFR English level with our free online placement test.';
require_once __DIR__ . '/../includes/head.php';
?>
<?php require_once __DIR__ . '/../includes/navbar.php'; ?>

<div id="placementApp" style="min-height:100vh;padding:10rem 0;background:var(--bg-color)">
  <div class="container" style="max-width:800px;margin:0 auto">
    <!-- State 1: Start/Lead Form -->
    <div id="viewStart" class="glass-card" style="padding:4rem;border-radius:32px;text-align:center">
      <span class="overline" data-en="PLACEMENT TEST" data-ar="اختبار تحديد المستوى">PLACEMENT TEST</span>
      <h1 style="font-size:3rem;color:var(--text-color);margin:1rem 0" data-en="Discover Your True Level" data-ar="اكتشف مستواك الحقيقي">Discover Your True Level</h1>
      <p style="color:var(--text-color-muted);margin-bottom:3rem" data-en="Complete this 30-minute test to find out your exact CEFR English level and recommended learning path." data-ar="أكمل هذا الاختبار الذي مدته 30 دقيقة لمعرفة مستواك الدقيق في الإنجليزية حسب معيار CEFR.">Complete this 30-minute test to find out your exact CEFR English level and recommended learning path.</p>
      
      <form id="leadForm" style="display:grid;gap:1.5rem;text-align:left">
        <div class="grid-2" style="gap:1.5rem">
          <div class="form-group">
            <label class="form-label" data-en="FULL NAME" data-ar="الاسم الكامل">FULL NAME</label>
            <input type="text" name="name" required class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label" data-en="EMAIL ADDRESS" data-ar="البريد الإلكتروني">EMAIL ADDRESS</label>
            <input type="email" name="email" required class="form-input">
          </div>
        </div>
        <div class="grid-2" style="gap:1.5rem">
          <div class="form-group">
            <label class="form-label" data-en="PHONE (OPTIONAL)" data-ar="الهاتف (اختياري)">PHONE (OPTIONAL)</label>
            <input type="text" name="phone" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label" data-en="AGE RANGE" data-ar="الفئة العمرية">AGE RANGE</label>
            <select name="age_range" class="form-input" style="appearance:none;color-scheme:dark" required>
              <option value="">Select Age</option>
              <option value="under18">Under 18</option>
              <option value="18-30">18 - 30</option>
              <option value="31-50">31 - 50</option>
              <option value="over50">50+</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn-master btn-gold" style="justify-content:center;padding:1.5rem;font-size:1rem;margin-top:1rem" id="btnStartTest">
          <span data-en="START THE TEST" data-ar="ابدأ الاختبار">START THE TEST</span> <i class="fa-solid fa-arrow-right" style="margin-inline-start:.8rem"></i>
        </button>
      </form>
    </div>

    <!-- State 2: Quiz -->
    <div id="viewQuiz" class="glass-card" style="padding:4rem;border-radius:32px;display:none">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;color:var(--text-color-muted)">
        <span style="font-weight:700;letter-spacing:2px;font-size:.85rem"><span data-en="QUESTION" data-ar="سؤال">QUESTION</span> <span id="qCurrent">1</span> / <span id="qTotal">0</span></span>
        <span style="font-weight:700;color:var(--accent-gold);letter-spacing:2px;font-size:.85rem">PART <span id="qPart">1</span></span>
      </div>
      <div style="width:100%;height:4px;background:rgba(255,255,255,.1);border-radius:2px;margin-bottom:3rem;overflow:hidden">
        <div id="qProgress" style="height:100%;background:var(--accent-gold);width:0%;transition:width .4s ease"></div>
      </div>
      <h2 id="qText" style="font-size:1.8rem;color:var(--text-color);margin-bottom:3rem;line-height:1.5">Loading question...</h2>
      <div id="qOptions" style="display:grid;gap:1rem"></div>
    </div>

    <!-- State 3: Result -->
    <div id="viewResult" class="glass-card" style="padding:4rem;border-radius:32px;text-align:center;display:none">
      <div style="width:100px;height:100px;border-radius:50%;background:rgba(197,160,89,.1);display:flex;align-items:center;justify-content:center;margin:0 auto 2rem">
        <i class="fa-solid fa-ranking-star" style="font-size:3rem;color:var(--accent-gold)"></i>
      </div>
      <h2 style="font-size:2rem;color:var(--text-color);margin-bottom:1rem" data-en="Your Assessment is Complete" data-ar="اكتمل تقييمك">Your Assessment is Complete</h2>
      <p style="color:var(--text-color-muted);margin-bottom:3rem">Based on your answers, your estimated level is:</p>
      
      <div style="display:inline-block;padding:2rem 4rem;border:2px solid var(--accent-gold);border-radius:20px;margin-bottom:3rem">
        <h1 id="resLevel" style="font-size:5rem;color:var(--accent-gold);margin:0;line-height:1;font-family:var(--font-serif)">A1</h1>
        <div id="resScore" style="color:var(--text-color);margin-top:1rem;font-weight:700;letter-spacing:2px">Score: 0 / 0</div>
      </div>
      
      <div>
        <a href="/" class="btn-master btn-gold" data-en="BACK TO HOME" data-ar="العودة للرئيسية">BACK TO HOME</a>
      </div>
    </div>
  </div>
</div>

<style>
.quiz-opt {
  padding:1.5rem 2rem;
  background:var(--bg-color);
  border:1px solid var(--border-color);
  border-radius:16px;
  color:var(--text-color);
  font-size:1.1rem;
  cursor:pointer;
  transition:all .3s ease;
  display:flex;
  align-items:center;
  gap:1rem;
}
.quiz-opt:hover {
  border-color:var(--accent-gold);
  background:rgba(197,160,89,.05);
}
.quiz-opt.selected {
  background:var(--accent-gold);
  color:var(--primary-navy);
  border-color:var(--accent-gold);
  font-weight:700;
}
</style>

<script>
let questions = [];
let currentIdx = 0;
let score = 0;
let leadData = {};
let studentAnswers = [];

async function loadQuestions() {
  try {
    const res = await fetch('/api/questions.php');
    const data = await res.json();
    if(data.questions && data.questions.length > 0) {
      questions = data.questions.map(q => ({
        id: q.id, text: q.question, options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correct: q.correct_answer, part: parseInt(q.part)||1, level: q.level
      }));
    }
  } catch(e) {
    console.error('Failed to load questions', e);
  }
}

function calculateLevel(score, total) {
  const pct = score / (total || 1);
  if(pct < 0.2) return 'A1';
  if(pct < 0.4) return 'A2';
  if(pct < 0.6) return 'B1';
  if(pct < 0.8) return 'B2';
  return 'C1';
}

function showQuestion(idx) {
  if(idx >= questions.length) {
    finishTest();
    return;
  }
  const q = questions[idx];
  document.getElementById('qCurrent').textContent = idx + 1;
  document.getElementById('qTotal').textContent = questions.length;
  document.getElementById('qPart').textContent = q.part;
  document.getElementById('qProgress').style.width = ((idx / questions.length) * 100) + '%';
  document.getElementById('qText').textContent = q.text;
  
  const optsDiv = document.getElementById('qOptions');
  optsDiv.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('div');
    btn.className = 'quiz-opt';
    btn.innerHTML = `<i class="fa-regular fa-circle"></i> <span>${opt}</span>`;
    btn.onclick = () => handleAnswer(q, opt, btn);
    optsDiv.appendChild(btn);
  });
}

function handleAnswer(q, answer, btnEl) {
  const isCorrect = answer === q.correct;
  if(isCorrect) score++;
  
  studentAnswers.push({
    question_text: q.text,
    student_answer: answer,
    correct_answer: q.correct,
    is_correct: isCorrect
  });
  
  btnEl.classList.add('selected');
  btnEl.querySelector('i').className = 'fa-solid fa-circle-check';
  
  setTimeout(() => {
    currentIdx++;
    showQuestion(currentIdx);
  }, 400);
}

async function finishTest() {
  document.getElementById('viewQuiz').style.display = 'none';
  document.getElementById('viewResult').style.display = 'block';
  
  const level = calculateLevel(score, questions.length);
  document.getElementById('resLevel').textContent = level;
  document.getElementById('resScore').textContent = `Score: ${score} / ${questions.length}`;
  
  leadData.score = score;
  leadData.total_questions = questions.length;
  leadData.level = level;
  leadData.answers = studentAnswers;
  
  try {
    await fetch('/api/leads.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(leadData)
    });
  } catch(e) {
    console.error('Failed to save lead', e);
  }
}

document.getElementById('leadForm').onsubmit = (e) => {
  e.preventDefault();
  if(questions.length === 0) {
    alert('Failed to load questions. Please try again.');
    return;
  }
  const fd = new FormData(e.target);
  leadData = Object.fromEntries(fd.entries());
  
  document.getElementById('viewStart').style.display = 'none';
  document.getElementById('viewQuiz').style.display = 'block';
  showQuestion(0);
};

document.addEventListener('DOMContentLoaded', loadQuestions);
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
<?php require_once __DIR__ . '/../includes/foot.php'; ?>
