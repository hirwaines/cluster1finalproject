/**
 * PublicationDetailPage — Wikipedia-style full publication view.
 * Route: /publication/:id
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
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
import {
  ArrowLeft, Calendar, Link2, BookOpen, Users, TrendingUp,
  Share2, Bookmark, Send, ExternalLink, Award, X,
} from 'lucide-react';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function PublicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { research, researchers, user, likeResearch, sendCollaborationRequest } = useApp();

  const [collabOpen, setCollabOpen] = useState(false);
  const [collaborationType, setCollaborationType] = useState('joint-paper');
  const [timeline, setTimeline] = useState('6');
  const [message, setMessage] = useState('');

  const pub    = research.find(r => r.id === id);
  const author = pub ? researchers.find(r => r.id === pub.researcherId) : null;

  if (!pub || !author) {
    return (
      <ResearcherLayout>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Publication not found</Typography>
            <Button onClick={() => navigate(-1)} startIcon={<ArrowLeft size={16} />} variant="outlined">
              Go back
            </Button>
          </Box>
        </Box>
      </ResearcherLayout>
    );
  }

  const fundingMap: Record<string, { label: string; bg: string; color: string }> = {
    seeking:   { label: 'Seeking Funding', bg: '#FFFBEB', color: '#B45309' },
    funded:    { label: 'Funded',          bg: '#ECFDF5', color: '#065F46' },
    completed: { label: 'Completed',       bg: '#F1F5F9', color: '#334155' },
  };
  const funding = pub.fundingStatus ? fundingMap[pub.fundingStatus] : null;

  const handleSendCollab = () => {
    if (!message.trim()) { toast.error('Please write a message'); return; }
    sendCollaborationRequest({
      type: 'collaboration',
      toUserId: author.id,
      researchId: pub.id,
      researchTitle: pub.title,
      message,
      collaborationType,
      timeline: `${timeline} months`,
    });
    toast.success('Collaboration request sent!');
    setCollabOpen(false);
    setMessage('');
    setTimeout(() => navigate('/requests', { state: { tab: 'sent' } }), 1200);
  };

  const publishedDate = new Date(pub.publicationDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <ResearcherLayout>
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
        {/* Back button */}
        <Button
          variant="text"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: '#64748B', fontWeight: 500 }}
        >
          Back
        </Button>

        <Grid container spacing={4}>
          {/* ── Left: main content ─────────────────────────────────────── */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Field + status bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
              <Chip
                label={pub.field}
                sx={{ bgcolor: '#EFF6FF', color: '#1E40AF', fontWeight: 600, borderRadius: '6px' }}
              />
              {funding && (
                <Chip
                  label={funding.label}
                  sx={{ bgcolor: funding.bg, color: funding.color, fontWeight: 600, borderRadius: '6px' }}
                />
              )}
              {pub.doi && (
                <Chip
                  icon={<Link2 size={12} />}
                  label={`DOI: ${pub.doi}`}
                  size="small"
                  sx={{ bgcolor: '#F8FAFC', color: '#64748B', fontWeight: 500, borderRadius: '6px', '& .MuiChip-icon': { color: '#64748B' } }}
                />
              )}
            </Box>

            {/* Title */}
            <Typography
              variant="h2"
              sx={{ mb: 2.5, color: '#0F172A', lineHeight: 1.2, fontSize: { xs: '1.5rem', md: '1.875rem' } }}
            >
              {pub.title}
            </Typography>

            {/* Author summary */}
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: 2, bgcolor: '#F8FAFC', borderRadius: '10px',
                border: '1px solid #E2E8F0', mb: 3,
                cursor: 'pointer',
                '&:hover': { borderColor: '#1E40AF' },
                transition: 'border-color 0.15s',
              }}
              onClick={() => navigate(`/researcher/profile/${author.id}`)}
            >
              <Avatar src={author.photo} sx={{ width: 48, height: 48, bgcolor: '#1E40AF', fontWeight: 700 }}>
                {author.name.charAt(0)}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>{author.name}</Typography>
                  {author.verified && (
                    <Chip label="Verified" size="small" sx={{ bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 600, height: 20, fontSize: '0.6875rem', borderRadius: '4px' }} />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {author.position ? `${author.position} · ` : ''}{author.department} · {author.institution}
                </Typography>
              </Box>
              <ExternalLink size={16} color="#94A3B8" style={{ marginLeft: 'auto' }} />
            </Box>

            {/* Quick metrics */}
            <Box sx={{ display: 'flex', gap: 3, mb: 3.5, pb: 3, borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
              {[
                { icon: BookOpen,   value: pub.citations, label: 'Citations',  color: '#1E40AF' },
                { icon: TrendingUp, value: pub.likes || 0, label: 'Likes',     color: '#047857' },
                { icon: Share2,     value: pub.shares || 0, label: 'Shares',   color: '#64748B' },
                { icon: Users,      value: pub.authors.length, label: 'Authors', color: '#64748B' },
              ].map(m => (
                <Box key={m.label} sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: m.color, lineHeight: 1 }}>
                    {m.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <m.icon size={12} />
                    {m.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Abstract */}
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="h5" sx={{ mb: 1.5, color: '#0F172A' }}>Abstract</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.85, color: '#334155', textAlign: 'justify' }}>
                {pub.abstract}
              </Typography>
            </Box>

            {/* Keywords */}
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="h5" sx={{ mb: 1.5, color: '#0F172A' }}>Keywords</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {pub.keywords.map(k => (
                  <Chip
                    key={k}
                    label={k}
                    sx={{ bgcolor: '#EFF6FF', color: '#1E40AF', fontWeight: 500, borderRadius: '6px' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Authors list */}
            {pub.authors.length > 0 && (
              <Box sx={{ mb: 3.5 }}>
                <Typography variant="h5" sx={{ mb: 1.5, color: '#0F172A' }}>Authors</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {pub.authors.map(a => (
                    <Chip
                      key={a}
                      label={a}
                      variant="outlined"
                      icon={<Users size={12} />}
                      sx={{ borderColor: '#E2E8F0', color: '#334155', fontWeight: 500, borderRadius: '6px', '& .MuiChip-icon': { color: '#64748B' } }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Funding info */}
            {pub.fundingStatus === 'seeking' && pub.fundingAmountNeeded && (
              <Alert
                severity="warning"
                sx={{ mb: 3.5, borderRadius: '10px', '& .MuiAlert-message': { width: '100%' } }}
              >
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                  Funding Needed: {pub.fundingAmountNeeded}
                </Typography>
                <Typography variant="body2">
                  This research is actively seeking funding. Contact the lead researcher to discuss investment opportunities.
                </Typography>
              </Alert>
            )}

            {/* Publication metadata */}
            <Box
              sx={{
                p: 2.5, bgcolor: '#F8FAFC', borderRadius: '10px',
                border: '1px solid #E2E8F0', mb: 3.5,
              }}
            >
              <Typography variant="overline" sx={{ color: '#64748B', mb: 1.5, display: 'block' }}>
                Publication Details
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Published</Typography>
                      <Typography variant="body2" fontWeight={600}>{publishedDate}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookOpen size={16} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Field</Typography>
                      <Typography variant="body2" fontWeight={600}>{pub.field}</Typography>
                    </Box>
                  </Box>
                </Grid>
                {pub.doi && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Link2 size={16} color="#64748B" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">DOI</Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: '#1E40AF', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                          {pub.doi}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>

          {/* ── Right: sidebar ─────────────────────────────────────────── */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Actions */}
              <Card sx={{ bgcolor: '#FFFFFF' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setCollabOpen(true)}
                    sx={{ bgcolor: '#1E40AF', '&:hover': { bgcolor: '#1E3A8A' }, mb: 1.5 }}
                  >
                    Request Collaboration
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Bookmark size={16} />}
                    sx={{ borderColor: '#E2E8F0', color: '#334155' }}
                  >
                    Save for Later
                  </Button>
                </CardContent>
              </Card>

              {/* About the lead researcher */}
              <Card sx={{ bgcolor: '#FFFFFF' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                    Lead Researcher
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                    onClick={() => navigate(`/researcher/profile/${author.id}`)}
                  >
                    <Avatar src={author.photo} sx={{ width: 48, height: 48, bgcolor: '#1E40AF', fontWeight: 700 }}>
                      {author.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={700} noWrap>{author.name}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>{author.institution}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                    {[
                      { value: author.publications, label: 'Pubs' },
                      { value: author.citations,   label: 'Cites' },
                      { value: author.hIndex,      label: 'h-index' },
                    ].map(s => (
                      <Box key={s.label} sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#1E40AF' }}>{s.value}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {author.expertise && author.expertise.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {author.expertise.slice(0, 4).map(e => (
                        <Chip
                          key={e}
                          label={e}
                          size="small"
                          sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 500, borderRadius: '6px', height: 24 }}
                        />
                      ))}
                    </Box>
                  )}

                  <Button
                    variant="text"
                    fullWidth
                    size="small"
                    onClick={() => navigate(`/researcher/profile/${author.id}`)}
                    endIcon={<ExternalLink size={14} />}
                    sx={{ mt: 1.5, color: '#1E40AF', fontWeight: 600 }}
                  >
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Related by field */}
              <Card sx={{ bgcolor: '#FFFFFF' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                    More in {pub.field}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {research
                      .filter(r => r.field === pub.field && r.id !== pub.id)
                      .slice(0, 3)
                      .map(rel => (
                        <Box
                          key={rel.id}
                          sx={{ cursor: 'pointer', '&:hover': { '& .rel-title': { color: '#1E40AF' } } }}
                          onClick={() => navigate(`/publication/${rel.id}`)}
                        >
                          <Typography
                            className="rel-title"
                            variant="caption"
                            fontWeight={600}
                            sx={{ display: 'block', color: '#334155', lineHeight: 1.4, transition: 'color 0.15s' }}
                          >
                            {rel.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rel.citations} citations
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Collaboration dialog */}
      <Dialog open={collabOpen} onClose={() => setCollabOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Request Collaboration
          <IconButton size="small" onClick={() => setCollabOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#EFF6FF', borderRadius: '8px' }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#1E40AF', fontWeight: 700, fontSize: '0.875rem' }}>
                {author.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={700}>{author.name}</Typography>
                <Typography variant="caption" color="text.secondary">{author.department}</Typography>
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
              multiline rows={4} size="small" fullWidth
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Explain why you'd like to collaborate…"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setCollabOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Send size={16} />}
            onClick={handleSendCollab}
            sx={{ bgcolor: '#1E40AF', '&:hover': { bgcolor: '#1E3A8A' } }}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </ResearcherLayout>
  );
}
