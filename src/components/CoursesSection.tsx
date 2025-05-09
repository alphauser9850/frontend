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
}

const CourseCard: React.FC<CourseCardProps> = ({ title, image, link }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden flex flex-col items-center p-6 transition-all duration-300 hover:scale-105",
      isDarkMode 
        ? "bg-white/5 backdrop-blur-sm border border-white/10" 
        : "bg-white shadow-lg border border-gray-100"
    )}>
      <ShineBorder borderWidth={1.5} shineColor={["#6366f1", "#8b5cf6"]} duration={12} />
      <img 
        src={image} 
        alt={`${title} certification`} 
        className="w-48 h-48 object-contain mb-6"
      />
      <h3 className={cn(
        "text-xl font-bold mb-4",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>{title}</h3>
      <Link 
        to={link}
        className="px-6 py-2 bg-primary/80 hover:bg-primary text-white rounded-full font-medium transition-colors"
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
      image: "/ccna.jpg",
      link: "/courses/ccna"
    },
    {
      title: "CCNP",
      image: "/ccnp.jpg",
      link: "/courses/ccnp"
    },
    {
      title: "CCIE Enterprise Infrastructure",
      image: "/ccie-ei.jpg",
      link: "/courses/ccie"
    },
    {
      title: "CCIE Wireless",
      image: "/ccie-wireless.jpg",
      link: "/courses/ccie-wireless"
    },
    {
      title: "SD-WAN",
      image: "/sd wan.jpg",
      link: "/courses/sd-wan"
    },
    {
      title: "SD-ACCESS",
      image: "/sdaccess.jpg",
      link: "/courses/sd-access"
    }
  ];

  return (
    <section className={cn(
      "relative py-20",
      isDarkMode 
        ? "bg-gradient-to-b from-indigo-950/50 to-black" 
        : "bg-gradient-to-b from-gray-50 to-white"
    )}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Our <AuroraText>Certification</AuroraText> Courses
          </h2>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            isDarkMode ? "text-white/70" : "text-gray-600"
          )}>
            Comprehensive training programs designed to help you achieve Cisco certifications and advance your networking career.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {courses.map((course, index) => (
            <CourseCard 
              key={index}
              title={course.title}
              image={course.image}
              link={course.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { CoursesSection }; 