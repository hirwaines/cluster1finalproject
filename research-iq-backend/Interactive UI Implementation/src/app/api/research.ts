import api from './client';
import type { Research } from '../context/AppContext';

/* ── Backend DTOs ─────────────────────────────────────────────────────────── */
interface ApiResearch {
  id: string;
  title: string;
  abstractText: string;
  authors: string[];
  keywords: string[];
  field: string;
  publicationDate: string;
  citationCount: number;
  doi?: string;
  researcherId: string;
  fundingStatus?: string;         // 'SEEKING' | 'FUNDED' | 'COMPLETED'
  fundingAmountNeeded?: string;
  likeCount?: number;
  shareCount?: number;
}

interface ApiAnalytics {
  citationCount: number;
  publicationCount: number;
  hIndex: number;
  topKeywords: string[];
  citationsByYear?: { year: number; count: number }[];
}

export function mapApiResearch(r: ApiResearch): Research {
  return {
    id: r.id,
    title: r.title,
    abstract: r.abstractText,
    authors: r.authors,
    keywords: r.keywords,
    field: r.field,
    publicationDate: r.publicationDate,
    citations: r.citationCount,
    doi: r.doi,
    researcherId: r.researcherId,
    fundingStatus: r.fundingStatus
      ? (r.fundingStatus.toLowerCase() as Research['fundingStatus'])
      : undefined,
    fundingAmountNeeded: r.fundingAmountNeeded,
    likes: r.likeCount ?? 0,
    shares: r.shareCount ?? 0,
  };
}

/* ── API calls ────────────────────────────────────────────────────────────── */
export async function getResearchFeed(params?: {
  field?: string;
  search?: string;
  page?: number;
}): Promise<Research[]> {
  const { data } = await api.get<ApiResearch[]>('/research', { params });
  return data.map(mapApiResearch);
}

export async function getMyPublications(): Promise<Research[]> {
  const { data } = await api.get<ApiResearch[]>('/research/my');
  return data.map(mapApiResearch);
}

export async function getResearchById(id: string): Promise<Research> {
  const { data } = await api.get<ApiResearch>(`/research/${id}`);
  return mapApiResearch(data);
}

export async function submitResearch(payload: Partial<Research>): Promise<void> {
  await api.post('/research', {
    title: payload.title,
    abstractText: payload.abstract,
    authors: payload.authors ?? [],
    keywords: payload.keywords ?? [],
    field: payload.field,
    doi: payload.doi,
    fundingStatus: (payload.fundingStatus ?? 'seeking').toUpperCase(),
    fundingAmountNeeded: payload.fundingAmountNeeded,
  });
}

export async function getResearchAnalytics(researcherId?: string): Promise<ApiAnalytics | null> {
  const url = researcherId
    ? `/research/analytics/${researcherId}`
    : '/research/analytics';
  const { data } = await api.get<ApiAnalytics>(url);
  return data;
}

export async function getResearchTrends(): Promise<unknown> {
  const { data } = await api.get('/research/trends');
  return data;
}

export async function likeResearchApi(id: string): Promise<void> {
  await api.post(`/research/${id}/like`);
}

export async function shareResearchApi(id: string): Promise<void> {
  await api.post(`/research/${id}/share`);
}

// Publication import
export async function importPublicationsCSV(csvData: string): Promise<{ jobId: string }> {
  const { data } = await api.post<{ jobId: string }>('/publications/import/csv', { csvData });
  return data;
}

export async function getImportJobStatus(jobId: string): Promise<unknown> {
  const { data } = await api.get(`/publications/import/jobs/${jobId}`);
  return data;
}
