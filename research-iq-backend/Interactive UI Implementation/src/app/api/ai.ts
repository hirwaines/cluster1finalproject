/**
 * AI microservice endpoints — all proxied through the Spring Boot backend
 * at /api/v1/<path>. The backend's AiController forwards requests to the
 * appropriate Python FastAPI service (ports 8001-8010).
 */
import api from './client';

// ── Expertise Mapping (AI service 8001) ────────────────────────────────────

export interface ExpertiseProfile {
  researcherId: string;
  keywords: string[];
  topAreas: { area: string; score: number }[];
  publicationCount: number;
  lastUpdated: string;
}

export interface ExpertiseHeatmapEntry {
  department: string;
  expertise: string;
  count: number;
  intensity: number;
}

export async function getExpertiseProfile(researcherId: string): Promise<ExpertiseProfile> {
  const { data } = await api.get<ExpertiseProfile>(`/expertise/profile/${researcherId}`);
  return data;
}

export async function searchByExpertise(keyword: string, limit = 10): Promise<unknown[]> {
  const { data } = await api.get('/expertise/search', { params: { keyword, limit } });
  return data;
}

export async function getExpertiseHeatmap(): Promise<ExpertiseHeatmapEntry[]> {
  const { data } = await api.get<ExpertiseHeatmapEntry[]>('/expertise/heatmap');
  return data;
}

export async function extractKeywords(text: string): Promise<{ keywords: string[]; confidence: number[] }> {
  const { data } = await api.post('/expertise/extract', { text });
  return data;
}

// ── Collaboration Recommendation (AI service 8002) ─────────────────────────

export interface CollabRecommendation {
  researcherId: string;
  name: string;
  department: string;
  institution: string;
  matchScore: number;
  sharedKeywords: string[];
  reason: string;
}

export async function getCollaborationRecommendations(
  researcherId: string,
  limit = 8
): Promise<CollabRecommendation[]> {
  const { data } = await api.get<CollabRecommendation[]>(
    `/collaboration/recommend/${researcherId}`,
    { params: { limit } }
  );
  return data;
}

export async function checkCompatibility(
  researcherId1: string,
  researcherId2: string
): Promise<{ score: number; sharedKeywords: string[]; assessment: string }> {
  const { data } = await api.post('/collaboration/compatibility', { researcherId1, researcherId2 });
  return data;
}

export async function getCrossDisciplinaryMatches(
  researcherId: string,
  limit = 5
): Promise<CollabRecommendation[]> {
  const { data } = await api.get<CollabRecommendation[]>(
    `/collaboration/cross-disciplinary/${researcherId}`,
    { params: { limit } }
  );
  return data;
}

// ── Research Trend Analysis (AI service 8003) ──────────────────────────────

export interface TrendAnalysis {
  trendingTopics: { topic: string; growth: number; publicationCount: number }[];
  volumeByYear: { year: number; count: number }[];
  emergingAreas: { area: string; growthRate: number; confidence: number }[];
  dominantFields: { field: string; share: number }[];
}

export interface TrendForecast {
  topic: string;
  forecast: { year: number; predicted: number; lower: number; upper: number }[];
  confidence: number;
}

export async function getFullTrendAnalysis(): Promise<TrendAnalysis> {
  const { data } = await api.get<TrendAnalysis>('/trends/full');
  return data;
}

export async function getTrendingTopics(
  sinceYear = 2021
): Promise<{ topic: string; count: number; growth: number }[]> {
  const { data } = await api.get('/trends/topics', { params: { sinceYear } });
  return data;
}

export async function getEmergingAreas(
  lookbackYears = 3
): Promise<{ area: string; growthRate: number; confidence: number }[]> {
  const { data } = await api.get('/trends/emerging', { params: { lookbackYears } });
  return data;
}

export async function forecastTopic(topic: string): Promise<TrendForecast> {
  const { data } = await api.get<TrendForecast>('/trends/forecast', { params: { topic } });
  return data;
}

// ── Funding Alignment (AI service 8004) ────────────────────────────────────

export interface FundingMatch {
  opportunityId: string;
  title: string;
  organization: string;
  matchScore: number;
  matchedKeywords: string[];
  amountRange: string;
  deadline: string;
}

export interface FundingLandscape {
  totalOpportunities: number;
  byField: { field: string; count: number; totalAmount: number }[];
  averageGrantSize: number;
  topFunders: { name: string; count: number }[];
}

export async function getFundingMatches(researcherId: string): Promise<FundingMatch[]> {
  const { data } = await api.get<FundingMatch[]>(`/funding/match/${researcherId}`);
  return data;
}

export async function analyzeFundingAlignment(keywords: string[]): Promise<FundingMatch[]> {
  const { data } = await api.post<FundingMatch[]>('/funding/analyze', { keywords });
  return data;
}

export async function getFundingLandscape(): Promise<FundingLandscape> {
  const { data } = await api.get<FundingLandscape>('/funding/landscape');
  return data;
}

