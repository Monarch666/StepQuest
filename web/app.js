/* ═══════════════════════════════════════════════════════════════════
   StepQuest — Core Application Logic & State Engine
   Human-crafted, clean architecture without emojis or AI artifacts.
   ═══════════════════════════════════════════════════════════════════ */

// Constant: ~0.762m per step (0.000762 km/step)
const KM_PER_STEP = 0.000762;
const KCAL_PER_STEP = 0.042;

// Master Journeys Catalog
const JOURNEYS = [
  {
    id: "delhi-kedarnath",
    title: "Delhi to Kedarnath",
    description: "A pilgrimage trek through the Himalayas via Haridwar, Rishikesh, and the Char Dham mountain route.",
    totalKm: 464,
    difficulty: "Hard",
    banner: "assets/kedarnath_banner.jpg",
    elevation: "216m to 3,583m",
    waypoints: [
      { name: "India Gate, Delhi", km: 0, desc: "Starting point at the National War Memorial and Rajpath." },
      { name: "Meerut", km: 70, desc: "Historic city on the Upper Doab plains." },
      { name: "Haridwar", km: 210, desc: "Ghats along the holy river Ganges." },
      { name: "Rishikesh", km: 235, desc: "Foothills of the Garhwal Himalayas and river valleys." },
      { name: "Devprayag", km: 310, desc: "Confluence of Bhagirathi and Alaknanda rivers." },
      { name: "Rudraprayag", km: 375, desc: "Confluence of Alaknanda and Mandakini rivers." },
      { name: "Gaurikund", km: 448, desc: "Hot springs and starting trail for the high mountain trek." },
      { name: "Kedarnath Temple", km: 464, desc: "Final destination temple at an elevation of 3,583m." }
    ]
  },
  {
    id: "mumbai-goa",
    title: "Mumbai to Goa",
    description: "A coastal trail along the Konkan coastline through sea forts, estuaries, and fishing settlements.",
    totalKm: 590,
    difficulty: "Moderate",
    banner: "assets/goa_banner.jpg",
    elevation: "0m to 120m",
    waypoints: [
      { name: "Gateway of India", km: 0, desc: "Starting monument overlooking Mumbai harbour." },
      { name: "Alibaug", km: 35, desc: "Coastal coastal town with historic forts." },
      { name: "Murud Janjira", km: 90, desc: "Island fort situated in the Arabian Sea." },
      { name: "Ratnagiri", km: 330, desc: "Coastal clifftops and lighthouse promontory." },
      { name: "Malvan", km: 480, desc: "Sindhudurg naval fort and rock shores." },
      { name: "Panaji, Goa", km: 590, desc: "Final coastal destination along the Mandovi river." }
    ]
  },
  {
    id: "manali-leh",
    title: "Manali to Leh",
    description: "The high-altitude highway through Rohtang Pass, Baralacha La, and the Zanskar Valley.",
    totalKm: 479,
    difficulty: "Hard",
    banner: "assets/kedarnath_banner.jpg",
    elevation: "2,050m to 5,328m",
    waypoints: [
      { name: "Manali", km: 0, desc: "Kullu valley base in Himachal Pradesh." },
      { name: "Rohtang Pass", km: 52, desc: "High mountain pass at 3,980m elevation." },
      { name: "Keylong", km: 115, desc: "Administrative center above the Bhaga river." },
      { name: "Baralacha La", km: 190, desc: "Connecting plateau pass at 4,890m elevation." },
      { name: "Sarchu", km: 222, desc: "Border campsite on the high plateau." },
      { name: "Tanglang La", km: 365, desc: "Mountain pass at 5,328m elevation." },
      { name: "Leh, Ladakh", km: 479, desc: "Final capital city in the Indus river valley." }
    ]
  },
  {
    id: "jaipur-agra",
    title: "Jaipur to Agra",
    description: "A historical heritage trail through eastern Rajasthan into the plains of Uttar Pradesh.",
    totalKm: 232,
    difficulty: "Easy",
    banner: "assets/goa_banner.jpg",
    elevation: "169m to 431m",
    waypoints: [
      { name: "Hawa Mahal, Jaipur", km: 0, desc: "Palace of the Winds in the Pink City." },
      { name: "Dausa", km: 55, desc: "Historic town near Chand Baori stepwell." },
      { name: "Bharatpur", km: 175, desc: "Keoladeo wetlands and sanctuary." },
      { name: "Fatehpur Sikri", km: 195, desc: "Preserved 16th-century Mughal red sandstone city." },
      { name: "Taj Mahal, Agra", km: 232, desc: "Mausoleum monument on the banks of Yamuna river." }
    ]
  },
  {
    id: "chennai-pondicherry",
    title: "Chennai to Pondicherry",
    description: "A coastal route along the Bay of Bengal through backwaters and historic shore temples.",
    totalKm: 150,
    difficulty: "Easy",
    banner: "assets/goa_banner.jpg",
    elevation: "0m to 15m",
    waypoints: [
      { name: "Marina Beach, Chennai", km: 0, desc: "Urban coastal start on the Coromandel coast." },
      { name: "Kovalam Backwaters", km: 38, desc: "Coastal lagoon and estuary." },
      { name: "Mahabalipuram", km: 58, desc: "UNESCO monument group and rock relief carvings." },
      { name: "Marakkanam", km: 110, desc: "Coastal salt pans and wetlands." },
      { name: "Promenade, Pondicherry", km: 150, desc: "Seaside promenade and colonial quarter." }
    ]
  }
];

