import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  Home, Compass, Inbox, Users, BarChart3, TrendingUp,
  DollarSign, User, Settings, Search, BookOpen,
  ShieldCheck, Database, FileText, Network,
  Sparkles, MessageSquare, LogOut, ChevronDown,
} from 'lucide-react';
import { Logo } from './Logo';
import { NotificationDropdown } from './NotificationDropdown';
import { ChatPanel, ChatHeaderButton } from './ChatPanel';
import { useApp } from '../context/AppContext';

const HEADER_H  = 64;
const SIDEBAR_W = 268;

const BLUE      = '#1E40AF';
const DARK_BLUE = '#1E3A8A';
const GREEN     = '#047857';

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  section?: string;
};

function useNavItems() {
  const { user, collaborationRequests, chatMessages } = useApp();
  if (!user) return [];

  const pending = collaborationRequests.filter(
    r => r.toUserId === user.id && r.status === 'pending'
  ).length;

  const unread = chatMessages.filter(
    m => m.receiverId === user.id && !m.read
  ).length;

  const role = user.role;

  if (role === 'researcher') {
    return [
      { section: 'Main',     path: '/feed',                  label: 'Feed',           icon: Home },
      { path: '/discover',                   label: 'Discover',       icon: Compass },
      { path: '/requests',                   label: 'Requests',       icon: Inbox,        badge: pending },
      { path: '/collaborators',              label: 'Collaborators',  icon: Users },
      { section: 'Insights', path: '/researcher/analytics',  label: 'Analytics',      icon: BarChart3 },
      { path: '/trends',                     label: 'Trends',         icon: TrendingUp },
      { path: '/funding',                    label: 'Funding',        icon: DollarSign },
      { section: 'Account',  path: '/messages',              label: 'Messages',       icon: MessageSquare, badge: unread },
      { path: '/my-profile',                 label: 'My Profile',     icon: User },
      { path: '/settings',                   label: 'Settings',       icon: Settings },
    ] as NavItem[];
  }

  if (role === 'admin') {
    return [
      { section: 'Overview',  path: '/admin/dashboard',                  label: 'Dashboard',      icon: Home },
      { section: 'Manage',    path: '/admin/dashboard?tab=researchers',   label: 'Researchers',    icon: Users },
      { path: '/admin/dashboard?tab=publications',   label: 'Publications',   icon: BookOpen },
      { path: '/admin/dashboard?tab=funders',        label: 'Funders',        icon: DollarSign },
      { path: '/admin/dashboard?tab=users',          label: 'All Users',      icon: User },
      { section: 'System',    path: '/admin/knowledge-processing',        label: 'Knowledge',      icon: Sparkles },
      { path: '/admin/security-management',          label: 'Security',       icon: ShieldCheck },
      { path: '/manager/reports',                    label: 'Reports',        icon: FileText },
      { path: '/data-integration',                   label: 'Data Sources',   icon: Database },
      { section: 'Research',  path: '/trends',                            label: 'Trends',         icon: TrendingUp },
      { path: '/expertise-map',                      label: 'Expertise Map',  icon: Network },
      { section: 'Account',   path: '/messages',                          label: 'Messages',       icon: MessageSquare, badge: unread },
      { path: '/settings',                           label: 'Settings',       icon: Settings },
    ] as NavItem[];
  }

  if (role === 'funder') {
    return [
      { section: 'Main',     path: '/funder/dashboard',              label: 'Dashboard',        icon: Home },
      { path: '/funder/dashboard?section=discover',  label: 'Discover Research',  icon: Compass },
      { path: '/funder/dashboard?section=matched',   label: 'Matched for You',    icon: Sparkles },
      { path: '/funder/dashboard?section=active',    label: 'My Interests',       icon: BookOpen },
      { section: 'Account',  path: '/messages',                      label: 'Messages',         icon: MessageSquare, badge: unread },
      { path: '/settings',                           label: 'Settings',           icon: Settings },
    ] as NavItem[];
  }

  if (role === 'manager') {
    return [
      { section: 'Overview',  path: '/manager/dashboard',                  label: 'Dashboard',    icon: Home },
      { section: 'Research',  path: '/manager/dashboard?section=projects', label: 'Projects',     icon: BookOpen },
      { path: '/manager/dashboard?section=faculty',  label: 'Faculty',      icon: Users },
      { path: '/manager/dashboard?section=analytics',label: 'Analytics',    icon: BarChart3 },
      { path: '/manager/reports',                    label: 'Reports',      icon: FileText },
      { section: 'System',    path: '/data-integration',                   label: 'Data Sources', icon: Database },
      { path: '/expertise-map',                      label: 'Expertise Map',icon: Network },
      { path: '/trends',                             label: 'Trends',       icon: TrendingUp },
      { section: 'Account',   path: '/messages',                           label: 'Messages',     icon: MessageSquare, badge: unread },
      { path: '/settings',                           label: 'Settings',     icon: Settings },
    ] as NavItem[];
  }

  if (role === 'department_head') {
    return [
      { section: 'Overview',    path: '/department/dashboard',                    label: 'Dashboard',    icon: Home },
      { section: 'Department',  path: '/department/dashboard?section=faculty',    label: 'Faculty',      icon: Users },
      { path: '/department/dashboard?section=performance', label: 'Performance',  icon: BarChart3 },
      { path: '/department/dashboard?section=funding',     label: 'Funding',      icon: DollarSign },
      { section: 'Tools',       path: '/expertise-map',                           label: 'Expertise Map',icon: Network },
      { path: '/trends',                                   label: 'Trends',       icon: TrendingUp },
      { section: 'Account',     path: '/messages',                                label: 'Messages',     icon: MessageSquare, badge: unread },
      { path: '/settings',                                 label: 'Settings',     icon: Settings },
    ] as NavItem[];
  }

  return [];
}

