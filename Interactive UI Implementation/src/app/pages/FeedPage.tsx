import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { SystemAnnouncements } from '../components/SystemAnnouncements';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, Users as UsersIcon, BookOpen, FileText, Calendar, Link2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function FeedPage() {
  const navigate = useNavigate();
  const { research, researchers, user, likeResearch, sendCollaborationRequest } = useApp();
  const [collaborationRequest, setCollaborationRequest] = useState<string | null>(null);
  const [viewDetails, setViewDetails] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [collaborationType, setCollaborationType] = useState('joint-paper');
  const [timeline, setTimeline] = useState('3');
  const [message, setMessage] = useState('');

  const handleLike = (id: string) => {
    if (likedPosts.has(id)) {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setLikedPosts(prev => new Set(prev).add(id));
      likeResearch(id);
    }
  };

  const handleCollaborationRequest = () => {
    if (!selectedResearch || !selectedAuthor) return;
    sendCollaborationRequest({
      type: 'collaboration',
      toUserId: selectedAuthor.id,
      researchId: selectedResearch.id,
      researchTitle: selectedResearch.title,
      message,
      collaborationType,
      timeline: `${timeline} months`,
    });
    toast.success('Collaboration request sent!');
    setCollaborationRequest(null);
    setMessage('');
    setTimeout(() => navigate('/requests', { state: { tab: 'sent' } }), 1200);
  };

  const selectedResearch = research.find(r => r.id === collaborationRequest);
  const selectedAuthor = selectedResearch ? researchers.find(r => r.id === selectedResearch.researcherId) : null;

  const detailsResearch = research.find(r => r.id === viewDetails);
  const detailsAuthor = detailsResearch ? researchers.find(r => r.id === detailsResearch.researcherId) : null;

  // Trending topics
  const trendingTopics = [
    { topic: 'Generative AI', growth: '+162%' },
    { topic: 'Renewable Energy Cells', growth: '+89%' },
    { topic: 'Synthetic Biology', growth: '+76%' },
    { topic: 'Quantum Machine Learning', growth: '+64%' },
  ];

  // Active collaborations
  const activeCollaborations = [
    { name: 'Dr. Claver Ndahayo', topic: 'Climate & ML', efficiency: '87%' },
    { name: 'Assoc. Prof. Kayigema Jacques', topic: 'Research data systems', efficiency: '91%' },
  ];

  return (
    <ResearcherLayout>
      <div className="flex">
        {/* Main Feed */}
        <div className="flex-1 max-w-3xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Feed</h1>
            <p className="text-gray-600">Discover latest research from your network</p>
          </div>

          {/* System Announcements */}
          <div className="mb-6">
            <SystemAnnouncements limit={2} />
          </div>

          <div className="space-y-6">
            {research.map(post => {
              const author = researchers.find(r => r.id === post.researcherId);
              const isLiked = likedPosts.has(post.id);

              return (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all">
                  {/* Author Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {author?.photo ? (
                        <img
                          src={author.photo}
                          alt={author.name}
                          className="w-12 h-12 rounded-full object-cover cursor-pointer"
                          onClick={() => navigate(`/researcher/profile/${author.id}`)}
                        />
                      ) : (
                        <Avatar
                          className="w-12 h-12 bg-blue-800 flex items-center justify-center text-white font-bold cursor-pointer"
                          onClick={() => navigate(`/researcher/profile/${author?.id}`)}
                        >
                          {author?.name.charAt(0)}
                        </Avatar>
                      )}
                      <div>
                        <div className="font-bold cursor-pointer hover:underline" onClick={() => navigate(`/researcher/profile/${author?.id}`)}>
                          {author?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {author?.department} • {author?.institution}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {post.fundingStatus === 'seeking' ? 'Seeking Funding' : post.fundingStatus}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                        <span className="font-medium">{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-800 transition-colors">
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-medium">{post.comments || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                        <Share2 className="w-6 h-6" />
                        <span className="font-medium">{post.shares || 0}</span>
                      </button>
                    </div>
                    <button className="text-gray-600 hover:text-blue-800 transition-colors">
                      <Bookmark className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-blue-800">{post.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.abstract}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.keywords.map(keyword => (
                        <Badge key={keyword} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setViewDetails(post.id)}
                      >
                        View more
                      </Button>
                      <Button
                        className="flex-1 bg-blue-900 hover:bg-blue-950"
                        onClick={() => setCollaborationRequest(post.id)}
                      >
                        Request collaboration
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 p-6 space-y-6 sticky top-[65px] self-start">
          {/* Trending Topics */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-bold">Trending topics</h3>
            </div>
            <div className="space-y-3">
              {trendingTopics.map(topic => (
                <div key={topic.topic} className="flex items-center justify-between">
                  <div className="font-medium text-sm">{topic.topic}</div>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {topic.growth}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Collaborations */}
          <Card className="p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-4">
              <UsersIcon className="w-5 h-5 text-blue-800" />
              <h3 className="font-bold">Active collaborations</h3>
            </div>
            <div className="space-y-3">
              {activeCollaborations.map(collab => (
                <div key={collab.name} className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{collab.name}</div>
                    <Badge className="bg-blue-100 text-blue-900 text-xs">
                      {collab.efficiency}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">{collab.topic}</div>
                  <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-900"
                      style={{ width: collab.efficiency }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              View all
            </Button>
          </Card>

          <Card className="p-4 bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-800" />
              <h3 className="font-bold text-gray-800">Explore research</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Browse publications by field, keyword, or researcher to find work relevant to your interests.
            </p>
            <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/discover')}>
              Go to Discover
            </Button>
          </Card>
        </aside>
      </div>

      {/* Collaboration Request Dialog */}
      <Dialog open={!!collaborationRequest} onOpenChange={() => setCollaborationRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request collaboration</DialogTitle>
          </DialogHeader>

          {selectedAuthor && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                To: <strong>{selectedAuthor.name}</strong> • {selectedAuthor.department}
              </div>

              <div>
                <Label>COLLABORATION TYPE</Label>
                <Select value={collaborationType} onValueChange={setCollaborationType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joint-paper">Joint Paper</SelectItem>
                    <SelectItem value="research-project">Research Project</SelectItem>
                    <SelectItem value="grant-proposal">Grant Proposal</SelectItem>
                    <SelectItem value="data-sharing">Data Sharing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>TIMELINE (MONTHS)</Label>
                <Input
                  type="number"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="mt-2"
                  min="1"
                  max="36"
                />
              </div>

              <div>
                <Label>MESSAGE</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'd love to collaborate because..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCollaborationRequest(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-900 hover:bg-blue-950"
                  onClick={handleCollaborationRequest}
                >
                  Send request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Research Details Dialog */}
      <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Research Details</DialogTitle>
          </DialogHeader>

          {detailsResearch && detailsAuthor && (
            <div className="space-y-6">
              {/* Field banner */}
              <div className="h-20 rounded-lg bg-blue-900 flex items-center px-6 -mt-2">
                <div>
                  <div className="text-white/70 text-xs uppercase tracking-widest mb-1">Research field</div>
                  <div className="text-white font-bold text-lg">{detailsResearch.field}</div>
                </div>
              </div>

              {/* Title and Status */}
              <div>
                <h2 className="text-3xl font-bold text-blue-800 mb-3">{detailsResearch.title}</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={
                    detailsResearch.fundingStatus === 'funded' ? 'bg-green-100 text-green-700' :
                    detailsResearch.fundingStatus === 'seeking' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {detailsResearch.fundingStatus === 'seeking' ? 'Seeking Funding' : detailsResearch.fundingStatus}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-900">{detailsResearch.field}</Badge>
                </div>
              </div>

              {/* Author Info */}
              <Card className="p-4 bg-blue-50">
                <div className="flex items-center gap-4">
                  {detailsAuthor.photo ? (
                    <img
                      src={detailsAuthor.photo}
                      alt={detailsAuthor.name}
                      className="w-16 h-16 rounded-full object-cover cursor-pointer"
                      onClick={() => {
                        setViewDetails(null);
                        navigate(`/researcher/profile/${detailsAuthor.id}`);
                      }}
                    />
                  ) : (
                    <Avatar
                      className="w-16 h-16 bg-blue-800 flex items-center justify-center text-white font-bold text-2xl cursor-pointer"
                      onClick={() => {
                        setViewDetails(null);
                        navigate(`/researcher/profile/${detailsAuthor.id}`);
                      }}
                    >
                      {detailsAuthor.name.charAt(0)}
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-lg cursor-pointer hover:underline" onClick={() => {
                      setViewDetails(null);
                      navigate(`/researcher/profile/${detailsAuthor.id}`);
                    }}>
                      {detailsAuthor.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {detailsAuthor.department} • {detailsAuthor.institution}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="text-gray-600">{detailsAuthor.publications} publications</span>
                      <span className="text-gray-600">{detailsAuthor.citations} citations</span>
                      <span className="text-gray-600">h-index: {detailsAuthor.hIndex}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Abstract */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-800" />
                  Abstract
                </h3>
                <p className="text-gray-700 leading-relaxed">{detailsResearch.abstract}</p>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-lg font-bold mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {detailsResearch.keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-sm">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-1">{detailsResearch.citations}</div>
                  <div className="text-sm text-gray-600">Citations</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {detailsResearch.likes || 0}
                  </div>
                  <div className="text-sm text-gray-600">Likes</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {detailsResearch.shares || 0}
                  </div>
                  <div className="text-sm text-gray-600">Shares</div>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Published</div>
                    <div className="font-medium">{new Date(detailsResearch.publicationDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</div>
                  </div>
                </div>
                {detailsResearch.doi && (
                  <div className="flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">DOI</div>
                      <div className="font-medium text-blue-800 hover:underline cursor-pointer">
                        {detailsResearch.doi}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Authors List */}
              {detailsResearch.authors && detailsResearch.authors.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3">Authors</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailsResearch.authors.map(author => (
                      <Badge key={author} variant="outline" className="text-sm">
                        {author}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setViewDetails(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-blue-900 hover:bg-blue-950"
                  onClick={() => {
                    setViewDetails(null);
                    setCollaborationRequest(detailsResearch.id);
                  }}
                >
                  Request collaboration
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ResearcherLayout>
  );
}
