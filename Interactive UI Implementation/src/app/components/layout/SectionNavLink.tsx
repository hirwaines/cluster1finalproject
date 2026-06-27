import { ReactNode } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { MapPin } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { Button } from '../ui/button';
import { NCST, PARTNER_INSTITUTIONS } from '../../content/ncst';
import { parseSectionId, scrollToSection } from './scrollToSection';
import {
  marketingNavLinkClass,
  marketingNavClass,
  marketingBtnPrimaryOnDark,
  marketingDarkSectionClass,
} from './marketingStyles';
import { cn } from '../ui/utils';

type SectionNavLinkProps = {
  to: string;
  label: string;
  className?: string;
};

export function SectionNavLink({ to, label, className }: SectionNavLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionId = parseSectionId(to);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!sectionId) return;
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection(sectionId);
      window.history.replaceState(null, '', `#${sectionId}`);
      return;
    }
    navigate('/', { state: { scrollTo: sectionId } });
  };

  if (!sectionId) {
    return (
      <a href={to} className={cn(marketingNavLinkClass, className)}>
        {label}
      </a>
    );
  }

  return (
    <a href={`/#${sectionId}`} onClick={handleClick} className={cn(marketingNavLinkClass, className)}>
      {label}
    </a>
  );
}

export function useLandingSectionScroll() {
  const location = useLocation();

  const scrollFromLocation = () => {
    const state = location.state as { scrollTo?: string } | null;
    const sectionId = state?.scrollTo || window.location.hash.replace('#', '');
    if (!sectionId || location.pathname !== '/') return;

    const scroll = () => {
      scrollToSection(sectionId);
      window.history.replaceState(state ?? null, '', `#${sectionId}`);
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scroll);
    });
  };

  return { scrollFromLocation, location };
}

type NavLink = { to: string; label: string };

export const LANDING_NAV_LINKS: NavLink[] = [
  { to: '/#about', label: 'About' },
  { to: '/#network', label: 'Network' },
  { to: '/#services', label: 'Services' },
  { to: '/#stakeholders', label: 'Stakeholders' },
  { to: '/#contact', label: 'Contact' },
];

type MarketingNavProps = {
  links?: NavLink[];
  actions?: ReactNode;
};

export function MarketingNav({ links = LANDING_NAV_LINKS, actions }: MarketingNavProps) {
  const navigate = useNavigate();

  return (
    <nav className={cn(marketingNavClass)}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-4 min-w-0 shrink-0">
          <BrandLogo variant="onDark" />
          <span className="hidden lg:inline text-xs font-medium text-white/60 border-l border-white/20 pl-4 truncate">
            {NCST.shortName} · {NCST.country}
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <SectionNavLink key={link.to} to={link.to} label={link.label} />
          ))}
        </div>
        {actions ?? (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-white hover:bg-white/10 hidden sm:inline-flex"
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
            <Button size="sm" className={marketingBtnPrimaryOnDark} onClick={() => navigate('/signup')}>
              Get started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

type FooterLink = { label: string; to: string };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-white/90 text-sm uppercase tracking-wide">{title}</h4>
      <ul className="space-y-2.5 text-sm text-white/60">
        {links.map(link => {
          const isSection = link.to.includes('#');
          return (
            <li key={link.label}>
              {isSection ? (
                <SectionNavLink
                  to={link.to}
                  label={link.label}
                  className="hover:text-white transition-colors text-white/60 text-sm"
                />
              ) : (
                <Link to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const aboutLinks: FooterLink[] = [
    { label: 'About the platform', to: '/#about' },
    { label: 'Partner network', to: '/#network' },
    { label: 'Stakeholders', to: '/#stakeholders' },
  ];

  const serviceLinks: FooterLink[] = [
    { label: 'Platform services', to: '/#services' },
    { label: 'Researcher directory', to: '/#services' },
    { label: 'Publication indexing', to: '/#services' },
    { label: 'Collaboration matching', to: '/#services' },
    { label: 'Funding alignment', to: '/#services' },
    { label: 'Institutional analytics', to: '/#services' },
  ];

  const legalLinks: FooterLink[] = [
    { label: 'Contact us', to: '/#contact' },
    { label: 'Privacy policy', to: '/contact' },
    { label: 'Terms of use', to: '/contact' },
  ];

  return (
    <footer className={cn(marketingDarkSectionClass, 'border-t border-white/10 mt-auto')}>
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          <div className="lg:col-span-4">
            <BrandLogo variant="onDark" className="mb-4" />
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              National research intelligence for {NCST.country} — connecting universities, {NCST.shortName}, and funders
              through one verified platform.
            </p>
            <div className="flex items-center gap-1.5 text-sm text-white/50">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {NCST.city}, {NCST.country}
            </div>
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="About" links={aboutLinks} />
          </div>
          <div className="lg:col-span-3">
            <FooterColumn title="Services" links={serviceLinks} />
          </div>
          <div className="lg:col-span-3">
            <FooterColumn title="Contact & legal" links={legalLinks} />
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/45 text-xs md:text-sm">
          <span>© {new Date().getFullYear()} ResearchIQ · {NCST.shortName} case study prototype</span>
          <span className="text-white/40">
            {PARTNER_INSTITUTIONS.length}+ partner institutions · {NCST.country} 🇷🇼
          </span>
        </div>
      </div>
    </footer>
  );
}
