import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';
import { dashboardCardClass } from './dashboardStyles';

type StatAccent = 'brand' | 'info' | 'dark' | 'muted';

const accentStyles: Record<StatAccent, string> = {
  brand: 'text-brand',
  info: 'text-brand',
  dark: 'text-brand-dark',
  muted: 'text-muted-foreground',
};

const accentBg: Record<StatAccent, string> = {
  brand: 'bg-brand-muted',
  info: 'bg-brand-muted/70',
  dark: 'bg-brand-dark/8',
  muted: 'bg-muted',
};

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: StatAccent;
  hint?: string;
  className?: string;
};

export function StatCard({ label, value, icon: Icon, accent = 'brand', hint, className }: StatCardProps) {
  return (
    <div className={cn(dashboardCardClass, 'flex items-center gap-3 p-4', className)}>
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', accentBg[accent])}>
        <Icon className={cn('h-[18px] w-[18px]', accentStyles[accent])} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-xl font-semibold leading-none tracking-tight text-brand-dark">{value}</p>
        {hint && <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
