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
  Users as UsersIcon, Search, BookOpen, ExternalLink,
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
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title, keyword, abstract…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="h-9 border-border/80 bg-card pl-9 text-sm"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-md border border-border bg-muted/50 p-0.5">
          <button
            type="button"
            onClick={() => setView('feed')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${view === 'feed' ? 'bg-card text-brand shadow-sm' : 'text-muted-foreground'}`}
          >
            Feed
          </button>
          <button
            type="button"
            onClick={() => setView('discover')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${view === 'discover' ? 'bg-card text-brand shadow-sm' : 'text-muted-foreground'}`}
          >
            Discover
          </button>
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              category === cat
                ? 'border-brand bg-brand text-white'
                : 'border-border bg-card text-foreground hover:border-brand/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {view === 'feed' && (
        <div className="mb-4">
          <SystemAnnouncements limit={2} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center border border-dashed border-border">
              <BookOpen className="w-14 h-14 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-bold text-muted-foreground mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground">Try a different keyword or category.</p>
            </Card>
          ) : view === 'feed' ? (
            /* ── Feed view (single column) ── */
            <div className="space-y-4 w-full">
              {filtered.map(post => {
                const postAuthor = researchers.find(r => r.id === post.researcherId);
                const authorName = postAuthor?.name ?? post.researcherName ?? 'Researcher';
                const authorDept = postAuthor?.department ?? post.researcherDepartment;
                const authorInst = postAuthor?.institution ?? post.researcherInstitution;
                const isLiked = likedPosts.has(post.id);
                return (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all">
                    {/* Author row */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="w-10 h-10 bg-brand flex items-center justify-center text-white font-bold cursor-pointer"
                          onClick={() => postAuthor && navigate(`/researcher/profile/${postAuthor.id}`)}
                        >
                          {authorName.charAt(0)}
                        </Avatar>
                        <div>
                          <div
                            className={`font-semibold text-sm ${postAuthor ? 'cursor-pointer hover:underline' : ''}`}
                            onClick={() => postAuthor && navigate(`/researcher/profile/${postAuthor.id}`)}
                          >
                            {authorName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {[authorDept, authorInst].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      </div>
                      {post.fundingStatus && (
                        <Badge className={post.fundingStatus === 'seeking' ? 'bg-warning-muted text-warning-foreground' : 'bg-success-muted text-success-foreground'}>
                          {post.fundingStatus === 'seeking' ? 'Seeking Funding' : post.fundingStatus}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4">
                      <h3
                        className="text-base font-semibold text-brand mb-2 cursor-pointer hover:underline"
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
                          {post.doi && (
                            <a
                              href={post.doi.startsWith('http') ? post.doi : `https://doi.org/${post.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="outline" className="gap-1">
                                <ExternalLink className="w-3.5 h-3.5" /> Read
                              </Button>
                            </a>
                          )}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        className="font-semibold text-brand mb-2 line-clamp-2 cursor-pointer hover:underline text-sm"
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
        <aside className="hidden w-56 shrink-0 space-y-3 lg:block">
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
