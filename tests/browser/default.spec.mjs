import { test as base, expect } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const fixture = JSON.parse(readFileSync(new URL('../fixtures/default-original.json', import.meta.url), 'utf8'));
const evidence = process.env.CP1_EVIDENCE_DIR;
const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://fonts.gstatic.com/**', route => route.abort());
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && !/net::ERR_FAILED/.test(message.text())) errors.push(message.text()); });
    page.on('requestfailed', request => { if (request.url().startsWith('http://127.0.0.1:')) errors.push(`${request.url()} ${request.failure()?.errorText}`); });
    page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:') && response.status() >= 400) errors.push(`${response.url()} ${response.status()}`); });
    await use(page);
    expect(errors, 'Browser errors and failed first-party requests.').toEqual([]);
  }
});

async function screenshot(page, name) {
  if (evidence) { mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: join(evidence, name), fullPage: true }); }
}

const normalized = text => text.replace(/Your Company/gi, 'CDW');

async function meeting(page, id, recovery = false) {
  const scenario = fixture.roleplay.scenarios.find(item => item.id === id);
  await page.goto('/roleplay.html');
  await page.locator(`.pcard[data-id="${id}"]`).click();
  await page.locator('#briefGo').click();
  const trace = [];
  let nodeId = scenario.start;
  while (nodeId !== 'end') {
    const node = scenario.nodes[nodeId];
    const choice = recovery && nodeId === scenario.start ? node.ch[1] : node.ch.find(item => item.q === 'best');
    await expect(page.locator('.choice')).toHaveCount(node.ch.length);
    await expect(page.locator(`.msg.cust[data-node="${nodeId}"]`)).toBeVisible();
    const choices = await page.locator('.choice .txt').allTextContents();
    expect([...choices].sort()).toEqual(node.ch.map(item => item.t).sort());
    const pos = choices.indexOf(choice.t);
    await page.keyboard.press(`Digit${pos + 1}`);
    await expect(page.locator('.fb p')).toHaveText(choice.fb);
    trace.push({ nodeId, choices, feedback: normalized(await page.locator('.fb').innerText()), dimensions: await page.locator('#dims').innerText(), points: await page.locator('#pts').innerText() });
    await page.keyboard.press('Enter');
    nodeId = choice.next;
  }
  await expect(page.locator('#sDeb')).toHaveClass(/show/);
  const turns = recovery ? 8 : scenario.turns;
  expect(trace).toHaveLength(turns);
  await expect(page.locator('.prow')).toHaveCount(turns);
  await expect(page.locator('.stats .stat').nth(1).locator('b')).toHaveText(`${recovery ? 7 : turns}/${turns}`);
  for (const takeaway of scenario.takeaways) await expect(page.locator('.list.tk')).toContainText(takeaway);
  const expected = {
    cfo: { score: '83', points: '700', signals: '0/12', dimensions: [100, 100, 93, 95, 100], outcome: 'great' },
    'cfo-recovery': { score: '75', points: '720', signals: '0/13', dimensions: [87, 85, 93, 94, 85], outcome: 'ok' },
    cio: { score: '83', points: '700', signals: '0/10', dimensions: [97, 100, 97, 94, 100], outcome: 'great' },
    health: { score: '76', points: '400', signals: '0/7', dimensions: [90, 100, 70, 100, 85], outcome: 'ok' },
    cmo: { score: '75', points: '400', signals: '0/5', dimensions: [80, 95, 88, 100, 80], outcome: 'ok' }
  }[recovery ? `${id}-recovery` : id];
  await expect(page.locator('.ring .c b')).toHaveText(expected.score);
  await expect(page.locator('.stats .stat').nth(0).locator('b')).toHaveText(expected.points);
  await expect(page.locator('.stats .stat').nth(2).locator('b')).toHaveText(expected.signals);
  await expect(page.locator('.hero h2')).toHaveText(scenario.outcomes[expected.outcome].title);
  await expect(page.locator('.hero p')).toHaveText(scenario.outcomes[expected.outcome].text);
  await expect(page.locator('.radarwrap text').filter({ hasText: /^\d+$/ })).toHaveText(expected.dimensions.map(String));
  const debrief = normalized(await page.locator('#debrief').innerText());
  return { trace, debrief };
}