const ROLE_LABEL: Record<string, string> = {
  researcher:      'Researcher',
  admin:           'Super Admin',
  funder:          'Funder',
  manager:         'Research Manager',
  department_head: 'Department Head',
};

const HOME_PATH: Record<string, string> = {
  researcher:      '/feed',
  admin:           '/admin/dashboard',
  funder:          '/funder/dashboard',
  manager:         '/manager/dashboard',
  department_head: '/department/dashboard',
};

interface AppShellProps { children: React.ReactNode }

export function AppShell({ children }: AppShellProps) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user, logout, chatMessages } = useApp();

  const navItems  = useNavItems();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const unreadChat = user?.id
    ? chatMessages.filter(m => m.receiverId === user.id && !m.read).length
    : 0;

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? '?';
  const homePath    = user?.role ? HOME_PATH[user.role] : '/';

  const isActive = (path: string) => {
    const base = path.split('?')[0];
    return location.pathname === base;
  };

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose   = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const profilePath = user?.role === 'researcher' ? '/my-profile' : '/settings';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>

      {/* ── Top AppBar ─────────────────────────────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: t => t.zIndex.drawer + 1,
          height: HEADER_H,
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Toolbar sx={{ height: HEADER_H, px: { xs: 2, sm: 3 }, gap: 2, minHeight: `${HEADER_H}px !important` }}>
          {/* Logo */}
          <Logo size="md" onClick={() => navigate(homePath)} />

          {/* Search — all roles */}
          <Box
            sx={{
              flex: 1, maxWidth: 440,
              display: 'flex', alignItems: 'center',
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              px: 1.5, py: 0.625, gap: 1,
              '&:focus-within': {
                bgcolor: '#FFF',
                borderColor: BLUE,
                boxShadow: '0 0 0 3px rgba(30,64,175,0.10)',
              },
              transition: 'all 0.15s',
            }}
          >
            <Search size={15} color="#94A3B8" />
            <InputBase
              placeholder="Search researchers, papers, topics…"
              fullWidth
              sx={{
                fontSize: '0.8375rem',
                color: '#0F172A',
                '& input::placeholder': { color: '#94A3B8', opacity: 1 },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications */}
          <NotificationDropdown />

          {/* Messages icon for all roles */}
          <Tooltip title="Messages">
            <IconButton
              size="small"
              onClick={() => navigate('/messages')}
              sx={{ position: 'relative', color: '#64748B', '&:hover': { color: BLUE } }}
            >
              <MessageSquare size={20} />
              {unreadChat > 0 && (
                <Box
                  sx={{
                    position: 'absolute', top: 4, right: 4,
                    width: 8, height: 8, borderRadius: '50%',
                    bgcolor: '#DC2626',
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          {/* Researcher chat floating button */}
          {user?.role === 'researcher' && <ChatHeaderButton unreadTotal={unreadChat} />}

          {/* Profile avatar with dropdown */}
          <Tooltip title="Account">
            <IconButton onClick={handleAvatarClick} sx={{ p: 0, ml: 0.5 }}>
              <Avatar
                sx={{
                  width: 36, height: 36,
                  bgcolor: BLUE,
                  fontSize: '0.875rem', fontWeight: 700,
                  border: `2px solid transparent`,
                  '&:hover': { borderColor: BLUE },
                }}
              >
                {userInitial}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1, minWidth: 200, borderRadius: '10px', border: '1px solid #E2E8F0' },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <MenuItem onClick={() => { handleMenuClose(); navigate(profilePath); }}
              sx={{ gap: 1.5, py: 1 }}>
              <User size={16} color="#64748B" />
              <Typography variant="body2">My Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}
              sx={{ gap: 1.5, py: 1 }}>
              <Settings size={16} color="#64748B" />
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1, color: '#DC2626' }}>
              <LogOut size={16} />
              <Typography variant="body2">Sign out</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar Drawer ─────────────────────────────────────────────── */}
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_W,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_W,
            boxSizing: 'border-box',
            top: HEADER_H,
            height: `calc(100% - ${HEADER_H}px)`,
            bgcolor: '#FFFFFF',
            borderRight: '1px solid #E2E8F0',
            overflowX: 'hidden',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* User card */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.25,
              p: 1.25, mb: 2, borderRadius: '10px',
              bgcolor: '#EFF6FF',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#DBEAFE' },
              transition: 'background-color 0.15s',
            }}
            onClick={() => navigate(profilePath)}
          >
            <Avatar sx={{ width: 34, height: 34, bgcolor: BLUE, fontSize: '0.8125rem', fontWeight: 700 }}>
              {userInitial}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#0F172A', fontSize: '0.8125rem' }}>
                {user?.name ?? 'User'}
              </Typography>
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 600, color: GREEN, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {user ? ROLE_LABEL[user.role] : ''}
              </Typography>
            </Box>
            <ChevronDown size={14} color="#94A3B8" />
          </Box>

          {/* Nav items */}
          <List disablePadding sx={{ flex: 1 }}>
            {navItems.map((item, i) => {
              const Icon   = item.icon;
              const active = isActive(item.path);

              return (
                <Box key={`${item.path}-${i}`}>
                  {item.section && (
                    <Typography
                      sx={{
                        fontSize: '0.625rem', fontWeight: 700,
                        color: '#94A3B8', letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        px: 1.25, mt: i === 0 ? 0 : 1.75, mb: 0.375,
                      }}
                    >
                      {item.section}
                    </Typography>
                  )}
                  <ListItemButton
                    selected={active}
                    onClick={() => navigate(item.path.split('?')[0])}
                    sx={{
                      borderRadius: '8px',
                      px: 1.25, py: 0.75, mb: 0.125,
                      '&.Mui-selected': {
                        bgcolor: '#EFF6FF',
                        '&:hover': { bgcolor: '#DBEAFE' },
                      },
                      '&:hover': { bgcolor: '#F8FAFC' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Icon size={17} color={active ? BLUE : '#64748B'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.8125rem',
                        fontWeight: active ? 600 : 400,
                        color: active ? BLUE : '#334155',
                      }}
                    />
                    {item.badge !== undefined && item.badge > 0 && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.625rem', fontWeight: 700,
                          bgcolor: item.label === 'Requests' ? '#DC2626' : BLUE,
                          color: '#FFFFFF',
                          '& .MuiChip-label': { px: '5px' },
                        }}
                      />
                    )}
                  </ListItemButton>
                </Box>
              );
            })}
          </List>

          {/* Sidebar bottom: logout */}
          <Divider sx={{ my: 1.5 }} />
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: '8px', px: 1.25, py: 0.75, '&:hover': { bgcolor: '#FEF2F2' } }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <LogOut size={17} color="#EF4444" />
            </ListItemIcon>
            <ListItemText
              primary="Sign out"
              primaryTypographyProps={{ fontSize: '0.8125rem', color: '#EF4444' }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* ── Main content ────────────────────────────────────────────────── */}
      {/* NOTE: permanent Drawer is already a flex child of SIDEBAR_W width,
          so we do NOT add ml. flexGrow:1 fills the remaining width exactly. */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${HEADER_H}px`,
          minHeight: `calc(100vh - ${HEADER_H}px)`,
          bgcolor: '#F8FAFC',
          overflow: 'auto',
          overflowX: 'hidden',
          minWidth: 0,          // prevent flex blowout
        }}
      >
        {children}
      </Box>

      {/* Floating chat — researcher only */}
      {user?.role === 'researcher' && <ChatPanel />}
    </Box>
  );
}
