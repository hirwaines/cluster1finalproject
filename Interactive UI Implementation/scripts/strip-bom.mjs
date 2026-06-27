import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const srcRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

let n = 0;
for (const file of walk(srcRoot)) {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('\uFEFF')) {
    fs.writeFileSync(file, c.replace(/\uFEFF/g, ''));
    n++;
  }
}
console.log(`Cleaned BOM in ${n} files`);
