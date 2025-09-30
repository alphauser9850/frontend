"use client";

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { AnimatedDotPattern, AuroraText } from './magicui';
import { 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  Moon, 
  Sun,
  BookOpen,
  FileText,
  Info,
  Youtube,
  Linkedin,
  Instagram,
  Twitter,
  Sparkles,
  ChevronDown,
  Network,
  Server,
  Layers,
  Globe,
  Workflow,
  Shield,
  Target,
  Users,
  Briefcase,
  Heart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RainbowButton } from './ui/RainbowButton';
import { Modal } from './ui/Modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { COURSE_NAMES, COURSE_DESCRIPTIONS, COURSE_PATHS } from '../lib/constants';

const Header: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { isDarkMode, setTheme } = useThemeStore();

  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCoursesMenu, setShowCoursesMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('isDarkMode',isDarkMode)
  }, []);

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
    setIsMenuOpen(false);
    setShowCoursesMenu(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  // Only show CCIE Enterprise in the courses menu
  const ccieCourseItem = {
    title: COURSE_NAMES.CCIE,
    icon: <Sparkles className="h-5 w-5" />, 
    description: COURSE_DESCRIPTIONS.CCIE,
    path: COURSE_PATHS.CCIE
  };

  // SSR-safe dark mode check
  const themeClass = mounted && isDarkMode;

  return (
    <header 
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-surface/95 backdrop-blur-md border-b border-border-subtle shadow-subtle py-3" 
          : "bg-surface py-8",
        themeClass ? "dark" : "light"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Nav */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link to="/" className="flex items-center gap-4 group logo">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-purple-600/25 to-blue-600/25 rounded-xl blur-lg scale-110 group-hover:scale-125 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-pink-500/20 to-yellow-400/20 rounded-xl blur-xl scale-115 group-hover:scale-130 transition-all duration-700"></div>
                <div className={cn(
                  "relative h-24 w-24 rounded-xl border flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300",
                  themeClass ? "bg-gray-800 border-gray-700" : "bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/25"
                )}>
                  <img 
                    src="/ccielab.net logo.jpeg" 
                    alt="CCIELAB.NET Logo" 
                    className="h-20 w-20 object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl">
                  <AuroraText>CCIELAB.NET</AuroraText>
                </span>
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                  Advanced CCIE Training
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 ml-6 text-base font-roboto">
              <div className="relative">
                <button 
                  onClick={() => setShowCoursesMenu(!showCoursesMenu)}
                  onMouseEnter={() => setShowCoursesMenu(true)}
                  className={cn(
                    "px-4 py-2 rounded-full font-bold flex items-center gap-1.5",
                    location.pathname.includes('/courses') 
                      ? "bg-design-primary-accent text-white" 
                      : themeClass ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  Courses
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showCoursesMenu ? "rotate-180" : "")} />
                </button>
                {showCoursesMenu && (
                  <div 
                    className={cn(
                      "absolute top-full left-0 mt-2 w-[600px] border rounded-xl shadow-large p-4 grid grid-cols-2 gap-2 z-50",
                      themeClass ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
                    )}
                    onMouseLeave={() => setShowCoursesMenu(false)}
                  >
                    {[ccieCourseItem].map((item, index) => (
                      <Link 
                        key={index}
                        to={item.path}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg hover:bg-opacity-70 transition-colors",
                          themeClass ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-900"
                        )}
                      >
                        <div className="p-2 rounded-full bg-design-primary-accent/10 text-design-primary-accent">
                          {item.icon}
                        </div>
                        <div>
                          <h3>{item.title}</h3>
                          <p className={themeClass ? "text-gray-400" : "text-gray-600"}>{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/about" className={cn(
                "px-4 py-2 rounded-full font-bold transition-colors",
                location.pathname === "/about"
                  ? "bg-design-primary-accent text-white"
                  : themeClass ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
              )}>
                About Us
              </Link>
               <Link 
                to="/contact" 
                className={cn(
                  "px-4 py-2 rounded-full font-bold transition-colors text-base",
                 location.pathname === "/contact"
                  ? "bg-design-primary-accent text-white"
                  : themeClass ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
                )}
              >
                <span className="flex items-center gap-1.5">
                  Contact Us
                </span>
              </Link>
              <Link to="/blog" className={cn(
                "px-4 py-2 rounded-full font-bold transition-colors",
                location.pathname === "/blog"
                  ? "bg-design-primary-accent text-white"
                  : themeClass ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
              )}>
                Blog
              </Link>
            </nav>
          </div>

          {/* Right: Theme + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full hover:bg-gray-200",
                themeClass ? "text-white hover:bg-gray-700" : "text-gray-900"
              )}
              aria-label="Toggle theme"
            >
              {themeClass ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {!user && (
              <>
                <a href="https://ent.ccielab.net/login" target="_blank" rel="noopener noreferrer"
                  className={cn("px-4 py-2 rounded-full font-bold hover:bg-gray-200", themeClass ? "text-white hover:bg-gray-700" : "text-gray-900")}>
                  <LogIn className="h-4 w-4 inline-block mr-1" />
                  Login
                </a>
                <a href="https://ent.ccielab.net/register" target="_blank" rel="noopener noreferrer" className="contents">
                  <RainbowButton asChild={true}>
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </span>
                  </RainbowButton>
                </a>
              </>
            )}
             <a
      href="tel:+18777072243"
      className="px-10 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
    >
      Call Us
    </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn("md:hidden p-2 rounded-md", themeClass ? "text-white" : "text-gray-900")}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-b border-border-subtle shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              <div className="flex flex-col">
                <button
                  onClick={() => setShowCoursesMenu(!showCoursesMenu)}
                  className={cn(
                    "px-4 py-3 rounded-md font-bold flex items-center justify-between text-text-primary hover:bg-surface-variant text-base",
                    location.pathname.includes('/courses') 
                      ? "bg-design-primary-accent/10 text-design-primary-accent" 
                      : ""
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    Courses
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showCoursesMenu ? "rotate-180" : "")}/>
                </button>
                {showCoursesMenu && (
                  <div className="pl-4 mt-1 space-y-1">
                    {[ccieCourseItem].map((item, index) => (
                      <Link 
                        key={index}
                        to={item.path}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-surface-variant transition-colors text-text-primary"
                      >
                        <div className="p-1 rounded-full bg-design-primary-accent/10 text-design-primary-accent">
                          {item.icon}
                        </div>
                        <span className="text-text-primary">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link 
                to="/about" 
                className={cn(
                  "px-4 py-3 rounded-md font-bold text-text-primary hover:bg-surface-variant text-base",
                  isActive('/about') 
                    ? "bg-design-primary-accent/10 text-design-primary-accent" 
                    : ""
                )}
              >
                <span className="flex items-center gap-1.5"> 
                  About Us
                </span>
              </Link>
                <Link 
                to="/blog" 
                className={cn(
                  "px-4 py-3 rounded-md font-bold text-text-primary hover:bg-surface-variant text-base",
                  isActive('/blog') 
                    ? "bg-design-primary-accent/10 text-design-primary-accent" 
                    : ""
                )}
              >
                <span className="flex items-center gap-1.5"> 
                  Blogs
                </span>
              </Link>
              {/* Auth Buttons (Mobile) */}
              {!user && (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border-subtle">
                  <a href="https://ent.ccielab.net/login" target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-md font-bold hover:bg-surface-variant transition-colors text-text-primary text-base">
                    <span className="flex items-center gap-1.5">
                      <LogIn className="h-4 w-4" />
                      Login
                    </span>
                  </a>
                  <a href="https://ent.ccielab.net/register" target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-md bg-design-primary-accent text-white hover:bg-accent-hover transition-colors text-base">
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </span>
                  </a>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login to Your Account"
      >
        <LoginForm 
          onSuccess={handleAuthSuccess} 
          onRegisterClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      </Modal>
      
      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Create Your Account"
      >
        <RegisterForm 
          onSuccess={handleAuthSuccess}
          onLoginClick={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      </Modal>
    </header>
  );
};

export default Header;
