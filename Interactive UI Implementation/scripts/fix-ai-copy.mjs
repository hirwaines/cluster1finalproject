import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const srcRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'app');

const replacements = [
  [/AI Preferences/g, 'Recommendation Settings'],
  [/AI-powered/g, 'Data-driven'],
  [/AI-generated/g, 'Institution-based'],
  [/About AI Strategic Planning/g, 'About Strategic Planning'],
  [/AI_STRATEGIC_RECOMMENDATIONS/g, 'STRATEGIC_RECOMMENDATIONS'],
  [/STRATEGIC PLANNING \(AI\)/g, 'STRATEGIC PLANNING'],
  [/{\/\* AI Insights - INNOVATIVE FEATURE \*\/}/g, ''],
  [/{\/\* Smart match banner \*\/}/g, ''],
  [/{\/\* AI-extracted expertise \(read-only\) \*\/}/g, ''],
  [/Smart matching/g, 'Match by expertise'],
  [/Smart Match Summary/g, 'Funding Match Summary'],
  [/NSF AI Research Grant/g, 'NRIF Climate & Data Research Grant'],
  [/Artificial Intelligence/g, 'Data Science'],
  [/Neural Networks/g, 'Statistical Methods'],
  [/Generative AI/g, 'Health Informatics'],
  [/AI & ML/g, 'Data Science'],
  [/AI Research Symposium/g, 'National Research Forum'],
  [/Explainable AI/g, 'Research Methods'],
  [/Quantum Machine Learning/g, 'Applied Statistics'],
  [/AI for campus climate resilience/g, 'Campus climate resilience programme'],
  [/Responsible AI policy pilot/g, 'Research ethics policy pilot'],
  [/Applying machine-learning models/g, 'Applying statistical models'],
  [/AI-ethics review/g, 'research-ethics review'],
  [/publishing in climate and AI/g, 'publishing in climate and data science'],
  [/Contribute to AI training and analytics/g, 'Share anonymised usage data for platform analytics'],
  [/AI-powered trend notifications/g, 'Trend alerts in your research field'],
  [/Manage NLP processing jobs/g, 'Manage publication indexing jobs'],
  [/activeSection === 'ai'/g, "activeSection === 'recommendations'"],
  [{ id: 'ai'/g, "{ id: 'recommendations'"],
  [/placeholder="e.g. AI for Health Data"/g, 'placeholder="e.g. Health data governance"'],
  [/matches your expertise in neural networks/g, 'aligns with your publication keywords'],
  [/Compass/g, 'BarChart3'],
  [/import \{ User, Shield, Globe, Compass,/g, 'import { User, Shield, Globe, BarChart3,'],
  [/import \{[\s\S]*?Compass,[\s\S]*?\} from 'lucide-react';/g, (m) => m.replace(/Compass,?\s*/g, '').replace(/,\s*}/, ' }')],
];

// Simpler icon replace in specific files
const iconReplacements = [
  ['Compass', 'BarChart3'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'ui') walk(full, files);
    else if (entry.isDirectory() && entry.name === 'ui') continue;
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

function fixIcons(content) {
  for (const [from, to] of iconReplacements) {
    if (content.includes(from) && !content.includes(to)) {
      content = content.replace(new RegExp(`\\b${from}\\b`, 'g'), to);
      // fix duplicate imports - add BarChart3 if Compass was in import block
    }
  }
  return content;
}

let n = 0;
for (const file of walk(srcRoot)) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  for (const [pattern, replacement] of replacements) {
    if (typeof pattern === 'string') {
      c = c.split(pattern).join(replacement);
    } else {
      c = c.replace(pattern, replacement);
    }
  }
  c = fixIcons(c);
  if (c !== orig) {
    fs.writeFileSync(file, c);
    n++;
  }
}
console.log(`Updated ${n} files`);
