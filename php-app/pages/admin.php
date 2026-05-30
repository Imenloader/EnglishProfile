<?php
$pageTitle = 'Admin Dashboard | Linguaplanet';
require_once __DIR__ . '/../includes/head.php';
?>
<main class="marble-pattern" style="min-height:100vh;background:var(--bg-color);color:var(--text-color);display:flex;flex-direction:column">
  
  <!-- Login Overlay -->
  <div id="loginOverlay" style="position:fixed;inset:0;background:var(--primary-navy);z-index:9999;display:flex;align-items:center;justify-content:center">
    <form id="loginForm" class="glass-dark" style="padding:4rem;width:100%;max-width:450px;border-radius:32px;text-align:center;background:rgba(1,22,39,.95);border:1px solid rgba(255,255,255,.08)">
      <div style="width:60px;height:60px;background:var(--accent-gold);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 2rem">
        <i class="fa-solid fa-lock" style="color:var(--primary-navy);font-size:1.5rem"></i>
      </div>
      <h2 style="color:white;margin-bottom:1rem;font-size:2rem;font-family:var(--font-serif)">Admin Access</h2>
      <input type="password" id="adminPwd" placeholder="SECURITY PASSWORD" required style="width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);padding:1.2rem;margin-bottom:2rem;border-radius:12px;color:white;text-align:center;letter-spacing:4px">
      <button type="submit" class="btn-master btn-gold" style="width:100%;justify-content:center">UNLOCK PORTAL</button>
    </form>
  </div>

  <?php require_once __DIR__ . '/../includes/navbar.php'; ?>

  <!-- Header -->
  <div style="padding:8rem 4rem 2rem;background:var(--bg-color-alt);border-bottom:1px solid var(--border-color)">
    <div style="max-width:1440px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:2rem">
      <div>
        <span style="color:var(--accent-gold);font-size:.7rem;font-weight:800;letter-spacing:4px">ADMINISTRATION</span>
        <h2 style="font-size:2.5rem;font-family:var(--font-serif);margin-top:.5rem">Elite Control</h2>
      </div>
      <nav style="display:flex;gap:.5rem;background:var(--bg-color);padding:.4rem;border-radius:16px;border:1px solid var(--border-color)">
        <button class="tab-btn active" data-tab="analytics"><i class="fa-solid fa-chart-line"></i> ANALYTICS</button>
        <button class="tab-btn" data-tab="leads"><i class="fa-solid fa-users"></i> STUDENT LEADS</button>
        <button class="tab-btn" data-tab="test"><i class="fa-solid fa-list"></i> TEST MANAGER</button>
      </nav>
    </div>
  </div>

  <div style="flex:1;padding:4rem;max-width:1440px;margin:0 auto;width:100%">
    
    <!-- Analytics Tab -->
    <div id="tab-analytics" class="tab-content" style="display:block">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;margin-bottom:4rem">
        <div class="card-premium" style="text-align:center">
          <span style="font-size:.7rem;opacity:.5;font-weight:800">TOTAL ASSESSMENTS</span>
          <div id="statTotal" style="font-size:3rem;font-weight:900;font-family:var(--font-serif);margin:1rem 0">0</div>
        </div>
        <div class="card-premium" style="text-align:center">
          <span style="font-size:.7rem;opacity:.5;font-weight:800">HIGH ACHIEVERS (C1/C2)</span>
          <div id="statHigh" style="font-size:3rem;font-weight:900;font-family:var(--font-serif);margin:1rem 0;color:var(--accent-gold)">0</div>
        </div>
        <div class="card-premium" style="text-align:center">
          <span style="font-size:.7rem;opacity:.5;font-weight:800">AVERAGE SCORE</span>
          <div id="statAvg" style="font-size:3rem;font-weight:900;font-family:var(--font-serif);margin:1rem 0;color:var(--accent-blue)">0%</div>
        </div>
      </div>
    </div>

    <!-- Leads Tab -->
    <div id="tab-leads" class="tab-content" style="display:none">
      <div class="glass-card" style="padding:2rem;border-radius:24px">
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;text-align:left">
            <thead>
              <tr style="border-bottom:1px solid var(--border-color)">
                <th style="padding:1.5rem;font-size:.7rem;opacity:.5;letter-spacing:2px">DATE</th>
                <th style="padding:1.5rem;font-size:.7rem;opacity:.5;letter-spacing:2px">STUDENT</th>
                <th style="padding:1.5rem;font-size:.7rem;opacity:.5;letter-spacing:2px">SCORE</th>
                <th style="padding:1.5rem;font-size:.7rem;opacity:.5;letter-spacing:2px">LEVEL</th>
              </tr>
            </thead>
            <tbody id="leadsTableBody">
              <tr><td colspan="4" style="text-align:center;padding:3rem">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Test Manager Tab -->
    <div id="tab-test" class="tab-content" style="display:none">
      <div style="margin-bottom:2rem;text-align:right">
        <button class="btn-master btn-gold" onclick="openAddQuestion()">ADD QUESTION <i class="fa-solid fa-plus"></i></button>
      </div>
      <div class="glass-card" style="padding:2rem;border-radius:24px">
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;text-align:left">
            <thead>
              <tr style="border-bottom:1px solid var(--border-color)">
                <th style="padding:1.5rem;font-size:.7rem;opacity:.5;letter-spacing:2px">PART</th>
                <th style="padding:1.5rem;font-size:.7rem;opacity:.5;letter-spacing:2px">QUESTION</th>
                <th style="padding:1.5rem;font-size:.7rem;opacity:.5;letter-spacing:2px">LEVEL</th>
                <th style="padding:1.5rem;font-size:.7rem;opacity:.5;letter-spacing:2px">ACTIONS</th>
              </tr>
            </thead>
            <tbody id="questionsTableBody">
              <tr><td colspan="4" style="text-align:center;padding:3rem">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</main>

