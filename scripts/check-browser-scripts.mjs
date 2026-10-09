import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { ESLint } from 'eslint';
import globals from 'globals';

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [{
    files: ['**/*.mjs', '**/*.js'],
    languageOptions: { globals: globals.browser },
    rules: { 'no-undef': 'error', 'no-dupe-keys': 'error', 'no-unreachable': 'error' }
  }]
});
let errors = 0;
for (const name of ['index', 'roleplay', 'jeopardy']) {
  const source = readFileSync(new URL(`../prototype/seller-ai-training/${name}.html`, import.meta.url), 'utf8');
  for (const [index, match] of [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)].entries()) {
    const module = /type="module"/.test(match[1]);
    const syntax = spawnSync(process.execPath, ['--input-type', module ? 'module' : 'commonjs', '--check'], { input: match[2], encoding: 'utf8' });
    if (syntax.status !== 0) { errors++; console.error(`${name} syntax failed. ${syntax.stderr}`); }
    const [result] = await eslint.lintText(match[2], { filePath: `${name}-${index}.${module ? 'mjs' : 'js'}` });
    errors += result.errorCount;
    for (const message of result.messages) console.error(`${name}:${message.line}:${message.column} ${message.message}`);
    if (!result.errorCount) console.log(`${name} inline ${module ? 'module' : 'script'} syntax and browser globals passed.`);
  }
  if (/Your Company|const BRAND_NAME\s*=/.test(source)) { errors++; console.error(`${name} retains a seller placeholder.`); }
}
if (errors) process.exitCode = 1;
