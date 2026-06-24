import { useParams, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Brain, ArrowLeft, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ResearcherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { researchers, research } = useApp();

  const researcher = researchers.find(r => r.id === id);
  const researcherPapers = research.filter(r => r.researcherId === id);

  if (!researcher) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Typography variant="body1" color="text.secondary">Researcher not found</Typography>
      </Box>
    );
  }

  const initial = researcher.name.charAt(0).toUpperCase();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--md-background)' }}>
      {/* AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--md-outline-variant)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: '10px',
                background: 'linear-gradient(135deg, #1E40AF 0%, #047857 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Brain size={22} color="#fff" />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            Back
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 6 }, py: 6 }}>
        {/* Profile card */}
        <Card variant="outlined" sx={{ borderRadius: '20px', borderColor: 'rgba(0,0,0,0.08)', mb: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
              <Avatar
                sx={{
                  width: 112, height: 112, flexShrink: 0,
                  background: 'linear-gradient(135deg, #1E40AF 0%, #047857 100%)',
                  fontSize: '2.75rem', fontWeight: 700,
                }}
              >
                {initial}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mb: 0.75, fontSize: { xs: '1.75rem', md: '2.125rem' } }}
                >
                  {researcher.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: '1rem' }}>
                  {researcher.department}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {researcher.institution}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {researcher.expertise?.map(exp => (
                    <Chip
                      key={exp}
                      label={exp}
                      size="small"
                      sx={{
                        bgcolor: '#e8f0fe', color: '#1a3a8f',
                        fontWeight: 500, fontSize: '0.75rem', borderRadius: '8px',
                      }}
                    />
                  ))}
                </Box>

                <Grid container spacing={3} alignItems="center">
                  {[
                    { value: researcher.publications, label: 'Publications', color: '#1E40AF' },
                    { value: researcher.citations, label: 'Citations', color: '#047857' },
                    { value: researcher.hIndex, label: 'h-index', color: '#1E40AF' },
                  ].map((stat, i) => (
                    <Grid key={stat.label} size={{ xs: 6, sm: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: i > 0 ? 3 : 0 }}>
                        {i > 0 && (
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ height: 40, mr: 3, borderColor: 'rgba(0,0,0,0.1)' }}
                          />
                        )}
                        <Box>
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ color: stat.color, lineHeight: 1, fontSize: '1.875rem' }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {stat.label}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                  <Grid size={{ xs: 12, sm: 'auto' }}>
                    <Button
                      variant="contained"
                      startIcon={<Mail size={16} />}
                      sx={{
                        background: 'linear-gradient(135deg, #1E40AF 0%, #047857 100%)',
                        borderRadius: '20px', fontWeight: 600,
                        '&:hover': { background: 'linear-gradient(135deg, #1d55d0 0%, #128f3f 100%)' },
                      }}
                    >
                      Contact
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Publications */}
        <Card variant="outlined" sx={{ borderRadius: '20px', borderColor: 'rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3.5, fontSize: '1.25rem' }}>
              Recent Publications
            </Typography>

            {researcherPapers.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {researcherPapers.map((paper, i) => (
                  <Box key={paper.id}>
                    {i > 0 && <Divider sx={{ borderColor: 'var(--md-outline-variant)', my: 3 }} />}
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      sx={{ color: '#1E40AF', mb: 1, fontSize: '1rem' }}
                    >
                      {paper.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.7 }}>
                      {paper.abstract}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={`${paper.citations} citations`}
                        size="small"
                        sx={{ bgcolor: '#e8f5e9', color: '#0a6629', fontWeight: 500, borderRadius: '6px', fontSize: '0.75rem' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {paper.publicationDate}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No publications available</Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
