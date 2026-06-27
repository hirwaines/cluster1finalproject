import { cn } from './utils';

type UserAvatarProps = {
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-32 h-32 text-5xl',
};

export function UserAvatar({ name, className, size = 'md' }: UserAvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div
      className={cn(
        'rounded-full bg-brand flex items-center justify-center text-brand-foreground font-semibold shrink-0',
        sizeClasses[size],
        className,
      )}
    >
      {initial}
    </div>
  );
}
