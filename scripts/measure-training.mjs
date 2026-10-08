import { spawn, execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
};
const samples = Number(option('--samples') || 20);
const baseline = option('--baseline');
const candidate = option('--candidate');
const packs = (option('--packs') || 'default').split(',');
if (new Set(packs).size !== packs.length || packs.some(pack => !['default', 'fsi'].includes(pack))) throw new Error('--packs accepts default,fsi without duplicates.');
if (!baseline || !candidate || !Number.isInteger(samples) || samples < 20) throw new Error('Provide --baseline, --candidate, and at least 20 --samples.');

async function server(directory) {
  const child = spawn('python3', ['-u', '-m', 'http.server', '0', '--bind', '127.0.0.1', '--directory', join(resolve(directory), 'prototype/seller-ai-training')]);
  const exited = new Promise(resolveExit => child.once('exit', resolveExit));
  let log = '';
  child.stderr.on('data', data => { log += data; });
  try {
    const port = await new Promise((resolvePort, reject) => {
      const timeout = setTimeout(() => reject(new Error('The Python server did not start.')), 10000);
      child.once('error', error => { clearTimeout(timeout); reject(error); });
      child.once('exit', () => { clearTimeout(timeout); reject(new Error(log)); });
      child.stdout.on('data', data => {
        log += data;
        const match = log.match(/port (\d+)/);
        if (match) { clearTimeout(timeout); resolvePort(Number(match[1])); }
      });
    });
    const origin = `http://127.0.0.1:${port}`;
    const response = await fetch(origin);
    if (!response.ok) throw new Error('The Python server did not return HTTP 200.');
    return { origin, close: async () => { child.kill('SIGTERM'); await exited; } };
  } catch (error) { child.kill('SIGTERM'); await exited; throw error; }
}

