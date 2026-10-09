import { test, expect } from '@playwright/test';
import pack from '../../prototype/seller-ai-training/packs/financial-services.mjs';

test.beforeEach(async ({ page, context }) => {
  await context.route('https://fonts.googleapis.com/**', route => route.abort());
  await context.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.goto('/settings.html');
  await page.getByRole('radio', { name: 'FSI v2', exact: true }).check();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('#saveStatus')).toContainText('FSI v2 selected for both activities.');
});

for (const scenario of pack.roleplay.scenarios) {
  test(`FSI v2 plays ${scenario.title} through its ideal route and debrief.`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/roleplay.html');
    await expect(page.locator('#selectionNotice')).toContainText('Current pack: FSI v2.');
    await expect(page.locator('.pcard')).toHaveCount(6);
    await page.locator(`.pcard[data-id="${scenario.id}"]`).click();
    await expect(page.locator('.mission p')).toHaveText(scenario.mission);
    await page.locator('#briefGo').click();
    let nodeId = scenario.start;
    let turns = 0;
    while (nodeId !== 'end') {
      const node = scenario.nodes[nodeId];
      const choice = node.ch.find(choice => choice.q === 'best');
      await expect(page.locator(`.msg.cust[data-node="${nodeId}"]`)).toBeVisible();
      await expect(page.locator('.choice')).toHaveCount(node.ch.length);
      await page.locator('.choice.best').click();
      await expect(page.locator('.fb p')).toHaveText(choice.fb);
      await page.locator('#next').click();
      nodeId = choice.next;
      turns++;
    }
    await expect(page.locator('#sDeb')).toHaveClass(/show/);
    await expect(page.locator('.prow')).toHaveCount(turns);
    await expect(page.locator('.hero h2')).toHaveText(scenario.outcomes.great.title);
    await expect(page.locator('.hero p')).toHaveText(scenario.outcomes.great.text);
    expect(errors).toEqual([]);
  });
}

test('FSI v2 shows Home previews and all Jeopardy clues, and restores its own saved board.', async ({ page }) => {
  test.setTimeout(180000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('link', { name: 'Return to Home' }).click();
  await expect(page.locator('#currentPack')).toHaveText('Current pack: FSI v2');
  await expect(page.locator('#scenarioCount')).toHaveText('6 personas');
  await expect(page.locator('#clueCount')).toHaveText('30 clues + Final');
  await expect(page.locator('#scenarioPreview')).toHaveText(pack.roleplay.scenarios[0].title);
  await page.locator('a[href="jeopardy.html"]').click();
  await expect(page.locator('#selectionNotice')).toContainText('Current pack: FSI v2.');
  await expect(page.locator('.cat')).toHaveText(pack.jeopardy.categories.map(category => category.name));
  await expect(page.locator('.tile')).toHaveCount(30);
  await page.locator('#soundBtn').click();
  for (const [category, group] of pack.jeopardy.categories.entries()) {
    for (const [row, clue] of group.clues.entries()) {
      await page.locator(`.tile[data-key="${category}-${row}"]`).click();
      await expect(page.locator('#flipper')).toHaveClass(/flipped/);
      if (await page.locator('#ddPane').isVisible()) {
        await page.locator('#ddTeams .tp').first().click();
        await page.locator('#ddWager').fill('100');
        await page.locator('#ddGo').click();
      }
      await expect(page.locator('#clueText')).toHaveText(clue.q);
      await page.keyboard.press('Space');
      await expect(page.locator('#answerText')).toHaveText(clue.a);
      await expect(page.locator('#whyText')).toHaveText(clue.why);
      await page.keyboard.press('Digit1');
      await page.keyboard.press('Escape');
      await expect(page.locator('#overlay')).not.toHaveClass(/show/);
    }
  }
  const key = `aiDealJeopardy.v2.${pack.id}.${pack.revision}`;
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  expect(saved).toMatchObject({ packId: pack.id, packRevision: pack.revision });
  expect(saved.state.used).toHaveLength(30);
  expect(await page.evaluate(() => localStorage.getItem('aiDealJeopardy.v2.default.1'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('aiDealJeopardy.v2.fsi.2'))).toBeNull();
  await page.reload();
  await expect(page.locator('.tile.used')).toHaveCount(30);
  expect(errors).toEqual([]);
});

test('FSI v2 presents the supplied Final category, question, answer, and explanation.', async ({ page }) => {
  await page.goto('/jeopardy.html');
  await page.locator('#soundBtn').click();
  await page.keyboard.press('f');
  await expect(page.locator('.fcat')).toHaveText(pack.jeopardy.final.category);
  await page.locator('#fNext').click();
  await expect(page.locator('.fclue')).toHaveText(pack.jeopardy.final.q);
  await page.locator('#fNext').click();
  await expect(page.locator('#final .answer .a')).toHaveText(pack.jeopardy.final.a);
  await expect(page.locator('#final .answer .why')).toHaveText(pack.jeopardy.final.why);
  await expect(page.locator('#fNext')).toBeInViewport();
});
