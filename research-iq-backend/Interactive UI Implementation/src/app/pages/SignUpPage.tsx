import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Landmark, ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';

const NAV  = '#1E40AF';
const NAVY = '#1E3A8A';
const EMLD = '#047857';
const TEXT = '#0F172A';

export function SignUpPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Nav */}
      <AppBar elevation={0} position="sticky" sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', color: TEXT }}>
        <Toolbar sx={{ maxWidth: 900, mx: 'auto', width: '100%', px: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <Logo size="md" onClick={() => navigate('/')} />

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="text"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/')}
            sx={{ color: '#64748B', fontWeight: 500 }}
          >
            Back to Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 10, px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={800} sx={{ color: TEXT, mb: 1.5 }}>
            Create an account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Researchers and funders register separately. Managers, department heads, and
            administrators are provisioned by your institution.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Researcher card */}
          <Card
            variant="outlined"
            onClick={() => navigate('/signup/researcher')}
            sx={{
              cursor: 'pointer', borderRadius: '14px', borderColor: '#E2E8F0',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              '&:hover': { borderColor: NAV, boxShadow: '0 4px 16px rgba(30,64,175,0.10)' },
            }}
          >
            <CardContent sx={{ p: 3.5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ flexShrink: 0 }}>
                <Logo size="lg" showText={false} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: TEXT, mb: 0.5 }}>Researcher</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Apply for verification. Your expertise profile is built from your indexed publications.
                </Typography>
              </Box>
              <ArrowRight size={20} color="#94A3B8" />
            </CardContent>
          </Card>

          {/* Funder card */}
          <Card
            variant="outlined"
            onClick={() => navigate('/signup/funder')}
            sx={{
              cursor: 'pointer', borderRadius: '14px', borderColor: '#E2E8F0',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              '&:hover': { borderColor: EMLD, boxShadow: '0 4px 16px rgba(4,120,87,0.10)' },
            }}
          >
            <CardContent sx={{ p: 3.5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ width: 52, height: 52, bgcolor: '#ECFDF5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Landmark size={26} color={EMLD} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: TEXT, mb: 0.5 }}>Funder / Investor</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Register your organisation to discover research seeking support. Applications are reviewed before activation.
                </Typography>
              </Box>
              <ArrowRight size={20} color="#94A3B8" />
            </CardContent>
          </Card>
        </Box>

        {/* Staff info */}
        <Box sx={{ mt: 4, p: 2.5, bgcolor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '10px' }}>
          <Typography variant="body2" sx={{ color: '#92400E' }}>
            <strong>Managers, department heads, and administrators</strong> — your account is provisioned
            by your institution administrator. Contact your research office for access.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Already have an account?{' '}
          <Box
            component="span"
            sx={{ color: NAV, fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/login')}
          >
            Log in
          </Box>
        </Typography>
      </Container>
    </Box>
  );
}
