import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore, Course, Module, Lesson } from '../store/courseStore';
import Navbar from '../components/Navbar';
import { ArrowLeft, Save, Plus, Trash, Edit, ChevronDown, ChevronUp, GripVertical, Play, FileText, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ModuleFormData {
  id?: string;
  title: string;
  description: string;
  order: number;
}

interface LessonFormData {
  id?: string;
  title: string;
  description: string;
  content_type: 'video' | 'document' | 'quiz';
  content_url: string;
  content: string;
  order: number;
  duration: number;
}

const CourseEditorPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentCourse, fetchCourseDetails, createCourse, updateCourse, createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson, isLoading } = useCourseStore();
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: '',
    description: '',
    image_url: '',
    is_published: false
  });
  const [modules, setModules] = useState<(Module & { isOpen?: boolean })[]>([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleFormData, setModuleFormData] = useState<ModuleFormData>({
    title: '',
    description: '',
    order: 0
  });
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [lessonFormData, setLessonFormData] = useState<LessonFormData>({
    title: '',
    description: '',
    content_type: 'video',
    content_url: '',
    content: '',
    order: 0,
    duration: 0
  });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const navigate = useNavigate();
  const isNewCourse = !courseId;

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId, fetchCourseDetails]);

  useEffect(() => {
    if (currentCourse && courseId) {
      setCourseData({
        title: currentCourse.title,
        description: currentCourse.description || '',
        image_url: currentCourse.image_url || '',
        is_published: currentCourse.is_published
      });
      
      if (currentCourse.modules) {
        setModules(currentCourse.modules.map(module => ({
          ...module,
          isOpen: true
        })));
      }
    }
  }, [currentCourse, courseId]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModuleFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLessonFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleModuleOpen = (moduleId: string) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, isOpen: !module.isOpen } 
          : module
      )
    );
  };

  const handleSaveCourse = async () => {
    if (!courseData.title) {
      toast.error('Course title is required');
      return;
    }
    
    try {
      if (isNewCourse) {
        const newCourseId = await createCourse(courseData);
        if (newCourseId) {
          toast.success('Course created successfully');
          navigate(`/admin/courses/${newCourseId}/edit`);
        }
      } else if (courseId) {
        await updateCourse(courseId, courseData);
        toast.success('Course updated successfully');
      }
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const handleAddModule = async () => {
    if (!moduleFormData.title) {
      toast.error('Module title is required');
      return;
    }
    
    try {
      if (editingModuleId) {
        // Update existing module
        await updateModule(editingModuleId, moduleFormData);
        toast.success('Module updated successfully');
      } else if (courseId) {
        // Create new module
        const newOrder = modules.length;
        await createModule({
          ...moduleFormData,
          course_id: courseId,
          order: newOrder
        });
        toast.success('Module added successfully');
      }
      
      setModuleFormData({ title: '', description: '', order: 0 });
      setShowModuleForm(false);
      setEditingModuleId(null);
      
      if (courseId) {
        await fetchCourseDetails(courseId);
      }
    } catch (error) {
      toast.error('Failed to save module');
    }
  };

  const handleEditModule = (module: Module) => {
    setModuleFormData({
      id: module.id,
      title: module.title,
      description: module.description || '',
      order: module.order
    });
    setEditingModuleId(module.id);
    setShowModuleForm(true);
  };

  const handleDeleteModuleClick = async (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module? All lessons within it will also be deleted.')) {
      await deleteModule(moduleId);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!lessonFormData.title) {
      toast.error('Lesson title is required');
      return;
    }
    
    try {
      const module = modules.find(m => m.id === moduleId);
      if (!module) return;
      
      const newOrder = module.lessons?.length || 0;
      
      if (editingLessonId) {
        // Update existing lesson
        await updateLesson(editingLessonId, {
          ...lessonFormData,
          module_id: moduleId
        });
        toast.success('Lesson updated successfully');
      } else {
        // Create new lesson
        await createLesson({
          ...lessonFormData,
          module_id: moduleId,
          order: newOrder
        });
        toast.success('Lesson added successfully');
      }
      
      setLessonFormData({
        title: '',
        description: '',
        content_type: 'video',
        content_url: '',
        content: '',
        order: 0,
        duration: 0
      });
      setShowLessonForm(null);
      setEditingLessonId(null);
      
      if (courseId) {
        await fetchCourseDetails(courseId);
      }
    } catch (error) {
      toast.error('Failed to save lesson');
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLessonFormData({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      content_type: lesson.content_type as 'video' | 'document' | 'quiz',
      content_url: lesson.content_url || '',
      content: lesson.content || '',
      order: lesson.order,
      duration: lesson.duration || 0
    });
    setEditingLessonId(lesson.id);
    setShowLessonForm(lesson.module_id);
  };

  const handleDeleteLessonClick = async (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      await deleteLesson(lessonId);
    }
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'document':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/admin/courses')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Courses
          </button>
          
          <button
            onClick={handleSaveCourse}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            <Save className="h-5 w-5 mr-1" />
            {isLoading ? 'Saving...' : 'Save Course'}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isNewCourse ? 'Create New Course' : 'Edit Course'}
            </h1>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={courseData.title}
                  onChange={handleCourseChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter course title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={courseData.description || ''}
                  onChange={handleCourseChange}
                  rows={3}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter course description"
                />
              </div>
              
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={courseData.image_url || ''}
                  onChange={handleCourseChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide a URL to an image for the course cover (recommended size: 1280x720)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {!isNewCourse && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Course Modules</h2>
              <button
                onClick={() => {
                  setModuleFormData({ title: '', description: '', order: modules.length });
                  setEditingModuleId(null);
                  setShowModuleForm(true);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Module
              </button>
            </div>
            
            {showModuleForm && (
              <div className="p-6 bg-gray-50 border-b">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingModuleId ? 'Edit Module' : 'Add New Module'}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="moduleTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Module Title *
                    </label>
                    <input
                      type="text"
                      id="moduleTitle"
                      name="title"
                      value={moduleFormData.title}
                      onChange={handleModuleChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter module title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="moduleDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="moduleDescription"
                      name="description"
                      value={moduleFormData.description}
                      onChange={handleModuleChange}
                      rows={2}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter module description"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-2">
                    <button
                      onClick={() => {
                        setShowModuleForm(false);
                        setEditingModuleId(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddModule}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingModuleId ? 'Update Module' : 'Add Module'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="divide-y divide-gray-200">
              {modules.length > 0 ? (
                modules.map((module, index) => (
                  <div key={module.id} className="border-b border-gray-200">
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleModuleOpen(module.id)}
                    >
                      <div className="flex items-center">
                        <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {index + 1}. {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">
                          {module.lessons?.length || 0} lessons
                        </span>
                        <div className="flex space-x-2 mr-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditModule(module);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-900 rounded-md"
                            title="Edit Module"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModuleClick(module.id);
                            }}
                            className="p-1 text-red-600 hover:text-red-900 rounded-md"
                            title="Delete Module"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                        {module.isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {module.isOpen && (
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium text-gray-700">Lessons</h4>
                          <button
                            onClick={() => {
                              setLessonFormData({
                                title: '',
                                description: '',
                                content_type: 'video',
                                content_url: '',
                                content: '',
                                order: module.lessons?.length || 0,
                                duration: 0
                              });
                              setEditingLessonId(null);
                              setShowLessonForm(module.id);
                            }}
                            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Lesson
                          </button>
                        </div>
                        
                        {showLessonForm === module.id && (
                          <div className="bg-white p-4 rounded-md border border-gray-200 mb-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-3">
                              {editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
                            </h5>
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <label htmlFor="lessonTitle" className="block text-xs font-medium text-gray-700 mb-1">
                                  Lesson Title *
                                </label>
                                <input
                                  type="text"
                                  id="lessonTitle"
                                  name="title"
                                  value={lessonFormData.title}
                                  onChange={handleLessonChange}
                                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter lesson title"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="lessonDescription" className="block text-xs font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  id="lessonDescription"
                                  name="description"
                                  value={lessonFormData.description}
                                  onChange={handleLessonChange}
                                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter lesson description"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label htmlFor="contentType" className="block text-xs font-medium text-gray-700 mb-1">
                                    Content Type *
                                  </label>
                                  <select
                                    id="contentType"
                                    name="content_type"
                                    value={lessonFormData.content_type}
                                    onChange={handleLessonChange}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="video">Video</option>
                                    <option value="document">Document</option>
                                    <option value="quiz">Quiz</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label htmlFor="duration" className="block text-xs font-medium text-gray-700 mb-1">
                                    Duration (minutes)
                                  </label>
                                  <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={lessonFormData.duration}
                                    onChange={handleLessonChange}
                                    min="0"
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Duration"
                                  />
                                </div>
                              </div>
                              
                              {lessonFormData.content_type === 'video' && (
                                <div>
                                  <label htmlFor="contentUrl" className="block text-xs font-medium text-gray-700 mb-1">
                                    Video URL
                                  </label>
                                  <input
                                    type="text"
                                    id="contentUrl"
                                    name="content_url"
                                    value={lessonFormData.content_url}
                                    onChange={handleLessonChange}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter YouTube or Vimeo URL"
                                  />
                                </div>
                              )}
                              
                              {(lessonFormData.content_type === 'document' || lessonFormData.content_type === 'quiz') && (
                                <div>
                                  <label htmlFor="content" className="block text-xs font-medium text-gray-700 mb-1">
                                    Content (Markdown supported)
                                  </label>
                                  <textarea
                                    id="content"
                                    name="content"
                                    value={lessonFormData.content}
                                    onChange={handleLessonChange}
                                    rows={5}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter lesson content in Markdown format"
                                  />
                                </div>
                              )}
                              
                              <div className="flex justify-end space-x-2 mt-2">
                                <button
                                  onClick={() => {
                                    setShowLessonForm(null);
                                    setEditingLessonId(null);
                                  }}
                                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleAddLesson(module.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                  {editingLessonId ? 'Update Lesson' : 'Add Lesson'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {module.lessons && module.lessons.length > 0 ? (
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200"
                              >
                                <div className="flex items-center">
                                  <div className="mr-2 text-gray-500">{lessonIndex + 1}.</div>
                                  <div className="mr-2">
                                    {getLessonTypeIcon(lesson.content_type)}
                                  </div>
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-800">{lesson.title}</h5>
                                    {lesson.description && (
                                      <p className="text-xs text-gray-500">{lesson.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {lesson.duration > 0 && (
                                    <span className="text-xs text-gray-500 mr-3">{lesson.duration} min</span>
                                  )}
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => handleEditLesson(lesson)}
                                      className="p-1 text-blue-600 hover:text-blue-900 rounded-md"
                                      title="Edit Lesson"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLessonClick(lesson.id)}
                                      className="p-1 text-red-600 hover:text-red-900 rounded-md"
                                      title="Delete Lesson"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-sm text-gray-500">
                            No lessons yet. Add your first lesson to this module.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No modules yet. Add your first module to get started.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditorPage;