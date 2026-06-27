import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import {
  MarketingNav,
  SiteFooter,
  AboutSection,
  FeatureCard,
  RoleCard,
  InstitutionsStrip,
  MarketingSection,
  SectionHeader,
  ContactSection,
  useLandingSectionScroll,
} from '../components/layout';
import {
  TrendingUp,
  Network,
  Search,
  BookOpen,
  DollarSign,
  MapPin,
  CheckCircle,
  Users,
  FlaskConical,
  Building2,
  BarChart3,
  Landmark,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { HERO_BULLETS, NCST, PLATFORM_STATS } from '../content/ncst';
import { marketingHeroBadgeClass, marketingBtnOutlineOnLight } from '../components/layout/marketingStyles';

export function LandingPage() {
  const navigate = useNavigate();
  const { scrollFromLocation, location } = useLandingSectionScroll();

  useEffect(() => {
    scrollFromLocation();
  }, [location.pathname, location.hash, location.state]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />

      <MarketingSection id="home" tone="hero" variant="hero">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className={marketingHeroBadgeClass + ' mb-6'}>
              <MapPin className="w-4 h-4" />
              {NCST.shortName} case study · {NCST.country}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-6">
              National research intelligence
              <span className="block text-brand">for Rwanda&apos;s science ecosystem</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              ResearchIQ connects researchers, universities, and funders under one platform — supporting the{' '}
              {NCST.fullName}&apos;s mission to strengthen science, technology, and innovation across Rwanda.
            </p>
            <ul className="space-y-3 mb-8">
              {HERO_BULLETS.map(item => (
                <li key={item} className="flex items-start gap-3 text-foreground/90">
                  <CheckCircle className="w-5 h-5 text-brand mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-base px-8" onClick={() => navigate('/signup')}>
                Create your profile
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={marketingBtnOutlineOnLight + ' text-base px-8'}
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-border">
              {PLATFORM_STATS.map(stat => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className={`text-2xl font-bold ${stat.accent === 'brand' ? 'text-brand' : 'text-brand-dark'}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center">
            <div className="rounded-2xl overflow-hidden shadow-xl w-full max-h-[480px] ring-1 ring-border">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&h=600&fit=crop&crop=center"
                alt="Researchers collaborating at a Rwandan university"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-3 -right-3 bg-brand text-brand-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
              🇷🇼 {NCST.city}, {NCST.country}
            </div>
            <div className="absolute -bottom-5 -left-5 bg-card border border-border rounded-xl shadow-xl p-5 max-w-[280px] ring-1 ring-black/5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">How it works</p>
              <ol className="space-y-2.5">
                {[
                  'Apply and get verified by your institution',
                  'Build a profile from publications',
                  'Collaborate and align with funders',
                ].map((line, i) => (
                  <li key={line} className="flex gap-2.5 text-xs text-muted-foreground leading-snug">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-muted text-brand text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {line}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </MarketingSection>

      <AboutSection />
      <InstitutionsStrip />

      <MarketingSection id="services" tone="muted">
        <SectionHeader
          eyebrow="Services"
          title="What ResearchIQ provides"
          description="Platform capabilities designed for Rwanda's research community and institutional stakeholders."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard icon={<Search className="w-6 h-6" />} title="Researcher Directory" description="Discover verified researchers across UR, AUCA, ALU, and partner institutions by field, department, or publication record." accent="brand" />
          <FeatureCard icon={<Users className="w-6 h-6" />} title="Collaboration Matching" description="Identify complementary expertise and initiate collaboration requests across faculties and universities." accent="rw" />
          <FeatureCard icon={<BookOpen className="w-6 h-6" />} title="Publication Management" description="Submit and index research output. Build verified profiles grounded in publications, keywords, and citation data." accent="brand" />
          <FeatureCard icon={<DollarSign className="w-6 h-6" />} title="Funding Alignment" description="Match researchers to NCST grants, development partner calls, and international funding opportunities." accent="rw" />
          <FeatureCard icon={<TrendingUp className="w-6 h-6" />} title="Research Analytics" description="Track publication trends, citation growth, and thematic strengths for departmental and national planning." accent="brand" />
          <FeatureCard icon={<Network className="w-6 h-6" />} title="Institutional Oversight" description="Enable research managers and department heads to approve submissions, monitor activity, and produce reports." accent="rw" />
        </div>
      </MarketingSection>

      <MarketingSection id="stakeholders" tone="card">
        <SectionHeader
          eyebrow="Stakeholders"
          title="Built for every role in research"
          description="Role-based dashboards for researchers, institutional leadership, funders, and system administrators."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RoleCard icon={FlaskConical} role="Researchers" description="Build a verified profile, publish work, find collaborators, and track academic impact across national networks." />
          <RoleCard icon={Building2} role="Department Heads" description="Monitor faculty output, manage researcher profiles, and report on departmental performance." />
          <RoleCard icon={BarChart3} role="Research Managers" description="Oversee institutional research activity, coordinate initiatives, and generate evidence-based reports." />
          <RoleCard icon={Landmark} role="Funders & partners" description="Discover projects aligned with national priorities and connect with principal investigators." />
        </div>
      </MarketingSection>

      <ContactSection id="contact" tone="default" />

      <SiteFooter />
    </div>
  );
}
