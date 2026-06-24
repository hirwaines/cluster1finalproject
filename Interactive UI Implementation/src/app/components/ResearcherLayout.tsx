import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Brain, Home, Users, TrendingUp, DollarSign, Network, Settings, Plus, Search, Inbox, BarChart3, LogOut, User, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { NotificationDropdown } from './NotificationDropdown';
import { ChatPanel, ChatHeaderButton } from './ChatPanel';

export function ResearcherLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, collaborationRequests, chatMessages } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const incomingPending = collaborationRequests.filter(
    req => req.toUserId === user?.id && req.status === 'pending'
  ).length;
  const sentApplications = collaborationRequests.filter(
    req => req.fromUserId === user?.id
  ).length;
  const pendingRequestsCount = incomingPending + sentApplications;

  const navItems = [
    { path: '/feed', icon: Home, label: 'Feed & Discover' },
    { path: '/requests', icon: Inbox, label: 'Requests', badge: pendingRequestsCount },
    { path: '/researcher/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/trends', icon: TrendingUp, label: 'Trends' },
    { path: '/funding', icon: DollarSign, label: 'Funding' },
    { path: '/network', icon: Network, label: 'Network' },
  ];

  const unreadChat =
    user?.id != null
      ? chatMessages.filter(m => m.receiverId === user.id && !m.read).length
      : 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/feed')}>
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-blue-900">
                Research IQ
              </span>
            </div>

            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search researchers, topics, papers..."
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="bg-blue-900 hover:bg-blue-950"
              onClick={() => navigate('/researcher/upload')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Share research
            </Button>

            <NotificationDropdown />

            <ChatHeaderButton unreadTotal={unreadChat} />

            {/* Profile Avatar with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <Avatar className="w-10 h-10 bg-blue-800 flex items-center justify-center text-white font-bold">
                  {user?.name.charAt(0)}
                </Avatar>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-semibold text-sm truncate">{user?.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/my-profile'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="border-t border-gray-100 mt-1" />
                  <button
                    onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 min-h-screen sticky top-[65px] self-start shrink-0">
          <div className="p-4">
            {/* Navigation */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 mb-3 px-3 uppercase tracking-wider">Navigate</div>
              <div className="space-y-0.5">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path ||
                    (item.path === '/feed' && location.pathname === '/discover');

                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-blue-900 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge className={`${isActive ? 'bg-white text-blue-900' : 'bg-red-500 text-white'} text-xs px-2 py-0.5`}>
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      <ChatPanel />
    </div>
  );
}
