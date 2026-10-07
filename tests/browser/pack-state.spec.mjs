import { test as base, expect, chromium } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import alternate from '../fixtures/alternate-pack.mjs';
import defaultPack from '../../prototype/seller-ai-training/packs/default.mjs';

const evidence = process.env.CP2_EVIDENCE_DIR;
const key = 'aiDealJeopardy.v2.default.1';
const alternateKey = 'aiDealJeopardy.v2.alternate.1';
const selectionKey = 'aiTraining.selection.v1';
const legacyKey = 'aiDealJeopardy.v1';
const state = () => ({ teams: [{ name: 'Discovery team', score: 700 }, { name: 'Value team', score: -200 }], used: ['1-0'], dd: ['1-1', '2-2'], timerOn: false, muted: true, timerSecs: 20 });
const envelope = (overrides = {}) => JSON.stringify({ schema: 2, packId: 'default', packRevision: 1, state: state(), ...overrides });
const moduleSource = readFileSync(new URL('../../prototype/seller-ai-training/shared/training.mjs', import.meta.url), 'utf8');
const control = `<!doctype html><html><body style="font:20px system-ui;padding:40px"><h1>Isolated test selection control</h1>
<label>Pack <select id="pack"><option value="default">Default</option><option value="alternate">Alternate fixture</option></select></label>
<button id="save">Save selection</button><p id="status" role="status"></p><p id="selected"></p>
<a href="/jeopardy.html">Open Jeopardy</a> <a href="/roleplay.html">Open role-play</a>
<script type="module">import {training} from '/shared/training.mjs';
document.querySelector('#save').onclick=()=>{const result=training.selectPack(document.querySelector('#pack').value);document.querySelector('#status').textContent=result.message;document.querySelector('#selected').textContent=result.selection.packId;};
</script></body></html>`;

async function fixtureRoutes(context) {
  await context.route('https://fonts.googleapis.com/**', route => route.abort());
  await context.route('https://fonts.gstatic.com/**', route => route.abort());
  await context.route('**/shared/training.mjs', route => route.fulfill({ contentType: 'text/javascript', body: moduleSource.replace('export const training = createTraining();', `export const training = createTraining({packs: [defaultPack, ${JSON.stringify(alternate)}]});`) }));
  await context.route('**/__pack-control.html', route => route.fulfill({ contentType: 'text/html', body: control }));
}

const test = base.extend({
  context: async ({ context }, use, info) => {
    const errors = [];
    const events = [];
    await fixtureRoutes(context);
    context.on('page', page => {
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { events.push(message.text()); if (message.type() === 'error' && !/net::ERR_FAILED/.test(message.text())) errors.push(message.text()); });
      page.on('requestfailed', request => { if (request.url().startsWith('http://127.0.0.1:')) errors.push(`${request.url()} ${request.failure()?.errorText}`); });
      page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:') && response.status() >= 400) errors.push(`${response.url()} ${response.status()}`); });
    });
    await use(context);
    if (evidence) { mkdirSync(evidence, { recursive: true }); writeFileSync(join(evidence, `lane-${info.title.match(/Lane (\d+)/)[1]}-browser.json`), JSON.stringify({ title: info.title, errors, events }, null, 2)); }
    expect(errors, 'Browser errors and first-party request failures').toEqual([]);
  }
});
test.use({ trace: 'on' });

async function capture(page, name) {
  if (evidence) { mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: join(evidence, name), fullPage: true }); }
}
async function seed(page, records) {
  await page.goto('/__pack-control.html');
  await page.evaluate(records => { for (const [key, value] of Object.entries(records)) localStorage.setItem(key, value); }, records);
}
async function stored(page, name = key) { return page.evaluate(name => localStorage.getItem(name), name); }
async function select(page, id) {
  await page.goto('/__pack-control.html');
  await page.locator('#pack').selectOption(id);
  await page.locator('#save').click();
  await expect(page.locator('#selected')).toHaveText(id);
}
async function scoreClue(page) {
  await page.locator('.tile[data-key="0-0"]').click();
  await expect(page.locator('#flipper')).toHaveClass(/flipped/);
  await page.keyboard.press('Space');
  await expect(page.locator('#answer')).toHaveClass(/show/);
  await page.keyboard.press('Digit1');
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).not.toHaveClass(/show/);
}
const score = page => page.locator('#team0 .score');

