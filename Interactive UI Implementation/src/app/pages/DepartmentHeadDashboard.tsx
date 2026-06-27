import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { StatCard, dashboardStatGridClass, dashboardTwoColGridClass, CHART_COLORS } from '../components/layout';
import { usePageHeaderActions, usePageHeaderMeta } from '../context/PageHeaderContext';
import { useDashboardTab } from '../hooks/useDashboardTab';
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
  const [activeSection, setActiveSection] = useDashboardTab('overview', [
    'overview',
    'researchers',
    'performance',
    'funding',
  ] as const);

  useEffect(() => {
    if (!user || user.role !== 'department_head') {
      navigate('/login');
    }
  }, [user, navigate]);

  usePageHeaderMeta(
    undefined,
    user?.role === 'department_head' && activeSection === 'overview'
      ? `${user.department} • ${user.institution}`
      : undefined,
  );

  const headerActions = useMemo(
    () =>
      activeSection === 'researchers' ? (
        <Button size="sm">+ Add Researcher</Button>
      ) : null,
    [activeSection],
  );
  usePageHeaderActions(user?.role === 'department_head' ? headerActions : null);

  if (!user || user.role !== 'department_head') {
    return null;
  }

  const departmentResearchers = researchers.filter(r => r.department === user.department);
  const departmentResearch = research.filter(r =>
    departmentResearchers.some(dr => dr.id === r.researcherId)
  );

  return (
    <>
          {activeSection === 'overview' && (
            <div>
              <div className={`${dashboardStatGridClass} mb-5`}>
                <StatCard label="Department researchers" value={departmentResearchers.length} icon={Users} accent="brand" />
                <StatCard label="Publications this year" value={departmentResearch.length} icon={FileText} accent="brand" />
                <StatCard label="Research funding" value="$3.1M" icon={DollarSign} accent="dark" />
                <StatCard label="Impact score" value={87} icon={Award} accent="info" />
              </div>

              <div className={`${dashboardTwoColGridClass} mb-5`}>
          {/* Publication Trend */}
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4">Monthly Publications</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyPubs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pubs" fill={CHART_COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Researchers */}
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-4">Top Researchers</h3>
            <div className="space-y-4">
              {departmentResearchers.slice(0, 4).map((researcher, idx) => (
                <div key={researcher.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {idx + 1}
                  </div>
                  <Avatar className="w-10 h-10 bg-brand-dark flex items-center justify-center text-white font-semibold">
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
                <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                  <h3 className="text-base font-semibold">Department Members ({departmentResearchers.length})</h3>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export List
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {departmentResearchers.map(researcher => (
              <div
                key={researcher.id}
                className="border border-border rounded-lg p-4 hover:border-brand/20 transition-all cursor-pointer"
                onClick={() => navigate(`/researcher/profile/${researcher.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 bg-brand-dark flex items-center justify-center text-white font-semibold">
                    {researcher.name.charAt(0)}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{researcher.name}</div>
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
              <div className={`${dashboardStatGridClass} mb-5`}>
                <StatCard label="Total publications" value={departmentResearch.length} icon={FileText} accent="brand" hint="+18% vs last year" />
                <StatCard
                  label="Total citations"
                  value={departmentResearch.reduce((sum, r) => sum + r.citations, 0)}
                  icon={TrendingUp}
                  accent="info"
                  hint="+24% this year"
                />
                <StatCard label="Research quality" value="92%" icon={Award} accent="dark" hint="Above target" />
              </div>

              <div className={`${dashboardTwoColGridClass} mb-5`}>
                <Card className="p-6">
                  <h3 className="text-base font-semibold mb-4">Publication Trend</h3>
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
                  <h3 className="text-base font-semibold mb-4">Research Areas Distribution</h3>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                <h3 className="text-base font-semibold mb-4">Top Performing Researchers</h3>
                <div className="space-y-4">
                  {departmentResearchers.slice(0, 5).map((researcher, idx) => (
                    <div key={researcher.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white font-semibold">
                        {idx + 1}
                      </div>
                      <Avatar className="w-12 h-12 bg-brand-dark flex items-center justify-center text-white font-semibold">
                        {researcher.name.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{researcher.name}</div>
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
              <div className={`${dashboardStatGridClass} mb-5`}>
                <StatCard label="Total funding" value="$3.1M" icon={DollarSign} accent="brand" />
                <StatCard label="Active grants" value={12} icon={Award} accent="info" />
                <StatCard label="Pending applications" value={8} icon={FileText} accent="dark" />
                <StatCard label="Success rate" value="78%" icon={TrendingUp} accent="brand" />
              </div>

              <Card className="p-6 mb-6">
                <h3 className="text-base font-semibold mb-4">Funding by Research Area</h3>
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
                <h3 className="text-base font-semibold mb-4">Recent Grant Awards</h3>
                <div className="space-y-3">
                  {[
                    { title: 'NSF Research Grant', amount: '$450K', researcher: departmentResearchers[0]?.name, status: 'Active' },
                    { title: 'NIH Innovation Award', amount: '$380K', researcher: departmentResearchers[1]?.name, status: 'Active' },
                    { title: 'DOE Energy Research', amount: '$520K', researcher: departmentResearchers[2]?.name, status: 'Pending' },
                  ].map((grant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{grant.title}</div>
                        <div className="text-sm text-muted-foreground">PI: {grant.researcher}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-brand mb-1">{grant.amount}</div>
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
