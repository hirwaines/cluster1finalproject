# Pull Request: Frontend layout, navigation, and NCST design system

**Branch:** `fix/frontend` → `main`  
**Suggested PR title:** `fix(frontend): unify AppShell layout, dynamic page headers, and admin dashboard navigation`

---

## Summary

This PR completes the ResearchIQ frontend redesign and layout unification work on the `fix/frontend` branch. It replaces fragmented per-page shells with a single **AppShell** for all authenticated roles, applies the **NCST blue** design system consistently, and fixes critical navigation bugs where sidebar clicks updated the URL but page content did not change.

Key outcomes:

- One shared sidebar + top header for researcher, admin, manager, funder, and department head workspaces
- **Dynamic page titles** driven by the active sidebar item (no more static “Institutional Administration” on every admin screen)
- **Admin default landing** on a real **Dashboard** overview (`?tab=overview`), not Accreditations
- **Reliable tab switching** via `useDashboardTab` synced to `location.search`
- Centralized navigation config in `src/app/config/navigation.ts`
- Responsive, full-width dashboard layouts across roles
- Backend demo/auth support aligned with multi-role QA (seed users, contact endpoint, MFA email logging)

---

## What changed

### Layout & navigation

- `AppShell` in `ResearcherLayout.tsx` wraps all authenticated routes via nested `routes.tsx` layout
- Sidebar sections and links defined in `config/navigation.ts` (role-based menus, badges, home paths)
- `navStyles.tsx` maps nav IDs to icons and active-state logic (`isNavActive`, unique `?tab=` URLs per admin/manager tab)
- `pageMeta.ts` + `ShellPageHeader` + `PageHeaderContext` provide one reusable page header tied to sidebar selection
- Per-page duplicate `DashboardPageHeader` blocks removed from ~20 pages; action buttons registered via `usePageHeaderActions`

### Admin dashboard

- New **Dashboard** tab (`/admin/dashboard?tab=overview`) as default login destination
- Overview shows platform stats, administration queues, system shortcuts, and platform snapshot
- Accreditations, Publications, Funders, Users, and Import each render only their own tab content
- Tab content now follows URL changes when clicking sidebar items

### Design system

- `theme.css`: NCST blue primary/secondary; green success tokens remapped to blue; `.app-workspace` typography overrides
- Shared layout tokens in `dashboardStyles.ts`, compact `StatCard`, blue chart colors
- Marketing/auth pages use `AuthShell`, `BrandLogo`, and consolidated marketing layout components
- Removed obsolete pages: `ResearcherDashboard`, `DiscoverPage`, `FindCollaborators`, `ProjectsBrowse`, `DashboardCustomizer`

### Bug fixes

- Fixed sidebar rendering raw CSS class strings (`NavActiveIndicator` as component)
- Fixed multiple nav items appearing active (unique tab hrefs + `isNavActive`)
- Fixed React hooks order violations in dashboard pages that caused white-screen crashes
- Fixed sidebar navigation to use full `navigate(href)` for query-string routes
- Route guard redirects users to role home when hitting disallowed paths

### Backend (included on branch)

- Demo user seeding, RBAC defaults, contact form API
- Email service improvements for OTP delivery / dev logging
- Auth and security config updates for new endpoints

---

## Files of note

| Area | Path |
|------|------|
| App shell | `Interactive UI Implementation/src/app/components/ResearcherLayout.tsx` |
| Navigation config | `Interactive UI Implementation/src/app/config/navigation.ts` |
| Page header system | `Interactive UI Implementation/src/app/components/layout/pageMeta.ts`, `ShellPageHeader.tsx`, `context/PageHeaderContext.tsx` |
| Tab hook | `Interactive UI Implementation/src/app/hooks/useDashboardTab.ts` |
| Admin dashboard | `Interactive UI Implementation/src/app/pages/AdminDashboard.tsx` |
| Routes | `Interactive UI Implementation/src/app/routes.tsx` |
| Theme | `Interactive UI Implementation/src/styles/theme.css` |

---

## Test plan

### Auth & roles

- [ ] Log in as **admin** (`ineshirwa8@gmail.com` / demo password) → lands on **Dashboard** (`?tab=overview`)
- [ ] Log in as **researcher**, **manager**, **funder**, **department head** (demo accounts) → each lands on correct role home

### Admin navigation

- [ ] Sidebar **Dashboard** → overview stats, queues, system links
- [ ] **Accreditations** → only accreditation queue (not overview stats)
- [ ] **Publications**, **Funders**, **Users**, **Import** → each tab shows distinct content; header title updates
- [ ] **Processing**, **Security**, **Reports**, **Data sync** → separate pages load under AppShell

### Other roles

- [ ] Researcher: Feed, Inbox, Analytics, Network, Trends, Funding all open with correct headers
- [ ] Manager: Overview tab + tool pages (Report builder, Expertise, Network)
- [ ] Funder: Overview / Discover / Portfolio / Opportunities tabs switch correctly
- [ ] Dept head: Overview / Faculty / Performance / Funding tabs switch correctly

### Visual QA

- [ ] No army-green tints; titles use NCST blue (`text-brand-dark`)
- [ ] Sidebar active state: single highlighted item per route/tab
- [ ] Layout fills laptop width (no oversized side margins)
- [ ] `npm run build` passes in `Interactive UI Implementation/`

### Backend (if testing locally)

- [ ] `./gradlew bootRun` with `dev` profile; MFA OTP appears in backend terminal log
- [ ] Contact form submission succeeds from `/contact`

---

## How to create the PR

```bash
git checkout fix/frontend
git pull origin fix/frontend
# After push completes, open PR on GitHub:
gh pr create --base main --head fix/frontend --title "fix(frontend): unify AppShell layout, dynamic page headers, and admin dashboard navigation" --body-file PR_REQUEST.md
```

Or paste the **Summary**, **What changed**, and **Test plan** sections above into the GitHub PR form manually.

---

## Notes for reviewers

- Large diff is expected: this branch replaces legacy standalone dashboards and migrates token styling across the app
- Deleted PNG/doc assets in repo root were design reference screenshots, not runtime assets
- `Interactive UI Implementation/temp-check-build/` is a local build artifact and is **not** included in the commit
