# StepQuest — Google Play Store Deployment Guide

## Prerequisites Checklist

Before building, make sure you have:
- [ ] Android Studio Hedgehog (2023.1.1) or newer
- [ ] JDK 17 installed
- [ ] Google Play Console account (one-time $25 USD fee)
- [ ] Supabase project created at [supabase.com](https://supabase.com)
- [ ] Google Cloud project with Maps SDK + Places API enabled
- [ ] Google Fonts API (free, auto-enabled via GMS)

---

## Step 1 — Backend Setup (Supabase)

### 1.1 Create a Supabase Project
1. Go to [app.supabase.com](https://app.supabase.com) → **New Project**
2. Choose a region close to your users (e.g. `ap-south-1` for India)
3. Note your **Project URL** and **anon public key** from **Settings → API**

### 1.2 Run the Database Schema
1. In the Supabase dashboard, go to **SQL Editor**
2. Paste and execute the entire contents of `Supabase_Schema.sql`
3. Confirm all tables are created: users, journeys, milestones, user_journeys, daily_logs, achievements
4. Confirm the `avatars` storage bucket was created under **Storage**

### 1.3 Enable Auth Providers
1. Go to **Authentication → Providers**
2. Enable **Email** (already on by default)
3. Enable **Google** — you'll need a Google OAuth Client ID:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create an OAuth 2.0 Client ID (Android type)
   - Paste the Client ID into Supabase's Google provider settings

---

## Step 2 — API Keys Setup

### 2.1 Google Maps API Key
1. In Google Cloud Console → **APIs & Services → Credentials**
2. Create an **Android API Key** and restrict it to your app's package name (`com.stepquest`) and SHA-1
3. Enable: **Maps SDK for Android**, **Places API**

### 2.2 Configure local.properties
Copy `local.properties.example` to `local.properties` (never commit this file):

```properties
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
MAPS_API_KEY=AIzaSy...
KEYSTORE_PATH=../stepquest-release.jks
KEYSTORE_PASSWORD=YourKeystorePassword
KEY_ALIAS=stepquest
KEY_PASSWORD=YourKeyPassword
```

---

## Step 3 — Generate Release Keystore

> **⚠️ Keep this file safe forever. Losing it means you can never update the app.**

Run in a terminal from the project root:

```bash
keytool -genkey -v \
  -keystore stepquest-release.jks \
  -alias stepquest \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Fill in the prompts (name, organization, country). Store `stepquest-release.jks` in a safe location (e.g. encrypted drive, password manager).

---

## Step 4 — Build the Release AAB

```bash
# From the project root
./gradlew bundleRelease
```

The signed AAB will be at:
```
app/build/outputs/bundle/release/app-release.aab
```

### Verify the AAB is signed
```bash
jarsigner -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab
```

---

## Step 5 — Play Console Setup

### 5.1 Create the App
1. Go to [play.google.com/console](https://play.google.com/console)
2. **Create app** → set language to English, app type = App
3. Fill in **App details**: name "StepQuest", category = Health & Fitness

### 5.2 Store Listing Assets Needed

| Asset | Size |
|-------|------|
| App icon | 512×512 PNG |
| Feature graphic | 1024×500 PNG |
| Phone screenshots | Min 2, 16:9 or 9:16, 320–3840px |
| Short description | ≤ 80 chars |
| Full description | ≤ 4000 chars |

**Suggested short description:**
> Turn every step into a real-world adventure. Walk from Delhi to Kedarnath!

**Suggested full description:**
```
StepQuest transforms your daily walks and runs into epic real-world journeys.

🥾 CHOOSE YOUR QUEST
Pick from iconic Indian routes — Delhi to Kedarnath, Mumbai to Goa, Manali to Leh, and more. Every step you take advances your position on the map.

📍 REAL-TIME TRACKING
Your steps are counted 24/7 using your phone's built-in step sensor, even in the background. No GPS battery drain.

🏅 EARN MILESTONES
Unlock badges as you pass real towns and waypoints along your chosen route. Haridwar, Rishikesh, Kedarnath — each one a milestone to celebrate.

🏆 COMPETE WITH FRIENDS
Climb the weekly leaderboard and see how you stack up against fellow trailblazers from across India.

✨ FEATURES
• Background step tracking (no battery drain)
• Google Maps route visualization  
• Weekly leaderboard with podium
• Milestone badge collection
• Streak tracking & daily stats
• Offline step caching with cloud sync
• Supabase cloud backup
```

### 5.3 Content Rating
- Go to **Policy → App content → Content rating**
- Take the questionnaire: select "No" to violence, adult content, etc.
- Rating will be: **Everyone**

### 5.4 Privacy Policy (Required)
You must host a Privacy Policy URL. Minimum content:
- What data you collect (steps, email, username)
- How it's stored (Supabase, encrypted in transit)
- How to delete account (email support)
- No data sold to third parties

Paste the URL into **Policy → App content → Privacy policy**

### 5.5 Health & Fitness Permission Declaration
Since the app uses `ACTIVITY_RECOGNITION`:
1. Go to **Policy → App content → Permissions**
2. Declare usage: "Step counting for journey progress tracking"

---

## Step 6 — Upload & Release

### 6.1 Upload AAB
1. Go to **Testing → Internal testing** (start here for fast review)
2. Click **Create new release** → Upload your `app-release.aab`
3. Fill in release notes (e.g. "Initial release — version 1.0.0")
4. **Save → Review → Start rollout**

### 6.2 Promote to Production
After testing with internal testers:
1. Go to **Production → Create new release**
2. Select the same AAB from the artifact library
3. Set rollout percentage (recommend 10% first, then 100%)

---

## Step 7 — Post-Launch Checklist

- [ ] Monitor **Android Vitals** for crashes (target: ANR rate < 0.47%)
- [ ] Set up **Supabase alerts** for DB usage spikes
- [ ] Reply to Play Store reviews within 24h
- [ ] Update `versionCode` and `versionName` in `app/build.gradle.kts` for every update

---

## Useful Commands

```bash
# Debug build
./gradlew assembleDebug

# Release bundle (for Play Store)
./gradlew bundleRelease

# Release APK (for direct install testing)
./gradlew assembleRelease

# Run unit tests
./gradlew test

# Lint check
./gradlew lint
```

---

## App Architecture Summary

```
StepQuest/
├── app/src/main/java/com/stepquest/
│   ├── MainActivity.kt              ← Entry point + splash
│   ├── StepQuestApp.kt              ← Hilt app + WorkManager
│   ├── data/
│   │   ├── local/                   ← Room DB (offline step cache)
│   │   ├── remote/                  ← Supabase data sources
│   │   └── repository/              ← Repository implementations
│   ├── di/                          ← Hilt modules
│   ├── domain/
│   │   ├── model/                   ← Data models
│   │   ├── repository/              ← Repository interfaces
│   │   └── usecase/                 ← Business logic
│   ├── presentation/
│   │   ├── components/              ← Reusable Composables
│   │   ├── navigation/              ← NavGraph + routes
│   │   ├── screens/                 ← All 7 app screens
│   │   ├── theme/                   ← Colors, Type, Shape, Theme
│   │   └── viewmodel/               ← 6 ViewModels
│   └── utils/
│       ├── StepCounterService.kt    ← Foreground step sensor
│       ├── StepSyncWorker.kt        ← Background Supabase sync
│       ├── StepSensorManager.kt     ← Hardware sensor wrapper
│       ├── HealthConnectManager.kt  ← Fallback sensor
│       └── NotificationHelper.kt   ← Milestone notifications
├── Supabase_Schema.sql              ← Run this first in Supabase
├── local.properties.example        ← Copy → local.properties
└── DEPLOYMENT.md                   ← This file
```
