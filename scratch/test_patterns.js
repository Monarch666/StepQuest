const fs = require('fs');

function getMain(filename) {
  const html = fs.readFileSync('stitch_downloads/' + filename, 'utf8');
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let content = m ? m[1] : '';
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  return content;
}

let dash = getMain('dashboard.html');
let map = getMain('map.html');
let leader = getMain('leaderboard.html');

console.log('1. Dash quest title match:', /Himalayan Sanctuary Route/i.test(dash));
console.log('2. Dash mileage match:', /214\.2 KM/i.test(dash));
console.log('3. Map sector match:', /Himalayan Ascent Sector/i.test(map));
console.log('4. Map daily cap match:', /18,500 \/ 25,000 steps/i.test(map));
console.log('5. Leaderboard arjun match:', /84,120/i.test(leader));
