import React, { useEffect, useState } from "react";
import { AppRoutes } from "./AppRoutes";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { useLocation } from "react-router-dom";

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
       <AppRoutes />
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
