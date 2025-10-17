import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";
import { useTimeStore } from "../store/timeStore";
import { useThemeStore } from "../store/themeStore";
import { AnimatedDotPattern, AuroraText } from "./magicui";
import { cn } from "../lib/utils";
import { COURSE_NAMES, COURSE_DESCRIPTIONS, COURSE_PATHS } from "../lib/constants";
import {
  Bell,
  LogOut,
  Menu,
  X,
  Server,
  User,
  Users,
  BookOpen,
  Layers,
  Home,
  Moon,
  Sun,
  Laptop,
  Settings,
  Sparkles,
  FileText,
  Info,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import TimeRemainingDisplay from "./TimeRemainingDisplay";

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-4 text-center font-medium",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

const Navbar: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    debugNotificationSound,
  } = useNotificationStore();
  const { activeSessionId, endSession, fetchUserTimeBalance } = useTimeStore();
  const { isDarkMode, setTheme } = useThemeStore();

  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCoursesMenu, setShowCoursesMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const coursesMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUserTimeBalance();
    }
  }, [user, fetchNotifications, fetchUserTimeBalance]);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (coursesMenuRef.current && !coursesMenuRef.current.contains(event.target as Node)) {
        setShowCoursesMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowCoursesMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (activeSessionId) {
      await endSession(activeSessionId);
    }
    await signOut();
    navigate("/login");
  };

  const ccieCourseItem = {
    title: COURSE_NAMES.CCIE,
    description: COURSE_DESCRIPTIONS.CCIE,
    path: COURSE_PATHS.CCIE,
    iconType: "Sparkles",
  };

  if (!mounted) {
    return <div className="h-20 bg-background" />; // SSR-safe placeholder
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-md py-5 dark:from-gray-900/90 dark:to-gray-800/90"
      )}
    >
      {scrolled && (
        <AnimatedDotPattern
          glow={true}
          width={40}
          height={40}
          cr={1}
          className="absolute inset-0 text-primary/10 opacity-50"
        />
      )}

      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="relative h-20 w-20">
            <img
              src="/logo.png"
              alt="CCIELAB.NET Logo"
              className="h-16 w-16 object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={cn(
                "font-bold text-lg transition-colors group-hover:text-primary",
                scrolled ? "text-foreground" : "text-white"
              )}
            >
              <AuroraText>CCIELAB.NET</AuroraText>
            </span>
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wider",
                scrolled ? "text-primary/70" : "text-white/70"
              )}
            >
              Advanced CCIE Training
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-3">
          <Link
            to="/dashboard"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              location.pathname.startsWith("/dashboard")
                ? "bg-primary text-primary-foreground"
                : scrolled
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/20"
            )}
          >
            <Home className="h-4 w-4 mr-1" /> Dashboard
          </Link>

          {!user && (
            <Link
              to="/servers"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                location.pathname.startsWith("/servers")
                  ? "bg-primary text-primary-foreground"
                  : scrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/20"
              )}
            >
              <Server className="h-4 w-4 mr-1" /> Servers
            </Link>
          )}

          {!user && (
            <div className="relative" ref={coursesMenuRef}>
              <button
                onClick={() => setShowCoursesMenu(!showCoursesMenu)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors",
                  scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/20"
                )}
              >
                <BookOpen className="h-4 w-4" />
                Courses
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showCoursesMenu ? "rotate-180" : ""
                  )}
                />
              </button>

              {showCoursesMenu && (
                <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-xl shadow-xl p-4 z-50">
                  <Link
                    to={ccieCourseItem.path}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{ccieCourseItem.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ccieCourseItem.description}
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className={cn(
              "p-2 rounded-full transition-colors",
              scrolled
                ? "hover:bg-muted text-foreground"
                : "hover:bg-white/20 text-white"
            )}
          >
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 rounded-full transition-colors",
                scrolled
                  ? "hover:bg-muted text-foreground"
                  : "hover:bg-white/20 text-white"
              )}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <div className="relative" ref={userMenuRef}>
            <InteractiveHoverButton onClick={() => setShowUserMenu(!showUserMenu)}>
              <User className="h-4 w-4 mr-2" />
              {profile?.full_name || "User"}
            </InteractiveHoverButton>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg z-10 text-card-foreground overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted text-left"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className={cn(
            "md:hidden p-2 rounded-md transition-colors",
            scrolled
              ? "text-foreground hover:bg-muted"
              : "text-white hover:bg-white/20"
          )}
        >
          {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
