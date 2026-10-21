# 🏔️ StepQuest — Precision Endurance Trail Tracking

> **Real-World Walking Quests & Athletic Trail Telemetry Platform**

StepQuest transforms daily steps into epic real-world expeditions. Walk across iconic trails like **Delhi to Kedarnath**, **Mumbai to Goa**, **Manali to Leh**, and **Jaipur to Agra**, tracking elevation changes, waypoints, milestone laurels, and live leaderboards.

---

## 🏗️ Project Architecture

StepQuest includes both a **Native Android Application** and a **Web Application**, backed by a cloud **Supabase PostgreSQL** database.

```text
StepQuest/
├── app/                  # Native Android App (Kotlin, Jetpack Compose, Hilt, Maps SDK)
├── web/                  # Web Application (Vanilla JS, Tailwind, Stitch UI, Node server)
│   ├── index.html        # Single Page Application
│   ├── stitch_app.js     # UI telemetry, routes, and simulator controller
│   ├── supabase_service.js # Supabase Cloud client (Auth, DB sync, leaderboards)
│   └── server.js         # Lightweight HTTP server & configuration API
├── Supabase_Schema.sql   # Complete PostgreSQL schema (tables, RLS, storage, views)
├── DEPLOYMENT.md         # Play Store & cloud deployment checklist
└── local.properties.example # Environment variable template
```

---

## ⚡ Quick Start (Web Application)

### 1. Launch the Server
```bash
cd web
npm start
# or: node server.js
```
The application will be live at **http://localhost:1001**.

### 2. Run the End-to-End Test Suite
```bash
node scratch/e2e_runner.js
```

---

## ☁️ Connecting Supabase Backend

StepQuest works offline in **Demo Mode** by default, and automatically transitions to **Supabase Live Mode** once connected.

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in Supabase and execute the entire contents of [`Supabase_Schema.sql`](./Supabase_Schema.sql).
3. Copy your **Project URL** and **anon public key** from **Settings → API**.
4. In the Web App, click the **Demo Mode** pill in the top header and click **Save & Connect** (or paste them into `local.properties`):
   ```properties
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
   ```

---

## 📱 Native Android App

- **Language / Framework:** Kotlin 1.9+, Jetpack Compose, Material 3
- **Dependency Injection:** Dagger Hilt
- **Maps:** Google Maps SDK for Android
- **Sensors:** Hardware Step Counter (`Sensor.TYPE_STEP_COUNTER`) & Activity Recognition

### Build with Android Studio
1. Copy `local.properties.example` to `local.properties` and add your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `MAPS_API_KEY`.
2. Open the project root in **Android Studio Hedgehog** (2023.1.1) or newer.
3. Sync Gradle and run on a connected device or emulator.
4. For production release packaging, refer to [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📄 License

MIT License. Built for endurance athletes and outdoor enthusiasts.
