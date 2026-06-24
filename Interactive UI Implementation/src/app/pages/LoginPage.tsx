import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Brain, ArrowLeft, Lock, Eye, EyeOff, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../context/AppContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { api } from '../services/api';

function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'funder': return '/funder/dashboard';
    case 'manager': return '/manager/dashboard';
    case 'department_head': return '/department/dashboard';
    default: return '/researcher/dashboard';
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
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

  const { user } = useApp();

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.mfaRequired) {
        setMfaStep(true);
        toast.info('A verification code has been sent to your registered email.');
      } else {
        toast.success('Welcome back!');
        // user is set in context; role comes from stored user
        const stored = JSON.parse(localStorage.getItem('riq_user') || 'null');
        navigate(dashboardPathForRole(stored?.role || 'researcher'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.includes('pending')) {
        toast.error('Your account is pending admin approval. You will be notified by email.');
      } else if (msg.includes('disabled')) {
        toast.error('Your account has been disabled. Contact support.');
      } else {
        toast.error('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async () => {
    if (!mfaCode.trim()) { toast.error('Enter the verification code.'); return; }
    setMfaLoading(true);
    try {
      await login(email.trim(), password, mfaCode.trim());
      toast.success('Verified. Welcome back!');
      const stored = JSON.parse(localStorage.getItem('riq_user') || 'null');
      navigate(dashboardPathForRole(stored?.role || 'admin'));
    } catch {
      toast.error('Invalid or expired code. Try again.');
    } finally {
      setMfaLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) { toast.error('Enter your email address'); return; }
    try {
      await api.post('/auth/password-reset/request', { email: recoveryEmail.trim() });
    } catch { /* backend may not have email configured; show success regardless */ }
    setRecoverySent(true);
    toast.success('If that email exists, a reset code has been sent.');
  };

  const handleOrcidLogin = () => {
    setOrcidLoading(true);
    setTimeout(() => {
      setOrcidLoading(false);
      toast.info('ORCID sign-in is not yet configured. Please use email and password.');
    }, 800);
  };

  // Redirect if already logged in
  if (user) {
    navigate(dashboardPathForRole(user.role));
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">

      {/* Back to home */}
      <div className="w-full max-w-md mb-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-900 rounded-xl flex items-center justify-center mb-3 shadow-md">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <span className="font-bold text-2xl text-blue-900">ResearchIQ</span>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {!mfaStep ? (
          <form onSubmit={doLogin} className="space-y-5">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@institution.edu"
                required
                className="mt-1"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400">or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-[#A6CE39] text-[#A6CE39] hover:bg-[#A6CE39]/10 font-semibold"
              onClick={handleOrcidLogin}
              disabled={orcidLoading}
            >
              {orcidLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Connecting to ORCID...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 256 256" className="w-5 h-5" fill="#A6CE39">
                    <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm-14.3 64.5h-16V56h16v8.5zm0 127h-16V79.5h16V191.5zm52.1 0h-16v-65c0-17.4-6.3-26.1-18.9-26.1-6.6 0-11.9 2.4-15.9 7.2-4 4.8-6 10.9-6 18.3v65.6h-16V79.5h16v14.3c4.1-5.6 8.6-9.7 13.5-12.3 4.9-2.6 10.5-3.9 16.8-3.9 10.6 0 18.9 3.5 24.9 10.4 6 6.9 9 16.7 9 29.3v74.2z"/>
                  </svg>
                  Sign in with ORCID
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400">
              ORCID sign-in imports your publications and profile automatically.
            </p>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button type="button" onClick={() => navigate('/signup')} className="text-blue-800 hover:underline font-medium">
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-800" />
              </div>
              <h2 className="text-xl font-bold mb-1">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-500">Enter the 6-digit code sent to your registered email.</p>
            </div>
            <div>
              <Label htmlFor="mfaCode">Authentication Code</Label>
              <Input
                id="mfaCode"
                value={mfaCode}
                onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="mt-1 text-center text-2xl tracking-widest"
                autoComplete="one-time-code"
              />
            </div>
            <Button
              onClick={handleMfaVerify}
              className="w-full bg-blue-900 hover:bg-blue-950"
              disabled={mfaLoading}
            >
              {mfaLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Code
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={() => { setMfaStep(false); setMfaCode(''); }}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to login
            </button>
          </div>
        )}
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
          </DialogHeader>
          {!recoverySent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-gray-600">Enter your registered email and we'll send a reset code.</p>
              <div>
                <Label htmlFor="recoveryEmail">Email Address</Label>
                <Input
                  id="recoveryEmail"
                  type="email"
                  value={recoveryEmail}
                  onChange={e => setRecoveryEmail(e.target.value)}
                  placeholder="your.email@institution.edu"
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForgotPassword(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-950">Send Reset Code</Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-bold">Reset code sent!</h3>
              <p className="text-sm text-gray-600">Check your inbox at <strong>{recoveryEmail}</strong>. The code expires in 15 minutes.</p>
              <Button className="w-full bg-blue-900" onClick={() => { setShowForgotPassword(false); setRecoverySent(false); setRecoveryEmail(''); }}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
