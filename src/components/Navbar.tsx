import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { useTimeStore } from '../store/timeStore';
import { useThemeStore } from '../store/themeStore';
import { AnimatedDotPattern, AuroraText } from './magicui';
import { cn } from '../lib/utils';
import { COURSE_NAMES, COURSE_DESCRIPTIONS, COURSE_PATHS } from '../lib/constants';
import { 
  Bell, LogOut, Menu, X, Server, User, Users, BookOpen, 
  Layers, Home, Moon, Sun, Laptop, Settings, Sparkles, 
  FileText, Info, ChevronDown, ArrowRight
} from 'lucide-react';
import TimeRemainingDisplay from './TimeRemainingDisplay';

// Interactive Hover Button Component
const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-4 text-center font-medium",
        className,
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
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, debugNotificationSound } = useNotificationStore();
  const { activeSessionId, endSession, remainingTimeSeconds, fetchUserTimeBalance } = useTimeStore();
  const { isDarkMode, theme, setTheme } = useThemeStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showCoursesMenu, setShowCoursesMenu] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([
    { id: 'ccna', title: 'CCNA R&S', progress: 45 },
    { id: 'ccnp', title: 'CCNP Enterprise', progress: 20 },
    { id: 'sdwan', title: 'SD-WAN', progress: 10 },
  ]);
  const [scrolled, setScrolled] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const coursesMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUserTimeBalance();
      
      // In a real app, you would fetch enrolled courses here
      // For now, we're using the mock data defined above
    }
  }, [user, fetchNotifications, fetchUserTimeBalance]);

  // Refresh remaining time every minute
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetchUserTimeBalance();
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [user, fetchUserTimeBalance]);

  // Handle scroll effect - improved to prevent menu disappearing
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (coursesMenuRef.current && !coursesMenuRef.current.contains(event.target as Node)) {
        setShowCoursesMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowCoursesMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    // End active session if exists
    if (activeSessionId) {
      await endSession(activeSessionId);
    }
    
    await signOut();
    navigate('/login');
  };

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
    setShowNotifications(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const toggleTheme = () => {
    // Toggle between light and dark mode
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  // Add a function to test the notification sound
  const testNotificationSound = () => {
    debugNotificationSound();
  };

  // Helper function to render course icons
  const renderCourseIcon = (iconType: string) => {
    switch (iconType) {
      case "Server":
        return <Server className="h-5 w-5" />;
      case "Sparkles":
        return <Sparkles className="h-5 w-5" />;
      case "Layers":
        return <Layers className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  // Only show CCIE Enterprise in the courses menu
  const ccieCourseItem = {
    title: COURSE_NAMES.CCIE,
    description: COURSE_DESCRIPTIONS.CCIE,
    path: COURSE_PATHS.CCIE,
    iconType: "Sparkles"
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3" 
          : "bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-md py-5 dark:from-gray-900/90 dark:to-gray-800/90"
      )}
    >
      {/* Animated dot pattern for the header background when scrolled */}
      {scrolled && (
        <AnimatedDotPattern 
          glow={true}
          width={40}
          height={40}
          cr={1}
          className="absolute inset-0 text-primary/10 opacity-50"
        />
      )}
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Square overlay backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-purple-600/25 to-blue-600/25 rounded-xl blur-lg scale-110 group-hover:scale-125 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-pink-500/20 to-yellow-400/20 rounded-xl blur-xl scale-115 group-hover:scale-130 transition-all duration-700"></div>
              
              {/* Main logo container - square */}
              <div className="relative h-20 w-20 rounded-xl bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/25 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                {/* Logo image - natural square */}
                <img 
                  src="/ccielab.net logo.jpeg" 
                  alt="CCIELAB.NET Logo" 
                  className="h-16 w-16 object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300" 
                />
                
                {/* Square animated borders */}
                <div className="absolute inset-0 rounded-xl border border-primary/30 group-hover:border-primary/60 transition-all duration-300"></div>
                <div className="absolute inset-1 rounded-lg border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-500"></div>
                
                {/* Square glow effects */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            {/* Enhanced text */}
            <div className="flex flex-col">
              <span className={cn(
                "font-bold text-lg transition-colors group-hover:text-primary transition-colors duration-300",
                scrolled ? "text-foreground" : "text-white"
              )}>
                <AuroraText>CCIELAB.NET</AuroraText>
              </span>
              <span className={cn(
                "text-xs font-medium uppercase tracking-wider",
                scrolled ? "text-primary/70" : "text-white/70"
              )}>
                Advanced CCIE Training
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/dashboard" 
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                isActive('/dashboard') 
                  ? "bg-primary text-primary-foreground" 
                  : scrolled 
                    ? "text-foreground hover:bg-muted" 
                    : "text-white hover:bg-white/20"
              )}
            >
              <span className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                Dashboard
              </span>
            </Link>
            
            {!user && (
              <Link 
                to="/servers" 
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive('/servers') 
                    ? "bg-primary text-primary-foreground" 
                    : scrolled 
                      ? "text-foreground hover:bg-muted" 
                      : "text-white hover:bg-white/20"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Server className="h-4 w-4" />
                  Servers
                </span>
              </Link>
            )}
            
            {!user && (
              <>
                <div className="relative" ref={coursesMenuRef}>
                  <button 
                    onClick={() => setShowCoursesMenu(!showCoursesMenu)}
                    onMouseEnter={() => setShowCoursesMenu(true)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                      location.pathname.includes('/courses') 
                        ? "bg-primary text-primary-foreground" 
                        : scrolled 
                          ? "text-foreground hover:bg-muted" 
                          : "text-white hover:bg-white/20"
                    )}
                  >
                    <BookOpen className="h-4 w-4" />
                    Courses
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showCoursesMenu ? "rotate-180" : "")} />
                  </button>
                  
                  {/* Mega menu for guests */}
                  {showCoursesMenu && (
                    <div 
                      className="absolute top-full left-0 mt-2 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl p-4 z-50"
                      onMouseLeave={() => setShowCoursesMenu(false)}
                    >
                      <div className="w-[600px] grid grid-cols-2 gap-2">
                        {[ccieCourseItem].map((item, index) => (
                          <Link 
                            key={index}
                            to={item.path}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                              {renderCourseIcon(item.iconType)}
                            </div>
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                        <div className="col-span-2 mt-3 pt-3 border-t border-border">
                          <Link 
                            to="/courses"
                            className="flex items-center justify-center gap-2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                          >
                            <span>View All Courses</span>
                            <ChevronDown className="h-4 w-4 rotate-270" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link 
                  to="/blogs" 
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive('/blogs') 
                      ? "bg-primary text-primary-foreground" 
                      : scrolled 
                        ? "text-foreground hover:bg-muted" 
                        : "text-white hover:bg-white/20"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    Blogs
                  </span>
                </Link>
                
                <Link 
                  to="/about" 
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive('/about') 
                      ? "bg-primary text-primary-foreground" 
                      : scrolled 
                        ? "text-foreground hover:bg-muted" 
                        : "text-white hover:bg-white/20"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Info className="h-4 w-4" />
                    About Us
                  </span>
                </Link>
              </>
            )}
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive('/admin') 
                    ? "bg-primary text-primary-foreground" 
                    : scrolled 
                      ? "text-foreground hover:bg-muted" 
                      : "text-white hover:bg-white/20"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  Admin
                </span>
              </Link>
            )}
          </nav>

          {/* Auth Buttons, Time Remaining & Theme Toggle (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Time Remaining Display - Always visible with enhanced styling */}
            {user && (
              <div className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                scrolled 
                  ? "text-foreground hover:bg-muted" 
                  : "text-white hover:bg-white/20"
              )}>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1.5"></div>
                  <TimeRemainingDisplay />
                </div>
              </div>
            )}
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors",
                scrolled 
                  ? "hover:bg-muted text-foreground" 
                  : "hover:bg-white/20 text-white"
              )}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            
            {/* Notifications */}
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
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg z-10 text-card-foreground overflow-hidden">
                  <div className="p-3 border-b border-border flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-primary hover:text-primary/80"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                          className={cn(
                            "p-3 border-b border-border hover:bg-muted cursor-pointer",
                            !notification.is_read ? "bg-primary/5" : ""
                          )}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Menu with Interactive Hover Button */}
            <div className="relative ml-2" ref={userMenuRef}>
              <InteractiveHoverButton
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={cn(
                  "border-border",
                  scrolled 
                    ? "text-foreground hover:bg-muted" 
                    : isDarkMode
                      ? "text-white border-white/20 hover:bg-white/10"
                      : "text-indigo-900 border-indigo-200 hover:bg-indigo-50"
                )}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center mr-2",
                    scrolled
                      ? "bg-primary/20 text-primary"
                      : isDarkMode
                        ? "bg-white/20 text-white"
                        : "bg-indigo-100 text-indigo-700"
                  )}>
                    <User className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">{profile?.full_name || 'User'}</span>
                </div>
              </InteractiveHoverButton>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg z-10 text-card-foreground overflow-hidden">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground mt-1">{profile?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted text-left"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={cn(
              "md:hidden p-2 rounded-md transition-colors",
              scrolled 
                ? "text-foreground hover:bg-muted" 
                : "text-white hover:bg-white/20"
            )}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/dashboard" 
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-medium",
                  isActive('/dashboard') 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Home className="h-4 w-4" />
                  Dashboard
                </span>
              </Link>
              
              {!user && (
                <Link 
                  to="/servers" 
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium",
                    isActive('/servers') 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Server className="h-4 w-4" />
                    Servers
                  </span>
                </Link>
              )}
              
              {!user && (
                <>
                  <div className="flex flex-col">
                    <button
                      onClick={() => setShowCoursesMenu(!showCoursesMenu)}
                      className={cn(
                        "px-4 py-3 rounded-md text-sm font-medium flex items-center justify-between",
                        location.pathname.includes('/courses') 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        Courses
                      </span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform", showCoursesMenu ? "rotate-180" : "")} />
                    </button>
                    
                    {showCoursesMenu && (
                      <div className="pl-4 mt-1 space-y-1">
                        {[ccieCourseItem].map((item, index) => (
                          <Link 
                            key={index}
                            to={item.path}
                            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                          >
                            <div className="p-1 rounded-full bg-primary/10 text-primary">
                              {renderCourseIcon(item.iconType)}
                            </div>
                            <span>{item.title}</span>
                          </Link>
                        ))}
                        <Link 
                          to="/courses"
                          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-muted transition-colors text-primary"
                        >
                          View All Courses
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to="/blogs" 
                    className={cn(
                      "px-4 py-3 rounded-md text-sm font-medium",
                      isActive('/blogs') 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      Blogs
                    </span>
                  </Link>
                  
                  <Link 
                    to="/about" 
                    className={cn(
                      "px-4 py-3 rounded-md text-sm font-medium",
                      isActive('/about') 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <Info className="h-4 w-4" />
                      About Us
                    </span>
                  </Link>
                </>
              )}
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium",
                    isActive('/admin') 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    Admin
                  </span>
                </Link>
              )}
              
              {/* Time Remaining - Enhanced for mobile */}
              {user && (
                <div className="px-4 py-3 rounded-md text-sm font-medium hover:bg-muted mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-muted-foreground">Time Remaining:</span>
                  </div>
                  <div className="mt-1 text-base font-medium">
                    <TimeRemainingDisplay />
                  </div>
                </div>
              )}
              
              {/* User Info */}
              <div className="px-4 py-3 border-t border-border mt-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-muted rounded-md text-sm font-medium hover:bg-muted/80"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
              
              {/* Theme Options */}
              <div className="mt-2 pt-2 border-t border-border">
                <p className="px-4 py-2 text-sm text-muted-foreground">Theme</p>
                <div className="flex gap-2 px-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md flex-1",
                      !isDarkMode ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <Sun className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md flex-1",
                      isDarkMode ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <Moon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className="flex items-center justify-center p-2 rounded-md flex-1 hover:bg-muted"
                  >
                    <Laptop className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;