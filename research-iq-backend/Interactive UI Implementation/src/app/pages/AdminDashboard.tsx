import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  CheckCircle, XCircle, FileText, Users, TrendingUp, Clock, Eye, Download,
  UserPlus, GraduationCap, BarChart3, DollarSign, Sparkles, ShieldCheck,
  Database, Search, Trash2, BookOpen, Zap, AlertCircle, Settings,
  Activity, Network, Plus, Edit, EyeOff,
} from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

// ── Color tokens ──────────────────────────────────────────────────────────────
const BLUE       = '#1E40AF';
const DARK_BLUE  = '#1E3A8A';
const GREEN      = '#047857';
const DARK_GREEN = '#065F46';
const LT_BLUE    = '#EFF6FF';
const LT_GREEN   = '#ECFDF5';
const TEXT       = '#0F172A';
const MUTED      = '#64748B';
const BORDER     = '#E2E8F0';
const BG         = '#F8FAFC';
const CHART_C    = [BLUE, GREEN, '#3B82F6', '#10B981'];

// ── Static mock data ──────────────────────────────────────────────────────────
const pubTrend = [
  { month: 'Jan', submitted: 45, approved: 40 },
  { month: 'Feb', submitted: 52, approved: 48 },
  { month: 'Mar', submitted: 48, approved: 44 },
  { month: 'Apr', submitted: 61, approved: 56 },
  { month: 'May', submitted: 68, approved: 62 },
  { month: 'Jun', submitted: 74, approved: 70 },
];
const deptData = [
  { name: 'Computer Science', count: 14 },
  { name: 'Research Office', count: 11 },
  { name: 'University Leadership', count: 9 },
  { name: 'Academic Affairs', count: 8 },
  { name: 'Data Science', count: 7 },
];
const activeProjects = [
  { name: 'AI for campus climate resilience', lead: 'Dr. Claver Ndahayo', progress: 72, budget: '$120K', status: 'On Track' },
  { name: 'Research data governance platform', lead: 'Assoc. Prof. Kayigema Jacques', progress: 65, budget: '$95K', status: 'On Track' },
  { name: 'Responsible AI policy pilot', lead: 'Prof. Kelvin Onongha', progress: 54, budget: '$80K', status: 'On Track' },
  { name: 'Vision models for learning analytics', lead: 'Dr. Sarah Chen', progress: 81, budget: '$110K', status: 'Ahead' },
];
const AI_INSIGHTS = [
  { type: 'match', icon: Sparkles, title: 'High-value collaboration match', desc: 'Dr. Sarah Chen (ML) and Prof. Ndahayo (Climate) share 4 overlapping research themes. Recommended match score: 94%.', color: BLUE, bg: LT_BLUE },
  { type: 'trend', icon: TrendingUp, title: 'Emerging topic detected', desc: 'Publications mentioning "Generative AI" increased 23% over the last 60 days across 3 departments.', color: GREEN, bg: LT_GREEN },
  { type: 'alert', icon: AlertCircle, title: 'Duplicate abstract flagged', desc: '3 recent submissions share near-identical abstracts. Automated plagiarism check recommends review.', color: BLUE, bg: LT_BLUE },
  { type: 'funding', icon: DollarSign, title: 'Funding opportunity match', desc: 'Environmental Science has 6 unfunded projects eligible for East Africa Research Fund RFP (closes Aug 2026).', color: GREEN, bg: LT_GREEN },
];
const REPORT_TEMPLATES = [
  { label: 'Q2 Performance Report', icon: BarChart3 },
  { label: 'Collaboration Network Report', icon: Network },
  { label: 'Funding Pipeline Report', icon: DollarSign },
  { label: 'Researcher Impact Report', icon: TrendingUp },
  { label: 'Department Analytics Report', icon: Activity },
  { label: 'Publication Trend Report', icon: FileText },
];
const RECENT_REPORTS = [
  { title: 'Q1 Performance Report', date: 'Jan 15, 2026', size: '2.4 MB' },
  { title: 'Collaboration Metrics', date: 'Jan 10, 2026', size: '1.1 MB' },
  { title: 'Funding Analysis', date: 'Jan 5, 2026', size: '890 KB' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, blue }: { label: string; value: React.ReactNode; sub?: string; blue?: boolean }) {
  const accent = blue ? BLUE : GREEN;
  const bg     = blue ? LT_BLUE : LT_GREEN;
  return (
    <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ width: 38, height: 38, bgcolor: bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Activity size={18} color={accent} />
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ color: TEXT, mb: 0.25 }}>{value}</Typography>
        <Typography variant="body2" sx={{ color: MUTED }}>{label}</Typography>
        {sub && <Typography sx={{ fontSize: '0.72rem', color: accent, fontWeight: 600, mt: 0.5 }}>{sub}</Typography>}
      </CardContent>
    </Card>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const navigate = useNavigate();
  const {
    user, logout, pendingResearchers, pendingFunders,
    approveResearcher, rejectResearcher, approveFunder, rejectFunder,
    pendingPublications, approvePublication, rejectPublication,
    researchers, research, collaborationRequests,
    createStaffAccount, deleteUser, disableUser,
    importPublicationsFromRows,
  } = useApp();

  const [tab, setTab]           = useState(0);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showStaff, setShowStaff] = useState(false);
  const [roleFilter, setRoleFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [csvText, setCsvText]   = useState('title,researcherId,keywords\nMachine Learning for Climate Prediction,1,"ML;Climate"\n');
  const [importDone, setImportDone] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postText, setPostText] = useState('');
  const [staffForm, setStaffForm] = useState({
    name: '', email: '',
    role: 'manager' as 'funder' | 'manager' | 'department_head',
    institution: '', department: '',
  });

  // ── ALL hooks must be before any early return ─────────────────────────────
  const filteredUsers = useMemo(() => researchers.filter(r => {
    if (roleFilter !== 'all' && r.role !== roleFilter) return false;
    if (statusFilter === 'verified' && (r.disabled || !r.verified)) return false;
    if (statusFilter === 'disabled' && !r.disabled) return false;
    if (userSearch && !r.name.toLowerCase().includes(userSearch.toLowerCase()) &&
        !(r.email ?? '').toLowerCase().includes(userSearch.toLowerCase())) return false;
    return true;
  }), [researchers, roleFilter, statusFilter, userSearch]);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login');
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const selectedProfile = pendingResearchers.find(r => r.id === detailId);

  const approve = (id: string) => { approveResearcher(id); toast.success('Researcher approved'); setDetailId(null); };
  const reject  = (id: string) => { rejectResearcher(id); toast.error('Application rejected'); setDetailId(null); };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    createStaffAccount(staffForm);
    toast.success('Staff account provisioned.');
    setShowStaff(false);
    setStaffForm({ name: '', email: '', role: 'manager', institution: '', department: '' });
  };

  const processCSV = () => {
    const lines = csvText.trim().split(/\n/);
    const rows: { title: string; researcherId: string; keywords: string[] }[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      const title = (parts[0] || '').trim();
      const researcherId = (parts[1] || '').trim();
      const kwRaw = parts.slice(2).join(',').replace(/^"|"$/g, '');
      const keywords = kwRaw.split(';').map(k => k.trim()).filter(Boolean);
      if (title) rows.push({ title, researcherId, keywords });
    }
    importPublicationsFromRows(rows.map(r => ({
      title: r.title, researcherId: r.researcherId, keywords: r.keywords,
      abstract: 'Imported via CSV.', authors: [], field: 'General',
      citations: 0, publicationDate: new Date().toISOString().split('T')[0],
    })));
    setImportDone(true);
    toast.success(`Imported ${rows.length} publication rows`);
  };

  const tabs = [
    { label: 'Overview',     icon: Activity    },
    { label: 'Researchers',  icon: Users       },
    { label: 'Publications', icon: FileText    },
    { label: 'Funders',      icon: DollarSign  },
    { label: 'Analytics',    icon: BarChart3   },
    { label: 'Projects',     icon: BookOpen    },
    { label: 'Users',        icon: ShieldCheck },
    { label: 'Reports',      icon: TrendingUp  },
    { label: 'Import',       icon: Database    },
  ];

  return (
    <AppShell>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h4" fontWeight={800} sx={{ color: TEXT }}>Super Admin Dashboard</Typography>
              <Chip icon={<ShieldCheck size={13} />} label="Super Admin" size="small"
                sx={{ bgcolor: LT_BLUE, color: BLUE, fontWeight: 700, '& .MuiChip-icon': { color: BLUE } }} />
            </Box>
            <Typography color="text.secondary">Full system authority — all roles, all data, all controls</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" size="small" startIcon={<Plus size={15} />}
              onClick={() => setShowCreatePost(true)}
              sx={{ borderColor: BLUE, color: BLUE, '&:hover': { bgcolor: LT_BLUE } }}>
              Create Post
            </Button>
            <Button variant="contained" size="small" startIcon={<Zap size={15} />}
              onClick={() => navigate('/admin/knowledge-processing')}
              sx={{ bgcolor: GREEN, '&:hover': { bgcolor: DARK_GREEN } }}>
              AI Processing
            </Button>
          </Box>
        </Box>

        {/* ── System Stats ───────────────────────────────────────── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2.5, mb: 4 }}>
          <StatCard blue label="Directory accounts" value={researchers.length} sub={`+${researchers.filter(r=>r.role==='researcher').length} researchers`} />
          <StatCard       label="Indexed publications" value={research.length} sub="+8% this quarter" />
          <StatCard blue  label="Pending queue"
            value={pendingResearchers.length + pendingFunders.length + pendingPublications.length}
            sub="Needs review" />
          <StatCard       label="Active collaborations"
            value={collaborationRequests.filter(c=>c.status==='accepted').length}
            sub="+24% this month" />
          <StatCard blue  label="Total funding tracked" value="$14.5M" sub="Across all projects" />
        </Box>

        {/* ── Tabs ───────────────────────────────────────────────── */}
        <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: `1px solid ${BORDER}`, px: 2 }}>
            <MuiTabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { minHeight: 52, fontSize: '0.8125rem', fontWeight: 500, color: MUTED, textTransform: 'none' },
                '& .Mui-selected': { color: BLUE, fontWeight: 700 },
                '& .MuiTabs-indicator': { bgcolor: BLUE, height: 3, borderRadius: '3px 3px 0 0' },
              }}
            >
              {tabs.map((t, i) => {
                const Icon = t.icon;
                const count = i === 1 ? pendingResearchers.length
                            : i === 2 ? pendingPublications.length
                            : i === 3 ? pendingFunders.length
                            : 0;
                return (
                  <MuiTab
                    key={t.label}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Icon size={15} />
                        {t.label}
                        {count > 0 && (
                          <Box sx={{ minWidth: 18, height: 18, px: '5px', bgcolor: BLUE, color: '#fff', borderRadius: '9px', fontSize: '0.6875rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {count}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                );
              })}
            </MuiTabs>
          </Box>

          <Box sx={{ p: 3 }}>

            {/* ════════════════════ OVERVIEW ════════════════════ */}
            {tab === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Quick Actions */}
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: TEXT, mb: 2 }}>Quick Actions</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 2 }}>
                    {[
                      { label: 'Accreditation Queue', icon: Users, count: pendingResearchers.length, action: () => setTab(1), blue: true },
                      { label: 'Publication Queue', icon: FileText, count: pendingPublications.length, action: () => setTab(2), blue: false },
                      { label: 'Funder Applications', icon: DollarSign, count: pendingFunders.length, action: () => setTab(3), blue: true },
                      { label: 'Knowledge & AI', icon: Sparkles, count: 0, action: () => navigate('/admin/knowledge-processing'), blue: false },
                      { label: 'Security Center', icon: ShieldCheck, count: 0, action: () => navigate('/admin/security-management'), blue: true },
                      { label: 'Data Sources', icon: Database, count: 0, action: () => navigate('/data-integration'), blue: false },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <Card key={item.label} variant="outlined" onClick={item.action}
                          sx={{ cursor: 'pointer', borderRadius: '12px', borderColor: BORDER, p: 2.5,
                            '&:hover': { borderColor: item.blue ? BLUE : GREEN, boxShadow: '0 4px 12px rgba(30,64,175,0.08)' },
                            transition: 'all 0.15s' }}>
                          <Box sx={{ width: 36, height: 36, bgcolor: item.blue ? LT_BLUE : LT_GREEN,
                            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                            <Icon size={18} color={item.blue ? BLUE : GREEN} />
                          </Box>
                          <Typography variant="body2" fontWeight={600} sx={{ color: TEXT }}>{item.label}</Typography>
                          {item.count > 0 && (
                            <Typography sx={{ fontSize: '0.75rem', color: item.blue ? BLUE : GREEN, fontWeight: 700, mt: 0.5 }}>
                              {item.count} pending
                            </Typography>
                          )}
                        </Card>
                      );
                    })}
                  </Box>
                </Box>

                {/* AI Insights */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Sparkles size={18} color={BLUE} />
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: TEXT }}>AI Insights</Typography>
                    <Chip label="LIVE" size="small" sx={{ bgcolor: LT_GREEN, color: GREEN, fontWeight: 800, fontSize: '0.6rem', height: 18 }} />
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                    {AI_INSIGHTS.map((ins, i) => {
                      const Icon = ins.icon;
                      return (
                        <Card key={i} variant="outlined"
                          sx={{ borderRadius: '12px', borderColor: ins.color === BLUE ? '#BFDBFE' : '#A7F3D0', bgcolor: ins.bg }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              <Box sx={{ width: 32, height: 32, bgcolor: '#FFFFFF', borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={16} color={ins.color} />
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={700} sx={{ color: TEXT, mb: 0.5 }}>{ins.title}</Typography>
                                <Typography sx={{ fontSize: '0.78rem', color: MUTED, lineHeight: 1.5 }}>{ins.desc}</Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                </Box>

                {/* Charts row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: TEXT, mb: 2 }}>Publication Trend</Typography>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={pubTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="submitted" stroke={BLUE} strokeWidth={2} dot={false} name="Submitted" />
                          <Line type="monotone" dataKey="approved" stroke={GREEN} strokeWidth={2} dot={false} name="Approved" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: TEXT, mb: 2 }}>Research by Department</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ResponsiveContainer width="50%" height={200}>
                          <PieChart>
                            <Pie data={deptData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count">
                              {deptData.map((_, idx) => <Cell key={idx} fill={CHART_C[idx % CHART_C.length]} />)}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ flex: 1 }}>
                          {deptData.map((d, idx) => (
                            <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: CHART_C[idx % CHART_C.length] }} />
                                <Typography sx={{ fontSize: '0.75rem', color: MUTED }}>{d.name}</Typography>
                              </Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: TEXT }}>{d.count}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}

            {/* ════════════════════ RESEARCHERS ════════════════════ */}
            {tab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>
                  Accreditation Queue
                  {pendingResearchers.length > 0 && (
                    <Chip label={pendingResearchers.length} size="small" sx={{ ml: 1.5, bgcolor: LT_BLUE, color: BLUE, fontWeight: 700 }} />
                  )}
                </Typography>

                {pendingResearchers.length === 0 ? (
                  <Alert icon={<CheckCircle size={18} />} severity="success" sx={{ bgcolor: LT_GREEN, color: DARK_GREEN, border: `1px solid #A7F3D0` }}>
                    All accreditation applications have been reviewed. Queue is clear.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pendingResearchers.map(r => (
                      <Card key={r.id} variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                            <Avatar sx={{ width: 52, height: 52, bgcolor: BLUE, fontWeight: 700, fontSize: '1.25rem' }}>
                              {r.name.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: TEXT }}>{r.name}</Typography>
                                  <Typography variant="body2" color="text.secondary">{r.email}</Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.75 }}>
                                    <Chip size="small" icon={<GraduationCap size={11} />} label={r.institution} sx={{ fontSize: '0.72rem', bgcolor: BG }} />
                                    <Chip size="small" label={r.department} sx={{ fontSize: '0.72rem', bgcolor: BG }} />
                                    <Chip size="small" label={`ORCID: ${r.orcid}`} sx={{ fontSize: '0.72rem', bgcolor: BG }} />
                                  </Box>
                                </Box>
                                <Chip label={`Submitted ${r.submittedDate}`} size="small" sx={{ bgcolor: '#FFFBEB', color: '#92400E', fontWeight: 600 }} />
                              </Box>

                              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2 }}>
                                {[
                                  { label: 'Degree', value: r.degree.toUpperCase(), blue: true },
                                  { label: 'Experience', value: `${r.experience} yrs`, blue: false },
                                  { label: 'Publications', value: r.publications.length, blue: true },
                                ].map(s => (
                                  <Box key={s.label} sx={{ bgcolor: s.blue ? LT_BLUE : LT_GREEN, borderRadius: '10px', p: 1.5, textAlign: 'center' }}>
                                    <Typography variant="body2" fontWeight={700} sx={{ color: s.blue ? BLUE : GREEN }}>{s.value}</Typography>
                                    <Typography sx={{ fontSize: '0.72rem', color: MUTED }}>{s.label}</Typography>
                                  </Box>
                                ))}
                              </Box>

                              <Alert icon={<CheckCircle size={15} />} severity="success"
                                sx={{ mb: 2, bgcolor: LT_GREEN, color: DARK_GREEN, border: `1px solid #A7F3D0`, py: 0.75 }}>
                                Accreditation requirements met — {r.degree === 'phd' ? 'PhD verified' : `${r.experience}+ years experience`}
                              </Alert>

                              <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Button size="small" variant="outlined"
                                  onClick={() => setDetailId(r.id)}
                                  startIcon={<Eye size={14} />}
                                  sx={{ borderColor: BORDER, color: MUTED }}>View Details</Button>
                                <Button size="small" variant="contained"
                                  onClick={() => approve(r.id)}
                                  startIcon={<CheckCircle size={14} />}
                                  sx={{ bgcolor: GREEN, '&:hover': { bgcolor: DARK_GREEN } }}>Approve</Button>
                                <Button size="small" variant="outlined"
                                  onClick={() => reject(r.id)}
                                  startIcon={<XCircle size={14} />}
                                  sx={{ borderColor: '#FCA5A5', color: '#B91C1C', '&:hover': { bgcolor: '#FEF2F2' } }}>Reject</Button>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>Verified Researchers</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2 }}>
                  {researchers.filter(r => r.role === 'researcher').slice(0, 6).map(r => (
                    <Card key={r.id} variant="outlined" onClick={() => navigate(`/researcher/profile/${r.id}`)}
                      sx={{ borderRadius: '12px', borderColor: BORDER, cursor: 'pointer',
                        '&:hover': { borderColor: BLUE, boxShadow: '0 4px 12px rgba(30,64,175,0.08)' }, transition: 'all 0.15s' }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <Avatar sx={{ width: 44, height: 44, bgcolor: BLUE, fontWeight: 700 }}>{r.name.charAt(0)}</Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={700} noWrap sx={{ color: TEXT }}>{r.name}</Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: MUTED }} noWrap>{r.department}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, textAlign: 'center' }}>
                          {[['Publications', r.publications, true], ['Citations', r.citations, false], ['h-index', r.hIndex, true]].map(([l, v, b]) => (
                            <Box key={String(l)}>
                              <Typography variant="body2" fontWeight={700} sx={{ color: b ? BLUE : GREEN }}>{v}</Typography>
                              <Typography sx={{ fontSize: '0.68rem', color: MUTED }}>{l}</Typography>
                            </Box>
                          ))}
                        </Box>
                        <Chip label="Verified" size="small" sx={{ mt: 1.5, bgcolor: LT_GREEN, color: GREEN, fontWeight: 700 }} />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* ════════════════════ PUBLICATIONS ════════════════════ */}
            {tab === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>
                    Publication Approval Queue
                    {pendingPublications.length > 0 && (
                      <Chip label={pendingPublications.length} size="small" sx={{ ml: 1.5, bgcolor: LT_BLUE, color: BLUE, fontWeight: 700 }} />
                    )}
                  </Typography>
                  <Button size="small" variant="outlined" onClick={() => setTab(8)}
                    startIcon={<Download size={14} />} sx={{ borderColor: BLUE, color: BLUE }}>
                    Bulk CSV Import
                  </Button>
                </Box>

                {pendingPublications.length === 0 ? (
                  <Alert severity="success" sx={{ bgcolor: LT_GREEN, color: DARK_GREEN, border: `1px solid #A7F3D0` }}>
                    No publications pending approval. All submissions have been reviewed.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pendingPublications.map(pub => (
                      <Card key={pub.id} variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="subtitle1" fontWeight={700} sx={{ color: BLUE, mb: 0.25 }}>{pub.title}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {pub.researcherName} • Submitted {pub.submittedDate}
                              </Typography>
                            </Box>
                            <Chip label="Pending Review" size="small"
                              sx={{ bgcolor: LT_BLUE, color: BLUE, fontWeight: 700, flexShrink: 0 }} />
                          </Box>

                          <Typography sx={{ fontSize: '0.85rem', color: MUTED, mb: 2, lineHeight: 1.7,
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {pub.abstract}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                            {pub.suggestedKeywords?.map(k => (
                              <Chip key={k} label={k} size="small" sx={{ bgcolor: LT_BLUE, color: BLUE, fontSize: '0.72rem' }} />
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            <Button size="small" variant="contained"
                              onClick={() => { approvePublication(pub.id); toast.success('Publication approved and indexed'); }}
                              startIcon={<CheckCircle size={14} />}
                              sx={{ bgcolor: GREEN, '&:hover': { bgcolor: DARK_GREEN } }}>
                              Approve & Index
                            </Button>
                            <Button size="small" variant="outlined"
                              onClick={() => { rejectPublication(pub.id); toast.info('Submission rejected'); }}
                              startIcon={<XCircle size={14} />}
                              sx={{ borderColor: '#FCA5A5', color: '#B91C1C', '&:hover': { bgcolor: '#FEF2F2' } }}>
                              Reject
                            </Button>
                            <Button size="small" variant="outlined"
                              startIcon={<EyeOff size={14} />}
                              onClick={() => toast.info('Publication hidden from feed')}
                              sx={{ borderColor: BORDER, color: MUTED }}>
                              Hide from Feed
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>
                  Indexed Publications ({research.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {research.slice(0, 5).map(pub => (
                    <Card key={pub.id} variant="outlined" sx={{ borderRadius: '10px', borderColor: BORDER }}>
                      <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ color: TEXT }}>{pub.title}</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: MUTED }}>{pub.field} • {pub.publicationDate}</Typography>
                        </Box>
                        <Chip label="Indexed" size="small" sx={{ bgcolor: LT_GREEN, color: GREEN, fontWeight: 700, flexShrink: 0 }} />
                        <Button size="small" variant="text" startIcon={<EyeOff size={13} />}
                          onClick={() => toast.info('Publication hidden')}
                          sx={{ color: MUTED, flexShrink: 0 }}>Hide</Button>
                        <Button size="small" variant="text" startIcon={<Edit size={13} />}
                          sx={{ color: BLUE, flexShrink: 0 }}>Edit</Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* ════════════════════ FUNDERS ════════════════════ */}
            {tab === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>Funder Applications</Typography>
                {pendingFunders.length === 0 ? (
                  <Alert severity="success" sx={{ bgcolor: LT_GREEN, color: DARK_GREEN, border: `1px solid #A7F3D0` }}>
                    No funder applications pending.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pendingFunders.map(f => (
                      <Card key={f.id} variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: TEXT }}>{f.organizationName}</Typography>
                            <Typography variant="body2" color="text.secondary">{f.email}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: MUTED, mt: 0.5 }}>{f.contactName} • {f.contactPhone}</Typography>
                            <Typography sx={{ fontSize: '0.72rem', color: MUTED, mt: 0.5 }}>Submitted {f.submittedDate}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                            <Button size="small" variant="contained"
                              onClick={() => { approveFunder(f.id); toast.success('Funder approved'); }}
                              sx={{ bgcolor: GREEN, '&:hover': { bgcolor: DARK_GREEN } }}>Approve</Button>
                            <Button size="small" variant="outlined"
                              onClick={() => { rejectFunder(f.id); toast.info('Application rejected'); }}
                              sx={{ borderColor: '#FCA5A5', color: '#B91C1C' }}>Reject</Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* ════════════════════ ANALYTICS ════════════════════ */}
            {tab === 4 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>Analytics Overview</Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  {[
                    { label: 'Total Publications', value: '1,248', sub: '+18% vs last quarter', blue: true },
                    { label: 'Active Collaborations', value: '372', sub: '+24% this month', blue: false },
                    { label: 'Platform Impact Score', value: '94%', sub: 'Above target', blue: true },
                    { label: 'Research Output Growth', value: '+18%', sub: 'Year over year', blue: false },
                  ].map(s => (
                    <Card key={s.label} variant="outlined"
                      sx={{ borderRadius: '12px', borderColor: BORDER, bgcolor: s.blue ? LT_BLUE : LT_GREEN, border: 'none' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h4" fontWeight={800} sx={{ color: s.blue ? BLUE : GREEN, mb: 0.5 }}>{s.value}</Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: TEXT, mb: 0.25 }}>{s.label}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: GREEN, fontWeight: 600 }}>{s.sub}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: TEXT, mb: 2 }}>Publication Trend (6 months)</Typography>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={pubTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="submitted" stroke={BLUE} strokeWidth={2} name="Submitted" />
                          <Line type="monotone" dataKey="approved" stroke={GREEN} strokeWidth={2} name="Approved" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: TEXT, mb: 2 }}>Output by Department</Typography>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={deptData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis type="number" tick={{ fontSize: 12 }} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                          <Tooltip />
                          <Bar dataKey="count" fill={BLUE} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}

            {/* ════════════════════ PROJECTS ════════════════════ */}
            {tab === 5 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>Active Research Projects</Typography>
                  <Button size="small" variant="contained" startIcon={<Plus size={14} />}
                    sx={{ bgcolor: BLUE, '&:hover': { bgcolor: DARK_BLUE } }}>New Project</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {activeProjects.map(p => (
                    <Card key={p.name} variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: TEXT }}>{p.name}</Typography>
                            <Typography variant="body2" color="text.secondary">Lead: {p.lead} • Budget: {p.budget}</Typography>
                          </Box>
                          <Chip label={p.status} size="small"
                            sx={{ bgcolor: p.status === 'Ahead' ? LT_GREEN : LT_BLUE,
                                  color: p.status === 'Ahead' ? GREEN : BLUE, fontWeight: 700 }} />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                            <Typography variant="body2" color="text.secondary">Progress</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ color: p.status === 'Ahead' ? GREEN : BLUE }}>{p.progress}%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={p.progress}
                            sx={{ height: 8, borderRadius: 4,
                              bgcolor: p.status === 'Ahead' ? '#D1FAE5' : '#DBEAFE',
                              '& .MuiLinearProgress-bar': { bgcolor: p.status === 'Ahead' ? GREEN : BLUE, borderRadius: 4 } }} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" sx={{ borderColor: BORDER, color: MUTED }}>View Details</Button>
                          <Button size="small" variant="outlined" sx={{ borderColor: BORDER, color: MUTED }}>Team</Button>
                          <Button size="small" variant="outlined" sx={{ borderColor: BORDER, color: MUTED }}>Reports</Button>
                          <Button size="small" variant="text" startIcon={<Edit size={13} />} sx={{ color: BLUE }}>Edit</Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* ════════════════════ USERS ════════════════════ */}
            {tab === 6 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>User Management</Typography>
                  <Button variant="contained" size="small" startIcon={<UserPlus size={14} />}
                    onClick={() => setShowStaff(true)}
                    sx={{ bgcolor: BLUE, '&:hover': { bgcolor: DARK_BLUE } }}>
                    Create Account
                  </Button>
                </Box>

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField size="small" placeholder="Search name or email…"
                    value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search size={15} /></InputAdornment> }}
                    sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Role</InputLabel>
                    <Select value={roleFilter} label="Role" onChange={e => setRoleFilter(e.target.value)}
                      sx={{ borderRadius: '8px' }}>
                      <MenuItem value="all">All roles</MenuItem>
                      <MenuItem value="researcher">Researcher</MenuItem>
                      <MenuItem value="funder">Funder</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="department_head">Dept Head</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}
                      sx={{ borderRadius: '8px' }}>
                      <MenuItem value="all">All statuses</MenuItem>
                      <MenuItem value="verified">Verified</MenuItem>
                      <MenuItem value="disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${BORDER}` }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: BG }}>
                      <TableRow>
                        {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 700, color: MUTED, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map(u => (
                        <TableRow key={u.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: BLUE, fontSize: '0.8rem', fontWeight: 700 }}>{u.name.charAt(0)}</Avatar>
                              <Typography variant="body2" fontWeight={600} sx={{ color: TEXT }}>{u.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary">{u.email}</Typography></TableCell>
                          <TableCell>
                            <Chip label={u.role} size="small"
                              sx={{ bgcolor: u.role === 'researcher' ? LT_BLUE : u.role === 'funder' ? LT_GREEN : '#F1F5F9',
                                    color: u.role === 'researcher' ? BLUE : u.role === 'funder' ? GREEN : MUTED,
                                    fontWeight: 700, fontSize: '0.7rem' }} />
                          </TableCell>
                          <TableCell>
                            <Chip label={u.disabled ? 'Disabled' : u.verified ? 'Verified' : 'Pending'} size="small"
                              sx={{ bgcolor: u.disabled ? '#F1F5F9' : u.verified ? LT_GREEN : LT_BLUE,
                                    color: u.disabled ? MUTED : u.verified ? GREEN : BLUE,
                                    fontWeight: 700, fontSize: '0.7rem' }} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.75 }}>
                              <Button size="small" variant="text"
                                onClick={() => { disableUser(u.id, !u.disabled); toast.success(u.disabled ? 'Account enabled' : 'Account disabled'); }}
                                sx={{ color: MUTED, fontSize: '0.72rem', minWidth: 0, px: 1 }}>
                                {u.disabled ? 'Enable' : 'Disable'}
                              </Button>
                              <Button size="small" variant="text"
                                onClick={() => {
                                  if (window.confirm(`Delete ${u.name}?`)) { deleteUser(u.id); toast.success('User deleted'); }
                                }}
                                sx={{ color: '#B91C1C', fontSize: '0.72rem', minWidth: 0, px: 1 }}>
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredUsers.length} of {researchers.length} accounts
                </Typography>
              </Box>
            )}

            {/* ════════════════════ REPORTS ════════════════════ */}
            {tab === 7 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>Reports & Analytics</Typography>
                  <Button variant="contained" size="small" onClick={() => navigate('/manager/reports')}
                    startIcon={<FileText size={14} />}
                    sx={{ bgcolor: BLUE, '&:hover': { bgcolor: DARK_BLUE } }}>
                    Open Report Builder
                  </Button>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: TEXT, mb: 2 }}>Quick Templates</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {REPORT_TEMPLATES.map(t => {
                          const Icon = t.icon;
                          return (
                            <Button key={t.label} variant="outlined" fullWidth
                              startIcon={<Icon size={15} />}
                              onClick={() => navigate('/manager/reports')}
                              sx={{ justifyContent: 'flex-start', borderColor: BORDER, color: TEXT,
                                '&:hover': { bgcolor: LT_BLUE, borderColor: BLUE }, borderRadius: '8px', fontWeight: 500 }}>
                              {t.label}
                            </Button>
                          );
                        })}
                      </Box>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" sx={{ borderRadius: '12px', borderColor: BORDER }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: TEXT, mb: 2 }}>Recent Reports</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {RECENT_REPORTS.map(r => (
                          <Box key={r.title} sx={{ p: 2, bgcolor: BG, borderRadius: '10px', border: `1px solid ${BORDER}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" fontWeight={600} sx={{ color: TEXT }}>{r.title}</Typography>
                              <Typography sx={{ fontSize: '0.72rem', color: MUTED }}>{r.date} • {r.size}</Typography>
                            </Box>
                            <Button size="small" variant="text" startIcon={<Download size={13} />} sx={{ color: BLUE }}>
                              Download
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}

            {/* ════════════════════ IMPORT ════════════════════ */}
            {tab === 8 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: TEXT }}>Publication CSV Import</Typography>
                <Alert severity="info" sx={{ bgcolor: LT_BLUE, color: DARK_BLUE, border: `1px solid #BFDBFE` }}>
                  Expected columns: <strong>title, researcherId, keywords</strong> (semicolon-separated). Imported records bypass the review queue and are directly indexed as verified institutional data.
                </Alert>
                <TextField
                  multiline rows={10} fullWidth
                  value={csvText} onChange={e => setCsvText(e.target.value)}
                  sx={{ fontFamily: 'monospace', '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem' } }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" sx={{ borderColor: BORDER, color: MUTED }} onClick={() => toast.info('Preview: parsed successfully')}>
                    Preview
                  </Button>
                  <Button variant="contained" onClick={processCSV}
                    sx={{ bgcolor: BLUE, '&:hover': { bgcolor: DARK_BLUE } }}>
                    Process &amp; Import
                  </Button>
                </Box>
                {importDone && (
                  <Alert severity="success" sx={{ bgcolor: LT_GREEN, color: DARK_GREEN, border: `1px solid #A7F3D0` }}>
                    Import complete — records merged into the catalogue.
                  </Alert>
                )}
              </Box>
            )}

          </Box>
        </Box>
      </Box>

      {/* ── Detail Dialog ──────────────────────────────────────────── */}
      <Dialog open={!!detailId} onClose={() => setDetailId(null)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}>
        <DialogTitle fontWeight={700}>Application Details</DialogTitle>
        <DialogContent dividers>
          {selectedProfile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: BLUE, fontWeight: 700, fontSize: '1.5rem' }}>
                  {selectedProfile.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{selectedProfile.name}</Typography>
                  <Typography color="text.secondary">{selectedProfile.email}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip size="small" label={`ORCID: ${selectedProfile.orcid}`} sx={{ bgcolor: LT_BLUE, color: BLUE }} />
                    <Chip size="small" label={selectedProfile.institution} sx={{ bgcolor: BG }} />
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Educational Background</Typography>
                <Box sx={{ bgcolor: BG, borderRadius: '10px', p: 2, fontSize: '0.875rem' }}>{selectedProfile.education}</Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Publications ({selectedProfile.publications.length})</Typography>
                <Box sx={{ bgcolor: BG, borderRadius: '10px', p: 2, maxHeight: 200, overflowY: 'auto' }}>
                  <ol style={{ paddingLeft: 20, margin: 0 }}>
                    {selectedProfile.publications.map((p: string, i: number) => (
                      <li key={i} style={{ fontSize: '0.8rem', marginBottom: 6, color: MUTED }}>{p}</li>
                    ))}
                  </ol>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1.5 }}>
          <Button variant="outlined" onClick={() => setDetailId(null)} sx={{ borderColor: BORDER, color: MUTED }}>Close</Button>
          {selectedProfile && (
            <>
              <Button variant="contained" onClick={() => approve(selectedProfile.id)}
                startIcon={<CheckCircle size={15} />}
                sx={{ bgcolor: GREEN, '&:hover': { bgcolor: DARK_GREEN } }}>Approve</Button>
              <Button variant="outlined" onClick={() => reject(selectedProfile.id)}
                startIcon={<XCircle size={15} />}
                sx={{ borderColor: '#FCA5A5', color: '#B91C1C' }}>Reject</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* ── Create Staff Dialog ────────────────────────────────────── */}
      <Dialog open={showStaff} onClose={() => setShowStaff(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}>
        <DialogTitle fontWeight={700}>Provision Staff / Funder Account</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="staff-form" onSubmit={handleCreateStaff} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Full Name" required size="small" value={staffForm.name}
                onChange={e => setStaffForm(p => ({ ...p, name: e.target.value }))} />
              <TextField label="Email" type="email" required size="small" value={staffForm.email}
                onChange={e => setStaffForm(p => ({ ...p, email: e.target.value }))} />
            </Box>
            <FormControl size="small" required>
              <InputLabel>Account Type</InputLabel>
              <Select label="Account Type" value={staffForm.role}
                onChange={e => setStaffForm(p => ({ ...p, role: e.target.value as any }))}>
                <MenuItem value="funder">Funder</MenuItem>
                <MenuItem value="manager">Research Manager</MenuItem>
                <MenuItem value="department_head">Department Head</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Organization" required size="small" value={staffForm.institution}
                onChange={e => setStaffForm(p => ({ ...p, institution: e.target.value }))} />
              <TextField label="Department" size="small" value={staffForm.department}
                onChange={e => setStaffForm(p => ({ ...p, department: e.target.value }))} />
            </Box>
            <Alert severity="info" sx={{ bgcolor: LT_BLUE, color: DARK_BLUE, border: `1px solid #BFDBFE` }}>
              The new user will receive an email with their login credentials and setup instructions.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1.5 }}>
          <Button variant="outlined" onClick={() => setShowStaff(false)} sx={{ borderColor: BORDER, color: MUTED }}>Cancel</Button>
          <Button type="submit" form="staff-form" variant="contained"
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: DARK_BLUE } }}>Create Account</Button>
        </DialogActions>
      </Dialog>

      {/* ── Create Post Dialog ────────────────────────────────────── */}
      <Dialog open={showCreatePost} onClose={() => setShowCreatePost(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}>
        <DialogTitle fontWeight={700}>Create System Announcement</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Alert severity="info" sx={{ bgcolor: LT_GREEN, color: DARK_GREEN, border: `1px solid #A7F3D0` }}>
              System announcements appear on the feed for all users. Use for platform updates, maintenance notices, and institution-wide research news.
            </Alert>
            <TextField label="Announcement content" multiline rows={5} fullWidth
              value={postText} onChange={e => setPostText(e.target.value)}
              placeholder="Write your announcement here…" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1.5 }}>
          <Button variant="outlined" onClick={() => setShowCreatePost(false)} sx={{ borderColor: BORDER, color: MUTED }}>Cancel</Button>
          <Button variant="contained"
            onClick={() => { toast.success('Announcement posted to all users'); setShowCreatePost(false); setPostText(''); }}
            sx={{ bgcolor: GREEN, '&:hover': { bgcolor: DARK_GREEN } }}>Post Announcement</Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
