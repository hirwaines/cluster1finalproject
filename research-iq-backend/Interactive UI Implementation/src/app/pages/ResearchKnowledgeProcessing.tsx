import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useApp } from '../context/AppContext';
import { Brain, ArrowLeft, Play, Pause, Square, RotateCw, TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Progress } from '../components/ui/progress';

export function ResearchKnowledgeProcessing() {
  const navigate = useNavigate();
  const { user, processingJobs, dataSources, startProcessingJob, pauseProcessingJob, resumeProcessingJob, cancelProcessingJob } = useApp();
  const [activeTab, setActiveTab] = useState<'jobs' | 'quality'>('jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const selectedJob = processingJobs.find(j => j.id === selectedJobId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'running':
        return 'text-blue-800';
      case 'paused':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppShell>
    <div style={{ padding: '2rem' }}>
        <h1 className="text-4xl font-bold mb-2">Research Knowledge Processing</h1>
        <p className="text-gray-600 mb-8">Manage NLP processing jobs and data quality metrics</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'border-b-2 border-blue-800 text-blue-800'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Processing Jobs
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'quality'
                ? 'border-b-2 border-blue-800 text-blue-800'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Data Quality
          </button>
        </div>

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="text-3xl font-bold text-blue-800 mb-1">{processingJobs.length}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {processingJobs.filter(j => j.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-blue-800 mb-1">
                  {processingJobs.filter(j => j.status === 'running').length}
                </div>
                <div className="text-sm text-gray-600">Running</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {processingJobs.reduce((sum, j) => sum + j.documentsProcessed, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Documents Processed</div>
              </Card>
            </div>

            {/* Jobs List & Detail */}
            <div className="grid grid-cols-3 gap-6">
              {/* Jobs List */}
              <div className="col-span-1 space-y-2">
                <h3 className="font-bold text-lg mb-4">Jobs Queue</h3>
                {processingJobs.map(job => (
                  <Card
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedJobId === job.id
                        ? 'border-2 border-blue-800 bg-blue-50'
                        : 'border border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm">{job.sourceName}</div>
                      <Badge className={`text-xs ${getStatusBadgeVariant(job.status)}`}>
                        {job.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Type: {job.jobType}</div>
                    <Progress value={job.progressPercent} className="h-1" />
                    <div className="text-xs text-gray-500 mt-1">{job.progressPercent}% complete</div>
                  </Card>
                ))}
              </div>

              {/* Job Detail */}
              <div className="col-span-2">
                {selectedJob ? (
                  <Card className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{selectedJob.sourceName}</h3>
                        <p className="text-gray-600">{selectedJob.jobType.toUpperCase()} Processing</p>
                      </div>
                      <Badge className={`text-lg px-4 py-2 ${getStatusBadgeVariant(selectedJob.status)}`}>
                        {selectedJob.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="text-gray-600">{selectedJob.progressPercent}%</span>
                      </div>
                      <Progress value={selectedJob.progressPercent} className="h-3" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                      <div>
                        <div className="text-2xl font-bold text-blue-800">
                          {selectedJob.documentsProcessed}/{selectedJob.totalDocuments}
                        </div>
                        <div className="text-sm text-gray-600">Documents Processed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{selectedJob.successRate}%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedJob.keywordsExtracted.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Keywords Extracted</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedJob.entitiesFound.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Entities Found</div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3 mb-6 pb-6 border-b">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Started</div>
                          <div className="text-xs text-gray-500">{selectedJob.startTime}</div>
                        </div>
                      </div>
                      {selectedJob.endTime && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="text-sm font-medium">Completed</div>
                            <div className="text-xs text-gray-500">{selectedJob.endTime}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {selectedJob.status === 'running' && (
                        <>
                          <Button
                            onClick={() => pauseProcessingJob(selectedJob.id)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </Button>
                          <Button
                            onClick={() => cancelProcessingJob(selectedJob.id)}
                            variant="outline"
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            <Square className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {selectedJob.status === 'paused' && (
                        <Button
                          onClick={() => resumeProcessingJob(selectedJob.id)}
                          className="flex-1 bg-blue-800 hover:bg-blue-900"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      {selectedJob.status === 'completed' && (
                        <Button
                          onClick={() => startProcessingJob(selectedJob.sourceId, selectedJob.jobType)}
                          className="flex-1 bg-[#1E40AF]"
                        >
                          <RotateCw className="w-4 h-4 mr-2" />
                          Rerun Job
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : (
                  <Card className="p-8 flex items-center justify-center min-h-96">
                    <div className="text-center text-gray-500">
                      <p>Select a job to view details</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUALITY TAB */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            {selectedJob && (
              <Card className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Data Quality Report</h3>
                  <p className="text-gray-600">From job: {selectedJob.sourceName}</p>
                </div>

                {/* Overall Score */}
                <div className="mb-8 pb-8 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Overall Quality Score</span>
                    <div className="text-4xl font-bold text-blue-800">92/100</div>
                  </div>
                  <Progress value={92} className="h-4" />
                </div>

                {/* Issues */}
                <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-bold">Missing Data Types</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Abstract</span>
                        <span className="text-gray-600">45 items</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Keywords</span>
                        <span className="text-gray-600">120 items</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Citations</span>
                        <span className="text-gray-600">12 items</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold">Validation Errors</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Date Format Issues</span>
                        <span className="text-red-600">8 errors</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DOI Format Issues</span>
                        <span className="text-red-600">3 errors</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duplicates & Enrichment */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-6 bg-blue-50">
                    <div className="text-3xl font-bold text-blue-800 mb-2">23</div>
                    <div className="text-sm text-gray-600">Duplicate Records Found</div>
                    <Button variant="outline" className="mt-4 w-full">
                      View Duplicates
                    </Button>
                  </Card>

                  <Card className="p-6 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-2xl font-bold text-green-600">1,180</div>
                        <div className="text-sm text-gray-600">Enriched Records</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600">68</div>
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">91.6% enrichment rate</div>
                  </Card>
                </div>
              </Card>
            )}
          </div>
        )}
    </div>
    </AppShell>
  );
}

