const { execSync } = require('child_process');
const path = require('path');

function analyzeFrontend() {
  const frontendDir = path.resolve(__dirname, '../client');
  let output;
  try {
    output = execSync('npx oxlint -f json', { cwd: frontendDir, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  } catch (err) {
    output = err.stdout;
  }
  const parsed = JSON.parse(output);
  const data = parsed.diagnostics || parsed;
  console.log('Total issues:', data.length);
  const map = {};
  data.forEach(d => {
    map[d.filename] = map[d.filename] || [];
    map[d.filename].push({
      rule: d.code,
      msg: d.message,
      line: d.labels?.[0]?.span?.line
    });
  });
  console.log(`\nFILES AFFECTED: ${Object.keys(map).length}\n`);
  for (const [k, v] of Object.entries(map)) {
    console.log(`File: ${k} (${v.length} issues)`);
    v.forEach(i => console.log(`   L${i.line}: [${i.rule}] ${i.msg}`));
  }
}

analyzeFrontend();
