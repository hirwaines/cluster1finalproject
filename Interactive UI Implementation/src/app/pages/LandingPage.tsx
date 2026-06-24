import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Brain, TrendingUp, Network, Search, BookOpen, DollarSign, MapPin, CheckCircle, Users, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

export function LandingPage() {
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    toast.success('Message sent! We will get back to you within 2 business days.');
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-blue-900">
              ResearchIQ
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-800 transition-colors">Features</a>
            <a href="#who" className="hover:text-blue-800 transition-colors">Who it's for</a>
            <a href="#how" className="hover:text-blue-800 transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button
              className="bg-blue-900 hover:bg-blue-950"
              onClick={() => navigate('/signup')}
            >
              Get started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-900 text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Built for Rwanda's research ecosystem
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              One platform for
              <span className="block text-blue-900">
                every research institution
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              ResearchIQ connects researchers, institutions, and funders across Rwanda — whether you are a university, a government research body, or a private research organisation. Collaborate, publish, and secure funding in one place.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Verified researcher profiles and publication indexing',
                'Cross-institution collaboration and funding discovery',
                'Analytics and reporting for institutional leadership',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-blue-900 hover:bg-blue-950 text-base px-8"
                onClick={() => navigate('/signup')}
              >
                Create your profile
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-800 text-base px-8"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">500+</div>
                <div className="text-xs text-gray-500 mt-0.5">Researchers</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,200+</div>
                <div className="text-xs text-gray-500 mt-0.5">Publications indexed</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">30+</div>
                <div className="text-xs text-gray-500 mt-0.5">Institutions</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$8M+</div>
                <div className="text-xs text-gray-500 mt-0.5">Funding facilitated</div>
              </div>
            </div>
          </div>

          {/* Right: single meaningful image */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl w-full max-h-[520px]">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&h=600&fit=crop&crop=center"
                alt="Researchers collaborating"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
              🇷🇼 Rwanda-based
            </div>
          </div>
        </div>
      </section>

      {/* Purpose strip */}
      <section className="bg-blue-900 py-14">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Research in Rwanda deserves better infrastructure</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
            Across universities, government agencies, and private research bodies, valuable knowledge is produced every year — yet researchers work in silos, funding opportunities go unnoticed, and cross-institution collaboration remains difficult. ResearchIQ is built to change that.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Everything in one platform</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From researcher profiles to funding discovery — ResearchIQ gives every stakeholder the tools they need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<Search className="w-6 h-6" />} title="Researcher Directory" description="Search and discover verified researchers across institutions by field, department, or publication record." color="blue" />
            <FeatureCard icon={<Users className="w-6 h-6" />} title="Collaboration Matching" description="Find researchers with complementary expertise and send collaboration requests directly through the platform." color="green" />
            <FeatureCard icon={<BookOpen className="w-6 h-6" />} title="Publication Management" description="Submit, index, and showcase research publications. Build a verified profile backed by real academic output." color="blue" />
            <FeatureCard icon={<DollarSign className="w-6 h-6" />} title="Funding Connections" description="Funders discover research projects seeking support. Researchers get matched to relevant funding opportunities." color="green" />
            <FeatureCard icon={<TrendingUp className="w-6 h-6" />} title="Research Analytics" description="Track citations, publication trends, and institutional performance. Leadership gets a clear picture of research output." color="blue" />
            <FeatureCard icon={<Network className="w-6 h-6" />} title="Institutional Oversight" description="Department heads and research managers can approve publications, manage accreditations, and monitor activity." color="green" />
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="who" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Built for every role in research</h2>
            <p className="text-gray-600 text-lg">One platform, tailored experiences for each stakeholder — across any type of institution.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Researchers', icon: '🔬', desc: 'Build your verified profile, publish your work, find collaborators, and track your academic impact.' },
              { role: 'Department Heads', icon: '🏛️', desc: 'Monitor your department\'s research output, manage researcher profiles, and report on performance.' },
              { role: 'Research Managers', icon: '📊', desc: 'Oversee institutional research activities, generate reports, and coordinate cross-department initiatives.' },
              { role: 'Funders', icon: '💼', desc: 'Discover research projects aligned with your priorities and connect directly with research leads.' },
            ].map(item => (
              <div key={item.role} className="p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all bg-white">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.role}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Suitable for universities, government research bodies, private research organisations, and national councils.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-600 text-lg">Getting started takes minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Apply & get verified', desc: 'Submit your researcher application with your academic credentials and publications. An administrator reviews and verifies your profile.' },
              { step: '02', title: 'Build your presence', desc: 'Your expertise profile is built from your indexed publications. Connect with colleagues and join the national research network.' },
              { step: '03', title: 'Collaborate & grow', desc: 'Send and receive collaboration requests, respond to funding opportunities, and track your research impact over time.' },
            ].map(item => (
              <div key={item.step}>
                <div className="text-6xl font-black text-blue-100 mb-4 leading-none">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to join Rwanda's research network?</h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you are a researcher, an institution administrator, or a funder — ResearchIQ gives you the tools to connect, collaborate, and contribute to Rwanda's knowledge economy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-900 hover:bg-blue-950 text-base px-8" onClick={() => navigate('/signup')}>
              Create your account
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:border-white hover:text-white text-base px-8" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">ResearchIQ</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Rwanda's research intelligence platform — connecting researchers, institutions, and funders.
              </p>
              <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                Kigali, Rwanda
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Platform</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Researcher profiles</div>
                <div>Publication index</div>
                <div>Collaboration network</div>
                <div>Funding opportunities</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Institution types</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Universities</div>
                <div>Government research bodies</div>
                <div>Private research organisations</div>
                <div>National councils</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>About ResearchIQ</div>
                <button className="hover:text-white transition-colors text-left" onClick={() => setContactOpen(true)}>Contact us</button>
                <div>Privacy policy</div>
                <div>Terms of use</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <span>© 2026 ResearchIQ. All rights reserved.</span>
            <span>Advancing research in Rwanda 🇷🇼</span>
          </div>
        </div>
      </footer>
      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={v => { setContactOpen(v); if (!v) { setContactSent(false); setContactForm({ name: '', email: '', subject: '', message: '' }); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-800" />
              Contact ResearchIQ
            </DialogTitle>
          </DialogHeader>
          {!contactSent ? (
            <form onSubmit={handleContact} className="space-y-4">
              <p className="text-sm text-gray-500">We typically respond within 2 business days.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cname">Full Name</Label>
                  <Input id="cname" required value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Jane Doe" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cemail">Email Address</Label>
                  <Input id="cemail" required type="email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@auca.edu" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="csubject">Subject</Label>
                <Input id="csubject" required value={contactForm.subject} onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Account registration, Platform inquiry" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cmessage">Message</Label>
                <Textarea id="cmessage" required rows={4} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="How can we help you?" className="mt-1" />
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setContactOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-950">Send Message</Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-bold">Message sent!</h3>
              <p className="text-sm text-gray-600">Thank you, <strong>{contactForm.name}</strong>. We will reply to <strong>{contactForm.email}</strong> within 2 business days.</p>
              <Button className="w-full bg-blue-900" onClick={() => setContactOpen(false)}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green';
}) {
  const bg = color === 'blue' ? 'bg-blue-50' : 'bg-green-50';
  const text = color === 'blue' ? 'text-blue-800' : 'text-green-600';
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center ${text} mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
