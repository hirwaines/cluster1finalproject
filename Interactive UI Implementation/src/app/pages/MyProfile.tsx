import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { StatCard, dashboardStatGridClass } from '../components/layout';
import { usePageHeaderActions } from '../context/PageHeaderContext';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import {
  Edit, Users, TrendingUp, Award, BookOpen, Calendar, UserPlus,
  Heart, ExternalLink, Building2, DollarSign, BarChart3, FileText, Shield,
} from 'lucide-react';

// ── Researcher Profile ────────────────────────────────────────────────────────
function ResearcherProfile({ user, research, navigate }: { user: ReturnType<typeof useApp>['user']; research: ReturnType<typeof useApp>['research']; navigate: ReturnType<typeof useNavigate> }) {
  const [activeTab, setActiveTab] = useState<'publications' | 'followers'>('publications');
  if (!user) return null;

  const expertiseFreq = keywordFrequencyFromPublications(user.id, research);
  const myPublications = research.filter(r => r.researcherId === user.id);

  return (
    <>
      <Card className="p-5 sm:p-6 mb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28 bg-brand flex items-center justify-center text-white font-semibold text-4xl shrink-0">
            {user.name.charAt(0)}
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold sm:text-2xl">{user.name}</h2>
                {user.verified && <span className="text-emerald-700 text-sm font-semibold">Verified ✓</span>}
                {user.accredited && (
                  <Badge className="bg-slate-100 text-slate-800 border border-slate-200">
                    <Award className="w-3 h-3 mr-1" />
                    Accredited
                  </Badge>
                )}
              </div>
              <p className="text-base text-muted-foreground mb-1 sm:text-lg">
                {user.position ? `${user.position} • ` : ''}
                {user.department && `${user.department} • `}
                {user.institution}
              </p>
              {user.orcid && (
                <p className="text-xs text-muted-foreground font-mono">ORCID: {user.orcid}</p>
              )}
            </div>

            <div className={dashboardStatGridClass}>
              <StatCard label="Publications" value={user.publications || 0} icon={BookOpen} accent="brand" />
              <StatCard label="Citations" value={user.citations || 0} icon={TrendingUp} accent="info" />
              <StatCard label="h-index" value={user.hIndex || 0} icon={Award} accent="dark" />
              <StatCard label="Followers" value={0} icon={Heart} accent="brand" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold text-muted-foreground mb-3">RESEARCH EXPERTISE</div>
          <div className="flex flex-wrap gap-2">
            {expertiseFreq.length ? (
              expertiseFreq.map(({ keyword, publicationCount }) => (
                <Badge key={keyword} className="bg-brand-muted text-brand border border-border px-3 py-1 font-normal">
                  {keyword} <span className="text-brand/70 ml-1">({publicationCount})</span>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No indexed publications yet — upload works to populate this section.</p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex gap-6 mb-6 border-b border-border">
        {(['publications', 'followers'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-2 font-medium capitalize transition-all ${
              activeTab === tab ? 'text-brand border-b-2 border-brand' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              {tab === 'publications' ? <BookOpen className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              {tab}
            </div>
          </button>
        ))}
      </div>

      {activeTab === 'publications' && (
        <div className="space-y-6">
          {user.openalexPublications && user.openalexPublications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">OpenAlex Publications</h3>
                <Badge className="bg-brand-muted text-brand border border-border text-xs">{user.openalexPublications.length} works</Badge>
              </div>
              <div className="space-y-3">
                {user.openalexPublications.map((pub, i) => (
                  <Card key={i} className="p-5 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold mb-1 leading-snug">{pub.title ?? 'Untitled'}</h4>
                        {pub.journal && <p className="text-xs text-muted-foreground mb-2 italic">{pub.journal}</p>}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {pub.year && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{pub.year}</span>}
                          {pub.citedByCount != null && (
                            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{pub.citedByCount} citations</span>
                          )}
                        </div>
                      </div>
                      {pub.doi && (
                        <a href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-1 text-xs text-brand hover:underline">
                          Read <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {myPublications.length > 0 ? (
            <div>
              {user.openalexPublications && user.openalexPublications.length > 0 && (
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Uploaded Research</div>
              )}
              <div className="space-y-4">
                {myPublications.map(pub => (
                  <Card key={pub.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex gap-4">
                      {pub.coverImage && (
                        <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img src={pub.coverImage} alt={pub.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base font-semibold text-brand">{pub.title}</h3>
                          {pub.fundingStatus && (
                            <Badge className={
                              pub.fundingStatus === 'funded' ? 'bg-success-muted text-success-foreground' :
                              pub.fundingStatus === 'seeking' ? 'bg-warning-muted text-warning-foreground' :
                              'bg-muted text-foreground'
                            }>
                              {pub.fundingStatus}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3 line-clamp-2">{pub.abstract}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {pub.keywords.slice(0, 4).map(k => (
                            <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{pub.publicationDate}</span>
                          <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />{pub.citations} citations</span>
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{pub.authors.length} authors</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : !user.openalexPublications?.length ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-base font-semibold mb-2">No publications yet</h3>
              <p className="text-muted-foreground mb-4">Start sharing your research with the community</p>
              <Button onClick={() => navigate('/researcher/upload')}>Share your first research</Button>
            </Card>
          ) : null}
        </div>
      )}

      {activeTab === 'followers' && (
        <Card className="p-12 text-center border-2 border-dashed border-border">
          <UserPlus className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-base font-semibold mb-2 text-muted-foreground">No followers yet</h3>
          <p className="text-muted-foreground text-sm">Share your research to gain followers from the community.</p>
          <Button className="mt-4" onClick={() => navigate('/researcher/upload')}>Share research</Button>
        </Card>
      )}
    </>
  );
}

// ── Funder Profile ────────────────────────────────────────────────────────────
function FunderProfile({ user }: { user: ReturnType<typeof useApp>['user'] }) {
  if (!user) return null;
  const org = user.organizationName || user.name;
  const areas = user.areasOfInterest || [];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <Avatar className="w-24 h-24 bg-brand-dark flex items-center justify-center text-white font-bold text-4xl shrink-0">
            {org.charAt(0)}
          </Avatar>
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold sm:text-2xl mb-1">{org}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              {user.verified && <span className="text-emerald-700 text-sm font-semibold mt-1 block">Verified funder ✓</span>}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-brand-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1 text-brand">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Investment Range</span>
                </div>
                <p className="font-semibold">{user.investmentRange || 'Not specified'}</p>
              </div>
              <div className="bg-brand-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1 text-brand">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Role</span>
                </div>
                <p className="font-semibold capitalize">Funding Partner</p>
              </div>
              <div className="bg-brand-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1 text-brand">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Active interests</span>
                </div>
                <p className="font-semibold">{areas.length}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {areas.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Areas of Interest</h3>
          <div className="flex flex-wrap gap-2">
            {areas.map(area => (
              <Badge key={area} className="bg-brand-muted text-brand border border-border px-3 py-1">{area}</Badge>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-2">Contact</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-xs text-muted-foreground mt-1">To update your organization name or areas of interest, click "Edit profile" above.</p>
      </Card>
    </div>
  );
}

// ── Staff Profile (admin / manager / dept_head) ───────────────────────────────
function StaffProfile({ user, research, researchers }: { user: ReturnType<typeof useApp>['user']; research: ReturnType<typeof useApp>['research']; researchers: ReturnType<typeof useApp>['researchers'] }) {
  if (!user) return null;

  const roleLabel: Record<string, string> = {
    admin: 'System Administrator',
    manager: 'Research Manager',
    department_head: 'Department Head',
  };

  const roleIcon: Record<string, React.ElementType> = {
    admin: Shield,
    manager: BarChart3,
    department_head: Users,
  };

  const RoleIcon = roleIcon[user.role] ?? Shield;

  const managedResearchers = user.role === 'department_head'
    ? researchers.filter(r => r.department === user.department)
    : researchers.filter(r => r.role === 'researcher');

  const managedPublications = user.role === 'department_head'
    ? research.filter(p => managedResearchers.some(r => r.id === p.researcherId))
    : research;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <Avatar className="w-24 h-24 bg-brand-dark flex items-center justify-center text-white font-bold text-4xl shrink-0">
            {user.name.charAt(0)}
          </Avatar>
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold sm:text-2xl">{user.name}</h2>
                {user.verified && <span className="text-emerald-700 text-sm font-semibold">Verified ✓</span>}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <RoleIcon className="w-4 h-4" />
                <span className="text-sm">{roleLabel[user.role] ?? user.role}</span>
              </div>
              {(user.department || user.institution) && (
                <p className="text-sm text-muted-foreground">
                  {user.department && `${user.department} • `}{user.institution}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-brand-muted/50 rounded-lg p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Researchers</div>
                <div className="text-2xl font-semibold text-brand-dark">{managedResearchers.length}</div>
              </div>
              <div className="bg-brand-muted/50 rounded-lg p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Publications</div>
                <div className="text-2xl font-semibold text-brand-dark">{managedPublications.length}</div>
              </div>
              {user.role === 'admin' && (
                <>
                  <div className="bg-brand-muted/50 rounded-lg p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Total users</div>
                    <div className="text-2xl font-semibold text-brand-dark">{researchers.length}</div>
                  </div>
                  <div className="bg-brand-muted/50 rounded-lg p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Indexed research</div>
                    <div className="text-2xl font-semibold text-brand-dark">{research.length}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand" />
          {user.role === 'department_head' ? 'Department Research' : 'Platform Activity'}
        </h3>
        {managedPublications.slice(0, 5).map(pub => (
          <div key={pub.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{pub.title}</p>
              <p className="text-xs text-muted-foreground">{pub.field} · {pub.publicationDate}</p>
            </div>
            <Badge variant="secondary" className="shrink-0 ml-3 text-xs">{pub.citations} citations</Badge>
          </div>
        ))}
        {managedPublications.length === 0 && (
          <p className="text-sm text-muted-foreground">No publications in scope yet.</p>
        )}
      </Card>
    </div>
  );
}

// ── Main MyProfile ────────────────────────────────────────────────────────────
export function MyProfile() {
  const navigate = useNavigate();
  const { user, research, researchers } = useApp();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const headerActions = useMemo(
    () => (
      <Button onClick={() => navigate('/settings')}>
        <Edit className="w-4 h-4 mr-2" />
        Edit profile
      </Button>
    ),
    [navigate],
  );
  usePageHeaderActions(headerActions);

  if (!user) return null;

  if (user.role === 'funder') {
    return <FunderProfile user={user} />;
  }

  if (['admin', 'manager', 'department_head'].includes(user.role)) {
    return <StaffProfile user={user} research={research} researchers={researchers} />;
  }

  return <ResearcherProfile user={user} research={research} navigate={navigate} />;
}
