import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DataFreshness } from '../components/DataFreshness';
import { SystemAnnouncements } from '../components/SystemAnnouncements';
import { DepartmentSelector } from '../components/DepartmentSelector';
import { DashboardPageHeader, tabClass } from '../components/layout';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  DollarSign,
  Search,
  Download,
  UserPlus,
  Sparkles,
  BookOpen,
  PlusCircle,
  ChevronRight,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const activeProjects = [
  { id: 'p1', name: 'AI for campus climate resilience', lead: 'Dr. Claver Ndahayo', progress: 72, budget: '$120K', status: 'On Track', description: 'Applying machine-learning models to campus energy and waste data to recommend evidence-based climate-action interventions.', team: ['Dr. Claver Ndahayo', 'Dr. Sarah Chen', 'Prof. Kelvin Onongha'], reports: ['Q1 Progress Report', 'Mid-term Review'] },
  { id: 'p2', name: 'Research data governance platform', lead: 'Assoc. Prof. Kayigema Jacques', progress: 65, budget: '$95K', status: 'On Track', description: 'Building an institutional repository and governance framework aligned with Rwanda\'s national data policy.', team: ['Assoc. Prof. Kayigema Jacques', 'Dr. Lisa Anderson'], reports: ['Inception Report', 'Technical Specification'] },
  { id: 'p3', name: 'Responsible AI policy pilot', lead: 'Prof. Kelvin Onongha', progress: 54, budget: '$80K', status: 'On Track', description: 'Piloting an AI-ethics review process for research projects involving automated decision-making.', team: ['Prof. Kelvin Onongha'], reports: ['Policy Draft v1'] },
  { id: 'p4', name: 'Vision models for learning analytics', lead: 'Dr. Sarah Chen', progress: 81, budget: '$110K', status: 'Ahead', description: 'Developing computer-vision tools to analyse classroom engagement data and generate personalised learning insights.', team: ['Dr. Sarah Chen', 'Dr. Claver Ndahayo'], reports: ['Phase 1 Report', 'Interim Findings', 'IRB Approval'] },
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

const AI_STRATEGIC_RECOMMENDATIONS = [
  { title: 'Expand Climate Research Cluster', priority: 'High', insight: 'Your institution has 4 researchers publishing in climate and AI — consolidating them into a named research cluster could attract 2–3x more international funding applications.', action: 'Create cluster', icon: TrendingUp },
  { title: 'Cross-Department Collaboration Gap', priority: 'Medium', insight: 'Computer Science and Academic Affairs share 6 common publication keywords but have zero formal collaboration projects. A joint grant application is statistically likely to succeed.', action: 'Initiate matchmaking', icon: Users },
  { title: 'Publication Velocity Alert', priority: 'Low', insight: 'Monthly submissions have grown 51% (Jan–May). Consider hiring a research communications officer to support dissemination before the pipeline overwhelms review capacity.', action: 'View analytics', icon: BarChart3 },
  { title: 'Funding Renewal Window', priority: 'High', insight: 'Two projects end within 60 days. Based on their output metrics, both qualify for renewal funding from the East Africa Research Impact Fund — deadline is 45 days away.', action: 'Prepare applications', icon: DollarSign },
];

export function ResearchManagerDashboard() {
  const navigate = useNavigate();
  const { user, researchers, research } = useApp();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Dialog states
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', department: '', role: 'researcher' });

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', lead: '', budget: '', description: '' });

  const [detailProject, setDetailProject] = useState<typeof activeProjects[0] | null>(null);
  const [teamProject, setTeamProject] = useState<typeof activeProjects[0] | null>(null);
  const [reportsProject, setReportsProject] = useState<typeof activeProjects[0] | null>(null);

  const [pubSearch, setPubSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'manager') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'manager') {
    return null;
  }

  const sectionMeta: Record<string, { title: string; description: string }> = {
    dashboard: { title: 'Research Dashboard', description: 'Overview of institutional research activities and performance' },
    projects: { title: 'Active Projects', description: 'Monitor ongoing research projects and their progress' },
    faculty: { title: 'Faculty & Staff Directory', description: 'View and manage all researchers and staff members' },
    analytics: { title: 'Analytics Overview', description: 'Comprehensive research performance analytics and insights' },
    reports: { title: 'Reports & Analytics', description: 'Generate and manage research reports' },
    strategic: { title: 'Strategic Planning', description: "AI-generated strategic recommendations based on your institution's research data and trends." },
    publications: { title: 'All Publications', description: `${research.length} indexed publications across all researchers` },
  };

  const sections = [
    { id: 'dashboard', label: 'Research Dashboard', icon: BarChart3 },
    { id: 'projects', label: 'Active Projects', icon: FileText },
    { id: 'faculty', label: 'Data Profile', icon: Users },
    { id: 'analytics', label: 'Analytics Overview', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'strategic', label: 'Strategic Planning', icon: Sparkles },
    { id: 'publications', label: 'All Publications', icon: BookOpen },
  ];

  const exportDirectory = () => {
    const rows = [['Name', 'Department', 'Institution', 'Publications', 'Citations', 'h-index']];
    researchers.forEach(r => rows.push([r.name, r.department || '', r.institution || '', String(r.publications || 0), String(r.citations || 0), String(r.hIndex || 0)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'faculty-directory.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Faculty directory exported as CSV.');
  };

  const exportReport = () => {
    const rows = [
      ['ResearchIQ — Institutional Report', '', '', ''],
      ['Generated', new Date().toLocaleDateString(), '', ''],
      ['', '', '', ''],
      ['SUMMARY METRICS', '', '', ''],
      ['Active Researchers', String(researchers.length), '', ''],
      ['Indexed Publications', String(research.length), '', ''],
      ['Active Projects', String(activeProjects.length), '', ''],
      ['Total Funding (est.)', '$14.5M', '', ''],
      ['', '', '', ''],
      ['DEPARTMENT BREAKDOWN', '', '', ''],
      ...departmentData.map(d => [d.department, String(d.count), '', '']),
      ['', '', '', ''],
      ['ACTIVE PROJECTS', '', '', ''],
      ...activeProjects.map(p => [p.name, p.lead, p.budget, `${p.progress}% complete`]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'research-report.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully.');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Invitation sent to ${inviteForm.email}`);
    setInviteOpen(false);
    setInviteForm({ name: '', email: '', department: '', role: 'researcher' });
  };

  const handleNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Project "${projectForm.name}" created.`);
    setNewProjectOpen(false);
    setProjectForm({ name: '', lead: '', budget: '', description: '' });
  };

  const filteredPubs = research.filter(r =>
    r.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
    r.keywords.some(k => k.toLowerCase().includes(pubSearch.toLowerCase()))
  );

  return (
    <>
      <DashboardPageHeader
        title={sectionMeta[activeSection].title}
        description={sectionMeta[activeSection].description}
        actions={
          <>
            {activeSection === 'dashboard' && (
              <>
                <DepartmentSelector value={selectedDepartment} onChange={setSelectedDepartment} showAllOption={true} />
                <DataFreshness lastUpdated={new Date()} variant="compact" />
              </>
            )}
            {activeSection === 'projects' && (
              <Button className="bg-brand-dark hover:bg-brand-dark" onClick={() => setNewProjectOpen(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                New Project
              </Button>
            )}
            {activeSection === 'faculty' && (
              <Button variant="outline" onClick={exportDirectory}>
                <Download className="w-4 h-4 mr-2" />
                Export List
              </Button>
            )}
            {activeSection === 'reports' && (
              <Button onClick={() => navigate('/manager/reports')} className="bg-brand-dark hover:bg-brand-dark">
                <FileText className="w-4 h-4 mr-2" />
                Open Report Builder
              </Button>
            )}
            {activeSection === 'publications' && (
              <Button variant="outline" onClick={() => {
                const rows = [['Title', 'Researcher', 'Field', 'Date', 'Citations', 'Keywords']];
                research.forEach(r => {
                  const lead = researchers.find(x => x.id === r.researcherId);
                  rows.push([r.title, lead?.name || '', r.field, r.publicationDate, String(r.citations), r.keywords.join(';')]);
                });
                const csv = rows.map(r => r.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'publications.csv'; a.click();
                URL.revokeObjectURL(url);
                toast.success('Publications exported.');
              }}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </>
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

          {activeSection === 'dashboard' && (
            <div>
              <div className="mb-6">
                <SystemAnnouncements limit={1} />
              </div>

              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-brand-muted rounded-lg"><Users className="w-6 h-6 text-brand-dark" /></div>
                    <Badge className="bg-brand-muted text-brand-dark">+12%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{researchers.length}</div>
                  <div className="text-sm text-muted-foreground">Active Researchers</div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-success-muted rounded-lg"><FileText className="w-6 h-6 text-success" /></div>
                    <Badge className="bg-success-muted text-success-foreground">+8%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{research.length}</div>
                  <div className="text-sm text-muted-foreground">Publications</div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-brand-muted rounded-lg"><DollarSign className="w-6 h-6 text-purple-600" /></div>
                    <Badge className="bg-brand-muted text-brand-dark">+15%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">$14.5M</div>
                  <div className="text-sm text-muted-foreground">Total Funding</div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-warning-muted rounded-lg"><TrendingUp className="w-6 h-6 text-orange-600" /></div>
                    <Badge className="bg-success-muted text-success-foreground">94%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">89</div>
                  <div className="text-sm text-muted-foreground">Impact Score</div>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
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
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Department Distribution</h3>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={200}>
                      <PieChart>
                        <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count">
                          {departmentData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {departmentData.map((dept, index) => (
                        <div key={dept.department} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span>{dept.department}</span>
                          </div>
                          <Badge variant="secondary">{dept.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => setInviteOpen(true)} className="p-4 bg-brand-muted/50 hover:bg-brand-muted rounded-lg text-left transition-all">
                    <UserPlus className="w-6 h-6 text-brand-dark mb-2" />
                    <div className="font-medium">Invite New Member</div>
                    <div className="text-xs text-muted-foreground">Add researchers to platform</div>
                  </button>
                  <button onClick={exportDirectory} className="p-4 bg-success-muted/50 hover:bg-success-muted rounded-lg text-left transition-all">
                    <FileText className="w-6 h-6 text-success mb-2" />
                    <div className="font-medium">Export Directory</div>
                    <div className="text-xs text-muted-foreground">Download faculty data (CSV)</div>
                  </button>
                  <button onClick={exportReport} className="p-4 bg-brand-muted/50 hover:bg-brand-muted rounded-lg text-left transition-all">
                    <BarChart3 className="w-6 h-6 text-brand-dark mb-2" />
                    <div className="font-medium">Generate Report</div>
                    <div className="text-xs text-muted-foreground">Export institutional analytics</div>
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* ── ACTIVE PROJECTS ── */}
          {activeSection === 'projects' && (
            <div>
              <div className="grid gap-6">
                {activeProjects.map(project => (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Lead: {project.lead}</span>
                          <span>•</span>
                          <span>Budget: {project.budget}</span>
                        </div>
                      </div>
                      <Badge className={
                        project.status === 'Ahead' ? 'bg-success-muted text-success-foreground' :
                        project.status === 'At Risk' ? 'bg-destructive/10 text-destructive' :
                        'bg-brand-muted text-brand-dark'
                      }>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${project.status === 'Ahead' ? 'bg-green-600' : project.status === 'At Risk' ? 'bg-red-600' : 'bg-brand-dark'}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setDetailProject(project)}>View Details</Button>
                      <Button size="sm" variant="outline" onClick={() => setTeamProject(project)}>Team</Button>
                      <Button size="sm" variant="outline" onClick={() => setReportsProject(project)}>Reports</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── DATA PROFILE (Faculty) ── */}
          {activeSection === 'faculty' && (
            <div>
              <Card className="p-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                  <Input placeholder="Search members, roles, or researchers..." className="pl-10" />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-6">
                {researchers.slice(0, 6).map(researcher => (
                  <Card key={researcher.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16 bg-brand-dark flex items-center justify-center text-white font-bold text-2xl">
                        {researcher.name.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{researcher.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{researcher.department} • {researcher.institution}</p>
                        <Badge className="bg-success-muted text-success-foreground text-xs">Accredited</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-brand-dark">{researcher.publications}</div>
                        <div className="text-xs text-muted-foreground">Publications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">{researcher.citations}</div>
                        <div className="text-xs text-muted-foreground">Citations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-brand-dark">{researcher.hIndex}</div>
                        <div className="text-xs text-muted-foreground">h-index</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => navigate(`/researcher/profile/${researcher.id}`)}>
                      View Profile
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeSection === 'analytics' && (
            <div>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-brand-muted/50">
                  <div className="text-4xl font-bold text-brand-dark mb-2">1,248</div>
                  <div className="text-sm text-foreground mb-1">Total Publications</div>
                  <div className="text-xs text-success">+18% vs last quarter</div>
                </Card>
                <Card className="p-6 bg-success-muted/50">
                  <div className="text-4xl font-bold text-success mb-2">372</div>
                  <div className="text-sm text-foreground mb-1">Active Collaborations</div>
                  <div className="text-xs text-success">+24% this month</div>
                </Card>
                <Card className="p-6 bg-brand-muted/50">
                  <div className="text-4xl font-bold text-brand-dark mb-2">94%</div>
                  <div className="text-sm text-foreground mb-1">Success Rate</div>
                  <div className="text-xs text-success">Above target</div>
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

          {/* ── REPORTS ── */}
          {activeSection === 'reports' && (
            <div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-bold mb-4">Quick Report Templates</h3>
                  <div className="space-y-2">
                    {['Performance Report', 'Collaboration Report', 'Funding Report', 'Trend Analysis'].map(label => (
                      <Button key={label} variant="outline" className="w-full justify-start" onClick={exportReport}>
                        <Download className="w-4 h-4 mr-2 shrink-0" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="font-bold mb-4">Recent Reports</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Q1 Performance Report', date: 'Jan 15, 2024' },
                      { title: 'Collaboration Metrics', date: 'Jan 10, 2024' },
                      { title: 'Funding Analysis', date: 'Jan 5, 2024' },
                    ].map(r => (
                      <div key={r.title} className="p-3 bg-muted/50 rounded-lg border border-border flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{r.title}</div>
                          <div className="text-xs text-muted-foreground">Generated {r.date}</div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={exportReport}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── STRATEGIC PLANNING (AI) ── */}
          {activeSection === 'strategic' && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Badge className="bg-brand-dark text-white px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1 inline" />
                  AI-powered
                </Badge>
              </div>

              <div className="grid gap-6 mb-8">
                {AI_STRATEGIC_RECOMMENDATIONS.map((rec, i) => {
                  const Icon = rec.icon;
                  return (
                    <Card key={i} className="p-6 border border-border hover:border-brand/20 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 ${rec.priority === 'High' ? 'bg-destructive/10' : rec.priority === 'Medium' ? 'bg-amber-50' : 'bg-brand-muted/50'}`}>
                          <Icon className={`w-6 h-6 ${rec.priority === 'High' ? 'text-destructive' : rec.priority === 'Medium' ? 'text-amber-600' : 'text-brand-dark'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{rec.title}</h3>
                            <Badge className={rec.priority === 'High' ? 'bg-destructive/10 text-destructive' : rec.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-brand-muted text-brand-dark'}>
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{rec.insight}</p>
                          <Button size="sm" className="bg-brand-dark hover:bg-brand-dark">
                            {rec.action}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="p-6 bg-brand-muted/50 border border-border">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-brand-dark shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">About AI Strategic Planning</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      These recommendations are generated by analysing publication trends, collaboration patterns, funding cycles, and researcher expertise clusters across your institution. Insights are refreshed weekly as new data is indexed.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ── ALL PUBLICATIONS ── */}
          {activeSection === 'publications' && (
            <div>
              <Card className="p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                  <Input placeholder="Search by title or keyword..." className="pl-9" value={pubSearch} onChange={e => setPubSearch(e.target.value)} />
                </div>
              </Card>

              <div className="space-y-4">
                {filteredPubs.map(pub => {
                  const lead = researchers.find(r => r.id === pub.researcherId);
                  return (
                    <Card key={pub.id} className="p-5 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-brand-dark mb-1">{pub.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{lead?.name} • {pub.field} • {pub.publicationDate}</p>
                          <p className="text-sm text-foreground line-clamp-2">{pub.abstract}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pub.keywords.map(k => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>)}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-brand-dark">{pub.citations}</div>
                          <div className="text-xs text-muted-foreground">citations</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {filteredPubs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                    <p>No publications match your search.</p>
                  </div>
                )}
              </div>
            </div>
          )}

      {/* ── Dialogs ── */}

      {/* Invite New Member */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Invite New Member</DialogTitle></DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div><Label>Full Name</Label><Input required value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Jane Doe" className="mt-1" /></div>
            <div><Label>Email Address</Label><Input required type="email" value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} placeholder="jane.doe@auca.edu" className="mt-1" /></div>
            <div><Label>Department</Label><Input value={inviteForm.department} onChange={e => setInviteForm(p => ({ ...p, department: e.target.value }))} placeholder="Computer Science" className="mt-1" /></div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-brand-dark hover:bg-brand-dark">Send Invitation</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Project */}
      <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
          <form onSubmit={handleNewProject} className="space-y-4">
            <div><Label>Project Name</Label><Input required value={projectForm.name} onChange={e => setProjectForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. AI for Health Data" className="mt-1" /></div>
            <div><Label>Lead Researcher</Label><Input required value={projectForm.lead} onChange={e => setProjectForm(p => ({ ...p, lead: e.target.value }))} placeholder="Dr. Name Surname" className="mt-1" /></div>
            <div><Label>Budget</Label><Input value={projectForm.budget} onChange={e => setProjectForm(p => ({ ...p, budget: e.target.value }))} placeholder="$50K" className="mt-1" /></div>
            <div><Label>Description</Label><Textarea rows={3} value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief project description..." className="mt-1" /></div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setNewProjectOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-brand-dark hover:bg-brand-dark">Create Project</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details */}
      <Dialog open={!!detailProject} onOpenChange={() => setDetailProject(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{detailProject?.name}</DialogTitle></DialogHeader>
          {detailProject && (
            <div className="space-y-4">
              <p className="text-foreground text-sm leading-relaxed">{detailProject.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-muted/50 p-3 rounded-lg"><div className="text-xs text-muted-foreground">Lead Researcher</div><div className="font-semibold text-sm">{detailProject.lead}</div></div>
                <div className="bg-success-muted/50 p-3 rounded-lg"><div className="text-xs text-muted-foreground">Budget</div><div className="font-semibold text-sm">{detailProject.budget}</div></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2"><span className="text-muted-foreground">Progress</span><span className="font-bold">{detailProject.progress}%</span></div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-brand-dark rounded-full" style={{ width: `${detailProject.progress}%` }} />
                </div>
              </div>
              <Badge className={detailProject.status === 'Ahead' ? 'bg-success-muted text-success-foreground' : 'bg-brand-muted text-brand-dark'}>{detailProject.status}</Badge>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Team */}
      <Dialog open={!!teamProject} onOpenChange={() => setTeamProject(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Project Team — {teamProject?.name}</DialogTitle></DialogHeader>
          {teamProject && (
            <div className="space-y-3">
              {teamProject.team.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold">{member.charAt(0)}</div>
                  <div>
                    <div className="font-medium text-sm">{member}</div>
                    <div className="text-xs text-muted-foreground">{i === 0 ? 'Lead Researcher' : 'Team Member'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reports */}
      <Dialog open={!!reportsProject} onOpenChange={() => setReportsProject(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reports — {reportsProject?.name}</DialogTitle></DialogHeader>
          {reportsProject && (
            <div className="space-y-3">
              {reportsProject.reports.map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-dark" />
                    <span className="text-sm font-medium">{report}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { toast.success(`Downloading "${report}"...`); }}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
