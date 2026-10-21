const http = require('http');
const assert = require('assert');
const fs = require('fs');

async function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:1001${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('   StepQuest Automated End-to-End Test Suite');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  const healthRes = await fetchUrl('/api/health');
  test('Health Check API returns HTTP 200 and ok status', () => {
    assert.strictEqual(healthRes.status, 200);
    const json = JSON.parse(healthRes.body);
    assert.strictEqual(json.status, 'ok');
    assert.strictEqual(json.app, 'StepQuest Web');
    assert.strictEqual(json.port, 1001);
  });

  // 2. SPA Index serving
  const indexRes = await fetchUrl('/');
  test('Root SPA returns HTTP 200 with HTML Content-Type', () => {
    assert.strictEqual(indexRes.status, 200);
    assert(indexRes.headers['content-type'].includes('text/html'));
  });

  // 3. Tab views presence
  test('HTML contains all 5 main view sections', () => {
    assert(indexRes.body.includes('id="view-dashboard"'), 'view-dashboard missing');
    assert(indexRes.body.includes('id="view-quests"'), 'view-quests missing');
    assert(indexRes.body.includes('id="view-trail-map"'), 'view-trail-map missing');
    assert(indexRes.body.includes('id="view-leaderboard"'), 'view-leaderboard missing');
    assert(indexRes.body.includes('id="view-achievements"'), 'view-achievements missing');
  });

  // 4. Modals presence
  test('HTML contains all interactive inspection and logging modals', () => {
    assert(indexRes.body.includes('id="modal-manual-step"'), 'modal-manual-step missing');
    assert(indexRes.body.includes('id="modal-waypoint"'), 'modal-waypoint missing');
    assert(indexRes.body.includes('id="spec-modal"'), 'spec-modal missing');
    assert(indexRes.body.includes('id="app-toast"'), 'app-toast missing');
  });

  // 5. Hardware simulator bar & quick controls
  test('HTML contains Telemetry Simulator and Quick Step controls', () => {
    assert(indexRes.body.includes('id="sim-add-500"'), 'sim-add-500 missing');
    assert(indexRes.body.includes('id="sim-add-2500"'), 'sim-add-2500 missing');
    assert(indexRes.body.includes('id="sim-auto-walk"'), 'sim-auto-walk missing');
    assert(indexRes.body.includes('id="sim-reset"'), 'sim-reset missing');
    assert(indexRes.body.includes('id="btn-sync-now"'), 'btn-sync-now missing');
  });

  // 6. Assets serving
  const jsRes = await fetchUrl('/stitch_app.js');
  test('Controller JS (/stitch_app.js) is served with HTTP 200 and valid JS header', () => {
    assert.strictEqual(jsRes.status, 200);
    assert(jsRes.headers['content-type'].includes('application/javascript'));
    assert(jsRes.body.includes('class StepQuestTelemetry'));
  });

  // 7. Data models validation in JS
  test('Controller defines athletic stride constants and waypoint records', () => {
    assert(jsRes.body.includes('const KM_PER_STEP = 0.000762;'));
    assert(jsRes.body.includes('const KCAL_PER_STEP = 0.042;'));
    assert(jsRes.body.includes('WAYPOINTS_DB = {'));
    assert(jsRes.body.includes('ROUTES_SPEC_DB = {'));
    assert(jsRes.body.includes('EXPEDITIONS_DATA = {'));
  });

  // 8. Quests route cards presence
  test('Quests tab contains all 4 major expeditions', () => {
    assert(indexRes.body.includes('data-quest-id="kedarnath"'), 'kedarnath route missing');
    assert(indexRes.body.includes('data-quest-id="goa"'), 'goa route missing');
    assert(indexRes.body.includes('data-quest-id="manali"'), 'manali route missing');
    assert(indexRes.body.includes('data-quest-id="jaipur"'), 'jaipur route missing');
  });

  // 9. Leaderboard active athlete
  test('Leaderboard contains user Arjun Walker with rank and telemetry tracking', () => {
    assert(indexRes.body.includes('Arjun Walker'));
    assert(indexRes.body.includes('id="lead-arjun-distance"'));
    assert(indexRes.body.includes('id="lead-arjun-cadence"'));
  });

  // 10. Achievements category tags
  test('Achievements view includes all, expedition, and volume badge filters', () => {
    assert(indexRes.body.includes('id="filter-all"'));
    assert(indexRes.body.includes('id="filter-expedition"'));
    assert(indexRes.body.includes('id="filter-volume"'));
  });

  // 11. Supabase Cloud Service Asset
  const sbRes = await fetchUrl('/supabase_service.js');
  test('Supabase service (/supabase_service.js) is served with HTTP 200 and SDK integration', () => {
    assert.strictEqual(sbRes.status, 200);
    assert(sbRes.headers['content-type'].includes('application/javascript'));
    assert(sbRes.body.includes('class SupabaseService'));
    assert(sbRes.body.includes('window.StepQuestSupabase'));
  });

  // 12. Supabase Server Configuration Endpoint
  const configRes = await fetchUrl('/api/config');
  test('Server /api/config endpoint returns valid configuration object', () => {
    assert.strictEqual(configRes.status, 200);
    const json = JSON.parse(configRes.body);
    assert('hasSupabase' in json);
    assert('supabaseUrl' in json);
    assert('supabaseAnonKey' in json);
  });

  // 13. Supabase Cloud Sync UI Controls
  test('HTML contains Supabase Settings and Authentication Modals & Indicators', () => {
    assert(indexRes.body.includes('id="modal-supabase-settings"'), 'modal-supabase-settings missing');
    assert(indexRes.body.includes('id="modal-auth"'), 'modal-auth missing');
    assert(indexRes.body.includes('id="cloud-sync-btn"'), 'cloud-sync-btn missing');
    assert(indexRes.body.includes('id="btn-auth-action"'), 'btn-auth-action missing');
    assert(indexRes.body.includes('id="btn-test-supabase"'), 'btn-test-supabase missing');
    assert(indexRes.body.includes('id="btn-save-supabase"'), 'btn-save-supabase missing');
    assert(indexRes.body.includes('id="btn-seed-supabase"'), 'btn-seed-supabase missing');
  });

  console.log(`\n========================================================`);
  console.log(`   Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
