import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { Bell, Check, X, Users, DollarSign, FileText, TrendingUp, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV  = '#1E40AF';
const EMLD = '#047857';

const ICON_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  collaboration: { icon: Users,      color: NAV,     bg: '#EFF6FF' },
  funding:       { icon: DollarSign, color: EMLD,    bg: '#ECFDF5' },
  publication:   { icon: FileText,   color: '#7C3AED', bg: '#F5F3FF' },
  citation:      { icon: TrendingUp, color: '#B45309', bg: '#FFFBEB' },
  system:        { icon: Info,       color: '#64748B', bg: '#F8FAFC' },
};

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NotificationDropdown() {
  const navigate  = useNavigate();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handle = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const handleClick = (n: any) => {
    if (!n.read) markNotificationAsRead(n.id);
    if (n.link) navigate(n.link);
    setOpen(false);
  };

  return (
    <Box sx={{ position: 'relative' }} ref={ref}>
      {/* Bell button */}
      <IconButton
        onClick={() => setOpen(v => !v)}
        size="small"
        sx={{
          position: 'relative',
          color: '#64748B',
          '&:hover': { bgcolor: '#F8FAFC' },
        }}
      >
        <Bell size={20} />
        {unread > 0 && (
          <Box sx={{
            position: 'absolute', top: 4, right: 4,
            minWidth: 16, height: 16, px: '4px',
            bgcolor: '#DC2626', color: '#fff',
            borderRadius: '8px', fontSize: '0.625rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread > 9 ? '9+' : unread}
          </Box>
        )}
      </IconButton>

      {/* Dropdown panel */}
      {open && (
        <Paper
          elevation={0}
          sx={{
            position: 'absolute', right: 0, top: 44,
            width: 380, maxHeight: 520,
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(15,23,42,0.12)',
            zIndex: 1300,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: unread > 0 ? 1 : 0 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0F172A' }}>
                Notifications
              </Typography>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#94A3B8' }}>
                <X size={16} />
              </IconButton>
            </Box>
            {unread > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">{unread} unread</Typography>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Check size={12} />}
                  onClick={() => markAllNotificationsAsRead()}
                  sx={{ fontSize: '0.75rem', color: NAV, fontWeight: 600, p: 0, minWidth: 0 }}
                >
                  Mark all as read
                </Button>
              </Box>
            )}
          </Box>

          {/* List */}
          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Bell size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
              </Box>
            ) : (
              notifications.map((n, i) => {
                const cfg = ICON_MAP[n.type] ?? ICON_MAP.system;
                const Icon = cfg.icon;
                return (
                  <Box key={n.id}>
                    <Box
                      onClick={() => handleClick(n)}
                      sx={{
                        px: 2.5, py: 2,
                        bgcolor: !n.read ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                        '&:hover': { bgcolor: !n.read ? '#DBEAFE' : '#F8FAFC' },
                        display: 'flex', gap: 1.5,
                      }}
                    >
                      {/* Icon */}
                      <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                        <Icon size={16} color={cfg.color} />
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="body2" fontWeight={!n.read ? 700 : 500} sx={{ color: '#0F172A', lineHeight: 1.4 }}>
                            {n.title}
                          </Typography>
                          {!n.read && (
                            <Box sx={{ width: 7, height: 7, bgcolor: NAV, borderRadius: '50%', flexShrink: 0, mt: '5px' }} />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, lineHeight: 1.5 }}>
                          {n.message}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', mt: 0.5 }}>
                          {timeAgo(n.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    {i < notifications.length - 1 && <Divider sx={{ borderColor: '#F1F5F9' }} />}
                  </Box>
                );
              })
            )}
          </Box>

          {/* Footer */}
          {notifications.length > 0 && (
            <Box sx={{ borderTop: '1px solid #E2E8F0', p: 1.5 }}>
              <Button
                variant="text"
                fullWidth
                size="small"
                onClick={() => { setOpen(false); navigate('/requests'); }}
                sx={{ color: NAV, fontWeight: 600, fontSize: '0.8125rem' }}
              >
                View all notifications
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
