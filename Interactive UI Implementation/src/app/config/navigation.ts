import type { UserRole } from '../context/AppContext';

export type PendingNavCounts = {
  researchers: number;
  publications: number;
  funders: number;
  requests: number;
};

export type NavItemConfig = {
  id: string;
  label: string;
  href: string;
  badgeFrom?: keyof PendingNavCounts;
  badge?: number;
};

export type NavSectionConfig = {
  title?: string;
  items: NavItemConfig[];
};

export const DASHBOARD_DEFAULT_TAB: Record<string, string> = {
  '/admin/dashboard': 'overview',
  '/funder/dashboard': 'overview',
  '/department/dashboard': 'overview',
  '/manager/dashboard': 'dashboard',
};

export const ROLE_HOME: Record<UserRole, string> = {
  admin: '/admin/dashboard?tab=overview',
  manager: '/manager/dashboard?tab=dashboard',
  funder: '/funder/dashboard?tab=overview',
  department_head: '/department/dashboard?tab=overview',
  researcher: '/feed',
};

const ADMIN_NAV: NavSectionConfig[] = [
  {
    title: 'Administration',
    items: [
      { id: 'overview', label: 'Dashboard', href: '/admin/dashboard?tab=overview' },
      { id: 'accreditations', label: 'Accreditations', href: '/admin/dashboard?tab=accreditations', badgeFrom: 'researchers' },
      { id: 'publications', label: 'Publications', href: '/admin/dashboard?tab=publications', badgeFrom: 'publications' },
      { id: 'funders', label: 'Funders', href: '/admin/dashboard?tab=funders', badgeFrom: 'funders' },
      { id: 'users', label: 'Users', href: '/admin/dashboard?tab=users' },
      { id: 'import', label: 'Import', href: '/admin/dashboard?tab=import' },
      { id: 'reports', label: 'Reports', href: '/admin/dashboard?tab=reports' },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'knowledge', label: 'Processing', href: '/admin/knowledge-processing' },
      { id: 'security', label: 'Security', href: '/admin/security-management' },
      { id: 'integration', label: 'Data sync', href: '/data-integration' },
    ],
  },
];

const MANAGER_NAV: NavSectionConfig[] = [
  {
    title: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Overview', href: '/manager/dashboard?tab=dashboard' },
      { id: 'projects', label: 'Projects', href: '/manager/dashboard?tab=projects' },
      { id: 'faculty', label: 'Faculty', href: '/manager/dashboard?tab=faculty' },
      { id: 'analytics', label: 'Analytics', href: '/manager/dashboard?tab=analytics' },
      { id: 'strategic', label: 'Strategy', href: '/manager/dashboard?tab=strategic' },
      { id: 'publications', label: 'Publications', href: '/manager/dashboard?tab=publications' },
      { id: 'reports', label: 'Reports', href: '/manager/dashboard?tab=reports' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { id: 'reports-standalone', label: 'Report builder', href: '/manager/reports' },
      { id: 'integration', label: 'Data sync', href: '/data-integration' },
      { id: 'expertise', label: 'Expertise', href: '/expertise-map' },
      { id: 'network', label: 'Network', href: '/network' },
    ],
  },
];

const FUNDER_NAV: NavSectionConfig[] = [
  {
    items: [
      { id: 'overview', label: 'Overview', href: '/funder/dashboard?tab=overview' },
      { id: 'discover', label: 'Discover', href: '/funder/dashboard?tab=discover' },
      { id: 'portfolio', label: 'Portfolio', href: '/funder/dashboard?tab=portfolio' },
      { id: 'rfps', label: 'Opportunities', href: '/funder/dashboard?tab=rfps' },
    ],
  },
];

const DEPARTMENT_NAV: NavSectionConfig[] = [
  {
    items: [
      { id: 'overview', label: 'Overview', href: '/department/dashboard?tab=overview' },
      { id: 'researchers', label: 'Faculty', href: '/department/dashboard?tab=researchers' },
      { id: 'performance', label: 'Performance', href: '/department/dashboard?tab=performance' },
      { id: 'funding', label: 'Funding', href: '/department/dashboard?tab=funding' },
      { id: 'network', label: 'Network', href: '/network' },
    ],
  },
];

const RESEARCHER_NAV: NavSectionConfig[] = [
  {
    items: [
      { id: 'feed', label: 'Feed', href: '/feed' },
      { id: 'upload', label: 'Submit Research', href: '/researcher/upload' },
      { id: 'requests', label: 'Inbox', href: '/requests', badgeFrom: 'requests' },
      { id: 'analytics', label: 'Analytics', href: '/researcher/analytics' },
      { id: 'network', label: 'Network', href: '/network' },
      { id: 'trends', label: 'Trends', href: '/trends' },
      { id: 'funding', label: 'Funding', href: '/funding' },
    ],
  },
];

const NAV_BY_ROLE: Record<UserRole, NavSectionConfig[]> = {
  admin: ADMIN_NAV,
  manager: MANAGER_NAV,
  funder: FUNDER_NAV,
  department_head: DEPARTMENT_NAV,
  researcher: RESEARCHER_NAV,
};

/** Shared routes any authenticated role may open from the shell header menu. */
const SHARED_PATHS = new Set(['/my-profile', '/settings']);

export function homePathForRole(role: string | undefined): string {
  if (!role || role === 'researcher') return ROLE_HOME.researcher;
  return ROLE_HOME[role as UserRole] ?? ROLE_HOME.researcher;
}

export function getNavigationSections(
  role: string | undefined,
  pending: PendingNavCounts,
): NavSectionConfig[] {
  const key: UserRole = !role || role === 'researcher' ? 'researcher' : (role as UserRole);
  const sections = NAV_BY_ROLE[key] ?? RESEARCHER_NAV;

  return sections.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      badge: item.badgeFrom ? pending[item.badgeFrom] : undefined,
    })),
  }));
}

export function parseNavHref(href: string): { pathname: string; search: string } {
  const queryIndex = href.indexOf('?');
  if (queryIndex === -1) {
    return { pathname: href, search: '' };
  }
  return {
    pathname: href.slice(0, queryIndex),
    search: href.slice(queryIndex),
  };
}

export function flattenNavItems(sections: NavSectionConfig[]): NavItemConfig[] {
  return sections.flatMap(section => section.items);
}

export function isPathAllowedForRole(pathname: string, role: string | undefined): boolean {
  if (SHARED_PATHS.has(pathname)) return true;
  if (pathname.startsWith('/research/') || pathname.startsWith('/researcher/profile/')) return true;
  if (pathname.startsWith('/researcher/upload')) {
    return !role || role === 'researcher';
  }

  const sections = getNavigationSections(role, {
    researchers: 0,
    publications: 0,
    funders: 0,
    requests: 0,
  });

  const allowed = new Set(
    flattenNavItems(sections).map(item => parseNavHref(item.href).pathname),
  );

  return allowed.has(pathname);
}
