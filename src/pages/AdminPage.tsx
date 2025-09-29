import React, { useEffect, useState } from 'react';
import { useServerStore } from '../store/serverStore';
import { useCourseStore, Course } from '../store/courseStore';
import { useTimeStore } from '../store/timeStore';
import { useThemeStore } from '../store/themeStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAdminStore } from '../store/adminStore';
import PageWrapper from '../components/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { 
  Server, Users, Plus, Edit, Trash, Check, X, UserPlus, 
  BookOpen, Filter, Clock, Download, Upload, History, 
  Search, AlertTriangle, ClipboardList, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface PendingRequest {
  id: string;
  server_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  server?: {
    id: string;
    name: string;
    description: string | null;
    url: string;
    is_assigned: boolean;
    created_at?: string;
  };
  user?: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

interface ServerFormData {
  name: string;
  description: string;
  url: string;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  time_balance?: number;
}

interface UserAssignment {
  id: string;
  user_id: string;
  server_id: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface UserCourseAssignment {
  id: string;
  user_id: string;
  course_id: string;
}

const AdminPage: React.FC = () => {
  const { servers, fetchServers, approveRequest, rejectRequest, fetchPendingRequests } = useServerStore();
  const { 
    courses, 
    fetchCourses, 
    publishCourse, 
    unpublishCourse, 
    deleteCourse, 
    isLoading: coursesLoading 
  } = useCourseStore();
  const { 
    allUserTimeData, 
    fetchAllUserTimeData, 
    addTimeBalance, 
    deductTimeBalance,
    batchAddTimeBalance,
    fetchTimeBalanceHistory,
    timeBalanceHistory,
    isLoading: timeIsLoading 
  } = useTimeStore();
  const { isDarkMode } = useThemeStore();
  
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [editingServer, setEditingServer] = useState<string | null>(null);
  const [serverFormData, setServerFormData] = useState<ServerFormData>({
    name: '',
    description: '',
    url: '',
  });
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'servers' | 'requests' | 'users' | 'time' | 'courses'>('servers');
  const [users, setUsers] = useState<User[]>([]);
  const [userAssignments, setUserAssignments] = useState<Record<string, UserAssignment[]>>({});
  const [userCourseAssignments, setUserCourseAssignments] = useState<Record<string, UserCourseAssignment[]>>({});
  const [showUserAssignmentModal, setShowUserAssignmentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [courseFilter, setCourseFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Time Management state
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [showBatchAddModal, setShowBatchAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [timeAmount, setTimeAmount] = useState<number>(1);
  const [isDeductMode, setIsDeductMode] = useState<boolean>(false);
  const [timeNotes, setTimeNotes] = useState<string>('');

  const { selectedUsers } = useAdminStore();

  // Check for tab query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam === 'courses') {
      setActiveTab('courses');
    } else if (tabParam === 'requests') {
      setActiveTab('requests');
    } else if (tabParam === 'users') {
      setActiveTab('users');
    } else if (tabParam === 'time') {
      setActiveTab('time');
    } else if (tabParam === 'servers') {
      setActiveTab('servers');
    }
  }, [location.search]);

  useEffect(() => {
    fetchServers();
    fetchCourses();
    loadPendingRequests();
    loadUsers();
    fetchAllUserTimeData();
    fetchTimeBalanceHistory();
  }, [fetchServers, fetchCourses, fetchAllUserTimeData, fetchTimeBalanceHistory]);

  useEffect(() => {
    if (courses) {
      let filtered = [...courses];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply published/unpublished filter
      if (courseFilter === 'published') {
        filtered = filtered.filter(course => course.is_published);
      } else if (courseFilter === 'unpublished') {
        filtered = filtered.filter(course => !course.is_published);
      }
      
      setFilteredCourses(filtered);
    }
  }, [courses, searchTerm, courseFilter]);

  const loadPendingRequests = async () => {
    setIsLoading(true);
    try {
    const requests = await fetchPendingRequests();
      console.log('Pending requests:', requests); // Debug log
      setPendingRequests(requests as unknown as PendingRequest[]);
    } catch (error) {
      console.error('Error loading pending requests:', error);
      toast.error('Failed to load pending requests');
    } finally {
    setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (usersError) throw usersError;
      
      setUsers(usersData || []);
      
      // Load all user assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('server_assignments')
        .select('*');
      
      if (assignmentsError) throw assignmentsError;
      
      // Group assignments by user
      const assignmentsByUser: Record<string, UserAssignment[]> = {};
      assignmentsData?.forEach(assignment => {
        if (!assignmentsByUser[assignment.user_id]) {
          assignmentsByUser[assignment.user_id] = [];
        }
        assignmentsByUser[assignment.user_id].push(assignment);
      });
      
      setUserAssignments(assignmentsByUser);
      
      // Load all user course assignments
      const { data: courseAssignmentsData, error: courseAssignmentsError } = await supabase
        .from('user_course_progress')
        .select('id, user_id, course_id');
      
      if (courseAssignmentsError) throw courseAssignmentsError;
      
      console.log('Loaded course assignments:', courseAssignmentsData);
      
      // Group course assignments by user
      const courseAssignmentsByUser: Record<string, UserCourseAssignment[]> = {};
      courseAssignmentsData?.forEach(assignment => {
        if (!courseAssignmentsByUser[assignment.user_id]) {
          courseAssignmentsByUser[assignment.user_id] = [];
        }
        courseAssignmentsByUser[assignment.user_id].push({
          id: assignment.id,
          user_id: assignment.user_id,
          course_id: assignment.course_id
        });
      });
      
      console.log('Grouped course assignments by user:', courseAssignmentsByUser);
      
      setUserCourseAssignments(courseAssignmentsByUser);
      
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async (id: string) => {
    await approveRequest(id);
    loadPendingRequests();
    loadUsers(); // Refresh user assignments
  };

  const handleRejectRequest = async (id: string) => {
    await rejectRequest(id);
    loadPendingRequests();
  };

  const handleAddServer = async () => {
    if (!serverFormData.name || !serverFormData.url) {
      toast.error('Name and URL are required');
      return;
    }

    try {
      const { error } = await supabase.from('servers').insert({
        name: serverFormData.name,
        description: serverFormData.description || null,
        url: serverFormData.url,
        is_assigned: false,
        status: 'available', // Add status field
      });

      if (error) {
        toast.error('Failed to add server: ' + error.message);
      } else {
        toast.success('Server added successfully');
        setShowAddServerModal(false);
        setServerFormData({ name: '', description: '', url: '' });
        fetchServers();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleEditServer = async () => {
    if (!editingServer || !serverFormData.name || !serverFormData.url) {
      toast.error('Name and URL are required');
      return;
    }

    try {
      const { error } = await supabase
        .from('servers')
        .update({
          name: serverFormData.name,
          description: serverFormData.description || null,
          url: serverFormData.url,
        })
        .eq('id', editingServer);

      if (error) {
        toast.error('Failed to update server: ' + error.message);
      } else {
        toast.success('Server updated successfully');
        setEditingServer(null);
        setServerFormData({ name: '', description: '', url: '' });
        fetchServers();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleDeleteServer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this server?')) {
      return;
    }

    try {
      const { error } = await supabase.from('servers').delete().eq('id', id);

      if (error) {
        toast.error('Failed to delete server: ' + error.message);
      } else {
        toast.success('Server deleted successfully');
        fetchServers();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const startEditServer = (server: any) => {
    setEditingServer(server.id);
    setServerFormData({
      name: server.name,
      description: server.description || '',
      url: server.url,
    });
  };

  const openUserAssignmentModal = (user: User) => {
    setSelectedUser(user);
    
    console.log('Opening user assignment modal for user:', user);
    
    // Set initially selected servers based on current assignments
    const userServerAssignments = userAssignments[user.id] || [];
    const approvedServerIds = userServerAssignments
      .filter(assignment => assignment.status === 'approved')
      .map(assignment => assignment.server_id);
    setSelectedServers(approvedServerIds);
    
    console.log('Current server assignments:', userServerAssignments);
    console.log('Selected server IDs:', approvedServerIds);
    
    // Set initially selected courses based on current assignments
    const userCourseAssigns = userCourseAssignments[user.id] || [];
    const assignedCourseIds = userCourseAssigns.map(assignment => assignment.course_id);
    setSelectedCourses(assignedCourseIds);
    
    console.log('Current course assignments:', userCourseAssigns);
    console.log('Selected course IDs:', assignedCourseIds);
    
    setShowUserAssignmentModal(true);
  };

  const handleSaveUserAssignments = async () => {
    if (!selectedUser) return;
    
    console.log('Saving user assignments for user:', selectedUser);
    console.log('Selected servers:', selectedServers);
    console.log('Selected courses:', selectedCourses);
    
    try {
      // Handle server assignments
      const currentAssignments = userAssignments[selectedUser.id] || [];
      const currentApprovedServerIds = currentAssignments
        .filter(assignment => assignment.status === 'approved')
        .map(assignment => assignment.server_id);
      
      // Servers to add
      const serversToAdd = selectedServers.filter(
        serverId => !currentApprovedServerIds.includes(serverId)
      );
      
      // Servers to remove
      const serversToRemove = currentApprovedServerIds.filter(
        serverId => !selectedServers.includes(serverId)
      );
      
      // Add new server assignments
      if (serversToAdd.length > 0) {
        const newAssignments = serversToAdd.map(serverId => ({
          user_id: selectedUser.id,
          server_id: serverId,
          status: 'approved'
        }));
        
        const { error: addError } = await supabase
          .from('server_assignments')
          .insert(newAssignments);
        
        if (addError) throw addError;
      }
      
      // Remove server assignments
      for (const serverId of serversToRemove) {
        const assignmentToRemove = currentAssignments.find(
          a => a.server_id === serverId && a.status === 'approved'
        );
        
        if (assignmentToRemove) {
          const { error: removeError } = await supabase
            .from('server_assignments')
            .delete()
            .eq('id', assignmentToRemove.id);
          
          if (removeError) throw removeError;
        }
      }
      
      // Handle course assignments
      const currentCourseAssignments = userCourseAssignments[selectedUser.id] || [];
      const currentAssignedCourseIds = currentCourseAssignments.map(a => a.course_id);
      
      console.log('Current course assignments:', currentCourseAssignments);
      console.log('Current assigned course IDs:', currentAssignedCourseIds);
      
      // Courses to add
      const coursesToAdd = selectedCourses.filter(
        courseId => !currentAssignedCourseIds.includes(courseId)
      );
      
      // Courses to remove
      const coursesToRemove = currentAssignedCourseIds.filter(
        courseId => !selectedCourses.includes(courseId)
      );
      
      console.log('Courses to add:', coursesToAdd);
      console.log('Courses to remove:', coursesToRemove);
      
      // Add new course assignments
      if (coursesToAdd.length > 0) {
        const newCourseAssignments = coursesToAdd.map(courseId => ({
          user_id: selectedUser.id,
          course_id: courseId,
          completed_lessons: [],
          is_completed: false
        }));
        
        const { error: addCourseError } = await supabase
          .from('user_course_progress')
          .insert(newCourseAssignments);
        
        if (addCourseError) throw addCourseError;
      }
      
      // Remove course assignments
      for (const courseId of coursesToRemove) {
        console.log(`Attempting to remove course: ${courseId}`);
        const courseAssignmentToRemove = currentCourseAssignments.find(
          a => a.course_id === courseId
        );
        
        console.log('Assignment to remove:', courseAssignmentToRemove);
        
        if (courseAssignmentToRemove) {
          try {
          const { error: removeCourseError } = await supabase
            .from('user_course_progress')
            .delete()
            .eq('id', courseAssignmentToRemove.id);
          
            if (removeCourseError) {
              console.error('Error removing course assignment:', removeCourseError);
              throw removeCourseError;
            } else {
              console.log(`Successfully removed course assignment: ${courseId}`);
            }
          } catch (error) {
            console.error('Exception removing course assignment:', error);
            throw error;
          }
        } else {
          console.warn(`No assignment found for course: ${courseId}`);
        }
      }
      
      toast.success('User assignments updated successfully');
      setShowUserAssignmentModal(false);
      loadUsers(); // Refresh user data
      
    } catch (error) {
      console.error('Error updating user assignments:', error);
      toast.error('Failed to update user assignments');
    }
  };

  const toggleServerSelection = (serverId: string) => {
    if (selectedServers.includes(serverId)) {
      setSelectedServers(selectedServers.filter(id => id !== serverId));
    } else {
      setSelectedServers([...selectedServers, serverId]);
    }
  };

  const toggleCourseSelection = (courseId: string) => {
    console.log(`Toggling course selection for course ID: ${courseId}`);
    console.log('Current selected courses:', selectedCourses);
    
    if (selectedCourses.includes(courseId)) {
      const updatedSelection = selectedCourses.filter(id => id !== courseId);
      console.log('Removing course from selection. New selection:', updatedSelection);
      setSelectedCourses(updatedSelection);
    } else {
      const updatedSelection = [...selectedCourses, courseId];
      console.log('Adding course to selection. New selection:', updatedSelection);
      setSelectedCourses(updatedSelection);
    }
  };

  const handleBatchAssign = async (type: 'servers' | 'courses') => {
    const selectedUsers = users.filter(user => {
      // Apply search filter
      const matchesSearch = searchTerm === '' || 
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply role filter
      const matchesRole = userFilter === 'all' || 
        (userFilter === 'admin' && user.role === 'admin') ||
        (userFilter === 'user' && user.role === 'user');
      
      return matchesSearch && matchesRole;
    });
    
    if (selectedUsers.length === 0) {
      toast.error('No users selected for batch assignment');
      return;
    }
    
    if (type === 'servers') {
      // Prompt for server selection
      const serverIds = prompt('Enter server IDs separated by commas:');
      if (!serverIds) return;
      
      const serverIdArray = serverIds.split(',').map(id => id.trim());
      
      try {
        // Create assignments for each user and server
        const assignments = [];
        for (const user of selectedUsers) {
          for (const serverId of serverIdArray) {
            assignments.push({
              user_id: user.id,
              server_id: serverId,
              status: 'approved'
            });
          }
        }
        
        const { error } = await supabase
          .from('server_assignments')
          .insert(assignments);
        
        if (error) throw error;
        
        toast.success(`Assigned servers to ${selectedUsers.length} users`);
        loadUsers();
      } catch (error) {
        console.error('Error in batch server assignment:', error);
        toast.error('Failed to assign servers');
      }
    } else if (type === 'courses') {
      // Prompt for course selection
      const courseIds = prompt('Enter course IDs separated by commas:');
      if (!courseIds) return;
      
      const courseIdArray = courseIds.split(',').map(id => id.trim());
      
      try {
        // Create course assignments for each user and course
        const courseAssignments = [];
        for (const user of selectedUsers) {
          for (const courseId of courseIdArray) {
            courseAssignments.push({
              user_id: user.id,
              course_id: courseId,
              completed_lessons: [],
              is_completed: false
            });
          }
        }
        
        const { error } = await supabase
          .from('user_course_progress')
          .insert(courseAssignments);
        
        if (error) throw error;
        
        toast.success(`Assigned courses to ${selectedUsers.length} users`);
        loadUsers();
      } catch (error) {
        console.error('Error in batch course assignment:', error);
        toast.error('Failed to assign courses');
      }
    }
  };

  // Time Management functions
  const openAddTimeModal = (userId: string, userName: string, deduct: boolean = false) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName || 'User');
    setTimeAmount(1);
    setIsDeductMode(deduct);
    setTimeNotes('');
    setShowAddTimeModal(true);
  };
  
  const openBatchAddModal = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    
    setTimeAmount(1);
    setTimeNotes('');
    setShowBatchAddModal(true);
  };
  
  const openHistoryModal = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName || 'User');
    setShowHistoryModal(true);
    fetchTimeBalanceHistory();
  };
  
  const handleAddTime = async () => {
    if (!selectedUserId) return;
    
    if (timeAmount <= 0) {
      toast.error('Time amount must be greater than 0');
      return;
    }
    
    try {
      if (isDeductMode) {
        await deductTimeBalance(selectedUserId, timeAmount, timeNotes);
      } else {
        await addTimeBalance(selectedUserId, timeAmount, timeNotes);
      }
      
      setShowAddTimeModal(false);
      fetchAllUserTimeData();
    } catch (error) {
      console.error('Error managing time balance:', error);
      toast.error('Failed to update time balance');
    }
  };
  
  const handleBatchAddTime = async () => {
    const userIds = selectedUsers;
    
    if (userIds.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    
    if (timeAmount <= 0) {
      toast.error('Time amount must be greater than 0');
      return;
    }
    
    try {
      await batchAddTimeBalance(userIds, timeAmount, timeNotes);
      setShowBatchAddModal(false);
      fetchAllUserTimeData();
      toast.success(`Added time to ${userIds.length} users`);
    } catch (error) {
      console.error('Error batch adding time:', error);
      toast.error('Failed to update time balances');
    }
  };
  
  const exportUserData = () => {
    const dataToExport = selectedUsers.map((userId) => {
      const user = users.find((u) => u.id === userId);
      return {
        id: user?.id || '',
        name: user?.full_name || 'N/A',
        email: user?.email || 'N/A',
        role: user?.role || 'N/A',
        timeBalance: user?.time_balance || 0
      };
    });
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `time_balance_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getUserHistoryItems = () => {
    if (!selectedUserId) return [];
    return timeBalanceHistory.filter(item => item.user_id === selectedUserId);
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredUsers = users.filter(user => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply role filter
    const matchesRole = userFilter === 'all' || 
      (userFilter === 'admin' && user.role === 'admin') ||
      (userFilter === 'user' && user.role === 'user');
    
    return matchesSearch && matchesRole;
  });

  const handlePublishToggle = async (courseId: string, isPublished: boolean) => {
    if (isPublished) {
      await unpublishCourse(courseId);
    } else {
      await publishCourse(courseId);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    await deleteCourse(courseId);
    setShowDeleteConfirm(null);
  };

  const getTotalLessons = (course: Course) => {
    return course.modules?.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0) || 0;
  };

  const getTotalDuration = (course: Course) => {
    return course.modules?.reduce((total, module) => 
      total + (module.lessons?.reduce((sum, lesson) => 
        sum + (lesson.duration || 0), 0) || 0), 0) || 0;
  };

  // Tab navigation component with consistent dark mode styling
  const TabNavigation = () => (
    <div className="mb-6 border-b border-gray-200 dark:border-white/10">
      <ul className="flex flex-wrap -mb-px">
        <li className="mr-2">
          <button
            onClick={() => setActiveTab('servers')}
            className={cn(
              "inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg",
              activeTab === 'servers' 
                ? isDarkMode 
                  ? "text-primary border-primary" 
                  : "text-primary border-primary"
                : isDarkMode
                  ? "border-transparent text-white/60 hover:text-white hover:border-white/20"
                  : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300"
            )}
          >
            <Server className="w-4 h-4 mr-2" />
            Servers
          </button>
        </li>
        <li className="mr-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={cn(
              "inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg",
              activeTab === 'requests' 
                ? isDarkMode 
                  ? "text-primary border-primary" 
                  : "text-primary border-primary"
                : isDarkMode
                  ? "border-transparent text-white/60 hover:text-white hover:border-white/20"
                  : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300"
            )}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Requests
            {pendingRequests.filter(req => req.status === 'pending').length > 0 && (
              <span className={cn(
                "ml-2 px-2 py-0.5 text-xs rounded-full",
                isDarkMode
                  ? "bg-primary/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              )}>
                {pendingRequests.filter(req => req.status === 'pending').length}
              </span>
            )}
          </button>
        </li>
        <li className="mr-2">
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              "inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg",
              activeTab === 'users' 
                ? isDarkMode 
                  ? "text-primary border-primary" 
                  : "text-primary border-primary"
                : isDarkMode
                  ? "border-transparent text-white/60 hover:text-white hover:border-white/20"
                  : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300"
            )}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </button>
        </li>
        <li className="mr-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={cn(
              "inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg",
              activeTab === 'courses'
                ? isDarkMode 
                  ? "text-primary border-primary" 
                  : "text-primary border-primary"
                : isDarkMode
                  ? "border-transparent text-white/60 hover:text-white hover:border-white/20"
                  : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300"
            )}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Courses
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab('time')}
            className={cn(
              "inline-flex items-center py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg",
              activeTab === 'time' 
                ? isDarkMode 
                  ? "text-primary border-primary" 
                  : "text-primary border-primary"
                : isDarkMode
                  ? "border-transparent text-white/60 hover:text-white hover:border-white/20"
                  : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300"
            )}
          >
            <Clock className="w-4 h-4 mr-2" />
            Time Management
          </button>
        </li>
      </ul>
        </div>
  );

  const renderCoursesTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Course Management
            </h1>
            <p className={cn(
              "mt-1",
              isDarkMode ? "text-white/60" : "text-gray-600"
            )}>
              Create, edit, and manage your courses
            </p>
          </div>
          
          <Link
            to="/admin/courses/new"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" /> Create Course
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={cn("h-5 w-5", isDarkMode ? "text-white/40" : "text-gray-400")} />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring-primary focus:border-primary",
                    isDarkMode 
                      ? "bg-black/40 border-white/10 text-white placeholder-white/40" 
                      : "bg-white border-gray-300 text-gray-900"
                  )}
                />
              </div>
              
              <div className="flex items-center">
                <Filter className={cn("h-5 w-5 mr-2", isDarkMode ? "text-white/40" : "text-gray-400")} />
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value as 'all' | 'published' | 'unpublished')}
                  className={cn(
                    "border rounded-md shadow-sm focus:ring-primary focus:border-primary py-2 px-3",
                    isDarkMode 
                      ? "bg-black/40 border-white/10 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  )}
                >
                  <option value="all">All Courses</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
            </div>
            
            {coursesLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                  <thead className={isDarkMode ? "bg-black/40" : "bg-gray-50"}>
                    <tr>
                      <th scope="col" className={cn(
                        "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                        isDarkMode ? "text-white/70" : "text-gray-500"
                      )}>
                        Course
                      </th>
                      <th scope="col" className={cn(
                        "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                        isDarkMode ? "text-white/70" : "text-gray-500"
                      )}>
                        Lessons
                      </th>
                      <th scope="col" className={cn(
                        "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                        isDarkMode ? "text-white/70" : "text-gray-500"
                      )}>
                        Duration
                      </th>
                      <th scope="col" className={cn(
                        "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                        isDarkMode ? "text-white/70" : "text-gray-500"
                      )}>
                        Status
                      </th>
                      <th scope="col" className={cn(
                        "px-6 py-3 text-right text-xs font-medium uppercase tracking-wider",
                        isDarkMode ? "text-white/70" : "text-gray-500"
                      )}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={cn(
                    "divide-y",
                    isDarkMode ? "divide-white/10" : "divide-gray-200"
                  )}>
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className={isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={cn(
                              "flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center",
                              isDarkMode ? "bg-primary/20" : "bg-primary/10"
                            )}>
                              <BookOpen className={cn(
                                "h-5 w-5",
                                isDarkMode ? "text-primary-foreground" : "text-primary"
                              )} />
                            </div>
                            <div className="ml-4">
                              <div className={cn(
                                "font-medium",
                                isDarkMode ? "text-white" : "text-gray-900"
                              )}>
                                {course.title}
                              </div>
                              {course.description && (
                                <div className={cn(
                                  "text-sm truncate max-w-md",
                                  isDarkMode ? "text-white/60" : "text-gray-500"
                                )}>
                                  {course.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className={cn(
                          "px-6 py-4 whitespace-nowrap text-sm",
                          isDarkMode ? "text-white/80" : "text-gray-700"
                        )}>
                          {getTotalLessons(course)}
                        </td>
                        <td className={cn(
                          "px-6 py-4 whitespace-nowrap text-sm",
                          isDarkMode ? "text-white/80" : "text-gray-700"
                        )}>
                          {Math.floor(getTotalDuration(course) / 60)} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            course.is_published
                              ? isDarkMode 
                                ? "bg-green-900/30 text-green-300" 
                                : "bg-green-100 text-green-800"
                              : isDarkMode 
                                ? "bg-yellow-900/30 text-yellow-300" 
                                : "bg-yellow-100 text-yellow-800"
                          )}>
                            {course.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handlePublishToggle(course.id, course.is_published)}
                              className={cn(
                                "p-1 rounded-md",
                                isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                              )}
                              title={course.is_published ? 'Unpublish' : 'Publish'}
                            >
                              {course.is_published ? (
                                <EyeOff className={cn(
                                  "h-5 w-5",
                                  isDarkMode ? "text-white/80" : "text-gray-600"
                                )} />
                              ) : (
                                <Eye className={cn(
                                  "h-5 w-5",
                                  isDarkMode ? "text-white/80" : "text-gray-600"
                                )} />
                              )}
                            </button>
                            <Link
                              to={`/admin/courses/${course.id}/edit`}
                              className={cn(
                                "p-1 rounded-md",
                                isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                              )}
                              title="Edit"
                            >
                              <Edit className={cn(
                                "h-5 w-5",
                                isDarkMode ? "text-white/80" : "text-gray-600"
                              )} />
                            </Link>
                            <button
                              onClick={() => setShowDeleteConfirm(course.id)}
                              className={cn(
                                "p-1 rounded-md",
                                isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                              )}
                              title="Delete"
                            >
                              <Trash className={cn(
                                "h-5 w-5",
                                isDarkMode ? "text-white/80" : "text-gray-600"
                              )} />
                            </button>
                          </div>
                          
                          {showDeleteConfirm === course.id && (
                            <div className={cn(
                              "absolute right-0 mt-2 w-56 rounded-md shadow-lg z-10 p-4 border",
                              isDarkMode 
                                ? "bg-black/80 border-white/10" 
                                : "bg-white border-gray-200"
                            )}>
                              <div className={cn(
                                "text-sm font-medium mb-3",
                                isDarkMode ? "text-white" : "text-gray-900"
                              )}>
                                Delete this course?
                              </div>
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className={cn(
                                    "px-3 py-1 rounded-md text-xs",
                                    isDarkMode 
                                      ? "bg-white/10 text-white hover:bg-white/20" 
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  )}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={cn(
                "text-center py-20 border rounded-md",
                isDarkMode 
                  ? "border-white/10 text-white/60" 
                  : "border-gray-200 text-gray-500"
              )}>
                <BookOpen className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p>No courses found</p>
                {searchTerm && (
                  <p className="mt-1">Try adjusting your search or filter</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <TabNavigation />
        
        {activeTab === 'servers' && (
          <Card className="mb-8">
            <CardHeader className="flex justify-between items-center p-6 border-b dark:border-dark-500">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Server className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Manage Servers
              </CardTitle>
              <button
                onClick={() => {
                  setServerFormData({ name: '', description: '', url: '' });
                  setShowAddServerModal(true);
                }}
                className="btn btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Server
              </button>
            </CardHeader>
            
            <CardContent className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500">
                <thead className="bg-gray-50 dark:bg-dark-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-500">
                  {servers.map((server) => (
                    <tr key={server.id} className="hover:bg-gray-50 dark:hover:bg-dark-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingServer === server.id ? (
                          <input
                            type="text"
                            value={serverFormData.name}
                            onChange={(e) => setServerFormData({ ...serverFormData, name: e.target.value })}
                            className="form-input"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{server.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingServer === server.id ? (
                          <input
                            type="text"
                            value={serverFormData.description}
                            onChange={(e) => setServerFormData({ ...serverFormData, description: e.target.value })}
                            className="form-input"
                          />
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-300">{server.description || 'N/A'}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingServer === server.id ? (
                          <input
                            type="text"
                            value={serverFormData.url}
                            onChange={(e) => setServerFormData({ ...serverFormData, url: e.target.value })}
                            className="form-input"
                          />
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">{server.url}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          server.is_assigned 
                            ? 'badge-success' 
                            : 'badge-warning'
                        }`}>
                          {server.is_assigned ? 'Assigned' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingServer === server.id ? (
                          <>
                            <button
                              onClick={handleEditServer}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setEditingServer(null)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditServer(server)}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteServer(server.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'requests' && (
          <Card className="mb-8">
            <CardHeader className="flex justify-between items-center p-6 border-b dark:border-dark-500">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent dark:border-primary-400 dark:border-t-transparent"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading requests...</p>
              </div>
            ) : pendingRequests.length > 0 ? (
              <CardContent className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500">
                  <thead className="bg-gray-50 dark:bg-dark-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Server
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Requested At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-500">
                    {pendingRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-dark-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {request.user?.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">{request.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{request.server?.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(request.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            ) : (
              <CardContent className="text-center py-8 bg-gray-50 dark:bg-dark-300 rounded-lg m-6">
                <p className="text-gray-500 dark:text-gray-300">No pending requests</p>
              </CardContent>
            )}
          </Card>
        )}
        
        {activeTab === 'users' && (
          <Card className="mb-8">
            <CardHeader className="flex justify-between items-center p-6 border-b dark:border-dark-500">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                User Management
              </CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBatchAssign('servers')}
                  className="btn btn-primary text-sm flex items-center"
                >
                  <Server className="h-4 w-4 mr-1" /> Batch Assign Servers
                </button>
                <button
                  onClick={() => handleBatchAssign('courses')}
                  className="btn bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 text-sm flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-1" /> Batch Assign Courses
                </button>
              </div>
            </CardHeader>
            
            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b dark:border-dark-500">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
              
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as 'all' | 'admin' | 'user')}
                  className="form-input"
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admins Only</option>
                  <option value="user">Regular Users Only</option>
                </select>
              </div>
            </CardContent>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent dark:border-primary-400 dark:border-t-transparent"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading users...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <CardContent className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500">
                  <thead className="bg-gray-50 dark:bg-dark-300">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={() => {
                              if (selectedUsers.length === filteredUsers.length) {
                                useAdminStore.getState().setSelectedUsers([]);
                              } else {
                                useAdminStore.getState().setSelectedUsers(filteredUsers.map(user => user.id));
                              }
                            }}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Assigned Servers
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Assigned Courses
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Time Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-500">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => useAdminStore.getState().toggleUserSelection(user.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-dark-300 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.full_name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${
                            user.role === 'admin' 
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:bg-opacity-30 dark:text-primary-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {userAssignments[user.id]?.filter(a => a.status === 'approved').length || 0} servers
                          </div>
                          <button
                            onClick={() => openUserAssignmentModal(user)}
                            className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            Manage
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {userCourseAssignments[user.id]?.length || 0} courses
                          </div>
                          <button
                            onClick={() => openUserAssignmentModal(user)}
                            className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            Manage
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${
                            (allUserTimeData.find(u => u.id === user.id)?.balance_hours || 0) <= 0 
                              ? 'text-red-500 dark:text-red-400' 
                              : (allUserTimeData.find(u => u.id === user.id)?.balance_hours || 0) < 1 
                                ? 'text-amber-500 dark:text-amber-400' 
                                : 'text-green-600 dark:text-green-400'
                          }`}>
                            {(allUserTimeData.find(u => u.id === user.id)?.balance_hours || 0).toFixed(1)} hours
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openAddTimeModal(user.id, user.full_name || user.email, false)}
                              className="p-1 rounded-md text-green-600 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-dark-300"
                              title="Add Time"
                            >
                              <Upload className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openAddTimeModal(user.id, user.full_name || user.email, true)}
                              className="p-1 rounded-md text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-dark-300"
                              title="Deduct Time"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openHistoryModal(user.id, user.full_name || user.email)}
                              className="p-1 rounded-md text-primary-600 hover:text-primary-900 hover:bg-primary-50 dark:text-primary-400 dark:hover:text-primary-300 dark:hover:bg-dark-300"
                              title="View History"
                            >
                              <History className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            ) : (
              <CardContent className="text-center py-12 bg-gray-50 dark:bg-dark-300">
                <Users className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">No users found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No users match your search criteria.' : 'There are no users in the system.'}
                </p>
              </CardContent>
            )}
          </Card>
        )}
        
        {activeTab === 'time' && (
          <Card className="mb-8">
            <CardHeader className="flex justify-between items-center p-6 border-b dark:border-dark-500">
              <CardTitle className="text-xl font-semibold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Time Balance Management
              </CardTitle>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={exportUserData}
                    className="btn btn-primary flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </button>
                </div>
            </CardHeader>
              
            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b dark:border-dark-500">
                <div className="relative flex-grow max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value as 'all' | 'admin' | 'user')}
                      className="form-input"
                    >
                      <option value="all">All Users</option>
                      <option value="admin">Admins Only</option>
                      <option value="user">Regular Users Only</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={openBatchAddModal}
                    disabled={selectedUsers.length === 0}
                    className={`btn ${
                      selectedUsers.length === 0 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'btn-primary'
                    }`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Batch Add Time
                  </button>
                </div>
            </CardContent>
              
              {timeIsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent dark:border-primary-400 dark:border-t-transparent"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">Loading user data...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
              <CardContent className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500">
                    <thead className="bg-gray-50 dark:bg-dark-300">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                              onChange={() => {
                                if (selectedUsers.length === filteredUsers.length) {
                                  useAdminStore.getState().setSelectedUsers([]);
                                } else {
                                  useAdminStore.getState().setSelectedUsers(filteredUsers.map(user => user.id));
                                }
                              }}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Time Balance
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-500">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => useAdminStore.getState().toggleUserSelection(user.id)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-dark-300 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {user.full_name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`badge ${
                              user.role === 'admin' 
                                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:bg-opacity-30 dark:text-primary-300' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${
                              (allUserTimeData.find(u => u.id === user.id)?.balance_hours || 0) <= 0 
                                ? 'text-red-500 dark:text-red-400' 
                                : (allUserTimeData.find(u => u.id === user.id)?.balance_hours || 0) < 1 
                                  ? 'text-amber-500 dark:text-amber-400' 
                                  : 'text-green-600 dark:text-green-400'
                            }`}>
                              {(allUserTimeData.find(u => u.id === user.id)?.balance_hours || 0).toFixed(1)} hours
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openAddTimeModal(user.id, user.full_name || user.email, false)}
                                className="p-1 rounded-md text-green-600 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-dark-300"
                                title="Add Time"
                              >
                                <Upload className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => openAddTimeModal(user.id, user.full_name || user.email, true)}
                                className="p-1 rounded-md text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-dark-300"
                                title="Deduct Time"
                              >
                                <Download className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => openHistoryModal(user.id, user.full_name || user.email)}
                                className="p-1 rounded-md text-primary-600 hover:text-primary-900 hover:bg-primary-50 dark:text-primary-400 dark:hover:text-primary-300 dark:hover:bg-dark-300"
                                title="View History"
                              >
                                <History className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </CardContent>
              ) : (
              <CardContent className="text-center py-12 bg-gray-50 dark:bg-dark-300">
                  <Users className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">No users found</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No users match your search criteria.' : 'There are no users in the system.'}
                  </p>
              </CardContent>
            )}
          </Card>
        )}
        
        {activeTab === 'courses' && renderCoursesTab()}
      </div>
      
      {/* Add/Deduct Time Modal */}
      {showAddTimeModal && selectedUserId && (
        <Modal
          isOpen={showAddTimeModal}
          onClose={() => setShowAddTimeModal(false)}
          title={`${isDeductMode ? 'Deduct' : 'Add'} Time for ${selectedUserName}`}
        >
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hours to {isDeductMode ? 'Deduct' : 'Add'}
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={timeAmount}
                onChange={(e) => setTimeAmount(parseFloat(e.target.value) || 0)}
                className="form-input w-full"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={timeNotes}
                onChange={(e) => setTimeNotes(e.target.value)}
                className="form-input w-full"
                rows={3}
                placeholder="Enter reason for time adjustment..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddTimeModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTime}
                className={`btn ${isDeductMode ? 'btn-danger' : 'btn-primary'}`}
              >
                {isDeductMode ? 'Deduct' : 'Add'} Time
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Batch Add Time Modal */}
      {showBatchAddModal && (
        <Modal
          isOpen={showBatchAddModal}
          onClose={() => setShowBatchAddModal(false)}
          title="Batch Add Time"
        >
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Adding time to {selectedUsers.length} selected users.
                </p>
            
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hours to Add
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={timeAmount}
                onChange={(e) => setTimeAmount(parseFloat(e.target.value) || 0)}
                className="form-input w-full"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={timeNotes}
                onChange={(e) => setTimeNotes(e.target.value)}
                className="form-input w-full"
                rows={3}
                placeholder="Enter reason for time adjustment..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBatchAddModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchAddTime}
                className="btn btn-primary"
              >
                Add Time to Selected Users
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* History Modal */}
      {showHistoryModal && selectedUserId && (
        <Modal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          title={`Time History for ${selectedUserName}`}
        >
          <div className="p-6">
            {timeBalanceHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500">
                  <thead className="bg-gray-50 dark:bg-dark-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Hours
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-500">
                    {getUserHistoryItems().map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-dark-200">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatDateTime(item.created_at)}
                          </td>
                        <td className={`px-4 py-2 whitespace-nowrap text-sm ${
                          item.hours > 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                        }`}>
                          {item.hours > 0 ? '+' : ''}{item.hours.toFixed(1)}
                          </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {item.type}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                            {item.notes || '-'}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">No time history available</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
          </div>
        </div>
        </Modal>
      )}
      
      {/* Add Server Modal */}
      {showAddServerModal && (
        <Modal
          isOpen={showAddServerModal}
          onClose={() => setShowAddServerModal(false)}
          title={editingServer ? "Edit Server" : "Add New Server"}
        >
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Server Name
              </label>
              <input
                type="text"
                value={serverFormData.name}
                onChange={(e) => setServerFormData({...serverFormData, name: e.target.value})}
                className="form-input w-full"
                placeholder="Enter server name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={serverFormData.description}
                onChange={(e) => setServerFormData({...serverFormData, description: e.target.value})}
                className="form-input w-full"
                rows={3}
                placeholder="Enter server description"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Server URL
              </label>
              <input
                type="text"
                value={serverFormData.url}
                onChange={(e) => setServerFormData({...serverFormData, url: e.target.value})}
                className="form-input w-full"
                placeholder="Enter server URL"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddServerModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={editingServer ? handleEditServer : handleAddServer}
                className="btn btn-primary"
              >
                {editingServer ? "Update Server" : "Add Server"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* User Assignment Modal */}
      {showUserAssignmentModal && selectedUser && (
        <Modal
          isOpen={showUserAssignmentModal}
          onClose={() => setShowUserAssignmentModal(false)}
          title={`Manage Access for ${selectedUser.full_name || selectedUser.email}`}
        >
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Server Access</h3>
              
              {servers.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 dark:border-dark-500 rounded-md">
                  {servers.map(server => {
                    const isAssigned = userAssignments[selectedUser.id]?.some(
                      assignment => assignment.server_id === server.id && assignment.status === 'approved'
                    );
                    
                    return (
                      <div key={server.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-dark-300 rounded-md">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`server-${server.id}`}
                            checked={isAssigned}
                            onChange={() => toggleServerSelection(server.id)}
                            className="form-checkbox h-4 w-4 text-primary-600 dark:text-primary-400"
                          />
                          <label htmlFor={`server-${server.id}`} className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            {server.name}
                          </label>
                          </div>
                        </div>
                    );
                  })}
                      </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No servers available</p>
                    )}
              </div>
              
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Course Access</h3>
              
                    {courses.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 dark:border-dark-500 rounded-md">
                  {courses.map(course => {
                    const isAssigned = userCourseAssignments[selectedUser.id]?.some(
                      assignment => assignment.course_id === course.id
                    );
                    
                    return (
                      <div key={course.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-dark-300 rounded-md">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`course-${course.id}`}
                            checked={isAssigned}
                            onChange={() => toggleCourseSelection(course.id)}
                            className="form-checkbox h-4 w-4 text-primary-600 dark:text-primary-400"
                          />
                          <label htmlFor={`course-${course.id}`} className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            {course.title}
                          </label>
                          </div>
                        </div>
                    );
                  })}
                      </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No courses available</p>
                    )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUserAssignmentModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserAssignments}
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
};

export default AdminPage;