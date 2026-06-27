import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';
import { PageBackHeader } from '../components/layout/PageBackHeader';

export function SignUpFunderPage() {
  const navigate = useNavigate();
  const { signupFunder } = useApp();
  const [form, setForm] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactName: '',
    contactPhone: '',
    areasOfInterest: '',
    investmentRange: '',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const ok = await signupFunder(form as unknown as Record<string, unknown>);
    if (ok) {
      toast.success('Funder application submitted for administrator review.');
      setTimeout(() => navigate('/login'), 1800);
    } else {
      toast.error('Registration failed. The email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageBackHeader backTo="/signup" backLabel="Role selection" title="Funder registration" maxWidth="xl" />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-muted-foreground mb-8">
          External investors register here. Staff roles are provisioned by your institution.
        </p>

        <Card className="p-8 shadow-md border border-border">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label>Organization name *</Label>
              <Input value={form.organizationName} onChange={e => setForm(p => ({ ...p, organizationName: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Work email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <Label>Investment range *</Label>
                <Input placeholder="$25k — $100k" value={form.investmentRange} onChange={e => setForm(p => ({ ...p, investmentRange: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Password *</Label>
                <Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <div>
                <Label>Confirm password *</Label>
                <Input type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary contact name *</Label>
                <Input value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))} required />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={form.contactPhone} onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} required />
              </div>
            </div>
            <div>
              <Label>Areas of interest (comma-separated) *</Label>
              <Input value={form.areasOfInterest} onChange={e => setForm(p => ({ ...p, areasOfInterest: e.target.value }))} placeholder="Climate resilience, digital ethics…" required />
            </div>
            <Button type="submit" className="w-full ">Submit for review</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