async function baselineMeeting(browser, candidate, id, recovery = false) {
  if (!process.env.CP1_BASELINE_URL) return;
  const context = await browser.newContext({ baseURL: process.env.CP1_BASELINE_URL, viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://fonts.gstatic.com/**', route => route.abort());
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const baseline = await meeting(page, id, recovery);
    expect(errors).toEqual([]);
    expect(candidate).toEqual(baseline);
    if (evidence) {
      writeFileSync(join(evidence, `${id}${recovery ? '-recovery' : ''}-trace.json`), JSON.stringify({ baseline, candidate, equal: true, baselinePageErrors: errors }, null, 2));
      await screenshot(page, `baseline-${id}${recovery ? '-recovery' : ''}.png`);
    }
  } finally { await context.close(); }
}

async function board(page) {
  await page.goto('/jeopardy.html');
  await expect(page.locator('.tile')).toHaveCount(30);
  await page.locator('#soundBtn').click();
}

async function openTile(page, key) {
  await page.locator(`.tile[data-key="${key}"]`).click();
  await expect(page.locator('#flipper')).toHaveClass(/flipped/);
}

async function closeTile(page) {
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).not.toHaveClass(/show/);
}

async function storedBoard(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('aiDealJeopardy.v2.default.1')).state);
}

const score = (page, index) => page.locator(`#team${index} .score`);

test('Lane 1. Home links and all 3 pages show CDW.', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('CDW · AI Seller Academy');
  await expect(page.locator('#packNotice')).toHaveText("Fictional training scenarios. Default's illustrative offers are not a verified CDW catalog.");
  await screenshot(page, 'cdw-home.png');
  await page.locator('a.card.j').click();
  await expect(page).toHaveTitle('AI Deal Jeopardy · CDW');
  await expect(page.locator('.brandInline')).toHaveText('CDW');
  await expect(page.locator('.tile')).toHaveCount(30);
  await page.goBack();
  await page.locator('a.card.r').click();
  await expect(page).toHaveTitle('Customer Role-Play Simulator · CDW');
  await expect(page.locator('.brandInline')).toHaveText('CDW');
  expect(await page.locator('body').innerText()).not.toContain('Your Company');
});

test('Lane 2. Picker and all 4 briefs preserve customer identities.', async ({ page }) => {
  await page.goto('/roleplay.html');
  await expect(page.locator('.pcard')).toHaveCount(4);
  await screenshot(page, 'default-personas.png');
  for (const scenario of fixture.roleplay.scenarios) {
    await page.locator(`.pcard[data-id="${scenario.id}"]`).click();
    await expect(page.locator('.idcard h2')).toHaveText(scenario.persona.name);
    for (const value of [scenario.persona.company, scenario.persona.industry, scenario.persona.size]) await expect(page.locator('.idcard')).toContainText(value);
    await expect(page.locator('.mission p')).toHaveText(scenario.mission);
    await page.locator('#peek').click();
    await expect(page.locator('#pains')).toHaveClass(/peek/);
    for (const pain of scenario.persona.pains) await expect(page.locator('#pains')).toContainText(pain);
    await screenshot(page, `brief-${scenario.id}.png`);
    await page.locator('#briefBack').click();
  }
  await page.setViewportSize({ width: 1920, height: 1080 });
  await screenshot(page, 'default-personas-1920.png');
});

test('Lane 3. CFO ideal coaching, scores, seeded choices, and outcome match baseline.', async ({ page, browser }) => {
  const trace = await meeting(page, 'cfo');
  await screenshot(page, 'cfo-debrief.png');
  await baselineMeeting(browser, trace, 'cfo');
});

test('Lane 4. CFO recovery terminates after 8 choices and matches baseline.', async ({ page, browser }) => {
  const trace = await meeting(page, 'cfo', true);
  await screenshot(page, 'cfo-recovery.png');
  await baselineMeeting(browser, trace, 'cfo', true);
});

test('Lane 5. CIO 7-choice route and seeded choices match baseline.', async ({ page, browser }) => {
  const trace = await meeting(page, 'cio');
  await screenshot(page, 'cio-debrief.png');
  await baselineMeeting(browser, trace, 'cio');
});

