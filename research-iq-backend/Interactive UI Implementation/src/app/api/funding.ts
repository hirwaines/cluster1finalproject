import api from './client';

/* ── Funder interest in projects ─────────────────────────────────────────── */
export async function getFundingProjects(params?: {
  field?: string;
  status?: string;
}): Promise<unknown[]> {
  const { data } = await api.get('/funding/projects', { params });
  return data;
}

export async function expressFundingInterest(researchId: string, message?: string): Promise<void> {
  await api.post('/funding/interests', { researchId, message: message ?? '' });
}

export async function getMyInterests(): Promise<unknown[]> {
  const { data } = await api.get('/funding/interests');
  return data;
}

export async function updateInterestStatus(interestId: string, status: string): Promise<void> {
  await api.patch(`/funding/interests/${interestId}/status`, { status });
}

/* ── RFPs ─────────────────────────────────────────────────────────────────── */
export async function postRfp(payload: {
  title: string;
  summary: string;
  amountRange: string;
  deadline: string;
  areas: string[];
}): Promise<void> {
  await api.post('/funding/rfp', payload);
}

export async function getMyRfps(): Promise<unknown[]> {
  const { data } = await api.get('/funding/my-rfps');
  return data;
}

export async function getFundingOpportunities(): Promise<unknown[]> {
  const { data } = await api.get('/funding/opportunities');
  return data;
}

/* ── Applications ─────────────────────────────────────────────────────────── */
export async function applyForFunding(payload: {
  rfpId: string;
  researchId: string;
  message: string;
}): Promise<void> {
  await api.post('/funding/applications', payload);
}
