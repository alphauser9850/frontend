import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LoadingScreen from "./LoadingScreen";

interface AuthGuardProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

// ✅ Detect if we are on the server (SSR)
const isServer = typeof window === "undefined";

const AuthGuard: React.FC<AuthGuardProps> = ({
  requireAuth = false,
  requireAdmin = false,
}) => {
  const { user, isAdmin, isLoading, loadUser } = useAuthStore();
  const location = useLocation();
  
  // ✅ Treat as "hydrated" on the server
  const [hydrated, setHydrated] = useState(isServer);

  useEffect(() => {
    if (isServer) return; // don't run loadUser on server
    let mounted = true;
    loadUser()
      .catch(() => {})
      .finally(() => {
        if (mounted) setHydrated(true);
      });

    return () => {
      mounted = false;
    };
  }, [loadUser]);

  // ✅ Show LoadingScreen only on client if still loading
  if (!hydrated || isLoading) {
    return <LoadingScreen />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user && ["/login", "/register"].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
