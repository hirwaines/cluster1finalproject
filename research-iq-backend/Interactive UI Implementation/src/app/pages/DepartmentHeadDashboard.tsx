import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useApp } from '../context/AppContext';
import { ChatPanel, ChatHeaderButton } from '../components/ChatPanel';
import { AppShell } from '../components/AppShell';
import { Brain, LogOut, Users, TrendingUp, Award, FileText, DollarSign, BarChart3, Search, Download, Target, Network as NetworkIcon, Database, Shield, Bell, Sparkles } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as aiApi from '../api/ai';

const monthlyPubs = [
  { month: 'Jan', pubs: 12 },
  { month: 'Feb', pubs: 15 },
  { month: 'Mar', pubs: 14 },
  { month: 'Apr', pubs: 18 },
  { month: 'May', pubs: 21 },
];

const researchAreas = [
  { area: 'AI & ML', count: 8 },
  { area: 'Biotechnology', count: 5 },
  { area: 'Physics', count: 3 },
  { area: 'Environmental', count: 2 },
];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export function DepartmentHeadDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, researchers, research } = useApp();

  // Derive active section from AppShell sidebar URL params
  const activeSection = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get('section') ?? 'overview';
  }, [location.search]);

  // AI: Faculty intelligence (AI service 8009)
  type FacultyInsight = { strategicInsights: string[]; recommendedActions: string[]; riskAreas: string[] };
  const [aiFacultyInsight, setAiFacultyInsight] = useState<FacultyInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'department_head') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    setAiLoading(true);
    aiApi.getFacultyInsight(user.department)
      .then(setAiFacultyInsight)
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, [user]);

  if (!user || user.role !== 'department_head') {
    return null;
  }

  const departmentResearchers = researchers.filter(r => r.department === user.department);
  const departmentResearch = research.filter(r =>
    departmentResearchers.some(dr => dr.id === r.researcherId)
  );

  const sections = [
    { id: 'overview', label: 'Department Overview', icon: BarChart3 },
    { id: 'researchers', label: 'Faculty & Researchers', icon: Users },
    { id: 'performance', label: 'Performance Analytics', icon: TrendingUp },
    { id: 'funding', label: 'Funding & Grants', icon: DollarSign },
  ];

  return (
    <AppShell>
        <main style={{ padding: '2rem' }}>

          {activeSection === 'overview' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Department Overview</h1>
                <p className="text-gray-600">{user.department} • {user.institution}</p>
              </div>

              {/* AI Faculty Intelligence — from AI service 8009 */}
              {(aiFacultyInsight || aiLoading) && (
                <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-700" />
                    <span className="font-semibold text-purple-900 text-sm">AI Faculty Intelligence</span>
                    <span className="ml-auto px-2 py-0.5 bg-purple-700 text-white rounded text-xs font-bold">AI Service 8009</span>
                  </div>
                  {aiLoading ? (
                    <p className="text-sm text-purple-600 animate-pulse">Analysing department faculty profile…</p>
                  ) : aiFacultyInsight ? (
                    <div className="grid grid-cols-3 gap-4">
                      {aiFacultyInsight.strategicInsights?.slice(0, 2).map((insight, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-purple-100 text-sm">
                          <span className="font-medium text-purple-800">Strategic:</span> {insight}
                        </div>
                      ))}
                      {aiFacultyInsight.recommendedActions?.slice(0, 1).map((action, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-green-100 text-sm">
                          <span className="font-medium text-green-700">Action:</span> {action}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-800" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">+2</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{departmentResearchers.length}</div>
            <div className="text-sm text-gray-600">Department Researchers</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">+12%</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{departmentResearch.length}</div>
            <div className="text-sm text-gray-600">Publications This Year</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">+8%</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">$3.1M</div>
            <div className="text-sm text-gray-600">Research Funding</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700">Top 5%</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">87</div>
            <div className="text-sm text-gray-600">Impact Score</div>
          </Card>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Publication Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Monthly Publications</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyPubs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pubs" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Researchers */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Top Researchers</h3>
            <div className="space-y-4">
              {departmentResearchers.slice(0, 4).map((researcher, idx) => (
                <div key={researcher.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#1E40AF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <Avatar className="w-10 h-10 bg-[#1E40AF] flex items-center justify-center text-white font-bold">
                    {researcher.name.charAt(0)}
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{researcher.name}</div>
                    <div className="text-sm text-gray-600">{researcher.publications} publications</div>
                  </div>
                  <Badge variant="secondary">{researcher.hIndex} h-index</Badge>
                </div>
              ))}
            </div>
          </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-all">
                    <Download className="w-6 h-6 text-blue-800 mb-2" />
                    <div className="font-medium">Export Report</div>
                    <div className="text-xs text-gray-600">Department analytics</div>
                  </button>
                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-all">
                    <FileText className="w-6 h-6 text-green-600 mb-2" />
                    <div className="font-medium">View All Publications</div>
                    <div className="text-xs text-gray-600">Department research</div>
                  </button>
                  <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-all">
                    <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
                    <div className="font-medium">Strategic Planning</div>
                    <div className="text-xs text-gray-600">Research roadmap</div>
                  </button>
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'researchers' && (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Faculty & Researchers</h1>
                  <p className="text-gray-600">Manage and view department members</p>
                </div>
                <Button className="bg-[#1E40AF]">
                  + Add Researcher
                </Button>
              </div>

              <Card className="p-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input placeholder="Search researchers by name, expertise, or field..." className="pl-10" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Department Members ({departmentResearchers.length})</h3>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export List
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
            {departmentResearchers.map(researcher => (
              <div
                key={researcher.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all cursor-pointer"
                onClick={() => navigate(`/researcher/profile/${researcher.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 bg-[#1E40AF] flex items-center justify-center text-white font-bold">
                    {researcher.name.charAt(0)}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{researcher.name}</div>
                    <div className="text-xs text-gray-500 truncate">{researcher.email}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{researcher.publications} pubs</span>
                  <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                </div>
              </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'performance' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
                <p className="text-gray-600">Track department research performance and impact</p>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-[#EFF6FF]">
                  <div className="text-4xl font-bold text-blue-800 mb-2">{departmentResearch.length}</div>
                  <div className="text-sm text-gray-700 mb-1">Total Publications</div>
                  <div className="text-xs text-green-600">+18% vs last year</div>
                </Card>
                <Card className="p-6 bg-[#ECFDF5]">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {departmentResearch.reduce((sum, r) => sum + r.citations, 0)}
                  </div>
                  <div className="text-sm text-gray-700 mb-1">Total Citations</div>
                  <div className="text-xs text-green-600">+24% this year</div>
                </Card>
                <Card className="p-6 bg-[#EFF6FF]">
                  <div className="text-4xl font-bold text-purple-600 mb-2">92%</div>
                  <div className="text-sm text-gray-700 mb-1">Research Quality</div>
                  <div className="text-xs text-green-600">Above target</div>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Publication Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyPubs}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="pubs" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Research Areas Distribution</h3>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={200}>
                      <PieChart>
                        <Pie
                          data={researchAreas}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {researchAreas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {researchAreas.map((area, index) => (
                        <div key={area.area} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span>{area.area}</span>
                          </div>
                          <Badge variant="secondary">{area.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Top Performing Researchers</h3>
                <div className="space-y-4">
                  {departmentResearchers.slice(0, 5).map((researcher, idx) => (
                    <div key={researcher.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-[#1E40AF] rounded-full flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <Avatar className="w-12 h-12 bg-[#1E40AF] flex items-center justify-center text-white font-bold">
                        {researcher.name.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-bold">{researcher.name}</div>
                        <div className="text-sm text-gray-600">{researcher.publications} publications • {researcher.citations} citations</div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">h-index: {researcher.hIndex}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'funding' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Funding & Grants</h1>
                <p className="text-gray-600">Track funding status and opportunities</p>
              </div>

              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">$3.1M</div>
                  <div className="text-sm text-gray-600">Total Funding</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Award className="w-6 h-6 text-blue-800" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">12</div>
                  <div className="text-sm text-gray-600">Active Grants</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">8</div>
                  <div className="text-sm text-gray-600">Pending Applications</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">78%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </Card>
              </div>

              <Card className="p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Funding by Research Area</h3>
                <div className="space-y-4">
                  {researchAreas.map((area, idx) => {
                    const funding = [850, 620, 480, 350][idx];
                    const percentage = (funding / 3100) * 100;
                    return (
                      <div key={area.area}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{area.area}</span>
                          <span className="text-sm text-gray-600">${funding}K</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1E40AF]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Recent Grant Awards</h3>
                <div className="space-y-3">
                  {[
                    { title: 'NSF Research Grant', amount: '$450K', researcher: departmentResearchers[0]?.name, status: 'Active' },
                    { title: 'NIH Innovation Award', amount: '$380K', researcher: departmentResearchers[1]?.name, status: 'Active' },
                    { title: 'DOE Energy Research', amount: '$520K', researcher: departmentResearchers[2]?.name, status: 'Pending' },
                  ].map((grant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="font-bold mb-1">{grant.title}</div>
                        <div className="text-sm text-gray-600">PI: {grant.researcher}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 mb-1">{grant.amount}</div>
                        <Badge className={grant.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {grant.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </main>
    </AppShell>
  );
}


