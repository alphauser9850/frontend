import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourseStore, Module, Lesson } from '../store/courseStore';
import { useThemeStore } from '../store/themeStore';
import { BookOpen, ChevronRight, Clock, CheckCircle, ChevronDown, ChevronUp, Play, FileText, HelpCircle, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ShineBorder } from '../components/magicui';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentCourse, fetchCourseDetails, isLoading } = useCourseStore();
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId, fetchCourseDetails]);

  useEffect(() => {
    // Expand all modules by default
    if (currentCourse?.modules) {
      const expanded: Record<string, boolean> = {};
      currentCourse.modules.forEach(module => {
        expanded[module.id] = true;
      });
      setExpandedModules(expanded);
    }
  }, [currentCourse]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const isLessonCompleted = (lessonId: string) => {
    return currentCourse?.progress?.completed_lessons.includes(lessonId) || false;
  };

  const getTotalDuration = () => {
    if (!currentCourse?.modules) return 0;
    
    return currentCourse.modules.reduce((total, module) => 
      total + (module.lessons?.reduce((sum, lesson) => 
        sum + (lesson.duration || 0), 0) || 0), 0);
  };

  const getCompletionPercentage = () => {
    if (!currentCourse?.modules || !currentCourse?.progress) return 0;
    
    let totalLessons = 0;
    currentCourse.modules.forEach(module => {
      totalLessons += module.lessons?.length || 0;
    });
    
    if (totalLessons === 0) return 0;
    return Math.round((currentCourse.progress.completed_lessons.length / totalLessons) * 100);
  };

  const getLessonIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // Generate a beam color based on course ID
  const getBeamColor = () => {
    if (!currentCourse) return "from-blue-500/30 via-blue-500/80 to-blue-500/30";
    
    const beamColors = [
      "from-blue-500/30 via-blue-500/80 to-blue-500/30",
      "from-purple-500/30 via-purple-500/80 to-purple-500/30",
      "from-green-500/30 via-green-500/80 to-green-500/30",
      "from-amber-500/30 via-amber-500/80 to-amber-500/30",
      "from-pink-500/30 via-pink-500/80 to-pink-500/30",
      "from-indigo-500/30 via-indigo-500/80 to-indigo-500/30",
    ];
    
    const colorIndex = parseInt(currentCourse.id.slice(-1), 16) % beamColors.length;
    return beamColors[colorIndex];
  };

  if (isLoading) {
    return (
      <div className={cn("min-h-screen", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
        <div className="pt-16"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className={cn("mt-4", isDarkMode ? "text-gray-400" : "text-gray-600")}>Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className={cn("min-h-screen", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
        <div className="pt-16"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Course not found</h3>
              <p className={cn("mt-2 mb-6", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                The course you're looking for doesn't exist or you don't have access to it.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className={cn(
                  "px-4 py-2 rounded-md text-white transition-colors duration-200",
                  isDarkMode ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90"
                )}
              >
                Back to Dashboard
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();
  const totalLessons = currentCourse.modules?.reduce((total, module) => 
    total + (module.lessons?.length || 0), 0) || 0;

  return (
    <div className={cn("min-h-screen", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
      <div className="pt-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center transition-colors duration-200",
              isDarkMode ? "text-primary hover:text-primary/80" : "text-primary hover:text-primary/80"
            )}
          >
            <ChevronRight className="h-4 w-4 mr-1 rotate-180" /> Back to Dashboard
          </Link>
        </div>
        
        <Card 
          withBeam 
          beamClassName={getBeamColor()}
          beamDuration={10}
          className="mb-8 overflow-hidden"
        >
          <div className="relative h-48 md:h-56 overflow-hidden">
            {currentCourse.image_url ? (
              <img 
                src={currentCourse.image_url} 
                alt={currentCourse.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-r from-primary/20 to-primary/40">
                <BookOpen className="h-24 w-24 text-primary opacity-30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl font-bold text-white mb-2">{currentCourse.title}</h1>
              {currentCourse.description && (
                <p className="text-white/80 text-sm md:text-base max-w-3xl">{currentCourse.description}</p>
              )}
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className={cn(
                "flex items-center px-3 py-1 rounded-full text-sm",
                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
              )}>
                <Clock className="h-4 w-4 mr-2" />
                <span>{getTotalDuration()} minutes</span>
              </div>
              
              <div className={cn(
                "flex items-center px-3 py-1 rounded-full text-sm",
                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
              )}>
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{totalLessons} lessons</span>
              </div>
              
              <div className={cn(
                "flex items-center px-3 py-1 rounded-full text-sm",
                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
              )}>
                <Users className="h-4 w-4 mr-2" />
                <span>Beginner friendly</span>
              </div>
              
              {currentCourse.progress && (
                <div className="flex items-center ml-auto">
                  {completionPercentage === 100 ? (
                    <span className={cn(
                      "flex items-center px-3 py-1 rounded-full text-sm",
                      isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800"
                    )}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </span>
                  ) : (
                    <span className={cn(
                      "flex items-center px-3 py-1 rounded-full text-sm",
                      isDarkMode ? "bg-primary/20 text-primary-foreground" : "bg-primary/10 text-primary"
                    )}>
                      <span className="font-medium">{completionPercentage}%</span>
                      <span className="ml-2">complete</span>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {currentCourse.progress && (
              <div className={cn("w-full rounded-full h-2 mb-6", isDarkMode ? "bg-gray-700" : "bg-gray-200")}>
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    completionPercentage === 100 
                      ? "bg-green-500" 
                      : "bg-primary"
                  )}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          
          <div className="divide-y">
            {currentCourse.modules?.map((module: Module, index: number) => (
              <div key={module.id} className="border-b">
                <div 
                  className={cn(
                    "p-4 flex justify-between items-center cursor-pointer transition-colors duration-200",
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  )}
                  onClick={() => toggleModule(module.id)}
                >
                  <div>
                    <h3 className={cn("font-medium flex items-center", isDarkMode ? "text-white" : "text-gray-800")}>
                      <span className={cn(
                        "inline-block w-6 h-6 rounded-full text-center text-sm mr-2",
                        isDarkMode ? "bg-primary/20 text-primary-foreground" : "bg-primary/10 text-primary"
                      )}>
                        {index + 1}
                      </span>
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className={cn("text-sm mt-1 ml-8", isDarkMode ? "text-gray-400" : "text-gray-500")}>{module.description}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className={cn("text-sm mr-3", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      {module.lessons?.length || 0} lessons
                    </span>
                    {expandedModules[module.id] ? (
                      <ChevronUp className={cn("h-5 w-5", isDarkMode ? "text-gray-400" : "text-gray-500")} />
                    ) : (
                      <ChevronDown className={cn("h-5 w-5", isDarkMode ? "text-gray-400" : "text-gray-500")} />
                    )}
                  </div>
                </div>
                
                {expandedModules[module.id] && module.lessons && (
                  <div className={cn(isDarkMode ? "bg-gray-800/50" : "bg-gray-50")}>
                    {module.lessons.map((lesson: Lesson, lessonIndex: number) => (
                      <Link
                        key={lesson.id}
                        to={`/courses/${currentCourse.id}/lessons/${lesson.id}`}
                        className={cn(
                          "p-3 pl-8 flex items-center transition-colors duration-200",
                          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        )}
                      >
                        <div className="mr-3 flex-shrink-0">
                          {isLessonCompleted(lesson.id) ? (
                            <div className={cn(
                              "rounded-full p-1",
                              isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-500"
                            )}>
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className={cn(
                              "rounded-full p-1",
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            )}>
                              {getLessonIcon(lesson.content_type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className={isDarkMode ? "text-white" : "text-gray-800"}>
                            <span className={cn("mr-2 text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>{index + 1}.{lessonIndex + 1}</span>
                            <span className="text-sm">{lesson.title}</span>
                          </h4>
                          {lesson.description && (
                            <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>{lesson.description}</p>
                          )}
                        </div>
                        <div className={cn("text-xs flex items-center", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          {lesson.duration ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration} min
                            </>
                          ) : ''}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetailPage;