import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { CoursesSection } from '../components/CoursesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';/*changes*/
import { ContactSection } from '../components/ContactSection';
import { LabShowcaseSection } from '../components/LabShowcaseSection';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';


const HomePage: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    
  
    <main className={cn(
      "min-h-screen",
      isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
    )}>
      <HeroSection />
      <CoursesSection />
      <LabShowcaseSection />
      <TestimonialsSection />
      <FAQSection />{/*change*/}
      <ContactSection source="home-page" />
      </main>
       
  );
};

export default HomePage;
