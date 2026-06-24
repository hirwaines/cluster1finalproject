import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SignUpResearcherPage } from "./pages/SignUpResearcherPage";
import { SignUpFunderPage } from "./pages/SignUpFunderPage";
import { LoginPage } from "./pages/LoginPage";
import { ResearcherDashboard } from "./pages/ResearcherDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { FunderDashboard } from "./pages/FunderDashboard";
import { ResearchManagerDashboard } from "./pages/ResearchManagerDashboard";
import { DepartmentHeadDashboard } from "./pages/DepartmentHeadDashboard";
import { ResearcherProfile } from "./pages/ResearcherProfile";
import { UploadResearch } from "./pages/UploadResearch";
import { FindCollaborators } from "./pages/FindCollaborators";
import { ProjectsBrowse } from "./pages/ProjectsBrowse";
import { CollaborationNetwork } from "./pages/CollaborationNetwork";
import { ResearchTrends } from "./pages/ResearchTrends";
import { FundingOpportunities } from "./pages/FundingOpportunities";
import { ExpertiseMap } from "./pages/ExpertiseMap";
import { FeedPage } from "./pages/FeedPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { MyProfile } from "./pages/MyProfile";
import { SettingsPage } from "./pages/SettingsPage";
import { DataIntegration } from "./pages/DataIntegration";
import { RequestsPage } from "./pages/RequestsPage";
import { ResearcherAnalyticsPage } from "./pages/ResearcherAnalyticsPage";
import { MessagesPage } from "./pages/MessagesPage";
// NEW PAGES
import { ResearchKnowledgeProcessing } from "./pages/ResearchKnowledgeProcessing";
import { UserSecurityManagement } from "./pages/UserSecurityManagement";
import { ReportBuilder } from "./pages/ReportBuilder";
import { DashboardCustomizer } from "./pages/DashboardCustomizer";
import { PublicationDetailPage } from "./pages/PublicationDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/signup/researcher",
    element: <SignUpResearcherPage />,
  },
  {
    path: "/signup/funder",
    element: <SignUpFunderPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/researcher/dashboard",
    element: <ResearcherDashboard />,
  },
  {
    path: "/feed",
    element: <FeedPage />,
  },
  {
    path: "/discover",
    element: <DiscoverPage />,
  },
  {
    path: "/requests",
    element: <RequestsPage />,
  },
  {
    path: "/my-profile",
    element: <MyProfile />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/messages",
    element: <MessagesPage />,
  },
  {
    path: "/data-integration",
    element: <DataIntegration />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/funder/dashboard",
    element: <FunderDashboard />,
  },
  {
    path: "/partner/dashboard",
    element: <Navigate to="/funder/dashboard" replace />,
  },
  {
    path: "/manager/dashboard",
    element: <ResearchManagerDashboard />,
  },
  {
    path: "/department/dashboard",
    element: <DepartmentHeadDashboard />,
  },
  {
    path: "/researcher/profile/:id",
    element: <ResearcherProfile />,
  },
  {
    path: "/researcher/upload",
    element: <UploadResearch />,
  },
  {
    path: "/researcher/analytics",
    element: <ResearcherAnalyticsPage />,
  },
  {
    path: "/collaborators",
    element: <FindCollaborators />,
  },
  {
    path: "/projects",
    element: <ProjectsBrowse />,
  },
  {
    path: "/network",
    element: <Navigate to="/collaborators" replace />,
  },
  {
    path: "/publication/:id",
    element: <PublicationDetailPage />,
  },
  {
    path: "/trends",
    element: <ResearchTrends />,
  },
  {
    path: "/funding",
    element: <FundingOpportunities />,
  },
  {
    path: "/expertise-map",
    element: <ExpertiseMap />,
  },
  // NEW ROUTES
  {
    path: "/admin/knowledge-processing",
    element: <ResearchKnowledgeProcessing />,
  },
  {
    path: "/admin/security-management",
    element: <UserSecurityManagement />,
  },
  {
    path: "/manager/reports",
    element: <ReportBuilder />,
  },
  {
    path: "/dashboard-customizer",
    element: <DashboardCustomizer />,
  },
]);
