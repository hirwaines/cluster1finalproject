import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import { DollarSign, Clock, Target, Bell, BellOff, CheckCircle, Download, Trophy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '../components/AppShell';
import * as aiApi from '../api/ai';

const FUNDING_DB = [
  { id: 'f1', title: 'NSF AI Research Grant', agency: 'National Science Foundation', amount: '$500,000', deadline: '2026-06-24', areas: ['Machine Learning', 'Artificial Intelligence', 'Neural Networks'], successRate: 68 },
  { id: 'f2', title: 'DOE Climate Innovation Fund', agency: 'Department of Energy', amount: '$750,000', deadline: '2026-07-15', areas: ['Climate', 'Environmental Science', 'Sustainability'], successRate: 54 },
  { id: 'f3', title: 'NIH Genomics Research Program', agency: 'National Institutes of Health', amount: '$400,000', deadline: '2026-07-30', areas: ['Genomics', 'Bioinformatics', 'Healthcare'], successRate: 61 },
  { id: 'f4', title: 'DARPA Quantum Computing Initiative', agency: 'Defense Advanced Research Projects Agency', amount: '$1,200,000', deadline: '2026-08-10', areas: ['Quantum Computing', 'Physics', 'Computer Science'], successRate: 42 },
  { id: 'f5', title: 'Gates Foundation Digital Education', agency: 'Bill & Melinda Gates Foundation', amount: '$300,000', deadline: '2026-09-01', areas: ['Education', 'Digital', 'Higher Education'], successRate: 58 },
  { id: 'f6', title: 'World Bank Data Analytics Grant', agency: 'World Bank Group', amount: '$250,000', deadline: '2026-09-15', areas: ['Analytics', 'Big Data', 'Data Science'], successRate: 49 },
];

const AWARD_HISTORY = [
  { title: 'NSF Early Career Award', agency: 'NSF', amount: '$180,000', year: '2024', status: 'Active' },
  { title: 'Research Excellence Grant', agency: 'AUCA', amount: '$45,000', year: '2023', status: 'Completed' },
  { title: 'Innovation Seed Fund', agency: 'East Africa Fund', amount: '$25,000', year: '2023', status: 'Completed' },
];

export function FundingOpportunities() {
  const navigate = useNavigate();
  const { user, research, sendCollaborationRequest } = useApp();
  const [activeTab, setActiveTab] = useState<'opportunities' | 'alerts' | 'awards'>('opportunities');
  const [selectedFunding, setSelectedFunding] = useState<typeof FUNDING_DB[0] | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [proposedAmount, setProposedAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [alertSettings, setAlertSettings] = useState<Record<string, boolean>>({
    f1: true, f2: false, f3: true, f4: false, f5: false, f6: false,
  });
  const [savedOpps, setSavedOpps] = useState<Set<string>>(new Set());

  const [aiFundingMatches, setAiFundingMatches] = useState<aiApi.FundingMatch[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    setAiLoading(true);
    aiApi.getFundingMatches(user.id)
      .then(setAiFundingMatches)
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, [user?.id]);

  // Compute match score from researcher's publication keywords vs funding areas
  const userKeywords = useMemo(() => {
    if (!user) return new Set<string>();
    return new Set(keywordFrequencyFromPublications(user.id, research).map(k => k.keyword.toLowerCase()));
  }, [user, research]);

  const opportunitiesWithMatch = useMemo(() => {
    return FUNDING_DB.map(opp => {
      const matchedAreas = opp.areas.filter(a => userKeywords.has(a.toLowerCase()));
      const baseScore = matchedAreas.length > 0
        ? Math.min(97, 55 + matchedAreas.length * 14)
        : Math.floor(30 + Math.random() * 25);
      return { ...opp, matchScore: baseScore, matchedAreas };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [userKeywords]);

  const getDaysLeft = (deadline: string) => {
    return Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 86400000));
  };

  const handleApply = (opp: typeof FUNDING_DB[0]) => {
    setSelectedFunding(opp);
    setShowApplyDialog(true);
  };

  const handleSubmitApplication = () => {
    if (!message || !proposedAmount || !timeline) { toast.error('Please fill in all fields'); return; }
    sendCollaborationRequest({
      type: 'funding',
      toUserId: 'funder1',
      fundingId: selectedFunding!.id,
      fundingTitle: selectedFunding!.title,
      message,
      proposedAmount,
      timeline,
    });
    toast.success('Application submitted successfully!');
    setShowApplyDialog(false);
    setMessage(''); setProposedAmount(''); setTimeline('');
    // Navigate to requests page showing sent tab so researcher sees their application status
    setTimeout(() => navigate('/requests', { state: { tab: 'sent' } }), 1200);
  };

  const handleExport = () => {
    const rows = [['Title', 'Agency', 'Amount', 'Deadline', 'Match %', 'Success Rate']];
    opportunitiesWithMatch.forEach(o => rows.push([o.title, o.agency, o.amount, o.deadline, String(o.matchScore), String(o.successRate)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'funding-opportunities.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <AppShell>
    <div style={{ padding: '2rem' }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Funding Opportunities</h1>
            <p className="text-gray-600">Grant recommendations matched to your publication keywords</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        {/* AI Funding Matches — from AI service 8004 */}
        {(aiFundingMatches.length > 0 || aiLoading) && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-700" />
              <span className="font-semibold text-green-900 text-sm">AI-Matched Funding Opportunities</span>
              <span className="ml-auto px-2 py-0.5 bg-green-700 text-white rounded text-xs font-bold">AI Service 8004</span>
            </div>
            {aiLoading ? (
              <p className="text-sm text-green-700 animate-pulse">Matching your expertise to current funding opportunities…</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {aiFundingMatches.slice(0, 3).map(m => (
                  <div key={m.opportunityId} className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-green-700">{Math.round(m.matchScore * 100)}% match</span>
                      <Trophy className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{m.title}</p>
                    <p className="text-xs text-gray-500 truncate">{m.organization}</p>
                    {m.matchedKeywords?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {m.matchedKeywords.slice(0, 3).map(k => (
                          <span key={k} className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs">{k}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Smart match banner */}
        <Card className="p-6 mb-8 bg-[#1E40AF] text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Funding Match Summary</h3>
              <p className="text-white/90 text-sm">
                {userKeywords.size > 0
                  ? `Your ${userKeywords.size} expertise keyword${userKeywords.size > 1 ? 's' : ''} matched against ${FUNDING_DB.length} active funding calls. ${opportunitiesWithMatch.filter(o => o.matchScore >= 70).length} high-relevance opportunities found.`
                  : `${FUNDING_DB.length} active funding calls available. Upload publications to get personalised match scores.`}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {([
            { id: 'opportunities', label: 'Opportunities', icon: DollarSign },
            { id: 'alerts', label: 'Alert Settings', icon: Bell },
            { id: 'awards', label: 'Award History', icon: Trophy },
          ] as const).map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* OPPORTUNITIES TAB */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            {opportunitiesWithMatch.map(opp => {
              const daysLeft = getDaysLeft(opp.deadline);
              const isUrgent = daysLeft <= 30;
              const isSaved = savedOpps.has(opp.id);
              return (
                <Card key={opp.id} className={`p-6 hover:shadow-xl transition-all border-2 ${isUrgent ? 'border-red-100' : 'border-transparent hover:border-blue-200'}`}>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="text-xl font-bold text-blue-700">{opp.title}</h3>
                            <Badge className={opp.matchScore >= 70 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                              {opp.matchScore}% Match
                            </Badge>
                            {isUrgent && <Badge className="bg-red-100 text-red-700">Deadline soon</Badge>}
                          </div>
                          <p className="text-gray-600 text-sm">{opp.agency}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm mb-4">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-700">{opp.amount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className={isUrgent ? 'text-red-600 font-bold' : 'text-gray-600'}>
                            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left Â· {opp.deadline}
                          </span>
                        </div>
                      </div>

                      {/* Deadline progress bar */}
                      <div className="mb-4">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(100, Math.max(5, 100 - (daysLeft / 120) * 100))}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {opp.areas.map(area => (
                          <Badge
                            key={area}
                            className={opp.matchedAreas.includes(area) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}
                          >
                            {opp.matchedAreas.includes(area) && 'âœ“ '}{area}
                          </Badge>
                        ))}
                      </div>

                      {opp.matchedAreas.length > 0 && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2 text-sm text-blue-900">
                            <Target className="w-4 h-4 shrink-0 mt-0.5" />
                            <span><strong>Why this matches:</strong> Your publications contain {opp.matchedAreas.join(', ')} ”” directly aligned with this grant's focus areas.</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Button className="bg-[#1E40AF] hover:from-blue-700 hover:to-green-700" onClick={() => handleApply(opp)}>
                          Apply Now
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSavedOpps(prev => { const s = new Set(prev); isSaved ? s.delete(opp.id) : s.add(opp.id); return s; })}
                        >
                          {isSaved ? 'â˜… Saved' : 'â˜† Save'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setAlertSettings(prev => ({ ...prev, [opp.id]: !prev[opp.id] })); toast.success(alertSettings[opp.id] ? 'Alert removed' : 'Alert set for this opportunity'); }}
                        >
                          {alertSettings[opp.id] ? <Bell className="w-4 h-4 text-blue-800" /> : <BellOff className="w-4 h-4 text-gray-400" />}
                        </Button>
                      </div>
                    </div>

                    {/* Success probability card */}
                    <div className="w-52 shrink-0 space-y-3">
                      <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 text-center">
                        <div className="text-xs text-gray-500 mb-1">Success Probability</div>
                        <div className="text-4xl font-bold text-green-600 mb-1">{opp.successRate}%</div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{ width: `${opp.successRate}%` }} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Based on field avg.</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-xs text-gray-500 mb-1">Match Score</div>
                        <div className="text-3xl font-bold text-blue-800">{opp.matchScore}%</div>
                        <div className="text-xs text-gray-500 mt-1">{opp.matchedAreas.length} keyword{opp.matchedAreas.length !== 1 ? 's' : ''} matched</div>
                      </Card>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Funding Alert Configuration</h3>
              <p className="text-sm text-gray-600 mb-6">Enable alerts to be notified when deadlines approach or new matching opportunities are added.</p>
              <div className="space-y-4">
                {opportunitiesWithMatch.map(opp => {
                  const daysLeft = getDaysLeft(opp.deadline);
                  return (
                    <div key={opp.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-all">
                      <div className="flex-1">
                        <div className="font-semibold">{opp.title}</div>
                        <div className="text-sm text-gray-500">{opp.agency} Â· {daysLeft} days left</div>
                        <div className="flex gap-2 mt-1">
                          <Badge className={opp.matchScore >= 70 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'} style={{ fontSize: '11px' }}>
                            {opp.matchScore}% match
                          </Badge>
                          {daysLeft <= 30 && <Badge className="bg-red-100 text-red-700" style={{ fontSize: '11px' }}>Urgent</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{alertSettings[opp.id] ? 'Alert on' : 'Alert off'}</span>
                        <Switch
                          checked={!!alertSettings[opp.id]}
                          onCheckedChange={v => {
                            setAlertSettings(prev => ({ ...prev, [opp.id]: v }));
                            toast.success(v ? `Alert enabled for "${opp.title}"` : `Alert disabled`);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Global Alert Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'New matching opportunities', desc: 'Alert when new grants match your expertise', key: 'new_match' },
                  { label: '30-day deadline reminder', desc: 'Reminder 30 days before deadline', key: 'deadline_30' },
                  { label: '7-day deadline reminder', desc: 'Urgent reminder 7 days before deadline', key: 'deadline_7' },
                  { label: 'Application status updates', desc: 'Notify when application status changes', key: 'status' },
                ].map(pref => (
                  <div key={pref.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">{pref.label}</div>
                      <div className="text-sm text-gray-500">{pref.desc}</div>
                    </div>
                    <Switch defaultChecked onCheckedChange={v => toast.success(v ? 'Alert enabled' : 'Alert disabled')} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* AWARDS TAB */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Total Awards', value: AWARD_HISTORY.length, color: 'text-blue-800' },
                { label: 'Total Funded', value: '$250K', color: 'text-green-600' },
                { label: 'Success Rate', value: '67%', color: 'text-purple-600' },
              ].map(m => (
                <Card key={m.label} className="p-6 text-center">
                  <div className={`text-4xl font-bold ${m.color} mb-1`}>{m.value}</div>
                  <div className="text-sm text-gray-600">{m.label}</div>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Award History</h3>
              <div className="space-y-4">
                {AWARD_HISTORY.map((award, i) => (
                  <div key={i} className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold">{award.title}</div>
                        <div className="text-sm text-gray-500">{award.agency} Â· {award.year}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{award.amount}</div>
                      <Badge className={award.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                        {award.status === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {award.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for Funding</DialogTitle>
          </DialogHeader>
          {selectedFunding && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="font-bold text-blue-900 mb-1">{selectedFunding.title}</div>
                <div className="text-sm text-blue-700">{selectedFunding.agency} Â· {selectedFunding.amount}</div>
              </div>
              <div>
                <Label>Proposed Budget Amount *</Label>
                <Input value={proposedAmount} onChange={e => setProposedAmount(e.target.value)} placeholder="e.g. $250,000" className="mt-1" />
              </div>
              <div>
                <Label>Project Timeline *</Label>
                <Input value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="e.g. 18 months" className="mt-1" />
              </div>
              <div>
                <Label>Project Proposal *</Label>
                <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your research project, objectives, methodology, and expected outcomes..." rows={6} className="mt-1" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
                <Button className="flex-1 bg-[#1E40AF] hover:from-blue-700 hover:to-green-700" onClick={handleSubmitApplication}>
                  Submit Application
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

