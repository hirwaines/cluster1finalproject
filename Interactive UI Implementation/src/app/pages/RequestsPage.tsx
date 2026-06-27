import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';
import { useApp } from '../context/AppContext';
import {
  CheckCircle, XCircle, Clock, DollarSign, Users, FileText,
  MessageCircle, Send, Info,
} from 'lucide-react';
import { toast } from 'sonner';

type MainTab = 'incoming' | 'sent';
type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected';

export function RequestsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    collaborationRequests,
    acceptCollaborationRequest,
    rejectCollaborationRequest,
    researchers,
    openChatWith,
  } = useApp();

  // Auto-open sent tab if redirected from funding/collaboration apply
  const defaultTab: MainTab = location.state?.tab === 'sent' ? 'sent' : 'incoming';
  const [mainTab, setMainTab] = useState<MainTab>(defaultTab);
  const [filter, setFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  // Incoming: requests sent TO this user
  const incoming = collaborationRequests.filter(r => r.toUserId === user.id);

  // Sent: requests sent BY this user (both collaboration and funding applications)
  const sent = collaborationRequests.filter(r => r.fromUserId === user.id);

  const applyFilter = (list: typeof collaborationRequests) =>
    filter === 'all' ? list : list.filter(r => r.status === filter);

  const filteredIncoming = applyFilter(incoming);
  const filteredSent = applyFilter(sent);

  const countByStatus = (list: typeof collaborationRequests, status: string) =>
    list.filter(r => r.status === status).length;

  const getRequester = (userId: string) => researchers.find(r => r.id === userId);

  const handleAccept = (id: string, name: string) => {
    acceptCollaborationRequest(id);
    toast.success(`Accepted request from ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    rejectCollaborationRequest(id);
    toast.success(`Declined request from ${name}`);
  };

  const statusBadge = (status: string) => {
    if (status === 'pending') return (
      <Badge className="bg-warning-muted text-warning-foreground">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>
    );
    if (status === 'accepted') return (
      <Badge className="bg-success-muted text-success-foreground">
        <CheckCircle className="w-3 h-3 mr-1" /> Approved
      </Badge>
    );
    return (
      <Badge className="bg-destructive/10 text-destructive">
        <XCircle className="w-3 h-3 mr-1" /> Rejected
      </Badge>
    );
  };

  const activeList = mainTab === 'incoming' ? filteredIncoming : filteredSent;

  return (
    <>
        {/* Main tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => { setMainTab('incoming'); setFilter('all'); }}
            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-colors ${mainTab === 'incoming' ? 'border-b-2 border-brand text-brand' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Users className="w-4 h-4" />
            Incoming Requests
            {countByStatus(incoming, 'pending') > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-destructive/100 text-white text-xs rounded-full">
                {countByStatus(incoming, 'pending')}
              </span>
            )}
          </button>
          <button
            onClick={() => { setMainTab('sent'); setFilter('all'); }}
            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-colors ${mainTab === 'sent' ? 'border-b-2 border-brand text-brand' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Send className="w-4 h-4" />
            My Applications & Sent Requests
            {sent.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-muted text-foreground text-xs rounded-full">
                {sent.length}
              </span>
            )}
          </button>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'accepted', 'rejected'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                filter === s
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-muted-foreground border-border hover:border-brand/40'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {' '}({applyFilter(mainTab === 'incoming' ? incoming : sent).filter(r => s === 'all' || r.status === s).length})
            </button>
          ))}
        </div>

        {/* ── SENT / MY APPLICATIONS banner ── */}
        {mainTab === 'sent' && (
          <div className="mb-6 p-4 bg-brand-muted border border-border rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <div className="text-sm text-brand">
              <strong>Funding application status</strong> — this tab shows every collaboration request and funding application you have submitted. Status updates here in real time as the recipient responds.
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-4">
          {activeList.length === 0 ? (
            <Card className="p-12 text-center border border-dashed border-border">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-muted-foreground mb-2">
                {mainTab === 'sent' ? 'No applications submitted yet' : 'No requests found'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {mainTab === 'sent'
                  ? 'Apply for funding opportunities or send collaboration requests to see them tracked here.'
                  : filter !== 'all'
                    ? `No ${filter} requests.`
                    : 'You have no incoming requests at the moment.'}
              </p>
              {mainTab === 'sent' && (
                <Button className="mt-4 " onClick={() => navigate('/funding')}>
                  Browse Funding Opportunities
                </Button>
              )}
            </Card>
          ) : (
            activeList.map(request => {
              const otherUserId = mainTab === 'incoming' ? request.fromUserId : request.toUserId;
              const otherUser = getRequester(otherUserId);
              const displayName = mainTab === 'incoming' ? request.fromUserName : (otherUser?.name || 'Recipient');
              const isFunding = request.type === 'funding';

              return (
                <Card key={request.id} className={`p-6 hover:shadow-lg transition-all border-l-4 ${
                  request.status === 'accepted' ? 'border-l-green-500' :
                  request.status === 'rejected' ? 'border-l-red-400' :
                  'border-l-yellow-400'
                }`}>
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                    <Avatar className="w-14 h-14 bg-brand flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {displayName.charAt(0)}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold">{displayName}</h3>
                            {statusBadge(request.status)}
                            <Badge className={isFunding ? 'bg-success-muted/50 text-success-foreground border border-green-200' : 'bg-brand-muted text-brand border border-border'}>
                              {isFunding ? <DollarSign className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                              {isFunding ? 'Funding Application' : 'Collaboration'}
                            </Badge>
                          </div>
                          {otherUser && (
                            <p className="text-sm text-muted-foreground mt-0.5">{otherUser.department} · {otherUser.institution}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground/70 shrink-0">
                          {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Details card */}
                      <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4 space-y-1.5 text-sm">
                        {request.researchTitle && (
                          <div><span className="font-medium text-foreground">Research:</span> <span className="text-muted-foreground">{request.researchTitle}</span></div>
                        )}
                        {request.fundingTitle && (
                          <div><span className="font-medium text-foreground">Funding call:</span> <span className="text-muted-foreground">{request.fundingTitle}</span></div>
                        )}
                        {request.collaborationType && (
                          <div><span className="font-medium text-foreground">Type:</span> <span className="text-muted-foreground">{request.collaborationType}</span></div>
                        )}
                        {request.proposedAmount && (
                          <div><span className="font-medium text-foreground">Proposed amount:</span> <span className="text-success-foreground font-semibold">{request.proposedAmount}</span></div>
                        )}
                        {request.timeline && (
                          <div><span className="font-medium text-foreground">Timeline:</span> <span className="text-muted-foreground">{request.timeline}</span></div>
                        )}
                        <div className="pt-1 border-t border-border">
                          <span className="font-medium text-foreground">Message:</span>
                          <p className="text-muted-foreground mt-0.5 leading-relaxed">{request.message}</p>
                        </div>
                      </div>

                      {/* Status explanation for sent tab */}
                      {mainTab === 'sent' && (
                        <div className={`mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
                          request.status === 'accepted' ? 'bg-success-muted/50 text-success-foreground border border-green-200' :
                          request.status === 'rejected' ? 'bg-destructive/10 text-destructive border border-red-200' :
                          'bg-yellow-50 text-warning-foreground border border-yellow-200'
                        }`}>
                          {request.status === 'accepted' && <CheckCircle className="w-4 h-4 shrink-0" />}
                          {request.status === 'rejected' && <XCircle className="w-4 h-4 shrink-0" />}
                          {request.status === 'pending' && <Clock className="w-4 h-4 shrink-0" />}
                          <span>
                            {request.status === 'accepted' && 'Your application was approved. You can now proceed with the collaboration or funding arrangement.'}
                            {request.status === 'rejected' && 'Your application was not accepted this time. Consider revising your proposal or exploring other opportunities.'}
                            {request.status === 'pending' && 'Your application is under review. You will be notified once the recipient responds.'}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {/* Incoming pending — accept/reject */}
                        {mainTab === 'incoming' && request.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAccept(request.id, request.fromUserName)}>
                              <CheckCircle className="w-4 h-4 mr-1" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-300 text-destructive hover:bg-destructive/10" onClick={() => handleReject(request.id, request.fromUserName)}>
                              <XCircle className="w-4 h-4 mr-1" /> Decline
                            </Button>
                          </>
                        )}
                        {otherUser && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/researcher/profile/${otherUser.id}`)}>
                            View Profile
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => openChatWith(otherUserId)}>
                          <MessageCircle className="w-4 h-4 mr-1" /> Chat
                        </Button>
                        {/* Sent + rejected → suggest retry */}
                        {mainTab === 'sent' && request.status === 'rejected' && isFunding && (
                          <Button size="sm" variant="outline" className="border-brand/40 text-brand" onClick={() => navigate('/funding')}>
                            Browse Other Opportunities
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
    </>
  );
}
