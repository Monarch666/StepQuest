const fs = require('fs');
const path = require('path');

function getMain(filename) {
  const html = fs.readFileSync(path.join(__dirname, 'stitch_downloads', filename), 'utf8');
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let content = m ? m[1] : '';
  // Strip inline scripts to centralize all logic in stitch_app.js
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  return content;
}

let dash = getMain('dashboard.html');
let quests = getMain('quests.html');
let map = getMain('map.html');
let leader = getMain('leaderboard.html');
let ach = getMain('achievements.html');

/* ─── 1. Clean & Wire Dashboard ─────────────────────────────────────── */
// Sync Now button
dash = dash.replace(
  /<button class="[^"]*"[^>]*>\s*<span[^>]*>refresh<\/span>\s*Sync Now\s*<\/button>/i,
  `<button id="btn-sync-now" class="px-space-md py-space-xs bg-surface-container border border-surface-container-highest hover:bg-surface-container-high text-on-surface text-label-md font-label-md uppercase tracking-wider rounded transition-all flex items-center gap-space-xs cursor-pointer active:scale-95" title="Synchronize telemetry with wearable sensor stream">
    <span id="sync-icon" class="material-symbols-outlined text-base">refresh</span>
    <span id="sync-text">Sync Now</span>
  </button>`
);

// Timestamp element
dash = dash.replace(
  /<span[^>]*>(Updated \d+m? ago[^\<]*)<\/span>/i,
  `<span id="sync-timestamp" class="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider">$1</span>`
);

// Active Quest Card on Dashboard (Interactive trek details)
dash = dash.replace(
  /<span class="font-label-mono text-label-mono text-primary uppercase tracking-widest font-bold">Himalayan Sanctuary Route<\/span>\s*<h3 class="font-headline-md text-headline-md text-on-surface font-extrabold uppercase tracking-tight">Delhi to Kedarnath<\/h3>/i,
  `<span id="dash-quest-region" class="font-label-mono text-label-mono text-primary uppercase tracking-widest font-bold">Himalayan Sanctuary Route</span>
   <h3 id="dash-quest-title" class="font-headline-md text-headline-md text-on-surface font-extrabold uppercase tracking-tight">Delhi to Kedarnath</h3>`
);

dash = dash.replace(
  /<span class="text-on-surface font-bold uppercase tracking-wide">214\.2 KM <span class="text-outline font-normal">\/ 464\.0 KM<\/span><\/span>\s*<span class="text-primary font-bold">46% COMPLETED<\/span>/i,
  `<span id="dash-quest-mileage" class="text-on-surface font-bold uppercase tracking-wide">214.2 KM <span class="text-outline font-normal">/ 464.0 KM</span></span>
   <span id="dash-quest-pct" class="text-primary font-bold">46% COMPLETED</span>`
);

dash = dash.replace(
  /<div class="bg-primary-container h-full w-\[46%\]"><\/div>/i,
  `<div id="dash-quest-bar" class="bg-primary-container h-full transition-all duration-500" style="width: 46%;"></div>`
);

// Pedometer Quota Percent
dash = dash.replace(
  /<span class="font-metric-large text-metric-large text-on-surface font-extrabold leading-none tracking-tight">64<span class="text-headline-sm font-bold text-primary">%<\/span><\/span>/i,
  `<span id="dash-quota-pct" class="font-metric-large text-metric-large text-on-surface font-extrabold leading-none tracking-tight">64<span class="text-headline-sm font-bold text-primary">%</span></span>`
);

// Pedometer SVG gauge circle
dash = dash.replace(
  /<circle class="text-primary-container transition-all duration-1000 ease-out"/i,
  `<circle id="dash-gauge-circle" class="text-primary-container transition-all duration-500 ease-out"`
);

// Pedometer Step Count Readout
dash = dash.replace(
  /<span class="font-metric-display text-metric-display text-on-surface font-extrabold tracking-tight">6,420<\/span>/i,
  `<span id="dash-step-count" class="font-metric-display text-metric-display text-on-surface font-extrabold tracking-tight">6,420</span>`
);

// Steps Remaining Pill
dash = dash.replace(
  /<span class="px-space-xs py-0.5 bg-primary-container\/20 border border-primary-container\/40 text-primary-fixed-dim font-label-mono text-label-mono uppercase tracking-wider rounded">\s*3,580 Steps Remaining\s*<\/span>/i,
  `<span id="dash-steps-remaining" class="px-space-xs py-0.5 bg-primary-container/20 border border-primary-container/40 text-primary-fixed-dim font-label-mono text-label-mono uppercase tracking-wider rounded">3,580 Steps Remaining</span>`
);

// Daily Progress Bar Track
dash = dash.replace(
  /<div class="bg-primary-container h-full w-\[64%\]"><\/div>/i,
  `<div id="dash-daily-bar" class="bg-primary-container h-full transition-all duration-500" style="width: 64%;"></div>`
);

