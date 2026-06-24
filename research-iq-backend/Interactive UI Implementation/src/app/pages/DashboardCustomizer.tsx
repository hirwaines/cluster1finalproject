import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useApp } from '../context/AppContext';
import { Brain, ArrowLeft, Plus, Trash2, Edit2, Save, Grid } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

type WidgetType = 'chart' | 'metric' | 'table' | 'list' | 'network' | 'map';

export function DashboardCustomizer() {
  const navigate = useNavigate();
  const { user, dashboards, createDashboard, updateDashboard, deleteDashboard, getUserDashboards } = useApp();
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddWidgetDialog, setShowAddWidgetDialog] = useState(false);
  const [dashboardName, setDashboardName] = useState('');
  const [newWidgetData, setNewWidgetData] = useState({
    title: '',
    type: 'metric' as WidgetType,
    dataSource: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'researcher') {
      navigate('/feed');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const userDashboards = getUserDashboards(user.id);
  const selectedDashboard = selectedDashboardId
    ? userDashboards.find(d => d.id === selectedDashboardId)
    : null;

  const handleCreateDashboard = () => {
    if (!dashboardName.trim()) return;
    createDashboard({
      name: dashboardName,
      userId: user.id,
      role: user.role,
      isDefault: userDashboards.length === 0,
      widgets: [],
      layout: 'grid',
    });
    setDashboardName('');
    setShowCreateDialog(false);
  };

  const handleAddWidget = () => {
    if (!selectedDashboard || !newWidgetData.title.trim()) return;
    const newWidget = {
      id: `w${Date.now()}`,
      dashboardId: selectedDashboard.id,
      type: newWidgetData.type,
      title: newWidgetData.title,
      dataSource: newWidgetData.dataSource,
      position: { x: 0, y: 0 },
      size: { width: 2, height: 2 },
      config: newWidgetData.type === 'chart' ? { chartType: 'line' } : {},
      order: selectedDashboard.widgets.length + 1,
    };
    updateDashboard(selectedDashboard.id, {
      widgets: [...selectedDashboard.widgets, newWidget],
    });
    setNewWidgetData({ title: '', type: 'metric', dataSource: '' });
    setShowAddWidgetDialog(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (!selectedDashboard) return;
    updateDashboard(selectedDashboard.id, {
      widgets: selectedDashboard.widgets.filter(w => w.id !== widgetId),
    });
  };

  return (
    <AppShell>
    <div style={{ padding: '2rem' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard Customizer</h1>
            <p className="text-gray-600">Create and customize your personalized dashboard</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-blue-800 to-green-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Dashboard
          </Button>
        </div>

        {/* Dashboard List & Editor */}
        <div className="grid grid-cols-4 gap-6">
          {/* Dashboard List */}
          <div className="col-span-1">
            <Card className="p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-4">My Dashboards ({userDashboards.length})</h3>
              <div className="space-y-2">
                {userDashboards.map(dashboard => (
                  <Card
                    key={dashboard.id}
                    onClick={() => setSelectedDashboardId(dashboard.id)}
                    className={`p-3 cursor-pointer transition-all ${
                      selectedDashboardId === dashboard.id
                        ? 'border-2 border-blue-800 bg-blue-50'
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="font-medium text-sm line-clamp-1">{dashboard.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{dashboard.widgets.length} widgets</div>
                    {dashboard.isDefault && (
                      <Badge className="text-xs bg-green-100 text-green-800">Default</Badge>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Dashboard Editor */}
          <div className="col-span-3">
            {selectedDashboard ? (
              <Card className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedDashboard.name}</h2>
                    <p className="text-gray-600">Layout: {selectedDashboard.layout}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedDashboard.isDefault && (
                      <Badge className="bg-green-100 text-green-800">Default</Badge>
                    )}
                  </div>
                </div>

                {/* Widgets Grid */}
                <div className="mb-8 pb-8 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Widgets</h3>
                    <Button
                      size="sm"
                      onClick={() => setShowAddWidgetDialog(true)}
                      className="bg-blue-800 hover:bg-blue-900"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Widget
                    </Button>
                  </div>

                  {selectedDashboard.widgets.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedDashboard.widgets.map(widget => (
                        <Card key={widget.id} className="p-4 relative group">
                          <button
                            onClick={() => handleRemoveWidget(widget.id)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="mb-3">
                            <div className="font-medium text-sm mb-1">{widget.title}</div>
                            <Badge className="text-xs capitalize">{widget.type}</Badge>
                          </div>

                          {/* Widget Preview */}
                          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded p-4 h-32 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-600">
                                {widget.type === 'chart' && '📊 Chart'}
                                {widget.type === 'metric' && '📈 Metric'}
                                {widget.type === 'table' && '📋 Table'}
                                {widget.type === 'list' && '📝 List'}
                                {widget.type === 'network' && '🔗 Network'}
                                {widget.type === 'map' && '🗺️ Map'}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{widget.dataSource}</div>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-600">
                            {widget.size.width}x{widget.size.height}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center border rounded-lg border-dashed">
                      <p className="text-gray-500 mb-4">No widgets yet. Add one to get started!</p>
                      <Button
                        onClick={() => setShowAddWidgetDialog(true)}
                        className="bg-blue-800 hover:bg-blue-900"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Widget
                      </Button>
                    </div>
                  )}
                </div>

                {/* Dashboard Settings */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Dashboard Settings</h3>
                  <div>
                    <Label className="block mb-2">Layout</Label>
                    <Select defaultValue={selectedDashboard.layout} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="freeform">Freeform</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() =>
                        updateDashboard(selectedDashboard.id, {
                          isDefault: !selectedDashboard.isDefault,
                        })
                      }
                      className={`flex-1 ${
                        selectedDashboard.isDefault
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {selectedDashboard.isDefault ? '★ Default Dashboard' : '☆ Set as Default'}
                    </Button>
                    <Button
                      onClick={() => {
                        deleteDashboard(selectedDashboard.id);
                        setSelectedDashboardId(null);
                      }}
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Dashboard
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">No dashboards yet. Create one to get started!</p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-blue-800 hover:bg-blue-900"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Dashboard
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Dashboard Dialog */}
      {showCreateDialog && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Dashboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="block mb-2">Dashboard Name</Label>
                <Input
                  placeholder="e.g., My Research Dashboard"
                  value={dashboardName}
                  onChange={e => setDashboardName(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateDashboard}
                  className="flex-1 bg-blue-800 hover:bg-blue-900"
                >
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateDialog(false);
                    setDashboardName('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Widget Dialog */}
      {showAddWidgetDialog && (
        <Dialog open={showAddWidgetDialog} onOpenChange={setShowAddWidgetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Widget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="block mb-2">Widget Title</Label>
                <Input
                  placeholder="e.g., Publication Trends"
                  value={newWidgetData.title}
                  onChange={e => setNewWidgetData({ ...newWidgetData, title: e.target.value })}
                />
              </div>

              <div>
                <Label className="block mb-2">Widget Type</Label>
                <Select value={newWidgetData.type} onValueChange={(value) =>
                  setNewWidgetData({ ...newWidgetData, type: value as WidgetType })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric</SelectItem>
                    <SelectItem value="chart">Chart</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="map">Map</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2">Data Source</Label>
                <Select value={newWidgetData.dataSource} onValueChange={(value) =>
                  setNewWidgetData({ ...newWidgetData, dataSource: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publications_count">Publications Count</SelectItem>
                    <SelectItem value="citation_trends">Citation Trends</SelectItem>
                    <SelectItem value="collaboration_network">Collaboration Network</SelectItem>
                    <SelectItem value="research_trends">Research Trends</SelectItem>
                    <SelectItem value="funding_opportunities">Funding Opportunities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddWidget}
                  className="flex-1 bg-blue-800 hover:bg-blue-900"
                >
                  Add Widget
                </Button>
                <Button
                  onClick={() => {
                    setShowAddWidgetDialog(false);
                    setNewWidgetData({ title: '', type: 'metric', dataSource: '' });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}
