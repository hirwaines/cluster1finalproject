import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { Button } from '../ui/button';
import { NCST } from '../../content/ncst';
import { cn } from '../ui/utils';

type AuthShellProps = {
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
  maxWidth?: 'md' | 'lg' | 'xl';
  variant?: 'default' | 'split';
  /** Panel shown on the left when variant is split (defaults to brand panel) */
  aside?: ReactNode;
};

const widths = {
  md: 'max-w-md',
  lg: 'max-w-4xl',
  xl: 'max-w-7xl',
};

function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between bg-brand-dark text-white p-10 xl:p-14 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(3,78,162,0.35),_transparent_55%)]" />
      <div className="relative">
        <BrandLogo variant="onDark" size="lg" className="mb-10" />
        <h1 className="font-display text-4xl xl:text-5xl font-normal leading-tight mb-5">
          Research<span className="text-brand-muted">IQ</span>
        </h1>
        <p className="text-white/75 text-lg leading-relaxed max-w-md">
          National research intelligence for {NCST.country} — verified profiles, collaboration, and analytics for
          the {NCST.shortName} ecosystem.
        </p>
      </div>
      <p className="relative text-sm text-white/45">
        {NCST.city}, {NCST.country} · Case study prototype
      </p>
    </div>
  );
}

function AuthTopBar({
  backTo,
  backLabel,
  maxWidth,
}: {
  backTo: string;
  backLabel: string;
  maxWidth: keyof typeof widths;
}) {
  const navigate = useNavigate();

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className={cn(widths[maxWidth], 'mx-auto px-6 py-4 flex items-center gap-4')}>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(backTo)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel}
        </Button>
        <div className="flex-1 flex justify-center lg:hidden">
          <BrandLogo size="sm" />
        </div>
        <div className="hidden lg:block w-[120px]" aria-hidden />
      </div>
    </header>
  );
}

export function AuthShell({
  children,
  backTo = '/',
  backLabel = 'Back to Home',
  maxWidth = 'lg',
  variant = 'default',
  aside,
}: AuthShellProps) {
  if (variant === 'split') {
    return (
      <div className="min-h-screen grid lg:grid-cols-2 bg-background">
        {aside ?? <AuthBrandPanel />}
        <div className="flex flex-col min-h-screen">
          <AuthTopBar backTo={backTo} backLabel={backLabel} maxWidth="md" />
          <main className="flex-1 flex items-center justify-center px-6 py-10 md:py-14">
            <div className="w-full max-w-md">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthTopBar backTo={backTo} backLabel={backLabel} maxWidth={maxWidth} />
      <main className={cn(widths[maxWidth], 'mx-auto px-6 py-12')}>{children}</main>
    </div>
  );
}
