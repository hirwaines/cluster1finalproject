/**
 * Batch-replace legacy Tailwind gray/blue utilities with NCST design tokens.
 * Run: node scripts/migrate-ui-tokens.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/app/pages');
const componentsDir = path.join(__dirname, '../src/app/components');

const replacements = [
  [/text-gray-900/g, 'text-foreground'],
  [/text-gray-800/g, 'text-foreground'],
  [/text-gray-700/g, 'text-foreground'],
  [/text-gray-600/g, 'text-muted-foreground'],
  [/text-gray-500/g, 'text-muted-foreground'],
  [/text-gray-400/g, 'text-muted-foreground/70'],
  [/bg-gray-50/g, 'bg-muted/50'],
  [/bg-gray-100/g, 'bg-muted'],
  [/bg-gray-200/g, 'bg-muted'],
  [/border-gray-100/g, 'border-border'],
  [/border-gray-200/g, 'border-border'],
  [/border-gray-300/g, 'border-border'],
  [/divide-gray-200/g, 'divide-border'],
  [/hover:bg-gray-50/g, 'hover:bg-muted/50'],
  [/hover:bg-gray-100/g, 'hover:bg-muted'],
  [/text-blue-900/g, 'text-brand-dark'],
  [/text-blue-800/g, 'text-brand-dark'],
  [/text-blue-700/g, 'text-brand'],
  [/text-blue-600/g, 'text-brand'],
  [/text-blue-500/g, 'text-brand'],
  [/bg-blue-900/g, 'bg-brand-dark'],
  [/bg-blue-800/g, 'bg-brand-dark'],
  [/bg-blue-700/g, 'bg-brand'],
  [/bg-blue-600/g, 'bg-brand'],
  [/bg-blue-100/g, 'bg-brand-muted'],
  [/bg-blue-50/g, 'bg-brand-muted/50'],
  [/border-blue-100/g, 'border-border'],
  [/border-blue-200/g, 'border-border'],
  [/border-blue-300/g, 'border-brand/20'],
  [/hover:bg-blue-50/g, 'hover:bg-brand-muted/50'],
  [/hover:bg-blue-100/g, 'hover:bg-brand-muted'],
  [/text-green-800/g, 'text-success-foreground'],
  [/text-green-700/g, 'text-success-foreground'],
  [/text-green-600/g, 'text-success'],
  [/bg-green-100/g, 'bg-success-muted'],
  [/bg-green-50/g, 'bg-success-muted/50'],
  [/text-red-800/g, 'text-destructive'],
  [/text-red-700/g, 'text-destructive'],
  [/text-red-600/g, 'text-destructive'],
  [/bg-red-100/g, 'bg-destructive/10'],
  [/bg-red-50/g, 'bg-destructive/10'],
  [/text-yellow-800/g, 'text-warning-foreground'],
  [/text-yellow-700/g, 'text-warning-foreground'],
  [/bg-yellow-100/g, 'bg-warning-muted'],
  [/text-purple-800/g, 'text-brand-dark'],
  [/text-purple-700/g, 'text-brand-dark'],
  [/bg-purple-100/g, 'bg-brand-muted'],
  [/text-orange-800/g, 'text-warning-foreground'],
  [/bg-orange-100/g, 'bg-warning-muted'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const targets = [...walk(pagesDir), ...walk(componentsDir).filter(f => !f.includes('ui/'))];
let changed = 0;

for (const file of targets) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Updated:', path.relative(path.join(__dirname, '..'), file));
  }
}

console.log(`Done. ${changed} files updated.`);