test('Lane 6. Both 4-choice quick plays reach their original debriefs.', async ({ page, browser }) => {
  for (const id of ['health', 'cmo']) {
    const trace = await meeting(page, id);
    await screenshot(page, `quick-${id}-debrief.png`);
    await baselineMeeting(browser, trace, id);
  }
  await screenshot(page, 'quick-debrief.png');
});

test('Lane 7. Voting, signal spotting, ideal controls, and saved preferences work.', async ({ page }) => {
  await page.goto('/roleplay.html');
  await page.locator('#tGroup').click();
  await page.locator('.pcard[data-id="cfo"]').click();
  await page.locator('#briefGo').click();
  await expect(page.locator('.choice')).toHaveCount(4);
  await page.locator('#tIdeal').click();
  await expect(page.locator('.choice.best .ideal')).toBeVisible();
  const signal = page.locator('.seg[data-sig]').first();
  await signal.click();
  await expect(page.locator('#sigFound')).toHaveText('1');
  await expect(page.locator('#pts')).toHaveText('25pts');
  await signal.click();
  await expect(page.locator('#pts')).toHaveText('25pts');
  const plain = page.locator('.seg[data-plain]').first();
  await plain.click();
  await plain.click();
  await expect(page.locator('#pts')).toHaveText('20pts');
  await page.locator('#tSpot').click();
  await expect(page.locator('body')).not.toHaveClass(/spot/);
  const best = page.locator('.choice.best');
  const position = Number(await best.getAttribute('data-pos'));
  const letter = 'abcd'[position];
  await page.keyboard.press(letter);
  await page.keyboard.press(letter);
  await page.keyboard.press(`Shift+${letter}`);
  await expect(best.locator('.votes b')).toHaveText('1');
  await best.locator('.vp').click();
  await best.locator('.vm').click();
  await expect(best.locator('.votes b')).toHaveText('1');
  await page.locator('#vReset').click();
  await expect(best.locator('.votes b')).toHaveText('0');
  await best.locator('.vp').click();
  await screenshot(page, 'group-vote.png');
  await page.keyboard.press('l');
  await expect(page.locator('.fbroom')).toContainText('1 of 1 votes');
  await expect(page.locator('#pts')).toHaveText('120pts');
  await page.reload();
  await expect(page.locator('#tGroup')).toHaveClass(/on/);
  const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('aiRoleplay.prefs.v1')));
  expect(prefs).toEqual({ group: true, spot: false, ideal: true });
  await page.locator('.pcard[data-id="cfo"]').click();
  await page.locator('#briefGo').click();
  await expect(page.locator('.choice.best .ideal')).toBeVisible();
  await expect(page.locator('#sigFound')).toHaveText('0');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await screenshot(page, 'group-vote-1920.png');
});

test('Lane 8. Jeopardy reveal, timer, judging, and undo retain original behavior.', async ({ page }) => {
  await board(page);
  await page.locator('#timerSecs').selectOption('15');
  await page.locator('#timerBtn').click();
  await openTile(page, '0-0');
  await expect(page.locator('#clueText')).toHaveText(fixture.jeopardy.categories[0].clues[0].q);
  await expect(page.locator('#timerNum')).toHaveText(/1[0-5]/);
  await page.keyboard.press('Space');
  await expect(page.locator('#answerText')).toHaveText(fixture.jeopardy.categories[0].clues[0].a);
  await expect(page.locator('#whyText')).toHaveText(fixture.jeopardy.categories[0].clues[0].why);
  await expect(page.locator('#timerBar')).not.toHaveClass(/show/);
  await page.locator('#judge .jt').nth(0).locator('.no').click();
  await expect(score(page, 0)).toHaveText('-$100');
  await page.keyboard.press('Digit2');
  await expect(score(page, 1)).toHaveText('$100');
  await screenshot(page, 'default-clue.png');
  await closeTile(page);
  await expect(page.locator('.tile[data-key="0-0"]')).toHaveClass(/used/);
  await page.keyboard.press('u');
  await expect(score(page, 1)).toHaveText('$0');
  await page.locator('#undoBtn').click();
  await expect(score(page, 0)).toHaveText('$0');
});

