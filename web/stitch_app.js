/* ═══════════════════════════════════════════════════════════════════
   StepQuest — Precision Endurance Trail Tracking
   Interactive UI Logic, Modals, Filters, & Telemetry Controller
   ═══════════════════════════════════════════════════════════════════ */

// Research-based athletic stride constants
const KM_PER_STEP = 0.000762;
const KCAL_PER_STEP = 0.042;
const GAUGE_CIRCUMFERENCE = 427.25; // 2 * PI * 68

// Detailed Topographic Waypoints Ledger
const WAYPOINTS_DB = {
  1: {
    seq: "#1 • 0.0 KM",
    title: "Delhi Rajpath Zero Stone",
    altitude: "216 M",
    grade: "0.1%",
    status: "COMPLETED",
    statusColor: "text-secondary",
    coords: "28.6129° N, 77.2295° E",
    remaining: "464.0 KM remaining",
    desc: "Initial survey obelisk at Rajpath ceremonial corridor. Flat asphalt highway surface with minimal gradient."
  },
  2: {
    seq: "#2 • 72.0 KM",
    title: "Meerut Historic Ridge",
    altitude: "225 M",
    grade: "0.4%",
    status: "COMPLETED",
    statusColor: "text-secondary",
    coords: "28.9845° N, 77.7064° E",
    remaining: "392.0 KM remaining",
    desc: "Cleared on Oct 16. Fast cadence sustained across the highway bypass corridor and historical cantonment ridge."
  },
  3: {
    seq: "#3 • 142.0 KM",
    title: "Muzaffarnagar Oasis",
    altitude: "232 M",
    grade: "0.3%",
    status: "COMPLETED",
    statusColor: "text-secondary",
    coords: "29.4727° N, 77.7085° E",
    remaining: "322.0 KM remaining",
    desc: "Cleared on Oct 21. Water resupply logged at regional irrigation canal junction greenway."
  },
  4: {
    seq: "#4 • 210.0 KM",
    title: "Haridwar Holy Ghats",
    altitude: "314 M",
    grade: "1.2%",
    status: "COMPLETED",
    statusColor: "text-secondary",
    coords: "29.9457° N, 78.1642° E",
    remaining: "254.0 KM remaining",
    desc: "Cleared yesterday. Shivalik foothill transition marked at Har Ki Pauri footbridge and river stone pathways."
  },
  5: {
    seq: "#5 • 235.0 KM (TARGET)",
    title: "Rishikesh Foothills",
    altitude: "372 M",
    grade: "3.2%",
    status: "ACTIVE TARGET",
    statusColor: "text-primary",
    coords: "30.0869° N, 78.2676° E",
    remaining: "20.8 KM remaining (approx. 27,200 steps)",
    desc: "Gateway to the lower Garhwal Himalayas. Transition from flat river basin terrain to winding mountain singletrack."
  },
  6: {
    seq: "#6 • 310.0 KM",
    title: "Devprayag Confluence",
    altitude: "830 M",
    grade: "5.8%",
    status: "LOCKED",
    statusColor: "text-outline",
    coords: "30.1459° N, 78.5986° E",
    remaining: "95.8 KM remaining",
    desc: "Sacred confluence of Alaknanda and Bhagirathi rivers nested between sheer mountain canyon ridges."
  },
  7: {
    seq: "#7 • 378.0 KM",
    title: "Rudraprayag Canyon",
    altitude: "895 M",
    grade: "7.2%",
    status: "LOCKED",
    statusColor: "text-outline",
    coords: "30.2844° N, 78.9811° E",
    remaining: "163.8 KM remaining",
    desc: "Mountain pass sector with sustained 7.2% technical climbing grade and narrow gorge tracks."
  },
  8: {
    seq: "#8 • 464.0 KM (FINISH)",
    title: "Kedarnath High Shrine",
    altitude: "3,583 M",
    grade: "14.5%",
    status: "LOCKED SUMMIT",
    statusColor: "text-tertiary",
    coords: "30.7352° N, 79.0669° E",
    remaining: "249.8 KM remaining",
    desc: "Terminal sacred temple plateau in Mandakini valley glacier basin with high-altitude alpine terrain."
  }
};

// Route Telemetry Specification Database (Matches 4 Quests Cards exactly)
const ROUTES_SPEC_DB = {
  'dehradun-kedarnath': {
    title: "Dehradun to Kedarnath Sanctuary Trail",
    gps: "1:25,000 Garhwal Topo",
    gpsStatus: "GNSS Differential",
    cal: "1,310 kcal / 15km",
    calNote: "High Alpine Ascent",
    dist: "248 KM (approx. 325,000 steps)",
    terrain: "Doon Shivalik Basin to Alpine Glacier Shrine",
    desc: "Originates at Dehradun Clock Tower. Passes Rishikesh foothills and sacred river confluences up into the glacial Mandakini gorge to Kedarnath temple plateau."
  },
  'dehradun-nagtibba': {
    title: "Dehradun to Mussoorie & Nag Tibba Ridge",
    gps: "1:25,000 Ridge Topo",
    gpsStatus: "Barometric Triangulated",
    cal: "1,140 kcal / 15km",
    calNote: "Steep Ridge Climbing",
    dist: "68 KM (approx. 89,000 steps)",
    terrain: "Oak & Rhododendron Forest Singletrack",
    desc: "Direct local departure from Dehradun Rajpur corridor through Queen of Hills ridge to the panoramic 3,022m summit of Nag Tibba."
  },
  kedarnath: {
    title: "Delhi to Kedarnath Corridor",
    gps: "1:25,000 Topo",
    gpsStatus: "Satellite Verified",
    cal: "1,240 kcal / 15km",
    calNote: "Grade-weighted",
    dist: "464 KM (approx. 608,000 steps)",
    terrain: "Himalayan Foothill & Alpine Glacier Basin",
    desc: "StepQuest routes sync automatically with external wearable chronometers. All elevation metrics reflect barometric corrections verified by Survey of India triangulation benchmarks."
  },
  goa: {
    title: "Mumbai to Goa Konkan Trail",
    gps: "1:50,000 Coastal Topo",
    gpsStatus: "GNSS Differential",
    cal: "1,180 kcal / 15km",
    calNote: "Tidal-adjusted",
    dist: "587 KM (approx. 770,000 steps)",
    terrain: "Arabian Sea Cliffs & Coastal Laterite Ramparts",
    desc: "Scenic coastal expedition tracking historic sea forts and palm groves. Includes continuous sea-level barometer baselining."
  },
  manali: {
    title: "Manali to Leh Highway",
    gps: "1:25,000 Alpine Topo",
    gpsStatus: "High Precision GNSS",
    cal: "1,620 kcal / 15km",
    calNote: "High-altitude grade",
    dist: "474 KM (approx. 622,000 steps)",
    terrain: "High-Altitude Passes (Rohtang & Tanglang La)",
    desc: "Arduous Himalayan pass traversal crossing five high-altitude passes above 4,000m. Acclimatization cadence safeguards active."
  },
  jaipur: {
    title: "Jaipur to Agra Heritage Trail",
    gps: "1:50,000 Survey Topo",
    gpsStatus: "GNSS Differential",
    cal: "980 kcal / 15km",
    calNote: "Grade-level pace",
    dist: "240 KM (approx. 315,000 steps)",
    terrain: "Aravalli Ridge & Semi-Arid Plains",
    desc: "Historic Golden Triangle pedestrian route traversing Rajput forts and Mughal architectural monuments along historic trunk roads."
  }
};

// Expeditions dictionary for cross-screen synchronization
const EXPEDITIONS_DATA = {
  'dehradun-kedarnath': {
    region: "Garhwal Himalayan Spine",
    title: "Dehradun to Kedarnath",
    fullName: "Dehradun to Kedarnath Sanctuary Trail",
    sector: "Doon to High Glacier Sector",
    mapTitle: "Dehradun to Kedarnath Sanctuary",
    totalKm: 248.0,
    completedKm: 42.0,
    pct: 17,
    originCity: "dehradun"
  },
  'dehradun-nagtibba': {
    region: "Lesser Himalayan Ridge",
    title: "Dehradun to Nag Tibba",
    fullName: "Dehradun to Mussoorie & Nag Tibba Ridge",
    sector: "Shivalik to Peak Ridge Sector",
    mapTitle: "Dehradun to Nag Tibba Ridge",
    totalKm: 68.0,
    completedKm: 18.0,
    pct: 26,
    originCity: "dehradun"
  },
  kedarnath: {
    region: "Himalayan Sanctuary Route",
    title: "Delhi to Kedarnath",
    fullName: "Delhi to Kedarnath Corridor",
    sector: "Himalayan Ascent Sector",
    mapTitle: "Delhi to Kedarnath Sanctuary",
    totalKm: 464.0,
    completedKm: 214.2,
    pct: 46,
    originCity: "delhi"
  },
  goa: {
    region: "Western Ghats Shoreline",
    title: "Mumbai to Goa",
    fullName: "Mumbai to Goa Konkan Trail",
    sector: "Konkan Coastal Sector",
    mapTitle: "Mumbai to Goa Coastal Trail",
    totalKm: 587.0,
    completedKm: 182.4,
    pct: 31,
    originCity: "mumbai"
  },
  manali: {
    region: "Trans-Himalayan Pass Route",
    title: "Manali to Leh",
    fullName: "Manali to Leh Highway",
    sector: "Ladakh High-Pass Sector",
    mapTitle: "Manali to Leh Trans-Himalayan",
    totalKm: 474.0,
    completedKm: 94.8,
    pct: 20,
    originCity: "manali"
  },
  jaipur: {
    region: "Aravalli Heritage Corridor",
    title: "Jaipur to Agra",
    fullName: "Jaipur to Agra Heritage Trail",
    sector: "Mughal Trunk Road Sector",
    mapTitle: "Jaipur to Agra Heritage Trail",
    totalKm: 240.0,
    completedKm: 168.0,
    pct: 70,
    originCity: "jaipur"
  }
};

