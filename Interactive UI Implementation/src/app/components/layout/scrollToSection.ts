/** Scroll to a landing-page section, accounting for sticky nav height */
export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function parseSectionId(href: string): string | null {
  const hash = href.includes('#') ? href.split('#').pop() : null;
  return hash && hash.length > 0 ? hash : null;
}