test('Lane 9. Both Daily Doubles, Final wagers, scoring, and reset work.', async ({ page }) => {
  await board(page);
  await openTile(page, '0-0');
  await closeTile(page);
  const state = await storedBoard(page);
  expect(state.dd).toHaveLength(2);
  expect(new Set(state.dd).size).toBe(2);
  expect(state.dd.every(key => !key.endsWith('-0'))).toBe(true);
  for (const [index, key] of state.dd.entries()) {
    const wager = index ? 75 : 125;
    await openTile(page, key);
    await expect(page.locator('#ddPane')).toHaveClass(/show/);
    await page.locator('#ddTeams .tp').nth(index).click();
    await page.locator('#ddWager').fill(String(wager));
    await page.locator('#ddGo').click();
    await expect(page.locator('#clueVal')).toHaveText(`Wager $${wager}`);
    await page.locator('#revealBtn').click();
    const [category, row] = key.split('-').map(Number);
    await expect(page.locator('#answerText')).toHaveText(normalized(fixture.jeopardy.categories[category].clues[row].a));
    await expect(page.locator('#whyText')).toHaveText(normalized(fixture.jeopardy.categories[category].clues[row].why));
    await page.locator(index ? '#judge .no' : '#judge .ok').click();
    await expect(score(page, index)).toHaveText(index ? '-$75' : '$125');
    await closeTile(page);
  }
  await page.locator('#team1 .adj button').first().click();
  await page.locator('#team2 .adj button').first().click();
  await page.keyboard.press('f');
  await expect(page.locator('.fcat')).toHaveText(fixture.jeopardy.final.category);
  await page.locator('.fw input').nth(0).fill('50');
  await page.locator('.fw input').nth(1).fill('25');
  await page.locator('.fw input').nth(2).fill('100');
  await page.locator('#fNext').click();
  await expect(page.locator('.fclue')).toHaveText(normalized(fixture.jeopardy.final.q));
  await page.keyboard.press('Space');
  await expect(page.locator('#final .answer .a')).toHaveText(fixture.jeopardy.final.a);
  await page.locator('.fw .ok').nth(0).click();
  await page.locator('.fw .no').nth(1).click();
  await page.locator('.fw .ok').nth(2).click();
  await screenshot(page, 'default-final.png');
  await page.locator('#fNext').click();
  await expect(page.locator('.pod .sc')).toHaveText(['$175', '$200', '$0']);
  await page.locator('#fNew').click();
  await expect(page.locator('.tile.used')).toHaveCount(0);
  await expect(page.locator('.team .score')).toHaveText(['$0', '$0', '$0']);
  await page.locator('#undoBtn').click();
  await expect(page.locator('#toast')).toHaveText('Nothing to undo');
});

test('Lane 10. Scored board reloads and restart rejects stale typing.', async ({ page }) => {
  await board(page);
  await page.locator('#team0 .name').fill('Discovery team');
  await page.locator('#team0 .name').press('Enter');
  await openTile(page, '0-0');
  await page.keyboard.press('Space');
  await page.keyboard.press('Digit1');
  await closeTile(page);
  const before = await storedBoard(page);
  await page.reload();
  await expect(score(page, 0)).toHaveText('$100');
  await expect(page.locator('#team0 .name')).toHaveText('Discovery team');
  await expect(page.locator('.tile[data-key="0-0"]')).toHaveClass(/used/);
  expect(await storedBoard(page)).toEqual(before);
  await screenshot(page, 'reload-board.png');
  await page.goto('/roleplay.html');
  await page.locator('.pcard[data-id="cfo"]').click();
  await page.locator('#briefGo').click();
  await page.locator('#bRestart').click();
  await expect(page.locator('.choice')).toHaveCount(4);
  await page.waitForTimeout(1000);
  await expect(page.locator('.msg.cust[data-node="c1"]')).toHaveCount(1);
  await expect(page.locator('#pts')).toHaveText('0pts');
  await page.locator('#bRestart').click();
  await page.locator('#bExit').click();
  await page.locator('.pcard[data-id="health"]').click();
  await page.locator('#briefGo').click();
  await expect(page.locator('.choice')).toHaveCount(3);
  await page.waitForTimeout(1000);
  await expect(page.locator('.msg.cust')).toHaveCount(1);
  await expect(page.locator('.msg.cust[data-node="c1"]')).toHaveCount(0);
  await expect(page.locator('.msg.cust[data-node="h1"]')).toHaveCount(1);
  await screenshot(page, 'stale-typing.png');
  await page.reload();
  await expect(page.locator('#sPick')).toHaveClass(/show/);
});
