import { test as base, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import defaultPack from '../../prototype/seller-ai-training/packs/default.mjs';
import fsiPack from '../../prototype/seller-ai-training/packs/fsi.mjs';

const evidence = process.env.CP4_EVIDENCE_DIR;
const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const selectionKey = 'aiTraining.selection.v1';
const test = base.extend({
  context: async ({ context }, use, info) => {
    const errors = [];
    await context.route('https://fonts.googleapis.com/**', route => route.abort());
    await context.route('https://fonts.gstatic.com/**', route => route.abort());
    await context.addInitScript(() => {
      const set = Storage.prototype.setItem;
      window.__preferenceWrites = [];
      Storage.prototype.setItem = function(key, value) {
        set.call(this, key, value);
        if (key === 'aiTraining.selection.v1') window.__preferenceWrites.push(value);
      };
    });
    context.on('page', page => {
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error' && !/net::ERR_FAILED/.test(message.text())) errors.push(message.text()); });
      page.on('requestfailed', request => { if (request.url().startsWith('http://127.0.0.1:')) errors.push(`${request.url()} ${request.failure()?.errorText}`); });
      page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:') && response.status() >= 400) errors.push(`${response.url()} ${response.status()}`); });
    });
    await use(context);
    if (evidence) {
      mkdirSync(evidence, { recursive: true });
      writeFileSync(join(evidence, `lane-${info.title.match(/Lane (\d+)/)[1]}-browser.json`), JSON.stringify({ head, title: info.title, errors, status: info.status }, null, 2));
    }
    expect(errors, 'Browser errors and first-party failures').toEqual([]);
  }
});
test.use({ trace: 'on' });
async function capture(page, name) {
  if (evidence) { mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: join(evidence, name), fullPage: true }); }
}
const radio = (page, id) => page.locator(`input[value="${id}"]`);
const stored = (page, key = selectionKey) => page.evaluate(key => localStorage.getItem(key), key);
async function choose(page, id) {
  await radio(page, id).check();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('#saveStatus')).toContainText(`${id === 'fsi' ? 'FSI' : 'Default'} selected for both activities.`);
  await expect(page.locator('#saveSelection')).toBeDisabled();
}
async function settingsFromGame(page, selector = 'a[href="settings.html"]') {
  const [settings] = await Promise.all([page.waitForEvent('popup'), page.locator(selector).first().click()]);
  await settings.waitForLoadState();
  expect(await settings.evaluate(() => window.opener)).toBeNull();
  return settings;
}
async function homePack(page, pack) {
  await expect(page.locator('#currentPack')).toHaveText(`Current pack: ${pack.label}`);
  await expect(page.locator('#scenarioCount')).toHaveText(`${pack.roleplay.scenarios.length} personas`);
  await expect(page.locator('#clueCount')).toHaveText(`${pack.jeopardy.categories.reduce((n, category) => n + category.clues.length, 0)} clues + Final`);
  await expect(page.locator('.mini .h')).toHaveText(pack.jeopardy.categories.map(category => category.name));
  await expect(page.locator('#roleplaySummary')).toHaveText(pack.roleplay.scenarios.map(scenario => scenario.persona.industry).join(' · '));
  await expect(page.locator('#customerPreview')).toHaveText(pack.roleplay.scenarios[0].persona.quote);
  await expect(page.locator('#scenarioPreview')).toHaveText(pack.roleplay.scenarios[0].title);
  await expect(page.locator('#packNotice')).toHaveText(pack.disclaimer);
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
async function cancelRelaunch(page, button, message) {
  const dialogPromise = page.waitForEvent('dialog');
  const click = button.click();
  const dialog = await dialogPromise;
  expect(dialog.message()).toContain(message);
  await dialog.dismiss(); await click;
}

test('Lane 1. Fresh Settings shows Default, both scopes, and pack-derived counts.', async ({ page }) => {
  await page.goto('/index.html');
  await homePack(page, defaultPack);
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(page.locator('#scope')).toHaveText('Applies to role playing and Jeopardy.');
  await expect(page.getByRole('group', { name: 'Content pack' })).toBeVisible();
  await expect(radio(page, 'default')).toBeChecked();
  await expect(page.locator('#saveSelection')).toBeDisabled();
  for (const pack of [defaultPack, fsiPack]) {
    await expect(page.locator(`#description-${pack.id}`)).toHaveText(pack.description);
    await expect(page.locator(`#counts-${pack.id}`)).toHaveText(`${pack.roleplay.scenarios.length} scenarios · ${pack.jeopardy.categories.length} categories · ${pack.jeopardy.categories.reduce((n, category) => n + category.clues.length, 0)} clues + Final`);
  }
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await capture(page, 'settings-default.png');
});

test('Lane 2. One FSI save drives both game entries and Home previews.', async ({ page }) => {
  await page.goto('/settings.html');
  await radio(page, 'fsi').check();
  expect(await stored(page)).toBeNull();
  await page.locator('#saveSelection').click();
  await expect(page.locator('#saveStatus')).toHaveText('FSI selected for both activities. Open games keep their current pack.');
  expect(await page.evaluate(() => window.__preferenceWrites)).toEqual(['{"schema":1,"packId":"fsi"}']);
  await page.getByRole('link', { name: 'Return to Home' }).click();
  await homePack(page, fsiPack);
  await expect(page.locator('body')).not.toContainText('9,000 invoices');
  await page.locator('a[href="roleplay.html"]').click();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: FSI.');
  await expect(page.locator('.pcard')).toHaveCount(fsiPack.roleplay.scenarios.length);
  for (const scenario of fsiPack.roleplay.scenarios) await expect(page.locator(`#personas .pcard[data-id="${scenario.id}"]`)).toContainText(scenario.persona.name);
  await capture(page, 'fsi-roleplay.png');
  await page.locator('.brand').click();
  await page.locator('a[href="jeopardy.html"]').click();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: FSI.');
  await expect(page.locator('.cat')).toHaveText(fsiPack.jeopardy.categories.map(category => category.name));
  await capture(page, 'fsi-both.png');
});

test('Lane 3. Switching both ways restores each pack board and no neighboring scores.', async ({ page }) => {
  await page.goto('/jeopardy.html');
  await scoreClue(page);
  const original = await stored(page, 'aiDealJeopardy.v2.default.1');
  const settings = await settingsFromGame(page);
  await choose(settings, 'fsi');
  await expect(page.locator('#selectionNotice')).toContainText('FSI is selected');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('.app .openSelected').click();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: FSI.');
  await expect(page.locator('#team0 .score')).toHaveText('$0');
  await scoreClue(page);
  await page.locator('#team0 .adj button').first().click();
  const fsi = await stored(page, 'aiDealJeopardy.v2.fsi.1');
  expect(await stored(page, 'aiDealJeopardy.v2.default.1')).toBe(original);
  await choose(settings, 'default');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('.app .openSelected').click();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Default.');
  await expect(page.locator('#team0 .score')).toHaveText('$100');
  await expect(page.locator('.tile[data-key="0-0"]')).toHaveClass(/used/);
  await expect(page.locator('.cat')).toHaveText(defaultPack.jeopardy.categories.map(category => category.name));
  expect(await stored(page, 'aiDealJeopardy.v2.fsi.1')).toBe(fsi);
  await capture(page, 'default-return.png');
  await choose(settings, 'fsi');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('.app .openSelected').click();
  await expect(page.locator('#team0 .score')).toHaveText('$200');
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await homePack(page, fsiPack);
  await choose(settings, 'default');
  await homePack(page, defaultPack);
  await page.locator('a[href="roleplay.html"]').click();
  await expect(page.locator('.pcard').first()).toContainText(defaultPack.roleplay.scenarios[0].persona.name);
});

test('Lane 4. Draft, cancel, and Home navigation never persist an unsaved choice.', async ({ page }) => {
  await page.goto('/settings.html');
  await radio(page, 'fsi').check();
  await expect(page.locator('#saveSelection')).toBeEnabled();
  await expect(page.locator('#selectionStatus')).toHaveText('Current pack: Default.');
  expect(await stored(page)).toBeNull();
  expect(await page.evaluate(() => window.__preferenceWrites)).toEqual([]);
  await capture(page, 'settings-cancel.png');
  await page.getByRole('link', { name: 'Cancel', exact: true }).click();
  await homePack(page, defaultPack);
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await radio(page, 'fsi').check();
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await homePack(page, defaultPack);
  for (const activity of ['roleplay', 'jeopardy']) {
    await page.goto(`/${activity}.html`);
    await expect(page.locator('#selectionNotice')).toContainText('Current pack: Default.');
  }
  expect(await stored(page)).toBeNull();
});

test('Lane 5. Settings preserves typing and feedback; canceled relaunch keeps the exact meeting.', async ({ page }) => {
  await page.goto('/roleplay.html');
  await page.locator('.pcard[data-id="health"]').click();
  const settings = await settingsFromGame(page);
  await page.locator('#briefGo').click();
  await expect(page.locator('.typing')).toBeVisible();
  await choose(settings, 'fsi');
  await expect(page.locator('#selectionNotice')).toContainText('FSI is selected');
  await expect(page.locator('.choice')).toHaveCount(3);
  await expect(page.locator('.msg.cust')).toHaveCount(1);
  const thread = await page.locator('#thread').innerHTML();
  const choices = await page.locator('#dock').innerHTML();
  await cancelRelaunch(page, page.locator('#openSelected'), 'unfinished meeting');
  expect(await page.locator('#thread').innerHTML()).toBe(thread);
  expect(await page.locator('#dock').innerHTML()).toBe(choices);
  await page.locator('.choice.best').click();
  await expect(page.locator('.fb')).toBeVisible();
  const feedback = await page.locator('#dock').innerHTML();
  const score = await page.locator('#pts').textContent();
  await choose(settings, 'default');
  await choose(settings, 'fsi');
  await cancelRelaunch(page, page.locator('#openSelected'), 'conversation and scores');
  expect(await page.locator('#dock').innerHTML()).toBe(feedback);
  await expect(page.locator('#pts')).toHaveText(score);
  await capture(page, 'active-meeting.png');
  await page.locator('#bRestart').click();
  await expect(page.locator('.msg.cust')).toHaveCount(1);
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Default.');
  await expect(page.locator('.choice')).toHaveCount(3);
  await page.locator('.choice.best').click();
  const beforeConfirm = await page.locator('#thread').innerHTML();
  const dialogPromise = page.waitForEvent('dialog');
  const click = page.locator('#openSelected').click();
  const dialog = await dialogPromise;
  await choose(settings, 'default');
  await dialog.accept(); await click;
  expect(await page.locator('#thread').innerHTML()).toBe(beforeConfirm);
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Default.');
  await choose(settings, 'fsi');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#openSelected').click();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: FSI.');
  await expect(page.locator('#sPick')).toHaveClass(/show/);
});

test('Lane 6. Clue and Final survive Settings; relaunch warns about stages and unsaved progress.', async ({ page }) => {
  await page.goto('/jeopardy.html');
  await page.locator('#team0 .adj button').first().click();
  await page.locator('#timerBtn').click();
  await page.locator('.tile[data-key="0-0"]').click();
  await expect(page.locator('#flipper')).toHaveClass(/flipped/);
  const clue = await page.locator('#clueText').textContent();
  const settings = await settingsFromGame(page, '#overlay a[href="settings.html"]');
  await choose(settings, 'fsi');
  await expect(page.locator('#clueText')).toHaveText(clue);
  await expect(page.locator('#timerBar')).toHaveClass(/show/);
  await cancelRelaunch(page, page.locator('#overlay .openSelected'), 'Only saved board progress persists');
  await expect(page.locator('#clueText')).toHaveText(clue);
  await page.locator('#closeClue').click();
  await expect(page.locator('#overlay')).not.toHaveClass(/show/);
  await page.keyboard.press('f');
  await page.locator('.fw input').first().fill('50');
  const finalSettings = await settingsFromGame(page, '#final a[href="settings.html"]');
  await choose(finalSettings, 'default');
  await choose(finalSettings, 'fsi');
  await expect(page.locator('.fw input').first()).toHaveValue('50');
  await cancelRelaunch(page, page.locator('#final .openSelected'), 'Final stage will be lost');
  await expect(page.locator('.fw input').first()).toHaveValue('50');
  await page.locator('#fNext').click();
  await expect(page.locator('.fclue')).toHaveText(defaultPack.jeopardy.final.q);
  await choose(settings, 'default');
  await choose(settings, 'fsi');
  await expect(page.locator('.fclue')).toHaveText(defaultPack.jeopardy.final.q);
  await cancelRelaunch(page, page.locator('#final .openSelected'), 'Unsaved changes');
  await capture(page, 'active-final.png');
  const dialogPromise = page.waitForEvent('dialog');
  const click = page.locator('#final .openSelected').click();
  const dialog = await dialogPromise;
  await choose(settings, 'default');
  await dialog.accept(); await click;
  await expect(page.locator('.fclue')).toHaveText(defaultPack.jeopardy.final.q);
  await expect(page.locator('#final .openSelected')).toBeHidden();
  await choose(settings, 'fsi');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#final .openSelected').click();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: FSI.');
  await expect(page.locator('#final')).not.toHaveClass(/show/);
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.locator('#team0 .adj button').first().click();
  await expect(page.locator('#saveNotice')).toContainText('could not be saved');
  await choose(settings, 'default');
  await cancelRelaunch(page, page.locator('.app .openSelected'), 'Unsaved changes');
  await expect(page.locator('#team0 .score')).toHaveText('$100');
  await capture(page, 'unsaved-relaunch.png');
});

test('Lane 7. Two tabs, focus, and history reconcile previews without discarding a dirty draft.', async ({ page, context }) => {
  await page.goto('/index.html');
  const settings = await context.newPage();
  await settings.goto('/settings.html');
  await choose(settings, 'fsi');
  await homePack(page, fsiPack);
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await radio(page, 'default').check();
  await choose(settings, 'default');
  await expect(radio(page, 'default')).toBeChecked();
  await expect(page.locator('#saveSelection')).toBeDisabled();
  await choose(settings, 'fsi');
  await expect(radio(page, 'default')).toBeChecked();
  await expect(page.locator('#saveSelection')).toBeEnabled();
  await expect(page.locator('#saveStatus')).toContainText('Your unsaved choice is kept');
  await page.bringToFront();
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(radio(page, 'default')).toBeChecked();
  await page.goBack();
  await homePack(page, fsiPack);
  await page.goForward();
  await expect(page.locator('#selectionStatus')).toHaveText('Current pack: FSI.');
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await page.locator('a[href="roleplay.html"]').click();
  await choose(settings, 'default');
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: FSI.');
  await expect(page.locator('#selectionNotice')).toContainText('Default is selected');
  await capture(page, 'settings-history.png');
  await page.locator('.brand').click();
  await homePack(page, defaultPack);
  await page.goBack();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack:');
  await page.goForward();
  await homePack(page, defaultPack);
});

test('Lane 8. Native keyboard controls show focus and game navigation never consumes Enter or Space.', async ({ page }) => {
  await page.goto('/index.html');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Settings', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(radio(page, 'default')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(radio(page, 'fsi')).toBeChecked();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await expect(page.locator('#saveSelection')).toBeFocused();
  expect(await page.locator('#saveSelection').evaluate(node => getComputedStyle(node).outlineStyle)).toBe('solid');
  await capture(page, 'settings-keyboard.png');
  await page.keyboard.press('Enter');
  await expect(page.locator('#saveStatus')).toContainText('FSI selected');
  await page.keyboard.press('Shift+Tab');
  await expect(radio(page, 'fsi')).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(page.locator('#saveStatus')).toContainText('Default selected');
  await page.goto('/roleplay.html');
  await page.locator('.pcard[data-id="health"]').click();
  await page.locator('#briefGo').click();
  await expect(page.locator('.choice')).toHaveCount(3);
  await page.locator('.choice.best').click();
  const feedback = await page.locator('#dock').innerHTML();
  await page.locator('a[href="settings.html"]').focus();
  await page.keyboard.press('Space');
  expect(await page.locator('#dock').innerHTML()).toBe(feedback);
  const popup = page.waitForEvent('popup');
  await page.keyboard.press('Enter');
  const settings = await popup;
  await expect(settings.getByRole('heading', { name: 'Settings' })).toBeVisible();
  expect(await page.locator('#dock').innerHTML()).toBe(feedback);
  await choose(settings, 'fsi');
  await page.locator('#openSelected').focus();
  page.once('dialog', dialog => dialog.dismiss());
  await page.keyboard.press('Space');
  expect(await page.locator('#dock').innerHTML()).toBe(feedback);
});

test('Lane 9. Blocked reads, failed writes, uncertain confirmation, and invalid IDs have truthful recovery.', async ({ page, context }) => {
  await page.addInitScript(() => {
    const get = Storage.prototype.getItem;
    const set = Storage.prototype.setItem;
    window.__storageMode = 'read';
    Storage.prototype.getItem = function(key) { if (window.__storageMode === 'read') throw new DOMException('Denied', 'SecurityError'); return get.call(this, key); };
    Storage.prototype.setItem = function(key, value) {
      if (window.__storageMode === 'quota') throw new DOMException('Full', 'QuotaExceededError');
      set.call(this, key, value);
      if (window.__storageMode === 'confirmation') window.__storageMode = 'read';
    };
  });
  await page.goto('/settings.html');
  await expect(page.locator('#saveSelection')).toBeEnabled();
  await expect(page.locator('#selectionStatus')).toContainText('Cannot read');
  await radio(page, 'fsi').check();
  await page.locator('#saveSelection').click();
  await expect(page.locator('#saveStatus')).toContainText('Settings could not be saved. Selection unchanged.');
  expect(await page.evaluate(() => window.__preferenceWrites)).toEqual([]);
  const other = await context.newPage();
  await other.goto('/settings.html');
  expect(await stored(other)).toBeNull();
  await page.evaluate(() => { window.__storageMode = 'quota'; });
  await page.locator('#saveSelection').click();
  await expect(page.locator('#saveStatus')).toContainText('Selection unchanged');
  expect(await stored(other)).toBeNull();
  await page.evaluate(() => { window.__storageMode = 'confirmation'; });
  await page.locator('#saveSelection').click();
  await expect(page.locator('#saveStatus')).toContainText('confirmation is unavailable');
  await expect(page.locator('#saveStatus')).not.toContainText('Selection unchanged');
  expect(JSON.parse(await stored(other))).toEqual({ schema: 1, packId: 'fsi' });
  await page.evaluate(() => { window.__storageMode = ''; localStorage.setItem('aiTraining.selection.v1', '{"schema":1,"packId":"unknown"}'); });
  await other.reload();
  await expect(radio(other, 'default')).toBeChecked();
  await expect(other.locator('#selectionStatus')).toContainText('Saved selection is invalid');
  await expect(other.locator('#saveSelection')).toBeEnabled();
  await other.locator('#saveSelection').click();
  await expect(other.locator('#saveStatus')).toContainText('Default selected for both activities');
  expect(await other.evaluate(() => window.__preferenceWrites)).toEqual(['{"schema":1,"packId":"default"}']);
  expect(JSON.parse(await stored(other))).toEqual({ schema: 1, packId: 'default' });
  await capture(other, 'settings-errors.png');
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(radio(page, 'fsi')).toBeChecked();
  await page.locator('#saveSelection').click();
  await expect(page.locator('#saveStatus')).toContainText('FSI selected for both activities');
});

test('Lane 10. Settings stays readable at both desktop sizes, 200 percent zoom, and reduced motion.', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const viewport of [{ width: 1100, height: 800 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/settings.html');
    await radio(page, 'fsi').check();
    for (const zoom of [1, 2]) {
      await page.evaluate(zoom => { document.documentElement.style.zoom = String(zoom); }, zoom);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      for (const selector of ['input[value="default"]', 'input[value="fsi"]', '#saveSelection', '#returnHome']) {
        const control = page.locator(selector);
        await control.scrollIntoViewIfNeeded();
        await expect(control).toBeInViewport();
        const box = await control.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
      }
      for (const selector of ['.option', '#saveStatus', '#selectionStatus']) {
        expect(await page.locator(selector).evaluateAll(nodes => nodes.every(node => node.scrollWidth <= node.clientWidth))).toBe(true);
      }
      await capture(page, `settings-layout-${viewport.width}-${zoom * 100}.png`);
    }
    await page.locator('#saveSelection').scrollIntoViewIfNeeded();
    await page.locator('#saveSelection').click();
    await expect(page.locator('#saveStatus')).toContainText('FSI selected');
    await choose(page, 'default');
  }
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });
  await capture(page, 'settings-layout.png');
});
