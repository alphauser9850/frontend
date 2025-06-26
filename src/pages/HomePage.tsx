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
      "min-h-screen",
      isDarkMode ? "bg-design-primary-background text-text-primary" : "bg-gray-50 text-gray-900"
    )}>
      <HeroSection />

      {/* Custom Centered Gradient Section with 3D SVG Icon */}
      <section className={cn(
        "py-20 flex flex-col items-center justify-center text-center",
        "bg-gradient-section"
      )}>
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
          <span className="inline-flex items-center justify-center rounded-full bg-transparent p-0 mb-6">
            <Rocket3DIcon isDarkMode={isDarkMode} />
          </span>
          <h2 className="text-heading-1 font-bold mb-4 gradient-text">
            Elevate your CCIE Lab experience with our customized solution
          </h2>
          <p className={cn(
            "text-body max-w-xl mx-auto",
            isDarkMode ? "text-text-secondary" : "text-gray-800"
          )}>
            Unlock exceptional learning outcomes by integrating tailored CCIE scenarios directly into your training platform. Build a fully-branded, immersive lab environment without relying on external servers or redirecting to third-party tools.
          </p>
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