<style>
.tab-btn {
  background:transparent;
  color:var(--text-color);
  border:none;
  padding:.8rem 1.8rem;
  border-radius:12px;
  cursor:pointer;
  font-weight:800;
  font-size:.75rem;
  letter-spacing:1px;
  transition:all .3s ease;
}
.tab-btn.active {
  background:var(--accent-gold);
  color:var(--primary-navy);
}
</style>

<script>
document.getElementById('loginForm').onsubmit = (e) => {
  e.preventDefault();
  if(document.getElementById('adminPwd').value === 'admin123') {
    document.getElementById('loginOverlay').style.display = 'none';
    loadData();
  } else {
    alert('Invalid Password');
  }
};

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c=>c.style.display='none');
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
  };
});

async function loadData() {
  loadLeads();
  loadQuestions();
}

async function loadLeads() {
  try {
    const res = await fetch('/api/leads.php?include_answers=false');
    const data = await res.json();
    const leads = data.leads || [];
    
    // Analytics Update
    document.getElementById('statTotal').textContent = leads.length;
    document.getElementById('statHigh').textContent = leads.filter(l => l.level && l.level.includes('C')).length;
    const avg = leads.length ? Math.round(leads.reduce((sum,l)=>sum+(l.score/(l.total_questions||1)), 0) / leads.length * 100) : 0;
    document.getElementById('statAvg').textContent = avg + '%';

    // Table Update
    const tbody = document.getElementById('leadsTableBody');
    tbody.innerHTML = '';
    if(!leads.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:3rem">No leads found.</td></tr>';
      return;
    }
    leads.forEach(l => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,.05)';
      tr.innerHTML = `
        <td style="padding:1.5rem">${l.created_at ? l.created_at.split(' ')[0] : 'N/A'}</td>
        <td style="padding:1.5rem">
          <div style="font-weight:700">${l.name}</div>
          <div style="font-size:.8rem;opacity:.6">${l.email} | ${l.phone||'No Phone'}</div>
        </td>
        <td style="padding:1.5rem">${l.score} / ${l.total_questions}</td>
        <td style="padding:1.5rem"><span style="padding:.4rem .8rem;background:rgba(197,160,89,.1);color:var(--accent-gold);border-radius:8px;font-weight:800;font-size:.75rem">${l.level}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } catch(e) { console.error(e); }
}

async function loadQuestions() {
  try {
    const res = await fetch('/api/questions.php');
    const data = await res.json();
    const tbody = document.getElementById('questionsTableBody');
    tbody.innerHTML = '';
    const qs = data.questions || [];
    if(!qs.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:3rem">No questions found.</td></tr>';
      return;
    }
    qs.forEach(q => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,.05)';
      tr.innerHTML = `
        <td style="padding:1.5rem">Part ${q.part}</td>
        <td style="padding:1.5rem;max-width:400px;overflow:hidden;text-overflow:ellipsis">${q.question}</td>
        <td style="padding:1.5rem">${q.level}</td>
        <td style="padding:1.5rem">
          <button onclick="deleteQuestion('${q.id}')" style="background:none;border:none;color:#ef4444;cursor:pointer"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch(e) { console.error(e); }
}

async function deleteQuestion(id) {
  if(!confirm('Delete this question?')) return;
  await fetch('/api/questions.php', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})});
  loadQuestions();
}

function openAddQuestion() {
  alert('Add Question form would open here (Requires extending admin UI further). Use the API directly for now.');
}
</script>

<?php require_once __DIR__ . '/../includes/foot.php'; ?>
