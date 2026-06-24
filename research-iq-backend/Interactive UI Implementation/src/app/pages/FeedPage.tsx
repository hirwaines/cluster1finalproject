import { useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { useApp } from '../context/AppContext';
import {
  Heart, MessageCircle, Share2, Bookmark, TrendingUp,
  Users as UsersIcon, BookOpen, ArrowRight, X, DollarSign,
  Sparkles, Award, Upload,
} from 'lucide-react';
import { toast } from 'sonner';

const BLUE  = '#1E40AF';
const GREEN = '#047857';

const FUNDING_CHIP: Record<string, { label: string; bg: string; color: string }> = {
  seeking:   { label: 'Seeking Funding', bg: '#FFFBEB', color: '#B45309' },
  funded:    { label: 'Funded',          bg: '#ECFDF5', color: '#065F46' },
  completed: { label: 'Completed',       bg: '#F1F5F9', color: '#334155' },
};

const FIELD_GRADIENTS: Record<string, [string, string]> = {
  'AI':                ['#1E40AF', '#3B82F6'],
  'Machine Learning':  ['#1E40AF', '#6366F1'],
  'Climate':           ['#047857', '#10B981'],
  'Environment':       ['#047857', '#34D399'],
  'Biology':           ['#065F46', '#059669'],
  'Health':            ['#BE185D', '#EC4899'],
  'Education':         ['#7C3AED', '#A78BFA'],
  'Data Science':      ['#0369A1', '#38BDF8'],
  'Physics':           ['#1D4ED8', '#60A5FA'],
  'Chemistry':         ['#9D174D', '#F472B6'],
  'Economics':         ['#B45309', '#F59E0B'],
  'Policy':            ['#374151', '#9CA3AF'],
  'Engineering':       ['#1E3A8A', '#1E40AF'],
};

function getFieldGradient(field: string): [string, string] {
  const key = Object.keys(FIELD_GRADIENTS).find(k =>
    field.toLowerCase().includes(k.toLowerCase())
  );
  return key ? FIELD_GRADIENTS[key] : [BLUE, '#3B82F6'];
}

function ResearchBanner({ field, title }: { field: string; title: string }) {
  const [c1, c2] = getFieldGradient(field);
  return (
    <Box
      sx={{
        height: 110,
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        borderRadius: '10px 10px 0 0',
        display: 'flex',
        alignItems: 'flex-end',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* decorative circles */}
      <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ position: 'absolute', top: 10, right: 40, width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
      <Chip
        label={field}
        size="small"
        sx={{
          bgcolor: 'rgba(255,255,255,0.18)',
          color: '#FFFFFF',
          fontWeight: 600,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.25)',
          fontSize: '0.6875rem',
        }}
      />
    </Box>
  );
}

export function FeedPage() {
  const navigate = useNavigate();
  const { research, researchers, user, likeResearch, sendCollaborationRequest } = useApp();

  const [likedPosts,       setLikedPosts]       = useState<Set<string>>(new Set());
  const [savedPosts,       setSavedPosts]        = useState<Set<string>>(new Set());
  const [collabTarget,     setCollabTarget]      = useState<string | null>(null);
  const [collaborationType, setCollaborationType] = useState('joint-paper');
  const [timeline,         setTimeline]          = useState('3');
  const [message,          setMessage]           = useState('');

  const handleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else { next.add(id); likeResearch(id); }
      return next;
    });
  };

  const handleSave = (id: string) => {
    setSavedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.success('Removed from saved'); }
      else { next.add(id); toast.success('Saved to your library'); }
      return next;
    });
  };

  const handleShare = (post: typeof research[0]) => {
    const url = `${window.location.origin}/publication/${post.id}`;
    navigator.clipboard?.writeText(url).then(() => toast.success('Link copied to clipboard'));
  };

  const handleSendCollabRequest = () => {
    if (!collabTarget || !message.trim()) { toast.error('Please write a message'); return; }
    const post   = research.find(r => r.id === collabTarget);
    const author = post ? researchers.find(r => r.id === post.researcherId) : null;
    if (!post || !author) return;
    sendCollaborationRequest({
      type: 'collaboration',
      toUserId: author.id,
      researchId: post.id,
      researchTitle: post.title,
      message,
      collaborationType,
      timeline: `${timeline} months`,
    });
    toast.success('Collaboration request sent!');
    setCollabTarget(null);
    setMessage('');
    setTimeout(() => navigate('/requests', { state: { tab: 'sent' } }), 1200);
  };

  const collabPost   = research.find(r => r.id === collabTarget);
  const collabAuthor = collabPost ? researchers.find(r => r.id === collabPost.researcherId) : null;

  const trendingTopics = [
    { topic: 'Generative AI',            growth: '+162%', color: BLUE },
    { topic: 'Renewable Energy Cells',   growth: '+89%',  color: GREEN },
    { topic: 'Synthetic Biology',        growth: '+76%',  color: GREEN },
    { topic: 'Quantum Machine Learning', growth: '+64%',  color: BLUE },
    { topic: 'Digital Health',           growth: '+55%',  color: '#7C3AED' },
  ];

  const myProfile = researchers.find(r => r.id === user?.id);
  const myPublications = research.filter(r => r.researcherId === user?.id);
  const fundingOpps = research.filter(r => r.fundingStatus === 'seeking').slice(0, 3);

  return (
    <ResearcherLayout>
      <Box sx={{ display: 'flex', px: 3, py: 3, gap: 3, maxWidth: 1280, mx: 'auto' }}>

        {/* ── Main Feed ────────────────────────────────────────────────── */}
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: 700 }}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#0F172A' }}>Research Feed</Typography>
              <Typography variant="body2" color="text.secondary">
                Latest publications from your network
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<Upload size={14} />}
              onClick={() => navigate('/researcher/upload')}
              sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1E3A8A' }, borderRadius: '8px' }}
            >
              Share Research
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {research.map(post => {
              const author  = researchers.find(r => r.id === post.researcherId);
              const isLiked = likedPosts.has(post.id);
              const isSaved = savedPosts.has(post.id);
              const funding = post.fundingStatus ? FUNDING_CHIP[post.fundingStatus] : null;

              return (
                <Card
                  key={post.id}
                  variant="outlined"
                  sx={{
                    bgcolor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    '&:hover': {
                      borderColor: BLUE,
                      boxShadow: '0 4px 16px rgba(30,64,175,0.10)',
                    },
                  }}
                >
                  {/* Banner image */}
                  <ResearchBanner field={post.field} title={post.title} />

                  <CardContent sx={{ p: 2.5 }}>
                    {/* Author row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }}
                        onClick={() => navigate(`/researcher/profile/${author?.id}`)}
                      >
                        <Avatar
                          src={author?.photo}
                          sx={{ width: 38, height: 38, bgcolor: BLUE, fontWeight: 700, fontSize: '0.875rem' }}
                        >
                          {author?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0F172A', lineHeight: 1.3 }}>
                            {author?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {author?.department} · {author?.institution}
                          </Typography>
                        </Box>
                      </Box>
                      {funding && (
                        <Chip
                          label={funding.label}
                          size="small"
                          sx={{ bgcolor: funding.bg, color: funding.color, fontWeight: 600, borderRadius: '6px', fontSize: '0.6875rem' }}
                        />
                      )}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{
                        color: BLUE, mb: 1, cursor: 'pointer', lineHeight: 1.4,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                      onClick={() => navigate(`/publication/${post.id}`)}
                    >
                      {post.title}
                    </Typography>

                    {/* Abstract */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1.75, lineHeight: 1.7,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.abstract}
                    </Typography>

                    {/* Stats row */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 1.75 }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        <strong style={{ color: '#0F172A' }}>{post.citations}</strong> citations
                      </Typography>
                      {post.doi && (
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          DOI: <span style={{ color: BLUE }}>{post.doi}</span>
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        {new Date(post.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </Typography>
                    </Box>

                    {/* Keywords */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625, mb: 2 }}>
                      {post.keywords.slice(0, 5).map(k => (
                        <Chip
                          key={k}
                          label={k}
                          size="small"
                          sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 500, borderRadius: '6px', height: 22, fontSize: '0.6875rem' }}
                        />
                      ))}
                    </Box>

                    <Divider sx={{ mb: 1.75 }} />

                    {/* Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 0.25 }}>
                        <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                          <IconButton
                            size="small"
                            onClick={() => handleLike(post.id)}
                            sx={{ color: isLiked ? '#DC2626' : '#64748B', gap: 0.5, borderRadius: '8px', px: 1 }}
                          >
                            <Heart size={16} fill={isLiked ? '#DC2626' : 'none'} />
                            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
                              {(post.likes || 0) + (isLiked ? 1 : 0)}
                            </Typography>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Comments">
                          <IconButton size="small" sx={{ color: '#64748B', gap: 0.5, borderRadius: '8px', px: 1 }}>
                            <MessageCircle size={16} />
                            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
                              {post.comments || 0}
                            </Typography>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton size="small" onClick={() => handleShare(post)} sx={{ color: '#64748B', gap: 0.5, borderRadius: '8px', px: 1 }}>
                            <Share2 size={16} />
                            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
                              {post.shares || 0}
                            </Typography>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={isSaved ? 'Remove from saved' : 'Save'}>
                          <IconButton
                            size="small"
                            onClick={() => handleSave(post.id)}
                            sx={{ color: isSaved ? BLUE : '#64748B', borderRadius: '8px' }}
                          >
                            <Bookmark size={16} fill={isSaved ? BLUE : 'none'} />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowRight size={13} />}
                          onClick={() => navigate(`/publication/${post.id}`)}
                          sx={{ borderColor: '#E2E8F0', color: '#334155', fontSize: '0.75rem',
                            '&:hover': { borderColor: BLUE, color: BLUE } }}
                        >
                          Read more
                        </Button>
                        {author?.id !== user?.id && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => { setCollabTarget(post.id); setMessage(''); }}
                            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1E3A8A' }, fontSize: '0.75rem' }}
                          >
                            Collaborate
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* ── Right Sidebar ────────────────────────────────────────────── */}
        <Box
          component="aside"
          sx={{
            width: 288, flexShrink: 0,
            position: 'sticky', top: 80, alignSelf: 'flex-start',
            display: 'flex', flexDirection: 'column', gap: 2,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          {/* My Profile card */}
          {myProfile && (
            <Card variant="outlined" sx={{ bgcolor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ textAlign: 'center', mb: 1.5 }}>
                  <Avatar
                    sx={{ width: 52, height: 52, bgcolor: BLUE, fontWeight: 700, fontSize: '1.25rem', mx: 'auto', mb: 1 }}
                  >
                    {myProfile.name.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0F172A' }}>{myProfile.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{myProfile.department}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 1.25, borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', mb: 1.5 }}>
                  {[
                    { label: 'Publications', value: myPublications.length },
                    { label: 'Citations',    value: myProfile.citations ?? 0 },
                    { label: 'h-index',      value: myProfile.hIndex ?? 0 },
                  ].map(s => (
                    <Box key={s.label} sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: BLUE }}>{s.value}</Typography>
                      <Typography sx={{ fontSize: '0.625rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => navigate('/my-profile')}
                  sx={{ borderColor: BLUE, color: BLUE, fontSize: '0.75rem' }}
                >
                  View My Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Trending Topics */}
          <Card variant="outlined" sx={{ bgcolor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
                <TrendingUp size={16} color={GREEN} />
                <Typography variant="subtitle2" fontWeight={700}>Trending Topics</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {trendingTopics.map((t, idx) => (
                  <Box key={t.topic}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={500} sx={{ color: '#0F172A' }}>{t.topic}</Typography>
                      <Chip label={t.growth} size="small"
                        sx={{ bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 700, height: 18, fontSize: '0.625rem', borderRadius: '4px' }} />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={100 - idx * 15}
                      sx={{
                        height: 3, borderRadius: 2,
                        bgcolor: '#F1F5F9',
                        '& .MuiLinearProgress-bar': { bgcolor: t.color, borderRadius: 2 },
                      }}
                    />
                  </Box>
                ))}
              </Box>
              <Button variant="text" size="small" fullWidth onClick={() => navigate('/trends')}
                sx={{ mt: 1.25, color: BLUE, fontWeight: 600, fontSize: '0.75rem' }}>
                View all trends →
              </Button>
            </CardContent>
          </Card>

          {/* Funding opportunities */}
          <Card variant="outlined" sx={{ bgcolor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
                <DollarSign size={16} color={GREEN} />
                <Typography variant="subtitle2" fontWeight={700}>Funding Opportunities</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {fundingOpps.map(f => (
                  <Box
                    key={f.id}
                    sx={{ p: 1.25, bgcolor: '#F8FAFC', borderRadius: '8px', cursor: 'pointer', '&:hover': { bgcolor: '#EFF6FF' } }}
                    onClick={() => navigate(`/publication/${f.id}`)}
                  >
                    <Typography variant="caption" fontWeight={600} sx={{ color: '#0F172A', display: 'block', mb: 0.25 }} noWrap>
                      {f.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {f.fundingAmountNeeded || 'Amount TBD'}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button variant="text" size="small" fullWidth onClick={() => navigate('/funding')}
                sx={{ mt: 1.25, color: BLUE, fontWeight: 600, fontSize: '0.75rem' }}>
                Browse all funding →
              </Button>
            </CardContent>
          </Card>

          {/* Suggested researchers */}
          <Card variant="outlined" sx={{ bgcolor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.75 }}>
                <UsersIcon size={16} color={BLUE} />
                <Typography variant="subtitle2" fontWeight={700}>Suggested Researchers</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {researchers.filter(r => r.id !== user?.id).slice(0, 4).map(r => (
                  <Box
                    key={r.id}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer', '&:hover': { '& .name': { color: BLUE } } }}
                    onClick={() => navigate(`/researcher/profile/${r.id}`)}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: GREEN, fontSize: '0.75rem', fontWeight: 700 }}>
                      {r.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography className="name" variant="caption" fontWeight={600} sx={{ color: '#0F172A', display: 'block' }} noWrap>
                        {r.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.625rem' }}>
                        {r.department}
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined"
                      sx={{ fontSize: '0.625rem', px: 1, py: 0.25, minWidth: 0, borderColor: '#E2E8F0', color: '#64748B', flexShrink: 0 }}
                      onClick={e => { e.stopPropagation(); navigate(`/researcher/profile/${r.id}`); }}>
                      View
                    </Button>
                  </Box>
                ))}
              </Box>
              <Button variant="text" size="small" fullWidth onClick={() => navigate('/collaborators')}
                sx={{ mt: 1.25, color: BLUE, fontWeight: 600, fontSize: '0.75rem' }}>
                Find collaborators →
              </Button>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card variant="outlined" sx={{ bgcolor: '#EFF6FF', borderRadius: '12px', borderColor: '#BFDBFE' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Sparkles size={16} color={BLUE} />
                <Typography variant="subtitle2" fontWeight={700}>Quick Actions</Typography>
              </Box>
              {[
                { label: 'Share Research',   icon: Upload,   path: '/researcher/upload' },
                { label: 'View Analytics',   icon: Award,    path: '/researcher/analytics' },
                { label: 'Explore Trends',   icon: TrendingUp, path: '/trends' },
                { label: 'Browse Funding',   icon: DollarSign, path: '/funding' },
              ].map(a => (
                <Button
                  key={a.label}
                  variant="text"
                  size="small"
                  fullWidth
                  startIcon={<a.icon size={14} />}
                  onClick={() => navigate(a.path)}
                  sx={{ justifyContent: 'flex-start', color: BLUE, mb: 0.5, fontSize: '0.75rem', fontWeight: 600 }}
                >
                  {a.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* ── Collaboration Dialog ──────────────────────────────────────────── */}
      <Dialog
        open={!!collabTarget}
        onClose={() => setCollabTarget(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Request Collaboration
          <IconButton size="small" onClick={() => setCollabTarget(null)}><X size={18} /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {collabAuthor && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#EFF6FF', borderRadius: '8px' }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: BLUE, fontWeight: 700, fontSize: '0.875rem' }}>
                  {collabAuthor.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={700}>{collabAuthor.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {collabAuthor.department} · {collabAuthor.institution}
                  </Typography>
                </Box>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Collaboration type</InputLabel>
                <Select value={collaborationType} onChange={e => setCollaborationType(e.target.value)} label="Collaboration type">
                  <MenuItem value="joint-paper">Joint Paper</MenuItem>
                  <MenuItem value="research-project">Research Project</MenuItem>
                  <MenuItem value="grant-proposal">Grant Proposal</MenuItem>
                  <MenuItem value="data-sharing">Data Sharing</MenuItem>
                  <MenuItem value="supervision">Supervision / Mentorship</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Timeline (months)"
                type="number"
                size="small"
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                inputProps={{ min: 1, max: 36 }}
                fullWidth
              />

              <TextField
                label="Message *"
                multiline
                rows={4}
                size="small"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Explain why you'd like to collaborate and what you bring to the partnership…"
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCollabTarget(null)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendCollabRequest}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1E3A8A' } }}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </ResearcherLayout>
  );
}
