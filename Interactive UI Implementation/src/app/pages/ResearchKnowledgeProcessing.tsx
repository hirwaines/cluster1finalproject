import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { DashboardPageHeader, tabClass } from '../components/layout';
import { useApp } from '../context/AppContext';
import { Play, Pause, Square, RotateCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Progress } from '../components/ui/progress';

export function ResearchKnowledgeProcessing() {
  const navigate = useNavigate();
  const { user, processingJobs, dataSources, startProcessingJob, pauseProcessingJob, resumeProcessingJob, cancelProcessingJob } = useApp();
  const [activeTab, setActiveTab] = useState<'jobs' | 'quality'>('jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const selectedJob = processingJobs.find(j => j.id === selectedJobId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'running':
        return 'text-brand';
      case 'paused':
        return 'text-warning';
      case 'failed':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-muted text-success-foreground';
      case 'running':
        return 'bg-brand-muted text-brand';
      case 'paused':
        return 'bg-warning-muted text-warning-foreground';
      case 'failed':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-foreground';
    }
  };

  return (
    <>
      <DashboardPageHeader
        title="Research Knowledge Processing"
        description="Manage NLP processing jobs and data quality metrics"
      />

      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className={tabClass(activeTab === 'jobs')}
        >
          Processing Jobs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('quality')}
          className={tabClass(activeTab === 'quality')}
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
                <div className="text-3xl font-bold text-brand mb-1">{processingJobs.length}</div>
                <div className="text-sm text-muted-foreground">Total Jobs</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-success mb-1">
                  {processingJobs.filter(j => j.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-brand mb-1">
                  {processingJobs.filter(j => j.status === 'running').length}
                </div>
                <div className="text-sm text-muted-foreground">Running</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-brand-dark mb-1">
                  {processingJobs.reduce((sum, j) => sum + j.documentsProcessed, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Documents Processed</div>
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
                        ? 'border-2 border-brand bg-brand-muted'
                        : 'border border-border hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm">{job.sourceName}</div>
                      <Badge className={`text-xs ${getStatusBadgeVariant(job.status)}`}>
                        {job.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">Type: {job.jobType}</div>
                    <Progress value={job.progressPercent} className="h-1" />
                    <div className="text-xs text-muted-foreground mt-1">{job.progressPercent}% complete</div>
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
                        <p className="text-muted-foreground">{selectedJob.jobType.toUpperCase()} Processing</p>
                      </div>
                      <Badge className={`text-lg px-4 py-2 ${getStatusBadgeVariant(selectedJob.status)}`}>
                        {selectedJob.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="text-muted-foreground">{selectedJob.progressPercent}%</span>
                      </div>
                      <Progress value={selectedJob.progressPercent} className="h-3" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                      <div>
                        <div className="text-2xl font-bold text-brand">
                          {selectedJob.documentsProcessed}/{selectedJob.totalDocuments}
                        </div>
                        <div className="text-sm text-muted-foreground">Documents Processed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-success">{selectedJob.successRate}%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-brand-dark">
                          {selectedJob.keywordsExtracted.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Keywords Extracted</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-warning">
                          {selectedJob.entitiesFound.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Entities Found</div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3 mb-6 pb-6 border-b">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground/70" />
                        <div>
                          <div className="text-sm font-medium">Started</div>
                          <div className="text-xs text-muted-foreground">{selectedJob.startTime}</div>
                        </div>
                      </div>
                      {selectedJob.endTime && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <div>
                            <div className="text-sm font-medium">Completed</div>
                            <div className="text-xs text-muted-foreground">{selectedJob.endTime}</div>
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
                            className="flex-1 text-destructive hover:text-destructive"
                          >
                            <Square className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {selectedJob.status === 'paused' && (
                        <Button
                          onClick={() => resumeProcessingJob(selectedJob.id)}
                          className="flex-1 bg-brand hover:bg-brand/90"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      {selectedJob.status === 'completed' && (
                        <Button
                          onClick={() => startProcessingJob(selectedJob.sourceId, selectedJob.jobType)}
                          className="flex-1 bg-brand"
                        >
                          <RotateCw className="w-4 h-4 mr-2" />
                          Rerun Job
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : (
                  <Card className="p-8 flex items-center justify-center min-h-96">
                    <div className="text-center text-muted-foreground">
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
                  <p className="text-muted-foreground">From job: {selectedJob.sourceName}</p>
                </div>

                {/* Overall Score */}
                <div className="mb-8 pb-8 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Overall Quality Score</span>
                    <div className="text-4xl font-bold text-brand">92/100</div>
                  </div>
                  <Progress value={92} className="h-4" />
                </div>

                {/* Issues */}
                <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <h4 className="font-bold">Missing Data Types</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Abstract</span>
                        <span className="text-muted-foreground">45 items</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Keywords</span>
                        <span className="text-muted-foreground">120 items</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Citations</span>
                        <span className="text-muted-foreground">12 items</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <h4 className="font-bold">Validation Errors</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Date Format Issues</span>
                        <span className="text-destructive">8 errors</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DOI Format Issues</span>
                        <span className="text-destructive">3 errors</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duplicates & Enrichment */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-6 bg-brand-muted">
                    <div className="text-3xl font-bold text-brand mb-2">23</div>
                    <div className="text-sm text-muted-foreground">Duplicate Records Found</div>
                    <Button variant="outline" className="mt-4 w-full">
                      View Duplicates
                    </Button>
                  </Card>

                  <Card className="p-6 bg-success-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-2xl font-bold text-success">1,180</div>
                        <div className="text-sm text-muted-foreground">Enriched Records</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-warning">68</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">91.6% enrichment rate</div>
                  </Card>
                </div>
              </Card>
            )}
          </div>
        )}
    </>
  );
}
