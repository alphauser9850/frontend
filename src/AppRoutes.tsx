import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

function SafeNavigate(props: React.ComponentProps<typeof Navigate>) {
  if (typeof window === "undefined") {
    // During SSR, just render nothing
    return null;
  }
  return <Navigate {...props} />;
}

import AuthGuard from "./components/AuthGuard";

// Import pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServersPage from "./pages/ServersPage";
import CCNAPage from "./pages/CCNAPage";
import CCNPPage from "./pages/CCNPPage";
import CCIEPage from "./pages/CCIEPage";
import CCIEWirelessPage from "./pages/CCIEWirelessPage";
import SDWANPage from "./pages/SDWANPage";
import SDAccessPage from "./pages/SDAccessPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import TestPage from "./pages/TestPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import TermsPage from "./pages/TermsPage";
import DashboardPage from "./pages/DashboardPage";
import LabPage from "./pages/LabPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonPage from "./pages/LessonPage";
import AdminPage from "./pages/AdminPage";
import CourseEditorPage from "./pages/CourseEditorPage";
import TimeManagementPage from "./pages/TimeManagementPage";

export function AppRoutes() {
  console.log("[AppRoutes] rendering AppRoutes...");
  return (
    <Routes>
      {/*  Public Routes - NO AuthGuard */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/servers" element={<ServersPage />} />

      {/* Course Pages */}
      <Route path="/courses/ccna" element={<CCNAPage />} />
      <Route path="/courses/ccnp" element={<CCNPPage />} />
      <Route path="/training/ccie-enterprise-infrastructure" element={<CCIEPage />} />
      <Route
        path="/courses/ccie"
        element={<SafeNavigate to="/training/ccie-enterprise-infrastructure" replace />}
      />
      <Route path="/courses/ccie-wireless" element={<CCIEWirelessPage />} />
      <Route path="/courses/sd-wan" element={<SDWANPage />} />
      <Route path="/courses/sd-access" element={<SDAccessPage />} />

      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/refund" element={<RefundPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Protected Routes */}
      <Route element={<AuthGuard requireAuth />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lab/:serverId" element={<LabPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
      </Route>

      {/*  Admin Routes */}
      <Route element={<AuthGuard requireAuth requireAdmin />}>
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/admin/courses"
          element={<SafeNavigate to="/admin?tab=courses" replace />}
        />
        <Route path="/admin/courses/new" element={<CourseEditorPage />} />
        <Route path="/admin/courses/:courseId/edit" element={<CourseEditorPage />} />
        <Route path="/time-management" element={<TimeManagementPage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
