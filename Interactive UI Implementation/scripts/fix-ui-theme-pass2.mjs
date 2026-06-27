import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, '..', 'src');

const replacements = [
  [/<div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">\s*<Brain className="w-6 h-6 text-white" \/>\s*<\/div>/g, '<BrandLogo size="sm" showText={false} />'],
  [/<div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">\s*<Brain className="w-6 h-6 text-white" \/>\s*<\/div>\s*<span className="font-bold text-xl text-brand">\s*ResearchIQ\s*<\/span>/g, '<BrandLogo />'],
  [/<Brain className="w-6 h-6 text-white" \/>/g, ''],
  [/hover:border-blue-300/g, 'hover:border-brand/40'],
  [/hover:border-blue-500/g, 'hover:border-brand'],
  [/border-blue-300/g, 'border-brand/40'],
  [/border-blue-900/g, 'border-brand'],
  [/ring-blue-500/g, 'ring-brand'],
  [/ring-blue-600/g, 'ring-brand'],
  [/text-blue-500/g, 'text-brand'],
  [/text-blue-100/g, 'text-brand-muted'],
  [/hover:bg-blue-200/g, 'hover:bg-brand-muted'],
  [/bg-blue-200/g, 'bg-brand-muted'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.tsx')) files.push(full);
  }
  return files;
}

function ensureBrandLogoImport(content, file) {
  if (!content.includes('BrandLogo') || content.includes("from '../components/BrandLogo'") || content.includes("from './BrandLogo'")) {
    return content;
  }
  const depth = file.replace(srcRoot, '').split(path.sep).filter(Boolean).length - 2;
  const prefix = depth <= 0 ? './' : '../'.repeat(depth);
  const importLine = `import { BrandLogo } from '${prefix}components/BrandLogo';\n`;
  return importLine + content;
}

let changed = 0;
for (const file of walk(srcRoot)) {
  if (file.includes('BrandLogo.tsx')) continue;
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  content = ensureBrandLogoImport(content, file);
  if (content !== orig) {
    fs.writeFileSync(file, content);
    changed++;
  }
}
console.log(`Pass 2 updated ${changed} files`);
