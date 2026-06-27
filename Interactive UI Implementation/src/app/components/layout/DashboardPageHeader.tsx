import { ReactNode } from 'react';
import { dashboardPageSubtitleClass, dashboardPageTitleClass } from './dashboardStyles';
import { cn } from '../ui/utils';

type DashboardPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function DashboardPageHeader({ title, description, actions, className }: DashboardPageHeaderProps) {
  return (
    <div className={cn('mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="min-w-0">
        <h1 className={dashboardPageTitleClass}>{title}</h1>
        {description && <p className={dashboardPageSubtitleClass}>{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
