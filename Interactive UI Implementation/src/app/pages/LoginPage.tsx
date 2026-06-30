import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Lock, Eye, EyeOff, Shield, CheckCircle, Search, Loader2, BookOpen, Quote, TrendingUp, FlaskConical, Crown, Briefcase, UserCheck, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { api, saveToken, saveUser } from '../services/api';
import { AuthShell, homePathForRole } from '../components/layout';
import { AUTH_ERRORS, AUTH_SUCCESS } from '../lib/userMessages';

interface OrcidPreview {
  orcid: string;
  name: string;
  institution: string | null;
  citedByCount: number;
  worksCount: number;
  hIndex: number;
  expertiseKeywords: string[];
  publications: Array<{ title: string; year: number | null }>;
}

const OrcidLogo = () => (
  <svg viewBox="0 0 256 256" className="w-5 h-5 shrink-0" fill="#A6CE39" aria-hidden>
    <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm-14.3 64.5h-16V56h16v8.5zm0 127h-16V79.5h16V191.5zm52.1 0h-16v-65c0-17.4-6.3-26.1-18.9-26.1-6.6 0-11.9 2.4-15.9 7.2-4 4.8-6 10.9-6 18.3v65.6h-16V79.5h16v14.3c4.1-5.6 8.6-9.7 13.5-12.3 4.9-2.6 10.5-3.9 16.8-3.9 10.6 0 18.9 3.5 24.9 10.4 6 9 16.7 9 29.3v74.2z" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useApp();

  // ── Email / password login state ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);

  // ── Forgot password state ──
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // ── Role selector ──
  const [selectedRole, setSelectedRole] = useState<'researcher' | 'admin' | 'funder' | 'department_head' | 'manager'>('researcher');

  // ── ORCID login dialog state ──
  const [showOrcidDialog, setShowOrcidDialog] = useState(false);
  const [orcidInput, setOrcidInput] = useState('');
  const [orcidFetching, setOrcidFetching] = useState(false);
  const [orcidPreview, setOrcidPreview] = useState<OrcidPreview | null>(null);
  const [orcidLoggingIn, setOrcidLoggingIn] = useState(false);

  // ── Email/password login ──
  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { toast.error(AUTH_ERRORS.missingCredentials); return; }
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.mfaRequired) {
        setMfaStep(true);
        toast.info(AUTH_SUCCESS.mfaPrompt);
      } else {
        toast.success(AUTH_SUCCESS.login);
        const stored = JSON.parse(localStorage.getItem('riq_user') || 'null');
        navigate(homePathForRole(stored?.role || 'researcher'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('pending')) toast.error(AUTH_ERRORS.pendingApproval);
      else if (msg.includes('disabled')) toast.error(AUTH_ERRORS.disabled);
      else toast.error(AUTH_ERRORS.invalidLogin);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async () => {
    if (!mfaCode.trim()) { toast.error(AUTH_ERRORS.missingMfa); return; }
    setMfaLoading(true);
    try {
      await login(email.trim(), password, mfaCode.trim());
      toast.success(AUTH_SUCCESS.mfaVerified);
      const stored = JSON.parse(localStorage.getItem('riq_user') || 'null');
      navigate(homePathForRole(stored?.role || 'researcher'));
    } catch {
      toast.error(AUTH_ERRORS.invalidMfa);
    } finally {
      setMfaLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) { toast.error(AUTH_ERRORS.missingEmail); return; }
    try { await api.post('/auth/password-reset/request', { email: recoveryEmail.trim() }); } catch { /* fall through */ }
    setRecoverySent(true);
    toast.success(AUTH_SUCCESS.passwordReset);
  };

  // ── ORCID login helpers ──
  const openOrcidDialog = () => {
    setOrcidInput('');
    setOrcidPreview(null);
    setShowOrcidDialog(true);
  };

  const fetchOrcidProfile = async () => {
    const id = orcidInput.trim();
    if (!id) { toast.error('Enter your ORCID iD first'); return; }
    setOrcidFetching(true);
    setOrcidPreview(null);
    try {
      const data = await api.get<OrcidPreview>(`/orcid/lookup?orcid=${encodeURIComponent(id)}`);
      setOrcidPreview(data);
    } catch {
      toast.error('ORCID not found in OpenAlex, or not registered in this system yet.');
    } finally {
      setOrcidFetching(false);
    }
  };

  const submitOrcidLogin = async () => {
    if (!orcidPreview) return;
    setOrcidLoggingIn(true);
    try {
      type AuthResp = { token: string | null; user: { id: string; name: string; email: string; role: string } | null };
      const resp = await api.post<AuthResp>('/auth/orcid-login', { orcid: orcidInput.trim() });
      saveToken(resp.token!);

      // Fetch full profile (with OpenAlex metrics now saved to DB) before storing in localStorage
      type ProfileResp = {
        department?: string; position?: string; institution?: string; orcid?: string;
        expertiseKeywords?: string[]; profilePicture?: string; joinedDate?: string;
        hIndex?: number; citedByCount?: number; worksCount?: number;
        openalexPublications?: Array<{
          title?: string; doi?: string; year?: number;
          citedByCount?: number; journal?: string; citation?: string;
        }>;
      };
      const base = {
        id: resp.user!.id,
        name: resp.user!.name,
        email: resp.user!.email,
        role: resp.user!.role as string,
        accredited: true,
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      let u: Record<string, unknown> = { ...base };
      try {
        const profile = await api.get<ProfileResp>('/users/me');
        u = {
          ...base,
          department: profile.department,
          position: profile.position,
          institution: profile.institution,
          orcid: profile.orcid,
          expertise: profile.expertiseKeywords,
          photo: profile.profilePicture,
          hIndex: profile.hIndex,
          citations: profile.citedByCount,
          publications: profile.worksCount,
          openalexPublications: profile.openalexPublications,
          joinedDate: profile.joinedDate
            ? new Date(profile.joinedDate).toISOString().slice(0, 10)
            : base.joinedDate,
        };
      } catch { /* keep base user if profile fetch fails */ }

      saveUser(u);
      toast.success(`Welcome back, ${base.name}!`);
      setShowOrcidDialog(false);
      window.location.href = homePathForRole(base.role as Parameters<typeof homePathForRole>[0]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('No account')) toast.error('No account registered with this ORCID. Please sign up first.');
      else if (msg.includes('pending')) toast.error(AUTH_ERRORS.pendingApproval);
      else toast.error('Sign-in failed. Contact an administrator.');
    } finally {
      setOrcidLoggingIn(false);
    }
  };

  if (user) {
    navigate(homePathForRole(user.role));
    return null;
  }

  const ROLES = [
    { key: 'researcher' as const,      label: 'Researcher',       icon: FlaskConical },
    { key: 'admin' as const,           label: 'Admin',            icon: Crown },
    { key: 'funder' as const,          label: 'Funder',           icon: Briefcase },
    { key: 'department_head' as const, label: 'Dept. Head',       icon: UserCheck },
    { key: 'manager' as const,         label: 'Res. Manager',     icon: BarChart2 },
  ] as const;

  const roleHint: Record<typeof selectedRole, string> = {
    researcher:      'Sign in with your institutional email or use your ORCID.',
    admin:           'Sign in with your administrator credentials.',
    funder:          'Sign in with your funder account email.',
    department_head: 'Sign in with your department head credentials.',
    manager:         'Sign in with your research manager credentials.',
  };

  return (
    <AuthShell variant="split" maxWidth="md">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wider text-brand mb-2">Welcome back</p>
        <h2 className="font-display text-3xl text-foreground mb-2">Sign in to ResearchIQ</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{roleHint[selectedRole]}</p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-5 gap-1.5 mb-6 p-1 bg-muted rounded-xl">
        {ROLES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedRole(key)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              selectedRole === key
                ? 'bg-background text-brand shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="leading-tight text-center">{label}</span>
          </button>
        ))}
      </div>

      {!mfaStep ? (
        <form onSubmit={doLogin} className="space-y-5">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={selectedRole === 'researcher' ? 'name@ur.ac.rw' : selectedRole === 'funder' ? 'your@email.com' : 'admin@researchiq.rw'}
              required className="mt-1.5 h-11" autoComplete="email" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button type="button" onClick={() => setShowForgotPassword(true)}
                className="text-xs text-brand hover:underline font-medium">Forgot password?</button>
            </div>
            <div className="relative mt-1.5">
              <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                required className="pr-10 h-11" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
            {loading ? 'Signing in…' : <><Lock className="w-4 h-4 mr-2" />Sign in</>}
          </Button>

          {selectedRole === 'researcher' && (
            <>
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase tracking-wide">
                  <span className="bg-background px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <Button type="button" variant="outline"
                className="w-full h-11 border-[#A6CE39]/40 text-[#4a7c00] hover:bg-[#A6CE39]/8 font-medium gap-2"
                onClick={openOrcidDialog}>
                <OrcidLogo />
                Sign in with ORCID
              </Button>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground pt-1">
            No account?{' '}
            <button type="button" onClick={() => navigate('/signup')} className="text-brand hover:underline font-semibold">
              Create one
            </button>
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl bg-brand-muted/40 border border-brand/15 p-5 text-center">
            <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-brand" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-1">Two-factor verification</h3>
            <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email.</p>
          </div>
          <div>
            <Label htmlFor="mfaCode">Verification code</Label>
            <Input id="mfaCode" value={mfaCode} onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000" maxLength={6}
              className="mt-1.5 text-center text-2xl tracking-[0.35em] h-12 font-mono" autoComplete="one-time-code" />
          </div>
          <Button onClick={handleMfaVerify} className="w-full h-11" disabled={mfaLoading}>
            {mfaLoading ? 'Verifying…' : 'Verify and continue'}
          </Button>
          <button type="button" onClick={() => { setMfaStep(false); setMfaCode(''); }}
            className="w-full text-sm text-muted-foreground hover:text-foreground">Back to sign in</button>
        </div>
      )}

      {/* ── ORCID sign-in dialog ── */}
      <Dialog open={showOrcidDialog} onOpenChange={open => { if (!open) setShowOrcidDialog(false); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <OrcidLogo />
              Sign in with ORCID
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Step 1 — ORCID lookup */}
            <div>
              <Label>Your ORCID iD</Label>
              <div className="flex gap-2 mt-1.5">
                <Input placeholder="0000-0000-0000-0000" value={orcidInput} className="font-mono flex-1"
                  onChange={e => { setOrcidInput(e.target.value); setOrcidPreview(null); }}
                  onKeyDown={e => e.key === 'Enter' && fetchOrcidProfile()} autoFocus />
                <Button type="button" onClick={fetchOrcidProfile} disabled={orcidFetching || !orcidInput.trim()}>
                  {orcidFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-1" />Look up</>}
                </Button>
              </div>
            </div>

            {/* Step 2 — Profile preview + direct sign-in */}
            {orcidPreview && (
              <>
                <div className="rounded-xl border border-[#A6CE39]/25 bg-[#A6CE39]/5 p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <OrcidLogo />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground leading-tight">{orcidPreview.name}</p>
                      {orcidPreview.institution && (
                        <p className="text-sm text-muted-foreground truncate">{orcidPreview.institution}</p>
                      )}
                      <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{orcidPreview.worksCount} works</span>
                        <span className="flex items-center gap-1"><Quote className="w-3 h-3" />{orcidPreview.citedByCount?.toLocaleString()} citations</span>
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />h-index {orcidPreview.hIndex}</span>
                      </div>
                    </div>
                  </div>
                  {orcidPreview.expertiseKeywords?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {orcidPreview.expertiseKeywords.slice(0, 5).map(k => (
                        <span key={k} className="text-xs bg-white text-[#4a7c00] border border-[#A6CE39]/30 px-2 py-0.5 rounded-full">{k}</span>
                      ))}
                    </div>
                  )}
                </div>

                <Button className="w-full h-11" onClick={submitOrcidLogin} disabled={orcidLoggingIn}>
                  {orcidLoggingIn
                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Signing in…</>
                    : `Sign in as ${orcidPreview.name.split(' ')[0]}`}
                </Button>
              </>
            )}

            <p className="text-xs text-center text-muted-foreground border-t border-border pt-3">
              No account yet?{' '}
              <button type="button" className="text-brand hover:underline font-medium"
                onClick={() => { setShowOrcidDialog(false); navigate('/signup'); }}>
                Register as a researcher
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Forgot password dialog ── */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Reset your password</DialogTitle>
          </DialogHeader>
          {!recoverySent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground">We will send a reset code to your registered email.</p>
              <div>
                <Label htmlFor="recoveryEmail">Email address</Label>
                <Input id="recoveryEmail" type="email" value={recoveryEmail}
                  onChange={e => setRecoveryEmail(e.target.value)} placeholder="name@ur.ac.rw"
                  required className="mt-1.5" />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForgotPassword(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Send code</Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="w-14 h-14 text-accent-rw mx-auto" />
              <p className="text-sm text-muted-foreground">
                Check your inbox at <strong>{recoveryEmail}</strong>. The code expires in 15 minutes.
              </p>
              <Button className="w-full" onClick={() => { setShowForgotPassword(false); setRecoverySent(false); setRecoveryEmail(''); }}>
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthShell>
  );
}
