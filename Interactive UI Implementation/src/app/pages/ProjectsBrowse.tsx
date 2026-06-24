import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { Brain, ArrowLeft, DollarSign } from 'lucide-react';

export function ProjectsBrowse() {
  const navigate = useNavigate();
  const { research, researchers } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">Browse Projects</span>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Research Projects</h1>

        <div className="grid grid-cols-2 gap-6">
          {research.map(project => {
            const lead = researchers.find(r => r.id === project.researcherId);
            return (
              <Card key={project.id} className="p-6 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold mb-2 text-blue-800">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.abstract}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.keywords.map(k => (
                    <Badge key={k} variant="secondary">{k}</Badge>
                  ))}
                </div>
                {lead && (
                  <div className="text-sm text-gray-500 mb-4">
                    Lead: {lead.name} • {lead.department}
                  </div>
                )}
                <Button className="bg-blue-900">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Fund Project
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
