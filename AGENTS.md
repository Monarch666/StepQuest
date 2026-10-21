# 🤖 StepQuest — AI Coding Agent Guidelines (`AGENTS.md`)

Welcome, AI Agent! This file sets the operational rules, architectural principles, coding conventions, and testing requirements for collaborating on the **StepQuest** codebase.

---

## 1. Project Overview & Tech Stack

StepQuest consists of three interdependent layers:
1. **Web Client (`web/`)**:
   - Single Page Application built with HTML5, Vanilla JavaScript, and Tailwind CSS (Stitch UI Design System).
   - Lightweight Node.js HTTP server (`web/server.js`) serving static files and `/api/config`.
   - Supabase JavaScript Client (`web/supabase_service.js`) with dual-mode (Offline Demo vs. Live Cloud).
2. **Native Android App (`app/`)**:
   - Kotlin, Jetpack Compose, Material 3, Hilt Dependency Injection.
   - Google Maps SDK for Android (`MAPS_API_KEY`).
   - Hardware Step Counter (`Sensor.TYPE_STEP_COUNTER`) & Health Connect integration.
3. **Cloud Database (`Supabase_Schema.sql`)**:
   - PostgreSQL schema with tables: `users`, `journeys`, `milestones`, `user_journeys`, `daily_logs`, `achievements`.
   - Row Level Security (RLS) policies and Storage bucket (`avatars`).

---

## 2. Cardinal Rules (MUST ALWAYS FOLLOW)

### 🚨 Rule 1: Zero Secret Leakage
- **Never commit `local.properties`**, keystore files (`*.jks`, `*.keystore`), or raw JWT service role tokens to Git.
- Always check that `.gitignore` contains `local.properties`, `.gradle`, `node_modules/`, and build artifacts.
- When referencing credentials in code, read from `local.properties` or environment variables via the `/api/config` discovery endpoint.

### 📐 Rule 2: Precision Athletic Constants
Always use the standardized stride and caloric formulas across both Web and Android implementations:
```javascript
const KM_PER_STEP = 0.000762;  // 76.2 cm per average athletic stride
const KCAL_PER_STEP = 0.042;   // Grade-neutral athletic caloric burn
const GAUGE_CIRCUMFERENCE = 427.25; // 2 * Math.PI * 68px radius
```

### 🎨 Rule 3: Athletic Military-Grade Aesthetics
- **No cartoonish or playful emojis** in primary UI components. Use Google **Material Symbols Outlined** icons (e.g. `hiking`, `footprint`, `straighten`, `landscape`, `verified`).
- Adhere strictly to the **Stitch UI Dark Palette**:
  - Backgrounds: `#0e0e11` (lowest), `#131316` (surface), `#1b1b1e` (low), `#1f1f22` (container), `#2a2a2d` (high).
  - Accents: `#f66018` (blaze orange primary), `#62df7d` (neon trail secondary), `#ffb95f` (mountain gold tertiary).
  - Borders: `#353438` (`surface-container-highest`).

### 🔄 Rule 4: Cross-Screen State Synchronization
When the user switches their active quest or logs new steps, **all active screens must synchronize immediately**:
1. **Dashboard:** Active quest banner, mileage progress bar, remaining distance, radial SVG gauge.
2. **Quests Tab:** "Continue Quest" active button state versus "Select Trek".
3. **Trail Map:** Sector header title and route percentage realized.
4. **Leaderboard:** Active user's displayed quest, total kilometers, and total cadence.

---

## 3. Directory Layout & File Organization

```text
StepQuest/
├── app/                          # Native Android source code
│   └── src/main/java/com/stepquest/
│       ├── data/                 # Repositories & Supabase remote data sources
│       ├── domain/               # Models and UseCases (CheckMilestones, StartJourney)
│       ├── presentation/         # Jetpack Compose screens, ViewModels, Theme
│       └── utils/                # StepSensorManager, NotificationHelper, StepSyncWorker
├── web/                          # Web Application source code
│   ├── index.html                # Unified SPA containing all 5 tab views & modals
│   ├── stitch_app.js             # Telemetry engine, DOM binding, filters, shortcuts
│   ├── supabase_service.js       # Cloud Auth, real-time sync, and offline fallback
│   ├── server.js                 # Native Node HTTP server & /api/config endpoint
│   ├── style.css                 # Custom scrollbars, animations, and typography
│   └── assets/                   # Expedition trail imagery
├── scratch/                      # Automated E2E test runners and verification scripts
│   └── e2e_runner.js             # 13-point automated regression test suite
├── Supabase_Schema.sql           # Canonical PostgreSQL schema
├── DEPLOYMENT.md                 # Play Store release checklist & keystore instructions
├── local.properties.example      # Credential template (Supabase, Maps, Keystore)
└── local.properties              # Local credentials (IGNORED BY GIT)
```

---

## 4. Testing & Verification Standard

Before declaring any feature complete or committing code:
1. **Run the Automated Regression Runner:**
   ```bash
   node scratch/e2e_runner.js
   ```
   *Requirement:* All 13/13 assertions must pass (`0 Failed`).
2. **Verify Server Health:**
   `GET http://localhost:1001/api/health` should return `HTTP 200 OK`.
3. **Verify Configuration Discovery:**
   `GET http://localhost:1001/api/config` should accurately report `hasSupabase: true/false`.
4. **Browser Walkthrough:**
   Ensure modals (`#modal-manual-step`, `#modal-waypoint`, `#spec-modal`, `#modal-supabase-settings`, `#modal-auth`) open cleanly and close on `Escape` or backdrop click.

---

## 5. Developer Workflows Cheatsheet

```bash
# Start Web Development Server
cd web && node server.js          # Running at http://localhost:1001

# Execute E2E Test Suite
node scratch/e2e_runner.js

# Build Android Release Bundle (from root)
./gradlew bundleRelease

# Verify Git Tree is Clean
git status
```
