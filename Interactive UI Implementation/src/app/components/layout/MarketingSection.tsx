import { ReactNode } from 'react';
import { cn } from '../ui/utils';

type SectionTone = 'default' | 'muted' | 'card' | 'brand-muted' | 'dark' | 'hero';

type MarketingSectionProps = {
  id?: string;
  tone?: SectionTone;
  variant?: 'default' | 'hero';
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<SectionTone, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted/40 text-foreground',
  card: 'bg-card text-foreground border-y border-border/70',
  'brand-muted': 'bg-brand-muted/30 text-foreground',
  dark: 'bg-brand-dark text-white',
  hero: 'bg-gradient-to-br from-brand-muted/50 via-background to-background text-foreground border-b border-border/50',
};

export function MarketingSection({
  id,
  tone = 'default',
  variant = 'default',
  className,
  children,
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        toneClasses[tone],
        variant === 'hero' ? 'pt-16 pb-20 md:pt-20 md:pb-24' : 'py-20 md:py-24',
        id && 'scroll-mt-20',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">{eyebrow}</p>
      )}
      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{title}</h2>
      {description && <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}
