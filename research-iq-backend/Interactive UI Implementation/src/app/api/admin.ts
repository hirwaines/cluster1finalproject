import api from './client';

/* ── User management ─────────────────────────────────────────────────────── */
export async function getPendingUsers(): Promise<unknown[]> {
  const { data } = await api.get('/admin/pending-users');
  return data;
}

export async function getAllUsers(params?: { search?: string; role?: string }): Promise<unknown[]> {
  const { data } = await api.get('/admin/users', { params });
  return data;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

export async function createStaffAccount(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
  institution?: string;
}): Promise<void> {
  await api.post('/admin/staff', payload);
}

/* ── User approvals ──────────────────────────────────────────────────────── */
export async function approveUser(userId: string): Promise<void> {
  await api.patch(`/admin/users/${userId}/approve`);
}

export async function rejectUser(userId: string, reason?: string): Promise<void> {
  await api.patch(`/admin/users/${userId}/reject`, { reason: reason ?? '' });
}

/* ── Publication approvals ───────────────────────────────────────────────── */
export async function getPendingPublications(): Promise<unknown[]> {
  const { data } = await api.get('/admin/pending-publications');
  return data;
}

export async function approvePublication(publicationId: string): Promise<void> {
  await api.patch(`/admin/publications/${publicationId}/approve`);
}

export async function rejectPublication(publicationId: string, reason?: string): Promise<void> {
  await api.patch(`/admin/publications/${publicationId}/reject`, { reason: reason ?? '' });
}

/* ── Security management ─────────────────────────────────────────────────── */
export async function getAuditLogs(params?: { userId?: string; action?: string }): Promise<unknown[]> {
  const { data } = await api.get('/admin/security/audit-logs', { params });
  return data;
}

export async function getUserSessions(): Promise<unknown[]> {
  const { data } = await api.get('/admin/security/sessions');
  return data;
}

export async function terminateSession(sessionId: string): Promise<void> {
  await api.delete(`/admin/security/sessions/${sessionId}`);
}

export async function getPermissions(): Promise<unknown[]> {
  const { data } = await api.get('/admin/security/permissions');
  return data;
}

export async function updatePermissions(payload: unknown): Promise<void> {
  await api.patch('/admin/security/permissions', payload);
}

export async function getSecuritySettings(): Promise<unknown> {
  const { data } = await api.get('/admin/security/settings');
  return data;
}

export async function updateSecuritySettings(settings: unknown): Promise<void> {
  await api.patch('/admin/security/settings', settings);
}
