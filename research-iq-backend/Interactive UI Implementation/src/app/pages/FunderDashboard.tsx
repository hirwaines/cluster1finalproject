import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';
import {
  Brain,
  LogOut,
  Building2,
  DollarSign,
  Filter,
  Search,
  FilePlus,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import * as aiApi from '../api/ai';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { ChatPanel, ChatHeaderButton } from '../components/ChatPanel';
import { AppShell } from '../components/AppShell';

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
    logout,
    research,
    researchers,
    funderInterests,
    expressFundingInterest,
    updateFunderProfile,
    postFunderRfp,
    chatMessages,
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
  const [areasDraft, setAreasDraft] = useState((user?.areasOfInterest || []).join(', '));

  // ── All hooks must precede early returns ────────────────────────────────
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

  // AI: Funding landscape from AI service 8004
  const [aiFundingLandscape, setAiFundingLandscape] = useState<aiApi.FundingLandscape | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'funder') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    aiApi.getFundingLandscape().then(setAiFundingLandscape).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (user?.investmentRange) setInvestmentRange(user.investmentRange);
    if (user?.areasOfInterest) setAreasDraft(user.areasOfInterest.join(', '));
  }, [user?.investmentRange, user?.areasOfInterest]);

  if (!user || user.role !== 'funder') {
    return null;
  }

  const org = user.organizationName || user.name;

  const filteredDiscover = seeking.filter(r => {
    const lead = researchers.find(x => x.id === r.researcherId);
    const blob = `${r.title} ${r.abstract} ${lead?.name || ''}`.toLowerCase();
    return blob.includes(search.toLowerCase());
  });

  const myInterests = funderInterests.filter(i => i.funderId === user.id);

  const unreadChat = chatMessages.filter(m => m.receiverId === user.id && !m.read).length;

  const saveProfile = () => {
    updateFunderProfile({
      investmentRange,
      areasOfInterest: areasDraft
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    });
    toast.success('Profile preferences updated.');
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
    <AppShell>
      <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome {org}</h1>
          <p className="text-gray-600">Discover projects seeking funding and track expressions of interest.</p>
        </div>

        {/* AI Funding Landscape — from AI service 8004 */}
        {aiFundingLandscape && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-700" />
              <span className="font-semibold text-green-900 text-sm">Funding Landscape Intelligence</span>
              <span className="ml-auto px-2 py-0.5 bg-green-700 text-white rounded text-xs font-bold">AI Service 8004</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 border border-green-100">
                <div className="text-xl font-bold text-gray-900">{aiFundingLandscape.totalOpportunities}</div>
                <div className="text-xs text-gray-500">Active Opportunities</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-100">
                <div className="text-xl font-bold text-gray-900">${(aiFundingLandscape.averageGrantSize / 1000).toFixed(0)}K</div>
                <div className="text-xs text-gray-500">Avg. Grant Size</div>
              </div>
              {aiFundingLandscape.topFunders?.slice(0, 2).map(f => (
                <div key={f.name} className="bg-white rounded-lg p-3 border border-green-100">
                  <div className="text-sm font-bold text-gray-900 truncate">{f.name}</div>
                  <div className="text-xs text-gray-500">{f.count} grants available</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-[#1E40AF]" />
              <span className="text-sm font-medium text-gray-600">Active investments</span>
            </div>
            <div className="text-3xl font-bold">{myInterests.filter(i => i.status === 'funded').length}</div>
          </Card>
          <Card className="p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <FilePlus className="w-5 h-5 text-[#1E40AF]" />
              <span className="text-sm font-medium text-gray-600">Proposals reviewed</span>
            </div>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">This quarter</p>
          </Card>
          <Card className="p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[#1E40AF]" />
              <span className="text-sm font-medium text-gray-600">Matching researchers</span>
            </div>
            <div className="text-3xl font-bold">
              {researchers.filter(r => r.role === 'researcher').length}
            </div>
          </Card>
        </div>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Discover research to fund</h2>
            <Button className="bg-[#1E40AF] hover:from-blue-700 hover:to-green-700" onClick={() => setRfpOpen(true)}>
              <FilePlus className="w-4 h-4 mr-2" />
              Submit new RFP
            </Button>
          </div>
          <Card className="p-4 mb-4 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Search projects…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="w-[200px]">
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
                <SelectTrigger className="w-[160px]">
                  <Building2 className="w-4 h-4 mr-2 shrink-0" />
                  <SelectValue placeholder="Institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All institutions</SelectItem>
                  <SelectItem value="AUCA">AUCA</SelectItem>
                </SelectContent>
              </Select>
              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Funding needed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any amount</SelectItem>
                  <SelectItem value="low">Under $40k</SelectItem>
                  <SelectItem value="mid">$40k”“$60k</SelectItem>
                  <SelectItem value="high">Above $60k</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="space-y-4">
            {filteredDiscover.map(proj => {
              const lead = researchers.find(r => r.id === proj.researcherId);
              return (
                <Card key={proj.id} className="p-6 shadow-sm border border-gray-100">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1E40AF]">{proj.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{lead?.name} • {lead?.institution}</p>
                      <p className="text-sm text-gray-700 mt-3 line-clamp-2">{proj.abstract}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {proj.keywords.map(k => (
                          <Badge key={k} variant="secondary">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right space-y-2 min-w-[140px]">
                      <div className="text-sm text-gray-500">Funding sought</div>
                      <div className="text-xl font-bold">{proj.fundingAmountNeeded || '””'}</div>
                      <Button
                        className="w-full bg-[#1E40AF] hover:from-blue-700 hover:to-green-700"
                        onClick={() => {
                          expressFundingInterest(proj.id);
                          toast.success('Interest recorded. The research office will connect you with the lead.');
                        }}
                      >
                        Express interest
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Matched to your interests</h2>
          <div className="grid gap-4">
            {MATCH_ROWS.map(row => (
              <Card key={row.projectId} className="p-6 shadow-sm border border-gray-100">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{row.title}</h3>
                    <p className="text-sm text-gray-600">
                      {row.researcherName} • {row.institution}
                    </p>
                    <p className="text-sm text-gray-700 mt-3 bg-slate-50 border border-gray-100 rounded-md p-3">
                      <span className="font-medium text-gray-900">{row.match}% match ”” </span>
                      {row.why}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Funding needed</div>
                    <div className="text-xl font-bold mb-2">{row.funding}</div>
                    <Button
                      className="bg-[#1E40AF] hover:from-blue-700 hover:to-green-700"
                      onClick={() => {
                        expressFundingInterest(row.projectId);
                        toast.success('Interest sent to the programme office.');
                      }}
                    >
                      Express interest
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">My active interests</h2>
          <Card className="shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Project</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Lead</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {myInterests.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No tracked interests yet ”” express interest on a project above.
                    </td>
                  </tr>
                ) : (
                  myInterests.map(i => {
                    const proj = research.find(r => r.id === i.projectId);
                    const lead = proj ? researchers.find(r => r.id === proj.researcherId) : null;
                    return (
                      <tr key={i.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium">{proj?.title || i.projectId}</td>
                        <td className="px-4 py-3">{lead?.name}</td>
                        <td className="px-4 py-3 capitalize">{i.status.replace('_', ' ')}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </Card>
        </section>
      </div>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Funder profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Organization</Label>
              <Input value={org} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label>Areas of interest (comma-separated)</Label>
              <Input value={areasDraft} onChange={e => setAreasDraft(e.target.value)} />
            </div>
            <div>
              <Label>Investment range</Label>
              <Input value={investmentRange} onChange={e => setInvestmentRange(e.target.value)} />
            </div>
            <div>
              <Label>Primary contact email</Label>
              <Input value={user.email} readOnly className="bg-gray-50" />
            </div>
            <Button className="w-full bg-[#1E40AF] hover:from-blue-700 hover:to-green-700" onClick={saveProfile}>
              Save preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={rfpOpen} onOpenChange={setRfpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit funding opportunity (RFP)</DialogTitle>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount range</Label>
                <Input
                  placeholder="$10k ”” $50k"
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
            <Button className="w-full bg-[#1E40AF] hover:from-blue-700 hover:to-green-700" onClick={submitRfp}>
              Post RFP
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </AppShell>
  );
}