test('Lane 1. Legacy board imports once and keeps the source unchanged.', async ({ page }) => {
  const legacy = JSON.stringify(state());
  await seed(page, { [legacyKey]: legacy });
  await page.goto('/jeopardy.html');
  await expect(score(page)).toHaveText('$700');
  await expect(page.locator('.tile[data-key="1-0"]')).toHaveClass(/used/);
  const converted = await stored(page);
  expect(JSON.parse(converted).state).toEqual(state());
  await scoreClue(page);
  await expect(score(page)).toHaveText('$800');
  await page.reload();
  await expect(score(page)).toHaveText('$800');
  expect(await stored(page, legacyKey)).toBe(legacy);
  if (evidence) writeFileSync(join(evidence, 'migration-records.json'), JSON.stringify({ legacy, converted, later: await stored(page) }, null, 2));
  await capture(page, 'legacy-restore.png');
  await page.evaluate(key => localStorage.removeItem(key), key);
  await page.reload();
  await expect(score(page)).toHaveText('$0');
  expect(await stored(page)).toBeNull();
  await page.reload();
  await expect(score(page)).toHaveText('$0');
  expect(await stored(page, legacyKey)).toBe(legacy);
});

test('Lane 2. Corrupt checkpoint stays intact through play and canceled recovery.', async ({ page }) => {
  await seed(page, { [key]: '{broken' });
  await page.goto('/jeopardy.html');
  await expect(page.locator('#saveNotice')).toContainText('invalid or incompatible');
  await scoreClue(page);
  await expect(score(page)).toHaveText('$100');
  expect(await stored(page)).toBe('{broken');
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#replaceSave').click();
  expect(await stored(page)).toBe('{broken');
  await page.reload();
  await expect(score(page)).toHaveText('$0');
  await capture(page, 'corrupt-save.png');
});

test('Lane 3. Future schema and old revisions survive play until approved fresh replacement.', async ({ page }) => {
  for (const rejected of [envelope({ schema: 99 }), envelope({ packRevision: 0 })]) {
    await seed(page, { [key]: rejected });
    await page.goto('/jeopardy.html');
    await expect(score(page)).toHaveText('$0');
    await expect(page.locator('#team0 .name')).toHaveText('Discovery team');
    await scoreClue(page);
    expect(await stored(page)).toBe(rejected);
    await page.reload();
    await expect(score(page)).toHaveText('$0');
    expect(await stored(page)).toBe(rejected);
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#replaceSave').click();
    await expect(page.locator('#replaceSave')).toBeHidden();
    await expect(page.locator('.tile.used')).toHaveCount(0);
    await expect(page.locator('.team .score')).toHaveText(['$0', '$0']);
    await page.locator('#undoBtn').click();
    await expect(page.locator('#toast')).toHaveText('Nothing to undo');
    expect(JSON.parse(await stored(page))).toMatchObject({ schema: 2, packId: 'default', packRevision: 1 });
    await page.reload();
    await expect(score(page)).toHaveText('$0');
  }
  const oldKey = 'aiDealJeopardy.v2.default.0';
  await page.evaluate(({ key, oldKey }) => { localStorage.removeItem(key); localStorage.setItem(oldKey, 'old revision record'); }, { key, oldKey });
  await page.reload();
  await expect(page.locator('#saveNotice')).toContainText('another content revision');
  await scoreClue(page);
  expect(await stored(page)).toBeNull();
  expect(await stored(page, oldKey)).toBe('old revision record');
  await capture(page, 'incompatible-save.png');
});

