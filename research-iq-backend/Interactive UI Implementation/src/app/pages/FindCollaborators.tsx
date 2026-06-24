import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { Search, Send, MessageCircle, UserCheck, X, Sparkles } from 'lucide-react';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { useApp } from '../context/AppContext';
import type { User } from '../context/AppContext';
import { getCollaboratorMatch } from '../utils/collaborationMatch';
import { toast } from 'sonner';
import { getCollaborationRecommendations } from '../api/ai';
import type { CollabRecommendation } from '../api/ai';

export function FindCollaborators() {
  const navigate = useNavigate();
  const { user, researchers, research, openChatWith, sendCollaborationRequest } = useApp();

  const [query,      setQuery]      = useState('');
  const [department, setDepartment] = useState('all');
  const [target,     setTarget]     = useState<User | null>(null);
  const [colType,    setColType]    = useState('joint-paper');
  const [months,     setMonths]     = useState('6');
  const [message,    setMessage]    = useState('');

  // AI recommendations from backend (AI service 8002)
  const [aiRecs, setAiRecs] = useState<CollabRecommendation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setAiLoading(true);
    getCollaborationRecommendations(user.id, 6)
      .then(setAiRecs)
      .catch(() => {}) // silent fallback — show computed matches below
      .finally(() => setAiLoading(false));
  }, [user?.id]);

  if (!user || user.role !== 'researcher') return null;

  const departments = useMemo(() => {
    const set = new Set<string>();
    researchers.filter(r => r.role === 'researcher').forEach(r => r.department && set.add(r.department));
    return ['all', ...[...set].sort()];
  }, [researchers]);

  const ranked = useMemo(() => {
    return researchers
      .filter(r => r.role === 'researcher' && r.id !== user.id)
      .map(r => {
        const { score, explanation } = getCollaboratorMatch(user.id, r.id, research);
        return { ...r, matchScore: score, matchExplanation: explanation };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [researchers, user.id, research]);

  const filtered = ranked.filter(r => {
    const q = query.toLowerCase();
    const deptOk = department === 'all' || r.department === department;
    const queryOk = !q || r.name.toLowerCase().includes(q) || (r.department ?? '').toLowerCase().includes(q);
    return deptOk && queryOk;
  });

  const sendRequest = () => {
    if (!target || !message.trim()) { toast.error('Please write a message'); return; }
    sendCollaborationRequest({
      type: 'collaboration',
      toUserId: target.id,
      message,
      collaborationType: colType,
      timeline: `${months} months`,
    });
    toast.success(`Request sent to ${target.name}`);
    setTarget(null);
    setMessage('');
    setTimeout(() => navigate('/requests', { state: { tab: 'sent' } }), 1200);
  };

  const matchColor = (score: number) =>
    score >= 80 ? '#065F46' : score >= 60 ? '#1E40AF' : '#64748B';

  const matchBg = (score: number) =>
    score >= 80 ? '#ECFDF5' : score >= 60 ? '#EFF6FF' : '#F8FAFC';

  return (
    <ResearcherLayout>
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
        {/* Page header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.75, color: '#0F172A' }}>
            Find Collaborators
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-ranked by keyword overlap with your published research.{' '}
            <Box
              component="span"
              sx={{ color: '#1E40AF', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              onClick={() => navigate('/requests', { state: { tab: 'sent' } })}
            >
              Track sent requests →
            </Box>
          </Typography>
        </Box>

        {/* AI Recommendations panel — from AI service 8002 */}
        {(aiRecs.length > 0 || aiLoading) && (
          <Box sx={{ mb: 4, p: 2.5, bgcolor: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Sparkles size={18} color="#1E40AF" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E3A8A' }}>
                AI-Recommended Collaborators
              </Typography>
              <Box sx={{ ml: 'auto', px: 1, py: 0.25, bgcolor: '#1E40AF', borderRadius: '6px', color: '#fff', fontSize: '0.6875rem', fontWeight: 600 }}>
                AI Service
              </Box>
            </Box>
            {aiLoading ? (
              <Typography variant="caption" sx={{ color: '#3B82F6', display: 'block' }}>
                Analysing collaboration compatibility…
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {aiRecs.slice(0, 5).map(rec => {
                  const researcher = researchers.find(r => r.id === rec.researcherId);
                  if (!researcher) return null;
                  return (
                    <Box
                      key={rec.researcherId}
                      onClick={() => navigate(`/researcher/profile/${rec.researcherId}`)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#fff',
                        borderRadius: '8px', border: '1px solid #BFDBFE', cursor: 'pointer',
                        '&:hover': { borderColor: '#1E40AF', boxShadow: '0 2px 8px rgba(30,64,175,0.12)' },
                        transition: 'all 0.15s',
                      }}
                    >
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>
                        {researcher.name.charAt(0)}
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{researcher.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700 }}>{Math.round(rec.compatibilityScore * 100)}% match</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by name or department…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#94A3B8" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Department</InputLabel>
            <Select value={department} onChange={e => setDepartment(e.target.value)} label="Department">
              {departments.map(d => (
                <MenuItem key={d} value={d}>
                  {d === 'all' ? 'All departments' : d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Results count */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          {filtered.length} researcher{filtered.length !== 1 ? 's' : ''} found
        </Typography>

        {/* Collaborator cards */}
        {filtered.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map(c => (
              <Card
                key={c.id}
                sx={{
                  bgcolor: '#FFFFFF',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  '&:hover': { borderColor: '#1E40AF', boxShadow: '0 4px 12px rgba(15,23,42,0.08)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                    {/* Left: researcher info */}
                    <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 0 }}>
                      <Avatar
                        sx={{
                          width: 56, height: 56, flexShrink: 0,
                          bgcolor: '#1E40AF', fontWeight: 700, fontSize: '1.25rem',
                        }}
                      >
                        {c.name.charAt(0)}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        {/* Name + verified */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                          <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>
                            {c.name}
                          </Typography>
                          {c.verified && (
                            <Chip
                              icon={<UserCheck size={12} />}
                              label="Verified"
                              size="small"
                              sx={{ bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 600, height: 22, fontSize: '0.6875rem', borderRadius: '4px', '& .MuiChip-icon': { color: '#065F46' } }}
                            />
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {c.position || c.department} · {c.institution}
                        </Typography>

                        {/* Match score */}
                        <Box sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.75 }}>
                            <Typography
                              sx={{ fontSize: '1.75rem', fontWeight: 700, color: matchColor(c.matchScore), lineHeight: 1 }}
                            >
                              {c.matchScore}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              compatibility
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={c.matchScore}
                            sx={{
                              height: 5, borderRadius: 3,
                              bgcolor: '#E2E8F0',
                              '& .MuiLinearProgress-bar': { bgcolor: matchColor(c.matchScore) },
                            }}
                          />
                        </Box>

                        {/* Explanation */}
                        <Box sx={{ p: 1.5, bgcolor: matchBg(c.matchScore), borderRadius: '8px', mb: 1.5 }}>
                          <Typography variant="caption" sx={{ color: matchColor(c.matchScore), fontWeight: 500, lineHeight: 1.5 }}>
                            {c.matchExplanation}
                          </Typography>
                        </Box>

                        {/* Keywords */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                          {research
                            .filter(p => p.researcherId === c.id)
                            .flatMap(p => p.keywords)
                            .slice(0, 5)
                            .map(k => (
                              <Chip
                                key={`${k}-${c.id}`}
                                label={k}
                                size="small"
                                sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 500, borderRadius: '4px', height: 22, fontSize: '0.6875rem' }}
                              />
                            ))}
                        </Box>
                      </Box>
                    </Box>

                    {/* Right: actions */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 168, justifyContent: 'flex-start', pt: 0.5 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/researcher/profile/${c.id}`)}
                        sx={{ bgcolor: '#1E40AF', '&:hover': { bgcolor: '#1E3A8A' } }}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Send size={14} />}
                        onClick={() => { setTarget(c); setMessage(''); }}
                        sx={{ borderColor: '#1E40AF', color: '#1E40AF', '&:hover': { bgcolor: '#EFF6FF' } }}
                      >
                        Request Collab
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<MessageCircle size={14} />}
                        onClick={() => openChatWith(c.id)}
                        sx={{ color: '#64748B', '&:hover': { bgcolor: '#F8FAFC' } }}
                      >
                        Message
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Card sx={{ bgcolor: '#FFFFFF' }}>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Search size={40} color="#CBD5E1" style={{ marginBottom: 12 }} />
              <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>No matches found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or department filter.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Collaboration Request Dialog */}
      <Dialog
        open={!!target}
        onClose={() => setTarget(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Send Collaboration Request
          <IconButton size="small" onClick={() => setTarget(null)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {target && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
              {/* Recipient */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#EFF6FF', borderRadius: '8px' }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#1E40AF', fontWeight: 700, fontSize: '0.875rem' }}>
                  {target.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={700}>{target.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {target.department} · {target.institution}
                  </Typography>
                </Box>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Collaboration Type</InputLabel>
                <Select value={colType} onChange={e => setColType(e.target.value)} label="Collaboration Type">
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
                value={months}
                onChange={e => setMonths(e.target.value)}
                inputProps={{ min: 1, max: 36 }}
                fullWidth
              />

              <TextField
                label="Message *"
                multiline rows={4} size="small" fullWidth
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Explain why you'd like to collaborate and what you bring to the partnership…"
              />

              <Box sx={{ bgcolor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '8px', p: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#92400E' }}>
                  Track this request under <strong>Requests → My Applications</strong>.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setTarget(null)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Send size={16} />}
            onClick={sendRequest}
            sx={{ bgcolor: '#1E40AF', '&:hover': { bgcolor: '#1E3A8A' } }}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </ResearcherLayout>
  );
}
