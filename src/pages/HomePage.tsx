import React from 'react';
import HeroSection from '../components/HeroSection';
import ServiceSection from '../components/ServiceSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';/*changes*/
import { ContactSection } from '../components/ContactSection';
import { LabShowcaseSection } from '../components/LabShowcaseSection';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

const Rocket3DIcon = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-xl"
  >
    <ellipse cx="40" cy="70" rx="18" ry="6" fill={isDarkMode ? '#00D4FF' : '#0066FF'} opacity="0.25" />
    <path d="M40 10C45 20 60 40 40 60C20 40 35 20 40 10Z" fill={isDarkMode ? '#00D4FF' : '#0066FF'} />
    <circle cx="40" cy="35" r="7" fill="#fff" opacity="0.7" />
    <path d="M40 60C38 65 42 65 40 60Z" fill="#FFA500" />
    <path d="M40 60C42 65 38 65 40 60Z" fill="#FFA500" />
    <ellipse cx="40" cy="60" rx="4" ry="2" fill="#FFA500" opacity="0.7" />
  </svg>
);

const HomePage: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <main className={cn(
      "min-h-screen font-roboto",
      isDarkMode ? "bg-design-primary-background text-text-primary" : "bg-gray-50 text-gray-900"
    )} style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <HeroSection />

      {/* Custom Centered Gradient Section with 3D SVG Icon */}
      <section className={cn(
        "min-h-screen flex flex-col justify-center bg-gradient-section",
      )}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 md:gap-24">
          {/* Left: Content */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left max-w-2xl">
            <span className="inline-flex items-center justify-center rounded-full bg-transparent p-0 mb-6">
              <Rocket3DIcon isDarkMode={isDarkMode} />
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              Elevate your CCIE Lab experience with our customized solution
            </h2>
            <p className={cn(
              "text-lg max-w-xl mx-0 md:mx-0",
              isDarkMode ? "text-text-secondary" : "text-gray-800"
            )} style={{ fontWeight: 400 }}>
              Unlock exceptional learning outcomes by integrating tailored CCIE scenarios directly into your training platform. Build a fully-branded, immersive lab environment without relying on external servers or redirecting to third-party tools.
            </p>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
              alt="Modern technology innovation"
              className="rounded-3xl shadow-xl object-cover w-full max-w-lg h-[400px] md:h-[500px]"
              style={{ minWidth: 280 }}
            />
          </div>
        </div>
      </section>

      <ServiceSection />
      <TestimonialsSection />
      <FAQSection />{/*change*/}
      <ContactSection source="home-page" />
    </main>
  );
};

export default HomePage;
