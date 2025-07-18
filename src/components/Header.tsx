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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCoursesMenu, setShowCoursesMenu] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowCoursesMenu(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleTheme = () => {
    // Toggle between light and dark mode
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

  return (
    <header 
      className={cn(
        "top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-surface border-b border-border-subtle shadow-subtle py-3" 
          : "bg-surface py-8"
      )}
    >
      {/* Remove animated dot pattern for solid background */}
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center gap-8 flex-shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/new-logo-1.png" alt="CCIE Lab Logo" className="h-16 w-16 rounded-xl object-contain bg-surface p-1 shadow-medium" />
              <span className={cn(
                "font-bold text-2xl transition-colors text-text-primary"
              )}>
                <AuroraText>CCIE LAB</AuroraText>
              </span>
            </Link>
            {/* Navigation (left, next to logo) */}
            <nav className="hidden md:flex items-center gap-6 ml-6 text-base font-roboto" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
              <div className="relative">
                <button 
                  onClick={() => setShowCoursesMenu(!showCoursesMenu)}
                  onMouseEnter={() => setShowCoursesMenu(true)}
                  className={cn(
                    "px-4 py-2 rounded-full font-bold transition-colors flex items-center gap-1.5 text-base",
                    location.pathname.includes('/courses') 
                      ? "bg-design-primary-accent text-white" 
                      : "text-text-primary hover:bg-surface-variant"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  Courses
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showCoursesMenu ? "rotate-180" : "")} />
                </button>
                {/* Mega Menu */}
                {showCoursesMenu && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-[600px] bg-surface border border-border-subtle rounded-xl shadow-large p-4 grid grid-cols-2 gap-2 z-50"
                    onMouseLeave={() => setShowCoursesMenu(false)}
                  >
                    {[ccieCourseItem].map((item, index) => (
                      <Link 
                        key={index}
                        to={item.path}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-variant transition-colors"
                      >
                        <div className="p-2 rounded-full bg-design-primary-accent/10 text-design-primary-accent">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">{item.title}</h3>
                          <p className="text-sm text-text-secondary">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link 
                to="/about" 
                className={cn(
                  "px-4 py-2 rounded-full font-bold transition-colors text-base",
                  isActive('/about') 
                    ? "bg-design-primary-accent text-white" 
                    : "text-text-primary hover:bg-surface-variant"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  About Us
                </span>
              </Link>
              <Link 
                to="/contact" 
                className={cn(
                  "px-4 py-2 rounded-full font-bold transition-colors text-base",
                  isActive('/contact') 
                    ? "bg-design-primary-accent text-white" 
                    : "text-text-primary hover:bg-surface-variant"
                )}
              >
                <span className="flex items-center gap-1.5">
                  Contact Us
                </span>
              </Link>
              <Link 
                to="/blog" 
                className={cn(
                  "px-4 py-2 rounded-full font-bold transition-colors text-base",
                  isActive('/blog') 
                    ? "bg-design-primary-accent text-white" 
                    : "text-text-primary hover:bg-surface-variant"
                )}
              >
                <span className="flex items-center gap-1.5">
                  Blog
                </span>
              </Link>
            </nav>
          </div>
          {/* Right: Theme Toggle, Login, Register */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors hover:bg-surface-variant text-text-primary"
              )}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            {!user && (
              <>
                <a href="https://ent.ccielab.net/login" target="_blank" rel="noopener noreferrer" className={cn(
                  "px-4 py-2 rounded-full font-bold transition-colors text-base text-text-primary hover:bg-surface-variant"
                )}>
                  <span className="flex items-center gap-1.5">
                    <LogIn className="h-4 w-4" />
                    Login
                  </span>
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
          </div>
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-md transition-colors text-text-primary hover:bg-surface-variant"
            )}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border-subtle">
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
                  <Info className="h-4 w-4" />
                  About Us
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