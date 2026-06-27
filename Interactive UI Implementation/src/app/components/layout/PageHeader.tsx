import { ReactNode } from 'react';
import { DashboardPageHeader } from './DashboardPageHeader';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, subtitle, description, actions, className }: PageHeaderProps) {
  return (
    <DashboardPageHeader
      title={title}
      description={subtitle ?? description}
      actions={actions}
      className={className}
    />
  );
}
