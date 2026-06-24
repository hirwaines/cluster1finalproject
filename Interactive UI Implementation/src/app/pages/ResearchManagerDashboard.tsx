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
import { ChatPanel, ChatHeaderButton } from '../components/ChatPanel';
import { useApp } from '../context/AppContext';
import {
  Brain,
  LogOut,
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  DollarSign,
  Search,
  Download,
  UserPlus,
  Database,
  Target,
  Network as NetworkIcon,
  Sparkles,
  BookOpen,
  PlusCircle,
  X,
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
  const { user, logout, researchers, research, chatMessages } = useApp();
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

  const [allPubsOpen, setAllPubsOpen] = useState(false);
  const [pubSearch, setPubSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'manager') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'manager') {
    return null;
  }

  const unreadChat = chatMessages.filter(m => m.receiverId === user.id && !m.read).length;

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-blue-900">
              ResearchIQ
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <ChatHeaderButton unreadTotal={unreadChat} />
            <div className="flex items-center gap-3 pl-4 border-l">
              <Avatar className="w-10 h-10 bg-blue-800 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </Avatar>
              <div>
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-gray-500">Research Manager</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-[73px] self-start">
          <div className="p-4">
            <div className="space-y-1">
              {sections.map(section => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive ? 'bg-blue-800 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {section.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="text-xs font-semibold text-gray-500 mb-3 px-3">SYSTEM</div>
              <div className="space-y-1">
                <button onClick={() => navigate('/data-integration')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <Database className="w-5 h-5" />
                  Data Integration
                </button>
                <button onClick={() => navigate('/expertise-map')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <Target className="w-5 h-5" />
                  Expertise Mapping
                </button>
                <button onClick={() => navigate('/network')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <NetworkIcon className="w-5 h-5" />
                  Collaboration Network
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* ── DASHBOARD ── */}
          {activeSection === 'dashboard' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold">Research Dashboard</h1>
                  <div className="flex items-center gap-4">
                    <DepartmentSelector value={selectedDepartment} onChange={setSelectedDepartment} showAllOption={true} />
                    <DataFreshness lastUpdated={new Date()} variant="compact" />
                  </div>
                </div>
                <p className="text-gray-600">Overview of institutional research activities and performance</p>
              </div>

              <div className="mb-6">
                <SystemAnnouncements limit={1} />
              </div>

              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-800" /></div>
                    <Badge className="bg-blue-100 text-blue-900">+12%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{researchers.length}</div>
                  <div className="text-sm text-gray-600">Active Researchers</div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg"><FileText className="w-6 h-6 text-green-600" /></div>
                    <Badge className="bg-green-100 text-green-700">+8%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{research.length}</div>
                  <div className="text-sm text-gray-600">Publications</div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg"><DollarSign className="w-6 h-6 text-purple-600" /></div>
                    <Badge className="bg-purple-100 text-purple-700">+15%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">$14.5M</div>
                  <div className="text-sm text-gray-600">Total Funding</div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg"><TrendingUp className="w-6 h-6 text-orange-600" /></div>
                    <Badge className="bg-green-100 text-green-700">94%</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">89</div>
                  <div className="text-sm text-gray-600">Impact Score</div>
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
                  <button onClick={() => setInviteOpen(true)} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-all">
                    <UserPlus className="w-6 h-6 text-blue-800 mb-2" />
                    <div className="font-medium">Invite New Member</div>
                    <div className="text-xs text-gray-600">Add researchers to platform</div>
                  </button>
                  <button onClick={exportDirectory} className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-all">
                    <FileText className="w-6 h-6 text-green-600 mb-2" />
                    <div className="font-medium">Export Directory</div>
                    <div className="text-xs text-gray-600">Download faculty data (CSV)</div>
                  </button>
                  <button onClick={exportReport} className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-all">
                    <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
                    <div className="font-medium">Generate Report</div>
                    <div className="text-xs text-gray-600">Export institutional analytics</div>
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* ── ACTIVE PROJECTS ── */}
          {activeSection === 'projects' && (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Active Projects</h1>
                  <p className="text-gray-600">Monitor ongoing research projects and their progress</p>
                </div>
                <Button className="bg-blue-900 hover:bg-blue-950" onClick={() => setNewProjectOpen(true)}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

              <div className="grid gap-6">
                {activeProjects.map(project => (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-all">
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
                        'bg-blue-100 text-blue-900'
                      }>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${project.status === 'Ahead' ? 'bg-green-600' : project.status === 'At Risk' ? 'bg-red-600' : 'bg-blue-800'}`}
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
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Faculty & Staff Directory</h1>
                  <p className="text-gray-600">View and manage all researchers and staff members</p>
                </div>
                <Button variant="outline" onClick={exportDirectory}>
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
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
                      <Avatar className="w-16 h-16 bg-blue-800 flex items-center justify-center text-white font-bold text-2xl">
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
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analytics Overview</h1>
                <p className="text-gray-600">Comprehensive research performance analytics and insights</p>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <Card className="p-6 from-blue-50 to-blue-100">
                  <div className="text-4xl font-bold text-blue-800 mb-2">1,248</div>
                  <div className="text-sm text-gray-700 mb-1">Total Publications</div>
                  <div className="text-xs text-green-600">+18% vs last quarter</div>
                </Card>
                <Card className="p-6 bg-green-50">
                  <div className="text-4xl font-bold text-green-600 mb-2">372</div>
                  <div className="text-sm text-gray-700 mb-1">Active Collaborations</div>
                  <div className="text-xs text-green-600">+24% this month</div>
                </Card>
                <Card className="p-6 from-purple-50 to-purple-100">
                  <div className="text-4xl font-bold text-purple-600 mb-2">94%</div>
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

          {/* ── REPORTS ── */}
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
                      <div key={r.title} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{r.title}</div>
                          <div className="text-xs text-gray-500">Generated {r.date}</div>
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
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">Strategic Planning</h1>
                  <Badge className="bg-blue-900 text-white px-3 py-1">
                    <Sparkles className="w-3 h-3 mr-1 inline" />
                    AI-powered
                  </Badge>
                </div>
                <p className="text-gray-600">AI-generated strategic recommendations based on your institution's research data and trends.</p>
              </div>

              <div className="grid gap-6 mb-8">
                {AI_STRATEGIC_RECOMMENDATIONS.map((rec, i) => {
                  const Icon = rec.icon;
                  return (
                    <Card key={i} className="p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 ${rec.priority === 'High' ? 'bg-red-50' : rec.priority === 'Medium' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                          <Icon className={`w-6 h-6 ${rec.priority === 'High' ? 'text-red-600' : rec.priority === 'Medium' ? 'text-amber-600' : 'text-blue-800'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{rec.title}</h3>
                            <Badge className={rec.priority === 'High' ? 'bg-red-100 text-red-700' : rec.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-900'}>
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{rec.insight}</p>
                          <Button size="sm" className="bg-blue-900 hover:bg-blue-950">
                            {rec.action}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="p-6 bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-blue-800 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">About AI Strategic Planning</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
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
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">All Publications</h1>
                  <p className="text-gray-600">{research.length} indexed publications across all researchers</p>
                </div>
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
              </div>

              <Card className="p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                          <h3 className="font-bold text-blue-900 mb-1">{pub.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{lead?.name} • {pub.field} • {pub.publicationDate}</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{pub.abstract}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pub.keywords.map(k => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>)}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-blue-800">{pub.citations}</div>
                          <div className="text-xs text-gray-500">citations</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {filteredPubs.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No publications match your search.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

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
              <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-950">Send Invitation</Button>
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
              <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-950">Create Project</Button>
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
              <p className="text-gray-700 text-sm leading-relaxed">{detailProject.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg"><div className="text-xs text-gray-500">Lead Researcher</div><div className="font-semibold text-sm">{detailProject.lead}</div></div>
                <div className="bg-green-50 p-3 rounded-lg"><div className="text-xs text-gray-500">Budget</div><div className="font-semibold text-sm">{detailProject.budget}</div></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2"><span className="text-gray-600">Progress</span><span className="font-bold">{detailProject.progress}%</span></div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-900 rounded-full" style={{ width: `${detailProject.progress}%` }} />
                </div>
              </div>
              <Badge className={detailProject.status === 'Ahead' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-900'}>{detailProject.status}</Badge>
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
                <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold">{member.charAt(0)}</div>
                  <div>
                    <div className="font-medium text-sm">{member}</div>
                    <div className="text-xs text-gray-500">{i === 0 ? 'Lead Researcher' : 'Team Member'}</div>
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
                <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-800" />
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

      <ChatPanel />
    </div>
  );
}
