import { test as base, expect } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import fsi from '../../prototype/seller-ai-training/packs/fsi.mjs';

const original = JSON.parse(readFileSync(new URL('../fixtures/default-original.json', import.meta.url), 'utf8'));
const evidence = process.env.CP3_EVIDENCE_DIR;
const selectionKey = 'aiTraining.selection.v1';
const boardKey = 'aiDealJeopardy.v2.fsi.1';
const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const test = base.extend({
  context: async ({ context }, use, info) => {
    const errors = [];
    const events = [];
    await context.route('https://fonts.googleapis.com/**', route => route.abort());
    await context.route('https://fonts.gstatic.com/**', route => route.abort());
    await context.addInitScript(() => {
      if (location.protocol !== 'http:') return;
      if (!sessionStorage.getItem('cp3-setup')) {
        localStorage.setItem('aiTraining.selection.v1', '{"schema":1,"packId":"fsi"}');
        localStorage.setItem('aiRoleplay.prefs.v1', '{"group":false,"spot":true,"ideal":false}');
        sessionStorage.setItem('cp3-setup', '1');
      }
    });
    context.on('page', page => {
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { events.push(message.text()); if (message.type() === 'error' && !/net::ERR_FAILED/.test(message.text())) errors.push(message.text()); });
      page.on('requestfailed', request => { if (request.url().startsWith('http://127.0.0.1:')) errors.push(`${request.url()} ${request.failure()?.errorText}`); });
      page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:') && response.status() >= 400) errors.push(`${response.url()} ${response.status()}`); });
    });
    await use(context);
    if (evidence) {
      mkdirSync(evidence, { recursive: true });
      writeFileSync(join(evidence, `lane-${info.title.match(/Lane (\d+)/)[1]}-browser.json`), JSON.stringify({ head, title: info.title, errors, events, status: info.status }, null, 2));
    }
    expect(errors, 'Browser errors and first-party request failures.').toEqual([]);
  }
});
test.use({ trace: 'on' });