// Distance stat value
dash = dash.replace(
  /<div class="font-metric-large text-metric-large text-on-surface font-bold leading-none">4\.89<\/div>\s*<span class="font-label-mono text-label-mono text-on-surface-variant uppercase mt-space-xs block">Kilometers<\/span>/i,
  `<div id="dash-distance-val" class="font-metric-large text-metric-large text-on-surface font-bold leading-none">4.89</div>
   <span class="font-label-mono text-label-mono text-on-surface-variant uppercase mt-space-xs block">Kilometers</span>`
);

// Active Burn stat value
dash = dash.replace(
  /<div class="font-metric-large text-metric-large text-on-surface font-bold leading-none">270<\/div>\s*<span class="font-label-mono text-label-mono text-on-surface-variant uppercase mt-space-xs block">Kcal Expended<\/span>/i,
  `<div id="dash-kcal-val" class="font-metric-large text-metric-large text-on-surface font-bold leading-none">270</div>
   <span class="font-label-mono text-label-mono text-on-surface-variant uppercase mt-space-xs block">Kcal Expended</span>`
);


// Next Waypoint Sub-Card & Arrow
dash = dash.replace(
  /<!-- Highlighted Next Waypoint Sub-Card -->\s*<div\b/i,
  `<!-- Highlighted Next Waypoint Sub-Card -->\n<div id="card-next-waypoint" title="Click to inspect Rishikesh Foothills telemetry"`
);
dash = dash.replace(
  /(Rishikesh Foothills[\s\S]*?)<button class="w-9 h-9/i,
  `$1<button id="btn-next-waypoint" title="Inspect Rishikesh Foothills" class="w-9 h-9 cursor-pointer`
);

// Action buttons in dashboard
dash = dash.replace(
  /<button[^>]*>\s*<span[^>]*>add_circle<\/span>\s*Log Manual Walk\s*<\/button>/i,
  `<button id="btn-dash-log-walk" class="w-full py-space-sm bg-primary-container hover:bg-on-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider font-bold rounded transition-all flex items-center justify-center gap-space-xs active:scale-[0.98] cursor-pointer" title="Open Manual Step Entry modal">
    <span class="material-symbols-outlined text-base">add_circle</span>
    Log Manual Walk
  </button>`
);

dash = dash.replace(
  /<button[^>]*>\s*<span[^>]*>explore<\/span>\s*View Trail Map\s*<\/button>/i,
  `<button id="btn-dash-view-map" class="w-full py-space-sm bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-on-surface font-label-md text-label-md uppercase tracking-wider font-semibold rounded transition-all flex items-center justify-center gap-space-xs active:scale-[0.98] cursor-pointer" title="Navigate to Geographic Trail Map">
    <span class="material-symbols-outlined text-base">explore</span>
    View Trail Map
  </button>`
);

/* ─── 2. Clean & Wire Quests ─────────────────────────────────────────── */
// Sort by Distance button
quests = quests.replace(
  /<button[^>]*>([\s\S]*?DISTANCE \(HIGH → LOW\)[\s\S]*?)<\/button>/i,
  `<button id="btn-sort-distance" class="flex items-center gap-1 font-label-md text-label-md text-on-surface bg-surface-container-low hover:bg-surface-container px-space-sm py-space-xs rounded border border-surface-container-highest hover:border-primary-container transition-all cursor-pointer" title="Toggle sorting order between high and low distance">
    <span id="sort-distance-label">DISTANCE (HIGH → LOW)</span>
    <span id="sort-distance-icon" class="material-symbols-outlined text-sm leading-none text-outline">south</span>
  </button>`
);

// Uniquely tag each of the 4 Route Cards with accurate distance & metadata
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

// Tag action buttons in cards
quests = quests.replace(
  /<button class="([^"]*bg-primary-container[^"]*)" type="button">\s*<span[^>]*>navigation<\/span>\s*<span>Continue Quest<\/span>\s*<\/button>/gi,
  `<button class="$1 btn-select-trek cursor-pointer" type="button" title="Continue this quest">
    <span class="material-symbols-outlined text-lg leading-none">navigation</span>
    <span>Continue Quest</span>
  </button>`
);

quests = quests.replace(
  /<button class="([^"]*bg-primary-container[^"]*)" type="button">\s*<span[^>]*>add_task<\/span>\s*<span>Select Trek<\/span>\s*<\/button>/gi,
  `<button class="$1 btn-select-trek cursor-pointer" type="button" title="Select this trek">
    <span class="material-symbols-outlined text-lg leading-none">add_task</span>
    <span>Select Trek</span>
  </button>`
);

quests = quests.replace(
  /<button class="([^"]*bg-surface-container-low[^"]*)" type="button">\s*<span[^>]*>data_object<\/span>\s*<span>View Route Spec<\/span>\s*<\/button>/gi,
  `<button class="$1 btn-view-spec cursor-pointer" type="button" title="View technical route telemetry specifications">
    <span class="material-symbols-outlined text-lg leading-none text-outline">data_object</span>
    <span>View Route Spec</span>
  </button>`
);

