import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, '..', 'src');

const replacements = [
  [/bg-blue-900 hover:bg-blue-950/g, ''],
  [/hover:bg-blue-950/g, 'hover:bg-brand/90'],
  [/hover:bg-blue-900/g, 'hover:bg-brand/90'],
  [/bg-blue-900/g, 'bg-brand'],
  [/text-blue-900\/80/g, 'text-brand/80'],
  [/text-blue-900/g, 'text-brand'],
  [/text-blue-800/g, 'text-brand'],
  [/bg-blue-800/g, 'bg-brand'],
  [/border-blue-100/g, 'border-border'],
  [/border-blue-200/g, 'border-border'],
  [/border-blue-800/g, 'border-brand'],
  [/bg-blue-50/g, 'bg-brand-muted'],
  [/bg-blue-100/g, 'bg-brand-muted'],
  [/text-blue-600/g, 'text-brand'],
  [/hover:border-blue-200/g, 'hover:border-brand/30'],
  [/hover:border-blue-600/g, 'hover:border-brand'],
  [/hover:text-blue-900/g, 'hover:text-brand'],
  [/hover:text-blue-800/g, 'hover:text-brand'],
  [/from-blue-50 to-blue-100/g, 'from-brand-muted to-brand-muted'],
  [/hover:bg-blue-100/g, 'hover:bg-brand-muted'],
  [/hover:bg-blue-50/g, 'hover:bg-brand-muted'],
  [/bg-blue-500/g, 'bg-brand'],
  [/min-h-screen bg-gray-50/g, 'min-h-screen bg-background'],
  [/border-b border-blue-100/g, 'border-b border-border'],
  [/#1e3a8a/g, '#1b4332'],
  [/Sparkles/g, 'Compass'],
  [/\bCpu\b/g, 'Library'],
  [/Brain,\s*/g, ''],
  [/,\s*Brain/g, ''],
  [/import \{ Brain \} from 'lucide-react';\n/g, ''],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(srcRoot)) {
  if (file.includes('BrandLogo.tsx')) continue;
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  if (content !== orig) {
    fs.writeFileSync(file, content);
    changed++;
  }
}
console.log(`Updated ${changed} files`);
