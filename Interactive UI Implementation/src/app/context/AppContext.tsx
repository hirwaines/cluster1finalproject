import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, saveToken, clearToken, saveUser, loadUser } from '../services/api';

export type UserRole = 'researcher' | 'admin' | 'funder' | 'manager' | 'department_head';

export interface OpenAlexPublication {
  title?: string;
  doi?: string;
  year?: number;
  citedByCount?: number;
  journal?: string;
  citation?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  institution?: string;
  position?: string;
  orcid?: string;
  /** Legacy aggregate; profiles derive keywords from publications where possible */
  expertise?: string[];
  publications?: number;
  citations?: number;
  hIndex?: number;
  researchScore?: number;
  verified?: boolean;
  accredited?: boolean;
  photo?: string;
  joinedDate?: string;
  disabled?: boolean;
  organizationName?: string;
  investmentRange?: string;
  areasOfInterest?: string[];
  openalexPublications?: OpenAlexPublication[];
}

export interface Research {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  keywords: string[];
  field: string;
  publicationDate: string;
  citations: number;
  doi?: string;
  researcherId: string;
  researcherName?: string;
  researcherDepartment?: string;
  researcherInstitution?: string;
  fundingStatus?: 'seeking' | 'funded' | 'completed';
  fundingAmountNeeded?: string;
  collaborators?: string[];
  likes?: number;
  comments?: number;
  shares?: number;
  coverImage?: string;
}

