import { Eye, Link2, BarChart3 } from 'lucide-react';
import { NCST } from '../../content/ncst';
import { MarketingSection, SectionHeader } from './MarketingSection';

const PILLARS = [
  {
    icon: Eye,
    title: 'National visibility',
    description:
      'Surface verified researchers and publications from University of Rwanda, INES, ALU, and partner institutions in one directory.',
  },
  {
    icon: Link2,
    title: 'Cross-institution connection',
    description:
      'Enable collaboration across agriculture, health, ICT, and environment — aligned with NCST grant programmes.',
  },
  {
    icon: BarChart3,
    title: 'Evidence for leadership',
    description:
      'Give research managers consolidated analytics to support reporting, accreditation, and strategic planning.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Apply & get verified',
    desc: 'Researchers and funders submit credentials. An institutional administrator reviews and activates the account.',
  },
  {
    step: '02',
    title: 'Build your profile',
    desc: 'Expertise is derived from indexed publications and keywords across Rwanda\'s research network.',
  },
  {
    step: '03',
    title: 'Collaborate & align',
    desc: 'Send collaboration requests, respond to funding opportunities, and track impact through analytics.',
  },
];

export function AboutSection() {
  return (
    <MarketingSection id="about" tone="card">
      <SectionHeader
        eyebrow={`About · ${NCST.shortName}`}
        title="Research in Rwanda deserves better infrastructure"
        description={`ResearchIQ is a national research intelligence prototype supporting the ${NCST.fullName}'s mission to strengthen science, technology, and innovation across Rwanda.`}
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Rwanda produces valuable research every year across its universities and research institutes — yet
            information remains scattered across departments, repositories, and individual profiles. Researchers
            miss collaboration opportunities, funding calls go unnoticed, and institutional leaders lack a unified
            view of national research output.
          </p>
          <p>
            The national research agenda spans agriculture, health, ICT, engineering, education, economics, law, and
            environmental science. ResearchIQ was built to close that gap with verified profiles, publication
            indexing, collaboration matching, funding discovery, and analytics dashboards.
          </p>
        </div>
        <div className="grid gap-4">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4 p-5 rounded-xl bg-background border border-border shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-brand-muted flex items-center justify-center text-brand shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-16 pt-14 border-t border-border">
        <div className="absolute -top-3.5 left-0 lg:left-8 bg-brand text-brand-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-md">
          How it works
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {HOW_IT_WORKS.map(item => (
            <div key={item.step} className="p-6 rounded-xl bg-background border border-border shadow-sm">
              <div className="text-4xl font-display text-brand/30 mb-3 leading-none">{item.step}</div>
              <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MarketingSection>
  );
}
