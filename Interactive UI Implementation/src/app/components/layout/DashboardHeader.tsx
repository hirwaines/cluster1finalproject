import { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { Button } from '../ui/button';
import { UserAvatar } from '../ui/UserAvatar';

type DashboardHeaderProps = {
  title?: string;
  userName?: string;
  userRole?: string;
  onLogout: () => void;
  trailing?: ReactNode;
};

export function DashboardHeader({
  title,
  userName,
  userRole,
  onLogout,
  trailing,
}: DashboardHeaderProps) {
  return (
    <nav className="bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo />
            {title && (
              <span className="font-display font-semibold text-brand hidden sm:inline">{title}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {trailing}
            {userName && (
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <UserAvatar name={userName} />
                <div className="text-left hidden md:block">
                  <div className="font-medium text-sm">{userName}</div>
                  {userRole && <div className="text-xs text-muted-foreground">{userRole}</div>}
                </div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
