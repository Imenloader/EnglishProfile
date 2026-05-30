const fs = require('fs');

let c = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
c = c.replace(/'\/api\/settings'/g, "'/api/settings.php'");
c = c.replace(/'\/api\/leads\?include_answers=true'/g, "'/api/leads.php?include_answers=true'");
c = c.replace(/'\/api\/questions'/g, "'/api/questions.php'");
c = c.replace(/`\/api\/questions\?id=\$\{id\}`/g, "`/api/questions.php?id=${id}`");
fs.writeFileSync('src/app/admin/page.tsx', c);

let c2 = fs.readFileSync('src/components/ContactForm.tsx', 'utf8');
c2 = c2.replace(/'\/api\/inquiries'/g, "'/api/inquiries.php'");
fs.writeFileSync('src/components/ContactForm.tsx', c2);
