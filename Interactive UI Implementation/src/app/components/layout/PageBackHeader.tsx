import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

type PageBackHeaderProps = {
  backTo?: string | number;
  backLabel?: string;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  maxWidth?: 'md' | 'lg' | 'xl' | '7xl';
  actions?: ReactNode;
  className?: string;
};

const widths = {
  md: 'max-w-md',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  '7xl': 'max-w-7xl',
};

export function PageBackHeader({
  backTo = '/',
  backLabel = 'Back',
  title,
  subtitle,
  showLogo = true,
  maxWidth = '7xl',
  actions,
  className,
}: PageBackHeaderProps) {
  const navigate = useNavigate();

  const goBack = () => {
    if (typeof backTo === 'number') navigate(backTo);
    else navigate(backTo);
  };

  return (
    <header className={cn('bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50', className)}>
      <div className={cn(widths[maxWidth], 'mx-auto px-6 py-4 flex items-center gap-4')}>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={goBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel}
        </Button>

        {(title || showLogo) && (
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showLogo && <BrandLogo size="sm" className="hidden sm:flex shrink-0" />}
            {title && (
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
              </div>
            )}
          </div>
        )}

        {actions && <div className="flex items-center gap-2 shrink-0 ml-auto">{actions}</div>}
      </div>
    </header>
  );
}

/** @deprecated Use PageBackHeader — kept for existing imports */
export function StandalonePageHeader({
  title,
  subtitle,
  backTo = -1,
  actions,
  showLogo = true,
}: {
  title: string;
  subtitle?: string;
  backTo?: string | number;
  actions?: ReactNode;
  showLogo?: boolean;
}) {
  return (
    <PageBackHeader
      title={title}
      subtitle={subtitle}
      backTo={backTo}
      backLabel="Back"
      showLogo={showLogo}
      actions={actions}
    />
  );
}
