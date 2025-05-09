import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

interface Server {
  id: string;
  name: string;
  description: string | null;
  url: string;
  is_assigned: boolean;
  created_at: string;
}

interface ServerAssignment {
  id: string;
  server_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  server?: Server;
}

interface ServerState {
  servers: Server[];
  availableServers: Server[];
  userAssignments: ServerAssignment[];
  isLoading: boolean;
  fetchServers: () => Promise<void>;
  fetchAvailableServers: () => Promise<void>;
  fetchUserAssignments: () => Promise<void>;
  requestServer: (serverId: string) => Promise<void>;
  approveRequest: (assignmentId: string) => Promise<void>;
  rejectRequest: (assignmentId: string) => Promise<void>;
  fetchPendingRequests: () => Promise<ServerAssignment[]>;
  unassignServer: (assignmentId: string) => Promise<void>;
}

export const useServerStore = create<ServerState>((set, get) => ({
  servers: [],
  availableServers: [],
  userAssignments: [],
  isLoading: false,
  
  fetchServers: async () => {
    set({ isLoading: true });
    
    const { data, error } = await supabase
      .from('servers')
      .select('*')
      .order('name');
    
    if (!error && data) {
      set({ servers: data, isLoading: false });
    } else {
      set({ isLoading: false });
      toast.error('Failed to load servers');
    }
  },
  
  fetchAvailableServers: async () => {
    set({ isLoading: true });
    
    const { data, error } = await supabase
      .from('servers')
      .select('*')
      .order('name');
    
    if (!error && data) {
      // Filter servers that are not assigned
      const availableServers = data.filter(server => !server.is_assigned);
      set({ availableServers, isLoading: false });
    } else {
      set({ isLoading: false });
      toast.error('Failed to load available servers');
    }
  },
  
  fetchUserAssignments: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    
    const { data, error } = await supabase
      .from('server_assignments')
      .select(`
        *,
        server:servers(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      set({ userAssignments: data, isLoading: false });
    } else {
      set({ isLoading: false });
      toast.error('Failed to load your server assignments');
    }
  },
  
  requestServer: async (serverId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    // Check if user already has a pending request for this server
    const { data: existingRequests } = await supabase
      .from('server_assignments')
      .select('*')
      .eq('user_id', user.id)
      .eq('server_id', serverId)
      .eq('status', 'pending');
    
    if (existingRequests && existingRequests.length > 0) {
      toast.error('You already have a pending request for this server');
      return;
    }
    
    // Create the server assignment request
    const { error: assignmentError } = await supabase
      .from('server_assignments')
      .insert({
        user_id: user.id,
        server_id: serverId,
        status: 'pending',
      });
    
    if (assignmentError) {
      toast.error('Failed to request server');
      return;
    }
    
    // Get server details for the notification
    const { data: serverData } = await supabase
      .from('servers')
      .select('name')
      .eq('id', serverId)
      .single();
    
    // Create notification for admins
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');
    
    if (admins && admins.length > 0) {
      const notifications = admins.map(admin => ({
        user_id: admin.id,
        message: `${useAuthStore.getState().profile?.full_name || 'A user'} has requested access to server: ${serverData?.name}`,
        type: 'request' as const,
        related_id: serverId,
      }));
      
      await supabase.from('notifications').insert(notifications);
    }
    
    toast.success('Server request submitted');
    await get().fetchUserAssignments();
  },
  
  approveRequest: async (assignmentId: string) => {
    // Get the assignment details
    const { data: assignment } = await supabase
      .from('server_assignments')
      .select(`
        *,
        server:servers(*)
      `)
      .eq('id', assignmentId)
      .single();
    
    if (!assignment) {
      toast.error('Assignment not found');
      return;
    }
    
    // Update the assignment status
    const { error: updateError } = await supabase
      .from('server_assignments')
      .update({ status: 'approved' })
      .eq('id', assignmentId);
    
    if (updateError) {
      toast.error('Failed to approve request');
      return;
    }
    
    // Mark the server as assigned
    await supabase
      .from('servers')
      .update({ is_assigned: true })
      .eq('id', assignment.server_id);
    
    // Create notification for the user
    await supabase.from('notifications').insert({
      user_id: assignment.user_id,
      message: `Your request for server ${assignment.server?.name} has been approved`,
      type: 'approval',
      related_id: assignment.server_id,
    });
    
    toast.success('Request approved');
    await get().fetchServers();
  },
  
  rejectRequest: async (assignmentId: string) => {
    // Get the assignment details
    const { data: assignment } = await supabase
      .from('server_assignments')
      .select(`
        *,
        server:servers(*)
      `)
      .eq('id', assignmentId)
      .single();
    
    if (!assignment) {
      toast.error('Assignment not found');
      return;
    }
    
    // Update the assignment status
    const { error: updateError } = await supabase
      .from('server_assignments')
      .update({ status: 'rejected' })
      .eq('id', assignmentId);
    
    if (updateError) {
      toast.error('Failed to reject request');
      return;
    }
    
    // Create notification for the user
    await supabase.from('notifications').insert({
      user_id: assignment.user_id,
      message: `Your request for server ${assignment.server?.name} has been rejected`,
      type: 'rejection',
      related_id: assignment.server_id,
    });
    
    toast.success('Request rejected');
  },
  
  fetchPendingRequests: async () => {
    try {
      console.log('Fetching pending requests...');
      const { data, error } = await supabase
        .from('server_assignments')
        .select(`
          *,
          server:servers(*),
          user:profiles(id, email, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pending requests:', error);
        toast.error('Failed to load pending requests');
        return [];
      }
      
      console.log('Pending requests data:', data);
      return data || [];
    } catch (err) {
      console.error('Exception in fetchPendingRequests:', err);
      toast.error('An unexpected error occurred while loading requests');
      return [];
    }
  },
  
  unassignServer: async (assignmentId: string) => {
    try {
      // Get the assignment details
      const { data: assignment } = await supabase
        .from('server_assignments')
        .select(`
          *,
          server:servers(*)
        `)
        .eq('id', assignmentId)
        .single();
      
      if (!assignment) {
        toast.error('Assignment not found');
        return;
      }
      
      // Delete the assignment
      const { error: deleteError } = await supabase
        .from('server_assignments')
        .delete()
        .eq('id', assignmentId);
      
      if (deleteError) {
        toast.error('Failed to unassign server: ' + deleteError.message);
        return;
      }
      
      // Update the server status to not assigned
      await supabase
        .from('servers')
        .update({ is_assigned: false })
        .eq('id', assignment.server_id);
      
      toast.success('Server unassigned successfully');
      await get().fetchUserAssignments();
      await get().fetchServers();
    } catch (error) {
      console.error('Error unassigning server:', error);
      toast.error('An unexpected error occurred while unassigning the server');
    }
  },
}));