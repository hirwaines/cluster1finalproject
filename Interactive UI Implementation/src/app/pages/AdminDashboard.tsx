import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { StatCard, dashboardStatGridClass, dashboardSectionHeadingClass, dashboardListItemClass, dashboardThreeColGridClass, dashboardTwoColGridClass } from '../components/layout';
import { usePageHeaderActions } from '../context/PageHeaderContext';
import { UserAvatar } from '../components/ui/UserAvatar';
import { useDashboardTab } from '../hooks/useDashboardTab';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  XCircle,
  FileText,
  GraduationCap,
  Award,
  Users,
  TrendingUp,
  Clock,
  Eye,
  Download,
  UserPlus,
  Cpu,
  Shield,
  BarChart3,
  Database,
  Upload,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

export function AdminDashboard() {
  const navigate = useNavigate();
  const {
    user,
    pendingResearchers,
    pendingFunders,
    approveResearcher,
    rejectResearcher,
    approveFunder,
    rejectFunder,
    pendingPublications,
    approvePublication,
    rejectPublication,
    researchers,
    research,
    collaborationRequests,
    createStaffAccount,
    deleteUser,
    disableUser,
    importPublicationsFromRows,
  } = useApp();
  const [selectedResearcher, setSelectedResearcher] = useState<string | null>(null);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [activeTab, setActiveTab] = useDashboardTab('overview', [
    'overview',
    'accreditations',
    'publications',
    'funders',
    'users',
    'import',
  ] as const);
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    role: 'funder' as 'funder' | 'manager' | 'department_head',
    institution: '',
    department: '',
  });
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [csvText, setCsvText] = useState(
    'title,researcherId,keywords\nMachine Learning for Climate Prediction,1,"ML;Climate"\n'
  );
  const [importStatus, setImportStatus] = useState<'idle' | 'preview' | 'done'>('idle');

  const filteredDirectoryUsers = useMemo(() => {
    return researchers.filter(r => {
      if (roleFilter !== 'all' && r.role !== roleFilter) return false;
      if (statusFilter === 'verified' && (r.disabled || !r.verified)) return false;
      if (statusFilter === 'disabled' && !r.disabled) return false;
      return true;
    });
  }, [researchers, roleFilter, statusFilter]);

  const headerActions = useMemo(
    () => (
      <>
        <Button variant="outline" size="sm" onClick={() => setActiveTab('import')}>
          <Upload className="w-4 h-4 mr-2" />
          Import CSV
        </Button>
        {activeTab === 'users' && (
          <Button size="sm" onClick={() => setShowCreateStaff(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Create account
          </Button>
        )}
      </>
    ),
    [activeTab, setActiveTab],
  );
  usePageHeaderActions(headerActions);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleApprove = (id: string) => {
    approveResearcher(id);
    toast.success('Researcher approved successfully!');
    setSelectedResearcher(null);
  };

  const handleReject = (id: string) => {
    rejectResearcher(id);
    toast.error('Application rejected');
    setSelectedResearcher(null);
  };

  const selectedProfile = pendingResearchers.find(r => r.id === selectedResearcher);

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      deleteUser(userId);
      toast.success(`${userName} has been deleted`);
    }
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    createStaffAccount(staffForm);
    toast.success('Staff account created.');
    setShowCreateStaff(false);
    setStaffForm({
      name: '',
      email: '',
      role: 'funder',
      institution: '',
      department: ''
    });
  };

  const pendingTotal = pendingResearchers.length + pendingFunders.length + pendingPublications.length;

  const queueItems = [
    {
      id: 'accreditations' as const,
      label: 'Accreditation applications',
      count: pendingResearchers.length,
      icon: GraduationCap,
      hint: 'Researcher credential reviews',
    },
    {
      id: 'publications' as const,
      label: 'Publication submissions',
      count: pendingPublications.length,
      icon: FileText,
      hint: 'Awaiting catalogue approval',
    },
    {
      id: 'funders' as const,
      label: 'Funder registrations',
      count: pendingFunders.length,
      icon: Award,
      hint: 'Partner onboarding queue',
    },
    {
      id: 'users' as const,
      label: 'Directory accounts',
      count: researchers.length,
      icon: Users,
      hint: 'Roles, access, and verification',
    },
  ];

  const systemLinks = [
    { label: 'Knowledge processing', href: '/admin/knowledge-processing', icon: Cpu },
    { label: 'Security & users', href: '/admin/security-management', icon: Shield },
    { label: 'Report builder', href: '/manager/reports', icon: BarChart3 },
    { label: 'Data integration', href: '/data-integration', icon: Database },
  ];

  return (
    <>
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className={dashboardStatGridClass}>
            <StatCard label="Pending verifications" value={pendingTotal} icon={Clock} accent="info" />
            <StatCard
              label="Directory accounts"
              value={researchers.length}
              icon={Users}
              accent="brand"
              hint={`R:${researchers.filter(r => r.role === 'researcher').length} · F:${researchers.filter(r => r.role === 'funder').length}`}
            />
            <StatCard label="Indexed publications" value={research.length} icon={FileText} accent="dark" />
            <StatCard
              label="Collaboration threads"
              value={collaborationRequests.filter(c => c.status === 'pending' || c.status === 'accepted').length}
              icon={TrendingUp}
              accent="brand"
            />
          </div>

          <div className={dashboardTwoColGridClass}>
            <Card className="gap-0 overflow-hidden p-0">
              <div className="border-b border-border/60 px-5 py-4">
                <h2 className={dashboardSectionHeadingClass}>Administration queues</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Jump straight to work that needs your attention.
                </p>
              </div>
              <div className="divide-y divide-border/60">
                {queueItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-muted/30"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-dark">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.hint}</p>
                      </div>
                      <Badge className="border-0 bg-brand text-white">{item.count}</Badge>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="gap-0 overflow-hidden p-0">
              <div className="border-b border-border/60 px-5 py-4">
                <h2 className={dashboardSectionHeadingClass}>System tools</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Processing, security, reporting, and data sync across the platform.
                </p>
              </div>
              <div className="divide-y divide-border/60">
                {systemLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => navigate(link.href)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-muted/30"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-dark">{link.label}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card className="gap-0 overflow-hidden p-0">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className={dashboardSectionHeadingClass}>Platform snapshot</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                What is happening across ResearchIQ right now.
              </p>
            </div>
            <div className={`${dashboardThreeColGridClass} p-5`}>
              <div className="rounded-xl border border-border/60 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-brand">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Live catalogue</span>
                </div>
                <p className="text-2xl font-semibold tabular-nums text-brand-dark">{research.length}</p>
                <p className="mt-1 text-sm text-muted-foreground">Indexed publications</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-brand">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Needs review</span>
                </div>
                <p className="text-2xl font-semibold tabular-nums text-brand-dark">{pendingTotal}</p>
                <p className="mt-1 text-sm text-muted-foreground">Pending verifications</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-brand">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Collaboration</span>
                </div>
                <p className="text-2xl font-semibold tabular-nums text-brand-dark">
                  {collaborationRequests.filter(c => c.status === 'pending').length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Open collaboration requests</p>
              </div>
            </div>
          </Card>
        </div>
      )}

        {activeTab === 'accreditations' && (
          <div className="space-y-5">
            <Card className="gap-0 overflow-hidden p-0">
              <div className="border-b border-border/60 px-5 py-4">
                <h2 className={dashboardSectionHeadingClass}>Pending accreditation applications</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review credentials and approve researchers for the directory.
                </p>
              </div>

              <div className="p-5">
                {pendingResearchers.length === 0 ? (
                  <div className="py-10 text-center">
                    <CheckCircle className="mx-auto mb-3 h-12 w-12 text-brand" />
                    <h3 className="text-base font-semibold text-brand-dark">All caught up</h3>
                    <p className="mt-1 text-sm text-muted-foreground">No pending applications right now.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingResearchers.map(researcher => (
                      <article
                        key={researcher.id}
                        className="rounded-xl border border-border/60 bg-white p-4 sm:p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                          <UserAvatar name={researcher.name} size="lg" className="shrink-0" />

                          <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <h3 className="text-base font-semibold text-brand-dark">{researcher.name}</h3>
                                <p className="text-sm text-muted-foreground">{researcher.email}</p>
                                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                  <span className="inline-flex items-center gap-1">
                                    <GraduationCap className="h-3.5 w-3.5 text-brand" />
                                    {researcher.institution}
                                  </span>
                                  <span>{researcher.department}</span>
                                  <span>ORCID {researcher.orcid}</span>
                                </div>
                              </div>
                              <Badge className="w-fit shrink-0 border-0 bg-brand-muted text-brand">
                                Submitted {researcher.submittedDate}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                              {[
                                { label: 'Highest degree', value: researcher.degree.toUpperCase() },
                                { label: 'Experience', value: `${researcher.experience} years` },
                                { label: 'Publications', value: String(researcher.publications.length) },
                              ].map(item => (
                                <div key={item.label} className="rounded-lg bg-brand-muted/50 px-3 py-2.5">
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    {item.label}
                                  </p>
                                  <p className="mt-0.5 text-sm font-semibold text-brand-dark">{item.value}</p>
                                </div>
                              ))}
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {researcher.publications.length}{' '}
                              {researcher.publications.length === 1 ? 'entry' : 'entries'} submitted — keywords
                              are extracted after approval.
                            </p>

                            <div className="rounded-lg border border-brand/15 bg-brand-muted/40 px-3 py-2.5">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                <div>
                                  <p className="text-sm font-semibold text-brand-dark">Requirements met</p>
                                  <p className="text-sm text-muted-foreground">
                                    {researcher.degree === 'phd'
                                      ? 'PhD with quantitative background'
                                      : researcher.experience >= 3
                                        ? `${researcher.experience} years research experience (≥3 required)`
                                        : 'Meets educational requirements'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                              <Button size="sm" variant="outline" onClick={() => setSelectedResearcher(researcher.id)}>
                                <Eye className="mr-1.5 h-4 w-4" />
                                Details
                              </Button>
                              <Button size="sm" onClick={() => handleApprove(researcher.id)}>
                                <CheckCircle className="mr-1.5 h-4 w-4" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(researcher.id)}>
                                <XCircle className="mr-1.5 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="gap-0 overflow-hidden p-0">
              <div className="border-b border-border/60 px-5 py-4">
                <h2 className={dashboardSectionHeadingClass}>Recently approved researchers</h2>
              </div>
              <div className={`${dashboardThreeColGridClass} p-5`}>
                {researchers
                  .filter(r => r.role === 'researcher')
                  .slice(0, 6)
                  .map(researcher => (
                    <button
                      key={researcher.id}
                      type="button"
                      className={`${dashboardListItemClass} w-full text-left`}
                      onClick={() => navigate(`/researcher/profile/${researcher.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <UserAvatar name={researcher.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-brand-dark">{researcher.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{researcher.department}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{researcher.publications} publications</span>
                        <Badge className="border-0 bg-brand-muted text-brand">Verified</Badge>
                      </div>
                    </button>
                  ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'publications' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Publication approval queue</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Approve researcher submissions to add them to the live catalogue. Bulk CSV import is treated as pre-verified institutional data.
            </p>
            {pendingPublications.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No publications awaiting approval.</p>
            ) : (
              <div className="space-y-6">
                {pendingPublications.map(pub => (
                  <div key={pub.id} className="border border-border rounded-lg p-6 space-y-3">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-brand-dark">{pub.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pub.researcherName} • Submitted {pub.submittedDate}
                        </p>
                      </div>
                      <Badge className="border-0 bg-brand-muted text-brand">Pending</Badge>
                    </div>
                    <p className="text-sm text-foreground line-clamp-4">{pub.abstract}</p>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
                      <span>Field: {pub.field || '—'}</span>
                      <span>Funding: {pub.fundingStatus || '—'}</span>
                      {pub.doi && <span>DOI: {pub.doi}</span>}
                      {pub.attachmentLabel && <span>File: {pub.attachmentLabel}</span>}
                    </div>
                    {pub.suggestedKeywords && pub.suggestedKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pub.suggestedKeywords.map(k => (
                          <Badge key={k} variant="secondary" className="text-xs">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          approvePublication(pub.id);
                          toast.success('Publication approved and indexed');
                        }}
                      >
                        Approve & index
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          rejectPublication(pub.id);
                          toast.message('Submission rejected');
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'funders' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Pending funder applications</h2>
            {pendingFunders.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No pending funder registrations.</p>
            ) : (
              <div className="space-y-4">
                {pendingFunders.map(f => (
                  <div key={f.id} className="border border-border rounded-lg p-6 flex flex-wrap justify-between gap-4">
                    <div>
                      <div className="font-semibold text-lg">{f.organizationName}</div>
                      <div className="text-sm text-muted-foreground">{f.email}</div>
                      <div className="text-sm mt-2">{f.contactName} • {f.contactPhone}</div>
                      <div className="text-xs text-muted-foreground mt-1">Submitted {f.submittedDate}</div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Button size="sm" onClick={() => { approveFunder(f.id); toast.success('Funder approved'); }}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { rejectFunder(f.id); toast.message('Application rejected'); }}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'import' && (
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Publication CSV import</h2>
            <p className="text-muted-foreground text-sm">
              Expected columns: title, researcherId, keywords (semicolon-separated). Records processed here are added directly as verified catalogue rows.
            </p>
            <Textarea rows={10} value={csvText} onChange={e => setCsvText(e.target.value)} className="font-mono text-sm" />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setImportStatus('preview')}>
                Preview
              </Button>
              <Button
                className="bg-brand-dark hover:bg-brand-dark"
                onClick={() => {
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
                  importPublicationsFromRows(
                    rows.map(r => ({
                      title: r.title,
                      researcherId: r.researcherId,
                      keywords: r.keywords,
                      abstract: 'Imported via CSV.',
                      authors: [],
                      field: 'General',
                      citations: 0,
                      publicationDate: new Date().toISOString().split('T')[0],
                    }))
                  );
                  setImportStatus('done');
                  toast.success(`Imported ${rows.length} publication rows`);
                }}
              >
                Process
              </Button>
            </div>
            {importStatus !== 'idle' && (
              <p className="text-sm text-muted-foreground">
                Status: {importStatus === 'done' ? 'Completed — records merged into catalogue.' : 'Preview parsed — press Process to commit.'}
              </p>
            )}
          </Card>
        )}

        {/* Manage Users Tab */}
        {activeTab === 'users' && (
          <Card className="p-6">
            <div className="mb-6 flex flex-wrap justify-between gap-4 items-end">
              <div>
                <h2 className="text-lg font-semibold mb-2">User management</h2>
                <p className="text-muted-foreground">Directory accounts with verification state</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="researcher">Researcher</SelectItem>
                    <SelectItem value="funder">Funder</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="department_head">Dept head</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b-2 border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {filteredDirectoryUsers.map(researcher => (
                    <tr key={researcher.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{researcher.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{researcher.email}</td>
                      <td className="px-6 py-4">
                        <Badge className={
                          researcher.role === 'researcher' ? 'bg-brand-muted text-brand-dark' :
                          researcher.role === 'funder' ? 'bg-brand-muted text-brand' :
                          researcher.role === 'manager' ? 'bg-brand-muted text-brand-dark' :
                          researcher.role === 'department_head' ? 'bg-brand-muted text-brand-dark' :
                          'bg-muted text-foreground'
                        }>
                          {researcher.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          researcher.disabled
                            ? 'bg-muted text-foreground'
                            : researcher.verified
                              ? 'bg-brand-muted text-brand'
                              : 'border border-brand/25 bg-white text-brand-dark'
                        }>
                          {researcher.disabled ? 'Disabled' : researcher.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{researcher.joinedDate || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (researcher.role === 'researcher') navigate(`/researcher/profile/${researcher.id}`);
                              else toast.message('Profile editing for non-researcher accounts is managed through the institution portal.');
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              disableUser(researcher.id, !researcher.disabled);
                              toast.success(researcher.disabled ? 'Account enabled' : 'Account disabled');
                            }}
                          >
                            {researcher.disabled ? 'Enable' : 'Disable'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(researcher.id, researcher.name)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      <Dialog open={!!selectedResearcher} onOpenChange={() => setSelectedResearcher(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedProfile && (
            <>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 bg-brand-dark flex items-center justify-center text-white font-bold text-3xl">
                    {selectedProfile.name.charAt(0)}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{selectedProfile.name}</h3>
                    <p className="text-muted-foreground mb-2">{selectedProfile.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge>ORCID: {selectedProfile.orcid}</Badge>
                      <Badge variant="secondary">{selectedProfile.institution}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Educational Background</h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="whitespace-pre-line">{selectedProfile.education}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Indexed publications</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Expertise keywords are extracted from approved publication metadata.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Publications ({selectedProfile.publications.length})</h4>
                  <div className="bg-muted/50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <ol className="list-decimal list-inside space-y-2">
                      {selectedProfile.publications.map((pub, idx) => (
                        <li key={idx} className="text-sm">{pub}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">CV / Resume</h4>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download {selectedProfile.cv}
                  </Button>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleApprove(selectedProfile.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(selectedProfile.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Staff Account Dialog */}
      <Dialog open={showCreateStaff} onOpenChange={setShowCreateStaff}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Provision staff or funder account</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateStaff} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <div>
                <Label htmlFor="staffName">Full Name *</Label>
                <Input
                  id="staffName"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="staffEmail">Email Address *</Label>
                <Input
                  id="staffEmail"
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@organization.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="staffRole">Account Type *</Label>
              <Select
                value={staffForm.role}
                onValueChange={(value: 'funder' | 'manager' | 'department_head') =>
                  setStaffForm(prev => ({ ...prev, role: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funder">Funder</SelectItem>
                  <SelectItem value="manager">Research manager</SelectItem>
                  <SelectItem value="department_head">Department head</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <div>
                <Label htmlFor="staffInstitution">Organization *</Label>
                <Input
                  id="staffInstitution"
                  value={staffForm.institution}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="e.g., Innovation Fund, Tech University"
                  required
                />
              </div>

              <div>
                <Label htmlFor="staffDepartment">Department</Label>
                <Input
                  id="staffDepartment"
                  value={staffForm.department}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g., Research Office"
                />
              </div>
            </div>

            <div className="bg-brand-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-dark mt-0.5 flex-shrink-0" />
                <div className="text-sm text-brand-dark">
                  <p className="font-semibold mb-1">Account Credentials</p>
                  <p>The user will receive an email with login credentials and instructions to set up their account.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreateStaff(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-brand-dark hover:bg-brand-dark"
              >
                Create Account
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
