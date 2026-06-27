/**
 * Strip DashboardShell wrapper from role dashboard pages.
 * Run: node scripts/strip-dashboard-shell.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/app/pages');

const targets = [
  'AdminDashboard.tsx',
  'ResearchManagerDashboard.tsx',
  'FunderDashboard.tsx',
  'DepartmentHeadDashboard.tsx',
];

for (const file of targets) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove DashboardShell import
  content = content.replace(/DashboardShell,\s*/g, '');
  content = content.replace(/,\s*DashboardShell/g, '');
  content = content.replace(/import \{ DashboardShell \}[^\n]+\n/g, '');

  // Remove DashboardShell opening tag and props (multiline)
  content = content.replace(/<DashboardShell[\s\S]*?>\s*/m, '');

  // Remove inner dashboardPageClass wrapper (AppShell provides padding)
  content = content.replace(/\s*<div className=\{dashboardPageClass\}>\s*/g, '\n      ');

  // Remove closing DashboardShell and extra div
  content = content.replace(/\s*<\/div>\s*\n\s*<\/DashboardShell>/g, '');
  content = content.replace(/\s*<\/DashboardShell>/g, '');

  // Remove unused handleLogout patterns if present
  content = content.replace(/\s*const handleLogout = \(\) => \{[\s\S]*?\};\s*/g, '\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Stripped DashboardShell from:', file);
}

console.log('Done.');
