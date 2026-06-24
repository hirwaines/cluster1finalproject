import { RefreshCw } from 'lucide-react';
import { Badge } from './ui/badge';

interface DataFreshnessProps {
  lastUpdated?: string | Date;
  isLoading?: boolean;
  variant?: 'default' | 'compact';
}

export function DataFreshness({
  lastUpdated,
  isLoading = false,
  variant = 'default'
}: DataFreshnessProps) {
  const getTimeAgo = (date: string | Date) => {
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return updated.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const displayTime = lastUpdated ? getTimeAgo(lastUpdated) : 'Never';

  if (variant === 'compact') {
    return (
      <Badge variant="outline" className="text-xs">
        <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        {displayTime}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
      <span>
        Last updated: <span className="font-medium">{displayTime}</span>
      </span>
    </div>
  );
}