// ── Knowledge Processing (AI service 8005) ─────────────────────────────────

export interface ProcessResult {
  publicationId: string;
  keywords: string[];
  entities: { text: string; type: string }[];
  classification: string;
  summary: string;
  processingTime: number;
}

export async function processPublication(publicationId: string): Promise<ProcessResult> {
  const { data } = await api.post<ProcessResult>('/knowledge/process', { publicationId });
  return data;
}

export async function classifyText(text: string): Promise<{ classification: string; confidence: number }> {
  const { data } = await api.post('/knowledge/classify', { text });
  return data;
}

export async function extractEntities(
  text: string
): Promise<{ entities: { text: string; type: string }[] }> {
  const { data } = await api.post('/knowledge/entities', { text });
  return data;
}

export async function getTopicModel(): Promise<{
  topics: { id: number; words: string[]; weight: number }[];
}> {
  const { data } = await api.get('/knowledge/topics');
  return data;
}

// ── Network Analysis (AI service 8006) ─────────────────────────────────────

export interface NetworkSummary {
  totalNodes: number;
  totalEdges: number;
  avgDegree: number;
  density: number;
  communities: { id: number; members: string[]; size: number }[];
  topConnectors: { researcherId: string; name: string; degree: number }[];
}

export interface ResearcherNetworkMetrics {
  researcherId: string;
  degree: number;
  clusteringCoefficient: number;
  betweennessCentrality: number;
  closenessCentrality: number;
  community: number;
}

export async function getNetworkSummary(): Promise<NetworkSummary> {
  const { data } = await api.get<NetworkSummary>('/network/summary');
  return data;
}

export async function getResearcherNetworkMetrics(researcherId: string): Promise<ResearcherNetworkMetrics> {
  const { data } = await api.get<ResearcherNetworkMetrics>(`/network/metrics/${researcherId}`);
  return data;
}

export async function detectCommunities(): Promise<{ communities: { id: number; members: string[] }[] }> {
  const { data } = await api.get('/network/communities');
  return data;
}

// ── Department Analytics (AI service 8007) ─────────────────────────────────

export interface DepartmentStats {
  department: string;
  institution: string;
  researcherCount: number;
  publicationCount: number;
  citationCount: number;
  avgHIndex: number;
  topKeywords: string[];
  fundingSuccessRate: number;
}

export async function getDepartmentAnalytics(): Promise<DepartmentStats[]> {
  const { data } = await api.get<DepartmentStats[]>('/analytics/departments');
  return data;
}

export async function getInstitutionMetrics(): Promise<DepartmentStats[]> {
  const { data } = await api.get<DepartmentStats[]>('/analytics/institutions');
  return data;
}

export async function getPerformanceRankings(
  institution?: string
): Promise<{ rank: number; researcherId: string; name: string; score: number }[]> {
  const { data } = await api.get('/analytics/performance', {
    params: institution ? { institution } : {},
  });
  return data;
}

// ── Research Portfolio (AI service 8008) ───────────────────────────────────

export interface PortfolioAnalysis {
  institution: string;
  strengths: { area: string; score: number }[];
  gaps: string[];
  collaborationIndex: number;
  fundingDiversity: number;
  benchmarkScore: number;
}

export async function analyzePortfolio(institution?: string): Promise<PortfolioAnalysis> {
  const { data } = await api.get<PortfolioAnalysis>('/portfolio/analyze', {
    params: institution ? { institution } : {},
  });
  return data;
}

// ── Faculty Intelligence (AI service 8009) ─────────────────────────────────

export interface FacultyProfile {
  researcherId: string;
  name: string;
  careerStage: 'early' | 'mid' | 'senior';
  researchImpact: number;
  collaborationActivity: number;
  fundingSuccess: number;
  aiSummary: string;
}

export async function getFacultyProfiles(
  department?: string,
  institution?: string
): Promise<FacultyProfile[]> {
  const { data } = await api.get<FacultyProfile[]>('/faculty/profiles', {
    params: { department, institution },
  });
  return data;
}

export async function getFacultyInsight(department?: string): Promise<{
  strategicInsights: string[];
  recommendedActions: string[];
  riskAreas: string[];
}> {
  const { data } = await api.get('/faculty/insight', { params: { department } });
  return data;
}

// ── Knowledge Pipeline (AI service 8010) ───────────────────────────────────

export interface PipelineQuality {
  overallScore: number;
  completeness: number;
  accuracy: number;
  freshness: number;
  issues: { type: string; count: number; severity: 'low' | 'medium' | 'high' }[];
}

export async function runKnowledgePipeline(publicationIds?: string[]): Promise<{ jobId: string; status: string }> {
  const { data } = await api.post('/pipeline/run', { publicationIds });
  return data;
}

export async function getPipelineQuality(): Promise<PipelineQuality> {
  const { data } = await api.get<PipelineQuality>('/pipeline/quality');
  return data;
}
