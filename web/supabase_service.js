/* ═══════════════════════════════════════════════════════════════════
   StepQuest — Supabase Cloud Backend Service
   Manages Real-Time Auth, Cloud Database Sync, Telemetry Logging,
   and Leaderboards with seamless offline/demo fallbacks.
   ═══════════════════════════════════════════════════════════════════ */

(function (window) {
  'use strict';

  // Fallback seed catalog matching Supabase_Schema.sql
  const DEFAULT_JOURNEYS = [
    {
      title: "Delhi to Kedarnath",
      description: "A spiritual trek through the Himalayas via Haridwar, Rishikesh, and the Char Dham route.",
      total_km: 464,
      difficulty: "Hard"
    },
    {
      title: "Mumbai to Goa",
      description: "A scenic coastal walk along the Konkan coastline through beaches and fishing villages.",
      total_km: 590,
      difficulty: "Moderate"
    },
    {
      title: "Manali to Leh",
      description: "The legendary Himalayan highway through Rohtang Pass and the Zanskar Valley.",
      total_km: 479,
      difficulty: "Hard"
    },
    {
      title: "Jaipur to Agra",
      description: "A heritage trail through Rajasthan and the historic Golden Triangle.",
      total_km: 232,
      difficulty: "Easy"
    },
    {
      title: "Chennai to Pondicherry",
      description: "A peaceful coastal route with temples, backwaters, and French colonial architecture.",
      total_km: 150,
      difficulty: "Easy"
    }
  ];

  class SupabaseService {
    constructor() {
      this.client = null;
      this.status = 'initializing'; // 'connected' | 'demo_offline' | 'error' | 'initializing'
      this.statusMessage = 'Initializing cloud sync...';
      this.currentUser = null;
      this.userProfile = null;
      this.statusListeners = [];
      this.authListeners = [];
      this.journeysListeners = [];
      this.leaderboardListeners = [];
    }

    onStatusChange(fn) { this.statusListeners.push(fn); }
    onAuthChange(fn) { this.authListeners.push(fn); }
    onJourneysChange(fn) { this.journeysListeners.push(fn); }
    onLeaderboardChange(fn) { this.leaderboardListeners.push(fn); }

    emitStatus(status, message = '') {
      this.status = status;
      this.statusMessage = message;
      this.statusListeners.forEach(fn => fn(status, message));
    }

    emitAuth(user, profile) {
      this.currentUser = user;
      this.userProfile = profile;
      this.authListeners.forEach(fn => fn(user, profile));
    }

    async init() {
      // 1. Check localStorage first
      let url = localStorage.getItem('stepquest_supabase_url') || '';
      let key = localStorage.getItem('stepquest_supabase_anon_key') || '';

      // 2. Check server /api/config if localStorage is empty
      if (!url || !key) {
        try {
          const res = await fetch('/api/config');
          if (res.ok) {
            const data = await res.json();
            if (data.hasSupabase && data.supabaseUrl && data.supabaseAnonKey) {
              url = data.supabaseUrl;
              key = data.supabaseAnonKey;
              localStorage.setItem('stepquest_supabase_url', url);
              localStorage.setItem('stepquest_supabase_anon_key', key);
            }
          }
        } catch (e) {
          console.warn('[StepQuest] Could not fetch server config:', e);
        }
      }

      if (url && key && !url.includes('YOUR_PROJECT_REF')) {
        await this.setupClient(url, key);
      } else {
        this.emitStatus('demo_offline', 'Local Demo Mode (Cloud Sync Inactive)');
      }
    }

    async setupClient(url, key) {
      if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        console.warn('[StepQuest] Supabase SDK not loaded yet, retrying...');
        setTimeout(() => this.setupClient(url, key), 500);
        return;
      }

      try {
        this.emitStatus('initializing', 'Connecting to Supabase...');
        this.client = window.supabase.createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });

        // Test connection by checking session
        const { data: sessionData, error: sessionErr } = await this.client.auth.getSession();
        if (sessionErr) throw sessionErr;

        this.emitStatus('connected', 'Supabase Cloud Connected');

        // Check if user is already signed in
        if (sessionData && sessionData.session && sessionData.session.user) {
          await this.loadUserProfile(sessionData.session.user);
        } else {
          this.emitAuth(null, null);
        }

        // Listen for Auth changes
        this.client.auth.onAuthStateChange(async (event, session) => {
          if (session && session.user) {
            await this.loadUserProfile(session.user);
          } else {
            this.emitAuth(null, null);
          }
        });

        // Fetch initial data
        this.fetchJourneys();
        this.fetchLeaderboard();

      } catch (err) {
        console.error('[StepQuest] Supabase connection failed:', err);
        this.emitStatus('error', `Connection Failed: ${err.message || 'Check credentials'}`);
      }
    }

    async testConnection(url, key) {
      if (!window.supabase) {
        throw new Error('Supabase client library is not loaded');
      }
      const testClient = window.supabase.createClient(url, key);
      const { data, error } = await testClient.auth.getSession();
      if (error) throw error;
      return true;
    }

    async saveCredentials(url, key) {
      url = (url || '').trim();
      key = (key || '').trim();

      if (!url || !key) {
        throw new Error('Please enter both Supabase URL and Anon Key');
      }

      await this.testConnection(url, key);
      localStorage.setItem('stepquest_supabase_url', url);
      localStorage.setItem('stepquest_supabase_anon_key', key);
      await this.setupClient(url, key);
      return true;
    }

    disconnect() {
      localStorage.removeItem('stepquest_supabase_url');
      localStorage.removeItem('stepquest_supabase_anon_key');
      this.client = null;
      this.currentUser = null;
      this.userProfile = null;
      this.emitStatus('demo_offline', 'Local Demo Mode (Cloud Sync Inactive)');
      this.emitAuth(null, null);
    }

    /* ─── Authentication Methods ─────────────────────────────────────── */
    async signUp(email, password, username) {
      if (!this.client) throw new Error('Supabase is not connected');

      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: { username: username || email.split('@')[0] }
        }
      });

      if (error) throw error;

      if (data && data.user) {
        // Create user profile in public.users
        try {
          await this.client.from('users').upsert({
            id: data.user.id,
            username: username || email.split('@')[0],
            email: email,
            total_steps: 0,
            total_km: 0
          });
        } catch (e) {
          console.warn('[StepQuest] Failed to create user profile row:', e);
        }

        await this.loadUserProfile(data.user);
      }
      return data;
    }

    async signIn(email, password) {
      if (!this.client) throw new Error('Supabase is not connected');

      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (data && data.user) {
        await this.loadUserProfile(data.user);
      }
      return data;
    }

    async signOut() {
      if (this.client) {
        await this.client.auth.signOut();
      }
      this.emitAuth(null, null);
    }

    async loadUserProfile(user) {
      if (!this.client || !user) return;

      try {
        const { data, error } = await this.client
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.warn('[StepQuest] Could not fetch public.users profile:', error.message);
        }

        const profile = data || {
          id: user.id,
          username: user.user_metadata?.username || user.email.split('@')[0],
          email: user.email,
          total_steps: 0,
          total_km: 0,
          avatar_url: ''
        };

        this.emitAuth(user, profile);
      } catch (err) {
        console.error('[StepQuest] loadUserProfile error:', err);
        this.emitAuth(user, {
          id: user.id,
          username: user.email.split('@')[0],
          email: user.email,
          total_steps: 0,
          total_km: 0
        });
      }
    }

    /* ─── Database Sync Operations ───────────────────────────────────── */
    async syncStepLog(stepsDelta, totalSteps, completedKm) {
      if (!this.client || !this.currentUser) return;

      const today = new Date().toISOString().split('T')[0];
      const km = (stepsDelta * 0.000762).toFixed(2);

      try {
        // 1. Update or create today's daily log
        const { data: existingLog } = await this.client
          .from('daily_logs')
          .select('id, steps, km')
          .eq('user_id', this.currentUser.id)
          .eq('date', today)
          .maybeSingle();

        if (existingLog) {
          await this.client
            .from('daily_logs')
            .update({
              steps: (existingLog.steps || 0) + stepsDelta,
              km: ((existingLog.km || 0) + parseFloat(km)).toFixed(2)
            })
            .eq('id', existingLog.id);
        } else {
          await this.client
            .from('daily_logs')
            .insert({
              user_id: this.currentUser.id,
              date: today,
              steps: stepsDelta,
              km: parseFloat(km)
            });
        }

        // 2. Update public.users total_steps and total_km
        await this.client
          .from('users')
          .update({
            total_steps: totalSteps,
            total_km: parseFloat(completedKm.toFixed(2))
          })
          .eq('id', this.currentUser.id);

        console.log('[StepQuest] Telemetry synchronized with Supabase database.');
      } catch (err) {
        console.warn('[StepQuest] Error syncing steps with Supabase:', err.message);
      }
    }

    async fetchJourneys() {
      if (!this.client) return;

      try {
        const { data, error } = await this.client
          .from('journeys')
          .select('*')
          .order('total_km', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          this.journeysListeners.forEach(fn => fn(data));
        }
      } catch (err) {
        console.warn('[StepQuest] Journeys table query note:', err.message);
      }
    }

    async seedSampleJourneys() {
      if (!this.client) throw new Error('Supabase is not connected');

      const { data: existing } = await this.client.from('journeys').select('id');
      if (existing && existing.length > 0) {
        return { message: 'Journeys table already contains data.', count: existing.length };
      }

      const { data, error } = await this.client.from('journeys').insert(DEFAULT_JOURNEYS).select();
      if (error) throw error;
      this.fetchJourneys();
      return { message: `Seeded ${data.length} expedition journeys successfully!`, count: data.length };
    }

    async fetchLeaderboard() {
      if (!this.client) return;

      try {
        // Try public.users table ordered by total_steps
        const { data, error } = await this.client
          .from('users')
          .select('id, username, avatar_url, total_steps, total_km')
          .order('total_steps', { ascending: false })
          .limit(10);

        if (error) throw error;
        if (data && data.length > 0) {
          this.leaderboardListeners.forEach(fn => fn(data));
        }
      } catch (err) {
        console.warn('[StepQuest] Leaderboard query note:', err.message);
      }
    }
  }

  window.StepQuestSupabase = new SupabaseService();
})(window);
