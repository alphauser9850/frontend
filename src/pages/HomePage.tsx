import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import ServiceSection from "../components/ServiceSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { FAQSection } from "../components/FAQSection";
import { ContactSection } from "../components/ContactSection";
import { LabShowcaseSection } from "../components/LabShowcaseSection";
import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";
import { Helmet } from "react-helmet-async";


const HomePage: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // ✅ Use fallback theme on SSR to avoid mismatch
  const themeClass = mounted
    ? isDarkMode
      ? "bg-design-primary-background text-text-primary"
      : "bg-gray-50 text-gray-900"
    : "bg-gray-50 text-gray-900"; // fallback to light on SSR

  const paragraphClass = mounted
    ? isDarkMode
      ? "text-text-secondary"
      : "text-gray-800"
    : "text-gray-800";
     const headingClass = mounted
    ? isDarkMode
      ? "gradient-text"
      : ""
    : "gradient-text";
  return (
    <main
      className={cn("min-h-screen font-roboto", themeClass)}
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <Helmet>
        <title>CCIE Training and Certification | CCIELab.Net</title>
        <meta
          name="description"
          content=" Master the CCIE Lab and Pass your Certification Exam with Expert Bootcamps, 24/7 Rack Access, Dedicated Instructor Support, and Real-Time Guidance."
        />
      </Helmet>
      <HeroSection />

      <section className="min-h-screen flex flex-col justify-center bg-gradient-section">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left max-w-2xl"> 
            <h2
              className={cn("text-4xl md:text-5xl font-bold mb-4",headingClass )}
              style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Elevate your CCIE Lab experience with our customized solution
            </h2>
            <p
              className={cn("text-lg max-w-xl mx-0 md:mx-0", paragraphClass)}
              style={{ fontWeight: 400 }}
            >
              Unlock exceptional learning outcomes by integrating tailored CCIE
              scenarios directly into your training platform. Build a
              fully-branded, immersive lab environment without relying on
              external servers or redirecting to third-party tools.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
              alt="CCIE Enterprise Infrastructure Lab Training - Modern Technology Innovation"
              className="rounded-3xl shadow-xl object-cover w-full max-w-lg h-[400px] md:h-[500px]"
              style={{ minWidth: 280 }}
            />
          </div>
        </div>
      </section>

      <ServiceSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection source="home-page" />
    </main>
  );
};

export default HomePage;
