import { MarketingNav, SiteFooter, ContactSection } from '../components/layout';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />
      <ContactSection id="contact-page" tone="muted" />
      <SiteFooter />
    </div>
  );
}
