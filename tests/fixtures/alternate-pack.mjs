import defaultPack from '../../prototype/seller-ai-training/packs/default.mjs';

const alternate = structuredClone(defaultPack);
alternate.id = 'alternate';
alternate.label = 'Alternate fixture';
alternate.description = 'Isolated state tests only.';
alternate.disclaimer = 'Test fixture, not a shipped content pack.';
for (const scenario of alternate.roleplay.scenarios) {
  scenario.persona.name = `Alternate ${scenario.persona.name}`;
  scenario.persona.company = 'Alternate customer';
}
for (const category of alternate.jeopardy.categories) {
  category.name = `Alternate ${category.name}`;
  for (const clue of category.clues) clue.q = `Alternate question: ${clue.q}`;
}
alternate.jeopardy.final.category = 'Alternate Final';
export default alternate;
