import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { useApp } from '../context/AppContext';
import {
  Brain,
  Users,
  TrendingUp,
  Award,
  Upload,
  Network,
  Search,
  BookOpen,
  Target,
  Bell,
  LogOut,
  Sparkles,
  FileText,
  Map,
  BarChart3
} from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function ResearcherDashboard() {
  const navigate = useNavigate();
  const { user, logout, research, researchers } = useApp();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect to Feed page for new interface
    if (user.role === 'researcher') {
      navigate('/feed');
    }
  }, [user, navigate]);

  if (!user || user.role === 'researcher') {
    return null;
  }

  const userResearch = research.filter(r => r.researcherId === user.id);
  const potentialCollaborators = researchers.filter(r => r.id !== user.id).slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-blue-900">
                  Research IQ
                </span>
              </div>

              <div className="flex items-center gap-6">
                <button className="text-gray-600 hover:text-blue-800 transition-colors font-medium">
                  Dashboard
                </button>
                <button
                  className="text-gray-600 hover:text-blue-800 transition-colors font-medium"
                  onClick={() => navigate('/collaborators')}
                >
                  Collaborators
                </button>
                <button
                  className="text-gray-600 hover:text-blue-800 transition-colors font-medium"
                  onClick={() => navigate('/trends')}
                >
                  Trends
                </button>
                <button
                  className="text-gray-600 hover:text-blue-800 transition-colors font-medium"
                  onClick={() => navigate('/funding')}
                >
                  Funding
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <Avatar className="w-10 h-10 bg-blue-800 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </Avatar>
                <div className="text-left">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.department}</div>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.name.split(' ')[1] || user.name}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your research today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            label="Publications"
            value={user.publications || 0}
            change="+2 this month"
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Citations"
            value={user.citations || 0}
            change="+45 this month"
            color="green"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Collaborators"
            value="12"
            change="+3 new"
            color="blue"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            label="h-index"
            value={user.hIndex || 0}
            change="Top 10%"
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <QuickActionCard
            icon={<Upload className="w-6 h-6" />}
            title="Upload Research"
            description="Add new publication"
            color="blue"
            onClick={() => navigate('/researcher/upload')}
          />
          <QuickActionCard
            icon={<Search className="w-6 h-6" />}
            title="Find Collaborators"
            description="Smart matching"
            color="green"
            onClick={() => navigate('/collaborators')}
          />
          <QuickActionCard
            icon={<Network className="w-6 h-6" />}
            title="Network Analysis"
            description="View connections"
            color="blue"
            onClick={() => navigate('/network')}
          />
          <QuickActionCard
            icon={<Map className="w-6 h-6" />}
            title="Expertise Map"
            description="Explore research areas"
            color="green"
            onClick={() => navigate('/expertise-map')}
          />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* AI Insights - INNOVATIVE FEATURE */}
            <Card className="p-6 bg-blue-900 text-white">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Research Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4" />
                        <span className="font-semibold">Collaboration Match Found</span>
                      </div>
                      <p className="text-sm text-white/90">
                        Dr. Ahmed Hassan's quantum computing expertise complements your ML work.
                        <strong className="text-yellow-300"> 94% match score</strong> for potential breakthrough collaboration!
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 bg-white text-blue-800 hover:bg-gray-100"
                        onClick={() => navigate('/collaborators')}
                      >
                        View Profile
                      </Button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold">Funding Opportunity Alert</span>
                      </div>
                      <p className="text-sm text-white/90">
                        NSF AI Research Grant ($500K) matches your expertise in neural networks.
                        Deadline: <strong className="text-yellow-300">15 days</strong>
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 bg-white text-green-600 hover:bg-gray-100"
                        onClick={() => navigate('/funding')}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Publications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Your Recent Publications</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/researcher/upload')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>

              <div className="space-y-4">
                {userResearch.length > 0 ? (
                  userResearch.map(r => (
                    <div key={r.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold mb-2 text-blue-800">{r.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{r.abstract}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{r.authors.join(', ')}</span>
                            <span>•</span>
                            <span>{r.citations} citations</span>
                            <span>•</span>
                            <span>{r.publicationDate}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            {r.keywords.slice(0, 3).map(keyword => (
                              <Badge key={keyword} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge className={
                          r.fundingStatus === 'funded' ? 'bg-green-100 text-green-700' :
                          r.fundingStatus === 'seeking' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {r.fundingStatus}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No publications yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => navigate('/researcher/upload')}
                    >
                      Upload Your First Publication
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Research Trends */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Trending in Your Field</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/trends')}
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                <TrendItem
                  topic="Quantum Machine Learning"
                  growth="+45%"
                  papers={234}
                  trend="up"
                />
                <TrendItem
                  topic="Explainable AI"
                  growth="+32%"
                  papers={189}
                  trend="up"
                />
                <TrendItem
                  topic="Federated Learning"
                  growth="+28%"
                  papers={156}
                  trend="up"
                />
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Suggested Collaborators */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Suggested Collaborators</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/collaborators')}
                >
                  See All
                </Button>
              </div>

              <div className="space-y-4">
                {potentialCollaborators.map(researcher => (
                  <div
                    key={researcher.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/researcher/profile/${researcher.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 bg-blue-800 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {researcher.name.charAt(0)}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm mb-1 truncate">{researcher.name}</div>
                        <div className="text-xs text-gray-500 mb-2">{researcher.department}</div>
                        <div className="flex flex-wrap gap-1">
                          {researcher.expertise?.slice(0, 2).map(exp => (
                            <Badge key={exp} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-green-600 font-medium">
                          {Math.floor(Math.random() * 30 + 70)}% Match
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <MetricBar label="Research Impact" value={85} color="blue" />
                <MetricBar label="Collaboration Index" value={72} color="green" />
                <MetricBar label="Publication Rate" value={90} color="blue" />
                <MetricBar label="Citation Growth" value={78} color="green" />
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-6 bg-blue-50 border-2 border-blue-200">
              <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-medium text-sm">AI Research Symposium</div>
                  <div className="text-xs text-gray-500 mt-1">May 15, 2026 • Virtual</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-medium text-sm">Grant Writing Workshop</div>
                  <div className="text-xs text-gray-500 mt-1">May 20, 2026 • Campus</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, color }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  change: string;
  color: 'blue' | 'green';
}) {
  const bgColor = color === 'blue' ? 'bg-blue-100' : 'bg-green-100';
  const textColor = color === 'blue' ? 'text-blue-800' : 'text-green-600';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-lg ${textColor}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <div className="text-xs text-green-600 font-medium">{change}</div>
    </Card>
  );
}

function QuickActionCard({ icon, title, description, color, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green';
  onClick: () => void;
}) {
  const bgColor = color === 'blue' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-green-100 hover:bg-green-200';
  const textColor = color === 'blue' ? 'text-blue-800' : 'text-green-600';

  return (
    <button
      onClick={onClick}
      className={`p-4 ${bgColor} rounded-lg transition-all text-left hover:shadow-md`}
    >
      <div className={`${textColor} mb-3`}>{icon}</div>
      <div className="font-bold text-sm mb-1">{title}</div>
      <div className="text-xs text-gray-600">{description}</div>
    </button>
  );
}

function TrendItem({ topic, growth, papers, trend }: {
  topic: string;
  growth: string;
  papers: number;
  trend: 'up' | 'down';
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-all cursor-pointer">
      <div>
        <div className="font-medium mb-1">{topic}</div>
        <div className="text-sm text-gray-500">{papers} papers published</div>
      </div>
      <div className="text-right">
        <div className="text-green-600 font-bold">{growth}</div>
        <div className="text-xs text-gray-500">this month</div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, color }: {
  label: string;
  value: number;
  color: 'blue' | 'green';
}) {
  const barColor = color === 'blue' ? 'bg-blue-800' : 'bg-green-600';

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
