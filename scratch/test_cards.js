const fs = require('fs');

function getMain(filename) {
  const html = fs.readFileSync('stitch_downloads/' + filename, 'utf8');
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let content = m ? m[1] : '';
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  return content;
}

let quests = getMain('quests.html');

quests = quests.replace(
  /<article\b([^>]*>(?:(?!<\/article)[\s\S])*?Delhi to Kedarnath)/i,
  (m) => `<article data-distance="464" data-quest-id="kedarnath" data-quest-name="Delhi to Kedarnath Corridor" ` + m.slice(9)
);

quests = quests.replace(
  /<article\b([^>]*>(?:(?!<\/article)[\s\S])*?Mumbai to Goa)/i,
  (m) => `<article data-distance="587" data-quest-id="goa" data-quest-name="Mumbai to Goa Konkan Trail" ` + m.slice(9)
);

quests = quests.replace(
  /<article\b([^>]*>(?:(?!<\/article)[\s\S])*?Manali to Leh)/i,
  (m) => `<article data-distance="474" data-quest-id="manali" data-quest-name="Manali to Leh Highway" ` + m.slice(9)
);

quests = quests.replace(
  /<article\b([^>]*>(?:(?!<\/article)[\s\S])*?Jaipur to Agra)/i,
  (m) => `<article data-distance="240" data-quest-id="jaipur" data-quest-name="Jaipur to Agra Heritage Trail" ` + m.slice(9)
);

const cards = quests.match(/<article[^>]*class="route-card[^"]*"[^>]*>/g) || [];
cards.forEach((card, i) => {
  console.log(`Card ${i + 1}:`, card);
});
