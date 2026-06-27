import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { DashboardPageHeader, tabClass } from '../components/layout';
import { useApp } from '../context/AppContext';
import { Users, TrendingUp, Award, FileText, DollarSign, BarChart3, Search, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  const { user, researchers, research } = useApp();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'department_head') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'department_head') {
    return null;
  }

  const departmentResearchers = researchers.filter(r => r.department === user.department);
  const departmentResearch = research.filter(r =>
    departmentResearchers.some(dr => dr.id === r.researcherId)
  );

  const sectionMeta: Record<string, { title: string; description: string }> = {
    overview: { title: 'Department Overview', description: `${user.department} • ${user.institution}` },
    researchers: { title: 'Faculty & Researchers', description: 'Manage and view department members' },
    performance: { title: 'Performance Analytics', description: 'Track department research performance and impact' },
    funding: { title: 'Funding & Grants', description: 'Track funding status and opportunities' },
  };

  const sections = [
    { id: 'overview', label: 'Department Overview', icon: BarChart3 },
    { id: 'researchers', label: 'Faculty & Researchers', icon: Users },
    { id: 'performance', label: 'Performance Analytics', icon: TrendingUp },
    { id: 'funding', label: 'Funding & Grants', icon: DollarSign },
  ];

  return (
    <>
      <DashboardPageHeader
        title={sectionMeta[activeSection].title}
        description={sectionMeta[activeSection].description}
        actions={
          activeSection === 'researchers' ? (
            <Button className="bg-brand-dark hover:bg-brand-dark">
              + Add Researcher
            </Button>
          ) : undefined
        }
      />

      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={tabClass(activeSection === section.id)}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </div>

          {activeSection === 'overview' && (
            <div>
              <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-muted rounded-lg">
                <Users className="w-6 h-6 text-brand-dark" />
              </div>
              <Badge className="bg-brand-muted text-brand-dark">+2</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{departmentResearchers.length}</div>
            <div className="text-sm text-muted-foreground">Department Researchers</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-success-muted rounded-lg">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <Badge className="bg-success-muted text-success-foreground">+12%</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{departmentResearch.length}</div>
            <div className="text-sm text-muted-foreground">Publications This Year</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-muted rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-brand-muted text-brand-dark">+8%</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">$3.1M</div>
            <div className="text-sm text-muted-foreground">Research Funding</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-warning-muted rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <Badge className="bg-warning-muted text-orange-700">Top 5%</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">87</div>
            <div className="text-sm text-muted-foreground">Impact Score</div>
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
                <div key={researcher.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <Avatar className="w-10 h-10 bg-brand-dark flex items-center justify-center text-white font-bold">
                    {researcher.name.charAt(0)}
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{researcher.name}</div>
                    <div className="text-sm text-muted-foreground">{researcher.publications} publications</div>
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
                  <button className="p-4 bg-brand-muted/50 hover:bg-brand-muted rounded-lg text-left transition-all">
                    <Download className="w-6 h-6 text-brand-dark mb-2" />
                    <div className="font-medium">Export Report</div>
                    <div className="text-xs text-muted-foreground">Department analytics</div>
                  </button>
                  <button className="p-4 bg-success-muted/50 hover:bg-success-muted rounded-lg text-left transition-all">
                    <FileText className="w-6 h-6 text-success mb-2" />
                    <div className="font-medium">View All Publications</div>
                    <div className="text-xs text-muted-foreground">Department research</div>
                  </button>
                  <button className="p-4 bg-brand-muted/50 hover:bg-brand-muted rounded-lg text-left transition-all">
                    <BarChart3 className="w-6 h-6 text-brand-dark mb-2" />
                    <div className="font-medium">Strategic Planning</div>
                    <div className="text-xs text-muted-foreground">Research roadmap</div>
                  </button>
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'researchers' && (
            <div>
              <Card className="p-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
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
                className="border border-border rounded-lg p-4 hover:border-brand/20 transition-all cursor-pointer"
                onClick={() => navigate(`/researcher/profile/${researcher.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 bg-brand-dark flex items-center justify-center text-white font-bold">
                    {researcher.name.charAt(0)}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{researcher.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{researcher.email}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{researcher.publications} pubs</span>
                  <Badge className="bg-success-muted text-success-foreground text-xs">Active</Badge>
                </div>
              </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'performance' && (
            <div>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-brand-muted/50">
                  <div className="text-4xl font-bold text-brand-dark mb-2">{departmentResearch.length}</div>
                  <div className="text-sm text-foreground mb-1">Total Publications</div>
                  <div className="text-xs text-success">+18% vs last year</div>
                </Card>
                <Card className="p-6 bg-success-muted/50">
                  <div className="text-4xl font-bold text-success mb-2">
                    {departmentResearch.reduce((sum, r) => sum + r.citations, 0)}
                  </div>
                  <div className="text-sm text-foreground mb-1">Total Citations</div>
                  <div className="text-xs text-success">+24% this year</div>
                </Card>
                <Card className="p-6 bg-brand-muted/50">
                  <div className="text-4xl font-bold text-brand-dark mb-2">92%</div>
                  <div className="text-sm text-foreground mb-1">Research Quality</div>
                  <div className="text-xs text-success">Above target</div>
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
                    <div key={researcher.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <Avatar className="w-12 h-12 bg-brand-dark flex items-center justify-center text-white font-bold">
                        {researcher.name.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-bold">{researcher.name}</div>
                        <div className="text-sm text-muted-foreground">{researcher.publications} publications • {researcher.citations} citations</div>
                      </div>
                      <Badge className="bg-success-muted text-success-foreground">h-index: {researcher.hIndex}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'funding' && (
            <div>
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-success-muted rounded-lg">
                      <DollarSign className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">$3.1M</div>
                  <div className="text-sm text-muted-foreground">Total Funding</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-brand-muted rounded-lg">
                      <Award className="w-6 h-6 text-brand-dark" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">12</div>
                  <div className="text-sm text-muted-foreground">Active Grants</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-warning-muted rounded-lg">
                      <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">8</div>
                  <div className="text-sm text-muted-foreground">Pending Applications</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-success-muted rounded-lg">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">78%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
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
                          <span className="text-sm text-muted-foreground">${funding}K</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-dark"
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
                    <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="font-bold mb-1">{grant.title}</div>
                        <div className="text-sm text-muted-foreground">PI: {grant.researcher}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-success mb-1">{grant.amount}</div>
                        <Badge className={grant.status === 'Active' ? 'bg-success-muted text-success-foreground' : 'bg-warning-muted text-warning-foreground'}>
                          {grant.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
    </>
  );
}
