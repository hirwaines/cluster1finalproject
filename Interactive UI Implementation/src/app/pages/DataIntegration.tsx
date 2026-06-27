import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { DashboardPageHeader } from '../components/layout';
import { useApp } from '../context/AppContext';
import { Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

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
    <>
      <DashboardPageHeader
        title="Research Data Integration"
        description="Connect and manage external research data sources"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-3xl font-bold text-brand mb-1">6</div>
            <div className="text-sm text-muted-foreground">Connected Sources</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold text-success mb-1">8,079</div>
            <div className="text-sm text-muted-foreground">Total Records</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold text-brand mb-1">5</div>
            <div className="text-sm text-muted-foreground">Active Syncs</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold text-warning mb-1">1</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </Card>
        </div>

        {/* Data Sources */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Data Sources</h2>
            <Button className="bg-brand">
              + Add New Source
            </Button>
          </div>

          <div className="space-y-4">
            {dataSources.map(source => (
              <div key={source.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-brand/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-muted rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <div className="font-bold">{source.name}</div>
                    <div className="text-sm text-muted-foreground">{source.type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Records</div>
                    <div className="font-bold">{source.records}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Last Sync</div>
                    <div className="font-medium text-sm">{source.lastSync}</div>
                  </div>
                  <Badge className={
                    source.status === 'Connected' ? 'bg-success-muted text-success-foreground' :
                    source.status === 'Syncing' ? 'bg-brand-muted text-brand' :
                    'bg-destructive/10 text-destructive'
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
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <div className="font-medium">Scopus Publications Sync</div>
                  <div className="text-sm text-muted-foreground">156 new records imported</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <div className="font-medium">ORCID Profile Update</div>
                  <div className="text-sm text-muted-foreground">12 profiles updated</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">3 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                  <div className="font-medium">Google Scholar Sync Failed</div>
                  <div className="text-sm text-muted-foreground">Authentication error</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 days ago</div>
            </div>
          </div>
        </Card>
    </>
  );
}