// Replace native dialog in quests with modern accessible overlay modal
quests = quests.replace(
  /<dialog[^>]*id="spec-modal"[\s\S]*?<\/dialog>/i,
  `<div id="spec-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none hidden">
    <div class="bg-surface-container-low border border-surface-container-highest rounded-lg max-w-xl w-full p-space-lg text-on-surface shadow-2xl flex flex-col gap-space-md animate-in fade-in zoom-in-95 duration-150">
      <div class="flex items-center justify-between border-b border-surface-container-highest pb-space-sm">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-xl">insights</span>
          <h3 class="font-headline-sm text-headline-sm uppercase font-bold text-on-surface" id="spec-modal-title">Route Telemetry Spec</h3>
        </div>
        <button id="spec-close-btn" class="text-outline hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors cursor-pointer" type="button">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-space-md font-label-mono text-label-mono">
        <div class="p-space-md bg-surface-container-lowest rounded border border-surface-container-highest">
          <div class="text-outline mb-1 uppercase text-xs">GPS Resolution</div>
          <div id="spec-gps" class="text-on-surface font-headline-sm text-headline-sm font-bold">1:25,000 Topo</div>
          <div id="spec-gps-status" class="text-secondary mt-1 text-xs">Satellite Verified</div>
        </div>
        <div class="p-space-md bg-surface-container-lowest rounded border border-surface-container-highest">
          <div class="text-outline mb-1 uppercase text-xs">Caloric Burn Rate</div>
          <div id="spec-cal" class="text-primary font-headline-sm text-headline-sm font-bold">1,240 kcal / 15km</div>
          <div id="spec-cal-note" class="text-outline mt-1 text-xs">Grade-weighted</div>
        </div>
      </div>

      <div class="p-3 bg-surface-container-lowest border border-surface-container-highest rounded font-body-sm text-on-surface-variant flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs font-label-mono">
          <span class="text-outline uppercase">Total Distance:</span>
          <span id="spec-dist" class="text-on-surface font-semibold">464 KM (approx. 608,000 steps)</span>
        </div>
        <div class="flex items-center justify-between text-xs font-label-mono">
          <span class="text-outline uppercase">Terrain Profile:</span>
          <span id="spec-terrain" class="text-on-surface font-semibold">Himalayan Foothill & Alpine Glacier Basin</span>
        </div>
        <div class="border-t border-surface-container-highest pt-2 text-xs leading-relaxed" id="spec-desc">
          StepQuest routes sync automatically with external wearable chronometers. All elevation metrics reflect barometric corrections verified by Survey of India triangulation benchmarks.
        </div>
      </div>

      <div class="flex justify-end gap-space-sm pt-space-sm border-t border-surface-container-highest">
        <button id="spec-confirm-btn" class="px-space-lg py-space-sm bg-primary-container text-on-primary font-label-md text-label-md uppercase font-bold rounded hover:bg-on-primary-container transition-colors cursor-pointer" type="button">
          Acknowledge &amp; Close
        </button>
      </div>
    </div>
  </div>`
);

/* ─── 3. Clean & Wire Map ────────────────────────────────────────────── */
// Trail Map Header IDs
map = map.replace(
  /<span class="font-label-mono text-label-mono text-on-surface-variant uppercase">Himalayan Ascent Sector<\/span>\s*<\/div>\s*<h1 class="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">Delhi to Kedarnath Sanctuary<\/h1>/i,
  `<span id="map-quest-sector" class="font-label-mono text-label-mono text-on-surface-variant uppercase">Himalayan Ascent Sector</span>
   </div>
   <h1 id="map-quest-title" class="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">Delhi to Kedarnath Sanctuary</h1>`
);

map = map.replace(
  /<span class="text-secondary font-semibold">46\.2% Route Realized<\/span>/i,
  `<span id="map-quest-realized" class="text-secondary font-semibold">46.2% Route Realized</span>`
);

// Inspect Waypoint button
map = map.replace(
  /<button[^>]*>\s*Inspect Waypoint\s*<\/button>/i,
  `<button id="btn-inspect-waypoint" class="px-space-sm py-1 bg-primary-container hover:bg-on-primary-fixed text-on-primary font-label-mono text-label-mono uppercase tracking-wider rounded transition-all active:scale-95 cursor-pointer" title="Inspect waypoint #5 Rishikesh Foothills">Inspect Waypoint</button>`
);

// Manual step entry in map footer
map = map.replace(
  /<button\b[^>]*>\s*<span[^>]*>add<\/span>\s*<span>Manual Step Entry<\/span>\s*<\/button>/i,
  `<button id="btn-map-manual-entry" class="px-space-md py-space-xs bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary font-label-md text-label-md uppercase tracking-wider rounded font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95" title="Log manual steps">
    <span class="material-symbols-outlined text-sm">add</span>
    <span>Manual Step Entry</span>
  </button>`
);

