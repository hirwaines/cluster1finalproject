import { BookOpen } from 'lucide-react';
import { cn } from './ui/utils';

type BrandLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Use on dark backgrounds (footer, CTA) for consistent contrast */
  variant?: 'default' | 'onDark';
};

const sizes = {
  sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base' },
  md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xl' },
  lg: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-2xl' },
};

export function BrandLogo({
  className,
  iconClassName,
  textClassName,
  showText = true,
  size = 'md',
  variant = 'default',
}: BrandLogoProps) {
  const s = sizes[size];
  const onDark = variant === 'onDark';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          s.box,
          'rounded-md flex items-center justify-center shadow-sm',
          onDark
            ? 'bg-white/15 ring-1 ring-white/20'
            : 'bg-brand ring-1 ring-brand/20',
        )}
      >
        <BookOpen
          className={cn(
            s.icon,
            onDark ? 'text-white' : 'text-brand-foreground',
            iconClassName,
          )}
        />
      </div>
      {showText && (
        <span
          className={cn(
            'font-display font-bold tracking-tight',
            onDark ? 'text-white' : 'text-brand',
            s.text,
            textClassName,
          )}
        >
          ResearchIQ
        </span>
      )}
    </div>
  );
}