export interface PendingResearcher {
  id: string;
  name: string;
  email: string;
  education: string;
  degree: string;
  experience: number;
  institution: string;
  department: string;
  orcid: string;
  publications: string[];
  cv: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

export interface PendingFunder {
  id: string;
  organizationName: string;
  email: string;
  contactName: string;
  contactPhone: string;
  areasOfInterest: string[];
  investmentRange: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

/** Researcher-submitted publication awaiting admin approval before indexing & recommendations */
export interface PendingPublication {
  id: string;
  researcherId: string;
  researcherName: string;
  submittedDate: string;
  title: string;
  abstract: string;
  authors: string[];
  field: string;
  fundingStatus?: Research['fundingStatus'];
  fundingAmountNeeded?: string;
  doi?: string;
  coverImage?: string;
  attachmentLabel?: string;
  /** Optional hints only; merged with derived terms when approved */
  suggestedKeywords?: string[];
}

function deriveKeywordsFromText(title: string, abstract: string, hints: string[]): string[] {
  const blob = `${title} ${abstract}`.toLowerCase();
  const pool = [
    'machine learning',
    'climate',
    'education',
    'data management',
    'research',
    'ai ethics',
    'analytics',
    'neural',
    'vision',
    'big data',
    'prediction',
    'higher education',
    'digital',
    'platform',
  ];
  const fromDoc = pool.filter(p => blob.includes(p));
  const merged = [...new Set([...hints.map(h => h.trim()).filter(Boolean), ...fromDoc.map(w => capitalizeWords(w))])];
  const out = merged.slice(0, 10);
  return out.length ? out : ['Research'];
}

function capitalizeWords(s: string): string {
  return s
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

export interface CollaborationRequest {
  id: string;
  type: 'collaboration' | 'funding';
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  researchId?: string;
  researchTitle?: string;
  fundingId?: string;
  fundingTitle?: string;
  message: string;
  proposedAmount?: string;
  timeline?: string;
  collaborationType?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface FundingRequest {
  id: string;
  funderName: string;
  funderEmail: string;
  funderContact: string;
  funderOrg: string;
  researchId: string;
  researchTitle: string;
  toResearcherId: string;
  proposedAmount: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface FunderInterest {
  id: string;
  funderId: string;
  projectId: string;
  status: 'pending' | 'discussion' | 'funded' | 'declined';
  createdAt: string;
}

export interface FunderRfp {
  id: string;
  funderId: string;
  title: string;
  summary: string;
  amountRange: string;
  deadline: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachmentName?: string;
}

export interface Notification {
  id: string;
  type: 'collaboration' | 'funding' | 'publication' | 'citation' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  createdAt: string;
  expiresAt?: string;
}

/** RESEARCH KNOWLEDGE PROCESSING */
export interface ProcessingJob {
  id: string;
  sourceId: string;
  sourceName: string;
  jobType: 'full' | 'incremental' | 'repair';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  startTime: string;
  endTime?: string;
  progressPercent: number;
  documentsProcessed: number;
  totalDocuments: number;
  keywordsExtracted: number;
  entitiesFound: number;
  successRate: number;
  errorLog?: string;
  createdBy: string;
}

export interface DataQualityMetrics {
  id: string;
  jobId: string;
  overallScore: number; // 0-100
  missingDataTypes: Array<{ type: string; count: number }>;
  duplicatesFound: number;
  validationErrors: Array<{ field: string; errorCount: number }>;
  enrichmentStatus: { enriched: number; pending: number };
  lastUpdated: string;
}

export interface DataSourceConfig {
  id: string;
  name: string;
  type: 'scopus' | 'wos' | 'pubmed' | 'orcid' | 'repository' | 'scholar' | 'custom';
  endpoint?: string;
  apiKey?: string; // encrypted in production
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  recordsIndexed: number;
  syncFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  fieldMapping?: Record<string, string>;
  filters?: Record<string, unknown>;
  createdAt: string;
  lastModified: string;
}

/** USER & SECURITY MANAGEMENT */
export interface UserPermission {
  id: string;
  roleId: string;
  resource: string; // 'users', 'publications', 'reports', 'system', etc.
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'admin')[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string; // what was acted upon
  resourceId: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
  timestamp: string;
  ipAddress?: string;
  status: 'success' | 'failure';
  details?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  loginTime: string;
  lastActivity: string;
  expiryTime: string;
  ipAddress?: string;
  deviceInfo?: string;
  active: boolean;
}

export interface SecuritySettings {
  userId?: string; // if set, user-specific; otherwise system-wide
  mfaEnabled: boolean;
  mfaType?: 'totp' | 'email' | 'sms';
  passwordExpireDays?: number;
  sessionTimeoutMinutes?: number;
  ipWhitelist?: string[];
  loginAttemptLimit?: number;
  dataEncryption: boolean;
  auditLoggingEnabled: boolean;
}

/** REPORTING & ANALYTICS */
export interface Report {
  id: string;
  name: string;
  type: 'performance' | 'collaboration' | 'funding' | 'trend' | 'custom';
  description?: string;
  createdBy: string;
  createdAt: string;
  lastGenerated?: string;
  schedule?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'once';
  nextRunDate?: string;
  filters: Record<string, unknown>;
  sections: string[]; // which sections to include
  format: 'pdf' | 'excel' | 'html' | 'json';
  recipients?: string[]; // email recipients for scheduled reports
  status: 'draft' | 'active' | 'archived';
}

export interface ReportData {
  id: string;
  reportId: string;
  generatedAt: string;
  generatedBy: string;
  data: Record<string, unknown>;
  fileName: string;
  filePath: string;
}

/** VISUALIZATION & DASHBOARDS */
export interface DashboardWidget {
  id: string;
  dashboardId: string;
  type: 'chart' | 'metric' | 'table' | 'list' | 'network' | 'map';
  title: string;
  description?: string;
  dataSource: string; // reference to metric/data source
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, unknown>; // chart-specific config
  refreshInterval?: number; // seconds
  order: number;
}

export interface Dashboard {
  id: string;
  name: string;
  userId: string;
  role: UserRole; // dashboard template for this role
  isDefault: boolean;
  widgets: DashboardWidget[];
  layout: 'grid' | 'freeform';
  createdAt: string;
  lastModified: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string, mfaCode?: string) => Promise<{ mfaRequired: boolean }>;
  logout: () => void;
  signupResearcher: (data: Record<string, unknown>) => Promise<boolean>;
  signupFunder: (data: Record<string, unknown>) => Promise<boolean>;
  researchers: User[];
  research: Research[];
  pendingResearchers: PendingResearcher[];
  pendingFunders: PendingFunder[];
  pendingPublications: PendingPublication[];
  collaborationRequests: CollaborationRequest[];
  fundingRequests: FundingRequest[];
  funderInterests: FunderInterest[];
  funderRfps: FunderRfp[];
  chatMessages: ChatMessage[];
  notifications: Notification[];
  systemAnnouncements: SystemAnnouncement[];
  approveResearcher: (id: string) => void;
  rejectResearcher: (id: string) => void;
  approveFunder: (id: string) => void;
  rejectFunder: (id: string) => void;
  /** Researcher: submits paper for admin approval (does not appear in feed/recommendations until approved). */
  submitPublicationForReview: (data: Partial<Research> & { attachmentLabel?: string }) => void;
  approvePublication: (id: string) => void;
  rejectPublication: (id: string) => void;
  /** Direct add (e.g. institutional tooling); prefer submitPublicationForReview for researcher uploads. */
  uploadResearch: (data: Partial<Research>) => void;
  createStaffAccount: (data: Record<string, unknown>) => void;
  likeResearch: (id: string) => void;
  deleteUser: (id: string) => void;
  disableUser: (id: string, disabled: boolean) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  sendCollaborationRequest: (data: Partial<CollaborationRequest>) => void;
  acceptCollaborationRequest: (id: string) => void;
  rejectCollaborationRequest: (id: string) => void;
  sendFundingRequest: (data: Omit<FundingRequest, 'id' | 'status' | 'createdAt'>) => void;
  expressFundingInterest: (projectId: string) => void;
  updateFunderProfile: (patch: Partial<User>) => void;
  postFunderRfp: (data: Omit<FunderRfp, 'id' | 'funderId' | 'createdAt'>) => void;
  sendChatMessage: (receiverId: string, content: string, attachmentName?: string) => void;
  markConversationRead: (otherUserId: string) => void;
  importPublicationsFromRows: (rows: Partial<Research>[]) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  chatDrawerOpen: boolean;
  setChatDrawerOpen: (open: boolean) => void;
  chatPeerId: string | null;
  openChatWith: (userId: string) => void;
  // RESEARCH KNOWLEDGE PROCESSING
  processingJobs: ProcessingJob[];
  dataQualityMetrics: DataQualityMetrics[];
  startProcessingJob: (sourceId: string, jobType: 'full' | 'incremental' | 'repair') => void;
  pauseProcessingJob: (jobId: string) => void;
  resumeProcessingJob: (jobId: string) => void;
  cancelProcessingJob: (jobId: string) => void;
  updateJobProgress: (jobId: string, progress: number) => void;
  // DATA SOURCE CONFIGURATION
  dataSources: DataSourceConfig[];
  addDataSource: (config: Omit<DataSourceConfig, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateDataSource: (id: string, patch: Partial<DataSourceConfig>) => void;
  deleteDataSource: (id: string) => void;
  testDataSourceConnection: (id: string) => boolean;
  triggerDataSync: (sourceId: string) => void;
  // USER & SECURITY MANAGEMENT
  auditLogs: AuditLog[];
  userSessions: UserSession[];
  userPermissions: UserPermission[];
  securitySettings: SecuritySettings[];
  createAuditLog: (log: Omit<AuditLog, 'id'>) => void;
  createUserSession: (userId: string, ipAddress?: string) => void;
  terminateUserSession: (sessionId: string) => void;
  terminateAllUserSessions: (userId: string) => void;
  getUserPermissionsForRole: (role: UserRole) => UserPermission[];
  updateUserPermissions: (roleId: string, permissions: UserPermission[]) => void;
  getSecuritySettings: (userId?: string) => SecuritySettings | null;
  updateSecuritySettings: (settings: SecuritySettings) => void;
  // REPORTING & ANALYTICS
  reports: Report[];
  reportData: ReportData[];
  createReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  updateReport: (id: string, patch: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  generateReport: (reportId: string) => void;
  scheduleReport: (reportId: string) => void;
  getReportHistory: (reportId: string) => ReportData[];
  // DASHBOARDS
  dashboards: Dashboard[];
  createDashboard: (dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateDashboard: (id: string, patch: Partial<Dashboard>) => void;
  deleteDashboard: (id: string) => void;
  getUserDashboards: (userId: string) => Dashboard[];
  setDefaultDashboard: (dashboardId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUCA = 'AUCA';

/** Verified researchers + staff + funder (excludes session-only admin). */
const mockResearchers: User[] = [
  {
    id: '1',
    name: 'Dr. Claver Ndahayo',
    email: 'claver.ndahayo@auca.edu',
    role: 'researcher',
    department: 'Academic Affairs',
    institution: AUCA,
    position: 'Deputy Vice Chancellor for Academics',
    orcid: '0000-0001-1111-2222',
    publications: 28,
    citations: 640,
    hIndex: 14,
    researchScore: 82,
    verified: true,
    accredited: true,
    joinedDate: '2023-01-15',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claver',
  },
  {
    id: '2',
    name: 'Prof. Kelvin Onongha',
    email: 'kelvin.onongha@auca.edu',
    role: 'researcher',
    department: 'University Leadership',
    institution: AUCA,
    position: 'Vice Chancellor',
    orcid: '0000-0002-2222-3333',
    publications: 36,
    citations: 920,
    hIndex: 17,
    researchScore: 85,
    verified: true,
    accredited: true,
    joinedDate: '2022-06-01',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kelvin',
  },
  {
    id: '3',
    name: 'Assoc. Prof. Kayigema Jacques',
    email: 'kayigema.jacques@auca.edu',
    role: 'researcher',
    department: 'Research Office',
    institution: AUCA,
    position: 'Director of Research',
    orcid: '0000-0003-3333-4444',
    publications: 41,
    citations: 1100,
    hIndex: 19,
    researchScore: 88,
    verified: true,
    accredited: true,
    joinedDate: '2023-03-10',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kayigema',
  },
  {
    id: '4',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@auca.edu',
    role: 'researcher',
    department: 'Computer Science',
    institution: AUCA,
    position: 'Associate Professor',
    orcid: '0000-0004-4444-5555',
    publications: 45,
    citations: 1250,
    hIndex: 18,
    researchScore: 86,
    verified: true,
    accredited: true,
    joinedDate: '2024-02-20',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@auca.edu',
    role: 'researcher',
    department: 'Data Science',
    institution: AUCA,
    position: 'Assistant Professor',
    orcid: '0000-0005-5555-6666',
    publications: 32,
    citations: 780,
    hIndex: 15,
    researchScore: 81,
    verified: true,
    accredited: true,
    joinedDate: '2024-08-05',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaAnderson',
  },
  {
    id: 'dept1',
    name: 'Dr. Claver Ndahayo',
    email: 'department.head@auca.edu',
    role: 'department_head',
    department: 'Academic Affairs',
    institution: AUCA,
    verified: true,
    accredited: true,
    joinedDate: '2022-01-10',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ClaverDept',
  },
  {
    id: 'mgr1',
    name: 'Assoc. Prof. Kayigema Jacques',
    email: 'manager@researchiq.com',
    role: 'manager',
    department: 'Research Office',
    institution: AUCA,
    verified: true,
    accredited: true,
    joinedDate: '2022-04-12',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KayigemaMgr',
  },
  {
    id: 'funder1',
    name: 'East Africa Research Impact Fund',
    email: 'funder@impact.org',
    role: 'funder',
    institution: AUCA,
    organizationName: 'East Africa Research Impact Fund',
    investmentRange: '$25,000 — $150,000',
    areasOfInterest: ['Climate resilience', 'Research data platforms', 'Digital ethics', 'AI policy'],
    verified: true,
    accredited: true,
    joinedDate: '2023-11-01',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FunderOrg',
  },
];

const mockResearch: Research[] = [
  {
    id: 'pub1',
    title: 'Machine Learning for Climate Prediction',
    abstract:
      'We present applied machine learning methods for climate prediction with emphasis on regional forecasting and model interpretability for policy stakeholders.',
    authors: ['Dr. Claver Ndahayo'],
    keywords: ['Machine Learning', 'Climate', 'Prediction'],
    field: 'Environmental Informatics',
    publicationDate: '2024-06-12',
    citations: 28,
    researcherId: '1',
    fundingStatus: 'seeking',
    fundingAmountNeeded: '$50,000',
    collaborators: ['1'],
    likes: 42,
    comments: 6,
    shares: 11,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
  },
  {
    id: 'pub2',
    title: 'AI Ethics in Higher Education',
    abstract:
      'A framework for ethical governance of AI tools in university teaching and research, grounded in stakeholder consultation and institutional policy.',
    authors: ['Prof. Kelvin Onongha'],
    keywords: ['AI Ethics', 'Education', 'Policy'],
    field: 'Higher Education Studies',
    publicationDate: '2024-03-20',
    citations: 34,
    researcherId: '2',
    fundingStatus: 'seeking',
    fundingAmountNeeded: '$25,000',
    collaborators: ['2'],
    likes: 56,
    comments: 9,
    shares: 14,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop',
  },
  {
    id: 'pub3',
    title: 'Research Data Management',
    abstract:
      'Institutional practices for secure research data lifecycle management, metadata standards, and cross-faculty discovery.',
    authors: ['Assoc. Prof. Kayigema Jacques'],
    keywords: ['Data Management', 'Research', 'Infrastructure'],
    field: 'Research Administration',
    publicationDate: '2023-09-08',
    citations: 41,
    researcherId: '3',
    fundingStatus: 'seeking',
    fundingAmountNeeded: '$35,000',
    collaborators: ['3'],
    likes: 38,
    comments: 5,
    shares: 8,
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
  },
  {
    id: 'pub4',
    title: 'Neural Networks for Image Recognition',
    abstract:
      'Convolutional architectures evaluated on benchmark vision tasks with efficiency considerations for edge deployment.',
    authors: ['Dr. Sarah Chen'],
    keywords: ['Neural Networks', 'Computer Vision', 'Machine Learning'],
    field: 'Computer Science',
    publicationDate: '2024-01-15',
    citations: 52,
    researcherId: '4',
    fundingStatus: 'funded',
    fundingAmountNeeded: '$40,000',
    collaborators: ['4'],
    likes: 71,
    comments: 12,
    shares: 19,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
  },
  {
    id: 'pub5',
    title: 'Big Data Analytics',
    abstract:
      'Scalable analytics pipelines for heterogeneous institutional datasets with privacy-preserving aggregation.',
    authors: ['Dr. Lisa Anderson'],
    keywords: ['Big Data', 'Analytics', 'Data Science'],
    field: 'Data Science',
    publicationDate: '2024-05-02',
    citations: 29,
    researcherId: '5',
    fundingStatus: 'funded',
    collaborators: ['5'],
    likes: 47,
    comments: 7,
    shares: 10,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  },
];

const mockPendingResearchers: PendingResearcher[] = [
  {
    id: 'p1',
    name: 'Dr. Jean Mukamana',
    email: 'j.mukamana@email.com',
    education: 'PhD in Information Systems',
    degree: 'PhD',
    experience: 4,
    institution: AUCA,
    department: 'Computer Science',
    orcid: '0000-0009-9999-8888',
    publications: [
      'Mukamana, J. (2025). Secure federated learning for campus networks. Proc. ICT4D.',
      'Mukamana, J. (2024). Metadata quality in institutional repositories.',
    ],
    cv: 'cv_jean_mukamana.pdf',
    status: 'pending',
    submittedDate: '2026-05-05',
  },
  {
    id: 'p2',
    name: 'Dr. Samuel Ndayisaba',
    email: 's.ndayisaba@email.com',
    education: 'PhD in Applied Mathematics',
    degree: 'PhD',
    experience: 6,
    institution: AUCA,
    department: 'Data Science',
    orcid: '0000-0010-1010-7777',
    publications: [
      'Ndayisaba, S. (2025). Time-series models for enrollment forecasting.',
    ],
    cv: 'cv_samuel_ndayisaba.pdf',
    status: 'pending',
    submittedDate: '2026-05-07',
  },
];

const mockPendingFunders: PendingFunder[] = [];

const mockCollaborationRequests: CollaborationRequest[] = [
  {
    id: 'cr1',
    type: 'collaboration',
    fromUserId: '3',
    fromUserName: 'Assoc. Prof. Kayigema Jacques',
    toUserId: '4',
    researchId: 'pub4',
    researchTitle: 'Neural Networks for Image Recognition',
    message:
      'I would like to explore a joint initiative linking our research data platform work with your vision models.',
    collaborationType: 'Joint proposal',
    timeline: '6 months',
    status: 'pending',
    createdAt: '2026-05-08',
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'collaboration',
    title: 'Collaboration request',
    message:
      'Assoc. Prof. Kayigema Jacques suggested collaborating on "Neural Networks for Image Recognition".',
    read: false,
    createdAt: '2026-05-08T14:30:00Z',
    link: '/requests',
  },
];

const mockSystemAnnouncements: SystemAnnouncement[] = [
  {
    id: 'sa1',
    title: 'Collaboration matching refreshed',
    message:
      'Recommendations now explain shared keywords derived from publication metadata for clearer decision-making.',
    type: 'success',
    createdAt: '2026-05-08T08:00:00Z',
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: 'cm1',
    senderId: '3',
    receiverId: '4',
    content: 'Sarah — could we schedule 30 minutes to align on the imaging dataset standards?',
    timestamp: '2026-05-07T09:15:00Z',
    read: true,
  },
  {
    id: 'cm2',
    senderId: '4',
    receiverId: '3',
    content: 'Yes — Tuesday 2pm works for me. I will send a calendar invite.',
    timestamp: '2026-05-07T09:22:00Z',
    read: true,
  },
  {
    id: 'cm3',
    senderId: '1',
    receiverId: '4',
    content: 'Sharing the climate-model appendix we discussed.',
    timestamp: '2026-05-06T16:00:00Z',
    read: false,
    attachmentName: 'climate_appendix_draft.pdf',
  },
];

const mockFunderInterests: FunderInterest[] = [
  {
    id: 'fi1',
    funderId: 'funder1',
    projectId: 'pub3',
    status: 'discussion',
    createdAt: '2026-04-28',
  },
];

const mockFunderRfps: FunderRfp[] = [
  {
    id: 'rfp1',
    funderId: 'funder1',
    title: 'Responsible AI in African Higher Education',
    summary: 'Seed grants for interdisciplinary projects linking ethics, pedagogy, and technical prototypes.',
    amountRange: '$20,000 — $75,000',
    deadline: '2026-08-01',
    createdAt: '2026-05-01',
  },
];

// RESEARCH KNOWLEDGE PROCESSING MOCK DATA
const mockProcessingJobs: ProcessingJob[] = [
  {
    id: 'job1',
    sourceId: 'source1',
    sourceName: 'Scopus',
    jobType: 'full',
    status: 'completed',
    startTime: '2026-05-10T08:00:00Z',
    endTime: '2026-05-10T09:30:00Z',
    progressPercent: 100,
    documentsProcessed: 1248,
    totalDocuments: 1248,
    keywordsExtracted: 5600,
    entitiesFound: 2340,
    successRate: 98.5,
    createdBy: 'admin1',
  },
  {
    id: 'job2',
    sourceId: 'source2',
    sourceName: 'Web of Science',
    jobType: 'incremental',
    status: 'running',
    startTime: '2026-05-11T10:00:00Z',
    progressPercent: 65,
    documentsProcessed: 892,
    totalDocuments: 1400,
    keywordsExtracted: 3200,
    entitiesFound: 1560,
    successRate: 97.8,
    createdBy: 'admin1',
  },
];

const mockDataQualityMetrics: DataQualityMetrics[] = [
  {
    id: 'dqm1',
    jobId: 'job1',
    overallScore: 92,
    missingDataTypes: [
      { type: 'abstract', count: 45 },
      { type: 'keywords', count: 120 },
      { type: 'citations', count: 12 },
    ],
    duplicatesFound: 23,
    validationErrors: [
      { field: 'date_format', errorCount: 8 },
      { field: 'doi_format', errorCount: 3 },
    ],
    enrichmentStatus: { enriched: 1180, pending: 68 },
    lastUpdated: '2026-05-10T09:30:00Z',
  },
];

const mockDataSources: DataSourceConfig[] = [
  {
    id: 'ds1',
    name: 'Scopus',
    type: 'scopus',
    status: 'connected',
    lastSync: '2026-05-10T09:30:00Z',
    recordsIndexed: 1248,
    syncFrequency: 'daily',
    createdAt: '2026-04-01',
    lastModified: '2026-05-10T09:30:00Z',
  },
  {
    id: 'ds2',
    name: 'Web of Science',
    type: 'wos',
    status: 'syncing',
    lastSync: '2026-05-11T10:00:00Z',
    recordsIndexed: 3456,
    syncFrequency: 'daily',
    createdAt: '2026-04-02',
    lastModified: '2026-05-11T10:00:00Z',
  },
  {
    id: 'ds3',
    name: 'PubMed',
    type: 'pubmed',
    status: 'connected',
    lastSync: '2026-05-09T14:22:00Z',
    recordsIndexed: 892,
    syncFrequency: 'weekly',
    createdAt: '2026-04-05',
    lastModified: '2026-05-09T14:22:00Z',
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 'al1',
    userId: 'admin1',
    userName: 'Admin User',
    action: 'PUBLICATION_APPROVED',
    resource: 'publication',
    resourceId: 'pub4',
    timestamp: '2026-05-11T08:30:00Z',
    status: 'success',
  },
  {
    id: 'al2',
    userId: '3',
    userName: 'Assoc. Prof. Kayigema Jacques',
    action: 'RESEARCHER_ADDED',
    resource: 'user',
    resourceId: 'p1',
    timestamp: '2026-05-10T14:15:00Z',
    status: 'success',
  },
  {
    id: 'al3',
    userId: 'admin1',
    userName: 'Admin User',
    action: 'COLLABORATION_REQUEST_SENT',
    resource: 'collaboration',
    resourceId: 'cr1',
    timestamp: '2026-05-08T14:30:00Z',
    status: 'success',
  },
];

const mockUserSessions: UserSession[] = [
  {
    id: 'sess1',
    userId: '1',
    loginTime: '2026-05-12T08:00:00Z',
    lastActivity: '2026-05-12T10:45:00Z',
    expiryTime: '2026-05-12T18:00:00Z',
    active: true,
  },
  {
    id: 'sess2',
    userId: '4',
    loginTime: '2026-05-11T09:30:00Z',
    lastActivity: '2026-05-11T16:20:00Z',
    expiryTime: '2026-05-11T17:30:00Z',
    active: false,
  },
];

const mockUserPermissions: UserPermission[] = [
  {
    id: 'up1',
    roleId: 'researcher',
    resource: 'publications',
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    id: 'up2',
    roleId: 'admin',
    resource: 'users',
    actions: ['create', 'read', 'update', 'delete', 'admin'],
  },
  {
    id: 'up3',
    roleId: 'admin',
    resource: 'publications',
    actions: ['create', 'read', 'update', 'delete', 'approve', 'admin'],
  },
  {
    id: 'up4',
    roleId: 'manager',
    resource: 'reports',
    actions: ['create', 'read', 'update'],
  },
  {
    id: 'up5',
    roleId: 'department_head',
    resource: 'analytics',
    actions: ['read'],
  },
];

const mockSecuritySettings: SecuritySettings[] = [
  {
    userId: undefined,
    mfaEnabled: false,
    passwordExpireDays: 90,
    sessionTimeoutMinutes: 60,
    loginAttemptLimit: 5,
    dataEncryption: true,
    auditLoggingEnabled: true,
  },
];

const mockReports: Report[] = [
  {
    id: 'rep1',
    name: 'Monthly Research Performance',
    type: 'performance',
    description: 'Overall publication and citation metrics by department',
    createdBy: 'admin1',
    createdAt: '2026-04-15',
    lastGenerated: '2026-05-01',
    schedule: 'monthly',
    nextRunDate: '2026-06-01',
    filters: { department: 'all', dateRange: 'last_30_days' },
    sections: ['publications', 'citations', 'collaboration', 'funding'],
    format: 'pdf',
    recipients: ['dept_head@auca.edu', 'admin@researchiq.com'],
    status: 'active',
  },
  {
    id: 'rep2',
    name: 'Funding Opportunity Digest',
    type: 'funding',
    description: 'Weekly matched funding opportunities for active researchers',
    createdBy: 'mgr1',
    createdAt: '2026-05-01',
    lastGenerated: '2026-05-10',
    schedule: 'weekly',
    nextRunDate: '2026-05-17',
    filters: { researchArea: 'all', matchScore: 70 },
    sections: ['matched_opportunities', 'deadline_alerts', 'success_rate_analysis'],
    format: 'excel',
    recipients: [],
    status: 'active',
  },
];

const mockDashboards: Dashboard[] = [
  {
    id: 'dash1',
    name: 'Researcher Overview',
    userId: '',
    role: 'researcher',
    isDefault: true,
    widgets: [
      {
        id: 'w1',
        dashboardId: 'dash1',
        type: 'metric',
        title: 'Total Publications',
        dataSource: 'publications_count',
        position: { x: 0, y: 0 },
        size: { width: 2, height: 2 },
        config: {},
        order: 1,
      },
      {
        id: 'w2',
        dashboardId: 'dash1',
        type: 'chart',
        title: 'Citation Trends',
        dataSource: 'citation_trends',
        position: { x: 2, y: 0 },
        size: { width: 4, height: 3 },
        config: { chartType: 'line' },
        order: 2,
      },
    ],
    layout: 'grid',
    createdAt: '2026-04-10',
    lastModified: '2026-05-10',
  },
];


export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [researchers, setResearchers] = useState<User[]>(mockResearchers);
  const [research, setResearch] = useState<Research[]>(mockResearch);
  const [pendingResearchers, setPendingResearchers] = useState<PendingResearcher[]>(mockPendingResearchers);
  const [pendingFunders, setPendingFunders] = useState<PendingFunder[]>(mockPendingFunders);
  const [pendingPublications, setPendingPublications] = useState<PendingPublication[]>([]);
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>(mockCollaborationRequests);
  const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([]);
  const [funderInterests, setFunderInterests] = useState<FunderInterest[]>(mockFunderInterests);
  const [funderRfps, setFunderRfps] = useState<FunderRfp[]>(mockFunderRfps);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [systemAnnouncements] = useState<SystemAnnouncement[]>(mockSystemAnnouncements);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatPeerId, setChatPeerId] = useState<string | null>(null);

  // NEW: RESEARCH KNOWLEDGE PROCESSING
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>(mockProcessingJobs);
  const [dataQualityMetrics, setDataQualityMetrics] = useState<DataQualityMetrics[]>(mockDataQualityMetrics);

  // NEW: DATA SOURCE CONFIGURATION
  const [dataSources, setDataSources] = useState<DataSourceConfig[]>(mockDataSources);

  // NEW: USER & SECURITY MANAGEMENT
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [userSessions, setUserSessions] = useState<UserSession[]>(mockUserSessions);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>(mockUserPermissions);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings[]>(mockSecuritySettings);

  // NEW: REPORTING & ANALYTICS
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [reportData, setReportData] = useState<ReportData[]>([]);

  // NEW: DASHBOARDS
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);

  const openChatWith = (userId: string) => {
    setChatPeerId(userId);
    setChatDrawerOpen(true);
  };

  // Restore session and load real data on mount
  useEffect(() => {
    const stored = loadUser<User>();
    if (stored) {
      setUser(stored);
      // Refresh profile metrics from DB in background (picks up OpenAlex data saved on ORCID login)
      api.get<{
        department?: string; position?: string; institution?: string; orcid?: string;
        expertiseKeywords?: string[]; profilePicture?: string; joinedDate?: string;
        hIndex?: number; citedByCount?: number; worksCount?: number;
        openalexPublications?: OpenAlexPublication[];
      }>('/users/me')
        .then(profile => {
          const refreshed: User = {
            ...stored,
            department: profile.department ?? stored.department,
            position: profile.position ?? stored.position,
            institution: profile.institution ?? stored.institution,
            orcid: profile.orcid ?? stored.orcid,
            expertise: profile.expertiseKeywords ?? stored.expertise,
            photo: profile.profilePicture ?? stored.photo,
            hIndex: profile.hIndex ?? stored.hIndex,
            citations: profile.citedByCount ?? stored.citations,
            publications: profile.worksCount ?? stored.publications,
            openalexPublications: profile.openalexPublications ?? stored.openalexPublications,
            joinedDate: profile.joinedDate
              ? new Date(profile.joinedDate).toISOString().slice(0, 10)
              : stored.joinedDate,
          };
          saveUser(refreshed);
          setUser(refreshed);
        })
        .catch(() => {});
    }

    // Fetch approved research from backend; fall back to mock on failure
    api.get<Array<{
      id: string; title: string; abstractText: string; authors: string[];
      field: string; keywords: string[]; doi: string; publicationDate: string;
      researcherId: string; researcherName: string; researcherDepartment: string;
      researcherInstitution: string; fundingStatus: string;
      fundingAmountNeeded: number | null; citationCount: number;
      likeCount: number; shareCount: number; commentCount: number;
      createdAt: string;
    }>>('/research')
      .then(items => {
        if (items && items.length > 0) {
          setResearch(items.map(p => ({
            id: p.id,
            title: p.title,
            abstract: p.abstractText,
            authors: p.authors || [],
            field: p.field,
            keywords: p.keywords || [],
            doi: p.doi || '',
            publicationDate: p.publicationDate || '',
            researcherId: p.researcherId,
            researcherName: p.researcherName,
            researcherDepartment: p.researcherDepartment,
            researcherInstitution: p.researcherInstitution,
            fundingStatus: (p.fundingStatus?.toLowerCase() || 'unfunded') as Research['fundingStatus'],
            fundingAmountNeeded: p.fundingAmountNeeded ?? undefined,
            citations: p.citationCount || 0,
            likes: p.likeCount || 0,
            shares: p.shareCount || 0,
            comments: p.commentCount || 0,
            createdAt: p.createdAt,
            status: 'approved' as const,
          })));
        }
      })
      .catch(() => { /* keep mock data */ });
  }, []);

  function mapRole(raw: string): UserRole {
    const r = raw.toUpperCase();
    if (r === 'RESEARCHER') return 'researcher';
    if (r === 'FUNDER') return 'funder';
    if (r === 'DEPARTMENT_HEAD') return 'department_head';
    if (r === 'MANAGER' || r === 'RESEARCH_MANAGER') return 'manager';
    if (r === 'ADMIN') return 'admin';
    return 'researcher';
  }

  const login = async (email: string, password: string, mfaCode?: string): Promise<{ mfaRequired: boolean }> => {
    const result = await api.post<{ token: string | null; mfaRequired: boolean; user: { id: string; name: string; email: string; role: string } | null }>(
      '/auth/login',
      { email, password, mfaCode }
    );
    if (result.mfaRequired) return { mfaRequired: true };
    if (result.token && result.user) {
      saveToken(result.token);
      const u: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: mapRole(result.user.role),
        verified: true,
        accredited: true,
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      saveUser(u);
      setUser(u);
      // Load full profile in background
      api.get<{
        id: string; name: string; email: string; role: string;
        department?: string; position?: string; institution?: string; orcid?: string;
        expertiseKeywords?: string[]; profilePicture?: string; joinedDate?: string;
        hIndex?: number; citedByCount?: number; worksCount?: number;
        openalexPublications?: OpenAlexPublication[];
      }>('/users/me')
        .then(profile => {
          const full: User = {
            ...u,
            department: profile.department,
            position: profile.position,
            institution: profile.institution,
            orcid: profile.orcid,
            expertise: profile.expertiseKeywords,
            photo: profile.profilePicture,
            hIndex: profile.hIndex,
            citations: profile.citedByCount,
            publications: profile.worksCount,
            openalexPublications: profile.openalexPublications,
            joinedDate: profile.joinedDate ? new Date(profile.joinedDate).toISOString().slice(0, 10) : u.joinedDate,
          };
          saveUser(full);
          setUser(full);
        })
        .catch(() => {});
    }
    return { mfaRequired: false };
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const signupResearcher = async (data: Record<string, unknown>): Promise<boolean> => {
    try {
      const pubsRaw = String(data.publications ?? '');
      await api.post('/auth/signup/researcher', {
        name: String(data.name ?? ''),
        email: String(data.email ?? ''),
        password: String(data.password ?? ''),
        institution: String(data.institution ?? ''),
        department: String(data.department ?? ''),
        orcid: String(data.orcid ?? '') || undefined,
        degree: String(data.degree ?? '') || undefined,
        educationSummary: String(data.education ?? '') || undefined,
        yearsExperience: parseInt(String(data.experience ?? '0'), 10) || 0,
        publicationsList: pubsRaw.split('\n').map((l: string) => l.trim()).filter(Boolean),
        expertiseKeywords: [],
      });
      return true;
    } catch {
      return false;
    }
  };

  const signupFunder = async (data: Record<string, unknown>): Promise<boolean> => {
    try {
      await api.post('/auth/signup/funder', {
        name: String(data.contactName ?? data.organizationName ?? ''),
        email: String(data.email ?? ''),
        password: String(data.password ?? ''),
        organization: String(data.organizationName ?? ''),
        phone: String(data.contactPhone ?? '') || undefined,
        areasOfInterest: String(data.areasOfInterest ?? '').split(',').map((s: string) => s.trim()).filter(Boolean),
        investmentRange: String(data.investmentRange ?? '') || undefined,
      });
      return true;
    } catch {
      return false;
    }
  };

  const approveResearcher = (id: string) => {
    const pending = pendingResearchers.find(p => p.id === id);
    if (!pending) return;
    const newResearcher: User = {
      id: `r${Date.now()}`,
      name: pending.name,
      email: pending.email,
      role: 'researcher',
      department: pending.department,
      institution: pending.institution,
      orcid: pending.orcid,
      publications: pending.publications.length,
      citations: 0,
      hIndex: 0,
      researchScore: 0,
      verified: true,
      accredited: true,
      joinedDate: new Date().toISOString().split('T')[0],
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pending.name)}`,
    };
    setResearchers(prev => [...prev, newResearcher]);
    setPendingResearchers(prev => prev.filter(p => p.id !== id));
  };

  const rejectResearcher = (id: string) => {
    setPendingResearchers(prev => prev.filter(p => p.id !== id));
  };

  const approveFunder = (id: string) => {
    const pending = pendingFunders.find(p => p.id === id);
    if (!pending) return;
    const newFunder: User = {
      id: `f${Date.now()}`,
      name: pending.organizationName,
      email: pending.email,
      role: 'funder',
      institution: AUCA,
      organizationName: pending.organizationName,
      investmentRange: pending.investmentRange,
      areasOfInterest: pending.areasOfInterest,
      verified: true,
      accredited: true,
      joinedDate: new Date().toISOString().split('T')[0],
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pending.organizationName)}`,
    };
    setResearchers(prev => [...prev, newFunder]);
    setPendingFunders(prev => prev.filter(p => p.id !== id));
  };

  const rejectFunder = (id: string) => {
    setPendingFunders(prev => prev.filter(p => p.id !== id));
  };

  const submitPublicationForReview = (data: Partial<Research> & { attachmentLabel?: string }) => {
    if (!user || user.role !== 'researcher') return;
    const entry: PendingPublication = {
      id: `pp${Date.now()}`,
      researcherId: user.id,
      researcherName: user.name,
      submittedDate: new Date().toISOString().split('T')[0],
      title: data.title || '',
      abstract: data.abstract || '',
      authors: data.authors?.length ? data.authors : [user.name],
      field: data.field || '',
      fundingStatus: data.fundingStatus || 'seeking',
      fundingAmountNeeded: data.fundingAmountNeeded,
      doi: data.doi,
      coverImage: data.coverImage,
      attachmentLabel: data.attachmentLabel,
      suggestedKeywords: data.keywords,
    };
    setPendingPublications(prev => [...prev, entry]);
  };

  const approvePublication = (id: string) => {
    const p = pendingPublications.find(x => x.id === id);
    if (!p) return;
    const hints = p.suggestedKeywords || [];
    const keywords = deriveKeywordsFromText(p.title, p.abstract, hints);
    const newResearch: Research = {
      id: `pub${Date.now()}`,
      title: p.title,
      abstract: p.abstract,
      authors: p.authors,
      keywords,
      field: p.field,
      publicationDate: new Date().toISOString().split('T')[0],
      citations: 0,
      researcherId: p.researcherId,
      fundingStatus: p.fundingStatus || 'seeking',
      fundingAmountNeeded: p.fundingAmountNeeded,
      collaborators: [p.researcherId],
      likes: 0,
      comments: 0,
      shares: 0,
      coverImage: p.coverImage,
      doi: p.doi,
    };
    setResearch(prev => [newResearch, ...prev]);
    setResearchers(prev =>
      prev.map(u => (u.id === p.researcherId ? { ...u, publications: (u.publications || 0) + 1 } : u))
    );
    setUser(u => (u?.id === p.researcherId ? { ...u, publications: (u.publications || 0) + 1 } : u));
    setPendingPublications(prev => prev.filter(x => x.id !== id));
  };

  const rejectPublication = (id: string) => {
    setPendingPublications(prev => prev.filter(x => x.id !== id));
  };

  const uploadResearch = (data: Partial<Research>) => {
    const newResearch: Research = {
      id: `r${Date.now()}`,
      title: data.title || '',
      abstract: data.abstract || '',
      authors: data.authors || [user?.name || ''],
      keywords: data.keywords || [],
      field: data.field || '',
      publicationDate: new Date().toISOString().split('T')[0],
      citations: 0,
      researcherId: user?.id || '',
      fundingStatus: data.fundingStatus || 'seeking',
      fundingAmountNeeded: data.fundingAmountNeeded,
      collaborators: data.collaborators || [],
      likes: 0,
      comments: 0,
      shares: 0,
      coverImage: data.coverImage,
    };
    setResearch(prev => [newResearch, ...prev]);
  };

  const createStaffAccount = (data: Record<string, unknown>) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name: String(data.name ?? ''),
      email: String(data.email ?? ''),
      role: data.role as UserRole,
      institution: String(data.institution ?? ''),
      department: String(data.department ?? ''),
      verified: true,
      accredited: true,
      joinedDate: new Date().toISOString().split('T')[0],
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(String(data.name))}`,
    };
    setResearchers(prev => [...prev, newUser]);
  };

  const likeResearch = (id: string) => {
    setResearch(prev =>
      prev.map(r => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );
  };

  const deleteUser = (id: string) => {
    setResearchers(prev => prev.filter(r => r.id !== id));
  };

  const disableUser = (id: string, disabled: boolean) => {
    setResearchers(prev => prev.map(r => (r.id === id ? { ...r, disabled } : r)));
  };

  const updateUser = (id: string, patch: Partial<User>) => {
    setResearchers(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
    setUser(u => (u?.id === id ? { ...u, ...patch } : u));
  };

  const sendCollaborationRequest = (data: Partial<CollaborationRequest>) => {
    const newRequest: CollaborationRequest = {
      id: `cr${Date.now()}`,
      type: data.type || 'collaboration',
      fromUserId: user?.id || '',
      fromUserName: user?.name || '',
      toUserId: data.toUserId || '',
      researchId: data.researchId,
      researchTitle: data.researchTitle,
      fundingId: data.fundingId,
      fundingTitle: data.fundingTitle,
      message: data.message || '',
      proposedAmount: data.proposedAmount,
      timeline: data.timeline,
      collaborationType: data.collaborationType,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCollaborationRequests(prev => [...prev, newRequest]);
  };

  const acceptCollaborationRequest = (id: string) => {
    setCollaborationRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'accepted' as const } : req))
    );
  };

  const rejectCollaborationRequest = (id: string) => {
    setCollaborationRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'rejected' as const } : req))
    );
  };

  const sendFundingRequest = (data: Omit<FundingRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: FundingRequest = {
      ...data,
      id: `fr${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFundingRequests(prev => [...prev, newRequest]);
    const newNotification: Notification = {
      id: `n${Date.now()}`,
      type: 'funding',
      title: 'Funding interest received',
      message: `${data.funderName} from ${data.funderOrg} is interested in funding "${data.researchTitle}". Proposed: ${data.proposedAmount}. Contact: ${data.funderEmail}`,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/requests',
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const expressFundingInterest = (projectId: string) => {
    if (!user || user.role !== 'funder') return;
    const exists = funderInterests.some(i => i.funderId === user.id && i.projectId === projectId);
    if (exists) return;
    setFunderInterests(prev => [
      ...prev,
      {
        id: `fi${Date.now()}`,
        funderId: user.id,
        projectId,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const updateFunderProfile = (patch: Partial<User>) => {
    if (!user || user.role !== 'funder') return;
    updateUser(user.id, patch);
  };

  const postFunderRfp = (data: Omit<FunderRfp, 'id' | 'funderId' | 'createdAt'>) => {
    if (!user || user.role !== 'funder') return;
    setFunderRfps(prev => [
      ...prev,
      {
        ...data,
        id: `rfp${Date.now()}`,
        funderId: user.id,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const sendChatMessage = (receiverId: string, content: string, attachmentName?: string) => {
    if (!user) return;
    const msg: ChatMessage = {
      id: `cm${Date.now()}`,
      senderId: user.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      attachmentName,
    };
    setChatMessages(prev => [...prev, msg]);
  };

  const markConversationRead = (otherUserId: string) => {
    if (!user) return;
    setChatMessages(prev =>
      prev.map(m => {
        if (m.senderId === otherUserId && m.receiverId === user!.id && !m.read) {
          return { ...m, read: true };
        }
        return m;
      })
    );
  };

  const importPublicationsFromRows = (rows: Partial<Research>[]) => {
    const mapped: Research[] = rows.map((data, i) => ({
      id: `imp${Date.now()}-${i}`,
      title: data.title || 'Untitled',
      abstract: data.abstract || '',
      authors: data.authors || [],
      keywords: data.keywords || [],
      field: data.field || 'General',
      publicationDate: data.publicationDate || new Date().toISOString().split('T')[0],
      citations: data.citations ?? 0,
      researcherId: data.researcherId || '',
      fundingStatus: data.fundingStatus || 'completed',
      collaborators: data.collaborators || [],
      likes: 0,
      comments: 0,
      shares: 0,
    }));
    setResearch(prev => [...mapped, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  // ========== RESEARCH KNOWLEDGE PROCESSING FUNCTIONS ==========
  const startProcessingJob = (sourceId: string, jobType: 'full' | 'incremental' | 'repair') => {
    if (!user || user.role !== 'admin') return;
    const source = dataSources.find(ds => ds.id === sourceId);
    if (!source) return;
    const newJob: ProcessingJob = {
      id: `job${Date.now()}`,
      sourceId,
      sourceName: source.name,
      jobType,
      status: 'running',
      startTime: new Date().toISOString(),
      progressPercent: 0,
      documentsProcessed: 0,
      totalDocuments: 1000,
      keywordsExtracted: 0,
      entitiesFound: 0,
      successRate: 0,
      createdBy: user.id,
    };
    setProcessingJobs(prev => [...prev, newJob]);
    // Auto-complete after simulation
    setTimeout(() => {
      setProcessingJobs(prev =>
        prev.map(j =>
          j.id === newJob.id
            ? {
                ...j,
                status: 'completed',
                progressPercent: 100,
                documentsProcessed: 980,
                keywordsExtracted: 4500,
                entitiesFound: 2100,
                successRate: 98.2,
                endTime: new Date().toISOString(),
              }
            : j
        )
      );
    }, 5000);
  };

  const pauseProcessingJob = (jobId: string) => {
    if (!user || user.role !== 'admin') return;
    setProcessingJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: 'paused' } : j)));
  };

  const resumeProcessingJob = (jobId: string) => {
    if (!user || user.role !== 'admin') return;
    setProcessingJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: 'running' } : j)));
  };

  const cancelProcessingJob = (jobId: string) => {
    if (!user || user.role !== 'admin') return;
    setProcessingJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const updateJobProgress = (jobId: string, progress: number) => {
    if (!user || user.role !== 'admin') return;
    setProcessingJobs(prev =>
      prev.map(j =>
        j.id === jobId
          ? {
              ...j,
              progressPercent: Math.min(100, progress),
              documentsProcessed: Math.floor((j.totalDocuments * progress) / 100),
            }
          : j
      )
    );
  };

  // ========== DATA SOURCE CONFIGURATION FUNCTIONS ==========
  const addDataSource = (config: Omit<DataSourceConfig, 'id' | 'createdAt' | 'lastModified'>) => {
    if (!user || user.role !== 'admin') return;
    const newSource: DataSourceConfig = {
      ...config,
      id: `ds${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setDataSources(prev => [...prev, newSource]);
  };

  const updateDataSource = (id: string, patch: Partial<DataSourceConfig>) => {
    if (!user || user.role !== 'admin') return;
    setDataSources(prev =>
      prev.map(ds =>
        ds.id === id ? { ...ds, ...patch, lastModified: new Date().toISOString().split('T')[0] } : ds
      )
    );
  };

  const deleteDataSource = (id: string) => {
    if (!user || user.role !== 'admin') return;
    setDataSources(prev => prev.filter(ds => ds.id !== id));
  };

  const testDataSourceConnection = (id: string): boolean => {
    if (!user || user.role !== 'admin') return false;
    const source = dataSources.find(ds => ds.id === id);
    if (!source) return false;
    // Simulate connection test - always true in prototype
    updateDataSource(id, { status: 'connected' });
    return true;
  };

  const triggerDataSync = (sourceId: string) => {
    if (!user || user.role !== 'admin') return;
    updateDataSource(sourceId, { status: 'syncing', lastSync: new Date().toISOString() });
    // Simulate sync completion
    setTimeout(() => {
      updateDataSource(sourceId, {
        status: 'connected',
        recordsIndexed: Math.floor(Math.random() * 5000) + 500,
      });
    }, 3000);
  };

  // ========== USER & SECURITY MANAGEMENT FUNCTIONS ==========
  const createAuditLog = (log: Omit<AuditLog, 'id'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `al${Date.now()}`,
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const createUserSession = (userId: string, ipAddress?: string) => {
    const newSession: UserSession = {
      id: `sess${Date.now()}`,
      userId,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
      ipAddress,
      active: true,
    };
    setUserSessions(prev => [...prev, newSession]);
    // Log the login action
    const usr = researchers.find(r => r.id === userId);
    if (usr) {
      createAuditLog({
        userId,
        userName: usr.name,
        action: 'LOGIN',
        resource: 'session',
        resourceId: newSession.id,
        timestamp: new Date().toISOString(),
        status: 'success',
        ipAddress,
      });
    }
  };

  const terminateUserSession = (sessionId: string) => {
    setUserSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, active: false } : s)));
  };

  const terminateAllUserSessions = (userId: string) => {
    setUserSessions(prev => prev.map(s => (s.userId === userId ? { ...s, active: false } : s)));
  };

  const getUserPermissionsForRole = (role: UserRole): UserPermission[] => {
    return userPermissions.filter(p => p.roleId === role);
  };

  const updateUserPermissions = (roleId: string, permissions: UserPermission[]) => {
    if (!user || user.role !== 'admin') return;
    setUserPermissions(prev =>
      prev.filter(p => p.roleId !== roleId).concat(permissions.map(p => ({ ...p, roleId })))
    );
    createAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'PERMISSIONS_UPDATED',
      resource: 'role',
      resourceId: roleId,
      timestamp: new Date().toISOString(),
      status: 'success',
    });
  };

  const getSecuritySettings = (userId?: string): SecuritySettings | null => {
    if (userId) {
      return securitySettings.find(s => s.userId === userId) || null;
    }
    return securitySettings.find(s => !s.userId) || null;
  };

  const updateSecuritySettings = (settings: SecuritySettings) => {
    if (!user || (user.role !== 'admin' && user.id !== settings.userId)) return;
    setSecuritySettings(prev =>
      prev.some(s => s.userId === settings.userId)
        ? prev.map(s => (s.userId === settings.userId ? settings : s))
        : [...prev, settings]
    );
  };

  // ========== REPORTING & ANALYTICS FUNCTIONS ==========
  const createReport = (report: Omit<Report, 'id' | 'createdAt'>) => {
    if (!user || !['admin', 'manager', 'department_head'].includes(user.role)) return;
    const newReport: Report = {
      ...report,
      id: `rep${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReports(prev => [...prev, newReport]);
  };

  const updateReport = (id: string, patch: Partial<Report>) => {
    if (!user || !['admin', 'manager'].includes(user.role)) return;
    setReports(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
  };

  const deleteReport = (id: string) => {
    if (!user || user.role !== 'admin') return;
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const generateReport = (reportId: string) => {
    if (!user || !['admin', 'manager'].includes(user.role)) return;
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    const newReportData: ReportData = {
      id: `rd${Date.now()}`,
      reportId,
      generatedAt: new Date().toISOString(),
      generatedBy: user.id,
      data: {
        summary: `Report generated for ${report.type}`,
        sections: report.sections,
        filters: report.filters,
        totalRecords: Math.floor(Math.random() * 500) + 100,
      },
      fileName: `${report.name}-${new Date().toISOString().split('T')[0]}.${report.format}`,
      filePath: `/reports/${reportId}/data.${report.format}`,
    };
    setReportData(prev => [...prev, newReportData]);
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, lastGenerated: new Date().toISOString() } : r))
    );
  };

  const scheduleReport = (reportId: string) => {
    if (!user || !['admin', 'manager'].includes(user.role)) return;
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    // Update next run date based on schedule
    let nextRun = new Date();
    if (report.schedule === 'daily') nextRun.setDate(nextRun.getDate() + 1);
    else if (report.schedule === 'weekly') nextRun.setDate(nextRun.getDate() + 7);
    else if (report.schedule === 'monthly') nextRun.setMonth(nextRun.getMonth() + 1);
    updateReport(reportId, { nextRunDate: nextRun.toISOString().split('T')[0] });
  };

  const getReportHistory = (reportId: string): ReportData[] => {
    return reportData.filter(rd => rd.reportId === reportId).sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  };

  // ========== DASHBOARD FUNCTIONS ==========
  const createDashboard = (dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'lastModified'>) => {
    if (!user) return;
    const newDash: Dashboard = {
      ...dashboard,
      id: `dash${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setDashboards(prev => [...prev, newDash]);
  };

  const updateDashboard = (id: string, patch: Partial<Dashboard>) => {
    if (!user) return;
    setDashboards(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              ...patch,
              lastModified: new Date().toISOString().split('T')[0],
            }
          : d
      )
    );
  };

  const deleteDashboard = (id: string) => {
    if (!user) return;
    setDashboards(prev => prev.filter(d => d.id !== id));
  };

  const getUserDashboards = (userId: string): Dashboard[] => {
    return dashboards.filter(d => d.userId === userId || d.userId === '');
  };

  const setDefaultDashboard = (dashboardId: string) => {
    if (!user) return;
    setDashboards(prev =>
      prev.map(d => ({
        ...d,
        isDefault: d.id === dashboardId,
      }))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        signupResearcher,
        signupFunder,
        researchers,
        research,
        pendingResearchers,
        pendingFunders,
        pendingPublications,
        collaborationRequests,
        fundingRequests,
        funderInterests,
        funderRfps,
        chatMessages,
        notifications,
        systemAnnouncements,
        approveResearcher,
        rejectResearcher,
        approveFunder,
        rejectFunder,
        submitPublicationForReview,
        approvePublication,
        rejectPublication,
        uploadResearch,
        createStaffAccount,
        likeResearch,
        deleteUser,
        disableUser,
        updateUser,
        sendCollaborationRequest,
        acceptCollaborationRequest,
        rejectCollaborationRequest,
        sendFundingRequest,
        expressFundingInterest,
        updateFunderProfile,
        postFunderRfp,
        sendChatMessage,
        markConversationRead,
        importPublicationsFromRows,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        chatDrawerOpen,
        setChatDrawerOpen,
        chatPeerId,
        openChatWith,
        // NEW: KNOWLEDGE PROCESSING
        processingJobs,
        dataQualityMetrics,
        startProcessingJob,
        pauseProcessingJob,
        resumeProcessingJob,
        cancelProcessingJob,
        updateJobProgress,
        // NEW: DATA SOURCES
        dataSources,
        addDataSource,
        updateDataSource,
        deleteDataSource,
        testDataSourceConnection,
        triggerDataSync,
        // NEW: SECURITY & USERS
        auditLogs,
        userSessions,
        userPermissions,
        securitySettings,
        createAuditLog,
        createUserSession,
        terminateUserSession,
        terminateAllUserSessions,
        getUserPermissionsForRole,
        updateUserPermissions,
        getSecuritySettings,
        updateSecuritySettings,
        // NEW: REPORTING
        reports,
        reportData,
        createReport,
        updateReport,
        deleteReport,
        generateReport,
        scheduleReport,
        getReportHistory,
        // NEW: DASHBOARDS
        dashboards,
        createDashboard,
        updateDashboard,
        deleteDashboard,
        getUserDashboards,
        setDefaultDashboard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
