import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Calendar, Link2,
  FileText, Users, BookOpen, Award, Mail, Send,
} from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

export function ResearchPaperPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { research, researchers, user, likeResearch, sendCollaborationRequest } = useApp();

  const paper = research.find(r => r.id === id);
  const author = paper ? researchers.find(r => r.id === paper.researcherId) : null;

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', author: 'Dr. Amelia Nkurunziza', avatar: 'A', text: 'Excellent methodology — the longitudinal design adds real credibility to your causal claims.', date: '2 days ago' },
    { id: 'c2', author: 'Prof. Kevin Mwangi', avatar: 'K', text: 'Would love to see a follow-up study with a larger sample across East African universities.', date: '1 day ago' },
  ]);

  if (!paper || !author) {
    return (
      <>
        <div className="p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-base font-semibold mb-2">Paper not found</h2>
          <Button variant="outline" onClick={() => navigate(-1 as any)}>Go back</Button>
        </div>
      </>
    );
  }

  const handleLike = () => {
    if (!liked) likeResearch(paper.id);
    setLiked(l => !l);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: `c${Date.now()}`,
        author: user?.name || 'You',
        avatar: user?.name?.charAt(0) || 'Y',
        text: commentText.trim(),
        date: 'Just now',
      },
    ]);
    setCommentText('');
    toast.success('Comment posted');
  };

  const handleCollaborate = () => {
    if (!user) return;
    sendCollaborationRequest({
      type: 'collaboration',
      toUserId: author.id,
      researchId: paper.id,
      researchTitle: paper.title,
      message: `I would like to collaborate on "${paper.title}".`,
      collaborationType: 'joint-paper',
      timeline: '3 months',
    });
    toast.success('Collaboration request sent!');
    setTimeout(() => navigate('/requests', { state: { tab: 'sent' } }), 1200);
  };

  const sections = paper.abstract
    ? [
        { heading: 'Abstract', content: paper.abstract },
        { heading: 'Introduction', content: `This research addresses key challenges in the field of ${paper.field}. The study was conducted to provide empirical evidence and advance theoretical understanding. Rwanda's research landscape continues to evolve, and this work contributes to that body of knowledge.` },
        { heading: 'Methodology', content: 'A mixed-methods approach was employed, combining quantitative data analysis with qualitative interviews. Data was collected over a period of six months using validated instruments. Statistical analysis was performed using standard research software, with significance threshold set at p < 0.05.' },
        { heading: 'Results', content: 'The findings indicate significant correlations between the key variables under investigation. Multiple regression analysis confirmed the proposed theoretical model with an R² of 0.74. Sub-group analyses revealed consistent patterns across different demographic segments of the sample population.' },
        { heading: 'Discussion', content: 'These results align with previous literature while also providing novel insights specific to the Rwandan and broader East African context. Limitations include the cross-sectional nature of the primary data collection phase. Future research should consider longitudinal designs to confirm causality.' },
        { heading: 'Conclusion', content: 'This study contributes a validated framework that can inform policy and practice in the domain of ' + paper.field + '. The implications extend beyond the immediate study population and offer a replicable model for similar research contexts across Sub-Saharan Africa.' },
      ]
    : [];

  return (
    <>
      <div className="w-full">

        {/* Back */}
        <button
          onClick={() => navigate(-1 as any)}
          className="flex items-center gap-2 text-muted-foreground hover:text-brand mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex gap-8">
          {/* ── Main article ── */}
          <article className="flex-1 min-w-0">

            {/* Field banner */}
            <div className="h-14 rounded-lg bg-brand flex items-center px-5 mb-6">
              <span className="text-white/70 text-xs uppercase tracking-widest mr-3">Field</span>
              <span className="text-white font-semibold">{paper.field}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold tabular-nums sm:text-3xl text-foreground leading-snug mb-4">{paper.title}</h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className={
                paper.fundingStatus === 'funded' ? 'bg-success-muted text-success-foreground' :
                paper.fundingStatus === 'seeking' ? 'bg-warning-muted text-warning-foreground' :
                'bg-muted text-foreground'
              }>
                {paper.fundingStatus === 'seeking' ? 'Seeking Funding' : paper.fundingStatus}
              </Badge>
              {paper.keywords.map(k => (
                <Badge key={k} variant="secondary">{k}</Badge>
              ))}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(paper.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              {paper.doi && (
                <div className="flex items-center gap-1.5">
                  <Link2 className="w-4 h-4" />
                  <span className="text-brand cursor-pointer hover:underline">{paper.doi}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                {paper.citations} citations
              </div>
            </div>

            {/* Author row */}
            <Card className="p-4 mb-8 bg-brand-muted border-border">
              <div className="flex items-center gap-4">
                <Avatar
                  className="w-14 h-14 bg-brand flex items-center justify-center text-white font-bold text-xl cursor-pointer"
                  onClick={() => navigate(`/researcher/profile/${author.id}`)}
                >
                  {author.name.charAt(0)}
                </Avatar>
                <div className="flex-1">
                  <div
                    className="font-semibold text-brand cursor-pointer hover:underline"
                    onClick={() => navigate(`/researcher/profile/${author.id}`)}
                  >
                    {author.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{author.department} · {author.institution}</div>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{author.publications} publications</span>
                    <span>{author.citations} citations</span>
                    <span>h-index: {author.hIndex}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.location.href = `mailto:${author.email || ''}`}>
                  <Mail className="w-4 h-4 mr-1" /> Contact
                </Button>
              </div>
            </Card>

            {/* Article body */}
            <div className="space-y-8">
              {sections.map(section => (
                <section key={section.heading}>
                  <h2 className="text-base font-semibold text-foreground mb-3 pb-1 border-b border-border">{section.heading}</h2>
                  <p className="text-foreground leading-relaxed">{section.content}</p>
                </section>
              ))}

              {/* Authors list */}
              {paper.authors && paper.authors.length > 0 && (
                <section>
                  <h2 className="text-base font-semibold text-foreground mb-3 pb-1 border-b border-border">Authors</h2>
                  <div className="flex flex-wrap gap-2">
                    {paper.authors.map(a => (
                      <Badge key={a} variant="outline">{a}</Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* References placeholder */}
              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 pb-1 border-b border-border">References</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>[1] Kagame, P. et al. (2023). Institutional Research Capacity in Rwanda. <em>African Journal of Higher Education</em>, 12(4), 45–62.</p>
                  <p>[2] Nkurunziza, A. & Mwangi, K. (2022). East African Research Collaboration Frameworks. <em>Research Policy</em>, 51(3), 104–118.</p>
                  <p>[3] UNESCO (2022). <em>Science Report: The Race Against Time for Smarter Development</em>. UNESCO Publishing.</p>
                </div>
              </section>
            </div>

            {/* ── Comments ── */}
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-base font-semibold mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand" />
                Comments ({comments.length})
              </h2>

              <div className="space-y-4 mb-6">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="w-9 h-9 bg-brand flex items-center justify-center text-white font-bold shrink-0 text-sm">
                      {c.avatar}
                    </Avatar>
                    <div className="flex-1 bg-muted/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{c.author}</span>
                        <span className="text-xs text-muted-foreground/70">{c.date}</span>
                      </div>
                      <p className="text-sm text-foreground">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <div className="flex gap-3">
                <Avatar className="w-9 h-9 bg-brand flex items-center justify-center text-white font-bold shrink-0 text-sm">
                  {user?.name.charAt(0) || 'Y'}
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows={3}
                    className="mb-2"
                  />
                  <Button size="sm" className="" onClick={handleComment}>
                    <Send className="w-4 h-4 mr-2" /> Post comment
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* ── Right sidebar ── */}
          <aside className="w-64 shrink-0 space-y-4 sticky top-20 self-start">
            {/* Actions */}
            <Card className="p-4">
              <div className="flex gap-3 mb-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg border transition-colors text-sm font-medium ${liked ? 'border-red-200 text-destructive bg-destructive/10' : 'border-border text-muted-foreground hover:border-red-200 hover:text-red-500'}`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  {(paper.likes || 0) + (liked ? 1 : 0)}
                </button>
                <button
                  onClick={() => setBookmarked(b => !b)}
                  className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg border transition-colors text-sm font-medium ${bookmarked ? 'border-border text-brand bg-brand-muted' : 'border-border text-muted-foreground hover:border-border'}`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                  Save
                </button>
              </div>
              <Button className="w-full " onClick={handleCollaborate}>
                <Users className="w-4 h-4 mr-2" /> Request collaboration
              </Button>
            </Card>

            {/* Stats */}
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-3">Paper stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Citations</span>
                  <span className="font-semibold text-brand">{paper.citations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likes</span>
                  <span className="font-semibold">{(paper.likes || 0) + (liked ? 1 : 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shares</span>
                  <span className="font-semibold">{paper.shares || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="font-semibold">{comments.length}</span>
                </div>
              </div>
            </Card>

            {/* Author card */}
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-3">About the author</h3>
              <div
                className="flex items-center gap-3 mb-3 cursor-pointer"
                onClick={() => navigate(`/researcher/profile/${author.id}`)}
              >
                <Avatar className="w-10 h-10 bg-brand flex items-center justify-center text-white font-semibold">
                  {author.name.charAt(0)}
                </Avatar>
                <div>
                  <div className="font-semibold text-sm hover:underline">{author.name}</div>
                  <div className="text-xs text-muted-foreground">{author.institution}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {author.expertise?.slice(0, 3).map(e => (
                  <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                ))}
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate(`/researcher/profile/${author.id}`)}>
                View full profile
              </Button>
            </Card>

            {/* Keywords */}
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand" /> Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {paper.keywords.map(k => (
                  <Badge key={k} variant="secondary" className="text-xs cursor-pointer hover:bg-brand-muted">
                    {k}
                  </Badge>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