// Map Daily Cap readout
map = map.replace(
  /<span class="font-label-lg text-label-lg text-on-surface font-semibold">18,500 \/ 25,000 steps<\/span>/i,
  `<span id="map-daily-cap" class="font-label-lg text-label-lg text-on-surface font-semibold">18,500 / 25,000 steps</span>`
);

// Make waypoint milestones in the list clickable
map = map.replace(/<!-- Milestone (\d+)[^>]*-->\s*<div class="relative flex gap-space-md([^"]*)"/gi, (match, num, rest) => {
  return `<!-- Milestone ${num} -->\n<div class="relative flex gap-space-md${rest} milestone-card cursor-pointer hover:bg-surface-container/40 p-1 rounded transition-colors" data-milestone="${num}" title="Click to inspect milestone #${num}"`;
});

// Make map node chips clickable
map = map.replace(/Muzaffarnagar \(142 km\)/g, `<span class="milestone-node cursor-pointer hover:text-primary transition-colors" data-milestone="3" title="Inspect Muzaffarnagar">Muzaffarnagar (142 km)</span>`);
map = map.replace(/Haridwar \(210 km\)/g, `<span class="milestone-node cursor-pointer hover:text-primary transition-colors" data-milestone="4" title="Inspect Haridwar">Haridwar (210 km)</span>`);
map = map.replace(/Next: Rishikesh \(235 km\)/g, `<span class="milestone-node cursor-pointer hover:text-primary transition-colors" data-milestone="5" title="Inspect Rishikesh">Next: Rishikesh (235 km)</span>`);
map = map.replace(/Devprayag \(310 km\)/g, `<span class="milestone-node cursor-pointer hover:text-primary transition-colors" data-milestone="6" title="Inspect Devprayag">Devprayag (310 km)</span>`);
map = map.replace(/Rudraprayag \(378 km\)/g, `<span class="milestone-node cursor-pointer hover:text-primary transition-colors" data-milestone="7" title="Inspect Rudraprayag">Rudraprayag (378 km)</span>`);
map = map.replace(/Kedarnath Summit \(464 km\)/g, `<span class="milestone-node cursor-pointer hover:text-primary transition-colors" data-milestone="8" title="Inspect Kedarnath Summit">Kedarnath Summit (464 km)</span>`);

/* ─── 4. Clean & Wire Leaderboard ────────────────────────────────────── */
// Filter Ribbon
leader = leader.replace(
  /<div class="flex items-center gap-space-xs overflow-x-auto[^>]*>[\s\S]*?<\/div>\s*<div class="flex items-center justify-end/i,
  `<div class="flex items-center gap-space-xs overflow-x-auto pb-space-xs sm:pb-0" id="leaderboard-roster-filters">
    <button id="filter-roster-all" data-roster-filter="all" class="roster-filter-btn px-space-md py-space-xs rounded bg-primary-container text-on-primary font-bold font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs cursor-pointer shadow-sm transition-all">
      <span class="material-symbols-outlined text-sm">format_list_numbered</span>
      <span>General Roster (1-8)</span>
    </button>
    <button id="filter-roster-near" data-roster-filter="near" class="roster-filter-btn px-space-md py-space-xs rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs transition-colors cursor-pointer">
      <span class="material-symbols-outlined text-sm">near_me</span>
      <span>Near Your Standings (±2)</span>
    </button>
    <button id="filter-roster-top3" data-roster-filter="top3" class="roster-filter-btn px-space-md py-space-xs rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs transition-colors cursor-pointer">
      <span class="material-symbols-outlined text-sm">military_tech</span>
      <span>Top 3 Leaders</span>
    </button>
  </div>
  <div class="flex items-center justify-end`
);

// Tag leaderboard rows with ranks 1 to 8
leader = leader.replace(/<tbody class="font-body-md text-body-md divide-y-0">([\s\S]*?)<\/tbody>/i, (m, body) => {
  let rank = 1;
  const replaced = body.replace(/<tr\b([^>]*)>/gi, (match, attrs) => {
    const r = rank++;
    return `<tr data-rank="${r}" ${attrs}>`;
  });
  return `<tbody id="leaderboard-tbody" class="font-body-md text-body-md divide-y-0">${replaced}</tbody>`;
});

// Wire Arjun Walker dynamic cells on Leaderboard
leader = leader.replace(
  /<span>Delhi to Kedarnath<\/span>\s*<\/div>\s*<\/td>\s*<td class="py-space-md px-space-lg text-right font-headline-sm text-headline-sm text-primary tabular-nums font-bold">\s*64\.1 <span class="font-label-md text-label-md text-primary font-normal">KM<\/span>\s*<\/td>\s*<td class="py-space-md px-space-lg text-right font-label-lg text-label-lg text-on-surface tabular-nums font-semibold">\s*84,120\s*<\/td>/i,
  `<span id="lead-arjun-expedition">Delhi to Kedarnath</span>
   </div>
   </td>
   <td class="py-space-md px-space-lg text-right font-headline-sm text-headline-sm text-primary tabular-nums font-bold">
     <span id="lead-arjun-distance">64.1</span> <span class="font-label-md text-label-md text-primary font-normal">KM</span>
   </td>
   <td class="py-space-md px-space-lg text-right font-label-lg text-label-lg text-on-surface tabular-nums font-semibold">
     <span id="lead-arjun-cadence">84,120</span>
   </td>`
);

