import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { DataFreshness } from '../components/DataFreshness';
import { SystemAnnouncements } from '../components/SystemAnnouncements';
import { DepartmentSelector } from '../components/DepartmentSelector';
import { ChatPanel, ChatHeaderButton } from '../components/ChatPanel';
import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';
import {
  Brain,
  LogOut,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  FileText,
  DollarSign,
  Search,
  Download,
  UserPlus,
  Database,
  Zap,
  Target,
  Network as NetworkIcon,
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as aiApi from '../api/ai';

const activeProjects = [
  { name: 'AI for campus climate resilience', lead: 'Dr. Claver Ndahayo', progress: 72, budget: '$120K', status: 'On Track' },
  { name: 'Research data governance platform', lead: 'Assoc. Prof. Kayigema Jacques', progress: 65, budget: '$95K', status: 'On Track' },
  { name: 'Responsible AI policy pilot', lead: 'Prof. Kelvin Onongha', progress: 54, budget: '$80K', status: 'On Track' },
  { name: 'Vision models for learning analytics', lead: 'Dr. Sarah Chen', progress: 81, budget: '$110K', status: 'Ahead' },
];

const departmentData = [
  { department: 'Computer Science', count: 14 },
  { department: 'Research Office', count: 11 },
  { department: 'University Leadership', count: 9 },
  { department: 'Academic Affairs', count: 8 },
  { department: 'Data Science', count: 7 },
];

const publicationTrend = [
  { month: 'Jan', pubs: 45 },
  { month: 'Feb', pubs: 52 },
  { month: 'Mar', pubs: 48 },
  { month: 'Apr', pubs: 61 },
  { month: 'May', pubs: 68 },
];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export function ResearchManagerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, researchers, research } = useApp();
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Read section from URL so AppShell sidebar nav links work
  const activeSection = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get('section') ?? 'dashboard';
  }, [location.search]);

  // AI: Department analytics (AI service 8007) + Portfolio analysis (AI service 8008)
  const [aiDeptMetrics, setAiDeptMetrics] = useState<aiApi.DepartmentStats[] | null>(null);
  const [aiPortfolio, setAiPortfolio] = useState<aiApi.PortfolioAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'manager') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    setAiLoading(true);
    Promise.allSettled([
      aiApi.getInstitutionMetrics().then(setAiDeptMetrics),
      aiApi.analyzePortfolio(user.id).then(setAiPortfolio),
    ]).finally(() => setAiLoading(false));
  }, [user]);

  if (!user || user.role !== 'manager') {
    return null;
  }

  return (
    <AppShell>
        <main style={{ padding: '2rem' }}>
          {activeSection === 'dashboard' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold">Research Dashboard</h1>
                  <div className="flex items-center gap-4">
                    <DepartmentSelector
                      value={selectedDepartment}
                      onChange={setSelectedDepartment}
                      showAllOption={true}
                    />
                    <DataFreshness lastUpdated={new Date()} variant="compact" />
                  </div>
                </div>
                <p className="text-gray-600">Overview of institutional research activities and performance</p>
              </div>

              {/* System Announcements */}
              <div className="mb-6">
                <SystemAnnouncements limit={1} />
              </div>

              {/* AI Institution Metrics — from AI service 8007 */}
              {(aiDeptMetrics || aiLoading) && (
                <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-700" />
                    <span className="font-semibold text-indigo-900 text-sm">AI Institution Insights</span>
                    <span className="ml-auto px-2 py-0.5 bg-indigo-700 text-white rounded text-xs font-bold">AI Service 8007</span>
                  </div>
                  {aiLoading ? (
                    <p className="text-sm text-indigo-600 animate-pulse">Analysing institutional research performance…</p>
                  ) : aiDeptMetrics && aiDeptMetrics.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Departments Tracked', value: aiDeptMetrics.length, icon: Database },
                        { label: 'Avg. h-index', value: (aiDeptMetrics.reduce((s, d) => s + d.avgHIndex, 0) / aiDeptMetrics.length).toFixed(1), icon: Award },
                        { label: 'Funding Success Rate', value: `${((aiDeptMetrics.reduce((s, d) => s + d.fundingSuccessRate, 0) / aiDeptMetrics.length) * 100).toFixed(0)}%`, icon: DollarSign },
                        { label: 'Total Citations', value: aiDeptMetrics.reduce((s, d) => s + d.citationCount, 0), icon: TrendingUp },
                      ].map(stat => {
                        const Icon = stat.icon;
                        return (
                          <div key={stat.label} className="bg-white rounded-lg p-3 border border-indigo-100 flex items-center gap-3">
                            <Icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                            <div>
                              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                              <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                  {aiPortfolio && (
                    <div className="mt-3 pt-3 border-t border-indigo-100 text-sm text-indigo-800">
                      <span className="font-medium">Portfolio Benchmark Score:</span> <span className="font-bold text-indigo-900">{(aiPortfolio.benchmarkScore * 100).toFixed(0)}/100</span>
                      {aiPortfolio.gaps?.length > 0 && (
                        <span className="ml-3 text-indigo-600">· Gap area: {aiPortfolio.gaps[0]}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-800" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">+12%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{researchers.length}</div>
                  <div className="text-sm text-gray-600">Active Researchers</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700">+8%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{research.length}</div>
                  <div className="text-sm text-gray-600">Publications</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-[#047857]" />
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">+15%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">$14.5M</div>
                  <div className="text-sm text-gray-600">Total Funding</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700">94%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">89</div>
                  <div className="text-sm text-gray-600">Impact Score</div>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Publication Trend */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Publication Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={publicationTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="pubs" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Department Distribution */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Department Distribution</h3>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={200}>
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {departmentData.map((dept, index) => (
                        <div key={dept.department} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span>{dept.department}</span>
                          </div>
                          <Badge variant="secondary">{dept.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-all">
                    <UserPlus className="w-6 h-6 text-blue-800 mb-2" />
                    <div className="font-medium">Invite New Member</div>
                    <div className="text-xs text-gray-600">Add researchers to platform</div>
                  </button>
                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-all">
                    <FileText className="w-6 h-6 text-green-600 mb-2" />
                    <div className="font-medium">Export Directory</div>
                    <div className="text-xs text-gray-600">Download faculty data (Excel, PDF)</div>
                  </button>
                  <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-all">
                    <BarChart3 className="w-6 h-6 text-[#047857] mb-2" />
                    <div className="font-medium">Generate Report</div>
                    <div className="text-xs text-gray-600">Create custom analytics report</div>
                  </button>
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'projects' && (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Active Projects</h1>
                  <p className="text-gray-600">Monitor ongoing research projects and their progress</p>
                </div>
                <Button className="bg-[#1E40AF]">
                  + New Project
                </Button>
              </div>

              <div className="grid gap-6">
                {activeProjects.map(project => (
                  <Card key={project.name} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Lead: {project.lead}</span>
                          <span>•</span>
                          <span>Budget: {project.budget}</span>
                        </div>
                      </div>
                      <Badge className={
                        project.status === 'Ahead' ? 'bg-green-100 text-green-700' :
                        project.status === 'At Risk' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {project.status}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            project.status === 'Ahead' ? 'bg-green-600' :
                            project.status === 'At Risk' ? 'bg-red-600' :
                            'bg-blue-800'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Team</Button>
                      <Button size="sm" variant="outline">Reports</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'faculty' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Faculty & Staff Directory</h1>
                <p className="text-gray-600">View and manage all researchers and staff members</p>
              </div>

              <Card className="p-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input placeholder="Search members, roles, or researchers..." className="pl-10" />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-6">
                {researchers.slice(0, 6).map(researcher => (
                  <Card key={researcher.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16 bg-[#1E40AF] flex items-center justify-center text-white font-bold text-2xl">
                        {researcher.name.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{researcher.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{researcher.department} • {researcher.institution}</p>
                        <Badge className="bg-green-100 text-green-700 text-xs">Accredited</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-800">{researcher.publications}</div>
                        <div className="text-xs text-gray-500">Publications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{researcher.citations}</div>
                        <div className="text-xs text-gray-500">Citations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-800">{researcher.hIndex}</div>
                        <div className="text-xs text-gray-500">h-index</div>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analytics Overview</h1>
                <p className="text-gray-600">Comprehensive research performance analytics and insights</p>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-[#EFF6FF]">
                  <div className="text-4xl font-bold text-blue-800 mb-2">1,248</div>
                  <div className="text-sm text-gray-700 mb-1">Total Publications</div>
                  <div className="text-xs text-green-600">+18% vs last quarter</div>
                </Card>
                <Card className="p-6 bg-[#ECFDF5]">
                  <div className="text-4xl font-bold text-green-600 mb-2">372</div>
                  <div className="text-sm text-gray-700 mb-1">Active Collaborations</div>
                  <div className="text-xs text-green-600">+24% this month</div>
                </Card>
                <Card className="p-6 bg-[#EFF6FF]">
                  <div className="text-4xl font-bold text-[#047857] mb-2">94%</div>
                  <div className="text-sm text-gray-700 mb-1">Success Rate</div>
                  <div className="text-xs text-green-600">Above target</div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Research Output by Department</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
                  <p className="text-gray-600">Generate and manage research reports</p>
                </div>
                <Button onClick={() => navigate('/manager/reports')} className="bg-blue-800 hover:bg-blue-900">
                  <FileText className="w-4 h-4 mr-2" />
                  Open Report Builder
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Quick Report Templates</h3>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/manager/reports')}>
                      ðŸ“Š Performance Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/manager/reports')}>
                      ðŸ¤ Collaboration Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/manager/reports')}>
                      ðŸ’° Funding Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/manager/reports')}>
                      ðŸ“ˆ Trend Analysis
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4">Recent Reports</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-medium text-sm">Q1 Performance Report</div>
                      <div className="text-xs text-gray-500">Generated Jan 15, 2024</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-medium text-sm">Collaboration Metrics</div>
                      <div className="text-xs text-gray-500">Generated Jan 10, 2024</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-medium text-sm">Funding Analysis</div>
                      <div className="text-xs text-gray-500">Generated Jan 5, 2024</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </main>
    </AppShell>
  );
}

