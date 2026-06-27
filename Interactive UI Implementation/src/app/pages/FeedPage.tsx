import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
    <>
    <div className="flex">
        {/* ── Main area ── */}
        <div className="flex-1 min-w-0 p-6">

          {/* Header + search */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">Research Feed</h1>
            <p className="text-muted-foreground text-sm mb-4">Discover, search, and engage with the latest research</p>

            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
              <Input
                placeholder="Search by title, keyword, abstract…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-10 bg-white border-border"
              />
            </div>

            {/* View tabs */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setView('feed')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'feed' ? 'bg-white shadow-sm text-brand' : 'text-muted-foreground'}`}
                >
                  Feed
                </button>
                <button
                  onClick={() => setView('discover')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'discover' ? 'bg-white shadow-sm text-brand' : 'text-muted-foreground'}`}
                >
                  Discover
                </button>
              </div>
              <span className="text-sm text-muted-foreground/70">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    category === cat
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-foreground border-border hover:border-brand/40'
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
            <Card className="p-12 text-center border border-dashed border-border">
              <BookOpen className="w-14 h-14 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-bold text-muted-foreground mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground">Try a different keyword or category.</p>
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
                          className="w-10 h-10 bg-brand flex items-center justify-center text-white font-bold cursor-pointer"
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
                          <div className="text-xs text-muted-foreground">
                            {postAuthor?.department} · {postAuthor?.institution}
                          </div>
                        </div>
                      </div>
                      <Badge className={post.fundingStatus === 'seeking' ? 'bg-warning-muted text-warning-foreground' : 'bg-success-muted text-success-foreground'}>
                        {post.fundingStatus === 'seeking' ? 'Seeking Funding' : post.fundingStatus}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4">
                      <h3
                        className="text-lg font-bold text-brand mb-2 cursor-pointer hover:underline"
                        onClick={() => navigate(`/research/${post.id}`)}
                      >
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{post.abstract}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.keywords.slice(0, 4).map(k => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-4">
                          <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors text-sm">
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            {(post.likes || 0) + (isLiked ? 1 : 0)}
                          </button>
                          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-brand transition-colors text-sm">
                            <MessageCircle className="w-5 h-5" />
                            {post.comments || 0}
                          </button>
                          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-success transition-colors text-sm">
                            <Share2 className="w-5 h-5" />
                            {post.shares || 0}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/research/${post.id}`)}>
                            View more
                          </Button>
                          <Button size="sm" className="" onClick={() => setCollaborationTarget(post.id)}>
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
                        <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 text-sm">
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          {(post.likes || 0) + (isLiked ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1.5 text-muted-foreground text-sm">
                          <MessageCircle className="w-4 h-4" />{post.comments || 0}
                        </button>
                      </div>
                      <button className="text-muted-foreground/70 hover:text-brand">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-bold text-brand mb-2 line-clamp-2 cursor-pointer hover:underline text-sm"
                        onClick={() => navigate(`/research/${post.id}`)}
                      >
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{post.abstract}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.keywords.slice(0, 3).map(k => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>)}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Avatar
                            className="w-7 h-7 bg-brand flex items-center justify-center text-white font-bold text-xs cursor-pointer"
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
                        <Button size="sm" className=" text-xs h-7 px-3" onClick={() => navigate(`/research/${post.id}`)}>
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
              <TrendingUp className="w-4 h-4 text-success" />
              <h3 className="font-semibold text-sm">Trending topics</h3>
            </div>
            <div className="space-y-2.5">
              {trendingTopics.map(t => (
                <div key={t.topic} className="flex items-center justify-between">
                  <button
                    className="text-sm font-medium text-foreground hover:text-brand text-left"
                    onClick={() => { setQuery(t.topic); }}
                  >
                    {t.topic}
                  </button>
                  <Badge className="bg-success-muted text-success-foreground text-xs">{t.growth}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-brand-muted border-border">
            <div className="flex items-center gap-2 mb-2">
              <UsersIcon className="w-4 h-4 text-brand" />
              <h3 className="font-semibold text-sm">Your network</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Connect with researchers who share your expertise areas.</p>
            <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => navigate('/network')}>
              Explore network
            </Button>
          </Card>

          <Card className="p-4 bg-brand-muted border-border">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-brand" />
              <h3 className="font-semibold text-sm">Share your research</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Publish your latest findings to reach researchers across Rwanda.</p>
            <Button size="sm" className="w-full  text-xs" onClick={() => navigate('/researcher/upload')}>
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
              <div className="text-sm text-muted-foreground">
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
                <Button className="flex-1 " onClick={handleCollaboration}>Send request</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
