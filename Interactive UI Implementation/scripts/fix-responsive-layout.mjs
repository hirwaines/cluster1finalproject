/**
 * Make app pages responsive: remove fixed max-width wrappers, fix rigid grids.
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
  [/className="p-8 max-w-6xl mx-auto"/g, 'className="w-full"'],
  [/className="p-8 max-w-5xl mx-auto"/g, 'className="w-full"'],
  [/className="p-8 max-w-4xl mx-auto"/g, 'className="w-full"'],
  [/className="max-w-5xl mx-auto px-6 py-8"/g, 'className="w-full"'],
  [/className="max-w-2xl mx-auto px-6 py-8"/g, 'className="w-full"'],
  [/space-y-6 max-w-2xl/g, 'space-y-4 w-full'],
  [/className="grid grid-cols-4 gap-6 mb-8"/g, 'className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 mb-5"'],
  [/className="grid grid-cols-4 gap-6"/g, 'className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"'],
  [/className="grid grid-cols-4 gap-4"/g, 'className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4"'],
  [/className="grid grid-cols-3 gap-6 mb-8"/g, 'className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-5"'],
  [/className="grid grid-cols-3 gap-6"/g, 'className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"'],
  [/className="grid grid-cols-3 gap-4"/g, 'className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"'],
  [/className="grid grid-cols-2 gap-6 mb-8"/g, 'className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5 mb-5"'],
  [/className="grid grid-cols-2 gap-6"/g, 'className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5"'],
  [/className="grid grid-cols-2 gap-8"/g, 'className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5"'],
  [/className="grid grid-cols-2 gap-5"/g, 'className="grid grid-cols-1 gap-4 sm:grid-cols-2"'],
  [/className="grid lg:grid-cols-2 gap-6"/g, 'className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5"'],
  [/className="grid grid-cols-2 gap-4"/g, 'className="grid grid-cols-1 gap-4 sm:grid-cols-2"'],
  [/className="grid grid-cols-2 gap-3"/g, 'className="grid grid-cols-1 gap-3 sm:grid-cols-2"'],
  [/className="grid grid-cols-3 gap-6 text-center"/g, 'className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-center"'],
  [/className="flex items-center gap-6"/g, 'className="flex flex-col gap-4 sm:flex-row sm:items-center"'],
  [/className="flex gap-5"/g, 'className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]"'],
  [/SelectTrigger className="w-\[200px\]"/g, 'SelectTrigger className="w-full sm:w-[200px]"'],
  [/SelectTrigger className="w-\[180px\]"/g, 'SelectTrigger className="w-full sm:w-[180px]"'],
  [/SelectTrigger className="w-\[160px\]"/g, 'SelectTrigger className="w-full sm:w-[160px]"'],
  [/min-w-\[200px\]/g, 'min-w-0 sm:min-w-[200px]'],
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
