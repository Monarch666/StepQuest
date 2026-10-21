const fs = require('fs');
const c = fs.readFileSync('web/index.html', 'utf8');
const cards = c.match(/<article[^>]*class="route-card[^"]*"[^>]*>/g) || [];
cards.forEach((card, i) => {
  console.log(`Card ${i + 1}:`, card);
});
