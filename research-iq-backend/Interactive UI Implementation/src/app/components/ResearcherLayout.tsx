/**
 * ResearcherLayout — thin wrapper around AppShell for the researcher role.
 * Kept for backward compatibility: all researcher pages import this.
 */
import { AppShell } from './AppShell';

export function ResearcherLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
