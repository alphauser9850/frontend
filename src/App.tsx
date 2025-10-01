import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { checkSupabaseConnection } from './lib/supabase';


// Components
import AuthGuard from './components/AuthGuard';
import Header from './components/Header';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ServersPage from './pages/ServersPage';
import LabPage from './pages/LabPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import CourseManagementPage from './pages/CourseManagementPage';
import CourseEditorPage from './pages/CourseEditorPage';
import TimeManagementPage from './pages/TimeManagementPage';
import AdminPage from './pages/AdminPage';
import TestPage from './pages/TestPage';

// Course Pages
import CCNAPage from './pages/CCNAPage';
import CCNPPage from './pages/CCNPPage';
import CCIEPage from './pages/CCIEPage';
import CCIEWirelessPage from './pages/CCIEWirelessPage';
import SDWANPage from './pages/SDWANPage';
import SDAccessPage from './pages/SDAccessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TermsPage from './pages/TermsPage';
import BlogPage from './pages/BlogPage';
import PaymentSuccessful from './components/ui/PaymentSuccessful';

// Add notification sound
const addNotificationSound = () => {
  console.log('Setting up notification sound');
  
  // Remove any existing notification sound element
  const existingAudio = document.getElementById('notification-sound');
  if (existingAudio) {
    existingAudio.remove();
    console.log('Removed existing notification sound element');
  }
  
  // Create a new audio element
  const audio = document.createElement('audio');
  audio.id = 'notification-sound';
  
  // Primary sound source
  audio.src = 'https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3';
  
  // Add error handling and fallback
  audio.onerror = () => {
    console.warn('Failed to load primary notification sound, using fallback');
    // Fallback to a local sound file
    audio.src = '/notification.mp3';
  };
  
  // Add event listeners to log issues
  audio.addEventListener('error', (e) => {
    console.error('Error with notification sound:', e);
  });
  
  // Add load event listener to test the sound
  audio.addEventListener('canplaythrough', () => {
    console.log('Notification sound loaded successfully');
    
    // Uncomment to test the sound on page load
    // setTimeout(() => {
    //   audio.play().catch(e => console.error('Failed to play test sound:', e));
    // }, 2000);
  });
  
  // Set audio properties
  audio.preload = 'auto';
  audio.volume = 1.0;
  
  // Add to DOM
  document.body.appendChild(audio);
  
  // Test if the audio can be loaded
  audio.load();
  
  console.log('Notification sound element added to DOM');
};

const NavigationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // ensures client-only logic runs after hydration
  }, []);

  // These routes should not show header/navbar
  const hideNavigation = ['/login', '/register', '/forgot-password', '/reset-password']
    .includes(location.pathname);

  // During SSR (isMounted === false), render Header to avoid hydration mismatch
  if (!isMounted) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  if (hideNavigation) return <>{children}</>;
  return (
    <>
      {isAuthenticated ? <Navbar /> : <Header />}
      {children}
    </>
  );
};

const FooterWrapper: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const noFooterRoutes = ['/lab', '/courses/'];
  const isNoFooterRoute = noFooterRoutes.some(
    (route) => location.pathname.includes(route) && location.pathname.split("/").length > 3
  );

  // During SSR, render footer always (to match client)
  if (!isMounted) return <Footer />;

  if (isNoFooterRoute && user) return null;
  return <Footer />;
};

function App() {
  const { loadUser } = useAuthStore();
  const { isDarkMode, setTheme } = useThemeStore();

  useEffect(() => {
    loadUser();
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme as "dark" | "light" | "system");
    } else {
      setTheme("dark");
    }
  }, [loadUser, setTheme]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  return (
    <>
      <NavigationWrapper>
        <Routes>
          {/* Public routes */}
          <Route element={<AuthGuard requireAuth={false} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/servers" element={<ServersPage />} />
            
            {/* Course Pages */}
            <Route path="/courses/ccna" element={<CCNAPage />} />
            <Route path="/courses/ccnp" element={<CCNPPage />} />
            <Route path="/training/ccie-enterprise-infrastructure" element={<CCIEPage />} />
            <Route path="/welcome-onboard" element={<PaymentSuccessful />} />

            <Route path="/courses/ccie" element={<Navigate to="/training/ccie-enterprise-infrastructure" replace />} />
            <Route path="/courses/ccie-wireless" element={<CCIEWirelessPage />} />
            <Route path="/courses/sd-wan" element={<SDWANPage />} />
            <Route path="/courses/sd-access" element={<SDAccessPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/refund" element={<RefundPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>
          
          {/* Protected routes */}
          <Route element={<AuthGuard requireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/lab/:serverId" element={<LabPage />} />
            <Route path="/courses" element={<CoursesPage />} />  
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
          </Route>
          
          {/* Admin routes */}
          <Route element={<AuthGuard requireAuth requireAdmin />}>
            <Route path="/admin" element={<AdminPage />} />
           <Route path="/admin/courses" element={<Navigate to="/admin?tab=courses" replace />} /> 
            <Route path="/admin/courses/new" element={<CourseEditorPage />} />
            <Route path="/admin/courses/:courseId/edit" element={<CourseEditorPage />} />
            <Route path="/time-management" element={<TimeManagementPage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NavigationWrapper>
      <FooterWrapper />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
    </>
  );
}

export default App;
