import { LucideIcon } from 'lucide-react';

type RoleCardProps = {
  icon: LucideIcon;
  role: string;
  description: string;
};

export function RoleCard({ icon: Icon, role, description }: RoleCardProps) {
  return (
    <div className="p-6 rounded-2xl border border-border hover:border-brand/40 hover:shadow-md transition-all bg-card">
      <div className="w-12 h-12 rounded-xl bg-brand-muted flex items-center justify-center text-brand mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{role}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
