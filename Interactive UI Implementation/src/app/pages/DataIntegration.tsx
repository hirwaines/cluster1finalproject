import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { Brain, ArrowLeft, Database, RefreshCw, CheckCircle, AlertCircle, Download } from 'lucide-react';

const dataSources = [
  { id: 1, name: 'Scopus', type: 'Publications', status: 'Connected', lastSync: '2 hours ago', records: '1,248' },
  { id: 2, name: 'Web of Science', type: 'Citations', status: 'Connected', lastSync: '5 hours ago', records: '3,456' },
  { id: 3, name: 'PubMed', type: 'Publications', status: 'Connected', lastSync: '1 day ago', records: '892' },
  { id: 4, name: 'ORCID', type: 'Researcher Profiles', status: 'Connected', lastSync: '3 hours ago', records: '142' },
  { id: 5, name: 'Institutional Repository', type: 'Documents', status: 'Syncing', lastSync: 'In progress', records: '2,341' },
  { id: 6, name: 'Google Scholar', type: 'Publications', status: 'Error', lastSync: '2 days ago', records: '0' },
];

export function DataIntegration() {
  const navigate = useNavigate();
  const { user } = useApp();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">Data Integration</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/manager/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Research Data Integration</h1>
          <p className="text-gray-600">Connect and manage external research data sources</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-3xl font-bold text-blue-800 mb-1">6</div>
            <div className="text-sm text-gray-600">Connected Sources</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">8,079</div>
            <div className="text-sm text-gray-600">Total Records</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold text-blue-800 mb-1">5</div>
            <div className="text-sm text-gray-600">Active Syncs</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">1</div>
            <div className="text-sm text-gray-600">Errors</div>
          </Card>
        </div>

        {/* Data Sources */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Data Sources</h2>
            <Button className="bg-blue-900">
              + Add New Source
            </Button>
          </div>

          <div className="space-y-4">
            {dataSources.map(source => (
              <div key={source.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <div className="font-bold">{source.name}</div>
                    <div className="text-sm text-gray-600">{source.type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Records</div>
                    <div className="font-bold">{source.records}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Last Sync</div>
                    <div className="font-medium text-sm">{source.lastSync}</div>
                  </div>
                  <Badge className={
                    source.status === 'Connected' ? 'bg-green-100 text-green-700' :
                    source.status === 'Syncing' ? 'bg-blue-100 text-blue-900' :
                    'bg-red-100 text-red-700'
                  }>
                    {source.status === 'Connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {source.status === 'Error' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {source.status === 'Syncing' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                    {source.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sync History */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-bold mb-6">Recent Sync Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">Scopus Publications Sync</div>
                  <div className="text-sm text-gray-600">156 new records imported</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">ORCID Profile Update</div>
                  <div className="text-sm text-gray-600">12 profiles updated</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">3 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium">Google Scholar Sync Failed</div>
                  <div className="text-sm text-gray-600">Authentication error</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">2 days ago</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
