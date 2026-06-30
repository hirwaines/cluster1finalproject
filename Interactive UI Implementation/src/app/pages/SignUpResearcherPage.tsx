import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Upload, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';
import { api } from '../services/api';
import { PageBackHeader } from '../components/layout/PageBackHeader';

export function SignUpResearcherPage() {
  const navigate = useNavigate();
  const { signupResearcher } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    department: '',
    orcid: '',
    degree: '',
    education: '',
    experience: '',
    publications: '',
    cv: null as File | null,
  });

  // Email verification state
  const [enteredCode, setEnteredCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Password strength ──────────────────────────────────────────────────────
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-600' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    if (score === 4) return { score, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600' };
    return { score, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  // ── Dev OTP polling ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!codeSent || emailVerified || !formData.email) return;
    setDevCode('');
    const poll = setInterval(async () => {
      try {
        const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080/api/v1';
        const res = await fetch(`${apiBase}/dev/otp?email=${encodeURIComponent(formData.email)}&type=email-verification`);
        if (res.ok) {
          const data = await res.json();
          if (data.code) { setDevCode(data.code); clearInterval(poll); }
        }
      } catch { /* dev endpoint not available */ }
    }, 1500);
    return () => clearInterval(poll);
  }, [codeSent, formData.email, emailVerified]);

  // ── Resend cooldown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current!);
  }, [resendCooldown]);

  // ── Email verification ─────────────────────────────────────────────────────
  const sendVerificationCode = async () => {
    if (!formData.email) { toast.error('Enter your email first'); return; }
    if (resendCooldown > 0) return;
    try {
      await api.post('/auth/signup/email-verification/request', { email: formData.email });
      setCodeSent(true);
      setDevCode('');
      setResendCooldown(60);
      toast.success(`Verification code sent to ${formData.email}. Check your inbox.`);
    } catch {
      toast.error('Could not send verification code. Check your email address.');
    }
  };

  const verifyEmailCode = async () => {
    try {
      await api.post('/auth/signup/email-verification/verify', { email: formData.email, otp: enteredCode });
      setEmailVerified(true);
      toast.success('Email verified!');
    } catch {
      toast.error('Invalid code. Try again.');
    }
  };

  // ── Signup submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (!emailVerified) { toast.error('Please verify your email address first'); return; }
    const strength = getPasswordStrength(formData.password);
    if (strength.score < 2) { toast.error('Password too weak. Use 8+ characters with uppercase and numbers.'); return; }
    const ok = await signupResearcher(formData as unknown as Record<string, unknown>);
    if (ok) {
      toast.success('Application submitted. An administrator will verify your record.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      toast.error('Registration failed. The email may already be in use.');
    }
  };

  const updateForm = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <PageBackHeader backTo="/signup" backLabel="Role selection" title="Researcher registration" maxWidth="lg" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Step indicators */}
        <div className="mb-10 flex items-center gap-4">
          <StepIndicator number={1} title="Basics" active={step === 1} completed={step > 1} />
          <div className="flex-1 h-1 bg-muted rounded">
            <div className={`h-full bg-brand rounded transition-all ${step > 1 ? 'w-full' : 'w-0'}`} />
          </div>
          <StepIndicator number={2} title="Credentials" active={step === 2} completed={step > 2} />
          <div className="flex-1 h-1 bg-muted rounded">
            <div className={`h-full bg-brand rounded transition-all ${step > 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <StepIndicator number={3} title="Publications" active={step === 3} completed={step > 3} />
        </div>

        <Card className="p-8 bg-white shadow-md border border-border">
          <form onSubmit={handleSubmit}>

            {/* ── Step 1: Basics ── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Researcher application</h2>
                  <p className="text-muted-foreground text-sm">
                    Fill in your details to apply for a researcher account. An administrator will review your profile.
                  </p>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full name *</Label>
                    <Input id="name" value={formData.name} onChange={e => updateForm('name', e.target.value)} required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => updateForm('email', e.target.value)}
                    onBlur={() => {
                      if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !codeSent && !emailVerified) {
                        sendVerificationCode();
                      }
                    }}
                    required
                    className="mt-1.5"
                  />
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type="password" value={formData.password} onChange={e => updateForm('password', e.target.value)} required className="mt-1.5" />
                    {formData.password && (() => {
                      const s = getPasswordStrength(formData.password);
                      return (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= s.score ? s.color : 'bg-muted'}`} />
                            ))}
                          </div>
                          <p className={`text-xs font-medium ${s.textColor}`}>{s.label}</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm password *</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} required className="mt-1.5" />
                    {formData.confirmPassword && (
                      <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Institution + Department */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="institution">Institution *</Label>
                    <Input id="institution" value={formData.institution} onChange={e => updateForm('institution', e.target.value)} placeholder="AUCA" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input id="department" value={formData.department} onChange={e => updateForm('department', e.target.value)} required className="mt-1.5" />
                  </div>
                </div>

                {/* ORCID — plain field */}
                <div>
                  <Label htmlFor="orcid">ORCID iD <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input id="orcid" value={formData.orcid} onChange={e => updateForm('orcid', e.target.value)}
                    placeholder="0000-0000-0000-0000" className="mt-1.5 font-mono" />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can use your ORCID to sign in later via the login page once your account is approved.
                  </p>
                </div>

                {/* Email Verification */}
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Email verification</p>
                      <p className="text-xs text-muted-foreground">Verify your email before continuing</p>
                    </div>
                    {emailVerified && (
                      <span className="text-green-700 text-sm font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Verified
                      </span>
                    )}
                  </div>
                  {!emailVerified && (
                    <>
                      {!codeSent ? (
                        <Button type="button" variant="outline" size="sm" onClick={sendVerificationCode} disabled={!formData.email}>
                          Send verification code
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          {devCode && (
                            <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                              <div>
                                <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Your code</p>
                                <p className="text-xl font-mono font-bold tracking-[0.25em] text-amber-800">{devCode}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => { setEnteredCode(devCode); toast.success('Code filled in'); }}
                                className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 font-medium border border-amber-300 rounded px-2 py-1 hover:bg-amber-100"
                              >
                                <Copy className="w-3 h-3" /> Use
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter 6-digit code"
                              value={enteredCode}
                              onChange={e => setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              maxLength={6}
                              className="flex-1 font-mono tracking-widest text-center"
                            />
                            <Button type="button" size="sm" onClick={verifyEmailCode}>Verify</Button>
                          </div>
                          <button
                            type="button"
                            onClick={sendVerificationCode}
                            disabled={resendCooldown > 0}
                            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
                          >
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Button type="button" className="w-full" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            )}

            {/* ── Step 2: Credentials ── */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Verification credentials</h2>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-900">
                  <AlertCircle className="w-5 h-5 shrink-0 text-blue-600" />
                  <p>Administrators review CV and degree information before activating your profile.</p>
                </div>
                <div>
                  <Label>Highest degree *</Label>
                  <Select value={formData.degree} onValueChange={v => updateForm('degree', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phd">PhD / Doctorate</SelectItem>
                      <SelectItem value="masters">Master&apos;s</SelectItem>
                      <SelectItem value="bachelors">Bachelor&apos;s</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="education">Education summary *</Label>
                  <Textarea id="education" rows={4} value={formData.education} onChange={e => updateForm('education', e.target.value)} required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="experience">Years of research experience *</Label>
                  <Input id="experience" type="number" min={0} value={formData.experience} onChange={e => updateForm('experience', e.target.value)} required className="mt-1.5" />
                </div>
                <div>
                  <Label>CV upload *</Label>
                  <label className="mt-2 flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground/70 mb-1" />
                    <span className="text-sm text-muted-foreground">{formData.cv ? formData.cv.name : 'PDF or Word'}</span>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => updateForm('cv', e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" className="flex-1" onClick={() => setStep(3)}>Continue</Button>
                </div>
              </div>
            )}

            {/* ── Step 3: Publications ── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Publications for indexing</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    List your publications (one per line). Titles or full citations are both accepted.
                  </p>
                </div>

                <div>
                  <Label htmlFor="publications">Publications *</Label>
                  <Textarea
                    id="publications"
                    rows={10}
                    value={formData.publications}
                    onChange={e => updateForm('publications', e.target.value)}
                    required
                    className="mt-1.5 font-mono text-sm"
                    placeholder="One publication per line..."
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex gap-3 text-sm text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <p>Once approved, publication keywords are indexed automatically to populate your expertise summary.</p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" className="flex-1">Submit application</Button>
                </div>
              </div>
            )}

          </form>
        </Card>
      </div>
    </div>
  );
}

function StepIndicator({ number, title, active, completed }: {
  number: number; title: string; active: boolean; completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center flex-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${
        completed || active ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
      }`}>
        {completed ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <span className={`text-xs font-medium ${active || completed ? 'text-brand' : 'text-muted-foreground/70'}`}>
        {title}
      </span>
    </div>
  );
}
