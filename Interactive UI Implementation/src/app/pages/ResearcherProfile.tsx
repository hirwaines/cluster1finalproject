import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { Brain, ArrowLeft, Mail, Users, TrendingUp, Award, BookOpen } from 'lucide-react';

export function ResearcherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { researchers, research } = useApp();

  const researcher = researchers.find(r => r.id === id);
  const researcherPapers = research.filter(r => r.researcherId === id);

  if (!researcher) {
    return <div>Researcher not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-6">
            <Avatar className="w-32 h-32 bg-blue-800 flex items-center justify-center text-white font-bold text-5xl">
              {researcher.name.charAt(0)}
            </Avatar>

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{researcher.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{researcher.department}</p>
              <p className="text-gray-500 mb-4">{researcher.institution}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {researcher.expertise?.map(exp => (
                  <Badge key={exp} variant="secondary">{exp}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-800">{researcher.publications}</div>
                  <div className="text-sm text-gray-600">Publications</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{researcher.citations}</div>
                  <div className="text-sm text-gray-600">Citations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-800">{researcher.hIndex}</div>
                  <div className="text-sm text-gray-600">h-index</div>
                </div>
                <div>
                  <Button className="bg-blue-900">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Publications</h2>
          <div className="space-y-4">
            {researcherPapers.length > 0 ? (
              researcherPapers.map(paper => (
                <div key={paper.id} className="border-b pb-4">
                  <h3 className="font-bold text-lg text-blue-800 mb-2">{paper.title}</h3>
                  <p className="text-gray-600 mb-2">{paper.abstract}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{paper.citations} citations</span>
                    <span>•</span>
                    <span>{paper.publicationDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No publications available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
