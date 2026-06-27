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
} from 'lucide-react';
import { cn } from '../ui/utils';
import type { DashboardNavSection } from './DashboardShell';

export const SIDEBAR_WIDTH = 'w-[17.5rem]';

export function navItemClass(isActive: boolean) {
  return cn(
    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
    isActive
      ? 'bg-brand text-white font-medium'
      : 'text-foreground hover:bg-muted',
  );
}

export function tabClass(isActive: boolean) {
  return cn(
    'flex items-center gap-2 px-5 py-3 font-medium text-sm transition-colors',
    isActive ? 'border-b-2 border-brand text-brand' : 'text-muted-foreground hover:text-foreground',
  );
}

export const CHART_COLORS = ['#034ea2', '#009639', '#0c2340', '#5b8fd4', '#38a169', '#023a7a'];

export type AppNavItem = {
  path: string;
  icon: typeof Home;
  label: string;
  badge?: number;
};

export const RESEARCHER_NAV: AppNavItem[] = [
  { path: '/feed', icon: Home, label: 'Feed' },
  { path: '/requests', icon: Inbox, label: 'Inbox' },
  { path: '/researcher/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/network', icon: Network, label: 'Network' },
  { path: '/trends', icon: TrendingUp, label: 'Trends' },
  { path: '/funding', icon: DollarSign, label: 'Funding' },
];

export function pathMatchesNav(pathname: string, itemPath: string): boolean {
  if (pathname === itemPath) return true;
  if (itemPath === '/feed' && (pathname === '/discover' || pathname.startsWith('/research/'))) return true;
  if (itemPath === '/network' && pathname === '/collaborators') return true;
  if (itemPath === '/researcher/analytics' && pathname.startsWith('/researcher/profile')) return false;
  return pathname.startsWith(itemPath + '/');
}

export function getAdminNavSections(pending: {
  researchers: number;
  publications: number;
  funders: number;
}): DashboardNavSection[] {
  return [
    {
      items: [
        { id: 'accreditations', label: 'Accreditations', icon: GraduationCap, href: '/admin/dashboard', badge: pending.researchers },
        { id: 'publications', label: 'Publications', icon: FileText, href: '/admin/dashboard', badge: pending.publications },
        { id: 'funders', label: 'Funders', icon: Award, href: '/admin/dashboard', badge: pending.funders },
        { id: 'users', label: 'Users', icon: Users, href: '/admin/dashboard' },
        { id: 'import', label: 'Import', icon: Upload, href: '/admin/dashboard' },
        { id: 'knowledge', label: 'Processing', icon: Library, href: '/admin/knowledge-processing' },
        { id: 'security', label: 'Security', icon: Shield, href: '/admin/security-management' },
        { id: 'reports', label: 'Reports', icon: BarChart3, href: '/manager/reports' },
        { id: 'integration', label: 'Data sync', icon: Database, href: '/data-integration' },
      ],
    },
  ];
}

export function getManagerNavSections(): DashboardNavSection[] {
  return [
    {
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/manager/dashboard' },
        { id: 'reports', label: 'Reports', icon: FileText, href: '/manager/reports' },
        { id: 'integration', label: 'Data sync', icon: Database, href: '/data-integration' },
        { id: 'expertise', label: 'Expertise', icon: Target, href: '/expertise-map' },
        { id: 'network', label: 'Network', icon: Network, href: '/network' },
      ],
    },
  ];
}

export function getFunderNavSections(): DashboardNavSection[] {
  return [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/funder/dashboard' },
        { id: 'discover', label: 'Discover', icon: Search, href: '/funder/dashboard' },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase, href: '/funder/dashboard' },
        { id: 'rfps', label: 'Opportunities', icon: FilePlus, href: '/funder/dashboard' },
      ],
    },
  ];
}

export function getDepartmentNavSections(): DashboardNavSection[] {
  return [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: BarChart3, href: '/department/dashboard' },
        { id: 'researchers', label: 'Faculty', icon: Users, href: '/department/dashboard' },
        { id: 'performance', label: 'Performance', icon: TrendingUp, href: '/department/dashboard' },
        { id: 'funding', label: 'Funding', icon: DollarSign, href: '/department/dashboard' },
        { id: 'network', label: 'Network', icon: Network, href: '/network' },
      ],
    },
  ];
}

export function homePathForRole(role: string | undefined): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'funder':
      return '/funder/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'department_head':
      return '/department/dashboard';
    default:
      return '/feed';
  }
}
