import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { keywordFrequencyFromPublications } from '../utils/collaborationMatch';
import { FileDown, Edit, Users, TrendingUp, Award, BookOpen, Network, Calendar } from 'lucide-react';

export function MyProfile() {
  const navigate = useNavigate();
  const { user, research, researchers } = useApp();

  const expertiseFreq = user ? keywordFrequencyFromPublications(user.id, research) : [];
  const [activeTab, setActiveTab] = useState<'publications' | 'collaborators'>('publications');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const myPublications = research.filter(r => r.researcherId === user.id);
  const myCollaborators = researchers.filter(r =>
    research.some(pub =>
      pub.collaborators?.includes(user.id) && pub.collaborators?.includes(r.id)
    )
  );

  return (
    <ResearcherLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="w-32 h-32 bg-blue-800 flex items-center justify-center text-white font-bold text-5xl">
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
                  <p className="text-xl text-gray-600 mb-2">
                    {user.position ? `${user.position} • ` : ''}
                    {user.department && `${user.department} • `}
                    {user.institution}
                  </p>
                  <p className="text-gray-600 max-w-2xl text-sm">
                    Your expertise profile is derived from your indexed publications.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">
                    <FileDown className="w-4 h-4 mr-2" />
                    Export CV
                  </Button>
                  <Button className="bg-blue-900 hover:bg-blue-950">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit profile
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-1">{user.publications || 0}</div>
                  <div className="text-sm text-gray-600">PUBLICATIONS</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{user.citations || 0}</div>
                  <div className="text-sm text-gray-600">CITATIONS</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-1">{user.hIndex || 0}</div>
                  <div className="text-sm text-gray-600">H-INDEX</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-extracted expertise (read-only) */}
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-3">RESEARCH EXPERTISE</div>
            <div className="flex flex-wrap gap-2">
              {expertiseFreq.length ? (
                expertiseFreq.map(({ keyword, publicationCount }) => (
                  <Badge key={keyword} className="bg-blue-50 text-blue-900 border border-blue-100 px-3 py-1 font-normal">
                    {keyword}{' '}
                    <span className="text-blue-900/80">
                      (appears in {publicationCount} of your publications)
                    </span>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No indexed publications yet — upload works to populate this section.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('publications')}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === 'publications'
                ? 'text-blue-800 border-b-2 border-blue-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Publications
            </div>
          </button>
          <button
            onClick={() => setActiveTab('collaborators')}
            className={`pb-3 px-2 font-medium transition-all ${
              activeTab === 'collaborators'
                ? 'text-blue-800 border-b-2 border-blue-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Collaborators
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
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={pub.coverImage}
                          alt={pub.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-blue-800">{pub.title}</h3>
                        <Badge className={
                          pub.fundingStatus === 'funded' ? 'bg-green-100 text-green-700' :
                          pub.fundingStatus === 'seeking' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {pub.fundingStatus}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">{pub.abstract}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {pub.keywords.slice(0, 4).map(keyword => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
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
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No publications yet</h3>
                <p className="text-gray-600 mb-4">Start sharing your research with the community</p>
                <Button
                  className="bg-blue-900 hover:bg-blue-950"
                  onClick={() => navigate('/researcher/upload')}
                >
                  Share your first research
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'collaborators' && (
          <div className="grid grid-cols-3 gap-6">
            {myCollaborators.length > 0 ? (
              myCollaborators.map(collaborator => (
                <Card
                  key={collaborator.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/researcher/profile/${collaborator.id}`)}
                >
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 bg-blue-800 flex items-center justify-center text-white font-bold text-2xl mb-3">
                      {collaborator.name.charAt(0)}
                    </Avatar>

                    <h3 className="font-bold mb-1">{collaborator.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{collaborator.department}</p>

                    <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                      {collaborator.expertise?.slice(0, 2).map(exp => (
                        <Badge key={exp} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full text-center text-xs">
                      <div>
                        <div className="font-bold text-blue-800">{collaborator.publications}</div>
                        <div className="text-gray-500">Pubs</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-600">{collaborator.citations}</div>
                        <div className="text-gray-500">Cites</div>
                      </div>
                      <div>
                        <div className="font-bold text-blue-800">{collaborator.hIndex}</div>
                        <div className="text-gray-500">h-index</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="col-span-3 p-12 text-center">
                <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No collaborators yet</h3>
                <p className="text-gray-600 mb-4">Start collaborating with other researchers</p>
                <Button
                  className="bg-blue-900 hover:bg-blue-950"
                  onClick={() => navigate('/collaborators')}
                >
                  Find collaborators
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </ResearcherLayout>
  );
}
