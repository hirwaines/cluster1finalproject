import { useState } from 'react';
import { MapPin, Mail, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { MarketingSection, SectionHeader } from './MarketingSection';
import { NCST, SYSTEM_ADMIN } from '../../content/ncst';
import { api } from '../../services/api';
import { toast } from 'sonner';

type ContactSectionProps = {
  /** Section id for in-page anchor links */
  id?: string;
  tone?: 'default' | 'muted' | 'card' | 'brand-muted' | 'dark';
};

export function ContactSection({ id = 'contact', tone = 'card' }: ContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post<string>('/contact', form);
      setSent(true);
      toast.success('Message sent successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingSection id={id} tone={tone}>
      <SectionHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about onboarding, partnerships, or platform access? Send a message to our system administrator."
      />

      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="p-6 border border-border lg:col-span-1 h-fit">
          <h3 className="font-bold text-foreground mb-4">Contact details</h3>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <Mail className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-foreground">{SYSTEM_ADMIN.name}</div>
                <a href={`mailto:${SYSTEM_ADMIN.email}`} className="text-brand hover:underline">
                  {SYSTEM_ADMIN.email}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-foreground">Location</div>
                {NCST.city}, {NCST.country}
              </div>
            </li>
            <li className="flex gap-3">
              <Clock className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-foreground">Response time</div>
                Within 2 business days
              </div>
            </li>
          </ul>
        </Card>

        <Card className="p-6 md:p-8 border border-border lg:col-span-2">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${id}-name`}>Full name</Label>
                  <Input
                    id={`${id}-name`}
                    required
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Dr. Anastase Ndayisaba"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Your name as it appears on institutional or academic records.
                  </p>
                </div>
                <div>
                  <Label htmlFor={`${id}-email`}>Email address</Label>
                  <Input
                    id={`${id}-email`}
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="name@ur.ac.rw"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    We will send our reply to this address.
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor={`${id}-subject`}>Subject</Label>
                <Input
                  id={`${id}-subject`}
                  required
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="e.g. Institutional onboarding, partnership inquiry"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  A short summary so we can route your message correctly.
                </p>
              </div>
              <div>
                <Label htmlFor={`${id}-message`}>Message</Label>
                <Textarea
                  id={`${id}-message`}
                  required
                  rows={6}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about your institution, role, and how we can help."
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Include your university or organisation and whether you are a researcher, funder, or administrator.
                </p>
              </div>
              <Button type="submit" className="w-full sm:w-auto min-w-[160px]" disabled={loading}>
                {loading ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-brand mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Message sent</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you, <strong>{form.name}</strong>. Your message was sent to{' '}
                <strong>{SYSTEM_ADMIN.email}</strong>. We will reply to <strong>{form.email}</strong> within 2
                business days.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false);
                  setForm({ name: '', email: '', subject: '', message: '' });
                }}
              >
                Send another message
              </Button>
            </div>
          )}
        </Card>
      </div>
    </MarketingSection>
  );
}
