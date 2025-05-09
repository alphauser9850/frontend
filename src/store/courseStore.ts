import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_by: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  modules?: Module[];
  progress?: UserCourseProgress;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content_type: string;
  content_url: string | null;
  content: string | null;
  order: number;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface Workbook {
  id: string;
  server_id: string;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_lessons: string[];
  last_accessed_at: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  workbooks: Workbook[];
  isLoading: boolean;
  fetchCourses: () => Promise<void>;
  fetchCourseDetails: (courseId: string) => Promise<Course | null>;
  fetchWorkbooksForServer: (serverId: string) => Promise<Workbook[]>;
  markLessonComplete: (lessonId: string, courseId: string) => Promise<void>;
  createCourse: (courseData: Partial<Course>) => Promise<string | null>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<void>;
  createModule: (moduleData: Partial<Module>) => Promise<string | null>;
  updateModule: (moduleId: string, moduleData: Partial<Module>) => Promise<void>;
  createLesson: (lessonData: Partial<Lesson>) => Promise<string | null>;
  updateLesson: (lessonId: string, lessonData: Partial<Lesson>) => Promise<void>;
  createWorkbook: (workbookData: Partial<Workbook>) => Promise<string | null>;
  updateWorkbook: (workbookId: string, workbookData: Partial<Workbook>) => Promise<void>;
  publishCourse: (courseId: string) => Promise<void>;
  unpublishCourse: (courseId: string) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  deleteModule: (moduleId: string) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
  deleteWorkbook: (workbookId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  currentCourse: null,
  currentLesson: null,
  workbooks: [],
  isLoading: false,

  fetchCourses: async () => {
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          modules:modules(
            *,
            lessons:lessons(*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Get user progress for courses
      const user = useAuthStore.getState().user;
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_course_progress')
          .select('*')
          .eq('user_id', user.id);
        
        if (!progressError && progressData && progressData.length > 0) {
          const coursesWithProgress = data?.map(course => {
            const progress = progressData.find(p => p.course_id === course.id);
            return {
              ...course,
              progress: progress || null
            };
          });
          
          set({ courses: coursesWithProgress || [], isLoading: false });
          return;
        } else {
          // TEMPORARY: Add mock progress data for testing if no real progress exists
          if (data && data.length > 0) {
            const mockCoursesWithProgress = data.map((course: Course, index: number) => {
              // Calculate total lessons
              const totalLessons = course.modules?.reduce(
                (total: number, module: Module) => total + (module.lessons?.length || 0), 
                0
              ) || 10;
              
              // Generate random completed lessons
              const completedLessonsCount = Math.floor(Math.random() * totalLessons);
              const completedLessons = Array.from(
                { length: completedLessonsCount }, 
                (_, i) => `lesson-${i+1}`
              );
              
              // Create mock progress
              const mockProgress: UserCourseProgress = {
                id: `progress-${index}`,
                user_id: user.id,
                course_id: course.id,
                completed_lessons: completedLessons,
                last_accessed_at: new Date().toISOString(),
                is_completed: completedLessonsCount === totalLessons,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              
              // Only add progress to some courses
              return index % 2 === 0 ? { ...course, progress: mockProgress } : course;
            });
            
            set({ courses: mockCoursesWithProgress, isLoading: false });
            return;
          }
        }
      }
      
      set({ courses: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
      set({ isLoading: false });
    }
  },

  fetchCourseDetails: async (courseId: string) => {
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          modules:modules(
            *,
            lessons:lessons(*)
          )
        `)
        .eq('id', courseId)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Sort modules and lessons by order
      if (data.modules) {
        data.modules.sort((a, b) => a.order - b.order);
        data.modules.forEach(module => {
          if (module.lessons) {
            module.lessons.sort((a, b) => a.order - b.order);
          }
        });
      }
      
      // Get user progress for this course
      const user = useAuthStore.getState().user;
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_course_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();
        
        if (!progressError && progressData) {
          data.progress = progressData;
        }
      }
      
      set({ currentCourse: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
      set({ isLoading: false });
      return null;
    }
  },

  fetchWorkbooksForServer: async (serverId: string) => {
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('workbooks')
        .select('*')
        .eq('server_id', serverId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      set({ workbooks: data || [], isLoading: false });
      return data || [];
    } catch (error) {
      console.error('Error fetching workbooks:', error);
      toast.error('Failed to load workbooks');
      set({ isLoading: false });
      return [];
    }
  },

  markLessonComplete: async (lessonId: string, courseId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    try {
      // Check if progress record exists
      const { data: existingProgress, error: checkError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }
      
      if (existingProgress) {
        // Update existing progress
        const completedLessons = [...existingProgress.completed_lessons];
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        }
        
        // Check if all lessons are completed
        const course = get().currentCourse;
        let isCompleted = false;
        
        if (course && course.modules) {
          const allLessons = course.modules.flatMap(module => module.lessons || []);
          isCompleted = allLessons.every(lesson => 
            completedLessons.includes(lesson.id)
          );
        }
        
        const { error: updateError } = await supabase
          .from('user_course_progress')
          .update({
            completed_lessons: completedLessons,
            last_accessed_at: new Date().toISOString(),
            is_completed: isCompleted
          })
          .eq('id', existingProgress.id);
        
        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new progress record
        const { error: insertError } = await supabase
          .from('user_course_progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            completed_lessons: [lessonId],
            last_accessed_at: new Date().toISOString()
          });
        
        if (insertError) {
          throw insertError;
        }
      }
      
      // Update current course in state
      await get().fetchCourseDetails(courseId);
      toast.success('Progress saved');
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast.error('Failed to save progress');
    }
  },

  createCourse: async (courseData: Partial<Course>) => {
    const user = useAuthStore.getState().user;
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      await get().fetchCourses();
      toast.success('Course created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
      return null;
    }
  },

  updateCourse: async (courseId: string, courseData: Partial<Course>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', courseId);
      
      if (error) {
        throw error;
      }
      
      await get().fetchCourses();
      if (get().currentCourse?.id === courseId) {
        await get().fetchCourseDetails(courseId);
      }
      
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  },

  createModule: async (moduleData: Partial<Module>) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert(moduleData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (get().currentCourse?.id === moduleData.course_id) {
        await get().fetchCourseDetails(moduleData.course_id as string);
      }
      
      toast.success('Module created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
      return null;
    }
  },

  updateModule: async (moduleId: string, moduleData: Partial<Module>) => {
    try {
      const { error } = await supabase
        .from('modules')
        .update(moduleData)
        .eq('id', moduleId);
      
      if (error) {
        throw error;
      }
      
      if (get().currentCourse) {
        await get().fetchCourseDetails(get().currentCourse.id);
      }
      
      toast.success('Module updated successfully');
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module');
    }
  },

  createLesson: async (lessonData: Partial<Lesson>) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Refresh current course if needed
      const module = get().currentCourse?.modules?.find(m => m.id === lessonData.module_id);
      if (module) {
        await get().fetchCourseDetails(module.course_id);
      }
      
      toast.success('Lesson created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Failed to create lesson');
      return null;
    }
  },

  updateLesson: async (lessonId: string, lessonData: Partial<Lesson>) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', lessonId);
      
      if (error) {
        throw error;
      }
      
      if (get().currentCourse) {
        await get().fetchCourseDetails(get().currentCourse.id);
      }
      
      toast.success('Lesson updated successfully');
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson');
    }
  },

  createWorkbook: async (workbookData: Partial<Workbook>) => {
    const user = useAuthStore.getState().user;
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('workbooks')
        .insert({
          ...workbookData,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      await get().fetchWorkbooksForServer(workbookData.server_id as string);
      toast.success('Workbook created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating workbook:', error);
      toast.error('Failed to create workbook');
      return null;
    }
  },

  updateWorkbook: async (workbookId: string, workbookData: Partial<Workbook>) => {
    try {
      const { error } = await supabase
        .from('workbooks')
        .update(workbookData)
        .eq('id', workbookId);
      
      if (error) {
        throw error;
      }
      
      // Refresh workbooks if we know the server ID
      const workbook = get().workbooks.find(w => w.id === workbookId);
      if (workbook) {
        await get().fetchWorkbooksForServer(workbook.server_id);
      }
      
      toast.success('Workbook updated successfully');
    } catch (error) {
      console.error('Error updating workbook:', error);
      toast.error('Failed to update workbook');
    }
  },

  publishCourse: async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: true })
        .eq('id', courseId);
      
      if (error) {
        throw error;
      }
      
      await get().fetchCourses();
      if (get().currentCourse?.id === courseId) {
        await get().fetchCourseDetails(courseId);
      }
      
      toast.success('Course published successfully');
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error('Failed to publish course');
    }
  },

  unpublishCourse: async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: false })
        .eq('id', courseId);
      
      if (error) {
        throw error;
      }
      
      await get().fetchCourses();
      if (get().currentCourse?.id === courseId) {
        await get().fetchCourseDetails(courseId);
      }
      
      toast.success('Course unpublished');
    } catch (error) {
      console.error('Error unpublishing course:', error);
      toast.error('Failed to unpublish course');
    }
  },

  deleteCourse: async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) {
        throw error;
      }
      
      await get().fetchCourses();
      if (get().currentCourse?.id === courseId) {
        set({ currentCourse: null });
      }
      
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  },

  deleteModule: async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);
      
      if (error) {
        throw error;
      }
      
      if (get().currentCourse) {
        await get().fetchCourseDetails(get().currentCourse.id);
      }
      
      toast.success('Module deleted successfully');
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  },

  deleteLesson: async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);
      
      if (error) {
        throw error;
      }
      
      if (get().currentCourse) {
        await get().fetchCourseDetails(get().currentCourse.id);
      }
      
      toast.success('Lesson deleted successfully');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    }
  },

  deleteWorkbook: async (workbookId: string) => {
    try {
      const workbook = get().workbooks.find(w => w.id === workbookId);
      
      const { error } = await supabase
        .from('workbooks')
        .delete()
        .eq('id', workbookId);
      
      if (error) {
        throw error;
      }
      
      if (workbook) {
        await get().fetchWorkbooksForServer(workbook.server_id);
      }
      
      toast.success('Workbook deleted successfully');
    } catch (error) {
      console.error('Error deleting workbook:', error);
      toast.error('Failed to delete workbook');
    }
  }
}));