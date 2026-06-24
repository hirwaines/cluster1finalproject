import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useApp } from '../context/AppContext';
import { Heart, MessageCircle, Share2, Bookmark, FileText, Calendar, Link2 } from 'lucide-react';

const categories = [
  'All',
  'Genomics',
  'Climate Science',
  'Neuroscience',
  'Renewable Energy',
  'Public Health',
  'Quantum Computing',
];

export function DiscoverPage() {
  const navigate = useNavigate();
  const { research, researchers } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [viewDetails, setViewDetails] = useState<string | null>(null);

  const handleLike = (id: string) => {
    if (likedPosts.has(id)) {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setLikedPosts(prev => new Set(prev).add(id));
    }
  };

  const filteredResearch = selectedCategory === 'All'
    ? research
    : research.filter(r =>
        r.keywords.some(k => k.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        r.field.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  const detailsResearch = research.find(r => r.id === viewDetails);
  const detailsAuthor = detailsResearch ? researchers.find(r => r.id === detailsResearch.researcherId) : null;

  return (
    <ResearcherLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Discover research</h1>
          <p className="text-gray-600">Explore by topic, your interests, and trending fields</p>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredResearch.map(post => {
            const author = researchers.find(r => r.id === post.researcherId);
            const isLiked = likedPosts.has(post.id);

            return (
              <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all">
                {/* Actions */}
                <div className="px-4 pt-3 flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                      <span className="text-sm font-medium">{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-800 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.shares || 0}</span>
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-blue-800 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-blue-800 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.abstract}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.keywords.slice(0, 3).map(keyword => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      {author?.photo ? (
                        <img
                          src={author.photo}
                          alt={author.name}
                          className="w-8 h-8 rounded-full object-cover cursor-pointer"
                          onClick={() => navigate(`/researcher/profile/${author.id}`)}
                        />
                      ) : (
                        <Avatar
                          className="w-8 h-8 bg-[#1E40AF] flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                          onClick={() => navigate(`/researcher/profile/${author?.id}`)}
                        >
                          {author?.name.charAt(0)}
                        </Avatar>
                      )}
                      <div>
                        <div className="font-medium text-sm cursor-pointer hover:underline" onClick={() => navigate(`/researcher/profile/${author?.id}`)}>
                          {author?.name}
                        </div>
                        <div className="text-xs text-gray-500">{author?.department}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#1E40AF] hover:from-blue-700 hover:to-green-700"
                      onClick={() => setViewDetails(post.id)}
                    >
                      View more
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredResearch.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-2">No research found</div>
            <p className="text-gray-600">Try selecting a different category</p>
          </Card>
        )}
      </div>

      {/* Research Details Dialog */}
      <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Research Details</DialogTitle>
          </DialogHeader>

          {detailsResearch && detailsAuthor && (
            <div className="space-y-6">
              {/* Field banner */}
              <div className="h-20 rounded-lg bg-[#1E40AF] flex items-center px-6 -mt-2">
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
                  <Badge className="bg-blue-100 text-blue-700">{detailsResearch.field}</Badge>
                </div>
              </div>

              {/* Author Info */}
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
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
                      className="w-16 h-16 bg-[#1E40AF] flex items-center justify-center text-white font-bold text-2xl cursor-pointer"
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
                  className="flex-1 bg-[#1E40AF] hover:from-blue-700 hover:to-green-700"
                  onClick={() => {
                    setViewDetails(null);
                    navigate('/feed');
                  }}
                >
                  View in Feed
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ResearcherLayout>
  );
}

