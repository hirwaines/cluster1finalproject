import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ResearcherLayout } from '../components/ResearcherLayout';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { ImagePlus, Plus, X, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';

export function UploadResearch() {
  const navigate = useNavigate();
  const { user, submitPublicationForReview, pendingPublications } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: [user?.name || ''],
    keywords: [] as string[],
    field: '',
    doi: '',
    fundingStatus: 'seeking' as 'seeking' | 'funded' | 'completed',
    coverImage: ''
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'researcher') {
      toast.error('Only verified researchers can submit publications.');
      return;
    }
    submitPublicationForReview({
      ...formData,
      attachmentLabel: imageFile?.name || (formData.coverImage ? 'cover-upload' : undefined),
    });
    toast.success('Submitted for administrator review. It will appear in the feed and recommendations after approval.');
    navigate('/feed');
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  return (
    <ResearcherLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit publication</h1>
          <p className="text-gray-600">
            Your submission enters an administrator queue. After approval it is indexed for collaborator matching, expertise summaries, and discovery feeds.
          </p>
        </div>

        {pendingPublications.filter(p => p.researcherId === user.id).length > 0 && (
          <Card className="p-4 mb-6 border-amber-200 bg-amber-50/80">
            <div className="text-sm font-semibold text-amber-900 mb-2">Your submissions in review</div>
            <ul className="text-sm text-amber-900 space-y-1">
              {pendingPublications
                .filter(p => p.researcherId === user.id)
                .map(p => (
                  <li key={p.id}>
                    <span className="font-medium">{p.title || 'Untitled'}</span>
                    <span className="text-amber-800/80"> — submitted {p.submittedDate} (pending)</span>
                  </li>
                ))}
            </ul>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <Card className="p-8">
            <Label className="mb-4 block">Cover image or PDF</Label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, coverImage: '' }));
                    }}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="mb-2 text-lg font-medium text-gray-700">Drop cover image or PDF</p>
                    <p className="text-sm text-gray-500">PNG, JPG, PDF up to 50MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </Card>

          {/* Research Details */}
          <Card className="p-8 space-y-6">
            <div>
              <Label htmlFor="title">Research Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Deep Learning Detects Rare Genetic Variants 40% Faster"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="abstract">Abstract / Summary *</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                placeholder="Describe your research, methodology, and key findings..."
                rows={6}
                className="mt-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="field">Research Field *</Label>
                <Select
                  value={formData.field}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, field: value }))}
                  required
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Environmental Science">Environmental Science</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fundingStatus">Funding Status *</Label>
                <Select
                  value={formData.fundingStatus}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, fundingStatus: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seeking">Seeking Funding</SelectItem>
                    <SelectItem value="funded">Funded</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="doi">DOI (Optional)</Label>
              <Input
                id="doi"
                value={formData.doi}
                onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                placeholder="10.1000/xyz123"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="keywords">Indexing hints (optional)</Label>
              <p className="text-xs text-gray-500 mt-1 mb-2">
                Primary keywords are generated from the approved title and abstract (and merged with any hints). Leave blank if unsure.
              </p>
              <div className="flex gap-2 mt-2 mb-3">
                <Input
                  id="keywords"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Optional terms (e.g., federated learning)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map(keyword => (
                    <Badge key={keyword} style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }} className="gap-2">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5 border border-blue-100 bg-blue-50/60 flex gap-3">
            <Info className="w-5 h-5 text-[#1E40AF] shrink-0 mt-0.5" />
            <div className="text-sm text-gray-800">
              <p className="font-semibold text-gray-900 mb-1">How recommendations use your work</p>
              <p>
                Collaborator suggestions and profile keyword frequencies read only from <strong>approved</strong> publications in the catalogue.
                Administrators may also bulk-import verified metadata via CSV (those records skip this queue).
              </p>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/feed')}
            >
              Cancel
            </Button>
            <Button type="submit" style={{ backgroundColor: '#1E40AF' }} className="flex-1 hover:opacity-90">
              Submit for approval
            </Button>
          </div>
        </form>
      </div>
    </ResearcherLayout>
  );
}
