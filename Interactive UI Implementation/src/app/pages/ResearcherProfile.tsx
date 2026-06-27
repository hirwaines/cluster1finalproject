import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft, Mail, BookOpen, Award, TrendingUp, Heart,
  UserPlus, MapPin, Globe, Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export function ResearcherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { researchers, research } = useApp();
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<'publications' | 'about'>('publications');

  const researcher = researchers.find(r => r.id === id);
  const researcherPapers = research.filter(r => r.researcherId === id);

  if (!researcher) {
    return (
      <>
        <div className="p-12 text-center">
          <h2 className="text-base font-semibold mb-2">Researcher not found</h2>
          <Button variant="outline" onClick={() => navigate(-1 as any)}>Go back</Button>
        </div>
      </>
    );
  }

  const handleFollow = () => {
    setFollowed(f => !f);
    toast.success(followed ? `Unfollowed ${researcher.name}` : `Now following ${researcher.name}`);
  };

  const handleContact = () => {
    if (researcher.email) {
      window.location.href = `mailto:${researcher.email}`;
    } else {
      toast.info('No email address on record for this researcher.');
    }
  };

  return (
    <>
      <div className="w-full">
        {/* Back */}
        <button
          onClick={() => navigate(-1 as any)}
          className="flex items-center gap-2 text-muted-foreground hover:text-brand mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile header card */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-28 h-28 bg-brand flex items-center justify-center text-white font-bold text-5xl shrink-0">
              {researcher.name.charAt(0)}
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-2xl font-semibold tabular-nums sm:text-3xl">{researcher.name}</h1>
                    {researcher.verified && (
                      <span className="text-emerald-700 text-sm font-semibold">Verified ✓</span>
                    )}
                    {researcher.accredited && (
                      <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                        <Award className="w-3 h-3 mr-1" /> Accredited
                      </Badge>
                    )}
                  </div>
                  {researcher.position && (
                    <p className="text-muted-foreground font-medium">{researcher.position}</p>
                  )}
                  <p className="text-muted-foreground">{researcher.department}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={followed ? 'outline' : 'default'}
                    className={followed ? 'border-pink-200 text-pink-600' : ''}
                    onClick={handleFollow}
                  >
                    {followed ? (
                      <><Heart className="w-4 h-4 mr-2 fill-current" /> Following</>
                    ) : (
                      <><UserPlus className="w-4 h-4 mr-2" /> Follow</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleContact}>
                    <Mail className="w-4 h-4 mr-2" /> Contact
                  </Button>
                </div>
              </div>

              {/* Institution & location */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                {researcher.institution && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-muted-foreground/70" />
                    {researcher.institution}
                  </span>
                )}
                {researcher.email && (
                  <a href={`mailto:${researcher.email}`} className="flex items-center gap-1.5 hover:text-brand">
                    <Mail className="w-4 h-4 text-muted-foreground/70" />
                    {researcher.email}
                  </a>
                )}
                {researcher.orcid && (
                  <a href={`https://orcid.org/${researcher.orcid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-success">
                    <Globe className="w-4 h-4 text-muted-foreground/70" />
                    ORCID: {researcher.orcid}
                  </a>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-brand-muted p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-brand">{researcher.publications}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Publications</div>
                </div>
                <div className="bg-success-muted/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-success-foreground">{researcher.citations}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Citations</div>
                </div>
                <div className="bg-brand-muted p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-brand">{researcher.hIndex}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">h-index</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-brand-dark">{researcherPapers.length}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Papers here</div>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-pink-600">{followed ? 1 : 0}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Followers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Expertise tags */}
          {researcher.expertise && researcher.expertise.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border">
              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Research expertise</div>
              <div className="flex flex-wrap gap-2">
                {researcher.expertise.map(exp => (
                  <Badge key={exp} className="bg-brand-muted text-brand border border-border">{exp}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('publications')}
            className={`pb-3 px-1 font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'publications' ? 'text-brand border-b-2 border-brand' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <BookOpen className="w-4 h-4" /> Publications ({researcherPapers.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-1 font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'about' ? 'text-brand border-b-2 border-brand' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Award className="w-4 h-4" /> About & Contact
          </button>
        </div>

        {/* Publications tab */}
        {activeTab === 'publications' && (
          <div className="space-y-4">
            {researcherPapers.length > 0 ? (
              researcherPapers.map(paper => (
                <Card
                  key={paper.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/research/${paper.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-brand hover:underline flex-1 mr-4">{paper.title}</h3>
                    <Badge className={
                      paper.fundingStatus === 'funded' ? 'bg-success-muted text-success-foreground shrink-0' :
                      paper.fundingStatus === 'seeking' ? 'bg-warning-muted text-warning-foreground shrink-0' :
                      'bg-muted text-foreground shrink-0'
                    }>
                      {paper.fundingStatus}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{paper.abstract}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {paper.keywords.slice(0, 4).map(k => (
                      <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{paper.publicationDate}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />{paper.citations} citations</span>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center border-2 border-dashed border-border">
                <BookOpen className="w-14 h-14 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No publications available for this researcher.</p>
              </Card>
            )}
          </div>
        )}

        {/* About tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <Card className="p-6">
              <h2 className="font-semibold text-base mb-4">Contact information</h2>
              <div className="space-y-3 text-sm">
                {researcher.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand shrink-0" />
                    <a href={`mailto:${researcher.email}`} className="text-brand hover:underline">{researcher.email}</a>
                  </div>
                )}
                {researcher.institution && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                    <span className="text-foreground">{researcher.institution}</span>
                  </div>
                )}
                {researcher.department && (
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground/70 shrink-0" />
                    <span className="text-foreground">{researcher.department}</span>
                  </div>
                )}
                {researcher.orcid && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-success shrink-0" />
                    <a
                      href={`https://orcid.org/${researcher.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-success-foreground hover:underline"
                    >
                      ORCID: {researcher.orcid}
                    </a>
                  </div>
                )}
                {!researcher.email && !researcher.orcid && (
                  <p className="text-muted-foreground/70 italic text-xs">No contact details shared by this researcher.</p>
                )}
              </div>
              <Button className="mt-5 w-full " onClick={handleContact}>
                <Mail className="w-4 h-4 mr-2" /> Send email
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-base mb-4">Academic profile</h2>
              <div className="space-y-3 text-sm">
                {researcher.position && (
                  <div>
                    <span className="font-medium text-foreground">Position</span>
                    <p className="text-muted-foreground mt-0.5">{researcher.position}</p>
                  </div>
                )}
                {researcher.department && (
                  <div>
                    <span className="font-medium text-foreground">Department</span>
                    <p className="text-muted-foreground mt-0.5">{researcher.department}</p>
                  </div>
                )}
                {researcher.institution && (
                  <div>
                    <span className="font-medium text-foreground">Institution</span>
                    <p className="text-muted-foreground mt-0.5">{researcher.institution}</p>
                  </div>
                )}
                {researcher.expertise && researcher.expertise.length > 0 && (
                  <div>
                    <span className="font-medium text-foreground">Research areas</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {researcher.expertise.map(e => (
                        <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
