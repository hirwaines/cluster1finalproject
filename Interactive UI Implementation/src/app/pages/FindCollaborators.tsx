import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useApp } from '../context/AppContext';
import type { User } from '../context/AppContext';
import { getCollaboratorMatch } from '../utils/collaborationMatch';
import { Users, Search, Mail, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

export function FindCollaborators() {
  const navigate = useNavigate();
  const { user, researchers, research, openChatWith, sendCollaborationRequest } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Collaboration request dialog state
  const [requestTarget, setRequestTarget] = useState<User | null>(null);
  const [collaborationType, setCollaborationType] = useState('joint-paper');
  const [timeline, setTimeline] = useState('6');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    if (user?.role === 'funder') navigate('/funder/dashboard');
  }, [user, navigate]);

  if (!user || user.role !== 'researcher') return null;

  const deptOptions = useMemo(() => {
    const set = new Set<string>();
    researchers.filter(r => r.role === 'researcher').forEach(r => r.department && set.add(r.department));
    return ['all', ...[...set].sort()];
  }, [researchers]);

  const peers = researchers.filter(r => r.role === 'researcher' && r.id !== user.id);

  const list = peers
    .map(r => {
      const { score, explanation } = getCollaboratorMatch(user.id, r.id, research);
      return { ...r, matchScore: score, matchExplanation: explanation };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const filtered = list.filter(r => {
    const q = searchQuery.toLowerCase();
    const deptHit = filterDepartment === 'all' || r.department === filterDepartment;
    return deptHit && (searchQuery === '' || r.name.toLowerCase().includes(q) || (r.department || '').toLowerCase().includes(q));
  });

  const handleSendRequest = () => {
    if (!requestTarget || !message.trim()) { toast.error('Please write a message'); return; }
    sendCollaborationRequest({
      type: 'collaboration',
      toUserId: requestTarget.id,
      message,
      collaborationType,
      timeline: `${timeline} months`,
    });
    toast.success(`Collaboration request sent to ${requestTarget.name}!`);
    setRequestTarget(null);
    setMessage('');
    // Navigate to requests page showing sent tab so researcher can track status
    setTimeout(() => navigate('/requests', { state: { tab: 'sent' } }), 1200);
  };

  return (
    <ResearcherLayout>
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Collaborators</h1>
          <p className="text-gray-600 mt-1">
            Recommendations based on overlapping publication keywords. After sending a request, track its status under <button className="text-blue-900 underline" onClick={() => navigate('/requests', { state: { tab: 'sent' } })}>Requests → My Applications</button>.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search by name or department…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {deptOptions.map(d => (
                <SelectItem key={d} value={d}>{d === 'all' ? 'All departments' : d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {filtered.map(collaborator => (
            <Card key={collaborator.id} className="p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-wrap gap-6 justify-between">
                <div className="flex gap-4">
                  <Avatar className="w-14 h-14 bg-blue-900/15 text-blue-900 text-xl font-semibold">
                    {collaborator.name.charAt(0)}
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-semibold">{collaborator.name}</h2>
                      {collaborator.verified && <span className="text-emerald-600 text-sm font-medium">Verified ✓</span>}
                    </div>
                    <p className="text-sm text-gray-600">{collaborator.position || collaborator.department} · {collaborator.institution}</p>
                    <div className="mt-3 inline-flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-900">{collaborator.matchScore}%</span>
                      <span className="text-sm text-gray-500">compatibility</span>
                    </div>
                    <div className="mt-2 text-sm bg-slate-50 border border-gray-100 rounded-md p-3 text-gray-800">
                      {collaborator.matchExplanation}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[180px]">
                  <Button className="bg-blue-900 hover:bg-blue-950" onClick={() => navigate(`/researcher/profile/${collaborator.id}`)}>
                    View profile
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-900 text-blue-900 hover:bg-blue-50"
                    onClick={() => setRequestTarget(collaborator)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Request collaboration
                  </Button>
                  <Button variant="outline" onClick={() => openChatWith(collaborator.id)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {research.filter(pub => pub.researcherId === collaborator.id).flatMap(p => p.keywords).slice(0, 5).map(k => (
                      <Badge key={k + collaborator.id} variant="secondary" className="text-xs">{k}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="p-12 text-center border border-dashed border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No colleagues match these filters.</p>
          </Card>
        )}
      </div>

      {/* Collaboration Request Dialog */}
      <Dialog open={!!requestTarget} onOpenChange={() => setRequestTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Collaboration Request</DialogTitle>
          </DialogHeader>
          {requestTarget && (
            <div className="space-y-4">
              {/* Recipient info */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Avatar className="w-10 h-10 bg-blue-900/20 text-blue-900 font-bold">
                  {requestTarget.name.charAt(0)}
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{requestTarget.name}</div>
                  <div className="text-xs text-gray-500">{requestTarget.department} · {requestTarget.institution}</div>
                </div>
              </div>

              <div>
                <Label>Collaboration Type</Label>
                <Select value={collaborationType} onValueChange={setCollaborationType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joint-paper">Joint Paper</SelectItem>
                    <SelectItem value="research-project">Research Project</SelectItem>
                    <SelectItem value="grant-proposal">Grant Proposal</SelectItem>
                    <SelectItem value="data-sharing">Data Sharing</SelectItem>
                    <SelectItem value="supervision">Supervision / Mentorship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Timeline (months)</Label>
                <Input type="number" value={timeline} onChange={e => setTimeline(e.target.value)} min="1" max="36" className="mt-1" />
              </div>

              <div>
                <Label>Message *</Label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Explain why you'd like to collaborate and what you bring to the partnership..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800">
                After sending, you can track the status of this request under <strong>Requests → My Applications</strong>.
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setRequestTarget(null)}>Cancel</Button>
                <Button className="flex-1 bg-blue-900 hover:bg-blue-950" onClick={handleSendRequest}>
                  <Send className="w-4 h-4 mr-2" /> Send Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ResearcherLayout>
  );
}
