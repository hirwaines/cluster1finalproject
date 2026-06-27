import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function SystemAnnouncements({ limit }: { limit?: number }) {
  const { systemAnnouncements } = useApp();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const activeAnnouncements = systemAnnouncements.filter(announcement => {
    if (dismissed.has(announcement.id)) return false;
    if (announcement.expiresAt) {
      const expiryDate = new Date(announcement.expiresAt);
      const now = new Date();
      if (now > expiryDate) return false;
    }
    return true;
  });

  const displayedAnnouncements = limit
    ? activeAnnouncements.slice(0, limit)
    : activeAnnouncements;

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-brand" />;
    }
  };

  const getAnnouncementStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-muted/50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
      default:
        return 'bg-brand-muted border-border';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  if (displayedAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {displayedAnnouncements.map(announcement => (
        <Card
          key={announcement.id}
          className={`p-4 border-2 ${getAnnouncementStyle(announcement.type)}`}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getAnnouncementIcon(announcement.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-sm">{announcement.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      announcement.type === 'success' ? 'border-green-600 text-success-foreground' :
                      announcement.type === 'warning' ? 'border-orange-600 text-orange-700' :
                      'border-brand text-brand'
                    }`}
                  >
                    {announcement.type}
                  </Badge>
                  <button
                    onClick={() => handleDismiss(announcement.id)}
                    className="p-1 hover:bg-black/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground mb-2">
                {announcement.message}
              </p>
              <div className="text-xs text-muted-foreground">
                {formatDate(announcement.createdAt)}
                {announcement.expiresAt && (
                  <span> • Expires {formatDate(announcement.expiresAt)}</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
