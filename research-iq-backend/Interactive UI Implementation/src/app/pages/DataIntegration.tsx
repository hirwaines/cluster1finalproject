import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import LinearProgress from '@mui/material/LinearProgress';
import { AppShell } from '../components/AppShell';
import { useApp } from '../context/AppContext';
import {
  Search, RefreshCw, CheckCircle, AlertCircle, Clock,
  Download, Plus, Database, BookOpen, Globe, ExternalLink,
  X, Filter, TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

const BLUE  = '#1E40AF';
const GREEN = '#047857';

// ── Data ─────────────────────────────────────────────────────────────────────

const ACADEMIC_SOURCES = [
  { id: 'scopus',   name: 'Scopus',             category: 'Citations',          status: 'Connected', lastSync: '2 hours ago',   records: 1248, url: 'https://scopus.com' },
  { id: 'wos',      name: 'Web of Science',     category: 'Citations',          status: 'Connected', lastSync: '5 hours ago',   records: 3456, url: 'https://webofscience.com' },
  { id: 'pubmed',   name: 'PubMed / MEDLINE',   category: 'Publications',       status: 'Connected', lastSync: '1 day ago',     records: 892,  url: 'https://pubmed.ncbi.nlm.nih.gov' },
  { id: 'orcid',    name: 'ORCID',              category: 'Researcher Profiles', status: 'Connected', lastSync: '3 hours ago',   records: 142,  url: 'https://orcid.org' },
  { id: 'repo',     name: 'Institutional Repository', category: 'Documents',   status: 'Syncing',   lastSync: 'In progress',   records: 2341, url: '#' },
  { id: 'scholar',  name: 'Google Scholar',     category: 'Publications',       status: 'Error',     lastSync: '2 days ago',    records: 0,    url: 'https://scholar.google.com' },
  { id: 'semantic', name: 'Semantic Scholar',   category: 'Publications',       status: 'Connected', lastSync: '6 hours ago',   records: 987,  url: 'https://semanticscholar.org' },
  { id: 'crossref', name: 'CrossRef',           category: 'DOI / Metadata',     status: 'Connected', lastSync: '1 hour ago',    records: 4120, url: 'https://crossref.org' },
  { id: 'arxiv',    name: 'arXiv',              category: 'Preprints',          status: 'Connected', lastSync: '4 hours ago',   records: 1893, url: 'https://arxiv.org' },
  { id: 'dimensions', name: 'Dimensions',       category: 'Analytics',          status: 'Disconnected', lastSync: 'Never',     records: 0,    url: 'https://dimensions.ai' },
];

const PUBLISHERS = [
  { id: 'ieee',      name: 'IEEE Xplore',       country: 'USA',        fields: 'Engineering, CS, Electronics',        access: 'Subscription', records: 5200, status: 'Connected' },
  { id: 'springer',  name: 'Springer Nature',   country: 'Germany',    fields: 'Science, Medicine, Technology',        access: 'Subscription', records: 8100, status: 'Connected' },
  { id: 'elsevier',  name: 'Elsevier (ScienceDirect)', country: 'Netherlands', fields: 'Multi-disciplinary',           access: 'Subscription', records: 12400, status: 'Connected' },
  { id: 'wiley',     name: 'Wiley Online Library', country: 'USA',     fields: 'Science, Health, Social Sciences',     access: 'Subscription', records: 3800, status: 'Syncing' },
  { id: 'taylor',    name: 'Taylor & Francis',  country: 'UK',         fields: 'Humanities, Social Sciences, STEM',    access: 'Subscription', records: 2900, status: 'Connected' },
  { id: 'oxford',    name: 'Oxford University Press', country: 'UK',   fields: 'Humanities, Medicine, Science',        access: 'Subscription', records: 3100, status: 'Connected' },
  { id: 'cambridge', name: 'Cambridge University Press', country: 'UK', fields: 'Humanities, Social Sciences',         access: 'Subscription', records: 1700, status: 'Connected' },
  { id: 'plos',      name: 'PLoS ONE',          country: 'USA',        fields: 'Biology, Medicine, Science (Open)',     access: 'Open Access', records: 2200, status: 'Connected' },
  { id: 'mdpi',      name: 'MDPI',              country: 'Switzerland', fields: 'Multi-disciplinary (Open Access)',     access: 'Open Access', records: 4300, status: 'Connected' },
  { id: 'acm',       name: 'ACM Digital Library', country: 'USA',      fields: 'Computer Science, IT',                 access: 'Subscription', records: 1950, status: 'Connected' },
  { id: 'nature',    name: 'Nature Portfolio',  country: 'UK',         fields: 'Biology, Physics, Chemistry, Earth',   access: 'Subscription', records: 890, status: 'Connected' },
  { id: 'science',   name: 'Science (AAAS)',    country: 'USA',        fields: 'General Science',                      access: 'Subscription', records: 420, status: 'Disconnected' },
  { id: 'jika',      name: 'JIKA',              country: 'Rwanda',     fields: 'African Research, Multi-disciplinary', access: 'Open Access', records: 318, status: 'Connected' },
  { id: 'ajol',      name: 'AJOL',              country: 'South Africa', fields: 'African Journals (Open Access)',      access: 'Open Access', records: 1120, status: 'Connected' },
  { id: 'codesria',  name: 'CODESRIA',          country: 'Senegal',    fields: 'African Social Sciences',              access: 'Open Access', records: 245, status: 'Connected' },
  { id: 'aas',       name: 'African Academy of Sciences', country: 'Kenya', fields: 'African Applied Research',        access: 'Open Access', records: 189, status: 'Syncing' },
];

type SourceStatus = 'Connected' | 'Syncing' | 'Error' | 'Disconnected';

const STATUS_CONFIG: Record<SourceStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Connected:    { color: GREEN,     bg: '#ECFDF5', icon: CheckCircle },
  Syncing:      { color: BLUE,      bg: '#EFF6FF', icon: RefreshCw },
  Error:        { color: '#DC2626', bg: '#FEF2F2', icon: AlertCircle },
  Disconnected: { color: '#64748B', bg: '#F1F5F9', icon: Clock },
};

