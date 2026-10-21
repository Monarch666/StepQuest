# 📄 StepQuest — Product Requirements Document (PRD)

---

## 1. Executive Summary & Vision

**StepQuest** is a precision endurance trail tracking and athletic telemetry platform that transforms ordinary daily walking steps into epic, real-world geographic expeditions. Instead of viewing passive numbers on a pedometer, athletes and endurance walkers virtually traverse challenging topographic routes across the Indian subcontinent—such as **Delhi to Kedarnath** (464 km), **Mumbai to Goa** (590 km), and **Manali to Leh** (479 km).

Every step taken in the real world moves the user along high-altitude mountain passes, coastal ramparts, and historic trails, unlocking milestone waypoints, earning cryptographic badges, and competing on a live multiplayer leaderboard.

---

## 2. Target Audience & User Personas

| Persona | Motivation | Primary Need |
| :--- | :--- | :--- |
| **Endurance Trekker** (e.g. Arjun) | Preparing for real-world high-altitude treks | Detailed elevation profiles, gradient tracking, waypoint inspection |
| **Daily Fitness Walker** | Staying motivated beyond generic 10,000 step goals | Long-term narrative progression, visual maps, tangible milestones |
| **Quantified-Self Athlete** | Analyzing cadence, distance, and caloric expenditure | Accurate stride conversion, sensor synchronization, live telemetry |
| **Community Competitor** | Comparing performance with fellow walkers | Live synchronized leaderboards, verified badges, rank progression |

---

## 3. Core Problems & Value Proposition

- **The Pedometer Monotony Problem:** Standard fitness apps (Apple Health, Google Fit) present dry graphs that lead to user disengagement after a few weeks.
- **The StepQuest Solution:** Contextualizes daily physical activity within heroic real-world journeys. Walking 10,000 steps isn't just closing a ring—it's advancing 7.62 kilometers past the Haridwar holy ghats on the climb toward the Kedarnath glacier.

---

## 4. Key Functional Requirements

### 4.1 Master Expedition Journeys
- **Pre-Seeded Real-World Routes:**
  1. **Delhi to Kedarnath Sanctuary Route:** 464.0 KM • Hard • 216m to 3,583m alpine climb.
  2. **Mumbai to Goa Konkan Trail:** 590.0 KM • Moderate • Arabian Sea coastline and laterite cliffs.
  3. **Manali to Leh Trans-Himalayan Highway:** 479.0 KM • Hard • High-altitude passes (Rohtang, Tanglang La).
  4. **Jaipur to Agra Heritage Trail:** 232.0 KM • Easy • Aravalli Ridge and Mughal Golden Triangle.
  5. **Chennai to Pondicherry Coastal Corridor:** 150.0 KM • Easy • Coromandel coast and French colonial promenades.
- **Route Filtering & Discovery:** Search by title/region, filter by difficulty (Easy, Moderate, Hard) and terrain (Himalayan, Coastal), sort by total distance (ascending/descending).
- **Route Specification Inspector:** Deep modal displaying GNSS precision, caloric burn estimates ($1,240\text{ kcal}/15\text{km}$), and terrain elevation notes.

### 4.2 Precision Cadence & Telemetry Engine
- **Athletic Stride Conversion Constants:**
  - $\text{Distance} = \text{Steps} \times 0.000762\text{ km}$ ($76.2\text{ cm}$ standard stride).
  - $\text{Calories} = \text{Steps} \times 0.042\text{ kcal}$.
- **Radial Pedometer Visualizer:** Circular SVG gauge ($2\pi r = 427.25\text{ px}$) showing daily progress toward the 10,000-step target with dynamic stroke dashoffset.
- **Simulated Hardware Telemetry Bar:** Built-in pulse generator for testing (+500 steps, +2,500 steps sprint, 42 Hz continuous walking generator, baseline reset).
- **Manual Walk Session Logger:** Modal input with presets (+5k, +10k, +15k steps) and live kilometer/calorie preview.

### 4.3 Topographic Waypoint Ledger & Trail Map
- **Sector Waypoint Inspection:** Modal displaying altitude, gradient percentage, GPS coordinates, distance remaining, and tactical trail narrative.
- **Interactive SVG Trail Map:** Route progression path, milestone pins (Completed, Active Target, Locked), and toggleable topographic contour elevation grid.

### 4.4 Multiplayer Leaderboard & Roster Filter
- **Standings View:** Live ranking displaying athlete avatar, username, current expedition, completed kilometers, and total cadence.
- **Roster Filtering:** Top 3 Podium view, Near Standings view ($\pm 2$ ranks around current user), Full Roster view.

### 4.5 Laurels & Achievement Badges
- **8 Athletic Badges:** Categorized into **Expedition Milestones** (Haridwar Waypoint, Rohtang Pass, etc.) and **Pace & Volume** (First Kilometer, 10K Summit, Endurance Streak).
- **Verification:** Cryptographic GNSS verification simulation and toast confirmation.

### 4.6 Dual-Mode Cloud & Offline Resilience
- **Offline Demo Mode:** Works immediately without credentials, using realistic local storage and mock athletes.
- **Supabase Cloud Mode:** Real-time database sync (`public.users`, `public.daily_logs`, `public.journeys`), user authentication, and multi-client leaderboard synchronization.

---

## 5. Non-Functional Requirements

- **Design Aesthetic:** Dark tactical cockpit mode (`#0e0e11` surface), high-contrast primary accents (`#f66018` blaze orange, `#62df7d` neon trail green), no playful emojis in core UI.
- **Performance:** Instant UI rendering ($<100\text{ms}$ latency), optimistic local state updates with asynchronous cloud syncing.
- **Security:** RLS policies enforced on all Supabase tables, zero hardcoded secrets in version control.
- **Cross-Platform Parity:** Web application (Chrome, Safari, Firefox, Edge, Mobile Web) and Native Android (API 26+, Android 8.0 through Android 14+).

---

## 6. Success Metrics & KPIs

1. **Daily Engagement:** Average daily steps logged per active athlete.
2. **Quest Completion Rate:** Percentage of started expeditions reached to completion.
3. **Sync Reliability:** $<0.1\%$ telemetry sync error rate between client and Supabase cloud.
4. **End-to-End Test Integrity:** 100% pass rate across automated regression test suites.
