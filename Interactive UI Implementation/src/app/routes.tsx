import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from './components/layout';
import { LandingPage } from './pages/LandingPage';
import { ContactPage } from './pages/ContactPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignUpResearcherPage } from './pages/SignUpResearcherPage';
import { SignUpFunderPage } from './pages/SignUpFunderPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { FunderDashboard } from './pages/FunderDashboard';
import { ResearchManagerDashboard } from './pages/ResearchManagerDashboard';
import { DepartmentHeadDashboard } from './pages/DepartmentHeadDashboard';
import { ResearcherProfile } from './pages/ResearcherProfile';
import { UploadResearch } from './pages/UploadResearch';
import { CollaborationNetwork } from './pages/CollaborationNetwork';
import { ResearchTrends } from './pages/ResearchTrends';
import { FundingOpportunities } from './pages/FundingOpportunities';
import { ExpertiseMap } from './pages/ExpertiseMap';
import { FeedPage } from './pages/FeedPage';
import { MyProfile } from './pages/MyProfile';
import { SettingsPage } from './pages/SettingsPage';
import { DataIntegration } from './pages/DataIntegration';
import { RequestsPage } from './pages/RequestsPage';
import { ResearcherAnalyticsPage } from './pages/ResearcherAnalyticsPage';
import { ResearchKnowledgeProcessing } from './pages/ResearchKnowledgeProcessing';
import { UserSecurityManagement } from './pages/UserSecurityManagement';
import { ReportBuilder } from './pages/ReportBuilder';
import { ResearchPaperPage } from './pages/ResearchPaperPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/signup/researcher', element: <SignUpResearcherPage /> },
  { path: '/signup/funder', element: <SignUpFunderPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/researcher/dashboard', element: <Navigate to="/feed" replace /> },
  { path: '/discover', element: <Navigate to="/feed" replace /> },
  { path: '/collaborators', element: <Navigate to="/network" replace /> },
  { path: '/partner/dashboard', element: <Navigate to="/funder/dashboard" replace /> },
  {
    element: <AppShell />,
    children: [
      { path: '/feed', element: <FeedPage /> },
      { path: '/requests', element: <RequestsPage /> },
      { path: '/my-profile', element: <MyProfile /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/research/:id', element: <ResearchPaperPage /> },
      { path: '/researcher/profile/:id', element: <ResearcherProfile /> },
      { path: '/researcher/upload', element: <UploadResearch /> },
      { path: '/researcher/analytics', element: <ResearcherAnalyticsPage /> },
      { path: '/network', element: <CollaborationNetwork /> },
      { path: '/trends', element: <ResearchTrends /> },
      { path: '/funding', element: <FundingOpportunities /> },
      { path: '/expertise-map', element: <ExpertiseMap /> },
      { path: '/data-integration', element: <DataIntegration /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/knowledge-processing', element: <ResearchKnowledgeProcessing /> },
      { path: '/admin/security-management', element: <UserSecurityManagement /> },
      { path: '/funder/dashboard', element: <FunderDashboard /> },
      { path: '/manager/dashboard', element: <ResearchManagerDashboard /> },
      { path: '/manager/reports', element: <ReportBuilder /> },
      { path: '/department/dashboard', element: <DepartmentHeadDashboard /> },
    ],
  },
]);
