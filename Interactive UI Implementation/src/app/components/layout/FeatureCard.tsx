import { ReactNode } from 'react';
import { cn } from '../ui/utils';

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: 'brand' | 'rw';
};

export function FeatureCard({ icon, title, description, accent = 'brand' }: FeatureCardProps) {
  const isBrand = accent === 'brand';

  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-brand/40 hover:shadow-lg transition-all">
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
          isBrand ? 'bg-brand-muted text-brand' : 'bg-brand/10 text-brand-dark',
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
