import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useCourseStore, Lesson, Module } from '../store/courseStore';
import { useThemeStore } from '../store/themeStore';
import Navbar from '../components/Navbar';
import { ChevronLeft, ChevronRight, CheckCircle, ArrowLeft, Clock, ChevronDown, ChevronUp, Play, FileText, Lock } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import PDFViewer from '../components/PDFViewer';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { currentCourse, fetchCourseDetails, markLessonComplete, isLoading } = useCourseStore();
  const { isDarkMode } = useThemeStore();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [nextLesson, setNextLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [prevLesson, setPrevLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId, fetchCourseDetails]);

  useEffect(() => {
    if (currentCourse && lessonId) {
      // Find current lesson and module
      let foundLesson: Lesson | null = null;
      let foundModule: Module | null = null;
      
      for (const module of currentCourse.modules || []) {
        const lesson = module.lessons?.find(l => l.id === lessonId) || null;
        if (lesson) {
          foundLesson = lesson;
          foundModule = module;
          
          // Auto-expand the module containing the current lesson
          setExpandedModules(prev => ({
            ...prev,
            [module.id]: true
          }));
          
          break;
        }
      }
      
      setCurrentLesson(foundLesson);
      setCurrentModule(foundModule);
      
      // Check if lesson is completed
      if (currentCourse.progress?.completed_lessons.includes(lessonId)) {
        setIsCompleted(true);
      } else {
        setIsCompleted(false);
      }
      
      // Find next and previous lessons
      if (currentCourse.modules) {
        const flatLessons: { moduleId: string; lessonId: string }[] = [];
        
        currentCourse.modules.forEach(module => {
          module.lessons?.forEach(lesson => {
            flatLessons.push({ moduleId: module.id, lessonId: lesson.id });
          });
        });
        
        const currentIndex = flatLessons.findIndex(item => item.lessonId === lessonId);
        
        if (currentIndex > 0) {
          setPrevLesson(flatLessons[currentIndex - 1]);
        } else {
          setPrevLesson(null);
        }
        
        if (currentIndex < flatLessons.length - 1) {
          setNextLesson(flatLessons[currentIndex + 1]);
        } else {
          setNextLesson(null);
        }
      }
    }
  }, [currentCourse, lessonId]);

  const handleComplete = async () => {
    if (courseId && lessonId && !isCompleted) {
      await markLessonComplete(lessonId, courseId);
      setIsCompleted(true);
    }
  };

  const handleVideoProgress = (state: { played: number }) => {
    setVideoProgress(state.played);
    
    // Mark as complete when 90% of the video is watched
    if (state.played > 0.9 && !isCompleted) {
      handleComplete();
    }
  };

  const navigateToLesson = (moduleId: string, lessonId: string) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const getTotalLessons = () => {
    let count = 0;
    currentCourse?.modules?.forEach(module => {
      count += module.lessons?.length || 0;
    });
    return count;
  };

  const getCompletedLessons = () => {
    return currentCourse?.progress?.completed_lessons.length || 0;
  };

  const calculateProgress = () => {
    const total = getTotalLessons();
    const completed = getCompletedLessons();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className={cn("min-h-screen", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
        <div className="pt-16"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className={cn("mt-4", isDarkMode ? "text-gray-300" : "text-gray-600")}>Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCourse || !currentLesson || !currentModule) {
    return (
      <div className={cn("min-h-screen", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
        <div className="pt-16"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={cn("text-center py-12 rounded-xl shadow-md", isDarkMode ? "bg-gray-800" : "bg-white")}>
            <h3 className={cn("mt-4 text-lg font-medium", isDarkMode ? "text-gray-100" : "text-gray-900")}>Lesson not found</h3>
            <p className={cn("mt-2 mb-6", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              The lesson you're looking for doesn't exist or you don't have access to it.
            </p>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="pt-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className={cn(
              "flex items-center font-medium",
              isDarkMode 
                ? "text-blue-400 hover:text-blue-300" 
                : "text-blue-600 hover:text-blue-800"
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Course
          </button>
          
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <span className={cn(
                "flex items-center px-3 py-1 rounded-full text-sm",
                isDarkMode 
                  ? "bg-green-900/30 text-green-400" 
                  : "bg-green-100 text-green-800"
              )}>
                <CheckCircle className="h-4 w-4 mr-1" /> Completed
              </span>
            ) : (
              <button
                onClick={handleComplete}
                className={cn(
                  "flex items-center px-3 py-1 rounded-full text-sm",
                  isDarkMode 
                    ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50" 
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                )}
              >
                Mark as Complete
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Course Outline */}
          <div className={cn("w-80 border-r flex flex-col h-[calc(100vh-64px)] overflow-hidden", 
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <div className={cn("p-4 border-b", isDarkMode ? "border-gray-700" : "border-gray-200")}>
              <Link
                to={`/courses/${courseId}`}
                className="flex items-center text-indigo-600 hover:text-indigo-400 transition-colors duration-200 mb-3"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Course
              </Link>
              <h2 className={cn("text-lg font-bold truncate", isDarkMode ? "text-white" : "text-gray-900")}>{currentCourse.title}</h2>
              
              {/* Progress bar */}
              <div className="mt-3">
                <div className={cn("flex justify-between text-sm mb-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  <span>Your progress</span>
                  <span>{getCompletedLessons()} of {getTotalLessons()} lessons</span>
                </div>
                <div className={cn("h-2 rounded-full overflow-hidden", isDarkMode ? "bg-gray-700" : "bg-gray-200")}>
                  <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {currentCourse.modules?.map((module) => (
                <div key={module.id} className={cn("border-b", isDarkMode ? "border-gray-700" : "border-gray-200")}>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={cn(
                      "w-full px-4 py-3 flex justify-between items-center transition-colors duration-200",
                      isDarkMode 
                        ? "hover:bg-gray-700" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className={cn("flex-1 text-left font-medium", isDarkMode ? "text-gray-100" : "text-gray-900")}>{module.title}</div>
                    {expandedModules[module.id] ? (
                      <ChevronUp className={cn("h-5 w-5", isDarkMode ? "text-gray-400" : "text-gray-500")} />
                    ) : (
                      <ChevronDown className={cn("h-5 w-5", isDarkMode ? "text-gray-400" : "text-gray-500")} />
                    )}
                  </button>
                  
                  {expandedModules[module.id] && module.lessons && (
                    <div className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.id === lessonId;
                        const isLessonCompleted = currentCourse.progress?.completed_lessons.includes(lesson.id);
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(module.id, lesson.id)}
                            className={cn(
                              "w-full px-4 py-3 flex items-center text-left border-l-4 transition-colors duration-200",
                              isActive 
                                ? "border-indigo-600 bg-indigo-900/20" 
                                : "border-transparent",
                              isDarkMode
                                ? (isActive ? "" : "hover:bg-gray-600")
                                : (isActive ? "bg-indigo-50" : "hover:bg-gray-100")
                            )}
                          >
                            <div className="mr-3 flex-shrink-0">
                              {isLessonCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : lesson.content_type === 'video' ? (
                                <Play className={cn("h-5 w-5", isDarkMode ? "text-gray-300" : "text-gray-400")} />
                              ) : (
                                <FileText className={cn("h-5 w-5", isDarkMode ? "text-gray-300" : "text-gray-400")} />
                              )}
                            </div>
                            <div className="flex-1 flex flex-col">
                              <span className={cn(
                                "text-sm font-medium",
                                isActive 
                                  ? "text-indigo-400" 
                                  : isDarkMode ? "text-gray-200" : "text-gray-900"
                              )}>
                                {lesson.title}
                              </span>
                              {lesson.duration && (
                                <span className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>{lesson.duration} min</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className={cn("rounded-xl shadow-md overflow-hidden mb-6", isDarkMode ? "bg-gray-800" : "bg-white")}>
                <div className={cn("p-6 border-b", isDarkMode ? "border-gray-700" : "border-gray-200")}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>{currentLesson.title}</h1>
                      {currentLesson.description && (
                        <p className={cn("mt-2", isDarkMode ? "text-gray-300" : "text-gray-600")}>{currentLesson.description}</p>
                      )}
                    </div>
                    
                    {currentLesson.duration && (
                      <div className={cn(
                        "flex items-center px-3 py-1 rounded-full",
                        isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                      )}>
                        <Clock className="h-5 w-5 mr-1" />
                        <span>{currentLesson.duration} min</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  {currentLesson.content_type === 'video' && (
                    <div className="w-full max-w-5xl mx-auto mb-6 rounded-lg overflow-hidden shadow-lg relative" style={{ paddingTop: '56.25%' }}>
                      {currentLesson.content_url ? (
                        <div className="absolute inset-0">
                          <VideoPlayer 
                            url={currentLesson.content_url}
                            title={currentLesson.title}
                            onComplete={handleComplete}
                            videoMetadata={(currentLesson as any).video_metadata}
                          />
                        </div>
                      ) : (
                        <div className={cn(
                          "flex items-center justify-center h-full",
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        )}>
                          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>No video URL provided</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {currentLesson.content_type === 'document' && (currentLesson as any).pdf_url && (
                    <div className="mb-6">
                      <PDFViewer 
                        pdfUrl={(currentLesson as any).pdf_url}
                        title={currentLesson.title}
                        onComplete={handleComplete}
                      />
                    </div>
                  )}
                  
                  {currentLesson.content && (
                    <div className={cn(
                      "prose max-w-none",
                      isDarkMode ? "prose-invert" : ""
                    )}>
                      <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                {prevLesson ? (
                  <button
                    onClick={() => navigateToLesson(prevLesson.moduleId, prevLesson.lessonId)}
                    className={cn(
                      "px-4 py-2 border rounded-md flex items-center transition-colors duration-200",
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" 
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous Lesson
                  </button>
                ) : (
                  <div></div>
                )}
                
                {nextLesson ? (
                  <button
                    onClick={() => navigateToLesson(nextLesson.moduleId, nextLesson.lessonId)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center transition-colors duration-200"
                  >
                    Next Lesson
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                ) : (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center transition-colors duration-200"
                  >
                    Finish Course
                    <CheckCircle className="h-5 w-5 ml-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;