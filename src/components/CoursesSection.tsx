import React from 'react';
import { Link } from 'react-router-dom';
import { ShineBorder } from './magicui';
import { AuroraText } from './magicui';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import { COURSE_NAMES, COURSE_PATHS } from '../lib/constants';

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
  const ccieCourse = {
    title: COURSE_NAMES.CCIE,
    image: "/course-logos/CCIE_Enterprise.png",
    link: COURSE_PATHS.CCIE,
    description: "Master the world of enterprise networking with our comprehensive CCIE EI resources. Gain a deep understanding of complex enterprise infrastructure technologies and stay ahead in your career."
  };

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
            Our Cisco Certification Courses
          </h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={cn(
              "rounded-xl bg-white shadow-lg border border-gray-200 flex flex-col items-center p-6 transition-all duration-300 hover:scale-105",
              isDarkMode && "bg-white/5 border-white/10 shadow-none"
            )}>
              <img src={ccieCourse.image} alt={ccieCourse.title} className="h-28 w-auto mb-4 object-contain" />
              <h3 className={cn("font-bold text-lg mb-2 text-center", isDarkMode ? "text-white" : "text-gray-900")}>{ccieCourse.title}</h3>
              <p className={cn("text-sm text-center mb-6", isDarkMode ? "text-white/70" : "text-gray-700")}>{ccieCourse.description}</p>
              <Link to={ccieCourse.link} className="mt-auto px-6 py-2 rounded-full bg-yellow-400 text-gray-900 font-semibold shadow hover:bg-yellow-500 transition-colors">Know More</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CoursesSection }; 