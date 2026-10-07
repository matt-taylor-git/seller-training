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

async function measure(browser, origin, activity) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://fonts.gstatic.com/**', route => route.abort());
    await page.addInitScript(activityName => {
      function ready() {
        const usable = activityName === 'jeopardy'
          ? document.querySelectorAll('#board .tile').length === 30 && document.querySelectorAll('#teams .team').length >= 2
          : document.querySelectorAll('#personas .pcard').length === 4;
        if (usable) window.__trainingUsable = performance.now();
        else requestAnimationFrame(ready);
      }
      requestAnimationFrame(ready);
    }, activity);
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
    return { usableMs, decodedBytes: responses.reduce((sum, item) => sum + item.bytes, 0), responses };
  } finally { await context.close(); }
}

const p95 = values => [...values].sort((a, b) => a - b)[Math.ceil(values.length * 0.95) - 1];
const servers = {};
let browser;
try {
  servers.baseline = await server(baseline);
  servers.candidate = await server(candidate);
  browser = await chromium.launch();
  const measurements = { jeopardy: { baseline: [], candidate: [] }, roleplay: { baseline: [], candidate: [] } };
  const order = [];
  for (let sample = 0; sample < samples; sample++) {
    for (const activity of ['jeopardy', 'roleplay']) {
      for (const version of sample % 2 ? ['candidate', 'baseline'] : ['baseline', 'candidate']) {
        const result = await measure(browser, servers[version].origin, activity);
        measurements[activity][version].push(result);
        order.push({ sample: sample + 1, activity, version, ...result });
      }
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
  const report = { samplesPerRoutePerVersion: samples, browser: browser.version(), viewport: { width: 1440, height: 900 },
    fontsBlocked: true, coldContexts: true, baseline: { path: resolve(baseline), sha: sha(baseline) },
    candidate: { path: resolve(candidate), sha: sha(candidate), dirty: Boolean(execFileSync('git', ['-C', resolve(candidate), 'status', '--porcelain'], { encoding: 'utf8' }).trim()) },
    summary, order };
  if (option('--output')) await writeFile(resolve(option('--output')), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (!Object.values(summary).every(item => item.passed)) process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  for (const instance of Object.values(servers)) await instance.close();
}