// Remove dead "Export GPX Log" button and wire "Log Trail Session"
leader = leader.replace(
  /<div class="flex items-center gap-space-sm shrink-0">[\s\S]*?Export GPX Log[\s\S]*?Log Trail Session[\s\S]*?<\/div>/i,
  `<div class="flex items-center gap-space-sm shrink-0">
    <button id="btn-lead-log-session" class="px-space-md py-space-xs bg-primary-container hover:bg-primary-container/90 text-on-primary rounded font-label-md text-label-md uppercase tracking-wider font-bold transition-transform active:scale-95 flex items-center gap-space-xs cursor-pointer" title="Log a trail session">
      <span class="material-symbols-outlined text-sm">directions_walk</span>
      <span>Log Trail Session</span>
    </button>
  </div>`
);

/* ─── 5. Clean Achievements ─────────────────────────────────────────── */
// Remove dead "Audit Logs" & "Export GPX" buttons
ach = ach.replace(
  /<div class="flex items-center gap-space-sm shrink-0">[\s\S]*?Audit Logs[\s\S]*?Export GPX[\s\S]*?<\/div>/i,
  `<div class="flex items-center gap-space-sm shrink-0">
    <div class="px-space-md py-space-xs bg-surface-container-lowest border border-surface-container-highest font-label-mono text-label-mono uppercase tracking-wider text-secondary rounded flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-secondary"></span>
      <span>4 / 8 Badges Unlocked</span>
    </div>
  </div>`
);

