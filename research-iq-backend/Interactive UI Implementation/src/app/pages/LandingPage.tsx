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
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import {
  TrendingUp, Network, Search, BookOpen,
  DollarSign, MapPin, CheckCircle, Users,
} from 'lucide-react';
import { Logo } from '../components/Logo';

const NAV   = '#1E40AF';
const NAVY  = '#1E3A8A';
const EMLD  = '#047857';
const TEXT  = '#0F172A';
const MUTED = '#475569';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }}>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2E8F0',
          color: TEXT,
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 2, sm: 3 } }}>
          {/* Logo — same component used in authenticated AppShell */}
          <Logo size="md" onClick={() => navigate('/')} />

          {/* Nav links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 4 }}>
            {['Features', 'Who it\'s for', 'How it works'].map(link => (
              <Typography
                key={link}
                component="a"
                href={`#${link.toLowerCase().replace(/[\s']/g, '-')}`}
                variant="body2"
                fontWeight={500}
                sx={{ color: MUTED, textDecoration: 'none', transition: 'color 0.15s', '&:hover': { color: NAV } }}
              >
                {link}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="text" onClick={() => navigate('/login')} sx={{ color: TEXT, fontWeight: 500 }}>
              Log in
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              sx={{ bgcolor: NAV, borderRadius: '8px', px: 2.5, '&:hover': { bgcolor: NAVY } }}
            >
              Get started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 10, md: 16 }, px: { xs: 3, sm: 6 } }}>
        <Grid container spacing={8} alignItems="center">
          {/* Left */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Chip
              icon={<MapPin size={13} />}
              label="Built for Rwanda's research ecosystem"
              sx={{
                mb: 4, bgcolor: '#EFF6FF', color: NAV,
                fontWeight: 500, fontSize: '0.8125rem',
                '& .MuiChip-icon': { color: NAV },
                border: '1px solid #BFDBFE',
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.25rem', lg: '3.75rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
                color: TEXT,
                mb: 3,
              }}
            >
              One platform for{' '}
              <Box component="span" sx={{ display: 'block', color: NAV }}>
                every research institution
              </Box>
            </Typography>

            <Typography variant="body1" sx={{ color: MUTED, lineHeight: 1.8, mb: 3, fontSize: '1.0625rem' }}>
              ResearchIQ connects researchers, institutions, and funders across Rwanda — whether you are a
              university, a government research body, or a private research organisation. Collaborate, publish,
              and secure funding in one place.
            </Typography>

            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                'Verified researcher profiles and publication indexing',
                'Cross-institution collaboration and funding discovery',
                'Analytics and reporting for institutional leadership',
              ].map(item => (
                <Box key={item} component="li" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircle size={20} color={EMLD} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography variant="body1" sx={{ color: '#334155' }}>{item}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ bgcolor: NAV, borderRadius: '8px', px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600, '&:hover': { bgcolor: NAVY } }}
              >
                Create your profile
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: '8px', px: 4, py: 1.5, fontSize: '1rem', fontWeight: 500,
                  borderColor: '#E2E8F0', color: '#334155',
                  '&:hover': { borderColor: NAV, color: NAV, bgcolor: '#EFF6FF' },
                }}
              >
                Sign in
              </Button>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, pt: 4, borderTop: '1px solid #E2E8F0' }}>
              {[
                { value: '500+', label: 'Researchers', color: NAV },
                { value: '1,200+', label: 'Publications', color: EMLD },
                { value: '30+', label: 'Institutions', color: NAV },
                { value: '$8M+', label: 'Funding facilitated', color: EMLD },
              ].map((stat, i) => (
                <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {i > 0 && <Divider orientation="vertical" flexItem sx={{ height: 32 }} />}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={800} sx={{ color: stat.color, lineHeight: 1 }}>{stat.value}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{stat.label}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right: hero image */}
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'center', position: 'relative' }}>
            <Box sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(15,23,42,0.14)', width: '100%', maxHeight: 520 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&h=600&fit=crop&crop=center"
                alt="Researchers collaborating"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
            <Chip
              label="🇷🇼 Rwanda-based"
              sx={{ position: 'absolute', top: -10, right: -10, bgcolor: EMLD, color: '#fff', fontWeight: 700, fontSize: '0.8125rem', boxShadow: '0 4px 12px rgba(4,120,87,0.35)' }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* ── Purpose strip ──────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: NAV, py: 9 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', color: '#fff', px: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            Research in Rwanda deserves better infrastructure
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.88, lineHeight: 1.85, fontSize: '1.0625rem', maxWidth: 680, mx: 'auto' }}>
            Across universities, government agencies, and private research bodies, valuable knowledge is produced
            every year — yet researchers work in silos, funding opportunities go unnoticed, and cross-institution
            collaboration remains difficult. ResearchIQ is built to change that.
          </Typography>
        </Container>
      </Box>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <Box id="features" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight={700} sx={{ color: TEXT, mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Everything in one platform
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', fontSize: '1.0625rem' }}>
              From researcher profiles to funding discovery — ResearchIQ gives every stakeholder the tools they need.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { icon: <Search size={22} />, title: 'Researcher Directory', desc: 'Search and discover verified researchers across institutions by field, department, or publication record.', accent: NAV, bg: '#EFF6FF' },
              { icon: <Users size={22} />, title: 'Collaboration Matching', desc: 'Find researchers with complementary expertise and send collaboration requests directly through the platform.', accent: EMLD, bg: '#ECFDF5' },
              { icon: <BookOpen size={22} />, title: 'Publication Management', desc: 'Submit, index, and showcase research publications. Build a verified profile backed by real academic output.', accent: NAV, bg: '#EFF6FF' },
              { icon: <DollarSign size={22} />, title: 'Funding Connections', desc: 'Funders discover research projects seeking support. Researchers get matched to relevant funding opportunities.', accent: EMLD, bg: '#ECFDF5' },
              { icon: <TrendingUp size={22} />, title: 'Research Analytics', desc: 'Track citations, publication trends, and institutional performance. Leadership gets a clear picture of research output.', accent: NAV, bg: '#EFF6FF' },
              { icon: <Network size={22} />, title: 'Institutional Oversight', desc: 'Department heads and research managers can approve publications, manage accreditations, and monitor activity.', accent: EMLD, bg: '#ECFDF5' },
            ].map(feat => (
              <Grid key={feat.title} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%', borderRadius: '14px', bgcolor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    '&:hover': { borderColor: feat.accent, boxShadow: `0 4px 16px rgba(15,23,42,0.08)` },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '10px', bgcolor: feat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5, color: feat.accent }}>
                      {feat.icon}
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: TEXT, fontSize: '1.0625rem' }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {feat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Who it's for ───────────────────────────────────────────────── */}
      <Box id="who" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight={700} sx={{ color: TEXT, mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Built for every role in research
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.0625rem' }}>
              One platform, tailored experiences for each stakeholder — across any type of institution.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { role: 'Researchers', icon: '🔬', desc: 'Build your verified profile, publish your work, find collaborators, and track your academic impact.' },
              { role: 'Department Heads', icon: '🏛️', desc: "Monitor your department's research output, manage researcher profiles, and report on performance." },
              { role: 'Research Managers', icon: '📊', desc: 'Oversee institutional research activities, generate reports, and coordinate cross-department initiatives.' },
              { role: 'Funders', icon: '💼', desc: 'Discover research projects aligned with your priorities and connect directly with research leads.' },
            ].map(item => (
              <Grid key={item.role} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%', p: 1, borderRadius: '14px', borderColor: '#E2E8F0',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    '&:hover': { borderColor: NAV, boxShadow: '0 4px 16px rgba(30,64,175,0.10)' },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: '2.5rem', mb: 2, lineHeight: 1 }}>{item.icon}</Typography>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, fontSize: '1.0625rem', color: TEXT }}>
                      {item.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
            Suitable for universities, government research bodies, private research organisations, and national councils.
          </Typography>
        </Container>
      </Box>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <Box id="how-it-works" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" fontWeight={700} sx={{ color: TEXT, mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              How it works
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.0625rem' }}>
              Getting started takes minutes.
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {[
              { step: '01', title: 'Apply & get verified', desc: 'Submit your researcher application with your academic credentials and publications. An administrator reviews and verifies your profile.' },
              { step: '02', title: 'Build your presence', desc: 'Your expertise profile is built from your indexed publications. Connect with colleagues and join the national research network.' },
              { step: '03', title: 'Collaborate & grow', desc: 'Send and receive collaboration requests, respond to funding opportunities, and track your research impact over time.' },
            ].map(item => (
              <Grid key={item.step} size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography sx={{ fontSize: '5rem', fontWeight: 900, color: 'rgba(30,64,175,0.10)', lineHeight: 1, mb: 2 }}>
                    {item.step}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, color: TEXT, fontSize: '1.25rem' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: NAVY }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', px: 3 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#fff', mb: 2, fontSize: { xs: '1.875rem', md: '2.5rem' } }}>
            Ready to join Rwanda's research network?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, lineHeight: 1.85, maxWidth: 560, mx: 'auto' }}>
            Whether you are a researcher, an institution administrator, or a funder — ResearchIQ gives you the
            tools to connect, collaborate, and contribute to Rwanda's knowledge economy.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ bgcolor: '#FFFFFF', color: NAVY, borderRadius: '8px', px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700, '&:hover': { bgcolor: '#EFF6FF' } }}
            >
              Create your account
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: '8px', px: 4, py: 1.5, fontSize: '1rem', fontWeight: 500,
                borderColor: 'rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.85)',
                '&:hover': { borderColor: '#fff', color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Sign in
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Box component="footer" sx={{ bgcolor: '#080E1C', color: '#fff', py: 8 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 6 } }}>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2, cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: NAV, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FlaskConical size={16} color="#fff" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  <Typography variant="subtitle2" fontWeight={700}>Research</Typography>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#93C5FD' }}>IQ</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                Rwanda's research intelligence platform — connecting researchers, institutions, and funders.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
                <MapPin size={12} color="rgba(255,255,255,0.35)" />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>Kigali, Rwanda</Typography>
              </Box>
            </Grid>

            {[
              { title: 'Platform', links: ['Researcher profiles', 'Publication index', 'Collaboration network', 'Funding opportunities'] },
              { title: 'Institution types', links: ['Universities', 'Government research bodies', 'Private research organisations', 'National councils'] },
              { title: 'Support', links: ['About ResearchIQ', 'Contact us', 'Privacy policy', 'Terms of use'] },
            ].map(col => (
              <Grid key={col.title} size={{ xs: 6, md: 3 }}>
                <Typography variant="caption" fontWeight={600} sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.8px', mb: 2, display: 'block', textTransform: 'uppercase' }}>
                  {col.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {col.links.map(link => (
                    <Typography key={link} variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'color 0.15s', '&:hover': { color: 'rgba(255,255,255,0.75)' } }}>
                      {link}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 4 }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>
              © 2026 ResearchIQ. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>
              Advancing research in Rwanda 🇷🇼
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
