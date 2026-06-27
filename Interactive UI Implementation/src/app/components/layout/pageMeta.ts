import type { NavLink } from './navStyles';
import { isNavActive } from './navStyles';

export type PageMeta = {
  title: string;
  description?: string;
};

/** Longer titles where the nav label alone is too short */
const PAGE_TITLES: Record<string, string> = {
  '/feed': 'Research feed',
  '/requests': 'Requests & applications',
  '/researcher/analytics': 'Research analytics',
  '/network': 'Collaboration network',
  '/trends': 'Research trends',
  '/funding': 'Funding opportunities',
  '/my-profile': 'My profile',
  '/settings': 'Settings',
  '/researcher/upload': 'Submit publication',
  '/expertise-map': 'Expertise map',
  '/data-integration': 'Data integration',
  '/manager/reports': 'Report builder',
  '/admin/knowledge-processing': 'Knowledge processing',
  '/admin/security-management': 'User & security',
  '/admin/dashboard?tab=overview': 'Admin dashboard',
  '/admin/dashboard?tab=accreditations': 'Accreditations',
  '/admin/dashboard?tab=publications': 'Publication queue',
  '/admin/dashboard?tab=funders': 'Funder applications',
  '/admin/dashboard?tab=users': 'User management',
  '/admin/dashboard?tab=import': 'CSV import',
  '/manager/dashboard?tab=dashboard': 'Research dashboard',
  '/manager/dashboard?tab=projects': 'Active projects',
  '/manager/dashboard?tab=faculty': 'Faculty directory',
  '/manager/dashboard?tab=analytics': 'Analytics overview',
  '/manager/dashboard?tab=strategic': 'Strategic planning',
  '/manager/dashboard?tab=publications': 'All publications',
  '/funder/dashboard?tab=overview': 'Portfolio overview',
  '/funder/dashboard?tab=discover': 'Discover research',
  '/funder/dashboard?tab=portfolio': 'My portfolio',
  '/funder/dashboard?tab=rfps': 'Funding opportunities',
  '/department/dashboard?tab=overview': 'Department overview',
  '/department/dashboard?tab=researchers': 'Faculty & researchers',
  '/department/dashboard?tab=performance': 'Performance analytics',
  '/department/dashboard?tab=funding': 'Funding & grants',
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/feed': 'Discover, search, and engage with the latest research from Rwanda\'s science community.',
  '/requests': 'Track collaboration requests and funding applications.',
  '/researcher/analytics': 'Your output, citations, and departmental benchmarks.',
  '/network': 'Explore co-authorship links and collaboration gaps.',
  '/trends': 'Publication and citation trends from indexed research.',
  '/funding': 'Browse grants and funding opportunities matched to your profile.',
  '/my-profile': 'Your public researcher profile and publication activity.',
  '/settings': 'Account settings, privacy, and preferences.',
  '/researcher/upload': 'Submit publications for administrator review and indexing.',
  '/expertise-map': 'Institutional expertise derived from indexed publications.',
  '/data-integration': 'Connect and sync external research data sources.',
  '/manager/reports': 'Build and export institutional research reports.',
  '/admin/knowledge-processing': 'Manage NLP processing jobs and data quality.',
  '/admin/security-management': 'Users, permissions, audit logs, and security.',
  '/admin/dashboard?tab=overview': 'Platform-wide metrics, pending queues, and system shortcuts.',
  '/admin/dashboard?tab=accreditations': 'Review and approve researcher credential applications.',
  '/admin/dashboard?tab=publications': 'Approve submissions before they enter the live catalogue.',
  '/admin/dashboard?tab=funders': 'Review pending funder registration applications.',
  '/admin/dashboard?tab=users': 'Directory accounts, roles, and verification state.',
  '/admin/dashboard?tab=import': 'Bulk import verified publication metadata via CSV.',
  '/manager/dashboard?tab=dashboard': 'Institutional research activity and performance.',
  '/manager/dashboard?tab=projects': 'Monitor ongoing projects, budgets, and progress.',
  '/manager/dashboard?tab=faculty': 'Browse and export the faculty directory.',
  '/manager/dashboard?tab=analytics': 'Research performance analytics and insights.',
  '/manager/dashboard?tab=strategic': 'AI-generated strategic recommendations for your institution.',
  '/manager/dashboard?tab=publications': 'Indexed publications across all researchers.',
  '/funder/dashboard?tab=overview': 'Matched projects and expressions of interest.',
  '/funder/dashboard?tab=discover': 'Browse research projects seeking funding.',
  '/funder/dashboard?tab=portfolio': 'Track active interests and funded projects.',
  '/funder/dashboard?tab=rfps': 'Publish opportunities for researchers to discover.',
  '/department/dashboard?tab=overview': 'Department metrics, trends, and top researchers.',
  '/department/dashboard?tab=researchers': 'Faculty members in your department.',
  '/department/dashboard?tab=performance': 'Publication trends and research area distribution.',
  '/department/dashboard?tab=funding': 'Grants, applications, and funding by area.',
};

const ROUTE_FALLBACK: Record<string, PageMeta> = {
  '/researcher/profile': { title: 'Researcher profile', description: 'Public profile and publications.' },
  '/research': { title: 'Research paper', description: 'Publication details and collaboration.' },
};

export function roleWorkspaceLabel(role: string | undefined): string {
  switch (role) {
    case 'admin':
      return 'NCST Administration';
    case 'manager':
      return 'Research Office';
    case 'department_head':
      return 'Department Portal';
    case 'funder':
      return 'Funder Portal';
    default:
      return 'Research Workspace';
  }
}

export function findActiveNavLink(
  pathname: string,
  search: string,
  navLinks: NavLink[],
): NavLink | undefined {
  return navLinks.find(link => isNavActive(pathname, search, link.href));
}

function metaKey(pathname: string, search: string): string {
  if (!search) return pathname;
  return `${pathname}${search}`;
}

export function resolvePageMeta(
  pathname: string,
  search: string,
  navLinks: NavLink[],
): PageMeta {
  const active = findActiveNavLink(pathname, search, navLinks);
  if (active) {
    const key = active.href;
    return {
      title: PAGE_TITLES[key] ?? active.label,
      description: PAGE_DESCRIPTIONS[key] ?? PAGE_DESCRIPTIONS[active.href.split('?')[0]],
    };
  }

  const key = metaKey(pathname, search);
  if (PAGE_TITLES[key]) {
    return {
      title: PAGE_TITLES[key],
      description: PAGE_DESCRIPTIONS[key],
    };
  }

  if (PAGE_TITLES[pathname]) {
    return {
      title: PAGE_TITLES[pathname],
      description: PAGE_DESCRIPTIONS[pathname],
    };
  }

  if (pathname.startsWith('/researcher/profile/')) {
    return ROUTE_FALLBACK['/researcher/profile'];
  }
  if (pathname.startsWith('/research/')) {
    return ROUTE_FALLBACK['/research'];
  }

  return {
    title: roleWorkspaceLabel(undefined),
    description: undefined,
  };
}
