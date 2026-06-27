import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { DashboardPageHeader, tabClass } from '../components/layout';
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
  Home,
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
  const [activeTab, setActiveTab] = useState<
    'accreditations' | 'publications' | 'funders' | 'users' | 'import'
  >('accreditations');
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

  const adminNavItems = [
    { id: 'accreditations', label: 'Accreditations', icon: GraduationCap, badge: pendingResearchers.length },
    { id: 'publications', label: 'Publications', icon: FileText, badge: pendingPublications.length },
    { id: 'funders', label: 'Funders', icon: Award, badge: pendingFunders.length },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'import', label: 'Data Import', icon: Upload },
  ] as const;

  const adminSystemItems = [
    { label: 'Knowledge Processing', icon: Cpu, path: '/admin/knowledge-processing' },
    { label: 'Security & Users', icon: Shield, path: '/admin/security-management' },
    { label: 'Report Builder', icon: BarChart3, path: '/manager/reports' },
    { label: 'Data Integration', icon: Database, path: '/data-integration' },
  ];

  return (
    <>
      <DashboardPageHeader
        title="Institutional Administration"
        description="Manage accreditations, users, and platform data"
        actions={
          <>
            <Button variant="outline" onClick={() => setActiveTab('import')}>
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            {activeTab === 'users' && (
              <Button onClick={() => setShowCreateStaff(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Create account
              </Button>
            )}
          </>
        }
      />

      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {adminNavItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={tabClass(activeTab === item.id)}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {'badge' in item && item.badge > 0 && (
                <Badge className="ml-1 h-5 min-w-5 px-1.5 text-[10px]">{item.badge}</Badge>
              )}
            </button>
          );
        })}
      </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-700">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {pendingResearchers.length + pendingFunders.length + pendingPublications.length}
            </div>
            <div className="text-sm text-muted-foreground mb-2">Pending verifications</div>
          </Card>

          <Card className="p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-muted/50 rounded-lg text-brand-dark">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{researchers.length}</div>
            <div className="text-sm text-muted-foreground mb-2">Directory accounts</div>
            <div className="text-xs text-muted-foreground">
              R:{researchers.filter(r => r.role === 'researcher').length} • F:
              {researchers.filter(r => r.role === 'funder').length} • M:
              {researchers.filter(r => r.role === 'manager').length} • DH:
              {researchers.filter(r => r.role === 'department_head').length}
            </div>
          </Card>

          <Card className="p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{research.length}</div>
            <div className="text-sm text-muted-foreground mb-2">Indexed publications</div>
          </Card>

          <Card className="p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {collaborationRequests.filter(c => c.status === 'pending' || c.status === 'accepted').length}
            </div>
            <div className="text-sm text-muted-foreground mb-2">Collaboration threads</div>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === 'accreditations' && (
          <>
            {/* Pending Applications */}
            <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Pending Accreditation Applications</h2>
            <p className="text-muted-foreground">
              Review applications to verify researcher credentials and accreditation requirements
            </p>
          </div>

          {pendingResearchers.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending applications at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingResearchers.map(researcher => (
                <div
                  key={researcher.id}
                  className="border border-border rounded-lg p-6 hover:border-brand/20 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-6">
                    <Avatar className="w-16 h-16 bg-brand-dark flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      {researcher.name.charAt(0)}
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{researcher.name}</h3>
                          <p className="text-muted-foreground mb-2">{researcher.email}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              {researcher.institution}
                            </span>
                            <span>•</span>
                            <span>{researcher.department}</span>
                            <span>•</span>
                            <span>ORCID: {researcher.orcid}</span>
                          </div>
                        </div>
                        <Badge className="bg-warning-muted text-warning-foreground">
                          Submitted {researcher.submittedDate}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-brand-muted/50 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Highest Degree</div>
                          <div className="font-bold text-brand-dark">{researcher.degree.toUpperCase()}</div>
                        </div>
                        <div className="bg-success-muted/50 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Experience</div>
                          <div className="font-bold text-success">{researcher.experience} years</div>
                        </div>
                        <div className="bg-brand-muted/50 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Publications</div>
                          <div className="font-bold text-brand-dark">{researcher.publications.length}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Publication list</div>
                        <p className="text-sm text-foreground">
                          {researcher.publications.length}{' '}
                          {researcher.publications.length === 1 ? 'entry' : 'entries'} submitted — keywords are extracted automatically after approval.
                        </p>
                      </div>

                      {/* Accreditation Check */}
                      <div className="bg-success-muted/50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-green-900 mb-1">Accreditation Requirements Met</div>
                            <div className="text-sm text-success-foreground">
                              ✓ {researcher.degree === 'phd' ? 'PhD degree with quantitative background' :
                                 researcher.experience >= 3 ? `${researcher.experience} years of research experience (≥3 required)` :
                                 'Meets educational requirements'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedResearcher(researcher.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(researcher.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(researcher.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recently Approved */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6">Recently Approved Researchers</h2>
          <div className="grid grid-cols-3 gap-4">
            {researchers
              .filter(r => r.role === 'researcher')
              .slice(0, 6)
              .map(researcher => (
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
                    <div className="text-xs text-muted-foreground truncate">{researcher.department}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{researcher.publications} pubs</span>
                  <Badge className="bg-success-muted text-success-foreground text-xs">Verified</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
          </>
        )}

        {activeTab === 'publications' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-2">Publication approval queue</h2>
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
                      <Badge className="bg-amber-100 text-amber-900">Pending</Badge>
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
                        className="bg-emerald-600 hover:bg-emerald-700"
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
            <h2 className="text-2xl font-bold mb-4">Pending funder applications</h2>
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
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { approveFunder(f.id); toast.success('Funder approved'); }}>
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
            <h2 className="text-2xl font-bold">Publication CSV import</h2>
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
                <h2 className="text-2xl font-bold mb-2">User management</h2>
                <p className="text-muted-foreground">Directory accounts with verification state</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[160px]">
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
                  <SelectTrigger className="w-[160px]">
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
                          researcher.role === 'funder' ? 'bg-emerald-100 text-emerald-800' :
                          researcher.role === 'manager' ? 'bg-brand-muted text-brand-dark' :
                          researcher.role === 'department_head' ? 'bg-amber-100 text-amber-900' :
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
                              ? 'bg-success-muted text-success-foreground'
                              : 'bg-warning-muted text-warning-foreground'
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
                <DialogTitle className="text-2xl">Application Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 bg-brand-dark flex items-center justify-center text-white font-bold text-3xl">
                    {selectedProfile.name.charAt(0)}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{selectedProfile.name}</h3>
                    <p className="text-muted-foreground mb-2">{selectedProfile.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge>ORCID: {selectedProfile.orcid}</Badge>
                      <Badge variant="secondary">{selectedProfile.institution}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Educational Background</h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="whitespace-pre-line">{selectedProfile.education}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Indexed publications</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Expertise keywords are extracted from approved publication metadata.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Publications ({selectedProfile.publications.length})</h4>
                  <div className="bg-muted/50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <ol className="list-decimal list-inside space-y-2">
                      {selectedProfile.publications.map((pub, idx) => (
                        <li key={idx} className="text-sm">{pub}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">CV / Resume</h4>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download {selectedProfile.cv}
                  </Button>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
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
            <DialogTitle className="text-2xl">Provision staff or funder account</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateStaff} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
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

            <div className="grid grid-cols-2 gap-6">
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
