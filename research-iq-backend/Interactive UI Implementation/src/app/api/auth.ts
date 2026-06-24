import api from './client';
import type { User, UserRole } from '../context/AppContext';

/* ── Backend DTOs ─────────────────────────────────────────────────────────── */
interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;                 // backend uses UPPER_CASE
  department?: string;
  institution?: string;
  position?: string;
  orcid?: string;
  organizationName?: string;
  investmentRange?: string;
  areasOfInterest?: string[];
  publicationCount?: number;
  citationCount?: number;
  hIndex?: number;
  verified?: boolean;
  disabled?: boolean;
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

/* ── Mapper ───────────────────────────────────────────────────────────────── */
export function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role.toLowerCase() as UserRole,
    department: u.department,
    institution: u.institution,
    position: u.position,
    orcid: u.orcid,
    organizationName: u.organizationName,
    investmentRange: u.investmentRange,
    areasOfInterest: u.areasOfInterest,
    publications: u.publicationCount,
    citations: u.citationCount,
    hIndex: u.hIndex,
    verified: u.verified ?? true,
    accredited: true,
    disabled: u.disabled,
  };
}

/* ── API calls ────────────────────────────────────────────────────────────── */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return data;
}

export async function signupResearcherApi(formData: {
  name: string;
  email: string;
  password: string;
  institution: string;
  department: string;
  orcid?: string;
  degree?: string;
  education?: string;
  experience?: number;
  publications?: string[];
}): Promise<void> {
  await api.post('/auth/signup/researcher', formData);
}

export async function signupFunderApi(formData: {
  name: string;
  email: string;
  password: string;
  organizationName: string;
  contactPhone?: string;
  areasOfInterest?: string[];
  investmentRange?: string;
}): Promise<void> {
  await api.post('/auth/signup/funder', formData);
}

export async function requestEmailOtp(email: string): Promise<void> {
  await api.post('/auth/signup/email-verification/request', { email });
}

export async function verifyEmailOtp(email: string, otp: string): Promise<boolean> {
  await api.post('/auth/signup/email-verification/verify', { email, otp });
  return true;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post('/auth/password-reset/request', { email });
}

export async function confirmPasswordReset(
  email: string,
  otp: string,
  newPassword: string
): Promise<void> {
  await api.post('/auth/password-reset/confirm', { email, otp, newPassword });
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<ApiUser>('/users/me');
  return mapApiUser(data);
}

export async function updateCurrentUser(patch: Partial<ApiUser>): Promise<User> {
  const { data } = await api.patch<ApiUser>('/users/me', patch);
  return mapApiUser(data);
}
