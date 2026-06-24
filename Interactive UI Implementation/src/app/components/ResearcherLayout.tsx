import { useNavigate, useLocation } from 'react-router';
import { Brain, Home, Compass, Users, TrendingUp, DollarSign, Network, User, Settings, Plus, Search, Inbox, BarChart3, LogOut } from 'lucide-react';
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

  // Incoming pending + researcher's own sent applications (so they always see the badge)
  const incomingPending = collaborationRequests.filter(
    req => req.toUserId === user?.id && req.status === 'pending'
  ).length;
  const sentApplications = collaborationRequests.filter(
    req => req.fromUserId === user?.id
  ).length;
  const pendingRequestsCount = incomingPending + sentApplications;

  const navItems = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/requests', icon: Inbox, label: 'Requests', badge: pendingRequestsCount },
    { path: '/collaborators', icon: Users, label: 'Collaborators' },
    { path: '/researcher/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/trends', icon: TrendingUp, label: 'Trends' },
    { path: '/funding', icon: DollarSign, label: 'Funding' },
    { path: '/network', icon: Network, label: 'Network' },
  ];

  const unreadChat =
    user?.id != null
      ? chatMessages.filter(m => m.receiverId === user.id && !m.read).length
      : 0;

  const workspaceItems = [
    { path: '/my-profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

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

            <Avatar
              className="w-10 h-10 bg-blue-800 flex items-center justify-center text-white font-bold cursor-pointer"
              onClick={() => navigate('/my-profile')}
            >
              {user?.name.charAt(0)}
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-[65px] self-start">
          <div className="p-4">
            {/* User Profile Section */}
            <div
              className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 mb-6 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('/my-profile')}
            >
              <Avatar className="w-12 h-12 bg-blue-800 flex items-center justify-center text-white font-bold">
                {user?.name.charAt(0)}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">Researcher</div>
                <div className="text-xs text-gray-500 truncate">WORKSPACE</div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 mb-3 px-3">NAVIGATE</div>
              <div className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-blue-800 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge className={`${isActive ? 'bg-white text-blue-800' : 'bg-red-500 text-white'} text-xs px-2 py-0.5`}>
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Workspace */}
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3 px-3">WORKSPACE</div>
              <div className="space-y-1">
                {workspaceItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-blue-800 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      <ChatPanel />
    </div>
  );
}
