import { useState, useRef, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { BrandLogo } from './BrandLogo';
import { Settings, Plus, Search, LogOut, User, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './ui/UserAvatar';
import {
  SIDEBAR_WIDTH,
  navItemClass,
  NavActiveIndicator,
  RESEARCHER_NAV,
  isNavActive,
  getAdminNavSections,
  getManagerNavSections,
  getFunderNavSections,
  getDepartmentNavSections,
  homePathForRole,
  type NavLink,
} from './layout/navStyles';
import { isPathAllowedForRole } from '../config/navigation';
import { dashboardPageClass } from './layout/dashboardStyles';
import { ShellPageHeader } from './layout/ShellPageHeader';
import { resolvePageMeta, roleWorkspaceLabel } from './layout/pageMeta';
import { PageHeaderProvider } from '../context/PageHeaderContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { NotificationDropdown } from './NotificationDropdown';
import { ChatPanel, ChatHeaderButton } from './ChatPanel';

function sidebarLinksForRole(
  role: string | undefined,
  pending: { researchers: number; publications: number; funders: number },
): { title?: string; items: NavLink[] }[] {
  if (role === 'researcher' || !role) {
    return [{ items: RESEARCHER_NAV }];
  }
  if (role === 'admin') return getAdminNavSections(pending);
  if (role === 'manager') return getManagerNavSections();
  if (role === 'funder') return getFunderNavSections();
  if (role === 'department_head') return getDepartmentNavSections();
  return [{ items: RESEARCHER_NAV }];
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

  const pendingRequestsCount =
    collaborationRequests.filter(
      req =>
        (req.toUserId === user?.id && req.status === 'pending') ||
        req.fromUserId === user?.id,
    ).length;

  const unreadChat =
    user?.id != null
      ? chatMessages.filter(m => m.receiverId === user.id && !m.read).length
      : 0;

  const navSections = useMemo(() => {
    const sections = sidebarLinksForRole(user?.role, {
      researchers: pendingResearchers.length,
      publications: pendingPublications.length,
      funders: pendingFunders.length,
    });
    if (user?.role === 'researcher' || !user?.role) {
      return sections.map(section => ({
        ...section,
        items: section.items.map(item =>
          item.href === '/requests' ? { ...item, badge: pendingRequestsCount } : item,
        ),
      }));
    }
    return sections;
  }, [
    user?.role,
    pendingResearchers.length,
    pendingPublications.length,
    pendingFunders.length,
    pendingRequestsCount,
  ]);

  const flatNavLinks = useMemo(
    () =>
      navSections.flatMap(section =>
        section.items.map(item => ({
          href: item.href ?? '/feed',
          icon: item.icon,
          label: item.label,
          badge: item.badge,
        })),
      ),
    [navSections],
  );
  const pageMeta = useMemo(
    () => resolvePageMeta(location.pathname, location.search, flatNavLinks),
    [location.pathname, location.search, flatNavLinks],
  );

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    if (!isPathAllowedForRole(location.pathname, user.role)) {
      navigate(homePathForRole(user.role), { replace: true });
    }
  }, [user, location.pathname, navigate]);

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
  const workspaceLabel = roleWorkspaceLabel(user.role);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Full viewport-height sidebar */}
      <aside
        className={`hidden h-screen shrink-0 flex-col border-r border-border/80 bg-card ${SIDEBAR_WIDTH} md:flex`}
      >
        <div className="flex h-14 shrink-0 items-center border-b border-border/80 px-4">
          <button
            type="button"
            className="min-w-0"
            onClick={() => navigate(homePathForRole(user.role))}
          >
            <BrandLogo size="sm" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-3">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-brand-dark/80">{workspaceLabel}</p>

          {navSections.map((section, idx) => (
            <div key={section.title ?? idx}>
              {section.title && (
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  {section.title}
                </p>
              )}
              <nav className="flex flex-col gap-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const href = item.href ?? '/feed';
                  const active = isNavActive(location.pathname, location.search, href);
                  return (
                    <button
                      key={href + item.label}
                      type="button"
                      onClick={() => navigate(href)}
                      className={navItemClass(active)}
                    >
                      <NavActiveIndicator isActive={active} />
                      <Icon className={cnIcon(active)} />
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <Badge
                          className={`h-5 min-w-5 border-0 px-1.5 text-[10px] ${
                            active ? 'bg-brand text-white' : 'bg-brand/90 text-white'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}

          <div className="mt-auto border-t border-border/80 pt-3">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main column — fills remaining screen width */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/80 bg-card px-4 sm:gap-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 md:hidden">
            <button type="button" onClick={() => navigate(homePathForRole(user.role))}>
              <BrandLogo size="sm" />
            </button>
          </div>

          <div className="hidden min-w-0 md:block lg:w-44 xl:w-52">
            <p className="truncate text-sm font-semibold text-brand-dark">{pageMeta.title}</p>
            <p className="truncate text-[11px] text-muted-foreground">{workspaceLabel}</p>
          </div>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand/60" />
            <Input
              placeholder="Search researchers, papers, projects…"
              className="h-9 w-full border-brand/15 bg-brand-muted/40 pl-9 text-sm focus-visible:border-brand/30 focus-visible:ring-brand/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {isResearcher && (
              <Button
                size="sm"
                className="hidden h-9 sm:inline-flex"
                onClick={() => navigate('/researcher/upload')}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">Share</span>
              </Button>
            )}

            <NotificationDropdown />
            <ChatHeaderButton unreadTotal={unreadChat} />

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-1.5 rounded-lg border border-border/60 p-1 pl-1.5 hover:bg-muted/50"
              >
                <UserAvatar name={user.name} size="sm" />
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-border bg-card py-1 shadow-lg">
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/my-profile');
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                  >
                    <User className="h-4 w-4" /> Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-white">
          <PageHeaderProvider>
            <div className={dashboardPageClass}>
              <ShellPageHeader title={pageMeta.title} description={pageMeta.description} />
              <Outlet />
            </div>
          </PageHeaderProvider>
        </main>
      </div>

      <ChatPanel />
    </div>
  );
}

function cnIcon(active: boolean) {
  return `h-4 w-4 shrink-0 ${active ? 'text-brand' : 'text-muted-foreground'}`;
}

export function ResearcherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
