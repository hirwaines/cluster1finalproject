import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { StatCard, dashboardStatGridClass, dashboardThreeColGridClass } from '../components/layout';
import { usePageHeaderActions, usePageHeaderMeta } from '../context/PageHeaderContext';
import { useDashboardTab } from '../hooks/useDashboardTab';
import { useApp } from '../context/AppContext';
import {
  Building2,
  DollarSign,
  Filter,
  Search,
  FilePlus,
  TrendingUp,
  LayoutDashboard,
  Briefcase,
  FileText,
  X,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

const MATCH_ROWS = [
  {
    projectId: 'pub1',
    title: 'AI for Climate Resilience',
    researcherName: 'Dr. Claver Ndahayo',
    institution: 'AUCA',
    funding: '$50,000',
    match: 94,
    why: 'Aligns with climate resilience and machine learning priorities in your profile.',
  },
  {
    projectId: 'pub3',
    title: 'Research Data Platform',
    researcherName: 'Assoc. Prof. Kayigema Jacques',
    institution: 'AUCA',
    funding: '$35,000',
    match: 89,
    why: 'Strong overlap with research infrastructure and data-management interests.',
  },
  {
    projectId: 'pub2',
    title: 'Digital Ethics Framework',
    researcherName: 'Prof. Kelvin Onongha',
    institution: 'AUCA',
    funding: '$25,000',
    match: 85,
    why: 'Matches digital ethics and higher-education policy focus areas.',
  },
];

export function FunderDashboard() {
  const navigate = useNavigate();
  const {
    user,
    research,
    researchers,
    funderInterests,
    expressFundingInterest,
    updateFunderProfile,
    postFunderRfp,
  } = useApp();

  const [areaFilter, setAreaFilter] = useState('all');
  const [instFilter, setInstFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rfpOpen, setRfpOpen] = useState(false);
  const [rfpForm, setRfpForm] = useState({
    title: '',
    summary: '',
    amountRange: '',
    deadline: '',
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [interestDraft, setInterestDraft] = useState('');
  const [investmentRange, setInvestmentRange] = useState(user?.investmentRange || '');
  const [orgName, setOrgName] = useState(user?.organizationName || user?.name || '');
  const [areaChips, setAreaChips] = useState<string[]>(user?.areasOfInterest || []);
  const [areaInput, setAreaInput] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'funder') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.investmentRange) setInvestmentRange(user.investmentRange);
    if (user?.areasOfInterest) setAreaChips(user.areasOfInterest);
    if (user?.organizationName || user?.name) setOrgName(user.organizationName || user?.name || '');
  }, [user?.investmentRange, user?.areasOfInterest, user?.organizationName, user?.name]);

  const org = user?.organizationName || user?.name || '';

  const [activeSection, setActiveSection] = useDashboardTab('overview', [
    'overview',
    'discover',
    'portfolio',
    'rfps',
  ] as const);

  usePageHeaderMeta(
    user?.role === 'funder' && activeSection === 'overview' ? `Welcome, ${org}` : undefined,
    user?.role === 'funder' && activeSection === 'overview'
      ? 'Discover projects seeking funding and track your expressions of interest.'
      : undefined,
  );

  const headerActions = useMemo(
    () => (
      <>
        <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)}>
          Profile
        </Button>
        {(activeSection === 'discover' || activeSection === 'rfps') && (
          <Button className="bg-brand-dark hover:bg-brand-dark" size="sm" onClick={() => setRfpOpen(true)}>
            <FilePlus className="w-4 h-4 mr-2" />
            {activeSection === 'rfps' ? 'Post new opportunity' : 'Submit new RFP'}
          </Button>
        )}
        {activeSection === 'overview' && (
          <Button className="bg-brand-dark hover:bg-brand-dark" size="sm" onClick={() => { setActiveSection('rfps'); setRfpOpen(true); }}>
            <FilePlus className="w-4 h-4 mr-2" />
            Post Opportunity
          </Button>
        )}
      </>
    ),
    [activeSection, setActiveSection],
  );
  usePageHeaderActions(user?.role === 'funder' ? headerActions : null);

  const seeking = useMemo(
    () =>
      research.filter(
        r =>
          r.fundingStatus === 'seeking' &&
          (areaFilter === 'all' || r.field === areaFilter || r.keywords.some(k => k.includes(areaFilter))) &&
          (instFilter === 'all' ||
            researchers.find(x => x.id === r.researcherId)?.institution === instFilter) &&
          (amountFilter === 'all' || true)
      ),
    [research, researchers, areaFilter, instFilter, amountFilter]
  );

  if (!user || user.role !== 'funder') {
    return null;
  }

  const filteredDiscover = seeking.filter(r => {
    const lead = researchers.find(x => x.id === r.researcherId);
    const blob = `${r.title} ${r.abstract} ${lead?.name || ''}`.toLowerCase();
    return blob.includes(search.toLowerCase());
  });

  const myInterests = funderInterests.filter(i => i.funderId === user.id);

  const addAreaChip = () => {
    const val = areaInput.trim();
    if (val && !areaChips.includes(val)) {
      setAreaChips(prev => [...prev, val]);
    }
    setAreaInput('');
  };

  const removeAreaChip = (chip: string) => {
    setAreaChips(prev => prev.filter(c => c !== chip));
  };

  const saveProfile = () => {
    updateFunderProfile({
      organizationName: orgName,
      name: orgName,
      investmentRange,
      areasOfInterest: areaChips,
    });
    toast.success('Profile preferences updated.');
    setProfileOpen(false);
  };

  const submitRfp = () => {
    if (!rfpForm.title || !rfpForm.summary || !rfpForm.amountRange || !rfpForm.deadline) {
      toast.error('Please complete all RFP fields.');
      return;
    }
    postFunderRfp({
      title: rfpForm.title,
      summary: rfpForm.summary,
      amountRange: rfpForm.amountRange,
      deadline: rfpForm.deadline,
    });
    toast.success('RFP posted (demo).');
    setRfpOpen(false);
    setRfpForm({ title: '', summary: '', amountRange: '', deadline: '' });
  };

  return (
    <>
          {activeSection === 'overview' && (
            <div className="space-y-5">
              <div className={dashboardThreeColGridClass}>
                <StatCard label="Active investments" value={myInterests.filter(i => i.status === 'funded').length} icon={DollarSign} accent="brand" />
                <StatCard label="Proposals reviewed" value={12} icon={FilePlus} accent="info" hint="This quarter" />
                <StatCard label="Matching researchers" value={researchers.filter(r => r.role === 'researcher').length} icon={TrendingUp} accent="dark" />
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">Matched to your interests</h2>
                <div className="grid gap-4">
                  {MATCH_ROWS.map(row => (
                    <Card key={row.projectId} className="p-6 shadow-sm border border-border">
                      <div className="flex flex-wrap justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{row.title}</h3>
                          <p className="text-sm text-muted-foreground">{row.researcherName} • {row.institution}</p>
                          <p className="text-sm text-foreground mt-3 bg-muted/50 border border-border rounded-md p-3">
                            <span className="font-medium text-foreground">{row.match}% match — </span>
                            {row.why}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Funding needed</div>
                          <div className="text-base font-semibold mb-2">{row.funding}</div>
                          <Button className="bg-brand-dark hover:bg-brand-dark" onClick={() => { expressFundingInterest(row.projectId); toast.success('Interest sent to the programme office.'); }}>
                            Express interest
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DISCOVER RESEARCH ── */}
          {activeSection === 'discover' && (
            <div className="space-y-6">
              <Card className="p-4 shadow-sm border border-border">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex-1 min-w-0 sm:min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                    <Input className="pl-9" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <Select value={areaFilter} onValueChange={setAreaFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Filter className="w-4 h-4 mr-2 shrink-0" />
                      <SelectValue placeholder="Research area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All areas</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Environmental Informatics">Environmental Informatics</SelectItem>
                      <SelectItem value="Higher Education Studies">Higher Education</SelectItem>
                      <SelectItem value="Research Administration">Research administration</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={instFilter} onValueChange={setInstFilter}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <Building2 className="w-4 h-4 mr-2 shrink-0" />
                      <SelectValue placeholder="Institution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All institutions</SelectItem>
                      <SelectItem value="AUCA">AUCA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={amountFilter} onValueChange={setAmountFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Funding needed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any amount</SelectItem>
                      <SelectItem value="low">Under $40k</SelectItem>
                      <SelectItem value="mid">$40k–$60k</SelectItem>
                      <SelectItem value="high">Above $60k</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <div className="space-y-4">
                {filteredDiscover.map(proj => {
                  const lead = researchers.find(r => r.id === proj.researcherId);
                  return (
                    <Card key={proj.id} className="p-6 shadow-sm border border-border">
                      <div className="flex flex-wrap justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-brand-dark">{proj.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{lead?.name} • {lead?.institution}</p>
                          <p className="text-sm text-foreground mt-3 line-clamp-2">{proj.abstract}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {proj.keywords.map(k => <Badge key={k} variant="secondary">{k}</Badge>)}
                          </div>
                        </div>
                        <div className="text-right space-y-2 min-w-[140px]">
                          <div className="text-sm text-muted-foreground">Funding sought</div>
                          <div className="text-base font-semibold">{proj.fundingAmountNeeded || '—'}</div>
                          <Button className="w-full bg-brand-dark hover:bg-brand-dark" onClick={() => { expressFundingInterest(proj.id); toast.success('Interest recorded. The research office will connect you with the lead.'); }}>
                            Express interest
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {filteredDiscover.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                    <p>No research projects match your filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MY PORTFOLIO ── */}
          {activeSection === 'portfolio' && (
            <div className="space-y-6">
              <Card className="shadow-sm border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Project</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Lead</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myInterests.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                          No tracked interests yet — express interest on a project in Discover Research.
                        </td>
                      </tr>
                    ) : (
                      myInterests.map(i => {
                        const proj = research.find(r => r.id === i.projectId);
                        const lead = proj ? researchers.find(r => r.id === proj.researcherId) : null;
                        return (
                          <tr key={i.id} className="border-t border-border">
                            <td className="px-4 py-3 font-medium">{proj?.title || i.projectId}</td>
                            <td className="px-4 py-3">{lead?.name}</td>
                            <td className="px-4 py-3 capitalize">
                              <Badge className={i.status === 'funded' ? 'bg-success-muted text-success-foreground' : i.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-brand-muted text-brand-dark'}>
                                {i.status.replace('_', ' ')}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* ── Post Opportunity ── */}
          {activeSection === 'rfps' && (
            <div className="space-y-6">
              <Card className="p-12 text-center border-2 border-dashed border-border rounded-xl">
                <FilePlus className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <div className="font-medium text-muted-foreground mb-1">No opportunities posted yet</div>
                <div className="text-sm text-muted-foreground mb-4">Post a funding opportunity and researchers across Rwanda will be able to discover and apply for it.</div>
                <Button className="bg-brand-dark hover:bg-brand-dark" onClick={() => setRfpOpen(true)}>
                  Post your first opportunity
                </Button>
              </Card>
            </div>
          )}

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Funder profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Organization name</Label>
              <Input
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder="Your organization or fund name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Areas of interest</Label>
              <div className="flex flex-wrap gap-1.5 mt-1 min-h-[36px] p-2 border border-input rounded-md bg-background">
                {areaChips.map(chip => (
                  <span key={chip} className="flex items-center gap-1 bg-brand-muted text-brand text-xs px-2 py-0.5 rounded-full">
                    {chip}
                    <button type="button" onClick={() => removeAreaChip(chip)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-1.5">
                <Input
                  value={areaInput}
                  onChange={e => setAreaInput(e.target.value)}
                  placeholder="Add area (e.g. Climate, Health)"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAreaChip(); } }}
                  className="text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={addAreaChip}>Add</Button>
              </div>
            </div>
            <div>
              <Label>Investment range</Label>
              <Input
                value={investmentRange}
                onChange={e => setInvestmentRange(e.target.value)}
                placeholder="e.g. $10,000 – $500,000"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Primary contact email</Label>
              <Input value={user.email} readOnly className="bg-muted/50 mt-1" />
            </div>
            <Button className="w-full bg-brand-dark hover:bg-brand-dark" onClick={saveProfile}>
              Save preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={rfpOpen} onOpenChange={setRfpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post a funding opportunity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={rfpForm.title}
                onChange={e => setRfpForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Summary</Label>
              <Textarea
                rows={4}
                value={rfpForm.summary}
                onChange={e => setRfpForm(p => ({ ...p, summary: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Amount range</Label>
                <Input
                  placeholder="$10k — $50k"
                  value={rfpForm.amountRange}
                  onChange={e => setRfpForm(p => ({ ...p, amountRange: e.target.value }))}
                />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={rfpForm.deadline}
                  onChange={e => setRfpForm(p => ({ ...p, deadline: e.target.value }))}
                />
              </div>
            </div>
            <Button className="w-full bg-brand-dark hover:bg-brand-dark" onClick={submitRfp}>
              Publish opportunity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