test('Lane 4. Switching packs keeps separate boards and restores each original.', async ({ page }) => {
  await page.goto('/jeopardy.html');
  await scoreClue(page);
  const original = await stored(page);
  await select(page, 'alternate');
  await page.locator('a[href="/jeopardy.html"]').click();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Alternate fixture');
  await expect(score(page)).toHaveText('$0');
  await page.locator('#team0 .adj button').first().click();
  await page.locator('#team0 .adj button').first().click();
  const other = await stored(page, alternateKey);
  expect(await stored(page)).toBe(original);
  await select(page, 'default');
  await page.locator('a[href="/jeopardy.html"]').click();
  await expect(score(page)).toHaveText('$100');
  await expect(page.locator('.tile[data-key="0-0"]')).toHaveClass(/used/);
  await select(page, 'alternate');
  await page.locator('a[href="/jeopardy.html"]').click();
  await expect(score(page)).toHaveText('$200');
  expect(await stored(page, alternateKey)).toBe(other);
  await capture(page, 'separate-boards.png');
});

test('Lane 5. Cross-tab selection leaves the active clue, timer, Final, and reset pinned.', async ({ page, context }) => {
  await page.goto('/jeopardy.html');
  await page.locator('#timerBtn').click();
  await page.locator('.tile[data-key="0-0"]').click();
  await expect(page.locator('#timerNum')).toHaveText(/\d+/);
  const clue = await page.locator('#clueText').textContent();
  const controls = await context.newPage();
  await select(controls, 'alternate');
  await expect(page.locator('#selectionNotice')).toContainText('Alternate fixture is selected');
  await expect(page.locator('#clueText')).toHaveText(clue);
  await expect(page.locator('#timerBar')).toHaveClass(/show/);
  await page.keyboard.press('Space');
  await page.keyboard.press('Digit1');
  await capture(page, 'pinned-clue.png');
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).not.toHaveClass(/show/);
  await expect(score(page)).toHaveText('$100');
  expect(await stored(page, alternateKey)).toBeNull();
  await capture(page, 'pinned-selection-notice.png');
  await page.keyboard.press('f');
  await expect(page.locator('.fcat')).toHaveText(defaultPack.jeopardy.final.category);
  await page.locator('.fw input').first().fill('50');
  await select(controls, 'default');
  await select(controls, 'alternate');
  await expect(page.locator('.fw input').first()).toHaveValue('50');
  await page.locator('#fNext').click();
  await expect(page.locator('.fclue')).toHaveText(defaultPack.jeopardy.final.q);
  await page.keyboard.press('Escape');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#resetBtn').click();
  await expect(score(page)).toHaveText('$0');
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Default');
  expect(JSON.parse(await stored(page)).packId).toBe('default');
  await capture(page, 'pinned-reset.png');
});

test('Lane 6. Role-play typing, feedback, restart, and replay remain pinned and preferences persist.', async ({ page, context }) => {
  await page.goto('/roleplay.html');
  await page.locator('#tGroup').click();
  await page.locator('.pcard[data-id="health"]').click();
  const controls = await context.newPage();
  await controls.goto('/__pack-control.html');
  await controls.locator('#pack').selectOption('alternate');
  await page.locator('#briefGo').click();
  await controls.locator('#save').click();
  await expect(page.locator('#selectionNotice')).toContainText('Alternate fixture is selected');
  await expect(page.locator('.choice')).toHaveCount(3);
  await expect(page.locator('.msg.cust')).toHaveCount(1);
  await expect(page.locator('body')).not.toContainText('Alternate customer');
  await page.locator('#tGroup').click();
  await page.locator('#tIdeal').click();
  await page.locator('.choice.best').click();
  const feedback = await page.locator('.fb').textContent();
  await select(controls, 'default');
  await select(controls, 'alternate');
  await expect(page.locator('.fb')).toHaveText(feedback);
  await capture(page, 'pinned-meeting.png');
  await page.locator('#bRestart').click();
  await expect(page.locator('.choice')).toHaveCount(3);
  await expect(page.locator('.msg.cust')).toHaveCount(1);
  for (let turn = 0; turn < 4; turn++) {
    await page.locator('.choice.best').click();
    await expect(page.locator('.fb')).toBeVisible();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('#sDeb')).toHaveClass(/show/);
  await page.locator('#dReplay').click();
  await expect(page.locator('.choice')).toHaveCount(3);
  await expect(page.locator('.msg.cust')).toHaveCount(1);
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Default');
  await expect(page.locator('body')).not.toContainText('Alternate customer');
  expect(JSON.parse(await stored(page, 'aiRoleplay.prefs.v1'))).toEqual({ group: false, spot: true, ideal: true });
  await page.reload();
  await expect(page.locator('#sPick')).toHaveClass(/show/);
  await expect(page.locator('.pcard').first()).toContainText('Alternate');
  await expect(page.locator('#tGroup')).not.toHaveClass(/on/);
});

