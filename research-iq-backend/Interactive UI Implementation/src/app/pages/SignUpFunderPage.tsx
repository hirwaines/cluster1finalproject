import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    signupFunder(form as unknown as Record<string, unknown>);
    toast.success('Funder application submitted for administrator review.');
    setTimeout(() => navigate('/login'), 1800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" onClick={() => navigate('/')} />
          <Button variant="ghost" onClick={() => navigate('/signup')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Funder registration</h1>
        <p className="text-gray-600 mb-8">
          External investors register here. Staff roles are not available on this form.
        </p>

        <Card className="p-8 shadow-md border border-gray-100">
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
            <Button type="submit" style={{ backgroundColor: '#1E40AF' }} className="w-full text-white hover:opacity-90">Submit for review</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
