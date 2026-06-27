import { cn } from './utils';

export type StatusVariant = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'info';

const variantStyles: Record<StatusVariant, string> = {
  pending: 'bg-warning-muted text-warning-foreground border-warning/20',
  approved: 'bg-success-muted text-success-foreground border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  active: 'bg-success-muted text-success-foreground border-success/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  info: 'bg-info-muted text-info-foreground border-info/20',
};

const variantLabels: Record<StatusVariant, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  active: 'Active',
  inactive: 'Inactive',
  info: 'Info',
};

type StatusBadgeProps = {
  variant: StatusVariant;
  label?: string;
  className?: string;
};

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize',
        variantStyles[variant],
        className,
      )}
    >
      {label ?? variantLabels[variant]}
    </span>
  );
}

export function statusFromString(status: string): StatusVariant {
  const s = status.toLowerCase();
  if (s === 'pending') return 'pending';
  if (s === 'approved' || s === 'active' || s === 'verified') return 'approved';
  if (s === 'rejected' || s === 'disabled') return 'rejected';
  if (s === 'inactive') return 'inactive';
  return 'info';
}
