/**
 * Normalize dashboard page heading classes to Plus Jakarta Sans scale.
 * Skips marketing/auth pages that intentionally use font-display.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(__dirname, '../src/app/pages');

const SKIP = new Set([
  'LandingPage.tsx',
  'LoginPage.tsx',
  'SignUpPage.tsx',
  'SignUpResearcherPage.tsx',
  'SignUpFunderPage.tsx',
  'ContactPage.tsx',
]);

const REPLACEMENTS = [
  [/className="text-2xl font-bold/g, 'className="text-lg font-semibold'],
  [/className="text-xl font-bold/g, 'className="text-base font-semibold'],
  [/className="text-lg font-bold/g, 'className="text-base font-semibold'],
  [/<h4 className="font-bold/g, '<h4 className="font-semibold'],
  [/DialogTitle className="text-2xl"/g, 'DialogTitle'],
  [/DialogTitle className="text-xl"/g, 'DialogTitle'],
  [/font-display text-lg/g, 'text-base font-semibold'],
  [/font-display text-xl/g, 'text-lg font-semibold'],
  [/font-display text-2xl/g, 'text-lg font-semibold'],
  [/text-4xl font-bold/g, 'text-2xl font-semibold tabular-nums sm:text-3xl'],
  [/text-3xl font-bold/g, 'text-2xl font-semibold tabular-nums sm:text-3xl'],
  [/text-2xl font-bold/g, 'text-xl font-semibold tabular-nums'],
  [/font-bold text-lg/g, 'font-semibold text-base'],
  [/font-bold text-sm/g, 'font-semibold text-sm'],
  [/font-bold text-brand/g, 'font-semibold text-brand'],
  [/font-bold text-brand-dark/g, 'font-semibold text-brand-dark'],
  [/font-bold text-success/g, 'font-semibold text-brand'],
  [/font-bold mb-/g, 'font-semibold mb-'],
  [/font-bold truncate/g, 'font-semibold truncate'],
  [/font-bold">/g, 'font-semibold">'],
];

let changed = 0;

for (const file of fs.readdirSync(pagesDir)) {
  if (!file.endsWith('.tsx') || SKIP.has(file)) continue;
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  for (const [pattern, replacement] of REPLACEMENTS) {
    content = content.replace(pattern, replacement);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    changed++;
    console.log('updated', file);
  }
}

console.log(`Done. ${changed} files updated.`);
