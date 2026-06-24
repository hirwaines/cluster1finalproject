import { useNavigate } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { Brain, ArrowLeft, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ProjectsBrowse() {
  const navigate = useNavigate();
  const { research, researchers } = useApp();

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
            <Typography variant="subtitle1" fontWeight={700}>Browse Projects</Typography>
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

      <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 6 }, py: 6 }}>
        {/* Page header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ color: '#111827', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}
          >
            Research Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore and support active research initiatives across Rwanda
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {research.map(project => {
            const lead = researchers.find(r => r.id === project.researcherId);
            return (
              <Grid key={project.id} size={{ xs: 12, md: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    borderRadius: '16px',
                    borderColor: 'rgba(0,0,0,0.08)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      borderColor: '#1E40AF',
                      boxShadow: '0px 4px 20px rgba(37,99,235,0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ color: '#1E40AF', mb: 1.5, lineHeight: 1.4, fontSize: '1.125rem' }}
                    >
                      {project.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2.5, lineHeight: 1.7 }}
                    >
                      {project.abstract}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2.5 }}>
                      {project.keywords.map(k => (
                        <Chip
                          key={k}
                          label={k}
                          size="small"
                          sx={{
                            bgcolor: '#e8f0fe', color: '#1a3a8f',
                            fontWeight: 500, fontSize: '0.75rem',
                            borderRadius: '8px',
                          }}
                        />
                      ))}
                    </Box>

                    {lead && (
                      <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.1px' }}>
                        Lead: <Box component="span" fontWeight={600} sx={{ color: 'text.primary' }}>{lead.name}</Box>
                        {' '}·{' '}{lead.department}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<DollarSign size={16} />}
                      sx={{
                        background: 'linear-gradient(135deg, #1E40AF 0%, #047857 100%)',
                        borderRadius: '20px',
                        fontWeight: 600,
                        '&:hover': { background: 'linear-gradient(135deg, #1d55d0 0%, #128f3f 100%)' },
                      }}
                    >
                      Fund Project
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