async function measure(browser, origin, activity, packId, verifyPack) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://fonts.gstatic.com/**', route => route.abort());
    await page.addInitScript(({ activityName, packId, verifyPack }) => {
      if (location.protocol !== 'http:') return;
      localStorage.setItem('aiTraining.selection.v1', JSON.stringify({ schema: 1, packId }));
      function ready() {
        const usable = activityName === 'jeopardy'
          ? document.querySelectorAll('#board .tile').length === 30 && document.querySelectorAll('#teams .team').length >= 2
          : document.querySelectorAll('#personas .pcard').length === 4;
        const label = packId === 'fsi' ? 'FSI' : 'Default';
        const pinned = !verifyPack || document.querySelector('#selectionNotice')?.textContent.includes(`Current pack: ${label}.`);
        if (usable && pinned) window.__trainingUsable = performance.now();
        else requestAnimationFrame(ready);
      }
      requestAnimationFrame(ready);
    }, { activityName: activity, packId, verifyPack });
    const bodies = [];
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(origin) && /\.(html|mjs|js)(\?|$)/.test(response.url())) {
        bodies.push(response.body().then(body => ({ path: new URL(response.url()).pathname, bytes: body.length, status: response.status() })));
      }
    });
    await page.goto(`${origin}/${activity}.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => Number.isFinite(window.__trainingUsable));
    const usableMs = await page.evaluate(() => window.__trainingUsable);
    const responses = await Promise.all(bodies);
    if (errors.length || responses.some(item => item.status !== 200)) throw new Error(JSON.stringify({ errors, responses }));
    return { usableMs, decodedBytes: responses.reduce((sum, item) => sum + item.bytes, 0), responses, effectivePack: packId };
  } finally { await context.close(); }
}

async function measureSettings(browser, origin, activity, packId, version) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://fonts.gstatic.com/**', route => route.abort());
    await page.addInitScript(({ activity, packId, version }) => {
      if (location.protocol !== 'http:') return;
      if (location.pathname === '/settings.html' && localStorage.getItem('aiTraining.selection.v1') === null) {
        localStorage.setItem('aiTraining.selection.v1', JSON.stringify({ schema: 1, packId: packId === 'fsi' ? 'default' : 'fsi' }));
      }
      document.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (link && ((version === 'candidate' && link.id === 'returnHome') || (version === 'baseline' && link.getAttribute('href') === `${activity}.html`))) {
          sessionStorage.setItem('journeyStart', String(performance.timeOrigin + performance.now()));
        }
        if (event.target.closest('#saveSelection')) {
          const start = performance.now();
          const observer = new MutationObserver(() => {
            if (document.querySelector('#saveStatus')?.textContent.includes('selected for both activities')) {
              window.__saveFeedbackMs = performance.now() - start;
              observer.disconnect();
            }
          });
          observer.observe(document.getElementById('saveStatus'), { childList: true, subtree: true, characterData: true });
        }
      }, true);
      if (location.pathname !== `/${activity}.html`) return;
      function ready() {
        const usable = activity === 'jeopardy' ? document.querySelectorAll('#board .tile').length === 30 : document.querySelectorAll('#personas .pcard').length === 4;
        const pinned = version === 'baseline' || document.querySelector('#selectionNotice')?.textContent.includes(`Current pack: ${packId === 'fsi' ? 'FSI' : 'Default'}.`);
        if (usable && pinned) window.__journeyMs = performance.timeOrigin + performance.now() - Number(sessionStorage.getItem('journeyStart'));
        else requestAnimationFrame(ready);
      }
      requestAnimationFrame(ready);
    }, { activity, packId, version });
    const errors = [];
    const requests = [];
    let route = '';
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => { if (request.url().startsWith(origin)) errors.push(`${request.url()} ${request.failure()?.errorText}`); });
    page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) errors.push(`${response.url()} ${response.status()}`); });
    page.on('request', request => {
      if (!request.url().startsWith(origin)) return;
      if (request.isNavigationRequest()) route = new URL(request.url()).pathname;
      requests.push({ route, path: new URL(request.url()).pathname });
    });
    let saveFeedbackMs = null;
    if (version === 'candidate') {
      await page.goto(`${origin}/settings.html`);
      await page.locator(`input[value="${packId}"]`).check();
      await page.locator('#saveSelection').click();
      await page.waitForFunction(() => Number.isFinite(window.__saveFeedbackMs));
      saveFeedbackMs = await page.evaluate(() => window.__saveFeedbackMs);
      await page.locator('#returnHome').click();
      await page.waitForFunction(() => document.querySelector('#currentPack')?.textContent.startsWith('Current pack:'));
    } else { await page.goto(`${origin}/index.html`); }
    await page.locator(`a[href="${activity}.html"]`).click({ force: true });
    await page.waitForFunction(() => Number.isFinite(window.__journeyMs));
    const usableMs = await page.evaluate(() => window.__journeyMs);
    if (errors.length) throw new Error(JSON.stringify(errors));
    const requestsPerRoute = Object.fromEntries([...new Set(requests.map(request => request.route))].map(route => [route, requests.filter(request => request.route === route).length]));
    return { usableMs, saveFeedbackMs, requestsPerRoute, totalJourneyRequests: requests.length, requests };
  } finally { await context.close(); }
}

async function measureStorage(browser, origin, version) {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://fonts.gstatic.com/**', route => route.abort());
    await page.goto(`${origin}/jeopardy.html`);
    return await page.evaluate(async ({ version, samples }) => {
      const candidate = version === 'candidate';
      const training = candidate ? (await import('/shared/training.mjs')).training : null;
      const key = candidate ? 'aiDealJeopardy.v2.default.1' : 'aiDealJeopardy.v1';
      const state = { teams: Array.from({ length: 4 }, (_, i) => ({ name: String(i).repeat(28), score: Number.MAX_SAFE_INTEGER - i })),
        used: Array.from({ length: 30 }, (_, i) => `${Math.floor(i / 5)}-${i % 5}`), dd: ['0-1', '1-4'], timerOn: true, muted: true, timerSecs: 60 };
      const serialized = () => JSON.stringify(candidate ? { schema: 2, packId: 'default', packRevision: 1, state } : state);
      localStorage.setItem(key, serialized());
      const operations = { absentSelection: [], selectedResolution: [], checkpointRead: [], checkpointWrite: [] };
      const timed = operation => { const start = performance.now(); operation(); return performance.now() - start; };
      for (let sample = 0; sample < samples; sample++) {
        localStorage.removeItem('aiTraining.selection.v1');
        operations.absentSelection.push(timed(() => candidate ? training.readSelection() : localStorage.getItem('aiTraining.selection.v1')));
        if (candidate) {
          localStorage.setItem('aiTraining.selection.v1', '{"schema":1,"packId":"default"}');
          operations.selectedResolution.push(timed(() => training.readSelection()));
        }
        operations.checkpointRead.push(timed(() => {
          const restored = candidate ? training.openPage('jeopardy').readCheckpoint().state : JSON.parse(localStorage.getItem(key));
          if (restored.used.length !== 30 || restored.teams.length !== 4) throw new Error('Maximal board did not restore.');
        }));
        state.teams[0].score -= 1;
        const handle = candidate ? training.openPage('jeopardy') : null;
        if (handle) handle.readCheckpoint();
        operations.checkpointWrite.push(timed(() => {
          if (candidate) { if (!handle.saveCheckpoint(state).ok) throw new Error('Checkpoint write failed.'); }
          else localStorage.setItem(key, JSON.stringify(state));
        }));
        const written = JSON.parse(localStorage.getItem(key));
        if ((candidate ? written.state : written).teams[0].score !== state.teams[0].score) throw new Error('Checkpoint write was not durable.');
      }
      return { operations, serializedBytes: new TextEncoder().encode(serialized()).length,
        absentSelectionMeaning: candidate ? 'Resolve absent preference to Default' : 'Raw absent-key read; trunk has no selection feature',
        selectedResolutionAvailable: candidate, maximalTeams: 4, maximalUsedTiles: 30 };
    }, { version, samples });
  } finally { await context.close(); }
}

const p95 = values => [...values].sort((a, b) => a - b)[Math.ceil(values.length * 0.95) - 1];
const servers = {};
let browser;
try {
  servers.baseline = await server(baseline);
  servers.candidate = await server(candidate);
  browser = await chromium.launch();
  const storage = {};
  if (args.includes('--storage')) {
    for (const version of ['baseline', 'candidate']) {
      const result = await measureStorage(browser, servers[version].origin, version);
      const p95Ms = Object.fromEntries(Object.entries(result.operations).map(([name, values]) => [name, values.length ? p95(values) : null]));
      storage[version] = { ...result, p95Ms, passed: Object.values(p95Ms).every(value => value === null || value <= 10) && result.serializedBytes <= 16 * 1024 };
    }
  }
  const measurements = Object.fromEntries(packs.flatMap(pack => ['jeopardy', 'roleplay'].map(activity => [pack === 'default' ? activity : `${pack}.${activity}`, { baseline: [], candidate: [] }])));
  const order = [];
  for (let sample = 0; sample < samples; sample++) {
    for (const pack of sample % 2 ? [...packs].reverse() : packs) {
      for (const activity of ['jeopardy', 'roleplay']) {
        for (const version of sample % 2 ? ['candidate', 'baseline'] : ['baseline', 'candidate']) {
          const effectivePack = version === 'baseline' ? 'default' : pack;
          const result = await measure(browser, servers[version].origin, activity, effectivePack, version === 'candidate');
          measurements[pack === 'default' ? activity : `${pack}.${activity}`][version].push(result);
          order.push({ sample: sample + 1, pack, activity, version, ...result });
        }
      }
    }
  }
  const settings = {};
  if (args.includes('--settings')) {
    for (const packId of packs) for (const activity of ['jeopardy', 'roleplay']) {
      const versions = { baseline: [], candidate: [] };
      for (let sample = 0; sample < samples; sample++) {
        for (const version of sample % 2 ? ['candidate', 'baseline'] : ['baseline', 'candidate']) {
          versions[version].push(await measureSettings(browser, servers[version].origin, activity, packId, version));
        }
      }
      const baselineP95Ms = p95(versions.baseline.map(item => item.usableMs));
      const candidateP95Ms = p95(versions.candidate.map(item => item.usableMs));
      const saveFeedbackP95Ms = p95(versions.candidate.map(item => item.saveFeedbackMs));
      const maxFirstPartyRequestsPerRoute = Math.max(...versions.candidate.flatMap(item => Object.values(item.requestsPerRoute)));
      settings[`${packId}.${activity}`] = { baselineP95Ms, candidateP95Ms, deltaMs: candidateP95Ms - baselineP95Ms, saveFeedbackP95Ms,
        maxFirstPartyRequestsPerRoute, maxTotalJourneyRequests: Math.max(...versions.candidate.map(item => item.totalJourneyRequests)),
        passed: saveFeedbackP95Ms <= 100 && candidateP95Ms <= 1000 && candidateP95Ms - baselineP95Ms <= 150 && maxFirstPartyRequestsPerRoute <= 10,
        measurements: versions };
    }
  }
  const summary = {};
  for (const [activity, versions] of Object.entries(measurements)) {
    const before = p95(versions.baseline.map(item => item.usableMs));
    const after = p95(versions.candidate.map(item => item.usableMs));
    const baselineBytes = Math.max(...versions.baseline.map(item => item.decodedBytes));
    const candidateBytes = Math.max(...versions.candidate.map(item => item.decodedBytes));
    summary[activity] = {
      baselineP95Ms: before, candidateP95Ms: after, deltaMs: after - before, baselineBytes, candidateBytes,
      passed: after <= 1000 && after - before <= 150 && candidateBytes <= 400 * 1024
    };
  }
  const sha = directory => execFileSync('git', ['-C', resolve(directory), 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const report = { samplesPerRoutePerVersion: samples, packs, baselineComparison: 'Each requested candidate pack uses an actual cold baseline Default entry screen. No synthetic FSI baseline is claimed.', browser: browser.version(), viewport: { width: 1440, height: 900 },
    fontsBlocked: true, coldContexts: true, baseline: { path: resolve(baseline), sha: sha(baseline) },
    candidate: { path: resolve(candidate), sha: sha(candidate), dirty: Boolean(execFileSync('git', ['-C', resolve(candidate), 'status', '--porcelain'], { encoding: 'utf8' }).trim()) },
    settingsComparison: 'Baseline Home activity click to usable game. Candidate Return to Home click in Settings, then activity click to usable game. Save feedback runs from Save click to status mutation. Requests count every first-party request per document route and across the full journey.',
    summary, storage, settings, order };
  if (option('--output')) await writeFile(resolve(option('--output')), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (!Object.values(summary).every(item => item.passed) || !Object.values(storage).every(item => item.passed) || !Object.values(settings).every(item => item.passed)) process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  for (const instance of Object.values(servers)) await instance.close();
}