async function capture(page, name) {
  if (evidence) { mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: join(evidence, name), fullPage: true, animations: 'disabled' }); }
}
function record(name, value) {
  if (evidence) { mkdirSync(evidence, { recursive: true }); writeFileSync(join(evidence, name), JSON.stringify({ head, ...value }, null, 2)); }
}
async function startMeeting(page, scenario) {
  await page.goto('/roleplay.html');
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Financial services');
  await expect(page.locator('.pcard')).toHaveCount(4);
  await page.locator(`.pcard[data-id="${scenario.id}"]`).click();
  await expect(page.locator('.idcard h2')).toHaveText(scenario.persona.name);
  await expect(page.locator('.mission p')).toHaveText(scenario.mission);
  await page.locator('#briefGo').click();
}
async function respond(page, nodeId, node, choice, turn, nominal) {
  await expect(page.locator('.choice')).toHaveCount(node.ch.length);
  await expect(page.locator(`.msg.cust[data-node="${nodeId}"]`)).toBeVisible();
  await expect(page.locator('#turnLbl')).toHaveText(`Turn ${turn} of ${nominal}`);
  const texts = await page.locator('.choice .txt').allTextContents();
  expect([...texts].sort()).toEqual(node.ch.map(choice => choice.t).sort());
  const position = texts.indexOf(choice.t);
  if (turn % 2) await page.keyboard.press(`Digit${position + 1}`);
  else await page.locator('.choice').nth(position).click();
  await expect(page.locator('.fb p')).toHaveText(choice.fb);
  if (choice.q !== 'best') await expect(page.locator('.better')).toContainText(node.ch.find(choice => choice.q === 'best').t);
  await page.keyboard.press('Enter');
  return { nodeId, quality: choice.q, response: choice.t, coaching: choice.fb };
}
async function meeting(page, id, route = 'ideal') {
  const scenario = fsi.roleplay.scenarios.find(scenario => scenario.id === id);
  await startMeeting(page, scenario);
  const trace = [];
  let nodeId = scenario.start;
  while (nodeId !== 'end') {
    const node = scenario.nodes[nodeId];
    const quality = route === 'risk' || route === 'recovery' && nodeId === scenario.start ? 'bad' : 'best';
    const choice = node.ch.find(choice => choice.q === quality);
    trace.push(await respond(page, nodeId, node, choice, trace.length + 1, scenario.turns));
    nodeId = choice.next;
  }
  await expect(page.locator('#sDeb')).toHaveClass(/show/);
  await expect(page.locator('.prow')).toHaveCount(scenario.turns);
  const outcome = route === 'ideal' ? 'great' : route === 'risk' ? 'poor' : 'ok';
  await expect(page.locator('.hero h2')).toHaveText(scenario.outcomes[outcome].title);
  await expect(page.locator('.hero p')).toHaveText(scenario.outcomes[outcome].text);
  for (const takeaway of scenario.takeaways) await expect(page.locator('.list.tk')).toContainText(takeaway);
  for (const step of scenario.offering.steps) await expect(page.locator('#debrief')).toContainText(step);
  record(`${id}-${route}-trace.json`, { trace, debrief: await page.locator('#debrief').innerText(), turns: trace.length });
  return trace;
}
async function board(page) {
  await page.goto('/jeopardy.html');
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Financial services');
  await expect(page.locator('.tile')).toHaveCount(30);
  await page.locator('#soundBtn').click();
}
async function stored(page, key = boardKey) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
}
async function openTile(page, category, row, wager = 100, team = 0) {
  await page.locator(`.tile[data-key="${category}-${row}"]`).click();
  await expect(page.locator('#flipper')).toHaveClass(/flipped/);
  if (await page.locator('#ddPane').isVisible()) {
    await page.locator('#ddTeams .tp').nth(team).click();
    await page.locator('#ddWager').fill(String(wager));
    await page.locator('#ddGo').click();
    await expect(page.locator('#clueVal')).toHaveText(`Wager $${wager}`);
  }
  const clue = fsi.jeopardy.categories[category].clues[row];
  await expect(page.locator('#clueText')).toHaveText(clue.q);
  await page.keyboard.press('Space');
  await expect(page.locator('#answerText')).toHaveText(clue.a);
  await expect(page.locator('#whyText')).toHaveText(clue.why);
}
async function closeTile(page) {
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).not.toHaveClass(/show/);
}
async function textMetrics(page, selector) {
  return page.locator(selector).evaluate(async element => {
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      await Promise.all(ancestor.getAnimations().map(animation => animation.finished.catch(() => {})));
    }
    const range = document.createRange();
    range.selectNodeContents(element);
    const lines = [...range.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0);
    const style = getComputedStyle(element);
    return { selector: element.id || element.className, text: element.textContent, words: element.textContent.trim().split(/\s+/).length,
      lines: new Set(lines.map(rect => Math.round(rect.top))).size,
      textHeight: range.getBoundingClientRect().height, elementHeight: element.getBoundingClientRect().height,
      fontSize: Number.parseFloat(style.fontSize), lineHeight: Number.parseFloat(style.lineHeight) };
  });
}
function expectTextBudget(metrics, maxLines, fontSize) {
  const detail = JSON.stringify(metrics);
  expect(metrics.lines, detail).toBeLessThanOrEqual(maxLines);
  expect(metrics.elementHeight, detail).toBeLessThanOrEqual(maxLines * metrics.lineHeight + 1);
  expect(metrics.fontSize, 'Readability must not come from shrinking text.').toBeCloseTo(fontSize, 2);
}
async function readable(page, selectors) {
  for (const selector of selectors) {
    const metrics = await page.locator(selector).evaluate(element => {
      const box = element.getBoundingClientRect();
      return { selector: element.id || element.className, text: element.textContent, top: box.top, bottom: box.bottom, left: box.left, right: box.right,
        width: innerWidth, height: innerHeight, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth };
    });
    expect(metrics.top, JSON.stringify(metrics)).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.height);
    expect(metrics.left, JSON.stringify(metrics)).toBeGreaterThanOrEqual(0);
    expect(metrics.right, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.width);
    expect(metrics.scrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.clientWidth + 1);
  }
}
async function clues(page, categories, lane) {
  const seen = [];
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    await board(page);
    for (const category of categories) {
      for (let row = 0; row < 5; row++) {
        await openTile(page, category, row);
        await readable(page, ['#clueText', '#answerText', '#whyText', '#judge']);
        const answer = await textMetrics(page, '#answerText');
        const explanation = await textMetrics(page, '#whyText');
        seen.push({ viewport, category, row, answer, explanation });
        record(`lane-${lane}-answers.json`, { seen });
        expectTextBudget(answer, 3, viewport.width === 1440 ? 33.12 : 40);
        expectTextBudget(explanation, 3, viewport.width === 1440 ? 18 : 21);
        if (category === 2 && row === 4) await capture(page, `fsi-worst-regular-${viewport.width}.png`);
        if (row === 4 && category === categories[1]) await capture(page, `fsi-clues-${categories[0] + 1}-${categories[1] + 1}${viewport.width === 1920 ? '-1920' : ''}.png`);
        await closeTile(page);
      }
    }
    if (viewport.width === 1440) {
      page.once('dialog', dialog => dialog.accept());
      await page.locator('#resetBtn').click();
      await expect(page.locator('.tile.used')).toHaveCount(0);
    }
  }
  record(`lane-${lane}-answers.json`, { seen });
}

