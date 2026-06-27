import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { tabClass } from '../components/layout';
import { usePageHeaderActions } from '../context/PageHeaderContext';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Download, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

type ReportType = 'performance' | 'collaboration' | 'funding' | 'trend' | 'custom';
type Schedule = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'once';
type Format = 'pdf' | 'excel' | 'html' | 'json';

export function ReportBuilder() {
  const navigate = useNavigate();
  const {
    user,
    reports,
    reportData,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    scheduleReport,
    getReportHistory,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'history'>('list');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'performance' as ReportType,
    description: '',
    schedule: 'monthly' as Schedule,
    format: 'pdf' as Format,
    sections: [] as string[],
  });

  useEffect(() => {
    if (!user || !['admin', 'manager'].includes(user.role)) {
      navigate('/login');
    }
  }, [user, navigate]);

  const headerActions = useMemo(
    () => (
      <Button onClick={() => setShowCreateDialog(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Report
      </Button>
    ),
    [],
  );
  usePageHeaderActions(headerActions);

  if (!user || !['admin', 'manager'].includes(user.role)) {
    return null;
  }

  const sectionsByType: Record<ReportType, string[]> = {
    performance: ['publications', 'citations', 'collaboration', 'funding'],
    collaboration: ['network_analysis', 'co-authorship', 'active_partnerships', 'recommendations'],
    funding: ['matched_opportunities', 'deadline_alerts', 'success_rate_analysis', 'funding_history'],
    trend: ['emerging_topics', 'publication_trends', 'citation_patterns', 'field_growth'],
    custom: ['all_sections'],
  };

  const userReports = reports;
  const selectedReport = selectedReportId ? userReports.find(r => r.id === selectedReportId) : null;
  const selectedReportHistory = selectedReportId ? getReportHistory(selectedReportId) : [];

  const handleCreateReport = () => {
    if (!formData.name.trim()) return;
    createReport({
      name: formData.name,
      type: formData.type,
      description: formData.description,
      createdBy: user.id,
      schedule: formData.schedule,
      format: formData.format,
      filters: { department: 'all', dateRange: 'last_30_days' },
      sections: formData.sections.length > 0 ? formData.sections : sectionsByType[formData.type],
      recipients: [],
      status: 'draft',
    });
    setFormData({
      name: '',
      type: 'performance',
      description: '',
      schedule: 'monthly',
      format: 'pdf',
      sections: [],
    });
    setShowCreateDialog(false);
  };

  const handleGenerateReport = (reportId: string) => {
    generateReport(reportId);
  };

  const handleScheduleReport = (reportId: string) => {
    scheduleReport(reportId);
  };

  return (
    <>
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {([
          { id: 'list' as const, label: 'My Reports' },
          { id: 'create' as const, label: 'Create' },
          { id: 'history' as const, label: 'History' },
        ]).map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={tabClass(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

        {/* LIST TAB */}
        {activeTab === 'list' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Report List */}
            <div className="col-span-1">
              <Card className="p-6 sticky top-20">
                <h3 className="font-semibold text-base mb-4">Reports ({userReports.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {userReports.map(report => (
                    <Card
                      key={report.id}
                      onClick={() => setSelectedReportId(report.id)}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedReportId === report.id
                          ? 'border-2 border-brand bg-brand-muted'
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="font-medium text-sm line-clamp-1">{report.name}</div>
                      <div className="text-xs text-muted-foreground">{report.type}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="text-xs">{report.status}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>

            {/* Report Detail */}
            <div className="col-span-2">
              {selectedReport ? (
                <Card className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">{selectedReport.name}</h2>
                      <p className="text-muted-foreground">{selectedReport.description}</p>
                    </div>
                    <Badge className={`${
                      selectedReport.status === 'active'
                        ? 'bg-success-muted text-success-foreground'
                        : 'bg-warning-muted text-warning-foreground'
                    }`}>
                      {selectedReport.status}
                    </Badge>
                  </div>

                  {/* Report Info */}
                  <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Type</div>
                      <div className="text-lg capitalize">{selectedReport.type}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Format</div>
                      <div className="text-lg uppercase">{selectedReport.format}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Schedule</div>
                      <div className="text-lg capitalize">{selectedReport.schedule}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Created</div>
                      <div className="text-lg">{selectedReport.createdAt}</div>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="mb-8 pb-8 border-b">
                    <h3 className="font-semibold mb-4">Report Sections</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.sections.map(section => (
                        <Badge key={section} className="bg-brand-muted text-brand">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Last Generated */}
                  {selectedReport.lastGenerated && (
                    <div className="mb-8 pb-8 border-b">
                      <div className="text-sm font-medium text-muted-foreground">Last Generated</div>
                      <div className="text-lg">{selectedReport.lastGenerated}</div>
                      {selectedReport.nextRunDate && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Next run: {selectedReport.nextRunDate}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleGenerateReport(selectedReport.id)}
                      className="flex-1 bg-brand hover:bg-brand/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate Now
                    </Button>
                    <Button
                      onClick={() => handleScheduleReport(selectedReport.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                    <Button
                      onClick={() => {
                        deleteReport(selectedReport.id);
                        setSelectedReportId(null);
                      }}
                      variant="outline"
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 flex items-center justify-center min-h-96">
                  <p className="text-muted-foreground">Select a report to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <Card className="p-8">
            <h2 className="text-lg font-semibold mb-6">Create New Report</h2>
            <div className="space-y-6">
              <div>
                <Label className="block mb-2 font-medium">Report Name</Label>
                <Input
                  placeholder="e.g., Monthly Performance Summary"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label className="block mb-2 font-medium">Description</Label>
                <Textarea
                  placeholder="Describe what this report contains..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label className="block mb-2 font-medium">Report Type</Label>
                  <Select value={formData.type} onValueChange={(value) => 
                    setFormData({ ...formData, type: value as ReportType, sections: [] })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="funding">Funding</SelectItem>
                      <SelectItem value="trend">Trend Analysis</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block mb-2 font-medium">Schedule</Label>
                  <Select value={formData.schedule} onValueChange={(value) => 
                    setFormData({ ...formData, schedule: value as Schedule })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block mb-2 font-medium">Format</Label>
                  <Select value={formData.format} onValueChange={(value) => 
                    setFormData({ ...formData, format: value as Format })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sections */}
              <div>
                <Label className="block mb-4 font-medium">Report Sections</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {sectionsByType[formData.type].map(section => (
                    <div key={section} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.sections.includes(section)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              sections: [...formData.sections, section],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              sections: formData.sections.filter(s => s !== section),
                            });
                          }
                        }}
                      />
                      <label className="text-sm capitalize cursor-pointer">{section.replace(/_/g, ' ')}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateReport}
                  className="flex-1 bg-brand"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Report
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && selectedReport && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Generation History: {selectedReport.name}</h2>
            {selectedReportHistory.length > 0 ? (
              <div className="space-y-3">
                {selectedReportHistory.map(data => (
                  <div key={data.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium">{data.fileName}</div>
                      <div className="text-sm text-muted-foreground">
                        Generated: {new Date(data.generatedAt).toLocaleString()}
                      </div>
                    </div>
                    <Button size="sm" className="bg-brand hover:bg-brand/90">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No reports generated yet</p>
            )}
          </Card>
        )}

      {/* Create Report Dialog */}
      {showCreateDialog && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Create Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Report Name</Label>
                <Input
                  placeholder="Report name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(value) => 
                  setFormData({ ...formData, type: value as ReportType })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="collaboration">Collaboration</SelectItem>
                    <SelectItem value="funding">Funding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateReport} className="w-full">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
