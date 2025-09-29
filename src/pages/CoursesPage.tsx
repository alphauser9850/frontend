import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourseStore, Course } from '../store/courseStore';
import { BookOpen, Clock, Users, Star, Search, AlertCircle } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { Card } from '../components/ui/Card';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import Breadcrumbs from '../components/Breadcrumbs';

// Extended course interface for display purposes
interface ExtendedCourse extends Course {
  duration?: number;
  enrolled_count?: number;
  rating?: number;
}

const CoursesPage: React.FC = () => {
  const { courses, fetchCourses, fetchCourseDetails, isLoading } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Mock data for display purposes - in a real app, this would come from the API
  const getExtendedCourseData = (course: Course): ExtendedCourse => {
    return {
      ...course,
      duration: 8, // Mock duration in hours
      enrolled_count: Math.floor(Math.random() * 500) + 50, // Mock enrolled count
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Mock rating between 3.0 and 5.0
    };
  };

  // Navigate directly to the first lesson of a course
  const navigateToFirstLesson = async (courseId: string) => {
    setLoadingCourseId(courseId);
    try {
      const courseDetails = await fetchCourseDetails(courseId);
      
      if (courseDetails && courseDetails.modules && courseDetails.modules.length > 0) {
        const firstModule = courseDetails.modules[0];
        
        if (firstModule.lessons && firstModule.lessons.length > 0) {
          const firstLesson = firstModule.lessons[0];
          navigate(`/courses/${courseId}/lessons/${firstLesson.id}`);
          return;
        }
      }
      
      // If no lessons found, fall back to course detail page
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error('Error navigating to first lesson:', error);
      navigate(`/courses/${courseId}`);
    } finally {
      setLoadingCourseId(null);
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Courses' }
        ]} />
        <h1 className="text-2xl font-bold">Available Courses</h1>
        <p className={isDarkMode ? "text-white/70 mt-1" : "text-gray-600 mt-1"}>
          Browse and enroll in networking courses
        </p>
      </div>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={isDarkMode ? "h-5 w-5 text-white/50" : "h-5 w-5 text-gray-400"} />
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "pl-10 pr-4 py-2 w-full rounded-md shadow-sm focus:ring-primary focus:border-primary",
            isDarkMode 
              ? "bg-white/10 border border-white/20 text-white placeholder-white/40" 
              : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
          )}
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className={isDarkMode ? "mt-2 text-white/70" : "mt-2 text-gray-600"}>
            Loading courses...
          </p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const extendedCourse = getExtendedCourseData(course);
            const isLoading = loadingCourseId === course.id;
            
            return (
              <div 
                key={course.id} 
                className="block cursor-pointer"
                onClick={() => !isLoading && navigateToFirstLesson(course.id)}
              >
                <Card 
                  className={cn(
                    "overflow-hidden transition-shadow duration-300 h-full",
                    isLoading ? "opacity-70" : "hover:shadow-lg"
                  )}
                  withBeam
                  beamDuration={10}
                  beamClassName="from-transparent via-purple-500/30 to-transparent"
                >
                  <div className="h-48 bg-primary relative">
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                    {course.image_url ? (
                      <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark">
                        <BookOpen className="h-16 w-16 text-white opacity-75" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className={isDarkMode ? "text-lg font-semibold text-white mb-2" : "text-lg font-semibold text-gray-900 mb-2"}>
                      {course.title}
                    </h3>
                    <p className={isDarkMode ? "text-white/70 text-sm mb-4 line-clamp-2" : "text-gray-600 text-sm mb-4 line-clamp-2"}>
                      {course.description || 'No description available'}
                    </p>
                    <div className={cn(
                      "flex items-center justify-between text-sm",
                      isDarkMode ? "text-white/50" : "text-gray-500"
                    )}>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{extendedCourse.duration} hours</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{extendedCourse.enrolled_count} enrolled</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>{extendedCourse.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <Card 
          className="text-center py-8"
          withBeam
          beamDuration={8}
          beamClassName="from-transparent via-red-500/30 to-transparent"
        >
          <AlertCircle className={isDarkMode ? "h-12 w-12 text-white/40 mx-auto" : "h-12 w-12 text-gray-400 mx-auto"} />
          <h3 className={isDarkMode ? "mt-2 text-lg font-medium text-white" : "mt-2 text-lg font-medium text-gray-900"}>
            No courses found
          </h3>
          <p className={isDarkMode ? "mt-1 text-white/50" : "mt-1 text-gray-500"}>
            {searchTerm ? 'No courses match your search criteria.' : 'There are no available courses at the moment.'}
          </p>
        </Card>
      )}
    </PageWrapper>
  );
};

export default CoursesPage;