test('Lane 7. History, pageshow, and focus reread notices without replacing a run or duplicating handlers.', async ({ page, context }) => {
  await page.goto('/roleplay.html');
  await page.locator('.pcard[data-id="cfo"]').click();
  await page.locator('#briefGo').click();
  await expect(page.locator('.choice')).toHaveCount(4);
  const controls = await context.newPage();
  await select(controls, 'alternate');
  for (const event of ['pageshow', 'focus']) {
    await page.evaluate(() => localStorage.setItem('aiTraining.selection.v1', '{"schema":1,"packId":"default"}'));
    await page.evaluate(event => window.dispatchEvent(new Event(event)), event);
    await expect(page.locator('#selectionNotice')).not.toContainText('Alternate fixture is selected');
    await page.evaluate(() => localStorage.setItem('aiTraining.selection.v1', '{"schema":1,"packId":"alternate"}'));
    await page.evaluate(event => window.dispatchEvent(new Event(event)), event);
    await expect(page.locator('#selectionNotice')).toContainText('Alternate fixture is selected');
    await expect(page.locator('.msg.cust')).toHaveCount(1);
  }
  await page.locator('#tGroup').click();
  await expect(page.locator('#tGroup')).toHaveClass(/on/);
  await page.keyboard.press('a');
  await expect(page.locator('.choice').first().locator('.votes b')).toHaveText('1');
  await page.locator('.brand').click();
  await select(controls, 'default');
  await page.goBack();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Default');
  await page.goForward();
  await expect(page).toHaveTitle('CDW · AI Seller Academy');
  await page.goBack();
  await expect(page.locator('#selectionNotice')).not.toContainText('Alternate fixture is selected');
  await capture(page, 'history-restore.png');
});

