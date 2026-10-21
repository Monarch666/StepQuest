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
  kedarnath: {
    region: "Himalayan Sanctuary Route",
    title: "Delhi to Kedarnath",
    fullName: "Delhi to Kedarnath Corridor",
    sector: "Himalayan Ascent Sector",
    mapTitle: "Delhi to Kedarnath Sanctuary",
    totalKm: 464.0,
    completedKm: 214.2,
    pct: 46
  },
  goa: {
    region: "Western Ghats Shoreline",
    title: "Mumbai to Goa",
    fullName: "Mumbai to Goa Konkan Trail",
    sector: "Konkan Coastal Sector",
    mapTitle: "Mumbai to Goa Coastal Trail",
    totalKm: 587.0,
    completedKm: 182.4,
    pct: 31
  },
  manali: {
    region: "Trans-Himalayan Pass Route",
    title: "Manali to Leh",
    fullName: "Manali to Leh Highway",
    sector: "Ladakh High-Pass Sector",
    mapTitle: "Manali to Leh Trans-Himalayan",
    totalKm: 474.0,
    completedKm: 94.8,
    pct: 20
  },
  jaipur: {
    region: "Aravalli Heritage Corridor",
    title: "Jaipur to Agra",
    fullName: "Jaipur to Agra Heritage Trail",
    sector: "Mughal Trunk Road Sector",
    mapTitle: "Jaipur to Agra Heritage Trail",
    totalKm: 240.0,
    completedKm: 168.0,
    pct: 70
  }
};

class StepQuestTelemetry {
  constructor() {
    this.steps = 6420;
    this.goal = 10000;
    this.autoWalkTimer = null;
    this.sortDistanceAsc = false;
    this.activeQuest = localStorage.getItem('stepquest_active_quest') || 'kedarnath';
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
    this.bindAchievementsInteractivity();
    this.bindGlobalShortcuts();
    this.bindSupabaseIntegration();
    this.setActiveQuest(this.activeQuest, false);
    this.updateGauge();
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

  /* ─── Telemetry Hardware Simulator Bar ────────────────────────────── */
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
          btnAuto.classList.remove('bg-secondary-container', 'text-on-secondary');
          this.showToast('Walking generator paused', 'pause');
        } else {
          this.autoWalkTimer = setInterval(() => {
            this.addSteps(25);
          }, 140);
          btnAuto.textContent = 'Simulate Walk: On';
          btnAuto.classList.add('bg-secondary-container', 'text-on-secondary');
          this.showToast('Walking telemetry generator active', 'directions_walk');
        }
      });
    }

    const btnReset = document.getElementById('sim-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.steps = 6420;
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
    const rows = document.querySelectorAll('#leaderboard-tbody tr');

    const applyRosterFilter = (filter) => {
      filterButtons.forEach(btn => {
        if (btn.dataset.rosterFilter === filter) {
          btn.className = 'roster-filter-btn px-space-md py-space-xs rounded bg-primary-container text-on-primary font-bold font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs cursor-pointer shadow-sm transition-all';
        } else {
          btn.className = 'roster-filter-btn px-space-md py-space-xs rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs transition-colors cursor-pointer';
        }
      });

      rows.forEach(row => {
        const rank = parseInt(row.dataset.rank) || 0;
        let show = true;

        if (filter === 'near') {
          // Show standings near Arjun Walker (Ranks 2 to 6)
          show = rank >= 2 && rank <= 6;
        } else if (filter === 'top3') {
          // Show Top 3 podium
          show = rank >= 1 && rank <= 3;
        }

        row.style.display = show ? '' : 'none';
      });

      const filterNames = { all: 'All Ranks (1-8)', near: 'Near Your Standings (±2)', top3: 'Top 3 Podium' };
      this.showToast(`Filtered: ${filterNames[filter] || 'Leaderboard'}`, 'format_list_numbered');
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        applyRosterFilter(btn.dataset.rosterFilter || 'all');
      });
    });
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
    const stepDiff = Math.max(0, this.steps - 6420);
    const distDiff = stepDiff * KM_PER_STEP;

    if (leadDist) {
      leadDist.textContent = (64.1 + distDiff).toFixed(1);
    }
    if (leadCadence) {
      leadCadence.textContent = (84120 + stepDiff).toLocaleString();
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
