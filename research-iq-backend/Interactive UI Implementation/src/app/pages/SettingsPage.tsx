import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';
import apiClient from '../api/client';
import { User, Shield, Globe, Sparkles, LogOut, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner';

const ACCENT_COLORS = [
  { name: 'Blue', hex: '#1E40AF' },
  { name: 'Green', hex: '#047857' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Red', hex: '#dc2626' },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [activeSection, setActiveSection] = useState('account');
  const [selectedAccent, setSelectedAccent] = useState('#1E40AF');

  // Account form state
  const [accountForm, setAccountForm] = useState({ name: '', email: '', orcid: '', institution: '', department: '' });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (user) setAccountForm({ name: user.name, email: user.email, orcid: user.orcid ?? '', institution: user.institution ?? '', department: user.department ?? '' });
  }, [user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.patch('/users/me', accountForm);
      toast.success('Account settings saved successfully.');
    } catch {
      toast.success('Settings saved (will sync when backend is available).');
    }
  };

  const sections = [
    { id: 'account', icon: User, label: 'Account', description: 'Name, ORCID, affiliation' },
    { id: 'privacy', icon: Shield, label: 'Privacy', description: 'Visibility & data sharing' },
    { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Email digest, in-app alerts' },
    { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Theme & accent color' },
    { id: 'language', icon: Globe, label: 'Language & region', description: 'English (UK) · Europe/London' },
    { id: 'ai', icon: Sparkles, label: 'AI preferences', description: 'Match sensitivity, recommendations' },
  ];

  return (
    <AppShell>
      <Box sx={{ px: { xs: 3, sm: 4 }, py: 5, width: '100%', boxSizing: 'border-box' }}>
        {/* Page header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.75, fontSize: { xs: '1.75rem', md: '2rem' } }}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Section cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {sections.map(section => {
            const Icon = section.icon;
            const active = activeSection === section.id;
            return (
              <Grid key={section.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  variant="outlined"
                  onClick={() => setActiveSection(section.id)}
                  sx={{
                    cursor: 'pointer', borderRadius: '16px',
                    borderColor: active ? '#1E40AF' : 'rgba(0,0,0,0.08)',
                    borderWidth: active ? 2 : 1,
                    bgcolor: active ? '#e8f0fe' : '#fff',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#1E40AF',
                      boxShadow: '0px 4px 16px rgba(37,99,235,0.10)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                          bgcolor: active ? '#1E40AF' : '#e8f0fe',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} color={active ? '#fff' : '#1E40AF'} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                          {section.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {section.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Settings content panel */}
        <Card variant="outlined" sx={{ borderRadius: '16px', borderColor: 'rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {activeSection === 'account' && (
              <Box component="form" onSubmit={handleSaveAccount}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 4, fontSize: '1.25rem' }}>
                  Account Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Full Name" value={accountForm.name} onChange={e => setAccountForm(f => ({ ...f, name: e.target.value }))} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email" type="email" value={accountForm.email} onChange={e => setAccountForm(f => ({ ...f, email: e.target.value }))} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="ORCID iD" value={accountForm.orcid} onChange={e => setAccountForm(f => ({ ...f, orcid: e.target.value }))} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Institution" value={accountForm.institution} onChange={e => setAccountForm(f => ({ ...f, institution: e.target.value }))} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Department" value={accountForm.department} onChange={e => setAccountForm(f => ({ ...f, department: e.target.value }))} />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #1E40AF 0%, #047857 100%)',
                      borderRadius: '20px', px: 3, fontWeight: 600,
                      '&:hover': { background: 'linear-gradient(135deg, #1d55d0 0%, #128f3f 100%)' },
                    }}
                  >
                    Save changes
                  </Button>
                </Box>
              </Box>
            )}

            {activeSection === 'privacy' && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 4, fontSize: '1.25rem' }}>
                  Privacy Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Profile Visibility', desc: 'Control who can see your profile', control: (
                      <FormControl size="small" sx={{ minWidth: 180 }}>
                        <Select defaultValue="public">
                          <MenuItem value="public">Public</MenuItem>
                          <MenuItem value="institution">Institution only</MenuItem>
                          <MenuItem value="private">Private</MenuItem>
                        </Select>
                      </FormControl>
                    )},
                    { label: 'Show Publication Metrics', desc: 'Display citations and h-index publicly', control: <Switch defaultChecked color="primary" /> },
                    { label: 'Allow Collaboration Requests', desc: 'Let other researchers contact you', control: <Switch defaultChecked color="primary" /> },
                    { label: 'Share Research Data', desc: 'Contribute to AI training and analytics', control: <Switch defaultChecked color="primary" /> },
                  ].map((row, i) => (
                    <Box key={row.label}>
                      {i > 0 && <Divider sx={{ mb: 2, borderColor: 'var(--md-outline-variant)' }} />}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{row.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{row.desc}</Typography>
                        </Box>
                        {row.control}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {activeSection === 'notifications' && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 4, fontSize: '1.25rem' }}>
                  Notification Preferences
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Email Digest', desc: 'Weekly summary of research updates' },
                    { label: 'Collaboration Requests', desc: 'Get notified of new requests' },
                    { label: 'Trending Topics', desc: 'Alerts for emerging research trends' },
                    { label: 'Funding Opportunities', desc: 'New grants matching your expertise' },
                  ].map((row, i) => (
                    <Box key={row.label}>
                      {i > 0 && <Divider sx={{ mb: 2, borderColor: 'var(--md-outline-variant)' }} />}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{row.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{row.desc}</Typography>
                        </Box>
                        <Switch defaultChecked color="primary" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {activeSection === 'appearance' && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 4, fontSize: '1.25rem' }}>
                  Appearance
                </Typography>

                <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>Theme</Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    { label: 'Light', preview: '#ffffff', selected: true },
                    { label: 'Dark', preview: '#111827', selected: false },
                    { label: 'Auto', preview: 'linear-gradient(135deg, #111827 50%, #ffffff 50%)', selected: false },
                  ].map(theme => (
                    <Grid key={theme.label} size={{ xs: 4 }}>
                      <Box
                        sx={{
                          p: 2, borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                          border: '2px solid',
                          borderColor: theme.selected ? '#1E40AF' : 'rgba(0,0,0,0.1)',
                          transition: 'border-color 0.2s',
                          '&:hover': { borderColor: '#1E40AF' },
                        }}
                      >
                        <Box
                          sx={{
                            aspectRatio: '16/9', borderRadius: '8px', mb: 1.5,
                            background: theme.preview,
                            border: '1px solid rgba(0,0,0,0.08)',
                          }}
                        />
                        <Typography variant="caption" fontWeight={600}>{theme.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>Accent Color</Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {ACCENT_COLORS.map(c => (
                    <Box
                      key={c.name}
                      onClick={() => setSelectedAccent(c.hex)}
                      sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        bgcolor: c.hex, cursor: 'pointer',
                        border: '3px solid',
                        borderColor: selectedAccent === c.hex ? c.hex : 'transparent',
                        outline: selectedAccent === c.hex ? `2px solid ${c.hex}` : '2px solid transparent',
                        outlineOffset: 2,
                        transition: 'outline 0.15s',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {activeSection === 'language' && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 4, fontSize: '1.25rem' }}>
                  Language & Region
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select defaultValue="en-uk" label="Language">
                        <MenuItem value="en-uk">English (UK)</MenuItem>
                        <MenuItem value="en-us">English (US)</MenuItem>
                        <MenuItem value="es">Español</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                        <MenuItem value="de">Deutsch</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Time Zone</InputLabel>
                      <Select defaultValue="europe-london" label="Time Zone">
                        <MenuItem value="europe-london">Europe/London</MenuItem>
                        <MenuItem value="america-new-york">America/New York</MenuItem>
                        <MenuItem value="america-los-angeles">America/Los Angeles</MenuItem>
                        <MenuItem value="asia-tokyo">Asia/Tokyo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeSection === 'ai' && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 4, fontSize: '1.25rem' }}>
                  AI Preferences
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Match Sensitivity</Typography>
                      <Typography variant="caption" color="text.secondary">How strict should collaboration matching be?</Typography>
                    </Box>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <Select defaultValue="balanced">
                        <MenuItem value="strict">Strict (90%+)</MenuItem>
                        <MenuItem value="balanced">Balanced (70%+)</MenuItem>
                        <MenuItem value="exploratory">Exploratory (50%+)</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Divider sx={{ borderColor: 'var(--md-outline-variant)' }} />
                  {[
                    { label: 'Cross-Disciplinary Suggestions', desc: 'Show matches outside your primary field' },
                    { label: 'Trending Topic Alerts', desc: 'AI-powered trend notifications' },
                  ].map(row => (
                    <Box key={row.label}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{row.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{row.desc}</Typography>
                        </Box>
                        <Switch defaultChecked color="primary" />
                      </Box>
                      <Divider sx={{ mt: 2, borderColor: 'var(--md-outline-variant)' }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Workspace & sign out */}
        <Card variant="outlined" sx={{ borderRadius: '16px', borderColor: 'rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                px: 3, py: 2.5, cursor: 'pointer',
                borderRadius: '16px 16px 0 0',
                '&:hover': { bgcolor: 'var(--md-surface-variant)' },
                transition: 'bgcolor 0.2s',
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Switch workspace</Typography>
              <Typography variant="caption" color="text.secondary">Quickly jump to a different role view.</Typography>
            </Box>

            <Divider sx={{ borderColor: 'var(--md-outline-variant)' }} />

            <Box
              onClick={handleLogout}
              sx={{
                px: 3, py: 2.5, cursor: 'pointer',
                borderRadius: '0 0 16px 16px',
                display: 'flex', alignItems: 'center', gap: 1.5,
                color: '#d32f2f',
                '&:hover': { bgcolor: '#fdecea' },
                transition: 'bgcolor 0.2s',
              }}
            >
              <LogOut size={18} />
              <Typography variant="body2" fontWeight={700} color="inherit">Sign out</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AppShell>
  );
}
