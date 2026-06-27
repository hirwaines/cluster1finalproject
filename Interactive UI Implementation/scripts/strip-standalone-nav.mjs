/**
 * Strip standalone nav chrome from AppShell child pages.
 * Run: node scripts/strip-standalone-nav.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/app/pages');

const targets = [
  'CollaborationNetwork.tsx',
  'FundingOpportunities.tsx',
  'ResearchTrends.tsx',
  'ExpertiseMap.tsx',
  'DataIntegration.tsx',
  'ReportBuilder.tsx',
  'UserSecurityManagement.tsx',
  'ResearchKnowledgeProcessing.tsx',
];

function stripNavBlock(content) {
  // Remove standalone nav block (multiline)
  content = content.replace(
    /\s*<nav className="bg-white\/80 backdrop-blur-md border-b border-border[^"]*"[^>]*>[\s\S]*?<\/nav>\s*/g,
    '\n',
  );
  return content;
}

function stripOuterShell(content) {
  // min-h-screen wrapper -> fragment or direct content
  content = content.replace(
    /return \(\s*<div className="min-h-screen bg-(?:background|muted\/50)[^"]*">\s*/g,
    'return (\n    <>\n      ',
  );
  // Remove max-w-7xl mx-auto px-6 py-8 wrapper opening
  content = content.replace(
    /\s*<div className="max-w-7xl mx-auto px-6 py-8">\s*/g,
    '\n      ',
  );
  // Close wrappers at end - replace closing divs before );
  content = content.replace(/\s*<\/div>\s*<\/div>\s*\);\s*\n\}/g, '\n    </>\n  );\n}');
  content = content.replace(/\s*<\/div>\s*\);\s*\n\}/g, '\n  );\n}');
  return content;
}

function stripExpertiseSidebar(content) {
  // Remove duplicate sidebar in ExpertiseMap
  content = content.replace(
    /\s*<aside className="w-64 bg-white border-r border-border min-h-screen sticky top-\[65px\] self-start">[\s\S]*?<\/aside>\s*/g,
    '\n',
  );
  // Remove flex wrapper if present
  content = content.replace(
    /<div className="flex">\s*(?=<main|<div className="flex-1)/g,
    '',
  );
  return content;
}

for (const file of targets) {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = stripNavBlock(content);
  content = stripOuterShell(content);
  if (file === 'ExpertiseMap.tsx') content = stripExpertiseSidebar(content);
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Stripped:', file);
  }
}

console.log('Done.');