// Achievements & Badges List (clean titles and descriptions, no emojis)
const BADGES = [
  { id: "first-step", name: "First Kilometer", req: "Log your first 1,000 steps on any quest.", milestoneKm: 1, svgIcon: "footprints" },
  { id: "ganga-blessing", name: "Haridwar Waypoint", req: "Reach the Haridwar waypoint (210 km mark).", milestoneKm: 210, svgIcon: "map-pin" },
  { id: "yoga-haven", name: "Rishikesh Foothills", req: "Pass the Rishikesh waypoint (235 km mark).", milestoneKm: 235, svgIcon: "navigation" },
  { id: "century-strider", name: "Century Milestone", req: "Accumulate 100 km of total walking distance.", milestoneKm: 100, svgIcon: "award" },
  { id: "streak-7", name: "Weekly Streak", req: "Maintain a walking log for 7 consecutive days.", milestoneKm: 0, svgIcon: "flame" },
  { id: "himalayan-summit", name: "Kedarnath Finish", req: "Complete the entire Delhi to Kedarnath route (464 km).", milestoneKm: 464, svgIcon: "flag" },
  { id: "coast-runner", name: "Konkan Trail", req: "Complete 150 km along the coastal route.", milestoneKm: 150, svgIcon: "compass" },
  { id: "marathon-hero", name: "Marathon Distance", req: "Log 42.2 km across active tracking.", milestoneKm: 42, svgIcon: "zap" }
];

