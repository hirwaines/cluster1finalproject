import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';
import { useApp } from '../context/AppContext';
import { ResearcherLayout } from '../components/ResearcherLayout';
import {
  CheckCircle, XCircle, Clock, DollarSign, Users, FileText,
  MessageCircle, Send,
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
      <Badge className="bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>
    );
    if (status === 'accepted') return (
      <Badge className="bg-green-100 text-green-700">
        <CheckCircle className="w-3 h-3 mr-1" /> Approved
      </Badge>
    );
    return (
      <Badge className="bg-red-100 text-red-700">
        <XCircle className="w-3 h-3 mr-1" /> Rejected
      </Badge>
    );
  };

  const activeList = mainTab === 'incoming' ? filteredIncoming : filteredSent;

  return (
    <ResearcherLayout>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Requests & Applications</h1>
          <p className="text-gray-600">Track incoming collaboration requests and your submitted funding applications</p>
        </div>

        {/* Main tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => { setMainTab('incoming'); setFilter('all'); }}
            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-colors ${mainTab === 'incoming' ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Users className="w-4 h-4" />
            Incoming Requests
            {countByStatus(incoming, 'pending') > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {countByStatus(incoming, 'pending')}
              </span>
            )}
          </button>
          <button
            onClick={() => { setMainTab('sent'); setFilter('all'); }}
            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-colors ${mainTab === 'sent' ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Send className="w-4 h-4" />
            My Applications & Sent Requests
            {sent.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
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
                  ? 'bg-blue-900 text-white border-blue-800'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {' '}({applyFilter(mainTab === 'incoming' ? incoming : sent).filter(r => s === 'all' || r.status === s).length})
            </button>
          ))}
        </div>

        {/* ── SENT / MY APPLICATIONS banner ── */}
        {mainTab === 'sent' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Funding application status</strong> — this tab shows every collaboration request and funding application you have submitted. Status updates here in real time as the recipient responds.
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-4">
          {activeList.length === 0 ? (
            <Card className="p-12 text-center border border-dashed border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {mainTab === 'sent' ? 'No applications submitted yet' : 'No requests found'}
              </h3>
              <p className="text-gray-500 text-sm">
                {mainTab === 'sent'
                  ? 'Apply for funding opportunities or send collaboration requests to see them tracked here.'
                  : filter !== 'all'
                    ? `No ${filter} requests.`
                    : 'You have no incoming requests at the moment.'}
              </p>
              {mainTab === 'sent' && (
                <Button className="mt-4 bg-blue-900 hover:bg-blue-950" onClick={() => navigate('/funding')}>
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
                  <div className="flex gap-5">
                    <Avatar className="w-14 h-14 bg-blue-800 flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {displayName.charAt(0)}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold">{displayName}</h3>
                            {statusBadge(request.status)}
                            <Badge className={isFunding ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-900 border border-blue-200'}>
                              {isFunding ? <DollarSign className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                              {isFunding ? 'Funding Application' : 'Collaboration'}
                            </Badge>
                          </div>
                          {otherUser && (
                            <p className="text-sm text-gray-500 mt-0.5">{otherUser.department} · {otherUser.institution}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Details card */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-1.5 text-sm">
                        {request.researchTitle && (
                          <div><span className="font-medium text-gray-700">Research:</span> <span className="text-gray-600">{request.researchTitle}</span></div>
                        )}
                        {request.fundingTitle && (
                          <div><span className="font-medium text-gray-700">Funding call:</span> <span className="text-gray-600">{request.fundingTitle}</span></div>
                        )}
                        {request.collaborationType && (
                          <div><span className="font-medium text-gray-700">Type:</span> <span className="text-gray-600">{request.collaborationType}</span></div>
                        )}
                        {request.proposedAmount && (
                          <div><span className="font-medium text-gray-700">Proposed amount:</span> <span className="text-green-700 font-semibold">{request.proposedAmount}</span></div>
                        )}
                        {request.timeline && (
                          <div><span className="font-medium text-gray-700">Timeline:</span> <span className="text-gray-600">{request.timeline}</span></div>
                        )}
                        <div className="pt-1 border-t border-gray-200">
                          <span className="font-medium text-gray-700">Message:</span>
                          <p className="text-gray-600 mt-0.5 leading-relaxed">{request.message}</p>
                        </div>
                      </div>

                      {/* Status explanation for sent tab */}
                      {mainTab === 'sent' && (
                        <div className={`mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
                          request.status === 'accepted' ? 'bg-green-50 text-green-800 border border-green-200' :
                          request.status === 'rejected' ? 'bg-red-50 text-red-800 border border-red-200' :
                          'bg-yellow-50 text-yellow-800 border border-yellow-200'
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
                            <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleReject(request.id, request.fromUserName)}>
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
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-800" onClick={() => navigate('/funding')}>
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
      </div>
    </ResearcherLayout>
  );
}
