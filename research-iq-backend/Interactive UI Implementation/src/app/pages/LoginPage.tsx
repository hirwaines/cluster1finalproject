import { useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Chip from '@mui/material/Chip';
import { ArrowLeft, Lock, Eye, EyeOff, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../context/AppContext';
import { toast } from 'sonner';

const NAV  = '#1E40AF';
const NAVY = '#1E3A8A';
const EMLD = '#047857';
const TEXT = '#0F172A';

function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'funder': return '/funder/dashboard';
    case 'manager': return '/manager/dashboard';
    case 'department_head': return '/department/dashboard';
    default: return '/feed';
  }
}

const DEMO_ACCOUNTS = [
  { role: 'Researcher', label: 'Dr. Sarah Chen', email: 'sarah.chen@auca.edu', password: 'password', desc: 'Feed, profile, collaborators, analytics' },
  { role: 'Department Head', label: 'Dr. Claver Ndahayo', email: 'department.head@auca.edu', password: 'password', desc: 'Department dashboard — Academic Affairs' },
  { role: 'Research Manager', label: 'Assoc. Prof. Kayigema Jacques', email: 'manager@researchiq.com', password: 'manager', desc: 'Institution metrics and reports' },
  { role: 'Funder', label: 'East Africa Research Impact Fund', email: 'funder@impact.org', password: 'funder', desc: 'Discover projects, express interest, RFPs' },
  { role: 'Admin', label: 'Admin User', email: 'admin@researchiq.com', password: 'admin', desc: 'Verifications, users, data import (MFA: 123456)' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login, authLoading } = useApp();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPw, setShowPw]             = useState(false);
  const [mfaStep, setMfaStep]           = useState(false);
  const [mfaCode, setMfaCode]           = useState('');
  const [pendingUser, setPendingUser]   = useState<import('../context/AppContext').User | null>(null);
  const [forgotOpen, setForgotOpen]     = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [demoOpen, setDemoOpen]         = useState(false);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { toast.error('Please enter your email and password.'); return; }
    const result = await login(email, password);
    if (!result) { toast.error('Invalid email or password.'); return; }
    if (result.role === 'admin') { setPendingUser(result); setMfaStep(true); toast.info('MFA code sent. Demo code: 123456'); }
    else { toast.success('Welcome back!'); navigate(dashboardPathForRole(result.role)); }
  };

  const handleMfa = () => {
    if (mfaCode === '123456') { toast.success('MFA verified. Welcome back!'); navigate(dashboardPathForRole(pendingUser!.role)); }
    else toast.error('Invalid MFA code. Try again.');
  };

  const quickLogin = async (dem: typeof DEMO_ACCOUNTS[0]) => {
    setDemoOpen(false);
    const result = await login(dem.email, dem.password);
    if (!result) { toast.error('Login failed — please try manually.'); return; }
    if (result.role === 'admin') { setPendingUser(result); setMfaStep(true); toast.info('MFA required. Demo code: 123456'); }
    else { toast.success('Signed in!'); navigate(dashboardPathForRole(result.role)); }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>

      {/* Back */}
      <Box sx={{ width: '100%', maxWidth: 440, mb: 2 }}>
        <Button
          variant="text"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/')}
          sx={{ color: '#64748B', fontWeight: 500, px: 0 }}
        >
          Back to Home
        </Button>
      </Box>

      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: '16px', boxShadow: '0 8px 32px rgba(15,23,42,0.10)', border: '1px solid #E2E8F0' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Logo size="lg" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {mfaStep ? 'Two-factor authentication' : 'Sign in to your account'}
            </Typography>
          </Box>

          {/* ── Login form ─────────────────────────────────── */}
          {!mfaStep ? (
            <Box component="form" onSubmit={doLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@auca.edu"
                required
                size="small"
                fullWidth
              />

              <TextField
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPw(v => !v)} edge="end">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setForgotOpen(true)}
                  sx={{ color: NAV, fontWeight: 500, px: 0, minWidth: 0 }}
                >
                  Forgot password?
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={authLoading}
                startIcon={<Lock size={16} />}
                sx={{ bgcolor: NAV, '&:hover': { bgcolor: NAVY }, borderRadius: '8px', py: 1.25, fontWeight: 600 }}
              >
                {authLoading ? 'Signing in…' : 'Sign In'}
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Don't have an account?{' '}
                <Box
                  component="span"
                  sx={{ color: NAV, fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </Box>
              </Typography>
            </Box>
          ) : (
            /* ── MFA step ──────────────────────────────────── */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 64, height: 64, bgcolor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <Shield size={32} color={NAV} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Enter the 6-digit code sent to your registered device.
                </Typography>
              </Box>

              <TextField
                label="Authentication Code"
                value={mfaCode}
                onChange={e => setMfaCode(e.target.value)}
                placeholder="000000"
                inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.25rem' } }}
                size="small"
                fullWidth
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleMfa}
                startIcon={<Shield size={16} />}
                sx={{ bgcolor: NAV, '&:hover': { bgcolor: NAVY }, borderRadius: '8px', py: 1.25, fontWeight: 600 }}
              >
                Verify Code
              </Button>

              <Button
                variant="text"
                fullWidth
                onClick={() => { setMfaStep(false); setPendingUser(null); setMfaCode(''); }}
                sx={{ color: '#64748B' }}
              >
                ← Back to login
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Demo access */}
      <Button
        variant="text"
        size="small"
        startIcon={<ChevronDown size={13} />}
        onClick={() => setDemoOpen(true)}
        sx={{ mt: 3, color: '#94A3B8', fontSize: '0.75rem' }}
      >
        Demo Access
      </Button>

      {/* ── Forgot Password Dialog ──────────────────────────────────── */}
      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle fontWeight={700}>Reset your password</DialogTitle>
        <DialogContent>
          {!recoverySent ? (
            <Box component="form" onSubmit={e => { e.preventDefault(); if (!recoveryEmail.trim()) { toast.error('Enter your email'); return; } setRecoverySent(true); toast.success('Reset link sent.'); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Enter your registered email and we'll send a reset link.
              </Typography>
              <TextField
                label="Email address"
                type="email"
                value={recoveryEmail}
                onChange={e => setRecoveryEmail(e.target.value)}
                required
                size="small"
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button variant="outlined" fullWidth onClick={() => setForgotOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: NAV, '&:hover': { bgcolor: NAVY } }}>Send link</Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <Box sx={{ width: 60, height: 60, bgcolor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={30} color={EMLD} />
              </Box>
              <Typography variant="h6" fontWeight={700}>Reset link sent!</Typography>
              <Typography variant="body2" color="text.secondary">
                Check your email at <strong>{recoveryEmail}</strong>. The link expires in 30 minutes.
              </Typography>
              <Button variant="contained" fullWidth onClick={() => { setForgotOpen(false); setRecoverySent(false); setRecoveryEmail(''); }} sx={{ bgcolor: NAV, '&:hover': { bgcolor: NAVY } }}>
                Done
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Demo Accounts Dialog ────────────────────────────────────── */}
      <Dialog open={demoOpen} onClose={() => setDemoOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Logo size="sm" showText={false} />
            Demo Accounts
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click any account to sign in instantly and explore that role.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <Box
                key={acc.email}
                onClick={() => quickLogin(acc)}
                sx={{
                  p: 1.75, borderRadius: '10px', bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0', cursor: 'pointer',
                  transition: 'border-color 0.15s, background-color 0.15s',
                  '&:hover': { borderColor: NAV, bgcolor: '#EFF6FF' },
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Chip label={acc.role} size="small" sx={{ bgcolor: '#EFF6FF', color: NAV, fontWeight: 700, fontSize: '0.6875rem', height: 20, mb: 0.5, borderRadius: '4px' }} />
                  <Typography variant="body2" fontWeight={600} sx={{ color: TEXT }}>{acc.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{acc.desc}</Typography>
                </Box>
                <Box sx={{ px: 1.5, py: 0.5, bgcolor: NAV, borderRadius: '6px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0, ml: 1 }}>
                  Enter
                </Box>
              </Box>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Additional researchers: claver.ndahayo@auca.edu · kelvin.onongha@auca.edu — password: <strong>password</strong>
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