test('Lane 8. Denied reads and quota failures preserve selection while play continues.', async ({ page, context }) => {
  await page.addInitScript(() => {
    const get = Storage.prototype.getItem;
    const set = Storage.prototype.setItem;
    window.__storageMode = 'read';
    Storage.prototype.getItem = function(key) { if (window.__storageMode === 'read') throw new DOMException('Denied', 'SecurityError'); return get.call(this, key); };
    Storage.prototype.setItem = function(key, value) { if (window.__storageMode === 'quota') throw new DOMException('Full', 'QuotaExceededError'); return set.call(this, key, value); };
  });
  await page.goto('/jeopardy.html');
  await expect(page.locator('#saveNotice')).toContainText('storage is unavailable');
  await scoreClue(page);
  await expect(score(page)).toHaveText('$100');
  await capture(page, 'storage-unavailable.png');
  await page.goto('/__pack-control.html');
  await page.evaluate(() => { window.__storageMode = ''; localStorage.setItem('aiTraining.selection.v1', '{"schema":1,"packId":"default"}'); window.__storageMode = 'quota'; });
  await page.locator('#pack').selectOption('alternate');
  await page.locator('#save').click();
  await expect(page.locator('#status')).toHaveText('Settings could not be saved. Selection unchanged.');
  await expect(page.locator('#selected')).toHaveText('default');
  expect(JSON.parse(await stored(page, selectionKey)).packId).toBe('default');
  await capture(page, 'selection-save-failed.png');
  const other = await context.newPage();
  await other.goto('/jeopardy.html');
  await other.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await scoreClue(other);
  await expect(score(other)).toHaveText('$100');
  await expect(other.locator('#saveNotice')).toContainText('could not be saved');
  await capture(other, 'quota-failed.png');
  await other.goto('/__pack-control.html');
  await other.evaluate(() => localStorage.setItem('aiTraining.selection.v1', '{"schema":1,"packId":"gone"}'));
  await other.goto('/jeopardy.html');
  await expect(other.locator('#selectionNotice')).toContainText('Saved selection is invalid. Using Default.');
  expect(JSON.parse(await stored(other, selectionKey)).packId).toBe('gone');
  await select(other, 'default');
  expect(JSON.parse(await stored(other, selectionKey))).toEqual({ schema: 1, packId: 'default' });
  await page.goto('/roleplay.html');
  await expect(page.locator('#saveNotice')).toContainText('unavailable');
  await page.evaluate(() => { window.__storageMode = 'quota'; });
  await page.locator('#tGroup').click();
  await expect(page.locator('#saveNotice')).toContainText('Presenter preferences could not be saved');
});

test('Lane 9. Durable selection and board survive closing the browser profile and reopening it.', async ({ baseURL }, info) => {
  const profile = mkdtempSync(join(tmpdir(), 'cp2-profile-'));
  let context;
  const errors = [];
  async function launch() {
    const opened = await chromium.launchPersistentContext(profile, { baseURL, viewport: { width: 1440, height: 900 }, recordVideo: { dir: info.outputPath('durable-video') } });
    await fixtureRoutes(opened);
    opened.on('page', page => {
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => { if (request.url().startsWith(baseURL)) errors.push(request.url()); });
    });
    return opened;
  }
  try {
    context = await launch();
    const page = await context.newPage();
    await select(page, 'alternate');
    await page.locator('a[href="/jeopardy.html"]').click();
    await scoreClue(page);
    const durable = await stored(page, alternateKey);
    await page.close();
    await context.close();
    context = await launch();
    const reopened = await context.newPage();
    await reopened.goto('/jeopardy.html');
    await expect(score(reopened)).toHaveText('$100');
    await expect(reopened.locator('#selectionNotice')).toContainText('Current pack: Alternate fixture');
    await expect(reopened.locator('.tile[data-key="0-0"]')).toHaveClass(/used/);
    expect(await stored(reopened, alternateKey)).toBe(durable);
    expect(await stored(reopened)).toBeNull();
    await capture(reopened, 'durable-board.png');
    expect(errors).toEqual([]);
    if (evidence) writeFileSync(join(evidence, 'lane-9-browser.json'), JSON.stringify({ errors, browserRestarted: true }, null, 2));
  } finally {
    await context?.close();
    rmSync(profile, { recursive: true, force: true });
  }
});

test('Lane 10. Same-pack tabs remain last-write-wins without touching another pack.', async ({ page, context }) => {
  await seed(page, { [alternateKey]: envelope({ packId: 'alternate' }) });
  const untouched = await stored(page, alternateKey);
  await page.goto('/jeopardy.html');
  const other = await context.newPage();
  await other.goto('/jeopardy.html');
  await page.locator('#team0 .adj button').first().click();
  await page.locator('#team0 .adj button').first().click();
  await expect(score(page)).toHaveText('$200');
  await other.locator('#team0 .adj button').last().click();
  await expect(score(other)).toHaveText('-$100');
  await expect(score(page)).toHaveText('$200');
  expect(JSON.parse(await stored(page)).state.teams[0].score).toBe(-100);
  expect(await stored(page, alternateKey)).toBe(untouched);
  await page.reload();
  await expect(score(page)).toHaveText('-$100');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await capture(page, 'same-pack-limit.png');
});
