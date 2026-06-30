import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { Database, RefreshCw, CheckCircle, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

const dataSources = [
  {
    id: 1,
    name: 'ORCID',
    type: 'Researcher Profiles',
    status: 'Connected',
    lastSync: '3 hours ago',
    records: '142',
    description: 'Sync researcher identifiers, affiliations and publication lists from ORCID.',
  },
  {
    id: 2,
    name: 'Institutional Repository',
    type: 'Documents & Publications',
    status: 'Syncing',
    lastSync: 'In progress',
    records: '2,341',
    description: 'Import published works, theses, and technical reports from your institution\'s repository.',
  },
];

export function DataIntegration() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [syncing, setSyncing] = useState<number | null>(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleSync = (id: number, name: string) => {
    setSyncing(id);
    toast.promise(
      new Promise<void>(res => setTimeout(() => { setSyncing(null); res(); }, 2000)),
      {
        loading: `Syncing ${name}…`,
        success: `${name} sync complete.`,
        error: `${name} sync failed.`,
      }
    );
  };

  const handleConfigure = (name: string) => {
    toast.info(`Configure ${name}: open your settings and update the API key or repository URL.`);
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-2xl font-semibold tabular-nums sm:text-3xl text-brand mb-1">2</div>
          <div className="text-sm text-muted-foreground">Connected Sources</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-semibold tabular-nums sm:text-3xl text-success mb-1">2,483</div>
          <div className="text-sm text-muted-foreground">Total Records</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-semibold tabular-nums sm:text-3xl text-brand mb-1">1</div>
          <div className="text-sm text-muted-foreground">Active Syncs</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-semibold tabular-nums sm:text-3xl text-success mb-1">0</div>
          <div className="text-sm text-muted-foreground">Errors</div>
        </Card>
      </div>

      {/* Data Sources */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold">Data Sources</h2>
          <Button className="bg-brand" onClick={() => toast.info('Contact your system administrator to connect additional institutional repositories.')}>
            + Add New Source
          </Button>
        </div>

        <div className="space-y-4">
          {dataSources.map(source => (
            <div key={source.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-brand/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-muted rounded-lg flex items-center justify-center">
                  {source.id === 1 ? <Database className="w-6 h-6 text-brand" /> : <Building2 className="w-6 h-6 text-brand" />}
                </div>
                <div>
                  <div className="font-semibold">{source.name}</div>
                  <div className="text-sm text-muted-foreground">{source.type}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{source.description}</div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Records</div>
                  <div className="font-semibold">{source.records}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Last Sync</div>
                  <div className="font-medium text-sm">{source.lastSync}</div>
                </div>
                <Badge className={
                  source.status === 'Connected' ? 'bg-success-muted text-success-foreground' :
                  'bg-brand-muted text-brand'
                }>
                  {source.status === 'Connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {source.status === 'Syncing' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                  {source.status}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={syncing === source.id}
                    onClick={() => handleSync(source.id, source.name)}
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing === source.id ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleConfigure(source.name)}>
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sync History */}
      <Card className="p-6 mt-8">
        <h2 className="text-base font-semibold mb-6">Recent Sync Activity</h2>
        <div className="space-y-3">
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
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <div className="font-medium">Institutional Repository Import</div>
                <div className="text-sm text-muted-foreground">89 new documents imported</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Yesterday</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <div className="font-medium">ORCID Full Sync</div>
                <div className="text-sm text-muted-foreground">142 researcher records refreshed</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">2 days ago</div>
          </div>
        </div>
      </Card>
    </>
  );
}
