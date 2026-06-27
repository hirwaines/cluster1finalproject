import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';
import { dashboardCardClass, dashboardCardPadding } from './dashboardStyles';

type StatAccent = 'brand' | 'rw' | 'dark' | 'muted' | 'warm';

const accentIconWell: Record<StatAccent, string> = {
  brand: 'bg-brand-muted text-brand',
  rw: 'bg-accent-rw/10 text-accent-rw',
  dark: 'bg-brand-dark/10 text-brand-dark',
  muted: 'bg-muted text-muted-foreground',
  warm: 'bg-accent-warm/10 text-accent-warm',
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
    <div className={cn(dashboardCardClass, dashboardCardPadding, className)}>
      <div className={cn('inline-flex p-2.5 rounded-lg mb-4', accentIconWell[accent])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-3xl text-foreground leading-none mb-1.5">{value}</div>
      <div className="text-sm font-medium text-foreground/80">{label}</div>
      {hint && <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{hint}</div>}
    </div>
  );
}