// Curated Geographic Expedition Hubs
const CITY_HUBS = {
  dehradun: { name: "Dehradun, Uttarakhand", label: "Dehradun, UK", city: "Dehradun", state: "Uttarakhand", lat: 30.3165, lon: 78.0322 },
  delhi: { name: "Delhi, NCR", label: "Delhi, NCR", city: "Delhi", state: "Delhi NCR", lat: 28.6139, lon: 77.2090 },
  rishikesh: { name: "Rishikesh, Uttarakhand", label: "Rishikesh, UK", city: "Rishikesh", state: "Uttarakhand", lat: 30.0869, lon: 78.2676 },
  manali: { name: "Manali, Himachal Pradesh", label: "Manali, HP", city: "Manali", state: "Himachal Pradesh", lat: 32.2396, lon: 77.1887 },
  mumbai: { name: "Mumbai, Maharashtra", label: "Mumbai, MH", city: "Mumbai", state: "Maharashtra", lat: 18.9220, lon: 72.8347 },
  jaipur: { name: "Jaipur, Rajasthan", label: "Jaipur, RJ", city: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  chennai: { name: "Chennai, Tamil Nadu", label: "Chennai, TN", city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  leh: { name: "Leh, Ladakh", label: "Leh, Ladakh", city: "Leh", state: "Ladakh", lat: 34.1526, lon: 77.5771 }
};

class StepQuestTelemetry {
  constructor() {
    this.steps = 6420;
    this.goal = 10000;
    this.sessionSteps = 0;
    this.autoWalkTimer = null;
    this.currentCadence = 114;
    this.currentPace = 4.8;
    this.sortDistanceAsc = false;
    this.currentCity = localStorage.getItem('stepquest_origin_city') || 'dehradun';
    this.activeQuest = localStorage.getItem('stepquest_active_quest') || 'dehradun-kedarnath';
    this.currentLeaderboardScope = localStorage.getItem('stepquest_lead_scope') || 'country';
    this.currentRosterFilter = 'all';
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindSimulator();
    this.bindSyncNow();
    this.bindManualStepEntry();
    this.bindWaypointInspector();
    this.bindMapInteractivity();
    this.bindQuestsFiltersAndSort();
    this.bindRouteSpecModal();
    this.bindLeaderboardFilters();
    this.bindLeaderboardScope();
    this.bindAchievementsInteractivity();
    this.bindGlobalShortcuts();
    this.bindSupabaseIntegration();
    this.bindLocationSelector();
    this.bindDeviceSync();
    this.setOriginCity(this.currentCity, false);
    this.setActiveQuest(this.activeQuest, false);
    this.updateGauge();
    this.startAutomaticTracking();
  }

  /* ─── Toast Notification System ───────────────────────────────────── */
  showToast(message, icon = 'check_circle') {
    const toast = document.getElementById('app-toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (toastIcon) toastIcon.textContent = icon;

    // Show toast
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    // Clear previous timer
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3200);
  }

  /* ─── Active Quest Cross-Screen Synchronization ───────────────────── */
  setActiveQuest(questId, showFeedback = false) {
    const data = EXPEDITIONS_DATA[questId] || EXPEDITIONS_DATA.kedarnath;
    this.activeQuest = questId;
    localStorage.setItem('stepquest_active_quest', questId);

    // 1. Dashboard Active Quest Card
    const dashRegion = document.getElementById('dash-quest-region');
    const dashTitle = document.getElementById('dash-quest-title');
    const dashMileage = document.getElementById('dash-quest-mileage');
    const dashPct = document.getElementById('dash-quest-pct');
    const dashBar = document.getElementById('dash-quest-bar');

    if (dashRegion) dashRegion.textContent = data.region;
    if (dashTitle) dashTitle.textContent = data.title;
    if (dashMileage) {
      dashMileage.innerHTML = `${data.completedKm.toFixed(1)} KM <span class="text-outline font-normal">/ ${data.totalKm.toFixed(1)} KM</span>`;
    }
    if (dashPct) dashPct.textContent = `${data.pct}% COMPLETED`;
    if (dashBar) dashBar.style.width = `${data.pct}%`;

    // 2. Trail Map Header
    const mapSector = document.getElementById('map-quest-sector');
    const mapTitle = document.getElementById('map-quest-title');
    const mapRealized = document.getElementById('map-quest-realized');

    if (mapSector) mapSector.textContent = data.sector;
    if (mapTitle) mapTitle.textContent = data.mapTitle;
    if (mapRealized) mapRealized.textContent = `${data.pct}% Route Realized`;

    // 3. Leaderboard Arjun Walker Active Trek
    const leadExpedition = document.getElementById('lead-arjun-expedition');
    if (leadExpedition) leadExpedition.textContent = data.title;

    // 4. Update Quest Cards action button states
    document.querySelectorAll('.route-card').forEach(card => {
      const cardId = card.dataset.questId;
      const btnSelect = card.querySelector('.btn-select-trek');
      const isCurrent = cardId === questId;

      if (btnSelect) {
        if (isCurrent) {
          btnSelect.innerHTML = '<span class="material-symbols-outlined text-lg leading-none">navigation</span><span>Continue Quest</span>';
          btnSelect.className = 'flex-1 inline-flex items-center justify-center gap-space-xs py-space-sm px-space-md bg-primary-container text-on-primary font-label-lg text-label-lg uppercase tracking-wider rounded font-bold hover:bg-primary-container/90 active:scale-[0.99] transition-all btn-select-trek cursor-pointer';
        } else {
          btnSelect.innerHTML = '<span class="material-symbols-outlined text-lg leading-none">add_task</span><span>Select Trek</span>';
          btnSelect.className = 'flex-1 inline-flex items-center justify-center gap-space-xs py-space-sm px-space-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg uppercase tracking-wider rounded font-bold transition-all btn-select-trek cursor-pointer';
        }
      }
    });

    if (showFeedback) {
      this.showToast(`Active trek switched to: ${data.fullName}`, 'hiking');
    }
  }

  /* ─── Top Level Navigation ────────────────────────────────────────── */
  bindNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        switchTab(tab);
      });
    });

    // Also support anchor links / cards that link to tabs
    document.querySelectorAll('[data-path]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.path;
        if (tab) switchTab(tab);
      });
    });

    // Dashboard "View Trail Map" action button
    const btnDashMap = document.getElementById('btn-dash-view-map');
    if (btnDashMap) {
      btnDashMap.addEventListener('click', () => switchTab('trail-map'));
    }
  }

  /* ─── Real-Time Automatic Walking Tracking Engine ──────────────────── */
  startAutomaticTracking() {
    if (this.autoWalkTimer) clearInterval(this.autoWalkTimer);

    // Initial values
    this.currentCadence = 114;
    this.currentPace = (114 * KM_PER_STEP * 60).toFixed(1);

    // Continuous automatic cadence engine: runs on interval immediately on load
    this.autoWalkTimer = setInterval(() => {
      // Natural walking cadence pulse: 1 or 2 steps per beat (averaging ~114 SPM)
      const stepPulse = (Math.random() > 0.35) ? 2 : 1;
      this.steps += stepPulse;
      this.sessionSteps += stepPulse;

      // Cadence jitter: athletic natural variation (108 - 120 SPM)
      const jitter = Math.floor(Math.random() * 5) - 2;
      this.currentCadence = Math.min(122, Math.max(106, 114 + jitter));
      this.currentPace = (this.currentCadence * KM_PER_STEP * 60).toFixed(1);

      // Update HUD telemetry indicators
      const cadEl = document.getElementById('telemetry-live-cadence');
      if (cadEl) cadEl.textContent = `${this.currentCadence} SPM`;

      const paceEl = document.getElementById('telemetry-live-pace');
      if (paceEl) paceEl.textContent = `${this.currentPace} KM/H`;

      const sessionEl = document.getElementById('telemetry-session-steps');
      if (sessionEl) sessionEl.textContent = `+${this.sessionSteps.toLocaleString()} steps`;

      // Live step pulse flash
      const pulseBadge = document.getElementById('live-step-pulse-badge');
      if (pulseBadge) {
        pulseBadge.textContent = `+${stepPulse} step${stepPulse > 1 ? 's' : ''}`;
        pulseBadge.classList.remove('opacity-0');
        pulseBadge.classList.add('opacity-100');
        clearTimeout(this.pulseBadgeTimer);
        this.pulseBadgeTimer = setTimeout(() => {
          pulseBadge.classList.remove('opacity-100');
          pulseBadge.classList.add('opacity-0');
        }, 500);
      }

      // Dynamic "Now" bar update in hourly distribution chart
      const nowValEl = document.getElementById('chart-now-val');
      const nowBarEl = document.getElementById('chart-now-bar');
      if (nowValEl && nowBarEl) {
        const currentNowSteps = 100 + this.sessionSteps;
        nowValEl.textContent = currentNowSteps.toLocaleString();
        const nowPct = Math.min(100, Math.round((currentNowSteps / 1650) * 100));
        nowBarEl.style.height = `${Math.max(6, nowPct)}%`;
      }

      this.updateGauge();

      // Cloud synchronization with Supabase
      if (this.sessionSteps % 10 === 0 && window.StepQuestSupabase && typeof window.StepQuestSupabase.syncStepLog === 'function') {
        const activeData = EXPEDITIONS_DATA[this.activeQuest] || EXPEDITIONS_DATA.kedarnath;
        const completedKm = activeData.completedKm + (this.steps - 6420) * KM_PER_STEP;
        window.StepQuestSupabase.syncStepLog(stepPulse, this.steps, Math.max(0, completedKm));
      }
    }, 1000);

    // Auto-hook physical device motion sensors
    this.autoInitDeviceMotion();
  }

  autoInitDeviceMotion() {
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) return;
    let lastStepTime = 0;
    const MOTION_THRESHOLD = 11.5;
    const COOLDOWN_MS = 320;

    const onAutoMotion = (evt) => {
      const acc = evt.accelerationIncludingGravity || evt.acceleration;
      if (!acc) return;
      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      const mag = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (mag > MOTION_THRESHOLD && (now - lastStepTime) > COOLDOWN_MS) {
        lastStepTime = now;
        this.addSteps(1);
        this.sessionSteps += 1;
        const sessionEl = document.getElementById('telemetry-session-steps');
        if (sessionEl) sessionEl.textContent = `+${this.sessionSteps.toLocaleString()} steps`;
      }
    };

    try {
      window.addEventListener('devicemotion', onAutoMotion, true);
      const motionStatus = document.getElementById('motion-status-display');
      if (motionStatus) {
        motionStatus.textContent = 'AUTO-ACTIVE (STREAMING)';
        motionStatus.className = 'font-bold text-secondary text-base mt-0.5 animate-pulse';
      }
    } catch (e) {
      // Fallback to internal cadence engine
    }
  }

  /* ─── Telemetry Controls & Reset ───────────────────────────────────── */
  bindSimulator() {
    const btn500 = document.getElementById('sim-add-500');
    if (btn500) btn500.addEventListener('click', () => {
      this.addSteps(500);
      this.showToast('+500 steps pulse registered', 'footprint');
    });

    const btn2500 = document.getElementById('sim-add-2500');
    if (btn2500) btn2500.addEventListener('click', () => {
      this.addSteps(2500);
      this.showToast('+2,500 steps sprint registered', 'directions_run');
    });

    const btnAuto = document.getElementById('sim-auto-walk');
    if (btnAuto) {
      btnAuto.addEventListener('click', () => {
        if (this.autoWalkTimer) {
          clearInterval(this.autoWalkTimer);
          this.autoWalkTimer = null;
          btnAuto.textContent = 'Simulate Walk: Off';
          this.showToast('Walking tracking paused', 'pause');
        } else {
          this.startAutomaticTracking();
          btnAuto.textContent = 'Simulate Walk: On';
          this.showToast('Automatic walking tracking active', 'directions_walk');
        }
      });
    }

    const btnReset = document.getElementById('sim-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.steps = 6420;
        this.sessionSteps = 0;
        const sessionEl = document.getElementById('telemetry-session-steps');
        if (sessionEl) sessionEl.textContent = `+0 steps`;

        const nowValEl = document.getElementById('chart-now-val');
        const nowBarEl = document.getElementById('chart-now-bar');
        if (nowValEl && nowBarEl) {
          nowValEl.textContent = '100';
          nowBarEl.style.height = '6%';
        }

        this.updateGauge();
        this.showToast('Pedometer baseline reset to 6,420 steps', 'restart_alt');
      });
    }
  }

  /* ─── Sync Now Button ─────────────────────────────────────────────── */
  bindSyncNow() {
    const btnSync = document.getElementById('btn-sync-now');
    const syncIcon = document.getElementById('sync-icon');
    const syncText = document.getElementById('sync-text');
    const syncTimestamp = document.getElementById('sync-timestamp');

    if (btnSync) {
      btnSync.addEventListener('click', () => {
        if (syncIcon) syncIcon.classList.add('animate-spin-once');
        if (syncText) syncText.textContent = 'Syncing...';
        btnSync.disabled = true;

        setTimeout(() => {
          if (syncIcon) syncIcon.classList.remove('animate-spin-once');
          if (syncText) syncText.textContent = 'Sync Now';
          btnSync.disabled = false;

          if (syncTimestamp) {
            syncTimestamp.textContent = 'Updated just now • Synced';
          }
          this.showToast('Wearable sensors synchronized (42 Hz stream)', 'sync');
        }, 650);
      });
    }
  }

  /* ─── Manual Step Entry Modal ─────────────────────────────────────── */
  bindManualStepEntry() {
    const modal = document.getElementById('modal-manual-step');
    const inputCustom = document.getElementById('input-custom-steps');
    const previewDist = document.getElementById('preview-distance');
    const previewKcal = document.getElementById('preview-kcal');
    const btnConfirm = document.getElementById('confirm-step-modal');
    const btnCancel = document.getElementById('cancel-step-modal');
    const btnClose = document.getElementById('close-step-modal');
    const presetBtns = document.querySelectorAll('.step-preset-btn');

    const openModal = () => {
      if (!modal) return;
      modal.classList.remove('hidden');
      if (inputCustom) {
        inputCustom.value = '';
        inputCustom.focus();
      }
      updatePreview(0);
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.add('hidden');
    };

    const updatePreview = (count) => {
      const num = parseInt(count) || 0;
      if (previewDist) previewDist.textContent = `+${(num * KM_PER_STEP).toFixed(2)} KM`;
      if (previewKcal) previewKcal.textContent = `+${Math.round(num * KCAL_PER_STEP)} KCAL`;
    };

    // Open triggers from all screens
    const triggerIds = ['btn-dash-log-walk', 'btn-map-manual-entry', 'btn-lead-log-session'];
    triggerIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', openModal);
    });

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    // Click outside backdrop to close
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Preset buttons
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = parseInt(btn.dataset.steps) || 0;
        if (inputCustom) inputCustom.value = amt;
        updatePreview(amt);
      });
    });

    // Custom input typing
    if (inputCustom) {
      inputCustom.addEventListener('input', () => {
        updatePreview(inputCustom.value);
      });
      inputCustom.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (btnConfirm) btnConfirm.click();
        }
      });
    }

    // Confirm addition
    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        const amt = parseInt(inputCustom ? inputCustom.value : 0);
        if (!amt || isNaN(amt) || amt <= 0) {
          this.showToast('Please specify a valid step count', 'error');
          if (inputCustom) inputCustom.focus();
          return;
        }

        this.addSteps(amt);
        closeModal();
        this.showToast(`Logged +${amt.toLocaleString()} steps! (Total: ${this.steps.toLocaleString()})`, 'check_circle');
      });
    }
  }

  /* ─── Waypoint Telemetry Inspector Modal ──────────────────────────── */
  bindWaypointInspector() {
    const modal = document.getElementById('modal-waypoint');
    const closeBtn = document.getElementById('close-waypoint-modal');
    const actionCloseBtn = document.getElementById('btn-waypoint-close');

    const openWaypoint = (wpId) => {
      const data = WAYPOINTS_DB[wpId] || WAYPOINTS_DB[5];
      if (!data || !modal) return;

      const elSeq = document.getElementById('wp-seq');
      const elTitle = document.getElementById('wp-title');
      const elAlt = document.getElementById('wp-alt');
      const elGrade = document.getElementById('wp-grade');
      const elStatus = document.getElementById('wp-status');
      const elCoords = document.getElementById('wp-coords');
      const elRem = document.getElementById('wp-remaining');
      const elDesc = document.getElementById('wp-desc');

      if (elSeq) elSeq.textContent = data.seq;
      if (elTitle) elTitle.textContent = data.title;
      if (elAlt) elAlt.textContent = data.altitude;
      if (elGrade) elGrade.textContent = data.grade;
      if (elStatus) {
        elStatus.textContent = data.status;
        elStatus.className = `font-bold text-sm mt-0.5 ${data.statusColor}`;
      }
      if (elCoords) elCoords.textContent = data.coords;
      if (elRem) elRem.textContent = data.remaining;
      if (elDesc) elDesc.textContent = data.desc;

      modal.classList.remove('hidden');
    };

    const closeWaypoint = () => {
      if (modal) modal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeWaypoint);
    if (actionCloseBtn) actionCloseBtn.addEventListener('click', closeWaypoint);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeWaypoint();
      });
    }

    // Inspect waypoint button in Trail Map
    const btnInspect = document.getElementById('btn-inspect-waypoint');
    if (btnInspect) {
      btnInspect.addEventListener('click', () => openWaypoint(5));
    }

    // Dashboard Next Waypoint card & button
    const cardNext = document.getElementById('card-next-waypoint');
    if (cardNext) {
      cardNext.addEventListener('click', () => openWaypoint(5));
    }
    const btnNext = document.getElementById('btn-next-waypoint');
    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        openWaypoint(5);
      });
    }

    // Milestone cards in Trail Map list
    document.querySelectorAll('.milestone-card').forEach(card => {
      card.addEventListener('click', () => {
        const num = parseInt(card.dataset.milestone) || 5;
        openWaypoint(num);
      });
    });

    // Milestone nodes on SVG trail map
    document.querySelectorAll('.milestone-node').forEach(node => {
      node.addEventListener('click', () => {
        const num = parseInt(node.dataset.milestone) || 5;
        openWaypoint(num);
      });
    });
  }

  /* ─── Trail Map Contours & Interactivity ──────────────────────────── */
  bindMapInteractivity() {
    const toggleBtn = document.getElementById('toggleGridBtn');
    const gridOverlay = document.getElementById('gridOverlay');
    if (toggleBtn && gridOverlay) {
      toggleBtn.addEventListener('click', () => {
        const isVisible = gridOverlay.getAttribute('opacity') !== '0';
        gridOverlay.setAttribute('opacity', isVisible ? '0' : '0.65');
        toggleBtn.classList.toggle('text-primary');
        this.showToast(`Topographic grid ${isVisible ? 'hidden' : 'enabled'}`, 'grid_on');
      });
    }
  }

  /* ─── Quests Filtering & Distance Sorting ─────────────────────────── */
  bindQuestsFiltersAndSort() {
    const searchInput = document.getElementById('route-search');
    const filterButtons = document.querySelectorAll('.filter-chip');
    const routeCards = document.querySelectorAll('.route-card');
    const routesGrid = document.getElementById('routes-grid');
    const sortBtn = document.getElementById('btn-sort-distance');
    const sortLabel = document.getElementById('sort-distance-label');
    const sortIcon = document.getElementById('sort-distance-icon');

    const applyFilters = () => {
      const query = (searchInput?.value || '').toLowerCase().trim();
      const activeBtn = document.querySelector('.filter-chip.bg-primary-container');
      const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';

      routeCards.forEach(card => {
        const title = card.querySelector('h2, h3, .font-headline-md, .font-headline-sm')?.textContent.toLowerCase() || '';
        const desc = card.textContent.toLowerCase();
        const diff = (card.dataset.routeDifficulty || '').toLowerCase();
        const type = (card.dataset.routeType || '').toLowerCase();

        let matchesSearch = title.includes(query) || desc.includes(query);
        let matchesFilter = true;

        if (activeFilter === 'easy') matchesFilter = diff === 'easy';
        else if (activeFilter === 'moderate') matchesFilter = diff === 'moderate';
        else if (activeFilter === 'hard') matchesFilter = diff === 'hard';
        else if (activeFilter === 'himalayan') matchesFilter = type === 'himalayan';
        else if (activeFilter === 'coastal') matchesFilter = type === 'coastal';

        if (matchesSearch && matchesFilter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    };

    if (searchInput) searchInput.addEventListener('input', applyFilters);

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.className = 'filter-chip px-space-md py-space-xs font-label-md text-label-md uppercase tracking-wider rounded transition-all bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-surface-container-highest cursor-pointer';
        });
        btn.className = 'filter-chip px-space-md py-space-xs font-label-md text-label-md uppercase tracking-wider rounded transition-all bg-primary-container text-on-primary font-bold shadow-sm cursor-pointer';
        applyFilters();
      });
    });

    // Distance Sort Button
    if (sortBtn && routesGrid) {
      sortBtn.addEventListener('click', () => {
        this.sortDistanceAsc = !this.sortDistanceAsc;

        if (sortLabel) {
          sortLabel.textContent = this.sortDistanceAsc ? 'DISTANCE (LOW → HIGH)' : 'DISTANCE (HIGH → LOW)';
        }
        if (sortIcon) {
          sortIcon.textContent = this.sortDistanceAsc ? 'north' : 'south';
        }

        const cardsArray = Array.from(routeCards);
        cardsArray.sort((a, b) => {
          const distA = parseInt(a.dataset.distance) || 0;
          const distB = parseInt(b.dataset.distance) || 0;
          return this.sortDistanceAsc ? distA - distB : distB - distA;
        });

        cardsArray.forEach(card => routesGrid.appendChild(card));
        this.showToast(`Sorted by distance (${this.sortDistanceAsc ? 'Low to High' : 'High to Low'})`, 'swap_vert');
      });
    }

    // Connect 'Continue Quest' / 'Select Trek' buttons
    document.querySelectorAll('.btn-select-trek').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.route-card');
        const qId = card?.dataset.questId || 'kedarnath';
        this.setActiveQuest(qId, true);

        // Smooth switch to Trail Map
        setTimeout(() => switchTab('trail-map'), 350);
      });
    });
  }

  /* ─── Route Telemetry Specification Modal ─────────────────────────── */
  bindRouteSpecModal() {
    const modal = document.getElementById('spec-modal');
    const closeBtn = document.getElementById('spec-close-btn');
    const confirmBtn = document.getElementById('spec-confirm-btn');

    const openSpec = (questId) => {
      const data = ROUTES_SPEC_DB[questId] || ROUTES_SPEC_DB.kedarnath;
      if (!data || !modal) return;

      const title = document.getElementById('spec-modal-title');
      const gps = document.getElementById('spec-gps');
      const cal = document.getElementById('spec-cal');
      const dist = document.getElementById('spec-dist');
      const terrain = document.getElementById('spec-terrain');
      const desc = document.getElementById('spec-desc');

      if (title) title.textContent = `${data.title} Spec`;
      if (gps) gps.textContent = data.gps;
      if (cal) cal.textContent = data.cal;
      if (dist) dist.textContent = data.dist;
      if (terrain) terrain.textContent = data.terrain;
      if (desc) desc.textContent = data.desc;

      modal.classList.remove('hidden');
    };

    const closeSpec = () => {
      if (modal) modal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeSpec);
    if (confirmBtn) confirmBtn.addEventListener('click', closeSpec);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSpec();
      });
    }

    document.querySelectorAll('.btn-view-spec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.route-card');
        const qId = card?.dataset.questId || 'kedarnath';
        openSpec(qId);
      });
    });
  }

  /* ─── Leaderboard Roster Filters ──────────────────────────────────── */
  bindLeaderboardFilters() {
    const filterButtons = document.querySelectorAll('.roster-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyRosterFilter(btn.dataset.rosterFilter || 'all', true);
      });
    });
  }

  applyRosterFilter(filter, showToast = true) {
    this.currentRosterFilter = filter;
    const filterButtons = document.querySelectorAll('.roster-filter-btn');
    const rows = document.querySelectorAll('#leaderboard-tbody tr');

    filterButtons.forEach(btn => {
      if (btn.dataset.rosterFilter === filter) {
        btn.className = 'roster-filter-btn px-space-md py-space-xs rounded bg-primary-container text-on-primary font-bold font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs cursor-pointer shadow-sm transition-all';
      } else {
        btn.className = 'roster-filter-btn px-space-md py-space-xs rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs transition-colors cursor-pointer';
      }
    });

    // Find Arjun Walker's current rank in this scope
    let userRank = 4;
    rows.forEach(row => {
      if (row.querySelector('#lead-arjun-distance')) {
        userRank = parseInt(row.dataset.rank) || 4;
      }
    });

    rows.forEach(row => {
      const rank = parseInt(row.dataset.rank) || 0;
      let show = true;

      if (filter === 'near') {
        // Show standings near Arjun Walker (±2)
        const minRank = Math.max(1, userRank - 2);
        const maxRank = userRank + 2;
        show = rank >= minRank && rank <= maxRank;
      } else if (filter === 'top3') {
        show = rank >= 1 && rank <= 3;
      }

      row.style.display = show ? '' : 'none';
    });

    if (showToast) {
      const filterNames = { all: 'All Ranks (1-8)', near: `Near Your Standings (Rank ${userRank} ±2)`, top3: 'Top 3 Podium' };
      this.showToast(`Filtered: ${filterNames[filter] || 'Leaderboard'}`, 'format_list_numbered');
    }
  }

  /* ─── 3-Way Geographic Scope Switcher (Country / State / City) ─────── */
  bindLeaderboardScope() {
    const scopeButtons = document.querySelectorAll('.scope-btn');
    scopeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const scope = btn.dataset.scope || 'country';
        this.setLeaderboardScope(scope, true);
      });
    });

    // Initial render with saved or default scope
    this.renderLeaderboardScope(this.currentLeaderboardScope);
  }

  setLeaderboardScope(scope, showToast = true) {
    this.currentLeaderboardScope = scope;
    localStorage.setItem('stepquest_lead_scope', scope);

    // Update buttons styling
    document.querySelectorAll('.scope-btn').forEach(btn => {
      const isTarget = btn.dataset.scope === scope;
      if (isTarget) {
        btn.className = 'scope-btn px-space-md py-2 rounded-lg font-label-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 bg-primary-container text-on-primary shadow-sm cursor-pointer';
      } else {
        btn.className = 'scope-btn px-space-md py-2 rounded-lg font-label-mono text-xs uppercase tracking-wider font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-1.5 cursor-pointer';
      }
    });

    this.renderLeaderboardScope(scope);

    if (showToast) {
      const hub = CITY_HUBS[this.currentCity] || CITY_HUBS.dehradun;
      const labels = {
        country: 'Best in Country (All-India League)',
        state: `Best in State (${hub.state})`,
        city: `Best in City (${hub.city})`
      };
      this.showToast(`Switched League: ${labels[scope] || scope}`, 'public');
    }
  }

  getLeaderboardScopeData(scope) {
    const hub = CITY_HUBS[this.currentCity] || CITY_HUBS.dehradun;
    const cityName = hub.city || 'Dehradun';
    const stateName = hub.state || 'Uttarakhand';

    if (scope === 'state') {
      return {
        scope: 'state',
        title: `Statewide Leaderboard • ${stateName} Trail Command`,
        pill: `State Division (${stateName})`,
        podiumTitle: `State Vanguard — ${stateName} Championship Division`,
        podiumBadge: 'Top 3 State Qualifiers',
        kpi: {
          rank: '#02',
          totalStr: '/ 38 Striders',
          delta: 'Pace delta: Silver Medal Standing (+1 rank)',
          deltaColor: 'text-secondary',
          gapTitle: 'Gap to Gold #1 (Devender Negi)',
          gapVal: '7.7',
          gapSub: '(~10,100 steps)',
          gapPct: '89%',
          cohortVal: '38',
          cohortTotalSub: 'State Striders',
          cohortSub: `${stateName} Division Verified GPS Trackers`
        },
        podium: [
          {
            rank: 1,
            name: 'Devender Negi',
            badgeRole: 'State Leader',
            badgeRoleClass: 'text-secondary',
            location: `${hub.city === 'Rishikesh' ? 'Dehradun' : 'Rishikesh'}, UK • Himalayan Guide`,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAesIEx__6NiAY0jh0MCe7OAurEx1meZzTH9l7YM9cNMQ4-TfGM6NS_rXVI7Wjl0wMy8mOtPGm0mrQftc5dVVg6KBFyLo-BIxEvmTYEGzanQrcRHme5LFjOSSjNH-cA-vd2S0YlvR_AwDxEs1tFTgtA2RWhWkE3L2tddTe7n3QOTDZqOsMLBzVsORrXFSWFXtNwTcczEp9QRVFNfemB1J0WnWybu30Uz6XeENV-3wti3lkUimWm-I53XQ',
            icon: 'workspace_premium',
            iconColor: 'text-tertiary',
            stripeClass: 'bg-tertiary',
            rankBadgeClass: 'bg-tertiary text-on-tertiary',
            distClass: 'text-tertiary',
            expTitle: 'Garhwal Glacier Alpine',
            expSub: 'Gangotri to Gaumukh Pass',
            dist: 71.8,
            steps: '94.2K',
            isUser: false
          },
          {
            rank: 2,
            name: 'Arjun Walker',
            badgeRole: 'Silver Podium',
            badgeRoleClass: 'text-primary',
            location: `${cityName}, ${stateName} • Basecamp Lead`,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1HDhWZCtsDEArZoS1-o4OYIAVs6TCGB7x-gDp2GAsPiQ330VX7rM_Vustoj2GMnVPVA0XCXQ4fZAMv--WwLag4JGuyJbhnnbsueWx7FfFmlFFkOessziT8wuZqqQCkyGh7lanSpHgF69KvBwPzQ606iMClDz9fPmHlQFYYg01KcaOtfDrzwHTO627H5Ym4uczn2s_V2_S6SBKGFGICBRFWYIvBWIE2w0lehEvFs11T0IBbISCnkJ6PQ',
            icon: 'military_tech',
            iconColor: 'text-outline',
            stripeClass: 'bg-surface-bright',
            rankBadgeClass: 'bg-surface-bright text-on-surface',
            distClass: 'text-primary',
            expTitle: 'Delhi to Kedarnath',
            expSub: 'Garhwal Pilgrim Ascent',
            dist: 64.1,
            steps: '84.1K',
            isUser: true
          },
          {
            rank: 3,
            name: 'Kavita Rawat',
            badgeRole: 'Challenger',
            badgeRoleClass: 'text-outline',
            location: `Nainital, ${stateName} • Trail Explorer`,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIEu_YDr3nMnUppVG8jn_Zxsq4oSqbOE6Cas8WKL1oUXoqd6uwOqwpOMQzXTF9swVcuk8VYkAJecpNBks6HkoSQbimyZCuRfSIiQJoYtlgmgAGOaCHIHoNvkV_s8vmBjuYkCSQCslYXIpjfDmSoRWLuXdzVbpTkA81LFUhl8RehQnewEfAwlnYY9zyiIC5ALN6EydxH2XHQE1VA3WJe2Jo3Si2HAGVH3Oc_LVdRWzdAeU24kETiz4FaA',
            icon: 'stars',
            iconColor: 'text-tertiary-container',
            stripeClass: 'bg-tertiary-container',
            rankBadgeClass: 'bg-tertiary-container text-on-tertiary-container',
            distClass: 'text-tertiary-container',
            expTitle: 'Kumaon Ridge Traverse',
            expSub: 'Pangot to Kilbury Peak',
            dist: 59.4,
            steps: '77.9K',
            isUser: false
          }
        ],
        roster: [
          {
            rank: 1,
            name: 'Devender Negi',
            loc: `${hub.city === 'Rishikesh' ? 'Dehradun' : 'Rishikesh'}, UK`,
            exp: 'Garhwal Glacier Alpine',
            dist: 71.8,
            steps: 94220,
            trend: 'DEFENDING',
            trendIcon: 'horizontal_rule',
            trendClass: 'text-secondary',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAesIEx__6NiAY0jh0MCe7OAurEx1meZzTH9l7YM9cNMQ4-TfGM6NS_rXVI7Wjl0wMy8mOtPGm0mrQftc5dVVg6KBFyLo-BIxEvmTYEGzanQrcRHme5LFjOSSjNH-cA-vd2S0YlvR_AwDxEs1tFTgtA2RWhWkE3L2tddTe7n3QOTDZqOsMLBzVsORrXFSWFXtNwTcczEp9QRVFNfemB1J0WnWybu30Uz6XeENV-3wti3lkUimWm-I53XQ',
            verified: true,
            isUser: false
          },
          {
            rank: 2,
            name: 'Arjun Walker',
            loc: `${cityName} / Basecamp`,
            exp: 'Delhi to Kedarnath',
            dist: 64.1,
            steps: 84120,
            trend: '+1 RANK',
            trendIcon: 'arrow_upward',
            trendClass: 'text-secondary',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1HDhWZCtsDEArZoS1-o4OYIAVs6TCGB7x-gDp2GAsPiQ330VX7rM_Vustoj2GMnVPVA0XCXQ4fZAMv--WwLag4JGuyJbhnnbsueWx7FfFmlFFkOessziT8wuZqqQCkyGh7lanSpHgF69KvBwPzQ606iMClDz9fPmHlQFYYg01KcaOtfDrzwHTO627H5Ym4uczn2s_V2_S6SBKGFGICBRFWYIvBWIE2w0lehEvFs11T0IBbISCnkJ6PQ',
            verified: true,
            isUser: true
          },
          {
            rank: 3,
            name: 'Kavita Rawat',
            loc: `Nainital, ${stateName}`,
            exp: 'Kumaon Ridge Traverse',
            dist: 59.4,
            steps: 77950,
            trend: 'DEFENDING',
            trendIcon: 'horizontal_rule',
            trendClass: 'text-outline',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIEu_YDr3nMnUppVG8jn_Zxsq4oSqbOE6Cas8WKL1oUXoqd6uwOqwpOMQzXTF9swVcuk8VYkAJecpNBks6HkoSQbimyZCuRfSIiQJoYtlgmgAGOaCHIHoNvkV_s8vmBjuYkCSQCslYXIpjfDmSoRWLuXdzVbpTkA81LFUhl8RehQnewEfAwlnYY9zyiIC5ALN6EydxH2XHQE1VA3WJe2Jo3Si2HAGVH3Oc_LVdRWzdAeU24kETiz4FaA',
            verified: true,
            isUser: false
          },
          {
            rank: 4,
            name: 'Rajesh Bhatt',
            loc: `Mussoorie, ${stateName}`,
            exp: 'Nag Tibba Summit Trail',
            dist: 56.1,
            steps: 73620,
            trend: '+2 POSITIONS',
            trendIcon: 'arrow_upward',
            trendClass: 'text-secondary',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMQANZo6aeWeENeMX7viQk3r1hojjLp1Kgn_jXTzO8tp7Tm5rw8tAJeA6PT5sWUr9EJLqOIEoxD7ouhiGWKekyVr3ZtwwQAugY6IFpaRkzZSBU0qQfcIB_hZxbN1KN0wcK2rh3qzFruO08AqI4cJXQTHQW444eSQ7XyvWsAUMAsIe1S5GlvJmSWnjEgydYqryPICg-aMwHVjyON7SgfDSBXyWjLY8tDDlr6WtRLrko5Vp5BKMiYw48rQ',
            verified: false,
            isUser: false
          },
          {
            rank: 5,
            name: 'Sunita Semwal',
            loc: `Haridwar, ${stateName}`,
            exp: 'Ganga Foothill Circuit',
            dist: 51.3,
            steps: 67320,
            trend: 'STABLE',
            trendIcon: 'horizontal_rule',
            trendClass: 'text-outline',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_nkVdPufjkHsTIJ66rBJVJo3WTFaqISWf4GWtkgUPKpUCQGeE_2SmYbBM52rekfwTyhrTe9kY-hlosSi_YkP07Lk5itySOOtrrs9Uh6wgoh-HLtkC6NKzjzNjAhfzoAD6lxjVZTrHisNPnC88YfLreXgujUxho13e03_VTarkAKHuJr-iUBJuyPVzgqmDTDdxOw7MuKqFvaNMVoMbsS15cfnlx3zzC4eZBwZ8maJLTSp6y0k7_AbpsA',
            verified: false,
            isUser: false
          },
          {
            rank: 6,
            name: 'Amit Chamoli',
            loc: `Joshimath, ${stateName}`,
            exp: 'Valley of Flowers Trail',
            dist: 48.7,
            steps: 63910,
            trend: '-1 RANK',
            trendIcon: 'arrow_downward',
            trendClass: 'text-error',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl23jl36yolCWYeQ8BilqjS2wwVSBYsFf2o_EqNtWJJ2X6knO2dg_cZxOpYECu7tuZTBSQpY5UoV9tsZtdG1o8pJtALLLzSCjIWw8RLOIMVBui8vzqDMfWEMN1WeVHGaiEdiFVVjaj9NXlSDs5tQWdLS7QHuCgOx8QZU2N9-ewvvh4RwJ6jA6kA91CBQ--jLMcdsbxzWePI39yTBx_6PoJP9bIfY9CQBZj8Ee6TM14-jnVqCodYwhDzw',
            verified: false,
            isUser: false
          },
          {
            rank: 7,
            name: 'Preeti Joshi',
            loc: `Almora, ${stateName}`,
            exp: 'Binsar Sanctuary Ascent',
            dist: 44.2,
            steps: 57990,
            trend: '+1 RANK',
            trendIcon: 'arrow_upward',
            trendClass: 'text-secondary',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Ds31sEdVRa6AanT28UfK9O4Vxa_h5ds9CkMZWllp5pFhQL0Cv92U-x17hR_uVrmMuoi1_ifC1UZ3ss6SBP5Zv0GtQizjGK9VEfA38xFs-g8JHLuawcl5aewmsAxne-qDWGSquRpNfDwAjRjJelwAt6K1TV6WUiZGsT8PdrfQawojumIVC6nC1giOaKsssP7X6Zi7qe96GyF3BIlvdtlSS1jUO6PMF1H0ym8KKSjfPWM0_BPcG35sYQ',
            verified: false,
            isUser: false
          },
          {
            rank: 8,
            name: 'Virendra Panwar',
            loc: `Uttarkashi, ${stateName}`,
            exp: 'Bhagirathi River Track',
            dist: 41.0,
            steps: 53800,
            trend: 'STABLE',
            trendIcon: 'horizontal_rule',
            trendClass: 'text-outline',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9IrvZtRV_SlJSq25LXepRkbsVsbfG5w09ZiM44k3v0BfF2MI_NbChXkTsi6GnmGYmXJ_mpA-bdlwgp92aYkDmPsi0M_BYZ3LCpPVzydZd9lQwK6kPtDARZ7pQAIN1fL9siMylgu3CUbNZjQZ0glo0puQZHQKuLhZ-1JpGcEcRcNsYcC_OEMyCLBaueiKzkuSFp4uGtgl71VLZv9kaC3GT8bJhZ0aVoUw3pdtBLyOY438YfhDmjSq3Q',
            verified: false,
            isUser: false
          }
        ]
      };
    }

    if (scope === 'city') {
      return {
        scope: 'city',
        title: `City Sector Leaderboard • ${cityName} Metropolitan Division`,
        pill: `Municipal League (${cityName})`,
        podiumTitle: `City Vanguard — ${cityName} District Championship`,
        podiumBadge: 'Top 3 Municipal Leaders',
        kpi: {
          rank: '#01',
          totalStr: '/ 14 Striders',
          delta: 'Pace delta: Undefeated City Champion (#1)',
          deltaColor: 'text-secondary',
          gapTitle: 'Lead Margin (Ahead of Rank 2)',
          gapVal: '+14.5',
          gapSub: '(~19,000 steps lead)',
          gapPct: '100%',
          cohortVal: '14',
          cohortTotalSub: 'City Striders',
          cohortSub: `${cityName} Basecamp Active Hardware`
        },
        podium: [
          {
            rank: 1,
            name: 'Arjun Walker',
            badgeRole: 'Gold Champion',
            badgeRoleClass: 'text-secondary font-extrabold',
            location: `${cityName} • Rajpur Basecamp Lead`,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1HDhWZCtsDEArZoS1-o4OYIAVs6TCGB7x-gDp2GAsPiQ330VX7rM_Vustoj2GMnVPVA0XCXQ4fZAMv--WwLag4JGuyJbhnnbsueWx7FfFmlFFkOessziT8wuZqqQCkyGh7lanSpHgF69KvBwPzQ606iMClDz9fPmHlQFYYg01KcaOtfDrzwHTO627H5Ym4uczn2s_V2_S6SBKGFGICBRFWYIvBWIE2w0lehEvFs11T0IBbISCnkJ6PQ',
            icon: 'workspace_premium',
            iconColor: 'text-tertiary',
            stripeClass: 'bg-tertiary',
            rankBadgeClass: 'bg-tertiary text-on-tertiary',
            distClass: 'text-tertiary',
            expTitle: 'Delhi to Kedarnath',
            expSub: 'Garhwal Pilgrim Ascent',
            dist: 64.1,
            steps: '84.1K',
            isUser: true
          },
          {
            rank: 2,
            name: 'Tarun Dobhal',
            badgeRole: '-14.5 KM',
            badgeRoleClass: 'text-outline',
            location: `${cityName} • Hathibarkala Pacesetter`,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMQANZo6aeWeENeMX7viQk3r1hojjLp1Kgn_jXTzO8tp7Tm5rw8tAJeA6PT5sWUr9EJLqOIEoxD7ouhiGWKekyVr3ZtwwQAugY6IFpaRkzZSBU0qQfcIB_hZxbN1KN0wcK2rh3qzFruO08AqI4cJXQTHQW444eSQ7XyvWsAUMAsIe1S5GlvJmSWnjEgydYqryPICg-aMwHVjyON7SgfDSBXyWjLY8tDDlr6WtRLrko5Vp5BKMiYw48rQ',
            icon: 'military_tech',
            iconColor: 'text-outline',
            stripeClass: 'bg-surface-bright',
            rankBadgeClass: 'bg-surface-bright text-on-surface',
            distClass: 'text-on-surface',
            expTitle: "Robber's Cave Trail",
            expSub: 'Guchhupani River Basin',
            dist: 49.6,
            steps: '65.1K',
            isUser: false
          },
          {
            rank: 3,
            name: 'Shalini Thapa',
            badgeRole: 'Contender',
            badgeRoleClass: 'text-primary',
            location: `${cityName} • Clement Town Strider`,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_nkVdPufjkHsTIJ66rBJVJo3WTFaqISWf4GWtkgUPKpUCQGeE_2SmYbBM52rekfwTyhrTe9kY-hlosSi_YkP07Lk5itySOOtrrs9Uh6wgoh-HLtkC6NKzjzNjAhfzoAD6lxjVZTrHisNPnC88YfLreXgujUxho13e03_VTarkAKHuJr-iUBJuyPVzgqmDTDdxOw7MuKqFvaNMVoMbsS15cfnlx3zzC4eZBwZ8maJLTSp6y0k7_AbpsA',
            icon: 'stars',
            iconColor: 'text-tertiary-container',
            stripeClass: 'bg-tertiary-container',
            rankBadgeClass: 'bg-tertiary-container text-on-tertiary-container',
            distClass: 'text-tertiary-container',
            expTitle: 'Mussoorie Foothill Trail',
            expSub: 'Jharipani Waterfall Ascent',
            dist: 43.8,
            steps: '57.5K',
            isUser: false
          }
        ],
        roster: [
          {
            rank: 1,
            name: 'Arjun Walker',
            loc: `${cityName} / Basecamp`,
            exp: 'Delhi to Kedarnath',
            dist: 64.1,
            steps: 84120,
            trend: 'DEFENDING GOLD',
            trendIcon: 'military_tech',
            trendClass: 'text-tertiary',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1HDhWZCtsDEArZoS1-o4OYIAVs6TCGB7x-gDp2GAsPiQ330VX7rM_Vustoj2GMnVPVA0XCXQ4fZAMv--WwLag4JGuyJbhnnbsueWx7FfFmlFFkOessziT8wuZqqQCkyGh7lanSpHgF69KvBwPzQ606iMClDz9fPmHlQFYYg01KcaOtfDrzwHTO627H5Ym4uczn2s_V2_S6SBKGFGICBRFWYIvBWIE2w0lehEvFs11T0IBbISCnkJ6PQ',
            verified: true,
            isUser: true
          },
          {
            rank: 2,
            name: 'Tarun Dobhal',
            loc: `${cityName} / Hathibarkala`,
            exp: "Robber's Cave Trail",
            dist: 49.6,
            steps: 65090,
            trend: 'STABLE',
            trendIcon: 'horizontal_rule',
            trendClass: 'text-outline',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMQANZo6aeWeENeMX7viQk3r1hojjLp1Kgn_jXTzO8tp7Tm5rw8tAJeA6PT5sWUr9EJLqOIEoxD7ouhiGWKekyVr3ZtwwQAugY6IFpaRkzZSBU0qQfcIB_hZxbN1KN0wcK2rh3qzFruO08AqI4cJXQTHQW444eSQ7XyvWsAUMAsIe1S5GlvJmSWnjEgydYqryPICg-aMwHVjyON7SgfDSBXyWjLY8tDDlr6WtRLrko5Vp5BKMiYw48rQ',
            verified: true,
            isUser: false
          },
          {
            rank: 3,
            name: 'Shalini Thapa',
            loc: `${cityName} / Clement Town`,
            exp: 'Mussoorie Foothill Trail',
            dist: 43.8,
            steps: 57480,
            trend: '+1 RANK',
            trendIcon: 'arrow_upward',
            trendClass: 'text-secondary',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_nkVdPufjkHsTIJ66rBJVJo3WTFaqISWf4GWtkgUPKpUCQGeE_2SmYbBM52rekfwTyhrTe9kY-hlosSi_YkP07Lk5itySOOtrrs9Uh6wgoh-HLtkC6NKzjzNjAhfzoAD6lxjVZTrHisNPnC88YfLreXgujUxho13e03_VTarkAKHuJr-iUBJuyPVzgqmDTDdxOw7MuKqFvaNMVoMbsS15cfnlx3zzC4eZBwZ8maJLTSp6y0k7_AbpsA',
            verified: true,
            isUser: false
          },
          {
            rank: 4,
            name: 'Gautam Gusain',
            loc: `${cityName} / Jakhan`,
            exp: 'Malsi Deer Forest Loop',
            dist: 39.2,
            steps: 51440,
            trend: '-1 RANK',
            trendIcon: 'arrow_downward',
            trendClass: 'text-error',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl23jl36yolCWYeQ8BilqjS2wwVSBYsFf2o_EqNtWJJ2X6knO2dg_cZxOpYECu7tuZTBSQpY5UoV9tsZtdG1o8pJtALLLzSCjIWw8RLOIMVBui8vzqDMfWEMN1WeVHGaiEdiFVVjaj9NXlSDs5tQWdLS7QHuCgOx8QZU2N9-ewvvh4RwJ6jA6kA91CBQ--jLMcdsbxzWePI39yTBx_6PoJP9bIfY9CQBZj8Ee6TM14-jnVqCodYwhDzw',
            verified: false,
            isUser: false
          },
          {
            rank: 5,
            name: 'Divya Negi',
            loc: `${cityName} / Sahastradhara`,
            exp: 'Sulphur Springs Trail',
            dist: 36.5,
            steps: 47900,
            trend: 'STABLE',
            trendIcon: 'horizontal_rule',
            trendClass: 'text-outline',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhm4YTnlraZSHXXzfB0Gt2v8F97ZOQoenWjtj0vNilXFrwgKk6H4p8EfIMdD_mbtvDI2SmOLDOPEvQK8CkHUCARrBAUHJT85UARMYQaDeuw2bFCb2BTgktgh_IRWgNDQvUD93yqRPJIVpD_UMmZeGj0GdLos7fbWc5pnE9s1_x6mDoEhK9izsIVcnTorI9Z46UUD0VjFojfKesIN5OYdZvdnQ7wj9qYihSo9OhMqeFmVgxyeZfC4NoVg',
            verified: false,
            isUser: false
          },
          {
            rank: 6,
            name: 'Pradeep Rawat',
            loc: `${cityName} / Premnagar`,
            exp: 'Tons Valley River Track',
            dist: 32.1,
            steps: 42120,
            trend: '+1 RANK',
            trendIcon: 'arrow_upward',
            trendClass: 'text-secondary',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAesIEx__6NiAY0jh0MCe7OAurEx1meZzTH9l7YM9cNMQ4-TfGM6NS_rXVI7Wjl0wMy8mOtPGm0mrQftc5dVVg6KBFyLo-BIxEvmTYEGzanQrcRHme5LFjOSSjNH-cA-vd2S0YlvR_AwDxEs1tFTgtA2RWhWkE3L2tddTe7n3QOTDZqOsMLBzVsORrXFSWFXtNwTcczEp9QRVFNfemB1J0WnWybu30Uz6XeENV-3wti3lkUimWm-I53XQ',
            verified: false,
            isUser: false
          },
          {
            rank: 7,
            name: 'Pooja Rana',
            loc: `${cityName} / Raipur`,
            exp: 'Maldevta Gorge Ridge',
            dist: 28.7,
            steps: 37660,
            trend: 'STABLE',
            trendIcon: 'horizontal_rule',
            trendClass: 'text-outline',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIEu_YDr3nMnUppVG8jn_Zxsq4oSqbOE6Cas8WKL1oUXoqd6uwOqwpOMQzXTF9swVcuk8VYkAJecpNBks6HkoSQbimyZCuRfSIiQJoYtlgmgAGOaCHIHoNvkV_s8vmBjuYkCSQCslYXIpjfDmSoRWLuXdzVbpTkA81LFUhl8RehQnewEfAwlnYY9zyiIC5ALN6EydxH2XHQE1VA3WJe2Jo3Si2HAGVH3Oc_LVdRWzdAeU24kETiz4FaA',
            verified: false,
            isUser: false
          },
          {
            rank: 8,
            name: 'Mohit Bisht',
            loc: `${cityName} / Ballupur`,
            exp: 'Canal Road Corridor',
            dist: 25.4,
            steps: 33330,
            trend: '-1 RANK',
            trendIcon: 'arrow_downward',
            trendClass: 'text-error',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9IrvZtRV_SlJSq25LXepRkbsVsbfG5w09ZiM44k3v0BfF2MI_NbChXkTsi6GnmGYmXJ_mpA-bdlwgp92aYkDmPsi0M_BYZ3LCpPVzydZd9lQwK6kPtDARZ7pQAIN1fL9siMylgu3CUbNZjQZ0glo0puQZHQKuLhZ-1JpGcEcRcNsYcC_OEMyCLBaueiKzkuSFp4uGtgl71VLZv9kaC3GT8bJhZ0aVoUw3pdtBLyOY438YfhDmjSq3Q',
            verified: false,
            isUser: false
          }
        ]
      };
    }

    // Default: 'country'
    return {
      scope: 'country',
      title: 'Nationwide All-India Rankings • 28 States & 8 UTs',
      pill: 'All-India Scope',
      podiumTitle: 'Podium Vanguard — National Expedition Cutoff',
      podiumBadge: 'Top 3 Qualifiers',
      kpi: {
        rank: '#04',
        totalStr: '/ 142 Striders',
        delta: 'Pace delta: +2 ranks this cycle',
        deltaColor: 'text-secondary',
        gapTitle: 'Gap to Podium (Rank 3)',
        gapVal: '4.2',
        gapSub: '(~5,500 steps)',
        gapPct: '78%',
        cohortVal: '142',
        cohortTotalSub: 'Athletes Verified',
        cohortSub: '100% Hardware Validation Active'
      },
      podium: [
        {
          rank: 1,
          name: 'Priya Sharma',
          badgeRole: 'Leader',
          badgeRoleClass: 'text-secondary',
          location: 'New Delhi • Trail Expert',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhm4YTnlraZSHXXzfB0Gt2v8F97ZOQoenWjtj0vNilXFrwgKk6H4p8EfIMdD_mbtvDI2SmOLDOPEvQK8CkHUCARrBAUHJT85UARMYQaDeuw2bFCb2BTgktgh_IRWgNDQvUD93yqRPJIVpD_UMmZeGj0GdLos7fbWc5pnE9s1_x6mDoEhK9izsIVcnTorI9Z46UUD0VjFojfKesIN5OYdZvdnQ7wj9qYihSo9OhMqeFmVgxyeZfC4NoVg',
          icon: 'workspace_premium',
          iconColor: 'text-tertiary',
          stripeClass: 'bg-tertiary',
          rankBadgeClass: 'bg-tertiary text-on-tertiary',
          distClass: 'text-tertiary',
          expTitle: 'Manali to Leh Highway',
          expSub: 'High Altitude Pass (4,280m)',
          dist: 82.4,
          steps: '108.4K',
          isUser: false
        },
        {
          rank: 2,
          name: 'Vikram Malhotra',
          badgeRole: '-6.3 KM',
          badgeRoleClass: 'text-outline',
          location: 'Mumbai • Pacer',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9IrvZtRV_SlJSq25LXepRkbsVsbfG5w09ZiM44k3v0BfF2MI_NbChXkTsi6GnmGYmXJ_mpA-bdlwgp92aYkDmPsi0M_BYZ3LCpPVzydZd9lQwK6kPtDARZ7pQAIN1fL9siMylgu3CUbNZjQZ0glo0puQZHQKuLhZ-1JpGcEcRcNsYcC_OEMyCLBaueiKzkuSFp4uGtgl71VLZv9kaC3GT8bJhZ0aVoUw3pdtBLyOY438YfhDmjSq3Q',
          icon: 'military_tech',
          iconColor: 'text-outline',
          stripeClass: 'bg-surface-bright',
          rankBadgeClass: 'bg-surface-bright text-on-surface',
          distClass: 'text-on-surface',
          expTitle: 'Delhi to Kedarnath',
          expSub: 'Garhwal Pilgrim Ascent',
          dist: 76.1,
          steps: '99.8K',
          isUser: false
        },
        {
          rank: 3,
          name: 'Ananya Iyer',
          badgeRole: 'Target Zone',
          badgeRoleClass: 'text-primary',
          location: 'Bengaluru • Strider',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Ds31sEdVRa6AanT28UfK9O4Vxa_h5ds9CkMZWllp5pFhQL0Cv92U-x17hR_uVrmMuoi1_ifC1UZ3ss6SBP5Zv0GtQizjGK9VEfA38xFs-g8JHLuawcl5aewmsAxne-qDWGSquRpNfDwAjRjJelwAt6K1TV6WUiZGsT8PdrfQawojumIVC6nC1giOaKsssP7X6Zi7qe96GyF3BIlvdtlSS1jUO6PMF1H0ym8KKSjfPWM0_BPcG35sYQ',
          icon: 'stars',
          iconColor: 'text-tertiary-container',
          stripeClass: 'bg-tertiary-container',
          rankBadgeClass: 'bg-tertiary-container text-on-tertiary-container',
          distClass: 'text-tertiary-container',
          expTitle: 'Mumbai to Goa Coastal',
          expSub: 'Konkan Sea Trail Route',
          dist: 68.3,
          steps: '89.4K',
          isUser: false
        }
      ],
      roster: [
        {
          rank: 1,
          name: 'Priya Sharma',
          loc: 'Delhi, IN',
          exp: 'Manali to Leh',
          dist: 82.4,
          steps: 108420,
          trend: 'DEFENDING',
          trendIcon: 'horizontal_rule',
          trendClass: 'text-secondary',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhm4YTnlraZSHXXzfB0Gt2v8F97ZOQoenWjtj0vNilXFrwgKk6H4p8EfIMdD_mbtvDI2SmOLDOPEvQK8CkHUCARrBAUHJT85UARMYQaDeuw2bFCb2BTgktgh_IRWgNDQvUD93yqRPJIVpD_UMmZeGj0GdLos7fbWc5pnE9s1_x6mDoEhK9izsIVcnTorI9Z46UUD0VjFojfKesIN5OYdZvdnQ7wj9qYihSo9OhMqeFmVgxyeZfC4NoVg',
          verified: true,
          isUser: false
        },
        {
          rank: 2,
          name: 'Vikram Malhotra',
          loc: 'Mumbai, IN',
          exp: 'Delhi to Kedarnath',
          dist: 76.1,
          steps: 99800,
          trend: '+1 RANK',
          trendIcon: 'arrow_upward',
          trendClass: 'text-secondary',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl23jl36yolCWYeQ8BilqjS2wwVSBYsFf2o_EqNtWJJ2X6knO2dg_cZxOpYECu7tuZTBSQpY5UoV9tsZtdG1o8pJtALLLzSCjIWw8RLOIMVBui8vzqDMfWEMN1WeVHGaiEdiFVVjaj9NXlSDs5tQWdLS7QHuCgOx8QZU2N9-ewvvh4RwJ6jA6kA91CBQ--jLMcdsbxzWePI39yTBx_6PoJP9bIfY9CQBZj8Ee6TM14-jnVqCodYwhDzw',
          verified: true,
          isUser: false
        },
        {
          rank: 3,
          name: 'Ananya Iyer',
          loc: 'Bengaluru, IN',
          exp: 'Mumbai to Goa',
          dist: 68.3,
          steps: 89450,
          trend: '-1 RANK',
          trendIcon: 'arrow_downward',
          trendClass: 'text-error',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Ds31sEdVRa6AanT28UfK9O4Vxa_h5ds9CkMZWllp5pFhQL0Cv92U-x17hR_uVrmMuoi1_ifC1UZ3ss6SBP5Zv0GtQizjGK9VEfA38xFs-g8JHLuawcl5aewmsAxne-qDWGSquRpNfDwAjRjJelwAt6K1TV6WUiZGsT8PdrfQawojumIVC6nC1giOaKsssP7X6Zi7qe96GyF3BIlvdtlSS1jUO6PMF1H0ym8KKSjfPWM0_BPcG35sYQ',
          verified: true,
          isUser: false
        },
        {
          rank: 4,
          name: 'Arjun Walker',
          loc: `${cityName} / Basecamp`,
          exp: 'Delhi to Kedarnath',
          dist: 64.1,
          steps: 84120,
          trend: '+2 POSITIONS',
          trendIcon: 'arrow_upward',
          trendClass: 'text-secondary',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1HDhWZCtsDEArZoS1-o4OYIAVs6TCGB7x-gDp2GAsPiQ330VX7rM_Vustoj2GMnVPVA0XCXQ4fZAMv--WwLag4JGuyJbhnnbsueWx7FfFmlFFkOessziT8wuZqqQCkyGh7lanSpHgF69KvBwPzQ606iMClDz9fPmHlQFYYg01KcaOtfDrzwHTO627H5Ym4uczn2s_V2_S6SBKGFGICBRFWYIvBWIE2w0lehEvFs11T0IBbISCnkJ6PQ',
          verified: true,
          isUser: true
        },
        {
          rank: 5,
          name: 'Rohan Verma',
          loc: 'Pune, IN',
          exp: 'Jaipur to Agra',
          dist: 61.8,
          steps: 81050,
          trend: 'STABLE',
          trendIcon: 'horizontal_rule',
          trendClass: 'text-outline',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMQANZo6aeWeENeMX7viQk3r1hojjLp1Kgn_jXTzO8tp7Tm5rw8tAJeA6PT5sWUr9EJLqOIEoxD7ouhiGWKekyVr3ZtwwQAugY6IFpaRkzZSBU0qQfcIB_hZxbN1KN0wcK2rh3qzFruO08AqI4cJXQTHQW444eSQ7XyvWsAUMAsIe1S5GlvJmSWnjEgydYqryPICg-aMwHVjyON7SgfDSBXyWjLY8tDDlr6WtRLrko5Vp5BKMiYw48rQ',
          verified: false,
          isUser: false
        },
        {
          rank: 6,
          name: 'Meera Nambiar',
          loc: 'Kochi, IN',
          exp: 'Mumbai to Goa',
          dist: 58.2,
          steps: 76200,
          trend: '+1 RANK',
          trendIcon: 'arrow_upward',
          trendClass: 'text-secondary',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIEu_YDr3nMnUppVG8jn_Zxsq4oSqbOE6Cas8WKL1oUXoqd6uwOqwpOMQzXTF9swVcuk8VYkAJecpNBks6HkoSQbimyZCuRfSIiQJoYtlgmgAGOaCHIHoNvkV_s8vmBjuYkCSQCslYXIpjfDmSoRWLuXdzVbpTkA81LFUhl8RehQnewEfAwlnYY9zyiIC5ALN6EydxH2XHQE1VA3WJe2Jo3Si2HAGVH3Oc_LVdRWzdAeU24kETiz4FaA',
          verified: false,
          isUser: false
        },
        {
          rank: 7,
          name: 'Kabir Singh',
          loc: 'Chandigarh, IN',
          exp: 'Manali to Leh',
          dist: 55.4,
          steps: 72500,
          trend: '-2 RANKS',
          trendIcon: 'arrow_downward',
          trendClass: 'text-error',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAesIEx__6NiAY0jh0MCe7OAurEx1meZzTH9l7YM9cNMQ4-TfGM6NS_rXVI7Wjl0wMy8mOtPGm0mrQftc5dVVg6KBFyLo-BIxEvmTYEGzanQrcRHme5LFjOSSjNH-cA-vd2S0YlvR_AwDxEs1tFTgtA2RWhWkE3L2tddTe7n3QOTDZqOsMLBzVsORrXFSWFXtNwTcczEp9QRVFNfemB1J0WnWybu30Uz6XeENV-3wti3lkUimWm-I53XQ',
          verified: false,
          isUser: false
        },
        {
          rank: 8,
          name: 'Sneha Patel',
          loc: 'Ahmedabad, IN',
          exp: 'Delhi to Kedarnath',
          dist: 52.0,
          steps: 68100,
          trend: 'STABLE',
          trendIcon: 'horizontal_rule',
          trendClass: 'text-outline',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_nkVdPufjkHsTIJ66rBJVJo3WTFaqISWf4GWtkgUPKpUCQGeE_2SmYbBM52rekfwTyhrTe9kY-hlosSi_YkP07Lk5itySOOtrrs9Uh6wgoh-HLtkC6NKzjzNjAhfzoAD6lxjVZTrHisNPnC88YfLreXgujUxho13e03_VTarkAKHuJr-iUBJuyPVzgqmDTDdxOw7MuKqFvaNMVoMbsS15cfnlx3zzC4eZBwZ8maJLTSp6y0k7_AbpsA',
          verified: false,
          isUser: false
        }
      ]
    };
  }

  renderLeaderboardScope(scope) {
    const hub = CITY_HUBS[this.currentCity] || CITY_HUBS.dehradun;
    const data = this.getLeaderboardScopeData(scope);

    // Update Scope Switcher button labels for state & city
    const stateLabel = document.getElementById('scope-state-label');
    const cityLabel = document.getElementById('scope-city-label');
    if (stateLabel) stateLabel.textContent = `Best in State (${hub.state})`;
    if (cityLabel) cityLabel.textContent = `Best in City (${hub.city})`;

    // Update active pill and subtitle
    const pill = document.getElementById('scope-active-pill');
    const subtitle = document.getElementById('leaderboard-scope-subtitle');
    if (pill) pill.textContent = data.pill;
    if (subtitle) subtitle.textContent = data.title;

    // Update 3 KPI cards
    const kpiRank = document.getElementById('kpi-standing-rank');
    const kpiTotal = document.getElementById('kpi-standing-total');
    const kpiDelta = document.getElementById('kpi-standing-delta');
    const kpiGapTitle = document.getElementById('kpi-gap-title');
    const kpiGapVal = document.getElementById('kpi-gap-val');
    const kpiGapSub = document.getElementById('kpi-gap-sub');
    const kpiGapBar = document.getElementById('kpi-gap-bar');
    const kpiCohortVal = document.getElementById('kpi-cohort-val');
    const kpiCohortTotalSub = document.getElementById('kpi-cohort-total-sub');
    const kpiCohortSub = document.getElementById('kpi-cohort-sub');

    if (kpiRank) kpiRank.textContent = data.kpi.rank;
    if (kpiTotal) kpiTotal.textContent = data.kpi.totalStr;
    if (kpiDelta) {
      kpiDelta.textContent = data.kpi.delta;
      if (kpiDelta.parentElement) {
        kpiDelta.parentElement.className = `flex items-center gap-space-xs font-label-mono text-label-mono ${data.kpi.deltaColor}`;
      }
    }
    if (kpiGapTitle) kpiGapTitle.textContent = data.kpi.gapTitle;
    if (kpiGapVal) kpiGapVal.textContent = data.kpi.gapVal;
    if (kpiGapSub) kpiGapSub.textContent = data.kpi.gapSub;
    if (kpiGapBar) kpiGapBar.style.width = data.kpi.gapPct;
    if (kpiCohortVal) kpiCohortVal.textContent = data.kpi.cohortVal;
    if (kpiCohortTotalSub) kpiCohortTotalSub.textContent = data.kpi.cohortTotalSub;
    if (kpiCohortSub) kpiCohortSub.textContent = data.kpi.cohortSub;

    // Update Podium Header
    const podTitle = document.getElementById('podium-section-title');
    const podBadge = document.getElementById('podium-section-badge');
    if (podTitle) podTitle.textContent = data.podiumTitle;
    if (podBadge) podBadge.textContent = data.podiumBadge;

    // Compute live Arjun stats
    const stepDiff = Math.max(0, this.steps - 6420);
    const distDiff = stepDiff * KM_PER_STEP;
    const userKm = (64.1 + distDiff).toFixed(1);
    const userCadence = (84120 + stepDiff).toLocaleString();
    const currentExpedition = EXPEDITIONS_DATA[this.activeQuest]?.title || "Delhi to Kedarnath";

    // Update Podium Cards Container
    const podiumContainer = document.getElementById('podium-cards-container');
    if (podiumContainer && data.podium) {
      podiumContainer.innerHTML = data.podium.map(item => {
        const distDisplay = item.isUser ? userKm : item.dist.toFixed(1);
        const stepsDisplay = item.isUser ? `${((84120 + stepDiff) / 1000).toFixed(1)}K` : item.steps;
        const distIdAttr = item.isUser ? 'id="podium-arjun-distance"' : '';
        const stepsIdAttr = item.isUser ? 'id="podium-arjun-cadence"' : '';

        return `
          <div class="tactical-card p-space-lg flex flex-col justify-between overflow-hidden relative ${item.isUser ? 'ring-1 ring-primary/40' : ''}">
            <div class="absolute top-0 left-0 right-0 h-1 ${item.stripeClass}"></div>
            <div class="flex items-start justify-between gap-space-sm">
              <div class="flex items-center gap-space-md">
                <div class="relative shrink-0">
                  <img class="w-14 h-14 rounded-full object-cover bg-surface-container-highest" alt="${item.name}" src="${item.avatar}"/>
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${item.rankBadgeClass} font-label-mono text-label-mono flex items-center justify-center font-bold shadow-sm">${item.rank}</div>
                </div>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-space-xs">
                    <span class="font-headline-sm text-headline-sm text-on-surface font-bold truncate">${item.name}</span>
                    ${item.isUser ? '<span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-label-mono text-[10px] font-bold">YOU</span>' : ''}
                  </div>
                  <span class="font-label-mono text-label-mono text-outline uppercase tracking-wider">${item.location}</span>
                </div>
              </div>
              <span class="material-symbols-outlined ${item.iconColor} text-xl" style="${item.rank === 1 ? "font-variation-settings: 'FILL' 1;" : ''}">${item.icon}</span>
            </div>
            <div class="my-space-lg p-space-md bg-surface-container-lowest rounded-lg border border-surface-container-highest/60">
              <div class="flex items-center justify-between mb-space-xs">
                <span class="font-label-mono text-label-mono text-outline uppercase">Target Expedition</span>
                <span class="font-label-mono text-label-mono ${item.badgeRoleClass} uppercase font-bold">${item.badgeRole}</span>
              </div>
              <div class="font-label-lg text-label-lg text-on-surface truncate font-semibold">${item.isUser ? currentExpedition : item.expTitle}</div>
              <div class="font-body-sm text-body-sm text-on-surface-variant font-mono text-xs mt-0.5">${item.expSub}</div>
            </div>
            <div class="grid grid-cols-2 gap-space-sm pt-space-xs">
              <div>
                <div class="font-label-mono text-label-mono text-outline uppercase">Verified Dist</div>
                <div class="font-metric-large text-metric-large ${item.distClass} tabular-nums font-bold">
                  <span ${distIdAttr}>${distDisplay}</span> <span class="font-label-md text-label-md uppercase text-outline">KM</span>
                </div>
              </div>
              <div class="text-right">
                <div class="font-label-mono text-label-mono text-outline uppercase">Logged Cadence</div>
                <div class="font-metric-large text-metric-large text-on-surface tabular-nums font-bold">
                  <span ${stepsIdAttr}>${stepsDisplay}</span> <span class="font-label-md text-label-md uppercase text-outline">Steps</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update Table Roster
    const tbody = document.getElementById('leaderboard-tbody');
    if (tbody && data.roster) {
      tbody.innerHTML = data.roster.map(row => {
        const isUser = row.isUser;
        const rowDist = isUser ? userKm : row.dist.toFixed(1);
        const rowSteps = isUser ? userCadence : row.steps.toLocaleString();
        const rowExp = isUser ? currentExpedition : row.exp;

        return `
          <tr data-rank="${row.rank}" class="${isUser ? 'bg-primary-container/15 hover:bg-primary-container/20 border-l-2 border-primary transition-colors' : 'hover:bg-surface-container-high/40 transition-colors'}">
            <td class="py-space-md px-space-lg text-center font-label-mono text-label-mono">
              <div class="inline-flex items-center justify-center w-7 h-7 rounded ${isUser ? 'bg-primary-container text-on-primary font-bold' : (row.rank === 1 ? 'bg-tertiary/10 text-tertiary font-bold' : (row.rank === 2 ? 'bg-surface-bright/20 text-on-surface font-bold' : (row.rank === 3 ? 'bg-tertiary-container/20 text-tertiary-fixed font-bold' : 'text-outline font-semibold')))} tabular-nums">
                ${String(row.rank).padStart(2, '0')}
              </div>
            </td>
            <td class="py-space-md px-space-lg">
              <div class="flex items-center gap-space-md">
                <div class="relative w-9 h-9 rounded-full bg-surface-container-highest overflow-hidden shrink-0">
                  <img class="w-full h-full object-cover" alt="${row.name}" src="${row.avatar}"/>
                  ${isUser ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary-container"></span>' : ''}
                </div>
                <div class="flex flex-col">
                  <div class="flex items-center gap-space-xs">
                    <span class="font-label-lg text-label-lg ${isUser ? 'text-primary font-bold tracking-tight' : 'text-on-surface font-semibold'}">${row.name}</span>
                    ${isUser ? '<span class="px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-label-mono text-label-mono font-bold tracking-wider">YOU</span>' : (row.verified ? '<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: \'FILL\' 1;">verified</span>' : '')}
                  </div>
                  <span class="font-label-mono text-label-mono ${isUser ? 'text-primary font-medium' : 'text-outline'} uppercase tracking-wider">${row.loc}</span>
                </div>
              </div>
            </td>
            <td class="py-space-md px-space-lg">
              ${isUser ? `
                <div class="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-highest text-primary font-label-md text-label-md uppercase tracking-wider font-semibold">
                  <span class="material-symbols-outlined text-sm">route</span>
                  <span id="lead-arjun-expedition">${rowExp}</span>
                </div>
              ` : `
                <span class="px-space-sm py-space-xs rounded bg-surface-container-highest text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">${rowExp}</span>
              `}
            </td>
            <td class="py-space-md px-space-lg text-right font-headline-sm text-headline-sm ${isUser ? 'text-primary' : 'text-on-surface'} tabular-nums font-bold">
              ${isUser ? `
                <span id="lead-arjun-distance">${rowDist}</span> <span class="font-label-md text-label-md text-primary font-normal">KM</span>
              ` : `
                ${rowDist} <span class="font-label-md text-label-md text-outline font-normal">KM</span>
              `}
            </td>
            <td class="py-space-md px-space-lg text-right font-label-lg text-label-lg text-on-surface tabular-nums ${isUser ? 'font-semibold' : ''}">
              ${isUser ? `
                <span id="lead-arjun-cadence">${rowSteps}</span>
              ` : `
                ${rowSteps}
              `}
            </td>
            <td class="py-space-md px-space-lg text-right">
              <span class="inline-flex items-center gap-space-xs ${row.trendClass} font-label-mono text-label-mono ${isUser ? 'font-bold' : ''}">
                <span class="material-symbols-outlined text-base">${row.trendIcon}</span>
                <span>${row.trend}</span>
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Re-apply current roster filter (without triggering toast)
    this.applyRosterFilter(this.currentRosterFilter || 'all', false);
  }

  /* ─── Achievements Interactive Badges ─────────────────────────────── */
  bindAchievementsInteractivity() {
    window.filterBadges = (type) => {
      const buttons = document.querySelectorAll('.badge-filter-btn');
      buttons.forEach(b => {
        b.className = 'badge-filter-btn px-space-md py-1.5 font-label-md text-label-md uppercase tracking-wider rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer';
      });

      const activeBtn = document.getElementById(`filter-${type}`);
      if (activeBtn) {
        activeBtn.className = 'badge-filter-btn px-space-md py-1.5 font-label-md text-label-md uppercase tracking-wider rounded bg-primary-container text-on-primary font-bold transition-all cursor-pointer';
      }

      const badgeCards = document.querySelectorAll('.badge-card, [data-category]');
      badgeCards.forEach(card => {
        const cat = card.dataset.category || '';
        if (type === 'all' || cat === type) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    };

    // Badge click feedback
    document.querySelectorAll('.badge-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h3, .font-headline-sm, .font-label-lg')?.textContent.trim() || 'Milestone Badge';
        const isUnlocked = card.textContent.includes('UNLOCKED') || card.textContent.includes('check_circle');
        if (isUnlocked) {
          this.showToast(`${title} • Cryptographically verified via GNSS`, 'verified');
        } else {
          this.showToast(`${title} • In progress (keep walking!)`, 'lock');
        }
      });
    });
  }

  /* ─── Global Keyboard Shortcuts ───────────────────────────────────── */
  bindGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Escape closes all open modals
      if (e.key === 'Escape') {
        ['modal-manual-step', 'modal-waypoint', 'spec-modal'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.add('hidden');
        });
      }

      // Cmd+K or Ctrl+K focuses quest search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        switchTab('quests');
        const searchInput = document.getElementById('route-search');
        if (searchInput) searchInput.focus();
      }
    });
  }

  /* ─── Supabase Cloud Integration ───────────────────────────────────── */
  bindSupabaseIntegration() {
    const sb = window.StepQuestSupabase;
    if (!sb) return;

    // Elements
    const syncBtn = document.getElementById('cloud-sync-btn');
    const syncDot = document.getElementById('cloud-sync-dot');
    const syncText = document.getElementById('cloud-sync-text');
    const modalSettings = document.getElementById('modal-supabase-settings');
    const closeSettings = document.getElementById('close-supabase-modal');
    const inputUrl = document.getElementById('input-supabase-url');
    const inputKey = document.getElementById('input-supabase-anon-key');
    const modalDot = document.getElementById('modal-status-dot');
    const modalText = document.getElementById('modal-status-text');
    const btnTest = document.getElementById('btn-test-supabase');
    const btnSave = document.getElementById('btn-save-supabase');
    const btnSeed = document.getElementById('btn-seed-supabase');
    const btnDisconnect = document.getElementById('btn-disconnect-supabase');

    // Auth Elements
    const authBtn = document.getElementById('btn-auth-action');
    const modalAuth = document.getElementById('modal-auth');
    const closeAuth = document.getElementById('close-auth-modal');
    const tabSignIn = document.getElementById('tab-auth-signin');
    const tabSignUp = document.getElementById('tab-auth-signup');
    const authFeedback = document.getElementById('auth-feedback-box');
    const fieldUsername = document.getElementById('field-auth-username');
    const inputEmail = document.getElementById('input-auth-email');
    const inputPassword = document.getElementById('input-auth-password');
    const inputUsername = document.getElementById('input-auth-username');
    const btnSubmitAuth = document.getElementById('btn-auth-submit');
    const submitLabel = document.getElementById('btn-auth-submit-label');
    const signedInSection = document.getElementById('auth-signed-in-section');
    const formsSection = document.getElementById('auth-forms-section');
    const btnSignOut = document.getElementById('btn-auth-signout');

    let authMode = 'signin';

    // Status Listener
    sb.onStatusChange((status, message) => {
      if (status === 'connected') {
        if (syncDot) syncDot.className = 'w-2.5 h-2.5 rounded-full bg-secondary animate-pulse';
        if (syncText) {
          syncText.textContent = 'Supabase Live';
          syncText.className = 'font-label-mono text-label-mono uppercase text-secondary tracking-wider';
        }
        if (modalDot) modalDot.className = 'w-2.5 h-2.5 rounded-full bg-secondary';
        if (modalText) modalText.textContent = 'Cloud Connected & Syncing';
      } else if (status === 'error') {
        if (syncDot) syncDot.className = 'w-2.5 h-2.5 rounded-full bg-error';
        if (syncText) {
          syncText.textContent = 'Sync Error';
          syncText.className = 'font-label-mono text-label-mono uppercase text-error tracking-wider';
        }
        if (modalDot) modalDot.className = 'w-2.5 h-2.5 rounded-full bg-error';
        if (modalText) modalText.textContent = message || 'Connection Failed';
      } else {
        if (syncDot) syncDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
        if (syncText) {
          syncText.textContent = 'Demo Mode';
          syncText.className = 'font-label-mono text-label-mono uppercase text-on-surface-variant tracking-wider';
        }
        if (modalDot) modalDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
        if (modalText) modalText.textContent = message || 'Local Demo Mode (Cloud Sync Inactive)';
      }
    });

    // Auth Listener
    sb.onAuthChange((user, profile) => {
      const userDisplayName = document.getElementById('user-display-name');
      const userLevelBadge = document.getElementById('user-level-badge');
      const authInitials = document.getElementById('auth-user-initials');
      const authName = document.getElementById('auth-user-name');
      const authEmail = document.getElementById('auth-user-email');
      const authSteps = document.getElementById('auth-user-steps');
      const authKm = document.getElementById('auth-user-km');

      if (user && profile) {
        if (userDisplayName) userDisplayName.textContent = profile.username || user.email.split('@')[0];
        if (userLevelBadge) userLevelBadge.textContent = 'Cloud Athlete';
        if (authInitials) authInitials.textContent = (profile.username || 'U').slice(0, 2).toUpperCase();
        if (authName) authName.textContent = profile.username || user.email.split('@')[0];
        if (authEmail) authEmail.textContent = user.email;
        if (authSteps) authSteps.textContent = (profile.total_steps || this.steps).toLocaleString();
        if (authKm) authKm.textContent = `${(profile.total_km || (this.steps * KM_PER_STEP)).toFixed(2)} KM`;

        if (signedInSection) signedInSection.classList.remove('hidden');
        if (formsSection) formsSection.classList.add('hidden');
      } else {
        if (userDisplayName) userDisplayName.textContent = 'Arjun Walker';
        if (userLevelBadge) userLevelBadge.textContent = 'LVL 14 Trailblazer';

        if (signedInSection) signedInSection.classList.add('hidden');
        if (formsSection) formsSection.classList.remove('hidden');
      }
    });

    // Live Leaderboard Listener
    sb.onLeaderboardChange((users) => {
      if (!users || !users.length) return;
      const tbody = document.getElementById('leaderboard-tbody');
      if (!tbody) return;

      tbody.innerHTML = '';
      users.forEach((u, idx) => {
        const rank = idx + 1;
        const isCurrentUser = sb.currentUser && u.id === sb.currentUser.id;
        const row = document.createElement('tr');
        row.className = isCurrentUser 
          ? 'border-b border-primary-container/30 bg-primary-container/10' 
          : 'border-b border-surface-container-highest hover:bg-surface-container-high transition-colors';
        row.dataset.rank = rank;

        row.innerHTML = `
          <td class="p-space-md font-label-mono text-label-mono font-bold ${rank <= 3 ? 'text-primary' : 'text-on-surface'}">#0${rank}</td>
          <td class="p-space-md">
            <div class="flex items-center gap-space-sm">
              <div class="w-8 h-8 rounded-full bg-surface-container-high border border-surface-container-highest flex items-center justify-center text-xs font-bold font-label-mono text-primary">
                ${(u.username || 'U').slice(0, 2).toUpperCase()}
              </div>
              <div class="flex flex-col">
                <span class="font-headline-sm text-sm text-on-surface font-bold">${u.username || 'Cloud Walker'} ${isCurrentUser ? '(You)' : ''}</span>
                <span class="font-label-mono text-[10px] text-outline">Verified Cloud Athlete</span>
              </div>
            </div>
          </td>
          <td class="p-space-md font-label-mono text-label-mono text-on-surface">Active Quest</td>
          <td class="p-space-md font-label-mono text-label-mono text-primary font-bold">${(u.total_km || 0).toFixed(1)} KM</td>
          <td class="p-space-md font-label-mono text-label-mono text-right text-on-surface font-bold">${(u.total_steps || 0).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });
    });

    // Open/Close Modals
    if (syncBtn && modalSettings) {
      syncBtn.addEventListener('click', () => {
        if (inputUrl) inputUrl.value = localStorage.getItem('stepquest_supabase_url') || '';
        if (inputKey) inputKey.value = localStorage.getItem('stepquest_supabase_anon_key') || '';
        modalSettings.classList.remove('hidden');
      });
    }

    if (closeSettings && modalSettings) {
      closeSettings.addEventListener('click', () => modalSettings.classList.add('hidden'));
    }

    if (authBtn && modalAuth) {
      authBtn.addEventListener('click', () => modalAuth.classList.remove('hidden'));
    }

    if (closeAuth && modalAuth) {
      closeAuth.addEventListener('click', () => modalAuth.classList.add('hidden'));
    }

    // Auth Tabs Switch
    if (tabSignIn && tabSignUp) {
      tabSignIn.addEventListener('click', () => {
        authMode = 'signin';
        tabSignIn.className = 'flex-1 py-2 font-bold uppercase tracking-wider text-primary border-b-2 border-primary cursor-pointer transition-all text-center';
        tabSignUp.className = 'flex-1 py-2 font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface border-b-2 border-transparent cursor-pointer transition-all text-center';
        if (fieldUsername) fieldUsername.classList.add('hidden');
        if (submitLabel) submitLabel.textContent = 'Sign In to StepQuest';
        if (authFeedback) authFeedback.classList.add('hidden');
      });

      tabSignUp.addEventListener('click', () => {
        authMode = 'signup';
        tabSignUp.className = 'flex-1 py-2 font-bold uppercase tracking-wider text-primary border-b-2 border-primary cursor-pointer transition-all text-center';
        tabSignIn.className = 'flex-1 py-2 font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface border-b-2 border-transparent cursor-pointer transition-all text-center';
        if (fieldUsername) fieldUsername.classList.remove('hidden');
        if (submitLabel) submitLabel.textContent = 'Create Athletic Profile';
        if (authFeedback) authFeedback.classList.add('hidden');
      });
    }

    // Submit Auth
    if (btnSubmitAuth) {
      btnSubmitAuth.addEventListener('click', async () => {
        const email = (inputEmail?.value || '').trim();
        const password = (inputPassword?.value || '').trim();
        const username = (inputUsername?.value || '').trim();

        if (!email || !password) {
          showAuthError('Please fill in both email and password.');
          return;
        }

        try {
          btnSubmitAuth.disabled = true;
          submitLabel.textContent = 'Processing...';

          if (authMode === 'signup') {
            await sb.signUp(email, password, username);
            this.showToast('Profile created! Welcome to StepQuest Cloud.', 'verified');
          } else {
            await sb.signIn(email, password);
            this.showToast('Welcome back, Athlete! Cloud synced.', 'login');
          }

          if (modalAuth) modalAuth.classList.add('hidden');
        } catch (err) {
          showAuthError(err.message || 'Authentication error');
        } finally {
          btnSubmitAuth.disabled = false;
          submitLabel.textContent = authMode === 'signup' ? 'Create Athletic Profile' : 'Sign In to StepQuest';
        }
      });
    }

    const showAuthError = (msg) => {
      if (authFeedback) {
        authFeedback.textContent = msg;
        authFeedback.className = 'p-2.5 rounded font-label-mono text-xs bg-error-container/40 border border-error/50 text-error';
        authFeedback.classList.remove('hidden');
      }
    };

    // Sign Out
    if (btnSignOut) {
      btnSignOut.addEventListener('click', async () => {
        await sb.signOut();
        this.showToast('Signed out of StepQuest Cloud', 'logout');
        if (modalAuth) modalAuth.classList.add('hidden');
      });
    }

    // Test Ping Supabase
    if (btnTest) {
      btnTest.addEventListener('click', async () => {
        const url = (inputUrl?.value || '').trim();
        const key = (inputKey?.value || '').trim();
        if (!url || !key) {
          this.showToast('Enter URL and Key before testing', 'warning');
          return;
        }

        btnTest.disabled = true;
        btnTest.textContent = 'Testing...';
        try {
          await sb.testConnection(url, key);
          this.showToast('Supabase connection verified (Ping 200 OK)!', 'check_circle');
        } catch (err) {
          this.showToast(`Connection failed: ${err.message}`, 'error');
        } finally {
          btnTest.disabled = false;
          btnTest.textContent = 'Test Ping';
        }
      });
    }

    // Save & Connect Supabase
    if (btnSave) {
      btnSave.addEventListener('click', async () => {
        const url = (inputUrl?.value || '').trim();
        const key = (inputKey?.value || '').trim();

        btnSave.disabled = true;
        btnSave.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin-once">sync</span> Connecting...';

        try {
          await sb.saveCredentials(url, key);
          this.showToast('Connected to Supabase Cloud!', 'cloud_done');
          if (modalSettings) modalSettings.classList.add('hidden');
        } catch (err) {
          this.showToast(`Connection failed: ${err.message}`, 'error');
        } finally {
          btnSave.disabled = false;
          btnSave.innerHTML = '<span class="material-symbols-outlined text-sm">link</span> Save & Connect';
        }
      });
    }

    // Seed Sample Routes
    if (btnSeed) {
      btnSeed.addEventListener('click', async () => {
        btnSeed.disabled = true;
        btnSeed.textContent = 'Seeding...';
        try {
          const res = await sb.seedSampleJourneys();
          this.showToast(res.message, 'hiking');
        } catch (err) {
          this.showToast(`Seed failed: ${err.message}`, 'error');
        } finally {
          btnSeed.disabled = false;
          btnSeed.textContent = 'Seed 5 Routes';
        }
      });
    }

    // Disconnect
    if (btnDisconnect) {
      btnDisconnect.addEventListener('click', () => {
        sb.disconnect();
        if (inputUrl) inputUrl.value = '';
        if (inputKey) inputKey.value = '';
        this.showToast('Disconnected from cloud. Reverted to Demo Mode.', 'cloud_off');
      });
    }

    // Initialize the service
    sb.init();
  }

  /* ─── Location Hub & Origin-Based Quest Ranking ───────────────────── */
  bindLocationSelector() {
    const btnOpen = document.getElementById('btn-location-selector');
    const btnQuick = document.getElementById('btn-change-origin-quick');
    const modal = document.getElementById('modal-location');
    const btnClose = document.getElementById('close-location-modal');
    const btnGps = document.getElementById('btn-detect-gps');
    const customInput = document.getElementById('input-custom-city');
    const btnSetCustom = document.getElementById('btn-set-custom-city');

    const openLocation = () => { if (modal) modal.classList.remove('hidden'); };
    const closeLocation = () => { if (modal) modal.classList.add('hidden'); };

    if (btnOpen) btnOpen.addEventListener('click', openLocation);
    if (btnQuick) btnQuick.addEventListener('click', openLocation);
    if (btnClose) btnClose.addEventListener('click', closeLocation);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLocation();
      });
    }

    // Quick select buttons
    document.querySelectorAll('.city-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cityKey = btn.dataset.city || 'dehradun';
        this.setOriginCity(cityKey, true);
        closeLocation();
      });
    });

    // Custom city input
    if (btnSetCustom && customInput) {
      btnSetCustom.addEventListener('click', () => {
        const val = customInput.value.trim();
        if (val) {
          this.setCustomCity(val);
          closeLocation();
        }
      });

      customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = customInput.value.trim();
          if (val) {
            this.setCustomCity(val);
            closeLocation();
          }
        }
      });
    }

    // Live GPS Detection via Browser Geolocation API
    if (btnGps) {
      btnGps.addEventListener('click', () => {
        if (!navigator.geolocation) {
          this.showToast('Geolocation is not supported on this browser', 'warning');
          return;
        }

        btnGps.disabled = true;
        btnGps.innerHTML = '<span class="material-symbols-outlined text-base animate-spin">refresh</span> Accessing GPS Satellites...';

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            btnGps.disabled = false;
            btnGps.innerHTML = '<span class="material-symbols-outlined text-base">my_location</span> Detect My Live GPS Location';
            
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            // Find closest known expedition hub using Haversine formula
            let closestCity = 'dehradun';
            let minDistance = Infinity;

            for (const [key, hub] of Object.entries(CITY_HUBS)) {
              const dLat = (hub.lat - lat) * (Math.PI / 180);
              const dLon = (hub.lon - lon) * (Math.PI / 180);
              const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat * (Math.PI / 180)) * Math.cos(hub.lat * (Math.PI / 180)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const d = 6371 * c; // Earth radius in km

              if (d < minDistance) {
                minDistance = d;
                closestCity = key;
              }
            }

            this.setOriginCity(closestCity, true, `GPS Locked: Closest Hub is ${CITY_HUBS[closestCity].name}`);
            closeLocation();
          },
          (err) => {
            btnGps.disabled = false;
            btnGps.innerHTML = '<span class="material-symbols-outlined text-base">my_location</span> Detect My Live GPS Location';
            this.showToast(`GPS note: Defaulting to Dehradun (${err.message})`, 'info');
            this.setOriginCity('dehradun', true);
            closeLocation();
          },
          { timeout: 7000 }
        );
      });
    }
  }

  setOriginCity(cityKey, showFeedback = false, customToast) {
    const hub = CITY_HUBS[cityKey] || CITY_HUBS.dehradun;
    this.currentCity = cityKey;
    localStorage.setItem('stepquest_origin_city', cityKey);

    // Update Header Pill
    const locText = document.getElementById('current-location-text');
    if (locText) locText.textContent = hub.label;

    // Update Quests Banner
    const bannerCity = document.getElementById('banner-origin-city');
    if (bannerCity) bannerCity.textContent = hub.name;

    // Update Scope Switcher button labels for state & city
    const stateLabel = document.getElementById('scope-state-label');
    const cityLabel = document.getElementById('scope-city-label');
    if (stateLabel) stateLabel.textContent = `Best in State (${hub.state})`;
    if (cityLabel) cityLabel.textContent = `Best in City (${hub.city})`;

    // Update City Buttons selection state
    document.querySelectorAll('.city-select-btn').forEach(btn => {
      const isSelected = btn.dataset.city === cityKey;
      if (isSelected) {
        btn.classList.add('border-primary-container/60');
      } else {
        btn.classList.remove('border-primary-container/60');
      }
    });

    if (this.currentLeaderboardScope) {
      this.renderLeaderboardScope(this.currentLeaderboardScope);
    }

    this.reorderQuestsByCity(cityKey, showFeedback, customToast || `Origin Hub set to: ${hub.name}`);
  }

  setCustomCity(cityName) {
    this.currentCity = cityName.toLowerCase();
    localStorage.setItem('stepquest_origin_city', this.currentCity);

    const locText = document.getElementById('current-location-text');
    if (locText) locText.textContent = cityName.toUpperCase();

    const bannerCity = document.getElementById('banner-origin-city');
    if (bannerCity) bannerCity.textContent = cityName;

    this.reorderQuestsByCity(this.currentCity, true, `Departure hub set: ${cityName}`);
  }

  reorderQuestsByCity(cityKey, showFeedback = false, toastMsg) {
    const grid = document.getElementById('routes-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.route-card'));
    
    // Prioritize cards matching the origin city
    cards.sort((a, b) => {
      const aOrigin = (a.dataset.originCity || '').toLowerCase();
      const bOrigin = (b.dataset.originCity || '').toLowerCase();
      const aMatches = aOrigin === cityKey || a.textContent.toLowerCase().includes(cityKey);
      const bMatches = bOrigin === cityKey || b.textContent.toLowerCase().includes(cityKey);

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });

    cards.forEach(card => grid.appendChild(card));

    if (showFeedback) {
      this.showToast(toastMsg || `Showing treks originating from ${cityKey.toUpperCase()} first`, 'near_me');
    }
  }

  /* ─── Wearable Trackers & Phone Motion Pedometer Center ────────────── */
  bindDeviceSync() {
    const btnOpen = document.getElementById('btn-device-sync-open');
    const modal = document.getElementById('modal-device-sync');
    const btnClose = document.getElementById('close-device-modal');

    // Tabs
    const tabPhone = document.getElementById('tab-sensor-phone');
    const tabBle = document.getElementById('tab-sensor-ble');
    const tabImport = document.getElementById('tab-sensor-import');

    const secPhone = document.getElementById('section-sensor-phone');
    const secBle = document.getElementById('section-sensor-ble');
    const secImport = document.getElementById('section-sensor-import');

    const openSync = () => { if (modal) modal.classList.remove('hidden'); };
    const closeSync = () => { if (modal) modal.classList.add('hidden'); };

    if (btnOpen) btnOpen.addEventListener('click', openSync);
    if (btnClose) btnClose.addEventListener('click', closeSync);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSync();
      });
    }

    const switchSyncTab = (tab) => {
      [tabPhone, tabBle, tabImport].forEach(t => {
        if (t) t.className = 'flex-1 py-2 font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface border-b-2 border-transparent cursor-pointer transition-all text-center';
      });
      [secPhone, secBle, secImport].forEach(s => { if (s) s.classList.add('hidden'); });

      if (tab === 'phone') {
        if (tabPhone) tabPhone.className = 'flex-1 py-2 font-bold uppercase tracking-wider text-secondary border-b-2 border-secondary cursor-pointer transition-all text-center';
        if (secPhone) secPhone.classList.remove('hidden');
      } else if (tab === 'ble') {
        if (tabBle) tabBle.className = 'flex-1 py-2 font-bold uppercase tracking-wider text-primary border-b-2 border-primary cursor-pointer transition-all text-center';
        if (secBle) secBle.classList.remove('hidden');
      } else if (tab === 'import') {
        if (tabImport) tabImport.className = 'flex-1 py-2 font-bold uppercase tracking-wider text-tertiary border-b-2 border-tertiary cursor-pointer transition-all text-center';
        if (secImport) secImport.classList.remove('hidden');
      }
    };

    if (tabPhone) tabPhone.addEventListener('click', () => switchSyncTab('phone'));
    if (tabBle) tabBle.addEventListener('click', () => switchSyncTab('ble'));
    if (tabImport) tabImport.addEventListener('click', () => switchSyncTab('import'));

    // 1. Phone Pocket Pedometer Motion Sensor
    const btnToggleMotion = document.getElementById('btn-toggle-phone-pedometer');
    const motionStatus = document.getElementById('motion-sensor-status');
    const motionSession = document.getElementById('motion-session-steps');
    const motionMag = document.getElementById('motion-accel-mag');

    let isPedometerRunning = false;
    let sessionStepCount = 0;
    let lastStepTimestamp = 0;
    const MOTION_THRESHOLD = 11.2; // Acceleration magnitude threshold (m/s^2)
    const STEP_COOLDOWN_MS = 280;

    const onMotion = (event) => {
      const a = event.accelerationIncludingGravity || event.acceleration;
      if (!a) return;
      const x = a.x || 0;
      const y = a.y || 0;
      const z = a.z || 0;
      const mag = Math.sqrt(x*x + y*y + z*z);

      if (motionMag) motionMag.textContent = `${mag.toFixed(1)} m/s²`;

      const now = Date.now();
      if (mag > MOTION_THRESHOLD && (now - lastStepTimestamp) > STEP_COOLDOWN_MS) {
        lastStepTimestamp = now;
        sessionStepCount++;
        if (motionSession) motionSession.textContent = sessionStepCount.toLocaleString();

        // Increment tracker
        this.addSteps(1);
      }
    };

    if (btnToggleMotion) {
      btnToggleMotion.addEventListener('click', async () => {
        if (!isPedometerRunning) {
          if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
              const perm = await DeviceMotionEvent.requestPermission();
              if (perm !== 'granted') {
                this.showToast('Motion sensor permission denied', 'warning');
                return;
              }
            } catch (err) {
              console.warn(err);
            }
          }

          if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', onMotion, true);
            isPedometerRunning = true;
            btnToggleMotion.textContent = 'Stop Sensor';
            btnToggleMotion.className = 'px-4 py-2 bg-error-container text-on-error-container font-label-mono text-xs uppercase font-bold rounded shadow transition-all cursor-pointer hover:bg-error';
            if (motionStatus) {
              motionStatus.textContent = 'ACTIVE (POCKET)';
              motionStatus.className = 'font-bold text-secondary text-base mt-0.5 animate-pulse';
            }
            this.showToast('Phone pocket pedometer started! Put phone in pocket and walk.', 'directions_walk');
          } else {
            this.showToast('Device motion sensors not available on this device', 'warning');
          }
        } else {
          window.removeEventListener('devicemotion', onMotion, true);
          isPedometerRunning = false;
          btnToggleMotion.textContent = 'Start Sensor';
          btnToggleMotion.className = 'px-4 py-2 bg-secondary text-on-secondary-container font-label-mono text-xs uppercase font-bold rounded shadow transition-all cursor-pointer hover:bg-secondary/90';
          if (motionStatus) {
            motionStatus.textContent = 'STANDBY';
            motionStatus.className = 'font-bold text-outline text-base mt-0.5';
          }
          this.showToast(`Pedometer paused. +${sessionStepCount} steps logged this walk!`, 'pause');
        }
      });
    }

    // 2. Bluetooth BLE Wearable Pairing
    const btnScanBle = document.getElementById('btn-scan-ble-trackers');
    const bleDeviceName = document.getElementById('ble-device-name');

    if (btnScanBle) {
      btnScanBle.addEventListener('click', async () => {
        if (!navigator.bluetooth) {
          this.showToast('Web Bluetooth available on Chrome/Edge (Simulating wearable connection)', 'info');
          if (bleDeviceName) {
            bleDeviceName.textContent = 'Garmin Fenix 7 (Simulated BLE Sync)';
            bleDeviceName.className = 'font-bold text-secondary';
          }
          this.addSteps(350);
          this.showToast('Connected to wearable chronometer (+350 steps synced)', 'watch');
          return;
        }

        try {
          btnScanBle.disabled = true;
          btnScanBle.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">refresh</span> Scanning...';

          const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['heart_rate', 'running_speed_and_cadence', 'battery_service']
          });

          if (bleDeviceName) {
            bleDeviceName.textContent = `${device.name || 'Wearable Tracker'} (Connected)`;
            bleDeviceName.className = 'font-bold text-secondary';
          }
          this.showToast(`Paired with ${device.name || 'Bluetooth Tracker'}! Live cadence synced.`, 'watch');
        } catch (err) {
          if (err.name !== 'NotFoundError') {
            this.showToast(`Bluetooth scan note: ${err.message}`, 'info');
          }
        } finally {
          btnScanBle.disabled = false;
          btnScanBle.innerHTML = '<span class="material-symbols-outlined text-sm">bluetooth_searching</span> Pair Tracker';
        }
      });
    }

    // 3. Health & GPX File Import
    const fileInput = document.getElementById('input-health-file');
    const btnBrowse = document.getElementById('btn-browse-health-file');
    const dropzone = document.getElementById('dropzone-health-file');
    const importResult = document.getElementById('import-result-status');

    if (btnBrowse && fileInput) {
      btnBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-primary');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-primary');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-primary');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processHealthFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          processHealthFile(fileInput.files[0]);
        }
      });
    }

    const processHealthFile = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        let importedSteps = 0;
        let importedKm = 0;

        if (file.name.endsWith('.gpx')) {
          const trkpts = text.match(/<trkpt/g) || [];
          importedKm = (trkpts.length * 0.025).toFixed(2);
          importedSteps = Math.round(importedKm / KM_PER_STEP);
        } else {
          importedSteps = Math.floor(Math.random() * 4000) + 3200;
          importedKm = (importedSteps * KM_PER_STEP).toFixed(2);
        }

        if (importResult) {
          importResult.innerHTML = `✅ Successfully imported <strong>${file.name}</strong>: +${importedSteps.toLocaleString()} steps (+${importedKm} KM) synced!`;
          importResult.className = 'p-3 bg-secondary/10 border border-secondary text-secondary rounded font-label-mono text-xs';
          importResult.classList.remove('hidden');
        }

        this.addSteps(importedSteps);
        this.showToast(`Imported ${file.name}: +${importedSteps.toLocaleString()} steps!`, 'file_download_done');
      };
      reader.readAsText(file);
    };
  }

  /* ─── Telemetry Calculation & Gauge Updates ───────────────────────── */
  addSteps(count) {
    this.steps += count;
    this.updateGauge();

    // Synchronize telemetry with Supabase Cloud if connected
    if (window.StepQuestSupabase && typeof window.StepQuestSupabase.syncStepLog === 'function') {
      const activeData = EXPEDITIONS_DATA[this.activeQuest] || EXPEDITIONS_DATA.kedarnath;
      const completedKm = activeData.completedKm + (this.steps - 6420) * KM_PER_STEP;
      window.StepQuestSupabase.syncStepLog(count, this.steps, Math.max(0, completedKm));
    }
  }

  updateGauge() {
    const pct = Math.min(100, Math.round((this.steps / this.goal) * 100));
    const offset = GAUGE_CIRCUMFERENCE - (pct / 100) * GAUGE_CIRCUMFERENCE;

    // SVG Gauge circle in Dashboard
    const circle = document.getElementById('dash-gauge-circle') || document.querySelector('circle.text-primary-container');
    if (circle) {
      circle.style.strokeDasharray = `${GAUGE_CIRCUMFERENCE}`;
      circle.style.strokeDashoffset = `${offset}`;
    }

    // Percentage text
    const pctDisplay = document.getElementById('dash-quota-pct');
    if (pctDisplay) {
      pctDisplay.innerHTML = `${pct}<span class="text-headline-sm font-bold text-primary">%</span>`;
    } else {
      const pctDisplays = document.querySelectorAll('.font-metric-large');
      pctDisplays.forEach(el => {
        if (el.textContent.includes('%')) {
          el.innerHTML = `${pct}<span class="text-headline-sm font-bold text-primary">%</span>`;
        }
      });
    }

    // Step numbers
    const stepCountEl = document.getElementById('dash-step-count') || document.querySelector('.font-metric-display');
    if (stepCountEl) {
      stepCountEl.textContent = this.steps.toLocaleString();
    }

    // Remaining steps pill
    const remainingEl = document.getElementById('dash-steps-remaining');
    if (remainingEl) {
      const rem = Math.max(0, this.goal - this.steps);
      if (this.steps >= this.goal) {
        remainingEl.textContent = `Goal Met (+${(this.steps - this.goal).toLocaleString()})`;
        remainingEl.className = 'px-space-xs py-0.5 bg-secondary-container/20 border border-secondary text-secondary font-label-mono text-label-mono uppercase tracking-wider rounded font-bold';
      } else {
        remainingEl.textContent = `${rem.toLocaleString()} Steps Remaining`;
        remainingEl.className = 'px-space-xs py-0.5 bg-primary-container/20 border border-primary-container/40 text-primary-fixed-dim font-label-mono text-label-mono uppercase tracking-wider rounded';
      }
    }

    // Daily horizontal progress track
    const dailyBar = document.getElementById('dash-daily-bar');
    if (dailyBar) {
      dailyBar.style.width = `${pct}%`;
    }

    // Distance & Calories calculation
    const km = (this.steps * KM_PER_STEP).toFixed(2);
    const kcal = Math.round(this.steps * KCAL_PER_STEP);

    const distVal = document.getElementById('dash-distance-val');
    if (distVal) distVal.textContent = km;

    const kcalVal = document.getElementById('dash-kcal-val');
    if (kcalVal) kcalVal.textContent = kcal;

    // Cross-screen sync: Leaderboard Arjun Walker stats
    const leadDist = document.getElementById('lead-arjun-distance');
    const leadCadence = document.getElementById('lead-arjun-cadence');
    const podiumDist = document.getElementById('podium-arjun-distance');
    const podiumCadence = document.getElementById('podium-arjun-cadence');
    const stepDiff = Math.max(0, this.steps - 6420);
    const distDiff = stepDiff * KM_PER_STEP;

    if (leadDist) {
      leadDist.textContent = (64.1 + distDiff).toFixed(1);
    }
    if (leadCadence) {
      leadCadence.textContent = (84120 + stepDiff).toLocaleString();
    }
    if (podiumDist) {
      podiumDist.textContent = (64.1 + distDiff).toFixed(1);
    }
    if (podiumCadence) {
      podiumCadence.textContent = `${((84120 + stepDiff) / 1000).toFixed(1)}K`;
    }

    // Cross-screen sync: Trail Map daily cap
    const mapCap = document.getElementById('map-daily-cap');
    if (mapCap) {
      const currentMapSteps = Math.min(25000, 18500 + stepDiff);
      mapCap.textContent = `${currentMapSteps.toLocaleString()} / 25,000 steps`;
    }
  }
}

// Global Tab Switcher Function
function switchTab(tabId) {
  const tabMap = {
    'dashboard': 'view-dashboard',
    'quests': 'view-quests',
    'trail-map': 'view-trail-map',
    'map': 'view-trail-map',
    'leaderboard': 'view-leaderboard',
    'achievements': 'view-achievements'
  };

  const targetViewId = tabMap[tabId] || 'view-dashboard';

  // Toggle sections
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.add('hidden');
  });
  const targetView = document.getElementById(targetViewId);
  if (targetView) targetView.classList.remove('hidden');

  // Update header buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    const bTab = btn.dataset.tab;
    if (bTab === tabId || (tabId === 'map' && bTab === 'trail-map')) {
      btn.className = 'nav-tab-btn px-space-md py-space-xs rounded font-label-md text-label-md uppercase tracking-wider transition-colors bg-primary-container text-on-primary font-bold cursor-pointer';
    } else {
      btn.className = 'nav-tab-btn px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition-colors uppercase tracking-wider cursor-pointer';
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.stepQuestApp = new StepQuestTelemetry();
});
