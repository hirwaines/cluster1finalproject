import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { ResearcherLayout } from '../components/ResearcherLayout';
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
      <ResearcherLayout>
        <div className="p-12 text-center">
          <h2 className="text-xl font-bold mb-2">Researcher not found</h2>
          <Button variant="outline" onClick={() => navigate(-1 as any)}>Go back</Button>
        </div>
      </ResearcherLayout>
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
    <ResearcherLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1 as any)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-900 mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile header card */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-28 h-28 bg-blue-800 flex items-center justify-center text-white font-bold text-5xl shrink-0">
              {researcher.name.charAt(0)}
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-3xl font-bold">{researcher.name}</h1>
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
                    <p className="text-gray-600 font-medium">{researcher.position}</p>
                  )}
                  <p className="text-gray-500">{researcher.department}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={followed ? 'outline' : 'default'}
                    className={followed ? 'border-pink-200 text-pink-600' : 'bg-blue-900 hover:bg-blue-950'}
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
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                {researcher.institution && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {researcher.institution}
                  </span>
                )}
                {researcher.email && (
                  <a href={`mailto:${researcher.email}`} className="flex items-center gap-1.5 hover:text-blue-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {researcher.email}
                  </a>
                )}
                {researcher.orcid && (
                  <a href={`https://orcid.org/${researcher.orcid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green-600">
                    <Globe className="w-4 h-4 text-gray-400" />
                    ORCID: {researcher.orcid}
                  </a>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-900">{researcher.publications}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Publications</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">{researcher.citations}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Citations</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-900">{researcher.hIndex}</div>
                  <div className="text-xs text-gray-500 mt-0.5">h-index</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-700">{researcherPapers.length}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Papers here</div>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-600">{followed ? 1 : 0}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Followers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Expertise tags */}
          {researcher.expertise && researcher.expertise.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Research expertise</div>
              <div className="flex flex-wrap gap-2">
                {researcher.expertise.map(exp => (
                  <Badge key={exp} className="bg-blue-50 text-blue-900 border border-blue-100">{exp}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('publications')}
            className={`pb-3 px-1 font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'publications' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <BookOpen className="w-4 h-4" /> Publications ({researcherPapers.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-1 font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'about' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-500 hover:text-gray-800'}`}
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
                    <h3 className="text-lg font-bold text-blue-900 hover:underline flex-1 mr-4">{paper.title}</h3>
                    <Badge className={
                      paper.fundingStatus === 'funded' ? 'bg-green-100 text-green-700 shrink-0' :
                      paper.fundingStatus === 'seeking' ? 'bg-yellow-100 text-yellow-700 shrink-0' :
                      'bg-gray-100 text-gray-700 shrink-0'
                    }>
                      {paper.fundingStatus}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{paper.abstract}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {paper.keywords.slice(0, 4).map(k => (
                      <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{paper.publicationDate}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />{paper.citations} citations</span>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center border-2 border-dashed border-gray-200">
                <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No publications available for this researcher.</p>
              </Card>
            )}
          </div>
        )}

        {/* About tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Contact information</h2>
              <div className="space-y-3 text-sm">
                {researcher.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-900 shrink-0" />
                    <a href={`mailto:${researcher.email}`} className="text-blue-900 hover:underline">{researcher.email}</a>
                  </div>
                )}
                {researcher.institution && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-700">{researcher.institution}</span>
                  </div>
                )}
                {researcher.department && (
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-700">{researcher.department}</span>
                  </div>
                )}
                {researcher.orcid && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-green-600 shrink-0" />
                    <a
                      href={`https://orcid.org/${researcher.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 hover:underline"
                    >
                      ORCID: {researcher.orcid}
                    </a>
                  </div>
                )}
                {!researcher.email && !researcher.orcid && (
                  <p className="text-gray-400 italic text-xs">No contact details shared by this researcher.</p>
                )}
              </div>
              <Button className="mt-5 w-full bg-blue-900 hover:bg-blue-950" onClick={handleContact}>
                <Mail className="w-4 h-4 mr-2" /> Send email
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Academic profile</h2>
              <div className="space-y-3 text-sm">
                {researcher.position && (
                  <div>
                    <span className="font-medium text-gray-700">Position</span>
                    <p className="text-gray-600 mt-0.5">{researcher.position}</p>
                  </div>
                )}
                {researcher.department && (
                  <div>
                    <span className="font-medium text-gray-700">Department</span>
                    <p className="text-gray-600 mt-0.5">{researcher.department}</p>
                  </div>
                )}
                {researcher.institution && (
                  <div>
                    <span className="font-medium text-gray-700">Institution</span>
                    <p className="text-gray-600 mt-0.5">{researcher.institution}</p>
                  </div>
                )}
                {researcher.expertise && researcher.expertise.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Research areas</span>
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
    </ResearcherLayout>
  );
}