// Leaderboard Roster
const LEADERBOARD_DATA = [
  { rank: 1, name: "Vikram Sengupta", handle: "@vikram_s", km: 312.4, steps: 409973, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" },
  { rank: 2, name: "Ananya Sharma", handle: "@ananya_s", km: 284.1, steps: 372834, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
  { rank: 3, name: "Rahul Deshmukh", handle: "@rahul_d", km: 251.8, steps: 330446, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
  { rank: 4, name: "Arjun Walker", handle: "@arjun_walker", km: 188.5, steps: 247375, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80", isUser: true },
  { rank: 5, name: "Meera Nair", handle: "@meera_n", km: 165.2, steps: 216798, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80" },
  { rank: 6, name: "Kunal Bansal", handle: "@kunal_b", km: 142.9, steps: 187532, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" },
  { rank: 7, name: "Pooja Hegde", handle: "@pooja_h", km: 120.4, steps: 158005, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80" }
];

// Application State Store
class StepQuestState {
  constructor() {
    this.load();
  }

  load() {
    const saved = localStorage.getItem("stepquest_clean_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.todaySteps = parsed.todaySteps ?? 6420;
        this.dailyGoal = parsed.dailyGoal ?? 10000;
        this.totalLifetimeSteps = parsed.totalLifetimeSteps ?? 142850;
        this.totalKm = parsed.totalKm ?? 108.85;
        this.activeQuestId = parsed.activeQuestId ?? "delhi-kedarnath";
        this.activeQuestProgressKm = parsed.activeQuestProgressKm ?? 214.2;
        this.streak = parsed.streak ?? 7;
        this.soundEnabled = parsed.soundEnabled ?? false;
        this.earnedBadges = parsed.earnedBadges ?? ["first-step", "ganga-blessing", "century-strider", "streak-7"];
        this.hourlySteps = parsed.hourlySteps ?? [180, 520, 1140, 1680, 940, 720, 1240];
        return;
      } catch (e) {
        console.error("State parse error", e);
      }
    }
    this.todaySteps = 6420;
    this.dailyGoal = 10000;
    this.totalLifetimeSteps = 142850;
    this.totalKm = 108.85;
    this.activeQuestId = "delhi-kedarnath";
    this.activeQuestProgressKm = 214.2;
    this.streak = 7;
    this.soundEnabled = false;
    this.earnedBadges = ["first-step", "ganga-blessing", "century-strider", "streak-7"];
    this.hourlySteps = [180, 520, 1140, 1680, 940, 720, 1240];
  }

  save() {
    localStorage.setItem("stepquest_clean_state", JSON.stringify({
      todaySteps: this.todaySteps,
      dailyGoal: this.dailyGoal,
      totalLifetimeSteps: this.totalLifetimeSteps,
      totalKm: this.totalKm,
      activeQuestId: this.activeQuestId,
      activeQuestProgressKm: this.activeQuestProgressKm,
      streak: this.streak,
      soundEnabled: this.soundEnabled,
      earnedBadges: this.earnedBadges,
      hourlySteps: this.hourlySteps
    }));
  }

  getActiveJourney() {
    return JOURNEYS.find(j => j.id === this.activeQuestId) || JOURNEYS[0];
  }

  getNextMilestone() {
    const journey = this.getActiveJourney();
    return journey.waypoints.find(w => w.km > this.activeQuestProgressKm) || journey.waypoints[journey.waypoints.length - 1];
  }

  addSteps(count) {
    const addedKm = count * KM_PER_STEP;
    this.todaySteps += count;
    this.totalLifetimeSteps += count;
    this.totalKm = +(this.totalKm + addedKm).toFixed(2);

    const journey = this.getActiveJourney();
    const oldKm = this.activeQuestProgressKm;
    this.activeQuestProgressKm = Math.min(journey.totalKm, +(this.activeQuestProgressKm + addedKm).toFixed(2));

    const lastIdx = this.hourlySteps.length - 1;
    this.hourlySteps[lastIdx] = (this.hourlySteps[lastIdx] || 0) + count;

    this.checkMilestones(oldKm, this.activeQuestProgressKm);
    this.save();
  }

  checkMilestones(oldKm, newKm) {
    const journey = this.getActiveJourney();
    journey.waypoints.forEach(wp => {
      if (oldKm < wp.km && newKm >= wp.km) {
        showToast(`Reached milestone: ${wp.name} (${wp.km} km mark)`);
        const badge = BADGES.find(b => b.milestoneKm === wp.km);
        if (badge && !this.earnedBadges.includes(badge.id)) {
          this.earnedBadges.push(badge.id);
          setTimeout(() => {
            showToast(`Achievement unlocked: ${badge.name}`);
          }, 600);
        }
      }
    });
  }

  resetAll() {
    this.todaySteps = 1200;
    this.totalLifetimeSteps = 24000;
    this.totalKm = 18.28;
    this.activeQuestProgressKm = 18.28;
    this.earnedBadges = ["first-step"];
    this.hourlySteps = [200, 400, 600, 0, 0, 0, 0];
    this.save();
  }
}

const state = new StepQuestState();

// ═══════════════════════════════════════════════════════════════════
// SVG Icon Helper
// ═══════════════════════════════════════════════════════════════════
function getSvgIcon(name, size = 18) {
  const icons = {
    "footprints": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 6.01 9.5 8.5 9.5c1.88 0 3.5 1.5 3.5 3.5v3"/><circle cx="8.5" cy="5.5" r="2.5"/><path d="M20 20v-2.38c0-2.12-2.01-4.12-4.5-4.12-1.88 0-3.5 1.5-3.5 3.5v3"/><circle cx="15.5" cy="9.5" r="2.5"/></svg>`,
    "map-pin": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    "navigation": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
    "award": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    "flame": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    "flag": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
    "compass": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    "zap": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    "check": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
  };
  return icons[name] || icons["award"];
}

// ═══════════════════════════════════════════════════════════════════
// Toast Alert
// ═══════════════════════════════════════════════════════════════════
function showToast(message) {
  const toast = document.getElementById("toast-box");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// ═══════════════════════════════════════════════════════════════════
// UI Updating Functions
// ═══════════════════════════════════════════════════════════════════
function updateDashboard() {
  // Step Ring
  const circle = document.getElementById("circle-progress-fill");
  const stepNumberEl = document.getElementById("stat-today-steps");
  const stepGoalEl = document.getElementById("stat-step-goal");
  const percentChip = document.getElementById("stat-percent-chip");

  if (circle && stepNumberEl) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(100, Math.round((state.todaySteps / state.dailyGoal) * 100));
    const offset = circumference - (percent / 100) * circumference;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;

    stepNumberEl.textContent = state.todaySteps.toLocaleString();
    if (stepGoalEl) stepGoalEl.textContent = `Goal: ${state.dailyGoal.toLocaleString()}`;
    if (percentChip) percentChip.textContent = `${percent}% of daily goal`;
  }

  // Metrics
  const distEl = document.getElementById("stat-distance");
  const calEl = document.getElementById("stat-calories");
  const streakEl = document.getElementById("stat-streak");

  if (distEl) distEl.textContent = `${(state.todaySteps * KM_PER_STEP).toFixed(2)} km`;
  if (calEl) calEl.textContent = `${Math.round(state.todaySteps * KCAL_PER_STEP)} kcal`;
  if (streakEl) streakEl.textContent = `${state.streak} days`;

  // Active Trek Section
  const journey = state.getActiveJourney();
  const trekTitle = document.getElementById("active-trek-name");
  const trekDiff = document.getElementById("active-trek-diff");
  const trekImg = document.getElementById("active-trek-image");
  const trekDesc = document.getElementById("active-trek-desc");
  const trekFill = document.getElementById("active-trek-progress-bar");
  const trekKm = document.getElementById("active-trek-km-label");
  const trekPct = document.getElementById("active-trek-pct-label");

  if (trekTitle) trekTitle.textContent = journey.title;
  if (trekDiff) trekDiff.textContent = journey.difficulty;
  if (trekImg) trekImg.src = journey.banner;
  if (trekDesc) trekDesc.textContent = journey.description;

  const journeyPercent = Math.min(100, Math.round((state.activeQuestProgressKm / journey.totalKm) * 100));
  if (trekFill) trekFill.style.width = `${journeyPercent}%`;
  if (trekKm) trekKm.textContent = `${state.activeQuestProgressKm.toFixed(1)} km of ${journey.totalKm} km`;
  if (trekPct) trekPct.textContent = `${journeyPercent}%`;

  // Next Waypoint
  const nextMilestone = state.getNextMilestone();
  const nextNameEl = document.getElementById("next-waypoint-name");
  const nextDistEl = document.getElementById("next-waypoint-dist");

  if (nextNameEl && nextMilestone) {
    nextNameEl.textContent = nextMilestone.name;
    const remaining = Math.max(0, +(nextMilestone.km - state.activeQuestProgressKm).toFixed(1));
    if (nextDistEl) nextDistEl.textContent = `${remaining} km remaining`;
  }

  // Hourly Bars
  const maxHourSteps = Math.max(...state.hourlySteps, 1500);
  state.hourlySteps.forEach((steps, i) => {
    const bar = document.getElementById(`hour-bar-${i}`);
    if (bar) {
      const heightPercent = Math.min(100, Math.max(8, Math.round((steps / maxHourSteps) * 100)));
      bar.style.height = `${heightPercent}%`;
    }
  });
}

function renderQuestsCatalog() {
  const container = document.getElementById("quests-catalog-list");
  if (!container) return;

  const searchInput = document.getElementById("quest-search-input");
  const query = (searchInput?.value || "").toLowerCase();
  const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "All";

  const filtered = JOURNEYS.filter(j => {
    const matchesQuery = j.title.toLowerCase().includes(query) || j.description.toLowerCase().includes(query);
    const matchesFilter = activeFilter === "All" || j.difficulty === activeFilter;
    return matchesQuery && matchesFilter;
  });

  container.innerHTML = filtered.map(j => {
    const isActive = j.id === state.activeQuestId;
    const progressKm = isActive ? state.activeQuestProgressKm : 0;
    const pct = Math.min(100, Math.round((progressKm / j.totalKm) * 100));

    return `
      <div class="quest-card ${isActive ? 'is-active-trek' : ''}">
        <div class="quest-img-container">
          <img src="${j.banner}" alt="${j.title}">
          ${isActive ? '<span class="active-flag-tag">Active Trek</span>' : ''}
        </div>
        <div class="quest-card-content">
          <div class="quest-card-top">
            <h3 class="quest-card-title">${j.title}</h3>
            <span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">${j.difficulty}</span>
          </div>
          <p class="quest-desc">${j.description}</p>
          <div class="quest-specs-table">
            <div>Distance: <strong>${j.totalKm} km</strong></div>
            <div>Waypoints: <strong>${j.waypoints.length}</strong></div>
            <div>Elevation: <strong>${j.elevation}</strong></div>
          </div>
          ${isActive ? `
            <div class="progress-track" style="margin-top: 4px;">
              <div class="progress-bar" style="width: ${pct}%;"></div>
            </div>
            <div class="progress-labels">
              <span class="progress-km-text">${progressKm.toFixed(1)} km completed</span>
              <span class="progress-pct-text">${pct}%</span>
            </div>
          ` : ''}
          <div class="quest-card-actions">
            <button class="btn-primary-action" onclick="selectActiveTrek('${j.id}')">
              ${isActive ? 'Continue Trek' : 'Select Trek'}
            </button>
            <button class="btn-secondary-action" onclick="inspectTrekMap('${j.id}')">
              View Map
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function selectActiveTrek(trekId) {
  state.activeQuestId = trekId;
  const journey = state.getActiveJourney();
  if (state.activeQuestProgressKm > journey.totalKm) {
    state.activeQuestProgressKm = 0;
  }
  state.save();
  showToast(`Active trek changed to ${journey.title}`);
  updateDashboard();
  renderQuestsCatalog();
  renderTrailMap();
}

function inspectTrekMap(trekId) {
  selectActiveTrek(trekId);
  switchTab("map");
}

function renderTrailMap() {
  const journey = state.getActiveJourney();
  const titleEl = document.getElementById("map-route-title");
  const elevEl = document.getElementById("map-route-elevation");
  if (titleEl) titleEl.textContent = journey.title;
  if (elevEl) elevEl.textContent = journey.elevation;

  const svg = document.getElementById("svg-map-stage");
  if (svg) {
    const width = 800;
    const height = 240;
    const paddingX = 50;
    const paddingY = 40;

    const count = journey.waypoints.length;
    const points = journey.waypoints.map((wp, i) => {
      const t = i / (count - 1);
      const x = paddingX + t * (width - 2 * paddingX);
      const curve = Math.sin(t * Math.PI * 2) * 35;
      const y = (height - paddingY) - t * (height - 2 * paddingY) + curve;
      return { x, y, wp, i };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      pathD += ` Q ${prev.x} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const progressFraction = Math.min(1, state.activeQuestProgressKm / journey.totalKm);
    const activePointIdx = Math.min(points.length - 1, Math.floor(progressFraction * (points.length - 1)));
    const activePoint = points[activePointIdx] || points[0];

    let svgHtml = `
      <path d="${pathD}" class="route-path-background" />
      <path d="${pathD}" class="route-path-traveled" stroke-dasharray="1400" stroke-dashoffset="${1400 - (1400 * progressFraction)}" />
    `;

    points.forEach((p, idx) => {
      const isPassed = state.activeQuestProgressKm >= p.wp.km;
      const circleFill = isPassed ? "#16a34a" : "#27272a";
      const circleStroke = isPassed ? "#22c55e" : "#52525b";

      svgHtml += `
        <g style="cursor: pointer;" onclick="openWaypointDetails('${p.wp.name}', '${p.wp.desc}', ${p.wp.km})">
          <circle cx="${p.x}" cy="${p.y}" r="6" fill="${circleFill}" stroke="${circleStroke}" stroke-width="2" />
          <text x="${p.x}" y="${p.y - 12}" fill="#a1a1aa" font-size="11" font-weight="600" text-anchor="middle">${p.wp.name.split(',')[0]}</text>
        </g>
      `;
    });

    // Current user position marker
    svgHtml += `
      <g transform="translate(${activePoint.x}, ${activePoint.y})">
        <circle r="7" fill="#ea580c" stroke="#ffffff" stroke-width="2" />
      </g>
    `;

    svg.innerHTML = svgHtml;
  }

  // Waypoints Checklist
  const checklistEl = document.getElementById("waypoints-checklist");
  if (checklistEl) {
    checklistEl.innerHTML = journey.waypoints.map((wp, i) => {
      const isPassed = state.activeQuestProgressKm >= wp.km;
      const nextWp = state.getNextMilestone();
      const isCurrent = nextWp && nextWp.name === wp.name;

      return `
        <div class="waypoint-row ${isPassed ? 'passed' : isCurrent ? 'current-target' : ''}">
          <div class="waypoint-step-num">
            ${isPassed ? '✓' : (i + 1)}
          </div>
          <div class="waypoint-main-info">
            <div class="waypoint-title-text">${wp.name}</div>
            <div class="waypoint-desc-text">${wp.desc}</div>
          </div>
          <div class="waypoint-km-text">${wp.km} km</div>
        </div>
      `;
    }).join("");
  }
}

function openWaypointDetails(name, desc, km) {
  const modal = document.getElementById("dialog-overlay");
  const content = document.getElementById("dialog-content-body");
  if (!modal || !content) return;

  const isPassed = state.activeQuestProgressKm >= km;
  content.innerHTML = `
    <h3 style="font-size: 18px; font-weight: 700; color: #fff;">${name}</h3>
    <div style="font-size: 13px; font-weight: 600; color: var(--primary); margin: 4px 0 12px;">Waypoint at ${km} km</div>
    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">${desc}</p>
    <div style="display: inline-block; padding: 4px 12px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; background: ${isPassed ? 'var(--success-subtle)' : 'var(--surface-muted)'}; color: ${isPassed ? '#4ade80' : 'var(--text-muted)'};">
      ${isPassed ? 'Milestone Completed' : 'Ahead on Route'}
    </div>
  `;
  modal.classList.add("open");
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboard-rows-container");
  if (!container) return;

  const userEntry = LEADERBOARD_DATA.find(u => u.isUser);
  if (userEntry) {
    userEntry.km = state.activeQuestProgressKm;
    userEntry.steps = state.todaySteps + 150000;
  }

  LEADERBOARD_DATA.sort((a, b) => b.km - a.km);
  LEADERBOARD_DATA.forEach((entry, idx) => { entry.rank = idx + 1; });

  container.innerHTML = LEADERBOARD_DATA.map(entry => {
    return `
      <div class="rank-row ${entry.isUser ? 'is-current-user' : ''}">
        <div class="rank-index">${entry.rank}</div>
        <img src="${entry.avatar}" alt="${entry.name}" class="rank-user-avatar">
        <div class="rank-user-info">
          <div class="rank-user-name">
            ${entry.name}
            ${entry.isUser ? '<span class="user-tag">You</span>' : ''}
          </div>
          <div class="rank-user-sub">${entry.handle}</div>
        </div>
        <div class="rank-km-stat">
          <div class="rank-km-num">${entry.km.toFixed(1)} km</div>
          <div class="rank-steps-num">${entry.steps.toLocaleString()} steps</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderAchievements() {
  const container = document.getElementById("achievements-grid");
  const countEl = document.getElementById("unlocked-badges-count");
  if (!container) return;

  const unlockedCount = BADGES.filter(b => state.earnedBadges.includes(b.id)).length;
  if (countEl) countEl.textContent = `${unlockedCount} of ${BADGES.length} Unlocked`;

  container.innerHTML = BADGES.map(badge => {
    const isUnlocked = state.earnedBadges.includes(badge.id);
    return `
      <div class="badge-tile ${isUnlocked ? 'unlocked' : 'locked'}" onclick="openBadgeDetails('${badge.name}', '${badge.req}', '${badge.svgIcon}', ${isUnlocked})">
        <div class="badge-icon-slot">
          ${getSvgIcon(badge.svgIcon, 22)}
        </div>
        <div class="badge-title-text">${badge.name}</div>
        <div class="badge-req-text">${badge.req}</div>
        <span class="badge-status-chip ${isUnlocked ? 'unlocked' : 'locked'}">
          ${isUnlocked ? 'Earned' : 'Locked'}
        </span>
      </div>
    `;
  }).join("");
}

function openBadgeDetails(name, req, iconName, isUnlocked) {
  const modal = document.getElementById("dialog-overlay");
  const content = document.getElementById("dialog-content-body");
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="width: 44px; height: 44px; margin: 0 auto 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${isUnlocked ? 'var(--primary-subtle)' : 'var(--surface-muted)'}; color: ${isUnlocked ? 'var(--primary)' : 'var(--text-muted)'};">
      ${getSvgIcon(iconName, 22)}
    </div>
    <h3 style="font-size: 18px; font-weight: 700; color: #fff;">${name}</h3>
    <div style="font-size: 12px; font-weight: 600; color: ${isUnlocked ? '#4ade80' : 'var(--text-muted)'}; margin: 4px 0 12px;">
      ${isUnlocked ? 'Achievement Earned' : 'Locked'}
    </div>
    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${req}</p>
  `;
  modal.classList.add("open");
}

function renderProfile() {
  const totalStepsEl = document.getElementById("profile-total-steps");
  const totalKmEl = document.getElementById("profile-total-km");
  const streakEl = document.getElementById("profile-streak-count");
  const slider = document.getElementById("step-goal-range");
  const readout = document.getElementById("goal-readout-val");

  if (totalStepsEl) totalStepsEl.textContent = state.totalLifetimeSteps.toLocaleString();
  if (totalKmEl) totalKmEl.textContent = `${state.totalKm.toFixed(1)} km`;
  if (streakEl) streakEl.textContent = `${state.streak} days`;
  if (slider && readout) {
    slider.value = state.dailyGoal;
    readout.textContent = state.dailyGoal.toLocaleString();
  }
}

// ═══════════════════════════════════════════════════════════════════
// Navigation Controller
// ═══════════════════════════════════════════════════════════════════
function switchTab(tabId) {
  document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

  const targetPane = document.getElementById(`pane-${tabId}`);
  const targetLink = document.getElementById(`nav-link-${tabId}`);

  if (targetPane) targetPane.classList.add("active");
  if (targetLink) targetLink.classList.add("active");

  if (tabId === "dashboard") updateDashboard();
  if (tabId === "quests") renderQuestsCatalog();
  if (tabId === "map") renderTrailMap();
  if (tabId === "leaderboard") renderLeaderboard();
  if (tabId === "achievements") renderAchievements();
  if (tabId === "profile") renderProfile();
}

// ═══════════════════════════════════════════════════════════════════
// Step Simulator Controller
// ═══════════════════════════════════════════════════════════════════
let autoWalkTimer = null;

function addSimulatedSteps(count) {
  state.addSteps(count);
  updateDashboard();
  renderTrailMap();
  renderLeaderboard();
  renderAchievements();
}

function toggleAutoSimulation() {
  const btn = document.getElementById("btn-auto-simulate");
  if (autoWalkTimer) {
    clearInterval(autoWalkTimer);
    autoWalkTimer = null;
    if (btn) {
      btn.classList.remove("active");
      btn.textContent = "Simulate Walk: Off";
    }
  } else {
    autoWalkTimer = setInterval(() => {
      addSimulatedSteps(20);
    }, 150);
    if (btn) {
      btn.classList.add("active");
      btn.textContent = "Simulate Walk: On";
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// DOM Initialization
// ═══════════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  // Navigation Links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const tab = link.dataset.tab;
      switchTab(tab);
    });
  });

  // Simulator Buttons
  const btn500 = document.getElementById("btn-add-500");
  if (btn500) btn500.addEventListener("click", () => addSimulatedSteps(500));

  const btn2500 = document.getElementById("btn-add-2500");
  if (btn2500) btn2500.addEventListener("click", () => addSimulatedSteps(2500));

  const btnAuto = document.getElementById("btn-auto-simulate");
  if (btnAuto) btnAuto.addEventListener("click", toggleAutoSimulation);

  const btnReset = document.getElementById("btn-reset-demo");
  if (btnReset) btnReset.addEventListener("click", () => {
    if (confirm("Reset walking progress to day 1?")) {
      state.resetAll();
      updateDashboard();
      renderTrailMap();
      renderLeaderboard();
      renderAchievements();
      showToast("Progress reset to day 1");
    }
  });

  // Quests Search & Filter
  const searchInput = document.getElementById("quest-search-input");
  if (searchInput) searchInput.addEventListener("input", renderQuestsCatalog);

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderQuestsCatalog();
    });
  });

  // Goal Slider
  const goalRange = document.getElementById("step-goal-range");
  const goalReadout = document.getElementById("goal-readout-val");
  if (goalRange && goalReadout) {
    goalRange.addEventListener("input", (e) => {
      state.dailyGoal = parseInt(e.target.value, 10);
      goalReadout.textContent = state.dailyGoal.toLocaleString();
      state.save();
      updateDashboard();
    });
  }

  // Modal Dialog Close
  const modalClose = document.getElementById("dialog-close-btn");
  const modal = document.getElementById("dialog-overlay");
  if (modalClose && modal) {
    modalClose.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  // Initial renders
  updateDashboard();
  renderQuestsCatalog();
  renderTrailMap();
  renderLeaderboard();
  renderAchievements();
  renderProfile();
});
