import { DashboardPageHeader } from './DashboardPageHeader';
import { usePageHeaderContext } from '../../context/PageHeaderContext';
import type { PageMeta } from './pageMeta';

type ShellPageHeaderProps = PageMeta;

export function ShellPageHeader({ title, description }: ShellPageHeaderProps) {
  const { override, actions } = usePageHeaderContext();

  return (
    <DashboardPageHeader
      title={override?.title ?? title}
      description={override?.description ?? description}
      actions={actions}
    />
  );
}
