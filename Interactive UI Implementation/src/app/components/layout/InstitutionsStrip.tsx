import { PARTNER_INSTITUTIONS, RESEARCH_AREAS } from '../../content/ncst';
import { MarketingSection, SectionHeader } from './MarketingSection';

export function InstitutionsStrip() {
  return (
    <MarketingSection id="network" tone="card">
      <SectionHeader
        eyebrow="Our network"
        title="Partner institutions & research focus"
        description="ResearchIQ prototypes national research coordination — connecting universities with thematic areas aligned to NCST funding and policy priorities."
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Institutions</h3>
          <div className="flex flex-wrap gap-2">
            {PARTNER_INSTITUTIONS.map(name => (
              <span
                key={name}
                className="px-3 py-1.5 rounded-full text-sm bg-brand-muted text-brand border border-brand/20"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Research areas</h3>
          <div className="flex flex-wrap gap-2">
            {RESEARCH_AREAS.map(area => (
              <span
                key={area}
                className="px-3 py-1.5 rounded-full text-sm bg-brand-muted text-brand border border-brand/20"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MarketingSection>
  );
}