test('Lane 1. Bank ideal ends with qualified stakeholders and a concrete next step.', async ({ page }) => {
  await meeting(page, 'fsi-bank');
  for (const phrase of ['security', 'finance', 'policy owner', 'Private AI Launch Workshop', 'requirements']) await expect(page.locator('#debrief')).toContainText(phrase);
  await capture(page, 'fsi-bank.png');
});

test('Lane 2. Bank risky choices reject infrastructure promises and reach a debrief.', async ({ page }) => {
  const trace = await meeting(page, 'fsi-bank', 'risk');
  expect(trace.some(turn => /does not prove compliance|does not prove lower total cost/.test(turn.coaching))).toBe(true);
  await expect(page.locator('#debrief')).toContainText('Security and finance will not support');
  await capture(page, 'fsi-bank-risk.png');
});

test('Lane 3. Insurance ideal and recovery explain human review and data quality in 7 turns.', async ({ page }) => {
  await meeting(page, 'fsi-insurance');
  await capture(page, 'fsi-insurance.png');
  const trace = await meeting(page, 'fsi-insurance', 'recovery');
  expect(trace.map(turn => turn.nodeId)).toEqual(['i1', 'ir', 'i3', 'i4', 'i5', 'i6', 'i7']);
  expect(trace[1].coaching).toContain('withdrew');
  expect(trace[1].response).toContain('representative sample');
  await expect(page.locator('#debrief')).toContainText('human review');
  await expect(page.locator('#debrief')).toContainText('Data Quality');
  await capture(page, 'fsi-insurance-recovery.png');
});

test('Lane 4. Wealth keeps consent, advisor approval, and useful adoption explicit.', async ({ page }) => {
  const trace = await meeting(page, 'fsi-wealth');
  expect(trace[1].response).toContain('client consent');
  expect(trace[1].response).toContain('advisor review');
  expect(trace[2].coaching).toContain('Neither service promises');
  await expect(page.locator('#debrief')).toContainText('investment advice without advisor approval');
  await capture(page, 'fsi-wealth.png');
});

test('Lane 5. Payments qualifies the platform before FirstTouch AI and rejects payment guarantees.', async ({ page }) => {
  const trace = await meeting(page, 'fsi-payments');
  expect(trace[0].response).toContain('Which system have your service centers chosen');
  expect(trace[1].response).toContain('Five9');
  expect(trace[2].coaching).toContain('does not show widespread use');
  await expect(page.locator('#debrief')).toContainText('Authority to issue refunds stays separate');
  await capture(page, 'fsi-payments.png');
});

test('Lane 6. All 10 answers in categories 1 and 2 remain readable and FSI-specific.', async ({ page }) => {
  await clues(page, [0, 1], 6);
});

test('Lane 7. All 10 answers in categories 3 and 4 preserve offering and risk limits.', async ({ page }) => {
  await clues(page, [2, 3], 7);
});

test('Lane 8. All 10 answers in categories 5 and 6 teach qualification and measured value.', async ({ page }) => {
  await clues(page, [4, 5], 8);
});

test('Lane 9. Both Daily Doubles and all Final stages keep FSI content and its own scores.', async ({ page }) => {
  await board(page);
  await openTile(page, 0, 0);
  await closeTile(page);
  const state = (await stored(page)).state;
  expect(state.dd).toHaveLength(2);
  expect(new Set(state.dd).size).toBe(2);
  for (const [index, key] of state.dd.entries()) {
    const [category, row] = key.split('-').map(Number);
    await openTile(page, category, row, index ? 75 : 125, index);
    await expect(page.locator('#clueVal')).toContainText('Wager');
    await page.locator(index ? '#judge .no' : '#judge .ok').click();
    await expect(page.locator(`#team${index} .score`)).toHaveText(index ? '-$75' : '$125');
    await capture(page, `fsi-dd-${index + 1}.png`);
    await closeTile(page);
  }
  await page.locator('#team1 .adj button').first().click();
  await page.locator('#team2 .adj button').first().click();
  await page.keyboard.press('f');
  await expect(page.locator('.fcat')).toHaveText(fsi.jeopardy.final.category);
  await page.locator('.fw input').nth(0).fill('50');
  await page.locator('.fw input').nth(1).fill('25');
  await page.locator('.fw input').nth(2).fill('100');
  await page.locator('#fNext').click();
  await expect(page.locator('.fclue')).toHaveText(fsi.jeopardy.final.q);
  await readable(page, ['.fclue', '#fNext']);
  await page.keyboard.press('Space');
  await expect(page.locator('#final .answer .a')).toHaveText(fsi.jeopardy.final.a);
  await expect(page.locator('#final .answer .why')).toHaveText(fsi.jeopardy.final.why);
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    await readable(page, ['#final .answer .a', '#final .answer .why', '#fNext']);
    const answer = await textMetrics(page, '#final .answer .a');
    const explanation = await textMetrics(page, '#final .answer .why');
    record(`fsi-final-metrics-${viewport.width}.json`, { viewport, answer, explanation });
    expectTextBudget(answer, 4, viewport.width === 1440 ? 25.92 : 30);
    expectTextBudget(explanation, 3, viewport.width === 1440 ? 18 : 21);
    await capture(page, viewport.width === 1440 ? 'fsi-final.png' : 'fsi-final-1920.png');
  }
  await page.locator('.fw .ok').nth(0).click();
  await page.locator('.fw .no').nth(1).click();
  await page.locator('.fw .ok').nth(2).click();
  await page.locator('#fNext').click();
  await expect(page.locator('.pod .sc')).toHaveText(['$175', '$200', '$0']);
  const scored = await stored(page);
  expect(scored.packId).toBe('fsi');
  expect(scored.state.teams.map(team => team.score)).toEqual([175, 0, 200]);
  expect(await stored(page, 'aiDealJeopardy.v2.default.1')).toBeNull();
  record('fsi-final-scores.json', { scored });
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('#team0 .score')).toHaveText('$175');
  expect(await stored(page)).toEqual(scored);
});

