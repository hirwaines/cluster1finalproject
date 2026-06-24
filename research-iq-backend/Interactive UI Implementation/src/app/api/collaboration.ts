import api from './client';
import type { CollaborationRequest } from '../context/AppContext';

/* ── API calls ────────────────────────────────────────────────────────────── */
export async function discoverCollaborators(params?: {
  name?: string;
  department?: string;
}): Promise<unknown[]> {
  const { data } = await api.get('/collaboration/discover', { params });
  return data;
}

export async function getMyCollaborators(): Promise<unknown[]> {
  const { data } = await api.get('/collaboration/collaborators');
  return data;
}

export async function sendCollaborationRequest(payload: {
  toUserId: string;
  message: string;
  collaborationType?: string;
  timelineMonths?: number;
}): Promise<void> {
  await api.post('/collaboration/request', {
    ...payload,
    requestType: 'COLLABORATION',
  });
}

export async function sendFundingRequest(payload: {
  toUserId: string;
  researchId: string;
  message: string;
  proposedAmount?: string;
}): Promise<void> {
  await api.post('/collaboration/request', {
    ...payload,
    requestType: 'FUNDING',
  });
}

export async function getIncomingRequests(): Promise<CollaborationRequest[]> {
  const { data } = await api.get<CollaborationRequest[]>('/collaboration/requests/incoming');
  return data;
}

export async function getSentRequests(): Promise<CollaborationRequest[]> {
  const { data } = await api.get<CollaborationRequest[]>('/collaboration/requests/sent');
  return data;
}

export async function respondToRequest(
  requestId: string,
  status: 'ACCEPTED' | 'REJECTED'
): Promise<void> {
  await api.patch(`/collaboration/request/${requestId}/status`, { status });
}
