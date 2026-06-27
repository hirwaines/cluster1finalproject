import { useState, useRef, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { BrandLogo } from './BrandLogo';
import {
  Settings,
  Plus,
  Search,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './ui/UserAvatar';
import {
  SIDEBAR_WIDTH,
  navItemClass,
  RESEARCHER_NAV,
  pathMatchesNav,
  getAdminNavSections,
  getManagerNavSections,
  getFunderNavSections,
  getDepartmentNavSections,
  homePathForRole,
} from './layout/navStyles';
import { dashboardPageClass } from './layout/dashboardStyles';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { NotificationDropdown } from './NotificationDropdown';
import { ChatPanel, ChatHeaderButton } from './ChatPanel';
import type { LucideIcon } from 'lucide-react';

type SidebarItem = {
  path: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
};

function roleTitle(role: string | undefined): string {
  switch (role) {
    case 'admin':
      return 'Administration';
    case 'manager':
      return 'Research management';
    case 'department_head':
      return 'Department';
    case 'funder':
      return 'Funder portal';
    default:
      return 'Research workspace';
  }
}

function sidebarForRole(
  role: string | undefined,
  pending: { researchers: number; publications: number; funders: number },
): SidebarItem[] {
  if (role === 'researcher' || !role) {
    return RESEARCHER_NAV.map(item => ({ ...item }));
  }

  const sections =
    role === 'admin'
      ? getAdminNavSections(pending)
      : role === 'manager'
        ? getManagerNavSections()
        : role === 'funder'
          ? getFunderNavSections()
          : role === 'department_head'
            ? getDepartmentNavSections()
            : [];

  return sections.flatMap(section =>
    section.items.map(item => ({
      path: item.href ?? '/feed',
      icon: item.icon,
      label: item.label,
      badge: item.badge,
    })),
  );
}

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    logout,
    collaborationRequests,
    chatMessages,
    pendingResearchers,
    pendingPublications,
    pendingFunders,
  } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const incomingPending = collaborationRequests.filter(
    req => req.toUserId === user?.id && req.status === 'pending',
  ).length;
  const sentApplications = collaborationRequests.filter(
    req => req.fromUserId === user?.id,
  ).length;
  const pendingRequestsCount = incomingPending + sentApplications;

  const unreadChat =
    user?.id != null
      ? chatMessages.filter(m => m.receiverId === user.id && !m.read).length
      : 0;

  const navItems = useMemo(() => {
    const items = sidebarForRole(user?.role, {
      researchers: pendingResearchers.length,
      publications: pendingPublications.length,
      funders: pendingFunders.length,
    });
    if (user?.role === 'researcher' || !user?.role) {
      return items.map(item =>
        item.path === '/requests' ? { ...item, badge: pendingRequestsCount } : item,
      );
    }
    return items;
  }, [
    user?.role,
    pendingResearchers.length,
    pendingPublications.length,
    pendingFunders.length,
    pendingRequestsCount,
  ]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const isResearcher = user.role === 'researcher' || user.role === undefined;

  return (
    <div className="min-h-screen bg-[var(--surface)] flex flex-col">
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            <button
              type="button"
              className="cursor-pointer shrink-0"
              onClick={() => navigate(homePathForRole(user.role))}
            >
              <BrandLogo />
            </button>

            {isResearcher ? (
              <div className="relative w-72 lg:w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search researchers, topics, papers…"
                  className="pl-10 bg-muted/50 border-border"
                />
              </div>
            ) : (
              <span className="font-display font-semibold text-brand hidden sm:inline truncate">
                {roleTitle(user.role)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isResearcher && (
              <Button onClick={() => navigate('/researcher/upload')} className="hidden sm:inline-flex">
                <Plus className="w-4 h-4 mr-2" />
                Share research
              </Button>
            )}

            <NotificationDropdown />
            <ChatHeaderButton unreadTotal={unreadChat} />

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <UserAvatar name={user.name} />
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 bg-card rounded-xl shadow-lg border border-border py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <div className="font-semibold text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/my-profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="border-t border-border mt-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className={`hidden md:flex ${SIDEBAR_WIDTH} shrink-0 flex-col border-r border-border bg-card sticky top-[65px] self-start max-h-[calc(100vh-65px)] overflow-y-auto`}
        >
          <div className="p-4 flex flex-col gap-1 flex-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathMatchesNav(location.pathname, item.path);

              return (
                <button
                  key={item.path + item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={navItemClass(isActive)}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-left leading-snug">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <Badge
                      className={`text-[10px] px-1.5 py-0 h-5 min-w-5 ${
                        isActive ? 'bg-white/20 text-white border-0' : 'bg-destructive text-white border-0'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-auto border-t border-border">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className={dashboardPageClass}>
            <Outlet />
          </div>
        </main>
      </div>

      <ChatPanel />
    </div>
  );
}

/** Legacy wrapper — pages should rely on route layout instead. */
export function ResearcherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
