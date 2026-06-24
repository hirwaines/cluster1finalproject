import { useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import {
  FileDown, Edit, Users, TrendingUp, Award, BookOpen, Calendar,
  UserCheck, Sparkles, Link2, ExternalLink, Plus,
} from 'lucide-react';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';

export function MyProfile() {
  const navigate = useNavigate();
  const { user, research, researchers } = useApp();
  const [tab, setTab] = useState(0);

  if (!user) { navigate('/login'); return null; }

  const expertiseFreq = keywordFrequencyFromPublications(user.id, research);
  const myPublications = research.filter(r => r.researcherId === user.id);
  const myCollaborators = researchers.filter(r =>
    research.some(pub =>
      pub.collaborators?.includes(user.id) && pub.collaborators?.includes(r.id)
    )
  );

  const hasOrcid = !!user.orcidId;

  const fundingChip = (status?: string) => {
    if (status === 'funded')    return { label: 'Funded',          bg: '#ECFDF5', color: '#065F46' };
    if (status === 'seeking')   return { label: 'Seeking Funding', bg: '#FFFBEB', color: '#B45309' };
    if (status === 'completed') return { label: 'Completed',       bg: '#F1F5F9', color: '#334155' };
    return null;
  };

  return (
    <ResearcherLayout>
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 4 } }}>

        {/* ── Profile header ─────────────────────────────────────────── */}
        <Card sx={{ mb: 3, bgcolor: '#FFFFFF' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 96, height: 96, flexShrink: 0,
                  bgcolor: '#1E40AF', fontWeight: 700, fontSize: '2.5rem',
                }}
              >
                {user.name.charAt(0)}
              </Avatar>

              {/* Name + meta */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.75 }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#0F172A' }}>
                    {user.name}
                  </Typography>

                  {user.verified && (
                    <Chip
                      icon={<UserCheck size={13} />}
                      label="Verified"
                      size="small"
                      sx={{ bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 700, '& .MuiChip-icon': { color: '#065F46' } }}
                    />
                  )}

                  {user.accredited && (
                    <Chip
                      icon={<Award size={13} />}
                      label="Accredited"
                      size="small"
                      sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 600, '& .MuiChip-icon': { color: '#64748B' } }}
                    />
                  )}
                </Box>

                <Typography variant="body1" sx={{ color: '#475569', mb: 0.5, fontWeight: 500 }}>
                  {[user.position, user.department, user.institution].filter(Boolean).join(' · ')}
                </Typography>

                {/* ORCID badge */}
                {hasOrcid ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Box
                      sx={{
                        display: 'inline-flex', alignItems: 'center', gap: 0.75,
                        px: 1.5, py: 0.5, borderRadius: '6px',
                        bgcolor: '#F0FDF4', border: '1px solid #86EFAC',
                        cursor: 'pointer',
                        '&:hover': { borderColor: '#047857' },
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <Link2 size={14} color="#047857" />
                      <Typography variant="caption" fontWeight={700} sx={{ color: '#065F46', letterSpacing: '0.02em' }}>
                        ORCID
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#047857', fontFamily: 'monospace' }}>
                        {user.orcidId}
                      </Typography>
                      <ExternalLink size={12} color="#047857" />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Link2 size={14} />}
                      sx={{ borderColor: '#E2E8F0', color: '#64748B', fontSize: '0.75rem', height: 28 }}
                      onClick={() => navigate('/settings')}
                    >
                      Connect ORCID
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                <Button
                  variant="outlined"
                  startIcon={<FileDown size={16} />}
                  sx={{ borderColor: '#E2E8F0', color: '#334155' }}
                >
                  Export CV
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Edit size={16} />}
                  sx={{ bgcolor: '#1E40AF', '&:hover': { bgcolor: '#1E3A8A' } }}
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Stats row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { value: user.publications || 0, label: 'Publications', color: '#1E40AF', bg: '#EFF6FF' },
                { value: user.citations || 0,    label: 'Citations',    color: '#047857', bg: '#ECFDF5' },
                { value: user.hIndex || 0,       label: 'h-Index',      color: '#1E40AF', bg: '#EFF6FF' },
              ].map(s => (
                <Grid key={s.label} size={{ xs: 4 }}>
                  <Box sx={{ textAlign: 'center', py: 2, bgcolor: s.bg, borderRadius: '10px' }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: s.color, mb: 0.25 }}>
                      {s.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {s.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* AI-extracted expertise */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Typography variant="overline" sx={{ color: '#64748B', lineHeight: 1 }}>
                  Research Expertise
                </Typography>
                <Tooltip title="Expertise keywords are automatically extracted by AI from your indexed publications.">
                  <Box
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.5,
                      px: 1, py: 0.25, borderRadius: '5px',
                      bgcolor: '#F5F3FF', border: '1px solid #DDD6FE',
                      cursor: 'help',
                    }}
                  >
                    <Sparkles size={11} color="#7C3AED" />
                    <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: '#6D28D9', letterSpacing: '0.07em' }}>
                      AI DERIVED
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>

              {expertiseFreq.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {expertiseFreq.map(({ keyword, publicationCount }) => (
                    <Chip
                      key={keyword}
                      label={
                        <span>
                          {keyword}{' '}
                          <span style={{ opacity: 0.65, fontSize: '0.75em' }}>
                            ({publicationCount} pub{publicationCount !== 1 ? 's' : ''})
                          </span>
                        </span>
                      }
                      sx={{ bgcolor: '#EFF6FF', color: '#1E40AF', fontWeight: 500, borderRadius: '6px' }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No indexed publications yet.{' '}
                  <Box
                    component="span"
                    sx={{ color: '#1E40AF', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => navigate('/researcher/upload')}
                  >
                    Upload a paper to populate your expertise.
                  </Box>
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* ── Tabs ───────────────────────────────────────────────────── */}
        <Box sx={{ borderBottom: '1px solid #E2E8F0', mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': { fontWeight: 500, color: '#64748B', textTransform: 'none', fontSize: '0.9375rem' },
              '& .Mui-selected': { color: '#1E40AF', fontWeight: 700 },
              '& .MuiTabs-indicator': { bgcolor: '#1E40AF', height: 2 },
            }}
          >
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><BookOpen size={18} />Publications ({myPublications.length})</Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Users size={18} />Collaborators ({myCollaborators.length})</Box>} />
          </Tabs>
        </Box>

        {/* ── Publications tab ────────────────────────────────────────── */}
        {tab === 0 && (
          <Box>
            {myPublications.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {myPublications.map(pub => {
                  const f = fundingChip(pub.fundingStatus);
                  return (
                    <Card
                      key={pub.id}
                      sx={{
                        bgcolor: '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                        '&:hover': { borderColor: '#1E40AF', boxShadow: '0 4px 12px rgba(15,23,42,0.08)' },
                      }}
                      onClick={() => navigate(`/publication/${pub.id}`)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{ color: '#1E40AF', fontWeight: 700, lineHeight: 1.3 }}
                          >
                            {pub.title}
                          </Typography>
                          {f && (
                            <Chip
                              label={f.label}
                              size="small"
                              sx={{ bgcolor: f.bg, color: f.color, fontWeight: 600, borderRadius: '6px', flexShrink: 0 }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2, lineHeight: 1.7,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}
                        >
                          {pub.abstract}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                          {pub.keywords.slice(0, 4).map(k => (
                            <Chip
                              key={k}
                              label={k}
                              size="small"
                              sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 500, borderRadius: '4px', height: 22, fontSize: '0.6875rem' }}
                            />
                          ))}
                        </Box>

                        <Divider sx={{ mb: 1.5 }} />

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          {[
                            { icon: Calendar,   value: new Date(pub.publicationDate).getFullYear() },
                            { icon: TrendingUp, value: `${pub.citations} citations` },
                            { icon: Users,      value: `${pub.authors.length} authors` },
                          ].map(m => (
                            <Box key={String(m.value)} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <m.icon size={14} color="#94A3B8" />
                              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                                {m.value}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            ) : (
              <Card sx={{ bgcolor: '#FFFFFF' }}>
                <CardContent sx={{ p: 8, textAlign: 'center' }}>
                  <BookOpen size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>No publications yet</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start sharing your research with the community.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    onClick={() => navigate('/researcher/upload')}
                    sx={{ bgcolor: '#1E40AF', '&:hover': { bgcolor: '#1E3A8A' } }}
                  >
                    Share your first research
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* ── Collaborators tab ───────────────────────────────────────── */}
        {tab === 1 && (
          myCollaborators.length > 0 ? (
            <Grid container spacing={2}>
              {myCollaborators.map(c => (
                <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      bgcolor: '#FFFFFF', cursor: 'pointer', height: '100%',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      '&:hover': { borderColor: '#1E40AF', boxShadow: '0 4px 12px rgba(15,23,42,0.08)' },
                    }}
                    onClick={() => navigate(`/researcher/profile/${c.id}`)}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar
                        sx={{ width: 64, height: 64, bgcolor: '#1E40AF', fontWeight: 700, fontSize: '1.5rem', mx: 'auto', mb: 1.5 }}
                      >
                        {c.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>{c.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {c.department}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center', mb: 2 }}>
                        {c.expertise?.slice(0, 2).map(e => (
                          <Chip key={e} label={e} size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', height: 22, fontSize: '0.6875rem', borderRadius: '4px' }} />
                        ))}
                      </Box>
                      <Grid container spacing={1}>
                        {[
                          { value: c.publications, label: 'Pubs', color: '#1E40AF', bg: '#EFF6FF' },
                          { value: c.citations,    label: 'Cites', color: '#047857', bg: '#ECFDF5' },
                          { value: c.hIndex,       label: 'h-idx', color: '#1E40AF', bg: '#EFF6FF' },
                        ].map(s => (
                          <Grid key={s.label} size={{ xs: 4 }}>
                            <Box sx={{ textAlign: 'center', py: 1, bgcolor: s.bg, borderRadius: '6px' }}>
                              <Typography variant="body2" fontWeight={700} sx={{ color: s.color }}>{s.value}</Typography>
                              <Typography sx={{ fontSize: '0.625rem', color: '#64748B', textTransform: 'uppercase' }}>{s.label}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ bgcolor: '#FFFFFF' }}>
              <CardContent sx={{ p: 8, textAlign: 'center' }}>
                <Users size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                <Typography variant="h6" sx={{ mb: 1 }}>No collaborators yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Connect with researchers in your field.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/collaborators')}
                  sx={{ bgcolor: '#1E40AF', '&:hover': { bgcolor: '#1E3A8A' } }}
                >
                  Find Collaborators
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </Container>
    </ResearcherLayout>
  );
}
