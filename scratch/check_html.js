const fs = require('fs');
const html = fs.readFileSync('web/index.html', 'utf8');

// Check duplicate IDs
const idMatches = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
const idCounts = {};
idMatches.forEach(id => {
  idCounts[id] = (idCounts[id] || 0) + 1;
});
const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
console.log('Duplicate IDs:', duplicates);

// Check all buttons
const buttonMatches = [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)];
console.log('Total buttons found:', buttonMatches.length);

buttonMatches.forEach((btn, i) => {
  const full = btn[0];
  const inner = btn[1].replace(/<[^>]+>/g, '').trim();
  const idMatch = full.match(/id="([^"]+)"/);
  const classMatch = full.match(/class="([^"]+)"/);
  const id = idMatch ? idMatch[1] : null;
  const classes = classMatch ? classMatch[1] : '';
  const isTab = classes.includes('nav-tab-btn');
  const isFilter = classes.includes('filter-chip') || classes.includes('roster-filter-btn') || classes.includes('badge-filter-btn');
  const isSim = full.includes('sim-');
  const isAction = classes.includes('btn-select-trek') || classes.includes('btn-view-spec');
  
  if (!id && !isTab && !isFilter && !isAction) {
    console.log(`Button ${i + 1} without ID/specific class: "${inner}"`, full.slice(0, 100));
  }
});
