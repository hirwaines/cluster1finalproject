import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import {
  CheckCircle, XCircle, Clock, DollarSign, Users, FileText,
  MessageCircle, Send, TrendingUp,
} from 'lucide-react';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected';

const NAV  = '#1E40AF';
const NAVY = '#1E3A8A';
const EMLD = '#047857';
const TEXT = '#0F172A';

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: '#FFFBEB', color: '#B45309', icon: Clock },
  accepted: { label: 'Approved', bg: '#ECFDF5', color: '#065F46', icon: CheckCircle },
  rejected: { label: 'Rejected', bg: '#FEF2F2', color: '#B91C1C', icon: XCircle },
};

export function RequestsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, collaborationRequests, acceptCollaborationRequest, rejectCollaborationRequest, researchers, openChatWith } = useApp();

  const defaultTab = location.state?.tab === 'sent' ? 1 : 0;
  const [tab, setTab] = useState(defaultTab);
  const [filter, setFilter] = useState<StatusFilter>('all');

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  const incoming = collaborationRequests.filter(r => r.toUserId === user.id);
  const sent     = collaborationRequests.filter(r => r.fromUserId === user.id);
  const active   = tab === 0 ? incoming : sent;

  const filtered = filter === 'all' ? active : active.filter(r => r.status === filter);
  const countStatus = (list: typeof collaborationRequests, s: string) => list.filter(r => r.status === s).length;
  const getUser = (id: string) => researchers.find(r => r.id === id);

  const handleAccept = (id: string, name: string) => { acceptCollaborationRequest(id); toast.success(`Accepted request from ${name}`); };
  const handleReject = (id: string, name: string) => { rejectCollaborationRequest(id); toast.success(`Declined request from ${name}`); };

  const pendingIncoming = countStatus(incoming, 'pending');

  return (
    <ResearcherLayout>
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.75, color: TEXT }}>Requests & Applications</Typography>
          <Typography variant="body2" color="text.secondary">
            Track incoming collaboration requests and your submitted funding applications
          </Typography>
        </Box>

        {/* Summary stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Incoming',    value: incoming.length,                                color: NAV,     bg: '#EFF6FF', icon: Users },
            { label: 'Sent',        value: sent.length,                                    color: '#7C3AED', bg: '#F5F3FF', icon: Send },
            { label: 'Approved',    value: countStatus([...incoming, ...sent], 'accepted'), color: EMLD,    bg: '#ECFDF5', icon: CheckCircle },
            { label: 'Pending',     value: countStatus([...incoming, ...sent], 'pending'),  color: '#B45309', bg: '#FFFBEB', icon: Clock },
          ].map(m => {
            const Icon = m.icon;
            return (
              <Grid key={m.label} size={{ xs: 6, sm: 3 }}>
                <Card sx={{ bgcolor: '#FFFFFF' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ width: 38, height: 38, bgcolor: m.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                      <Icon size={18} color={m.color} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} sx={{ color: m.color, lineHeight: 1, mb: 0.5 }}>{m.value}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>{m.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #E2E8F0', mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setFilter('all'); }}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.9375rem', color: '#64748B' },
              '& .Mui-selected': { color: NAV, fontWeight: 700 },
              '& .MuiTabs-indicator': { bgcolor: NAV },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Users size={16} />
                  Incoming Requests
                  {pendingIncoming > 0 && (
                    <Box sx={{ px: '7px', py: '1px', bgcolor: '#DC2626', color: '#fff', borderRadius: '10px', fontSize: '0.6875rem', fontWeight: 700 }}>
                      {pendingIncoming}
                    </Box>
                  )}
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Send size={16} />
                  My Applications
                  {sent.length > 0 && (
                    <Box sx={{ px: '7px', py: '1px', bgcolor: '#E2E8F0', color: '#475569', borderRadius: '10px', fontSize: '0.6875rem', fontWeight: 700 }}>
                      {sent.length}
                    </Box>
                  )}
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Status filter pills */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {(['all', 'pending', 'accepted', 'rejected'] as StatusFilter[]).map(s => {
            const count = s === 'all' ? active.length : active.filter(r => r.status === s).length;
            return (
              <Chip
                key={s}
                label={`${s.charAt(0).toUpperCase() + s.slice(1)} (${count})`}
                onClick={() => setFilter(s)}
                sx={{
                  fontWeight: filter === s ? 700 : 500,
                  bgcolor: filter === s ? NAV : '#F8FAFC',
                  color: filter === s ? '#fff' : '#475569',
                  border: `1px solid ${filter === s ? NAV : '#E2E8F0'}`,
                  '&:hover': { bgcolor: filter === s ? NAVY : '#EFF6FF', borderColor: NAV },
                  cursor: 'pointer',
                  borderRadius: '20px',
                }}
              />
            );
          })}
        </Box>

        {/* Sent tab info banner */}
        {tab === 1 && (
          <Alert severity="info" icon={<TrendingUp size={18} />} sx={{ mb: 3, borderRadius: '10px', bgcolor: '#EFF6FF', color: NAV, border: '1px solid #BFDBFE', '& .MuiAlert-icon': { color: NAV } }}>
            <strong>Funding application status</strong> — every collaboration request and funding application you have submitted is tracked here. Status updates in real time.
          </Alert>
        )}

        {/* Request cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.length === 0 ? (
            <Card sx={{ bgcolor: '#FFFFFF' }}>
              <CardContent sx={{ p: 8, textAlign: 'center' }}>
                <FileText size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                  {tab === 1 ? 'No applications submitted yet' : 'No requests found'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {tab === 1
                    ? 'Apply for funding opportunities or send collaboration requests to see them tracked here.'
                    : filter !== 'all'
                      ? `No ${filter} requests.`
                      : 'You have no incoming requests at the moment.'}
                </Typography>
                {tab === 1 && (
                  <Button variant="contained" onClick={() => navigate('/funding')} sx={{ bgcolor: NAV, '&:hover': { bgcolor: NAVY } }}>
                    Browse Funding Opportunities
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filtered.map(request => {
              const otherUserId  = tab === 0 ? request.fromUserId : request.toUserId;
              const otherUser    = getUser(otherUserId);
              const displayName  = tab === 0 ? request.fromUserName : (otherUser?.name || 'Recipient');
              const isFunding    = request.type === 'funding';
              const statusCfg    = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
              const StatusIcon   = statusCfg.icon;

              const borderAccent = request.status === 'accepted' ? EMLD : request.status === 'rejected' ? '#DC2626' : '#F59E0B';

              return (
                <Card
                  key={request.id}
                  sx={{
                    bgcolor: '#FFFFFF',
                    borderLeft: `4px solid ${borderAccent}`,
                    '&:hover': { boxShadow: '0 4px 12px rgba(15,23,42,0.08)' },
                    transition: 'box-shadow 0.15s',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2.5 }}>
                      {/* Avatar */}
                      <Avatar sx={{ width: 52, height: 52, bgcolor: NAV, fontWeight: 700, fontSize: '1.25rem', flexShrink: 0 }}>
                        {displayName.charAt(0)}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                              <Typography variant="subtitle1" fontWeight={700} sx={{ color: TEXT }}>
                                {displayName}
                              </Typography>
                              {/* Status chip */}
                              <Chip
                                icon={<StatusIcon size={12} />}
                                label={statusCfg.label}
                                size="small"
                                sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, fontWeight: 700, height: 24, fontSize: '0.75rem', borderRadius: '6px', '& .MuiChip-icon': { color: statusCfg.color } }}
                              />
                              {/* Type chip */}
                              <Chip
                                icon={isFunding ? <DollarSign size={11} /> : <Users size={11} />}
                                label={isFunding ? 'Funding Application' : 'Collaboration'}
                                size="small"
                                sx={{
                                  bgcolor: isFunding ? '#ECFDF5' : '#EFF6FF',
                                  color: isFunding ? EMLD : NAV,
                                  fontWeight: 600, height: 24, fontSize: '0.75rem', borderRadius: '6px',
                                  '& .MuiChip-icon': { color: isFunding ? EMLD : NAV },
                                  border: `1px solid ${isFunding ? '#A7F3D0' : '#BFDBFE'}`,
                                }}
                              />
                            </Box>
                            {otherUser && (
                              <Typography variant="caption" color="text.secondary">
                                {otherUser.department} · {otherUser.institution}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                            {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </Box>

                        {/* Details */}
                        <Box sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', p: 2, mb: 2 }}>
                          {request.researchTitle && (
                            <Box sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
                              <Typography variant="caption" fontWeight={700} sx={{ color: '#334155', flexShrink: 0 }}>Research:</Typography>
                              <Typography variant="caption" color="text.secondary">{request.researchTitle}</Typography>
                            </Box>
                          )}
                          {request.fundingTitle && (
                            <Box sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
                              <Typography variant="caption" fontWeight={700} sx={{ color: '#334155', flexShrink: 0 }}>Funding call:</Typography>
                              <Typography variant="caption" color="text.secondary">{request.fundingTitle}</Typography>
                            </Box>
                          )}
                          {request.collaborationType && (
                            <Box sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
                              <Typography variant="caption" fontWeight={700} sx={{ color: '#334155', flexShrink: 0 }}>Type:</Typography>
                              <Typography variant="caption" color="text.secondary">{request.collaborationType}</Typography>
                            </Box>
                          )}
                          {request.proposedAmount && (
                            <Box sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
                              <Typography variant="caption" fontWeight={700} sx={{ color: '#334155', flexShrink: 0 }}>Proposed amount:</Typography>
                              <Typography variant="caption" fontWeight={600} sx={{ color: EMLD }}>{request.proposedAmount}</Typography>
                            </Box>
                          )}
                          {request.timeline && (
                            <Box sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
                              <Typography variant="caption" fontWeight={700} sx={{ color: '#334155', flexShrink: 0 }}>Timeline:</Typography>
                              <Typography variant="caption" color="text.secondary">{request.timeline}</Typography>
                            </Box>
                          )}
                          <Divider sx={{ my: 1 }} />
                          <Box>
                            <Typography variant="caption" fontWeight={700} sx={{ color: '#334155' }}>Message:</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.6 }}>{request.message}</Typography>
                          </Box>
                        </Box>

                        {/* Sent status explanation */}
                        {tab === 1 && (
                          <Alert
                            severity={request.status === 'accepted' ? 'success' : request.status === 'rejected' ? 'error' : 'warning'}
                            icon={<StatusIcon size={16} />}
                            sx={{ mb: 2, borderRadius: '8px', py: 0.75 }}
                          >
                            <Typography variant="caption">
                              {request.status === 'accepted' && 'Your application was approved. You can now proceed with the collaboration or funding arrangement.'}
                              {request.status === 'rejected' && 'Your application was not accepted this time. Consider revising your proposal or exploring other opportunities.'}
                              {request.status === 'pending' && 'Your application is under review. You will be notified once the recipient responds.'}
                            </Typography>
                          </Alert>
                        )}

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {tab === 0 && request.status === 'pending' && (
                            <>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<CheckCircle size={14} />}
                                onClick={() => handleAccept(request.id, request.fromUserName)}
                                sx={{ bgcolor: EMLD, '&:hover': { bgcolor: '#065F46' } }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<XCircle size={14} />}
                                onClick={() => handleReject(request.id, request.fromUserName)}
                                sx={{ borderColor: '#FCA5A5', color: '#B91C1C', '&:hover': { bgcolor: '#FEF2F2', borderColor: '#EF4444' } }}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {otherUser && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/researcher/profile/${otherUser.id}`)}
                              sx={{ borderColor: '#E2E8F0', color: '#334155' }}
                            >
                              View Profile
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MessageCircle size={14} />}
                            onClick={() => openChatWith(otherUserId)}
                            sx={{ borderColor: '#E2E8F0', color: '#334155' }}
                          >
                            Chat
                          </Button>
                          {tab === 1 && request.status === 'rejected' && isFunding && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate('/funding')}
                              sx={{ borderColor: '#BFDBFE', color: NAV, '&:hover': { bgcolor: '#EFF6FF' } }}
                            >
                              Browse Other Opportunities
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </Container>
    </ResearcherLayout>
  );
}
