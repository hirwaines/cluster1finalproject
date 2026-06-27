import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LucideIcon, LogOut } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { navItemClass, SIDEBAR_WIDTH } from './navStyles';
import { Badge } from '../ui/badge';
import { ChatPanel } from '../ChatPanel';
import { cn } from '../ui/utils';

export type DashboardNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  href?: string;
};

export type DashboardNavSection = {
  title?: string;
  items: DashboardNavItem[];
};

type DashboardShellProps = {
  roleTitle: string;
  userName: string;
  userRoleLabel: string;
  onLogout: () => void;
  sections: DashboardNavSection[];
  activeId?: string;
  onSelect?: (id: string) => void;
  trailing?: ReactNode;
  sidebarFooter?: ReactNode;
  children: ReactNode;
  showChat?: boolean;
};

function pathActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  return pathname.startsWith(href + '/');
}

export function DashboardShell({
  roleTitle,
  userName,
  userRoleLabel,
  onLogout,
  sections,
  activeId,
  onSelect,
  trailing,
  sidebarFooter,
  children,
  showChat = true,
}: DashboardShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item: DashboardNavItem) => {
    if (item.href) {
      navigate(item.href);
      return;
    }
    onSelect?.(item.id);
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex flex-col">
      <DashboardHeader
        title={roleTitle}
        userName={userName}
        userRole={userRoleLabel}
        onLogout={onLogout}
        trailing={trailing}
      />

      <div className="flex flex-1 min-h-0">
        <aside
          className={`hidden md:flex ${SIDEBAR_WIDTH} shrink-0 flex-col border-r border-border bg-card sticky top-[73px] self-start max-h-[calc(100vh-73px)] overflow-y-auto`}
        >
          <div className="p-4 flex flex-col gap-1 flex-1">
            {sections.map((section, idx) => (
              <div key={section.title ?? idx} className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = item.href
                    ? pathActive(location.pathname, item.href)
                    : activeId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={navItemClass(isActive)}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="flex-1 text-left leading-snug">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <Badge
                          className={cn(
                            'text-[10px] px-1.5 py-0 h-5 min-w-5',
                            isActive ? 'bg-white/20 text-white border-0' : 'bg-destructive text-white border-0',
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {sidebarFooter ?? (
              <div className="pt-4 mt-auto border-t border-border">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {showChat && <ChatPanel />}
    </div>
  );
}
