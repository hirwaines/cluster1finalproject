import {
  Home,
  Inbox,
  BarChart3,
  TrendingUp,
  DollarSign,
  Network,
  GraduationCap,
  FileText,
  Award,
  Users,
  Upload,
  Library,
  Shield,
  Database,
  Target,
  LayoutDashboard,
  Search,
  Briefcase,
  FilePlus,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { cn } from '../ui/utils';
import type { DashboardNavSection } from './DashboardShell';
import {
  DASHBOARD_DEFAULT_TAB,
  getNavigationSections,
  homePathForRole,
  parseNavHref,
  type NavItemConfig,
  type PendingNavCounts,
} from '../../config/navigation';

export { DASHBOARD_DEFAULT_TAB, homePathForRole, parseNavHref };

export const SIDEBAR_WIDTH = 'w-64';

const ICON_BY_ID: Record<string, typeof Home> = {
  feed: Home,
  requests: Inbox,
  analytics: BarChart3,
  network: Network,
  trends: TrendingUp,
  funding: DollarSign,
  overview: LayoutDashboard,
  dashboard: LayoutDashboard,
  accreditations: GraduationCap,
  publications: FileText,
  funders: Award,
  users: Users,
  import: Upload,
  knowledge: Library,
  security: Shield,
  reports: BarChart3,
  integration: Database,
  expertise: Target,
  projects: FileText,
  faculty: Users,
  strategic: Sparkles,
  discover: Search,
  portfolio: Briefcase,
  rfps: FilePlus,
  researchers: Users,
  performance: TrendingUp,
};

export type NavLink = {
  href: string;
  icon: typeof Home;
  label: string;
  badge?: number;
};

export function navItemClass(isActive: boolean) {
  return cn(
    'group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all',
    isActive
      ? 'bg-brand-muted text-brand shadow-sm ring-1 ring-brand/10'
      : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
  );
}

export function NavActiveIndicator({ isActive }: { isActive: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand transition-opacity',
        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-30',
      )}
    />
  );
}

export function tabClass(isActive: boolean) {
  return cn(
    'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
    isActive
      ? 'bg-brand-muted text-brand'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  );
}

export const CHART_COLORS = ['#034ea2', '#5b8fd4', '#0c2340', '#7eb0e8', '#023a7a'];

function itemToNavLink(item: NavItemConfig): NavLink {
  return {
    href: item.href,
    icon: ICON_BY_ID[item.id] ?? FileText,
    label: item.label,
    badge: item.badge,
  };
}

export function isNavActive(pathname: string, search: string, href: string): boolean {
  const [path, queryString] = href.split('?');

  if (pathname !== path) {
    if (path === '/feed' && (pathname === '/discover' || pathname.startsWith('/research/'))) {
      return !queryString;
    }
    if (path === '/network' && pathname === '/collaborators') {
      return !queryString;
    }
    return false;
  }

  if (!queryString) {
    const params = new URLSearchParams(search);
    const tab = params.get('tab');
    const defaultTab = DASHBOARD_DEFAULT_TAB[path];
    if (defaultTab) {
      return !tab || tab === defaultTab;
    }
    return true;
  }

  const hrefParams = new URLSearchParams(queryString);
  const currentParams = new URLSearchParams(search);
  const defaultTab = DASHBOARD_DEFAULT_TAB[path];

  for (const [key, value] of hrefParams.entries()) {
    const current = currentParams.get(key);
    if (!current && key === 'tab' && defaultTab && value === defaultTab) {
      continue;
    }
    if (current !== value) return false;
  }
  return true;
}

/** @deprecated use isNavActive */
export function pathMatchesNav(pathname: string, itemPath: string): boolean {
  return isNavActive(pathname, '', itemPath);
}

export function getAdminNavSections(pending: Omit<PendingNavCounts, 'requests'>): DashboardNavSection[] {
  return resolveNavSections('admin', { ...pending, requests: 0 });
}

export function getManagerNavSections(): DashboardNavSection[] {
  return resolveNavSections('manager', { researchers: 0, publications: 0, funders: 0, requests: 0 });
}

export function getFunderNavSections(): DashboardNavSection[] {
  return resolveNavSections('funder', { researchers: 0, publications: 0, funders: 0, requests: 0 });
}

export function getDepartmentNavSections(): DashboardNavSection[] {
  return resolveNavSections('department_head', { researchers: 0, publications: 0, funders: 0, requests: 0 });
}

export const RESEARCHER_NAV: NavLink[] = resolveNavSections('researcher', {
  researchers: 0,
  publications: 0,
  funders: 0,
  requests: 0,
}).flatMap(section => section.items.map(itemToNavLink));

function resolveNavSections(role: string, pending: PendingNavCounts): DashboardNavSection[] {
  return getNavigationSections(role, pending).map(section => ({
    title: section.title,
    items: section.items.map(item => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: ICON_BY_ID[item.id] ?? FileText,
      badge: item.badge,
    })),
  }));
}

export function navSectionsToLinks(sections: DashboardNavSection[]): NavLink[] {
  return sections.flatMap(section =>
    section.items.map(item => ({
      href: item.href ?? '/feed',
      icon: item.icon,
      label: item.label,
      badge: item.badge,
    })),
  );
}
