import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Lock, Eye, EyeOff, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../context/AppContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { api } from '../services/api';
import { AuthShell, homePathForRole } from '../components/layout';
import { AUTH_ERRORS, AUTH_SUCCESS } from '../lib/userMessages';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [orcidLoading, setOrcidLoading] = useState(false);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error(AUTH_ERRORS.missingCredentials);
      return;
    }
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
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.includes('pending')) {
        toast.error(AUTH_ERRORS.pendingApproval);
      } else if (msg.includes('disabled')) {
        toast.error(AUTH_ERRORS.disabled);
      } else {
        toast.error(AUTH_ERRORS.invalidLogin);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async () => {
    if (!mfaCode.trim()) {
      toast.error(AUTH_ERRORS.missingMfa);
      return;
    }
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
    if (!recoveryEmail.trim()) {
      toast.error(AUTH_ERRORS.missingEmail);
      return;
    }
    try {
      await api.post('/auth/password-reset/request', { email: recoveryEmail.trim() });
    } catch {
      /* fall through */
    }
    setRecoverySent(true);
    toast.success(AUTH_SUCCESS.passwordReset);
  };

  const handleOrcidLogin = () => {
    setOrcidLoading(true);
    setTimeout(() => {
      setOrcidLoading(false);
      toast.info('ORCID sign-in is not yet configured. Please use email and password.');
    }, 800);
  };

  if (user) {
    navigate(homePathForRole(user.role));
    return null;
  }

  return (
    <AuthShell variant="split" maxWidth="md">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-brand mb-2">Welcome back</p>
        <h2 className="font-display text-3xl text-foreground mb-2">Sign in to ResearchIQ</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Access your dashboard with your institutional email and password.
        </p>
      </div>

      {!mfaStep ? (
        <form onSubmit={doLogin} className="space-y-5">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@ur.ac.rw"
              required
              className="mt-1.5 h-11"
              autoComplete="email"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-brand hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pr-10 h-11"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
            {loading ? 'Signing in…' : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Sign in
              </>
            )}
          </Button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-background px-3 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-accent-rw/40 text-accent-rw hover:bg-accent-rw/5 font-medium"
            onClick={handleOrcidLogin}
            disabled={orcidLoading}
          >
            {orcidLoading ? 'Connecting…' : (
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 256 256" className="w-5 h-5" fill="#A6CE39" aria-hidden>
                  <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm-14.3 64.5h-16V56h16v8.5zm0 127h-16V79.5h16V191.5zm52.1 0h-16v-65c0-17.4-6.3-26.1-18.9-26.1-6.6 0-11.9 2.4-15.9 7.2-4 4.8-6 10.9-6 18.3v65.6h-16V79.5h16v14.3c4.1-5.6 8.6-9.7 13.5-12.3 4.9-2.6 10.5-3.9 16.8-3.9 10.6 0 18.9 3.5 24.9 10.4 6 9 16.7 9 29.3v74.2z" />
                </svg>
                Sign in with ORCID
                <ExternalLink className="w-3 h-3 opacity-60" />
              </span>
            )}
          </Button>

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
            <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email or backend logs.</p>
          </div>
          <div>
            <Label htmlFor="mfaCode">Verification code</Label>
            <Input
              id="mfaCode"
              value={mfaCode}
              onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="mt-1.5 text-center text-2xl tracking-[0.35em] h-12 font-mono"
              autoComplete="one-time-code"
            />
          </div>
          <Button onClick={handleMfaVerify} className="w-full h-11" disabled={mfaLoading}>
            {mfaLoading ? 'Verifying…' : 'Verify and continue'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setMfaStep(false);
              setMfaCode('');
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Back to sign in
          </button>
        </div>
      )}

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
                <Input
                  id="recoveryEmail"
                  type="email"
                  value={recoveryEmail}
                  onChange={e => setRecoveryEmail(e.target.value)}
                  placeholder="name@ur.ac.rw"
                  required
                  className="mt-1.5"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForgotPassword(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Send code
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="w-14 h-14 text-accent-rw mx-auto" />
              <p className="text-sm text-muted-foreground">
                Check your inbox at <strong>{recoveryEmail}</strong>. The code expires in 15 minutes.
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  setShowForgotPassword(false);
                  setRecoverySent(false);
                  setRecoveryEmail('');
                }}
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthShell>
  );
}