function StatusChip({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as SourceStatus] ?? STATUS_CONFIG.Disconnected;
  const Icon = cfg.icon;
  return (
    <Chip
      icon={<Icon size={12} color={cfg.color} />}
      label={status}
      size="small"
      sx={{
        bgcolor: cfg.bg, color: cfg.color,
        fontWeight: 600, fontSize: '0.6875rem',
        '& .MuiChip-icon': { ml: '6px' },
      }}
    />
  );
}

function downloadCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DataIntegration() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [tab,         setTab]         = useState(0);
  const [search,      setSearch]      = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addOpen,     setAddOpen]     = useState(false);
  const [syncing,     setSyncing]     = useState<Set<string>>(new Set());

  if (!user) { navigate('/login'); return null; }

  const isAdmin   = user.role === 'admin';
  const isManager = user.role === 'manager';

  const canManage = isAdmin || isManager;

  const filteredSources = useMemo(() => {
    return ACADEMIC_SOURCES.filter(s => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, statusFilter]);

  const filteredPublishers = useMemo(() => {
    return PUBLISHERS.filter(p => {
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.fields.toLowerCase().includes(search.toLowerCase()) &&
          !p.country.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, statusFilter]);

  const handleSync = (id: string, name: string) => {
    setSyncing(prev => new Set(prev).add(id));
    toast.info(`Syncing ${name}…`);
    setTimeout(() => {
      setSyncing(prev => { const n = new Set(prev); n.delete(id); return n; });
      toast.success(`${name} synced successfully`);
    }, 2500);
  };

  const handleExportSources = () => {
    const rows = ACADEMIC_SOURCES.map(s => ({
      Name: s.name, Category: s.category, Status: s.status,
      'Last Sync': s.lastSync, Records: s.records,
    }));
    downloadCSV(rows, 'data-sources.csv');
    toast.success('Exported data-sources.csv');
  };

  const handleExportPublishers = () => {
    const rows = PUBLISHERS.map(p => ({
      Name: p.name, Country: p.country, Fields: p.fields,
      Access: p.access, Records: p.records, Status: p.status,
    }));
    downloadCSV(rows, 'publishing-houses.csv');
    toast.success('Exported publishing-houses.csv');
  };

  const totalRecords = ACADEMIC_SOURCES.filter(s => s.status === 'Connected').reduce((a, b) => a + b.records, 0);
  const connected    = ACADEMIC_SOURCES.filter(s => s.status === 'Connected').length;
  const pubRecords   = PUBLISHERS.filter(p => p.status === 'Connected').reduce((a, b) => a + b.records, 0);

  return (
    <AppShell>
      <Box sx={{ p: 4 }}>

        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#0F172A', mb: 0.25 }}>
              Data Sources
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage academic database connections and publishing house integrations
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {canManage && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Plus size={14} />}
                onClick={() => setAddOpen(true)}
                sx={{ borderColor: BLUE, color: BLUE }}
              >
                Add Source
              </Button>
            )}
          </Box>
        </Box>

        {/* Stat cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 2, mb: 3 }}>
          {[
            { label: 'Connected Sources',    value: connected,               color: GREEN },
            { label: 'Total Records',        value: totalRecords.toLocaleString(), color: BLUE },
            { label: 'Publisher Records',    value: pubRecords.toLocaleString(),   color: BLUE },
            { label: 'African Publishers',   value: 4,                       color: GREEN },
          ].map(s => (
            <Card key={s.label} variant="outlined" sx={{ borderRadius: '10px', borderColor: '#E2E8F0' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Filters row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search sources…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={15} color="#94A3B8" /></InputAdornment>,
            }}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
              {['All','Connected','Syncing','Error','Disconnected'].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2.5, borderBottom: '1px solid #E2E8F0' }}>
          <Tab label={`Academic Databases (${ACADEMIC_SOURCES.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label={`Publishing Houses (${PUBLISHERS.length})`}        sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>

        {/* ── Tab 0: Academic Databases ─────────────────────────────────── */}
        {tab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Download size={14} />}
                onClick={handleExportSources}
                sx={{ borderColor: '#E2E8F0', color: '#64748B', '&:hover': { borderColor: BLUE, color: BLUE } }}
              >
                Export CSV
              </Button>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px', borderColor: '#E2E8F0' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    {['Source', 'Category', 'Status', 'Last Sync', 'Records', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', py: 1.5, borderBottom: '1px solid #E2E8F0' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSources.map(s => (
                    <TableRow
                      key={s.id}
                      sx={{ '&:hover': { bgcolor: '#F8FAFC' }, '&:last-child td': { border: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Database size={15} color={BLUE} />
                          <Typography variant="body2" fontWeight={600}>{s.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{s.category}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={syncing.has(s.id) ? 'Syncing' : s.status} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{s.lastSync}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{s.records.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {canManage && (
                            <Tooltip title="Sync now">
                              <IconButton
                                size="small"
                                onClick={() => handleSync(s.id, s.name)}
                                disabled={syncing.has(s.id) || s.status === 'Error'}
                              >
                                <RefreshCw size={14} color={syncing.has(s.id) ? '#94A3B8' : BLUE} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {s.url !== '#' && (
                            <Tooltip title="Open source">
                              <IconButton size="small" component="a" href={s.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={14} color="#64748B" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {filteredSources.some(s => s.status === 'Syncing') && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                  Sync in progress…
                </Typography>
                <LinearProgress sx={{ height: 4, borderRadius: 2, bgcolor: '#EFF6FF', '& .MuiLinearProgress-bar': { bgcolor: BLUE } }} />
              </Box>
            )}
          </>
        )}

        {/* ── Tab 1: Publishing Houses ──────────────────────────────────── */}
        {tab === 1 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Download size={14} />}
                onClick={handleExportPublishers}
                sx={{ borderColor: '#E2E8F0', color: '#64748B', '&:hover': { borderColor: BLUE, color: BLUE } }}
              >
                Export CSV
              </Button>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px', borderColor: '#E2E8F0' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    {['Publisher', 'Country', 'Fields', 'Access', 'Records', 'Status', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.75rem', py: 1.5, borderBottom: '1px solid #E2E8F0' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPublishers.map(p => (
                    <TableRow
                      key={p.id}
                      sx={{ '&:hover': { bgcolor: '#F8FAFC' }, '&:last-child td': { border: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BookOpen size={15} color={GREEN} />
                          <Typography variant="body2" fontWeight={700}>{p.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Globe size={12} color="#94A3B8" />
                          <Typography variant="caption" color="text.secondary">{p.country}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="caption" color="text.secondary" sx={{
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {p.fields}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={p.access}
                          size="small"
                          sx={{
                            bgcolor: p.access === 'Open Access' ? '#ECFDF5' : '#EFF6FF',
                            color:   p.access === 'Open Access' ? GREEN : BLUE,
                            fontWeight: 600, fontSize: '0.6875rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{p.records.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={syncing.has(p.id) ? 'Syncing' : p.status} />
                      </TableCell>
                      <TableCell>
                        {canManage && (
                          <Tooltip title="Sync now">
                            <IconButton
                              size="small"
                              onClick={() => handleSync(p.id, p.name)}
                              disabled={syncing.has(p.id) || p.status === 'Error' || p.status === 'Disconnected'}
                            >
                              <RefreshCw size={14} color={syncing.has(p.id) ? '#94A3B8' : BLUE} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Add Source Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: '12px' } }}>
          <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Add New Data Source
            <IconButton size="small" onClick={() => setAddOpen(false)}><X size={18} /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField label="Source name *"    size="small" fullWidth />
              <TextField label="API endpoint URL" size="small" fullWidth placeholder="https://api.example.com/v1" />
              <TextField label="API key"          size="small" fullWidth type="password" />
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select label="Category" defaultValue="">
                  {['Publications','Citations','Researcher Profiles','DOI / Metadata','Preprints','Analytics'].map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Notes" size="small" fullWidth multiline rows={2} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAddOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => { setAddOpen(false); toast.success('Data source added (demo)'); }}
              sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1E3A8A' } }}
            >
              Add Source
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppShell>
  );
}
