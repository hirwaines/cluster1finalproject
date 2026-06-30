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
import {
  Plus, Trash2, Download, Clock, FileText, FileSpreadsheet,
  Globe, Loader2, CheckCircle2, BarChart2, Users, DollarSign, TrendingUp,
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import {
  downloadReport, formatDate,
  type ReportFormat, type ReportType, type ReportPayload, type ReportSection,
} from '../lib/reportGenerator';

// ── Types ─────────────────────────────────────────────────────────────────────
type Schedule = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'once';

const FORMAT_META: Record<ReportFormat, { label: string; icon: React.ElementType; ext: string; color: string }> = {
  pdf:   { label: 'PDF',   icon: FileText,        ext: '.pdf',  color: 'text-red-600' },
  excel: { label: 'Excel', icon: FileSpreadsheet,  ext: '.xlsx', color: 'text-green-700' },
  csv:   { label: 'CSV',   icon: FileText,         ext: '.csv',  color: 'text-yellow-600' },
  html:  { label: 'HTML',  icon: Globe,            ext: '.html', color: 'text-blue-600' },
};

const TYPE_META: Record<ReportType, { label: string; icon: React.ElementType; description: string }> = {
  performance:   { label: 'Performance',    icon: BarChart2,   description: 'Publications, citations, h-index across researchers' },
  collaboration: { label: 'Collaboration',  icon: Users,       description: 'Co-authorship networks and active partnerships' },
  funding:       { label: 'Funding',        icon: DollarSign,  description: 'Funding opportunities, requests and success rates' },
  trend:         { label: 'Trend Analysis', icon: TrendingUp,  description: 'Emerging topics, field growth and citation patterns' },
  custom:        { label: 'Custom',         icon: FileText,    description: 'Select any combination of sections' },
};

const SECTIONS_BY_TYPE: Record<ReportType, string[]> = {
  performance:   ['researchers', 'publications', 'citation_metrics'],
  collaboration: ['collaboration_requests', 'researchers'],
  funding:       ['funding_requests', 'researchers'],
  trend:         ['publications', 'fields_breakdown'],
  custom:        ['researchers', 'publications', 'citation_metrics', 'funding_requests', 'collaboration_requests', 'fields_breakdown'],
};

// ── Data builder ──────────────────────────────────────────────────────────────
function buildPayload(
  formName: string,
  formType: ReportType,
  formDesc: string,
  selectedSections: string[],
  userName: string,
  appData: {
    researchers: ReturnType<typeof useApp>['researchers'];
    research: ReturnType<typeof useApp>['research'];
    fundingRequests: ReturnType<typeof useApp>['fundingRequests'];
    collaborationRequests: ReturnType<typeof useApp>['collaborationRequests'];
  }
): ReportPayload {
  const { researchers, research, fundingRequests, collaborationRequests } = appData;
  const now = new Date();
  const sections: ReportSection[] = [];
  const active = selectedSections.length > 0 ? selectedSections : SECTIONS_BY_TYPE[formType];

  if (active.includes('researchers')) {
    sections.push({
      title: 'Researcher Directory',
      description: `All researchers registered on the platform as of ${formatDate(now)}.`,
      columns: ['Name', 'Institution', 'Department', 'Field', 'Publications', 'h-index', 'Citations'],
      rows: researchers.map(r => ({
        Name: r.name,
        Institution: r.institution ?? '—',
        Department: r.department ?? '—',
        Field: r.field ?? '—',
        Publications: r.publications ?? 0,
        'h-index': r.hIndex ?? '—',
        Citations: r.citations ?? 0,
      })),
      summary: {
        'Total Researchers': researchers.length,
        'Total Publications': researchers.reduce((s, r) => s + (r.publications ?? 0), 0),
        'Total Citations': researchers.reduce((s, r) => s + (r.citations ?? 0), 0),
      },
    });
  }

  if (active.includes('publications')) {
    const sorted = [...research].sort((a, b) => (b.citations ?? 0) - (a.citations ?? 0));
    sections.push({
      title: 'Publications',
      description: 'All research papers published on or imported into the platform.',
      columns: ['Title', 'Authors', 'Field', 'Year', 'Citations', 'DOI', 'Funding Status'],
      rows: sorted.map(r => ({
        Title: r.title.length > 80 ? r.title.slice(0, 77) + '…' : r.title,
        Authors: r.authors?.join?.(', ') ?? (r.authors as unknown as string) ?? '—',
        Field: r.field ?? '—',
        Year: r.publicationDate ? new Date(r.publicationDate).getFullYear() : '—',
        Citations: r.citations ?? 0,
        DOI: r.doi ?? '—',
        'Funding Status': r.fundingStatus ?? '—',
      })),
      summary: {
        'Total Papers': research.length,
        'Most Cited': sorted[0]?.title?.slice(0, 40) ?? '—',
        'Peak Citations': sorted[0]?.citations ?? 0,
      },
    });
  }

  if (active.includes('citation_metrics')) {
    const withCitations = researchers.filter(r => (r.citations ?? 0) > 0);
    const topCited = [...researchers].sort((a, b) => (b.citations ?? 0) - (a.citations ?? 0)).slice(0, 20);
    sections.push({
      title: 'Citation Metrics',
      description: 'Top researchers ranked by citation count.',
      columns: ['Rank', 'Name', 'Institution', 'h-index', 'Total Citations', 'Publications'],
      rows: topCited.map((r, i) => ({
        Rank: i + 1,
        Name: r.name,
        Institution: r.institution ?? '—',
        'h-index': r.hIndex ?? '—',
        'Total Citations': r.citations ?? 0,
        Publications: r.publications ?? 0,
      })),
      summary: {
        'Researchers with Citations': withCitations.length,
        'Avg Citations/Researcher': withCitations.length
          ? Math.round(withCitations.reduce((s, r) => s + (r.citations ?? 0), 0) / withCitations.length)
          : 0,
      },
    });
  }

  if (active.includes('funding_requests')) {
    sections.push({
      title: 'Funding Requests',
      description: 'Funding requests submitted by researchers.',
      columns: ['Research Title', 'Researcher', 'Amount (USD)', 'Status', 'Date'],
      rows: fundingRequests.map(fr => ({
        'Research Title': fr.researchTitle ?? '—',
        Researcher: researchers.find(r => r.id === fr.researcherId)?.name ?? fr.researcherId,
        'Amount (USD)': fr.proposedAmount ? Number(fr.proposedAmount).toLocaleString() : '—',
        Status: fr.status,
        Date: fr.createdAt ? formatDate(new Date(fr.createdAt)) : '—',
      })),
      summary: {
        'Total Requests': fundingRequests.length,
        'Pending': fundingRequests.filter(r => r.status === 'pending').length,
        'Approved': fundingRequests.filter(r => r.status === 'approved').length,
      },
    });
  }

  if (active.includes('collaboration_requests')) {
    sections.push({
      title: 'Collaboration Requests',
      description: 'Collaboration requests between researchers.',
      columns: ['From', 'To', 'Research', 'Type', 'Status', 'Date'],
      rows: collaborationRequests.map(cr => ({
        From: cr.fromUserName ?? cr.fromUserId,
        To: researchers.find(r => r.id === cr.toUserId)?.name ?? cr.toUserId,
        Research: cr.researchTitle ?? '—',
        Type: cr.type ?? '—',
        Status: cr.status,
        Date: cr.createdAt ? formatDate(new Date(cr.createdAt)) : '—',
      })),
      summary: {
        'Total Requests': collaborationRequests.length,
        'Pending': collaborationRequests.filter(c => c.status === 'pending').length,
        'Accepted': collaborationRequests.filter(c => c.status === 'accepted').length,
      },
    });
  }

  if (active.includes('fields_breakdown')) {
    const fieldMap: Record<string, number> = {};
    research.forEach(r => { if (r.field) fieldMap[r.field] = (fieldMap[r.field] ?? 0) + 1; });
    const sorted = Object.entries(fieldMap).sort((a, b) => b[1] - a[1]);
    sections.push({
      title: 'Research Fields Breakdown',
      description: 'Distribution of publications across research fields.',
      columns: ['Field', 'Publications', '% of Total'],
      rows: sorted.map(([field, count]) => ({
        Field: field,
        Publications: count,
        '% of Total': `${((count / research.length) * 100).toFixed(1)}%`,
      })),
      summary: {
        'Distinct Fields': sorted.length,
        'Dominant Field': sorted[0]?.[0] ?? '—',
      },
    });
  }

  return {
    title: formName,
    type: formType,
    description: formDesc,
    generatedAt: now.toLocaleString('en-GB'),
    generatedBy: userName,
    sections,
  };
}

interface ReportBuilderProps {
  /** When true the create-report dialog opens immediately (used when embedded in a parent dashboard). */
  openCreate?: boolean;
  /** Called after the dialog has been opened so the parent can reset the flag. */
  onCreateHandled?: () => void;
  /** Pass true when embedded inside another page so this component does not compete for header actions. */
  embedded?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ReportBuilder({ openCreate, onCreateHandled, embedded }: ReportBuilderProps = {}) {
  const navigate = useNavigate();
  const {
    user, reports, reportData, createReport, updateReport,
    deleteReport, generateReport, scheduleReport, getReportHistory,
    researchers, research, fundingRequests, collaborationRequests,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'history'>('list');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'performance' as ReportType,
    description: '',
    schedule: 'monthly' as Schedule,
    format: 'pdf' as ReportFormat,
    sections: [] as string[],
  });

  useEffect(() => {
    if (!user || !['admin', 'manager'].includes(user.role)) navigate('/login');
  }, [user, navigate]);

  // Open dialog when parent passes openCreate=true
  useEffect(() => {
    if (openCreate) {
      setShowCreateDialog(true);
      onCreateHandled?.();
    }
  }, [openCreate, onCreateHandled]);

  const headerActions = useMemo(() => (
    embedded ? null : (
      <Button onClick={() => setShowCreateDialog(true)}>
        <Plus className="w-4 h-4 mr-2" /> New Report
      </Button>
    )
  ), [embedded]);
  usePageHeaderActions(headerActions);

  if (!user || !['admin', 'manager'].includes(user.role)) return null;

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
      sections: formData.sections.length > 0 ? formData.sections : SECTIONS_BY_TYPE[formData.type],
      recipients: [],
      status: 'draft',
    });
    setFormData({ name: '', type: 'performance', description: '', schedule: 'monthly', format: 'pdf', sections: [] });
    setShowCreateDialog(false);
    setActiveTab('list');
    toast.success('Report created. Select it and click "Generate & Download" to export.');
  };

  const handleGenerate = async (report: typeof selectedReport) => {
    if (!report) return;
    setGenerating(report.id);
    try {
      await new Promise(r => setTimeout(r, 300)); // let UI update
      const payload = buildPayload(
        report.name,
        report.type as ReportType,
        report.description ?? '',
        report.sections ?? [],
        user.name,
        { researchers, research, fundingRequests, collaborationRequests }
      );
      downloadReport(report.format as ReportFormat, payload);
      generateReport(report.id); // mark as generated in context
      toast.success(`${FORMAT_META[report.format as ReportFormat]?.label ?? report.format.toUpperCase()} report downloaded.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const FmtIcon = FORMAT_META[formData.format]?.icon ?? FileText;

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {([
          { id: 'list' as const, label: 'My Reports' },
          { id: 'create' as const, label: 'Create' },
          { id: 'history' as const, label: 'History' },
        ]).map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={tabClass(activeTab === tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── LIST TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Report list */}
          <div className="col-span-1">
            <Card className="p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base">Reports ({userReports.length})</h3>
                <Button size="sm" variant="outline" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              {userReports.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No reports yet.<br />
                  <button onClick={() => setActiveTab('create')} className="text-brand underline mt-1">Create one</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {userReports.map(report => {
                    const TypeIcon = TYPE_META[report.type as ReportType]?.icon ?? FileText;
                    const FmIcon = FORMAT_META[report.format as ReportFormat]?.icon ?? FileText;
                    return (
                      <Card
                        key={report.id}
                        onClick={() => setSelectedReportId(report.id)}
                        className={`p-3 cursor-pointer transition-all ${
                          selectedReportId === report.id ? 'ring-2 ring-brand bg-brand-muted' : 'hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <TypeIcon className="w-4 h-4 mt-0.5 text-brand flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-sm line-clamp-1">{report.name}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge variant="secondary" className="text-xs px-1.5 py-0">{report.type}</Badge>
                              <FmIcon className={`w-3 h-3 ${FORMAT_META[report.format as ReportFormat]?.color ?? ''}`} />
                              <span className="text-xs text-muted-foreground uppercase">{report.format}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Report detail */}
          <div className="col-span-2">
            {selectedReport ? (
              <Card className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{selectedReport.name}</h2>
                    {selectedReport.description && (
                      <p className="text-muted-foreground text-sm">{selectedReport.description}</p>
                    )}
                  </div>
                  <Badge className={selectedReport.status === 'active' || selectedReport.lastGenerated
                    ? 'bg-success-muted text-success-foreground'
                    : 'bg-warning-muted text-warning-foreground'}>
                    {selectedReport.lastGenerated ? 'generated' : selectedReport.status}
                  </Badge>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-8 border-b">
                  {[
                    { label: 'Type', value: TYPE_META[selectedReport.type as ReportType]?.label ?? selectedReport.type },
                    { label: 'Format', value: FORMAT_META[selectedReport.format as ReportFormat]?.label ?? selectedReport.format.toUpperCase() },
                    { label: 'Schedule', value: selectedReport.schedule },
                    { label: 'Created', value: selectedReport.createdAt },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
                      <div className="font-medium capitalize">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Sections */}
                <div className="mb-8 pb-8 border-b">
                  <h3 className="font-semibold mb-3 text-sm">Included Sections</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedReport.sections ?? []).map(section => (
                      <Badge key={section} variant="secondary" className="text-xs capitalize">
                        {section.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Data preview */}
                <div className="mb-8 pb-8 border-b">
                  <h3 className="font-semibold mb-3 text-sm">Data Preview</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Researchers', value: researchers.length },
                      { label: 'Publications', value: research.length },
                      { label: 'Funding Requests', value: fundingRequests.length },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center p-3 bg-muted/40 rounded-lg">
                        <div className="text-2xl font-bold text-brand">{value}</div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedReport.lastGenerated && (
                  <div className="mb-8 pb-8 border-b text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 inline mr-1 text-success" />
                    Last generated: {selectedReport.lastGenerated}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleGenerate(selectedReport)}
                    disabled={generating === selectedReport.id}
                    className="flex-1 min-w-[160px] gap-2"
                  >
                    {generating === selectedReport.id
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                      : <><Download className="w-4 h-4" /> Generate & Download</>}
                  </Button>

                  {/* Quick format switcher */}
                  <div className="flex gap-1">
                    {(Object.keys(FORMAT_META) as ReportFormat[]).map(fmt => {
                      const { icon: FmtIco, color } = FORMAT_META[fmt];
                      const isActive = selectedReport.format === fmt;
                      return (
                        <Button
                          key={fmt}
                          size="sm"
                          variant={isActive ? 'default' : 'outline'}
                          className={`px-2 ${isActive ? '' : color}`}
                          title={`Switch to ${fmt.toUpperCase()} and download`}
                          onClick={() => {
                            updateReport(selectedReport.id, { format: fmt });
                            handleGenerate({ ...selectedReport, format: fmt });
                          }}
                        >
                          <FmtIco className="w-4 h-4" />
                        </Button>
                      );
                    })}
                  </div>

                  <Button variant="outline" onClick={() => scheduleReport(selectedReport.id)} className="gap-2">
                    <Clock className="w-4 h-4" /> Schedule
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive gap-2"
                    onClick={() => { deleteReport(selectedReport.id); setSelectedReportId(null); }}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-12 flex flex-col items-center justify-center min-h-96 text-center gap-4">
                <BarChart2 className="w-12 h-12 text-muted-foreground/30" />
                <div>
                  <p className="font-medium mb-1">Select a report</p>
                  <p className="text-sm text-muted-foreground">Pick a report from the list, then click "Generate & Download" to export it.</p>
                </div>
                <Button variant="outline" onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" /> Create your first report
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'create' && (
        <div className="max-w-3xl">
          <Card className="p-8">
            <h2 className="text-lg font-semibold mb-6">Create New Report</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label className="block mb-2">Report Name</Label>
                  <Input
                    placeholder="e.g., Monthly Performance Summary"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label className="block mb-2">Description</Label>
                  <Textarea
                    placeholder="Briefly describe the purpose of this report…"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              {/* Type cards */}
              <div>
                <Label className="block mb-3">Report Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.entries(TYPE_META) as [ReportType, typeof TYPE_META[ReportType]][]).map(([key, meta]) => {
                    const Icon = meta.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: key, sections: [] })}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.type === key ? 'border-brand bg-brand-muted' : 'border-border hover:border-brand/40'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${formData.type === key ? 'text-brand' : 'text-muted-foreground'}`} />
                        <div className="font-medium text-sm">{meta.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{meta.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format + Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-2">Output Format</Label>
                  <Select value={formData.format} onValueChange={v => setFormData({ ...formData, format: v as ReportFormat })}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <FmtIcon className={`w-4 h-4 ${FORMAT_META[formData.format].color}`} />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(FORMAT_META) as [ReportFormat, typeof FORMAT_META[ReportFormat]][]).map(([key, meta]) => {
                        const Icon = meta.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${meta.color}`} />
                              {meta.label}
                              <span className="text-muted-foreground text-xs">{meta.ext}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block mb-2">Schedule</Label>
                  <Select value={formData.schedule} onValueChange={v => setFormData({ ...formData, schedule: v as Schedule })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['once', 'daily', 'weekly', 'monthly', 'quarterly'].map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Section checkboxes */}
              <div>
                <Label className="block mb-3">Report Sections</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SECTIONS_BY_TYPE[formData.type].map(section => (
                    <label key={section} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 cursor-pointer">
                      <Checkbox
                        checked={formData.sections.includes(section)}
                        onCheckedChange={checked => {
                          setFormData({
                            ...formData,
                            sections: checked
                              ? [...formData.sections, section]
                              : formData.sections.filter(s => s !== section),
                          });
                        }}
                      />
                      <span className="text-sm capitalize">{section.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
                {formData.sections.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-2">All sections will be included if none are selected.</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleCreateReport} disabled={!formData.name.trim()} className="flex-1 gap-2">
                  <Plus className="w-4 h-4" /> Create Report
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('list')} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── HISTORY TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <Card className="p-6">
          {selectedReport ? (
            <>
              <h2 className="text-lg font-semibold mb-6">Generation History: {selectedReport.name}</h2>
              {selectedReportHistory.length > 0 ? (
                <div className="space-y-3">
                  {selectedReportHistory.map(data => {
                    const fmt = (data.format ?? selectedReport.format) as ReportFormat;
                    const FmtIco = FORMAT_META[fmt]?.icon ?? FileText;
                    return (
                      <div key={data.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30">
                        <div className="flex items-center gap-3">
                          <FmtIco className={`w-5 h-5 ${FORMAT_META[fmt]?.color ?? ''}`} />
                          <div>
                            <div className="font-medium text-sm">{data.fileName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(data.generatedAt).toLocaleString('en-GB')}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleGenerate(selectedReport)}>
                          <Download className="w-3.5 h-3.5" /> Re-download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No history yet. Go to <button onClick={() => setActiveTab('list')} className="underline text-brand">My Reports</button> and generate one.</p>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>Select a report in <button onClick={() => setActiveTab('list')} className="underline text-brand">My Reports</button> to view its history.</p>
            </div>
          )}
        </Card>
      )}

      {/* ── Quick Create Dialog ───────────────────────────────────────────── */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Create Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="mb-2 block">Report Name</Label>
              <Input
                placeholder="e.g., Q2 Performance Report"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 block">Type</Label>
              <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as ReportType, sections: [] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(TYPE_META) as [ReportType, typeof TYPE_META[ReportType]][]).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>{meta.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Format</Label>
              <div className="flex gap-2">
                {(Object.entries(FORMAT_META) as [ReportFormat, typeof FORMAT_META[ReportFormat]][]).map(([key, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, format: key })}
                      className={`flex-1 flex flex-col items-center gap-1 p-2.5 rounded-lg border-2 transition-all ${
                        formData.format === key ? 'border-brand bg-brand-muted' : 'border-border hover:border-border/80'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${meta.color}`} />
                      <span className="text-xs font-medium">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <Button onClick={handleCreateReport} className="w-full gap-2" disabled={!formData.name.trim()}>
              <Plus className="w-4 h-4" /> Create Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
