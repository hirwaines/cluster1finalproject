import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: 'Weak', color: 'bg-destructive/100', textColor: 'text-destructive' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    if (score === 4) return { score, label: 'Good', color: 'bg-brand-muted0', textColor: 'text-brand' };
    return { score, label: 'Strong', color: 'bg-success-muted/500', textColor: 'text-success' };
  };

  const sendVerificationCode = async () => {
    if (!formData.email) { toast.error('Enter your email first'); return; }
    try {
      await api.post('/auth/signup/email-verification/request', { email: formData.email });
      setCodeSent(true);
      toast.success(`Verification code sent to ${formData.email}. Check your inbox.`);
    } catch {
      toast.error('Could not send verification code. Check your email address.');
    }
  };

  const verifyEmailCode = async () => {
    try {
      await api.post('/auth/signup/email-verification/verify', { email: formData.email, otp: enteredCode });
      setEmailVerified(true);
      toast.success('Email verified successfully!');
    } catch {
      toast.error('Invalid code. Try again.');
    }
  };

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
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Researcher application</h2>
                  <p className="text-muted-foreground">
                    Expertise is derived from publication metadata after verification — do not enter keyword lists manually.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full name *</Label>
                    <Input id="name" value={formData.name} onChange={e => updateForm('name', e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type="password" value={formData.password} onChange={e => updateForm('password', e.target.value)} required />
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
                    <Label htmlFor="confirmPassword">Confirm *</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} required />
                    {formData.confirmPassword && (
                      <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-success' : 'text-destructive'}`}>
                        {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="institution">Institution *</Label>
                    <Input id="institution" value={formData.institution} onChange={e => updateForm('institution', e.target.value)} placeholder="AUCA" required />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input id="department" value={formData.department} onChange={e => updateForm('department', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="orcid">ORCID *</Label>
                  <Input id="orcid" value={formData.orcid} onChange={e => updateForm('orcid', e.target.value)} required />
                </div>
                {/* Email Verification */}
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Email Verification</p>
                      <p className="text-xs text-muted-foreground">Verify your email before continuing</p>
                    </div>
                    {emailVerified && (
                      <span className="text-success text-sm font-medium flex items-center gap-1">
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
                        <div className="flex gap-2">
                          <Input placeholder="Enter 6-digit code" value={enteredCode} onChange={e => setEnteredCode(e.target.value)} maxLength={6} className="flex-1" />
                          <Button type="button" size="sm" onClick={verifyEmailCode}>Verify</Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <Button type="button" className="w-full " onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Verification credentials</h2>
                <div className="bg-brand-muted border border-border rounded-lg p-4 flex gap-3 text-sm text-brand">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>Administrators review CV and degree information before activating your profile.</p>
                </div>
                <div>
                  <Label>Highest degree *</Label>
                  <Select value={formData.degree} onValueChange={v => updateForm('degree', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
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
                  <Textarea id="education" rows={4} value={formData.education} onChange={e => updateForm('education', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="experience">Years of research experience *</Label>
                  <Input id="experience" type="number" min={0} value={formData.experience} onChange={e => updateForm('experience', e.target.value)} required />
                </div>
                <div>
                  <Label>CV upload *</Label>
                  <label className="mt-2 flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
                    <Upload className="w-6 h-6 text-muted-foreground/70 mb-1" />
                    <span className="text-sm text-muted-foreground">{formData.cv ? formData.cv.name : 'PDF or Word'}</span>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => updateForm('cv', e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" className="flex-1 " onClick={() => setStep(3)}>Continue</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Publications for indexing</h2>
                <p className="text-muted-foreground text-sm">
                  List titles or full citations (one per line). Keywords will be extracted automatically after approval — there is no manual expertise field.
                </p>
                <div>
                  <Label htmlFor="publications">Publications *</Label>
                  <Textarea id="publications" rows={8} value={formData.publications} onChange={e => updateForm('publications', e.target.value)} required />
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex gap-3 text-sm text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>Once approved, publication keywords are indexed automatically to populate your expertise summary.</p>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" className="flex-1 ">Submit application</Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}

function StepIndicator({ number, title, active, completed }: { number: number; title: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${
          completed || active ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
        }`}
      >
        {completed ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <span className={`text-xs font-medium ${active || completed ? 'text-brand' : 'text-muted-foreground/70'}`}>{title}</span>
    </div>
  );
}
