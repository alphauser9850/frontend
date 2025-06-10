import React from 'react';
import { Link } from 'react-router-dom';
import { ShineBorder } from './magicui';
import { AuroraText } from './magicui';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

interface CourseCardProps {
  title: string;
  image: string;
  link: string;
  className?: string;
  featured?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, image, link, className, featured = false }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-105 group",
      featured ? "p-6" : "p-4",
      isDarkMode 
        ? "bg-white/5 backdrop-blur-sm border border-white/10" 
        : "bg-white shadow-lg border border-gray-100",
      className
    )}>
      <ShineBorder borderWidth={1.5} shineColor={["#6366f1", "#8b5cf6"]} duration={12} />
      
      <div className="flex flex-col items-center flex-grow">
        <img 
          src={image} 
          alt={`${title} certification`} 
          className={cn(
            "object-contain relative z-10 mx-auto",
            featured ? "w-full max-w-xs h-28 md:h-36 mb-3" : "w-full max-w-[140px] h-20 md:h-28 mb-2"
          )}
        />
        <h3 className={cn(
          "font-bold relative z-10 text-center",
          featured ? "text-lg md:text-xl mb-4" : "text-base md:text-lg mb-3",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>{title}</h3>
      </div>
      
      <Link 
        to={link}
        className={cn(
          "relative z-20 rounded-full font-medium transition-colors text-center block",
          featured ? "px-6 py-3 text-base" : "px-4 py-2 text-sm",
          isDarkMode 
            ? "bg-primary text-white hover:bg-primary/90" 
            : "bg-primary text-white hover:bg-primary/90"
        )}
      >
        Know More
      </Link>
    </div>
  );
};

const CoursesSection: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const courses = [
    {
      title: "CCNA R&S",
      image: "/course-logos/ccna_600.png",
      link: "/courses"
    },
    {
      title: "CCNP",
      image: "/course-logos/CCNP_Enterprise_large.png",
      link: "/courses"
    },
    {
      title: "CCIE Enterprise Infrastructure",
      image: "/course-logos/CCIE_Enterprise.png",
      link: "/courses/ccie",
      featured: true
    },
    {
      title: "CCIE Wireless",
      image: "/course-logos/CCNP_Enterprise Wireless.png",
      link: "/courses/ccie-wireless",
      featured: true
    },
    {
      title: "SDN (SD-WAN & SD-ACCESS)",
      image: "/course-logos/SDN.png",
      link: "/courses/sdn"
    }
  ];

  return (
    <section className={cn(
      "relative py-12",
      isDarkMode 
        ? "bg-gradient-to-b from-indigo-950/50 to-black" 
        : "bg-gradient-to-b from-gray-50 to-white"
    )}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Our <AuroraText>Cisco Certification</AuroraText> Courses
          </h2>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            isDarkMode ? "text-white/70" : "text-gray-600"
          )}>
            Comprehensive training programs designed to help you achieve Cisco certifications and advance your networking career.
          </p>
        </div>
        
        {/* Bento Grid Layout - Focused on EI and Wireless */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[280px]">
            {/* CCIE Enterprise Infrastructure - Large Featured Card (Left) */}
            <CourseCard 
              title={courses[2].title}
              image={courses[2].image}
              link={courses[2].link}
              className="md:col-span-3 md:row-span-2"
              featured={true}
            />
            
            {/* CCIE Wireless - Large Featured Card (Right) */}
            <CourseCard 
              title={courses[3].title}
              image={courses[3].image}
              link={courses[3].link}
              className="md:col-span-3 md:row-span-2"
              featured={true}
            />
            
            {/* CCNA R&S - Small Card (Bottom Left) */}
            <CourseCard 
              title={courses[0].title}
              image={courses[0].image}
              link={courses[0].link}
              className="md:col-span-2"
            />
            
            {/* CCNP - Small Card (Bottom Center) */}
            <CourseCard 
              title={courses[1].title}
              image={courses[1].image}
              link={courses[1].link}
              className="md:col-span-2"
            />
            
            {/* SDN (SD-WAN & SD-ACCESS) - Small Card (Bottom Right) */}
            <CourseCard 
              title={courses[4].title}
              image={courses[4].image}
              link={courses[4].link}
              className="md:col-span-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { CoursesSection }; 