import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import { Edit, Users, TrendingUp, Award, BookOpen, Calendar, UserPlus, Heart } from 'lucide-react';

export function MyProfile() {
  const navigate = useNavigate();
  const { user, research } = useApp();

  const expertiseFreq = user ? keywordFrequencyFromPublications(user.id, research) : [];
  const [activeTab, setActiveTab] = useState<'publications' | 'followers'>('publications');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const myPublications = research.filter(r => r.researcherId === user.id);

  return (
      <div className="p-8 max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="w-32 h-32 bg-brand flex items-center justify-center text-white font-bold text-5xl">
              {user.name.charAt(0)}
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    {user.verified && (
                      <span className="text-emerald-700 text-sm font-semibold">Verified ✓</span>
                    )}
                    {user.accredited && (
                      <Badge className="bg-slate-100 text-slate-800 border border-slate-200">
                        <Award className="w-3 h-3 mr-1" />
                        Accredited
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl text-muted-foreground mb-2">
                    {user.position ? `${user.position} • ` : ''}
                    {user.department && `${user.department} • `}
                    {user.institution}
                  </p>
                  <p className="text-muted-foreground max-w-2xl text-sm">
                    Your expertise profile is derived from your indexed publications.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button className="" onClick={() => navigate('/settings')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit profile
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-brand-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-brand mb-1">{user.publications || 0}</div>
                  <div className="text-sm text-muted-foreground">Publications</div>
                </div>
                <div className="bg-success-muted/50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-success mb-1">{user.citations || 0}</div>
                  <div className="text-sm text-muted-foreground">Citations</div>
                </div>
                <div className="bg-brand-muted p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-brand mb-1">{user.hIndex || 0}</div>
                  <div className="text-sm text-muted-foreground">h-index</div>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-1">0</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-extracted expertise (read-only) */}
          <div>
            <div className="text-sm font-semibold text-muted-foreground mb-3">RESEARCH EXPERTISE</div>
            <div className="flex flex-wrap gap-2">
              {expertiseFreq.length ? (
                expertiseFreq.map(({ keyword, publicationCount }) => (
                  <Badge key={keyword} className="bg-brand-muted text-brand border border-border px-3 py-1 font-normal">
                    {keyword}{' '}
                    <span className="text-brand/80">
                      (appears in {publicationCount} of your publications)
                    </span>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No indexed publications yet — upload works to populate this section.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('publications')}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === 'publications'
                ? 'text-brand border-b-2 border-brand'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Publications
            </div>
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === 'followers'
                ? 'text-brand border-b-2 border-brand'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Followers
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'publications' && (
          <div className="space-y-4">
            {myPublications.length > 0 ? (
              myPublications.map(pub => (
                <Card key={pub.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex gap-4">
                    {pub.coverImage && (
                      <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={pub.coverImage}
                          alt={pub.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-brand">{pub.title}</h3>
                        <Badge className={
                          pub.fundingStatus === 'funded' ? 'bg-success-muted text-success-foreground' :
                          pub.fundingStatus === 'seeking' ? 'bg-warning-muted text-warning-foreground' :
                          'bg-muted text-foreground'
                        }>
                          {pub.fundingStatus}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-3 line-clamp-2">{pub.abstract}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {pub.keywords.slice(0, 4).map(keyword => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {pub.publicationDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {pub.citations} citations
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {pub.authors.length} authors
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No publications yet</h3>
                <p className="text-muted-foreground mb-4">Start sharing your research with the community</p>
                <Button
                  className=""
                  onClick={() => navigate('/researcher/upload')}
                >
                  Share your first research
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'followers' && (
          <Card className="p-12 text-center border-2 border-dashed border-border">
            <UserPlus className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-muted-foreground">No followers yet</h3>
            <p className="text-muted-foreground text-sm">Share your research to gain followers from the community.</p>
            <Button className="mt-4 " onClick={() => navigate('/researcher/upload')}>
              Share research
            </Button>
          </Card>
        )}
      </div>
  );
}
