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
  Workflow
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RainbowButton } from './ui/RainbowButton';
import { Modal } from './ui/Modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

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

  const courseItems = [
    { 
      title: "CCIE Enterprise Infrastructure", 
      icon: <Sparkles className="h-5 w-5" />, 
      description: "Cisco Certified Internetwork Expert - Enterprise Infrastructure", 
      path: "/courses/ccie"
    },
    { 
      title: "CCIE Wireless", 
      icon: <Sparkles className="h-5 w-5" />, 
      description: "Cisco Certified Internetwork Expert - Wireless", 
      path: "/courses/ccie-wireless" 
    },
  
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3" 
          : "bg-transparent py-8"
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/deshmukh-logo.png" 
              alt="Deshmukh Systems logo" 
              className="h-28 w-28"
            />
          </Link> 

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="relative">
              <button 
                onClick={() => setShowCoursesMenu(!showCoursesMenu)}
                onMouseEnter={() => setShowCoursesMenu(true)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                  location.pathname.includes('/courses') 
                    ? "bg-primary text-primary-foreground" 
                    : scrolled 
                      ? "text-foreground hover:bg-muted" 
                      : isDarkMode ? "text-white hover:bg-white/10" : "text-foreground hover:bg-gray-100"
                )}
              >
                <BookOpen className="h-4 w-4" />
                Courses
                <ChevronDown className={cn("h-4 w-4 transition-transform", showCoursesMenu ? "rotate-180" : "")} />
              </button>
              
              {/* Mega Menu */}
              {showCoursesMenu && (
                <div 
                  className="absolute top-full left-0 mt-2 w-[600px] bg-background border border-border rounded-xl shadow-xl p-4 grid grid-cols-2 gap-2 z-50"
                  onMouseLeave={() => setShowCoursesMenu(false)}
                >
                  {courseItems.map((item, index) => (
                    <Link 
                      key={index}
                      to={item.path}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link 
              to="/about" 
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                isActive('/about') 
                  ? "bg-primary text-primary-foreground" 
                  : scrolled 
                    ? "text-foreground hover:bg-muted" 
                    : isDarkMode ? "text-white hover:bg-white/10" : "text-foreground hover:bg-gray-100"
              )}
            >
              <span className="flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                About Us
              </span>
            </Link>
          </nav>

          {/* Auth Buttons & Theme Toggle (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors",
                scrolled ? "hover:bg-muted" : isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100",
                scrolled ? "text-foreground" : isDarkMode ? "text-white" : "text-foreground"
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
                <button 
                  onClick={handleLoginClick}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    scrolled 
                      ? "text-foreground hover:bg-muted" 
                      : isDarkMode ? "text-white hover:bg-white/10" : "text-foreground hover:bg-gray-100"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <LogIn className="h-4 w-4" />
                    Login
                  </span>
                </button>
                
                <button onClick={handleRegisterClick} className="contents">
                  <RainbowButton asChild={true}>
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </span>
                  </RainbowButton>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-md transition-colors",
              scrolled ? "text-foreground hover:bg-muted" : isDarkMode ? "text-white hover:bg-white/10" : "text-foreground hover:bg-gray-100"
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
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
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
                    {courseItems.map((item, index) => (
                      <Link 
                        key={index}
                        to={item.path}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                      >
                        <div className="p-1 rounded-full bg-primary/10 text-primary">
                          {item.icon}
                        </div>
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
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
              
              {/* Auth Buttons (Mobile) */}
              {!user && (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                  <button 
                    onClick={handleLoginClick}
                    className="px-4 py-3 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <LogIn className="h-4 w-4" />
                      Login
                    </span>
                  </button>
                  
                  <button 
                    onClick={handleRegisterClick}
                    className="px-4 py-3 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </span>
                  </button>
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