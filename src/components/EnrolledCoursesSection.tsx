import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore, Course } from '../store/courseStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { BookOpen, ArrowRight, Clock, Award } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import { ShineBorder } from './magicui';
import { useAuthStore } from '../store/authStore';

interface EnrolledCourseCardProps {
  course: Course;
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ course }) => {
  const { isDarkMode } = useThemeStore();
  const progress = course.progress?.completed_lessons.length || 0;
  const totalLessons = course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 1;
  const progressPercentage = Math.round((progress / totalLessons) * 100);
  
  // Generate a random beam color for each course
  const beamColors = [
    "from-blue-500/30 via-blue-500/80 to-blue-500/30",
    "from-purple-500/30 via-purple-500/80 to-purple-500/30",
    "from-green-500/30 via-green-500/80 to-green-500/30",
    "from-amber-500/30 via-amber-500/80 to-amber-500/30",
    "from-pink-500/30 via-pink-500/80 to-pink-500/30",
    "from-indigo-500/30 via-indigo-500/80 to-indigo-500/30",
  ];
  
  // Use course id to deterministically select a beam color
  const colorIndex = parseInt(course.id.slice(-1), 16) % beamColors.length;
  const beamColor = beamColors[colorIndex];

  return (
    <div className="relative group">
      <Card 
        withBeam 
        beamClassName={beamColor}
        beamDuration={10}
        className="h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden h-32 rounded-t-lg">
            <img 
              src={course.image_url || `https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60`} 
              alt={`${course.title} - Enrolled CCIE Enterprise Infrastructure Course`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
              <span className="text-white text-sm font-medium flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                {course.modules?.reduce((total, module) => 
                  total + (module.lessons?.reduce((t, lesson) => t + (lesson.duration || 0), 0) || 0), 0) || 0} hrs
              </span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                progressPercentage === 100 
                  ? "bg-green-500/20 text-green-200" 
                  : progressPercentage > 50 
                    ? "bg-amber-500/20 text-amber-200" 
                    : "bg-blue-500/20 text-blue-200"
              )}>
                {progressPercentage === 100 ? (
                  <span className="flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Completed
                  </span>
                ) : (
                  `${progressPercentage}% Complete`
                )}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className={cn(
              "text-lg font-semibold mb-2 line-clamp-1",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {course.title}
            </h3>
            
            <p className={cn(
              "text-sm mb-4 line-clamp-2 h-10",
              isDarkMode ? "text-white/70" : "text-gray-600"
            )}>
              {course.description || `Learn the fundamentals of ${course.title} certification.`}
            </p>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mb-4">
              <div 
                className={cn(
                  "h-full rounded-full",
                  progressPercentage === 100 
                    ? "bg-green-500" 
                    : progressPercentage > 50 
                      ? "bg-amber-500" 
                      : "bg-blue-500"
                )}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <Link 
              to={`/courses/${course.id}`}
              className={cn(
                "flex items-center justify-center w-full py-2 rounded-lg text-sm font-medium transition-colors",
                isDarkMode 
                  ? "bg-primary/20 text-primary-foreground hover:bg-primary/30" 
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <span>Continue Learning</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
      <ShineBorder className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100" />
    </div>
  );
};

const EnrolledCoursesSection: React.FC = () => {
  const { courses, fetchCourses, isLoading } = useCourseStore();
  const { isDarkMode } = useThemeStore();
  const { isAdmin } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    // Filter courses that have real progress (user is enrolled)
    // Only include courses with actual progress data, not mock data
    const enrolled = courses.filter(course => 
      course.progress && 
      course.progress.id && 
      !course.progress.id.startsWith('progress-')
    );
    setEnrolledCourses(enrolled);
  }, [courses]);

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Your Enrolled Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className={isDarkMode ? "mt-2 text-white/70" : "mt-2 text-gray-600"}>Loading your courses...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (enrolledCourses.length === 0) {
    return null; // Don't show the section if no enrolled courses
  }

  return (
    <Card 
      className="mt-8"
      withBeam 
      beamDuration={8}
      beamClassName="from-transparent via-primary/40 to-transparent"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          Your Enrolled Courses
        </CardTitle>
        {isAdmin && (
          <div className="text-sm text-gray-500">
            <span className="italic">Note: Only admins can assign courses to users</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <EnrolledCourseCard key={course.id} course={course} />
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/dashboard"
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isDarkMode 
                ? "bg-primary/20 text-primary-foreground hover:bg-primary/30" 
                : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrolledCoursesSection; 