const template = `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>StepQuest — Precision Endurance Trail Tracking</title>
  <meta name="description" content="Real-world walking quests and athletic trail telemetry platform."/>
  <link href="https://fonts.googleapis.com" rel="preconnect"/>
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "surface-bright": "#39393c",
          "on-surface": "#e4e1e6",
          "surface-container": "#1f1f22",
          "on-background": "#e4e1e6",
          "error-container": "#93000a",
          "on-tertiary-container": "#3e2400",
          "on-primary-container": "#4f1700",
          "surface": "#131316",
          "on-secondary-container": "#003111",
          "on-primary-fixed": "#370e00",
          "surface-variant": "#353438",
          "surface-container-low": "#1b1b1e",
          "surface-container-high": "#2a2a2d",
          "surface-dim": "#131316",
          "surface-tint": "#ffb599",
          "secondary-fixed": "#7ffc97",
          "primary-fixed-dim": "#ffb599",
          "error": "#ffb4ab",
          "on-tertiary-fixed": "#2a1700",
          "on-error-container": "#ffdad6",
          "tertiary-fixed": "#ffddb8",
          "on-primary-fixed-variant": "#7f2b00",
          "secondary": "#62df7d",
          "tertiary-fixed-dim": "#ffb95f",
          "secondary-container": "#1ca64d",
          "primary": "#ffb599",
          "on-primary": "#5a1c00",
          "inverse-surface": "#e4e1e6",
          "surface-container-highest": "#353438",
          "tertiary": "#ffb95f",
          "primary-container": "#f66018",
          "primary-fixed": "#ffdbce",
          "tertiary-container": "#ca8100",
          "on-tertiary-fixed-variant": "#653e00",
          "outline": "#a98a7e",
          "outline-variant": "#5a4138",
          "inverse-on-surface": "#303033",
          "on-error": "#690005",
          "surface-container-lowest": "#0e0e11",
          "inverse-primary": "#a73a00",
          "on-surface-variant": "#e2bfb2",
          "on-secondary-fixed": "#002109",
          "on-secondary-fixed-variant": "#005320",
          "on-secondary": "#003914",
          "secondary-fixed-dim": "#62df7d",
          "on-tertiary": "#472a00",
          "background": "#131316"
        },
        borderRadius: {
          "DEFAULT": "0.125rem",
          "lg": "0.25rem",
          "xl": "0.5rem",
          "full": "0.75rem"
        },
        spacing: {
          "margin": "1.5rem",
          "gutter-desktop": "1.5rem",
          "margin-desktop": "2.5rem",
          "space-xs": "0.25rem",
          "space-xl": "2rem",
          "space-sm": "0.5rem",
          "gutter": "1.25rem",
          "space-lg": "1.5rem",
          "space-md": "1rem"
        },
        fontFamily: {
          "metric-large": ["Plus Jakarta Sans"],
          "headline-sm": ["Plus Jakarta Sans"],
          "label-lg": ["Inter"],
          "label-md": ["Inter"],
          "metric-display": ["Plus Jakarta Sans"],
          "headline-md": ["Plus Jakarta Sans"],
          "label-mono": ["Inter"],
          "headline-xl": ["Plus Jakarta Sans"],
          "body-md": ["Inter"],
          "headline-lg": ["Plus Jakarta Sans"],
          "body-lg": ["Inter"],
          "body-sm": ["Inter"]
        },
        fontSize: {
          "metric-large": ["2rem", { "lineHeight": "1.1", "letterSpacing": "-0.03em", "fontWeight": "700" }],
          "headline-sm": ["1.25rem", { "lineHeight": "1.3", "letterSpacing": "-0.015em", "fontWeight": "600" }],
          "label-lg": ["0.875rem", { "lineHeight": "1.25", "letterSpacing": "0.01em", "fontWeight": "600" }],
          "label-md": ["0.75rem", { "lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600" }],
          "metric-display": ["3rem", { "lineHeight": "1.0", "letterSpacing": "-0.04em", "fontWeight": "800" }],
          "headline-md": ["1.75rem", { "lineHeight": "1.25", "letterSpacing": "-0.02em", "fontWeight": "700" }],
          "label-mono": ["0.6875rem", { "lineHeight": "1.0", "letterSpacing": "0.08em", "fontWeight": "700" }],
          "headline-xl": ["3.5rem", { "lineHeight": "1.1", "letterSpacing": "-0.03em", "fontWeight": "800" }],
          "body-md": ["0.9375rem", { "lineHeight": "1.5", "letterSpacing": "0em", "fontWeight": "400" }],
          "headline-lg": ["2.25rem", { "lineHeight": "1.2", "letterSpacing": "-0.025em", "fontWeight": "700" }],
          "body-lg": ["1.125rem", { "lineHeight": "1.6", "letterSpacing": "-0.01em", "fontWeight": "400" }],
          "body-sm": ["0.8125rem", { "lineHeight": "1.45", "letterSpacing": "0.005em", "fontWeight": "400" }]
        }
      }
    }
  };
  </script>
  <style>
    @layer base {
      html, body { margin: 0; padding: 0; }
      body { overscroll-behavior: none; }
    }
    ::-webkit-scrollbar { display: none; }
    .tab-view.hidden { display: none !important; }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-once {
      animation: spin 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1;
    }
  </style>
</head>
<body class="bg-surface-container-lowest font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary">

  <!-- Top Developer / Live Step Simulation Bar -->
  <aside class="w-full bg-surface-container-lowest border-b border-surface-container-highest px-margin-desktop py-2 flex items-center justify-between text-xs z-50">
    <div class="flex items-center gap-2 text-outline">
      <span class="w-2 h-2 rounded-full bg-secondary"></span>
      <span class="font-label-mono uppercase tracking-widest text-on-surface-variant font-bold">StepQuest Telemetry Simulator</span>
      <span class="text-outline hidden sm:inline">(Simulate pedometer hardware pulses)</span>
    </div>
    <div class="flex items-center gap-2">
      <button id="sim-add-500" class="px-3 py-1 bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-on-surface rounded font-label-mono uppercase tracking-wider transition-colors cursor-pointer" title="Add 500 simulated steps">
        +500 Steps
      </button>
      <button id="sim-add-2500" class="px-3 py-1 bg-primary-container text-on-primary hover:opacity-90 rounded font-label-mono uppercase tracking-wider font-bold transition-opacity cursor-pointer" title="Add 2,500 simulated steps">
        +2,500 Steps
      </button>
      <button id="sim-auto-walk" class="px-3 py-1 bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-on-surface rounded font-label-mono uppercase tracking-wider transition-colors cursor-pointer" title="Toggle automatic walking telemetry generator">
        Simulate Walk: Off
      </button>
      <button id="sim-reset" class="px-3 py-1 bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-error rounded font-label-mono uppercase tracking-wider transition-colors cursor-pointer" title="Reset steps to base reading">
        Reset
      </button>
    </div>
  </aside>

  <!-- Sticky Top Header Navigation (From Stitch Project) -->
  <header class="sticky top-0 left-0 right-0 z-40 bg-surface-container-low border-b border-surface-container-highest">
    <div class="h-16 max-w-[1600px] mx-auto px-margin-desktop flex items-center justify-between gap-space-lg">
      <!-- Brand Logo -->
      <div class="flex items-center gap-space-md shrink-0 cursor-pointer" onclick="switchTab('dashboard')" title="StepQuest Command Center">
        <div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-bold">
          <span class="material-symbols-outlined text-lg">hiking</span>
        </div>
        <div class="flex flex-col">
          <span class="font-headline-sm text-headline-sm tracking-tight text-on-surface leading-none uppercase font-extrabold">StepQuest</span>
          <span class="font-label-mono text-label-mono uppercase tracking-widest text-outline mt-space-xs">Real-World Walking Quests</span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="hidden md:flex items-center p-space-xs bg-surface-container-lowest border border-surface-container-highest rounded-lg gap-space-xs" id="app-nav-container">
        <button class="nav-tab-btn px-space-md py-space-xs rounded font-label-md text-label-md uppercase tracking-wider transition-colors bg-primary-container text-on-primary font-bold cursor-pointer" data-tab="dashboard">
          Dashboard
        </button>
        <button class="nav-tab-btn px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors uppercase tracking-wider cursor-pointer" data-tab="quests">
          Quests
        </button>
        <button class="nav-tab-btn px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors uppercase tracking-wider cursor-pointer" data-tab="trail-map">
          Trail Map
        </button>
        <button class="nav-tab-btn px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors uppercase tracking-wider cursor-pointer" data-tab="leaderboard">
          Leaderboard
        </button>
        <button class="nav-tab-btn px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors uppercase tracking-wider cursor-pointer" data-tab="achievements">
          Achievements
        </button>
      </nav>

      <!-- User Profile Badge -->
      <div class="flex items-center gap-space-md shrink-0">
        <div class="hidden xl:flex items-center gap-space-xs px-space-sm py-space-xs border border-surface-container-highest bg-surface-container-lowest rounded">
          <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span class="font-label-mono text-label-mono uppercase text-secondary tracking-widest">Sync Active</span>
        </div>
        <div class="flex items-center gap-space-sm pl-space-md border-l border-surface-container-highest">
          <div class="flex flex-col items-end text-right">
            <span class="font-label-lg text-label-lg text-on-surface leading-tight font-semibold">Arjun Walker</span>
            <span class="font-label-mono text-label-mono text-primary uppercase tracking-wider px-space-xs bg-primary-container/20 border border-primary/30 rounded mt-space-xs">LVL 14 Trailblazer</span>
          </div>
          <img alt="Arjun Walker" class="w-8 h-8 rounded-full object-cover border border-surface-container-highest" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"/>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Workstation View Area -->
  <main class="w-full max-w-[1600px] mx-auto px-margin-desktop bg-surface-container-lowest flex-1 pb-12">
    <!-- TAB 1: DASHBOARD -->
    <div id="view-dashboard" class="tab-view active">
      ${dash}
    </div>

    <!-- TAB 2: QUESTS CATALOG -->
    <div id="view-quests" class="tab-view hidden">
      ${quests}
    </div>

    <!-- TAB 3: GEOGRAPHIC TRAIL MAP -->
    <div id="view-trail-map" class="tab-view hidden">
      ${map}
    </div>

    <!-- TAB 4: LEADERBOARD -->
    <div id="view-leaderboard" class="tab-view hidden">
      ${leader}
    </div>

    <!-- TAB 5: ACHIEVEMENTS -->
    <div id="view-achievements" class="tab-view hidden">
      ${ach}
    </div>
  </main>

  <!-- ═══════════════════════════════════════════════════════════════════
       INTERACTIVE MODALS & TOAST SYSTEM
       ═══════════════════════════════════════════════════════════════════ -->

  <!-- Modal 1: Manual Step Entry -->
  <div id="modal-manual-step" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none hidden">
    <div class="bg-surface-container-low border border-surface-container-highest rounded-lg max-w-md w-full p-space-lg text-on-surface shadow-2xl flex flex-col gap-space-md">
      <div class="flex items-center justify-between border-b border-surface-container-highest pb-space-sm">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-container text-xl">footprint</span>
          <span class="font-headline-sm text-headline-sm uppercase font-bold text-on-surface">Log Trail Session</span>
        </div>
        <button id="close-step-modal" class="text-outline hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors cursor-pointer" type="button">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div>
        <label class="block font-label-mono text-label-mono uppercase text-outline mb-2">Quick Add Steps</label>
        <div class="grid grid-cols-4 gap-2">
          <button class="step-preset-btn py-2 bg-surface-container-lowest hover:bg-surface-container border border-surface-container-highest text-on-surface font-label-mono text-label-mono rounded transition-colors cursor-pointer" data-steps="1000">+1,000</button>
          <button class="step-preset-btn py-2 bg-surface-container-lowest hover:bg-surface-container border border-surface-container-highest text-on-surface font-label-mono text-label-mono rounded transition-colors cursor-pointer" data-steps="2500">+2,500</button>
          <button class="step-preset-btn py-2 bg-surface-container-lowest hover:bg-surface-container border border-surface-container-highest text-on-surface font-label-mono text-label-mono rounded transition-colors cursor-pointer" data-steps="5000">+5,000</button>
          <button class="step-preset-btn py-2 bg-surface-container-lowest hover:bg-surface-container border border-surface-container-highest text-on-surface font-label-mono text-label-mono rounded transition-colors cursor-pointer" data-steps="10000">+10,000</button>
        </div>
      </div>

      <div>
        <label for="input-custom-steps" class="block font-label-mono text-label-mono uppercase text-outline mb-2">Custom Step Count</label>
        <div class="relative">
          <input id="input-custom-steps" type="number" min="1" max="50000" step="100" placeholder="e.g. 4500" class="w-full bg-surface-container-lowest border border-surface-container-highest rounded px-4 py-2.5 text-on-surface font-metric-large text-xl focus:outline-none focus:border-primary-container" />
          <span class="absolute right-3 top-3 text-outline font-label-mono text-xs uppercase">STEPS</span>
        </div>
      </div>

      <!-- Live Telemetry Calculation Preview -->
      <div class="p-3 bg-surface-container-lowest border border-surface-container-highest rounded flex items-center justify-between font-label-mono text-xs">
        <div>
          <span class="text-outline uppercase">Est. Distance:</span>
          <span id="preview-distance" class="text-secondary font-bold ml-1">+0.00 KM</span>
        </div>
        <div>
          <span class="text-outline uppercase">Est. Calories:</span>
          <span id="preview-kcal" class="text-primary font-bold ml-1">+0 KCAL</span>
        </div>
      </div>

      <div class="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-highest">
        <button id="cancel-step-modal" class="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-on-surface font-label-md text-label-md uppercase tracking-wider rounded transition-colors cursor-pointer">
          Cancel
        </button>
        <button id="confirm-step-modal" class="px-space-lg py-space-xs bg-primary-container hover:bg-on-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider font-bold rounded transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95">
          <span class="material-symbols-outlined text-sm">check</span>
          <span>Confirm & Log</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal 2: Waypoint Telemetry Inspector -->
  <div id="modal-waypoint" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none hidden">
    <div class="bg-surface-container-low border border-surface-container-highest rounded-lg max-w-lg w-full p-space-lg text-on-surface shadow-2xl flex flex-col gap-space-md">
      <div class="flex items-center justify-between border-b border-surface-container-highest pb-space-sm">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-xl">location_on</span>
          <div>
            <span id="wp-seq" class="font-label-mono text-label-mono uppercase text-primary font-bold block">Waypoint Telemetry</span>
            <h3 id="wp-title" class="font-headline-sm text-headline-sm uppercase font-bold text-on-surface leading-tight">Rishikesh Foothills</h3>
          </div>
        </div>
        <button id="close-waypoint-modal" class="text-outline hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors cursor-pointer" type="button">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div class="grid grid-cols-3 gap-2 font-label-mono text-xs">
        <div class="p-2.5 bg-surface-container-lowest border border-surface-container-highest rounded">
          <div class="text-outline uppercase text-[10px]">Altitude</div>
          <div id="wp-alt" class="font-bold text-on-surface text-sm mt-0.5">372 M</div>
        </div>
        <div class="p-2.5 bg-surface-container-lowest border border-surface-container-highest rounded">
          <div class="text-outline uppercase text-[10px]">Gradient</div>
          <div id="wp-grade" class="font-bold text-primary text-sm mt-0.5">3.2%</div>
        </div>
        <div class="p-2.5 bg-surface-container-lowest border border-surface-container-highest rounded">
          <div class="text-outline uppercase text-[10px]">Status</div>
          <div id="wp-status" class="font-bold text-secondary text-sm mt-0.5">ACTIVE TARGET</div>
        </div>
      </div>

      <div class="p-3 bg-surface-container-lowest border border-surface-container-highest rounded font-body-sm text-on-surface-variant flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs font-label-mono">
          <span class="text-outline uppercase">Coordinates:</span>
          <span id="wp-coords" class="text-on-surface font-semibold">30.0869° N, 78.2676° E</span>
        </div>
        <div class="flex items-center justify-between text-xs font-label-mono">
          <span class="text-outline uppercase">Remaining Distance:</span>
          <span id="wp-remaining" class="text-on-surface font-semibold">20.8 KM (approx. 27,200 steps)</span>
        </div>
        <div class="border-t border-surface-container-highest pt-2 text-xs leading-relaxed" id="wp-desc">
          Gateway to Shivalik lower ranges. Transition from flat river basin terrain to winding mountain singletrack.
        </div>
      </div>

      <div class="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-highest">
        <button id="btn-waypoint-close" class="px-space-lg py-space-xs bg-primary-container text-on-primary font-label-md text-label-md uppercase font-bold rounded transition-colors hover:bg-on-primary-container cursor-pointer">
          Close Inspector
        </button>
      </div>
    </div>
  </div>

  <!-- Global Athletic Toast Notification -->
  <div id="app-toast" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-surface-container-high border border-primary-container text-on-surface rounded shadow-2xl font-label-mono text-xs uppercase tracking-wider transition-all duration-300 opacity-0 pointer-events-none translate-y-2">
    <span id="toast-icon" class="material-symbols-outlined text-primary text-lg">check_circle</span>
    <span id="toast-msg">Action confirmed</span>
  </div>

  <!-- Interactive Logic Controller -->
  <script src="stitch_app.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'web', 'index.html'), template);
console.log('web/index.html generated successfully with fully wired UI!');
