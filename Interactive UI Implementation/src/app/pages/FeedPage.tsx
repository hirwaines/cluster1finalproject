import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { SystemAnnouncements } from '../components/SystemAnnouncements';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useApp } from '../context/AppContext';
import {
  Heart, MessageCircle, Share2, Bookmark, TrendingUp,
  Users as UsersIcon, Search, BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Genomics', 'Climate Science', 'Neuroscience', 'Renewable Energy', 'Public Health', 'Quantum Computing', 'AI & ML', 'Biotechnology'];

export function FeedPage() {
  const navigate = useNavigate();
  const { research, researchers, user, likeResearch, sendCollaborationRequest } = useApp();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'feed' | 'discover'>('feed');

  const [collaborationTarget, setCollaborationTarget] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [collaborationType, setCollaborationType] = useState('joint-paper');
  const [timeline, setTimeline] = useState('3');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleLike = (id: string) => {
    if (likedPosts.has(id)) {
      setLikedPosts(prev => { const s = new Set(prev); s.delete(id); return s; });
    } else {
      setLikedPosts(prev => new Set(prev).add(id));
      likeResearch(id);
    }
  };

  const filtered = research.filter(p => {
    const matchCat = category === 'All' ||
      p.keywords.some(k => k.toLowerCase().includes(category.toLowerCase())) ||
      p.field.toLowerCase().includes(category.toLowerCase());
    const matchQ = !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.abstract.toLowerCase().includes(query.toLowerCase()) ||
      p.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()));
    return matchCat && matchQ;
  });

  const selectedPaper = research.find(r => r.id === collaborationTarget);
  const selectedAuthor = selectedPaper ? researchers.find(r => r.id === selectedPaper.researcherId) : null;

  const handleCollaboration = () => {
    if (!selectedPaper || !selectedAuthor) return;
    sendCollaborationRequest({
      type: 'collaboration',
      toUserId: selectedAuthor.id,
      researchId: selectedPaper.id,
      researchTitle: selectedPaper.title,
      message,
      collaborationType,
      timeline: `${timeline} months`,
    });
    toast.success('Collaboration request sent!');
    setCollaborationTarget(null);
    setMessage('');
    setTimeout(() => navigate('/requests', { state: { tab: 'sent' } }), 1200);
  };

  const trendingTopics = [
    { topic: 'Generative AI', growth: '+162%' },
    { topic: 'Renewable Energy Cells', growth: '+89%' },
    { topic: 'Synthetic Biology', growth: '+76%' },
    { topic: 'Quantum Machine Learning', growth: '+64%' },
  ];

  return (
    <ResearcherLayout>
      <div className="flex">
        {/* ── Main area ── */}
        <div className="flex-1 min-w-0 p-6">

          {/* Header + search */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">Research Feed</h1>
            <p className="text-gray-500 text-sm mb-4">Discover, search, and engage with the latest research</p>

            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by title, keyword, abstract…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>

            {/* View tabs */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('feed')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'feed' ? 'bg-white shadow-sm text-blue-900' : 'text-gray-600'}`}
                >
                  Feed
                </button>
                <button
                  onClick={() => setView('discover')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'discover' ? 'bg-white shadow-sm text-blue-900' : 'text-gray-600'}`}
                >
                  Discover
                </button>
              </div>
              <span className="text-sm text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    category === cat
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* System announcements (feed view only) */}
          {view === 'feed' && (
            <div className="mb-6">
              <SystemAnnouncements limit={2} />
            </div>
          )}

          {/* Posts */}
          {filtered.length === 0 ? (
            <Card className="p-12 text-center border border-dashed border-gray-200">
              <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-600 mb-1">No results found</h3>
              <p className="text-sm text-gray-500">Try a different keyword or category.</p>
            </Card>
          ) : view === 'feed' ? (
            /* ── Feed view (single column) ── */
            <div className="space-y-6 max-w-2xl">
              {filtered.map(post => {
                const postAuthor = researchers.find(r => r.id === post.researcherId);
                const isLiked = likedPosts.has(post.id);
                return (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all">
                    {/* Author row */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="w-10 h-10 bg-blue-800 flex items-center justify-center text-white font-bold cursor-pointer"
                          onClick={() => navigate(`/researcher/profile/${postAuthor?.id}`)}
                        >
                          {postAuthor?.name.charAt(0)}
                        </Avatar>
                        <div>
                          <div
                            className="font-semibold text-sm cursor-pointer hover:underline"
                            onClick={() => navigate(`/researcher/profile/${postAuthor?.id}`)}
                          >
                            {postAuthor?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {postAuthor?.department} · {postAuthor?.institution}
                          </div>
                        </div>
                      </div>
                      <Badge className={post.fundingStatus === 'seeking' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                        {post.fundingStatus === 'seeking' ? 'Seeking Funding' : post.fundingStatus}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4">
                      <h3
                        className="text-lg font-bold text-blue-900 mb-2 cursor-pointer hover:underline"
                        onClick={() => navigate(`/research/${post.id}`)}
                      >
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.abstract}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.keywords.slice(0, 4).map(k => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors text-sm">
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            {(post.likes || 0) + (isLiked ? 1 : 0)}
                          </button>
                          <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-900 transition-colors text-sm">
                            <MessageCircle className="w-5 h-5" />
                            {post.comments || 0}
                          </button>
                          <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors text-sm">
                            <Share2 className="w-5 h-5" />
                            {post.shares || 0}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/research/${post.id}`)}>
                            View more
                          </Button>
                          <Button size="sm" className="bg-blue-900 hover:bg-blue-950" onClick={() => setCollaborationTarget(post.id)}>
                            Collaborate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* ── Discover view (2-column grid) ── */
            <div className="grid grid-cols-2 gap-5">
              {filtered.map(post => {
                const postAuthor = researchers.find(r => r.id === post.researcherId);
                const isLiked = likedPosts.has(post.id);
                return (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="px-4 pt-4 flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 text-sm">
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          {(post.likes || 0) + (isLiked ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <MessageCircle className="w-4 h-4" />{post.comments || 0}
                        </button>
                      </div>
                      <button className="text-gray-400 hover:text-blue-900">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-bold text-blue-900 mb-2 line-clamp-2 cursor-pointer hover:underline text-sm"
                        onClick={() => navigate(`/research/${post.id}`)}
                      >
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{post.abstract}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.keywords.slice(0, 3).map(k => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>)}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Avatar
                            className="w-7 h-7 bg-blue-800 flex items-center justify-center text-white font-bold text-xs cursor-pointer"
                            onClick={() => navigate(`/researcher/profile/${postAuthor?.id}`)}
                          >
                            {postAuthor?.name.charAt(0)}
                          </Avatar>
                          <span
                            className="text-xs font-medium cursor-pointer hover:underline"
                            onClick={() => navigate(`/researcher/profile/${postAuthor?.id}`)}
                          >
                            {postAuthor?.name}
                          </span>
                        </div>
                        <Button size="sm" className="bg-blue-900 hover:bg-blue-950 text-xs h-7 px-3" onClick={() => navigate(`/research/${post.id}`)}>
                          View more
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <aside className="w-72 p-6 space-y-5 sticky top-[65px] self-start shrink-0">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold text-sm">Trending topics</h3>
            </div>
            <div className="space-y-2.5">
              {trendingTopics.map(t => (
                <div key={t.topic} className="flex items-center justify-between">
                  <button
                    className="text-sm font-medium text-gray-700 hover:text-blue-900 text-left"
                    onClick={() => { setQuery(t.topic); }}
                  >
                    {t.topic}
                  </button>
                  <Badge className="bg-green-100 text-green-700 text-xs">{t.growth}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <UsersIcon className="w-4 h-4 text-blue-900" />
              <h3 className="font-semibold text-sm">Your network</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">Connect with researchers who share your expertise areas.</p>
            <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => navigate('/network')}>
              Explore network
            </Button>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-900" />
              <h3 className="font-semibold text-sm">Share your research</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">Publish your latest findings to reach researchers across Rwanda.</p>
            <Button size="sm" className="w-full bg-blue-900 hover:bg-blue-950 text-xs" onClick={() => navigate('/researcher/upload')}>
              Upload paper
            </Button>
          </Card>
        </aside>
      </div>

      {/* Collaboration Request Dialog */}
      <Dialog open={!!collaborationTarget} onOpenChange={() => setCollaborationTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request collaboration</DialogTitle>
          </DialogHeader>
          {selectedAuthor && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                To: <strong>{selectedAuthor.name}</strong> · {selectedAuthor.department}
              </div>
              <div>
                <Label>Collaboration type</Label>
                <Select value={collaborationType} onValueChange={setCollaborationType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joint-paper">Joint Paper</SelectItem>
                    <SelectItem value="research-project">Research Project</SelectItem>
                    <SelectItem value="grant-proposal">Grant Proposal</SelectItem>
                    <SelectItem value="data-sharing">Data Sharing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Timeline (months)</Label>
                <Input type="number" value={timeline} onChange={e => setTimeline(e.target.value)} className="mt-2" min="1" max="36" />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="I'd love to collaborate because…" rows={4} className="mt-2" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setCollaborationTarget(null)}>Cancel</Button>
                <Button className="flex-1 bg-blue-900 hover:bg-blue-950" onClick={handleCollaboration}>Send request</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ResearcherLayout>
  );
}