test('Lane 10. Default stays unchanged and group-mode longest FSI choices fit both desktop sizes.', async ({ page }) => {
  await page.goto('/jeopardy.html');
  await page.evaluate(key => localStorage.setItem(key, '{"schema":1,"packId":"default"}'), selectionKey);
  await page.goto('/roleplay.html');
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: Default');
  for (const scenario of original.roleplay.scenarios) await expect(page.locator(`.pcard[data-id="${scenario.id}"]`)).toContainText(scenario.persona.name);
  await page.goto('/jeopardy.html');
  await expect(page.locator('.cat')).toHaveText(original.jeopardy.categories.map(category => category.name));
  await page.locator('.tile[data-key="0-0"]').click();
  await expect(page.locator('#flipper')).toHaveClass(/flipped/);
  await page.keyboard.press('Space');
  await expect(page.locator('#answerText')).toHaveText(original.jeopardy.categories[0].clues[0].a);
  await closeTile(page);
  await page.evaluate(key => localStorage.setItem(key, '{"schema":1,"packId":"fsi"}'), selectionKey);
  const longest = fsi.roleplay.scenarios.flatMap(scenario => Object.entries(scenario.nodes).flatMap(([nodeId, node]) => node.ch.map(choice => ({ scenario, nodeId, node, choice })))).sort((a, b) => b.choice.t.length - a.choice.t.length)[0];
  const sizes = [];
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    await startMeeting(page, longest.scenario);
    if (!(await page.locator('#tGroup').getAttribute('class')).includes('on')) await page.locator('#tGroup').click();
    await page.locator('#tIdeal').click();
    let nodeId = longest.scenario.start;
    let turn = 1;
    while (nodeId !== longest.nodeId) {
      const node = longest.scenario.nodes[nodeId];
      const choice = node.ch.find(choice => choice.q === 'best');
      await respond(page, nodeId, node, choice, turn++, longest.scenario.turns);
      nodeId = choice.next;
    }
    await expect(page.locator('.choice')).toHaveCount(3);
    const texts = await page.locator('.choice .txt').allTextContents();
    const choice = page.locator('.choice').nth(texts.indexOf(longest.choice.t));
    await choice.scrollIntoViewIfNeeded();
    const box = await choice.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    const clipping = await choice.locator('.txt').evaluate(element => ({ client: element.clientWidth, scroll: element.scrollWidth, height: element.clientHeight, scrollHeight: element.scrollHeight }));
    expect(clipping.scroll).toBeLessThanOrEqual(clipping.client + 1);
    expect(clipping.scrollHeight).toBeLessThanOrEqual(clipping.height + 1);
    await choice.locator('.vp').click();
    await expect(choice.locator('.votes b')).toHaveText('1');
    sizes.push({ viewport, box, clipping, nodeId, longestChoice: longest.choice.t });
    await capture(page, viewport.width === 1440 ? 'fsi-density.png' : 'fsi-density-1920.png');
    await page.keyboard.press('l');
    await expect(page.locator('.fb p')).toHaveText(longest.choice.fb);
    await expect(page.locator('.fbroom')).toContainText('1 of 1 votes');
    await page.locator('#next').click();
    const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('aiRoleplay.prefs.v1')));
    expect(prefs.group).toBe(true);
  }
  record('fsi-density.json', { sizes });
});
