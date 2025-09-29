import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export interface TimeBalance {
  id: string;
  user_id: string;
  balance_hours: number;
  created_at: string;
  updated_at: string;
}

export interface TimeBalanceHistory {
  id: string;
  user_id: string;
  amount_hours: number;
  balance_after: number;
  operation_type: string;
  notes: string | null;
  created_by: string;
  created_at: string;
  created_by_name?: string;
}

export interface UserSessionLog {
  id: string;
  user_id: string;
  server_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  created_at: string;
  server_name?: string;
}

export interface UserTimeData {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  balance_hours: number;
}

interface TimeState {
  userTimeBalance: TimeBalance | null;
  timeBalanceHistory: TimeBalanceHistory[];
  userSessionLogs: UserSessionLog[];
  allUserTimeData: UserTimeData[];
  activeSessionId: string | null;
  sessionStartTime: Date | null;
  remainingTimeSeconds: number;
  isLoading: boolean;
  isTimerActive: boolean;
  
  fetchUserTimeBalance: () => Promise<void>;
  fetchTimeBalanceHistory: () => Promise<void>;
  fetchUserSessionLogs: () => Promise<void>;
  fetchAllUserTimeData: () => Promise<void>;
  
  startSession: (serverId: string) => Promise<string | null>;
  pauseSession: (sessionId: string) => Promise<void>;
  resumeSession: (sessionId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
  updateSessionTime: () => void;
  
  addTimeBalance: (userId: string, hours: number, notes: string) => Promise<void>;
  deductTimeBalance: (userId: string, hours: number, notes: string) => Promise<void>;
  batchAddTimeBalance: (userIds: string[], hours: number, notes: string) => Promise<void>;
  
  verifyActiveSession: (sessionId: string) => Promise<boolean>;
}

const verifyActiveSession = async (sessionId: string): Promise<boolean> => {
  try {
    // Check if the session exists in the database
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_session_logs')
      .select('*')
      .eq('id', sessionId)
      .is('end_time', null) // Session should not have an end time
      .single();
    
    if (sessionError) {
      console.error('Session verification failed:', sessionError);
      // If the error is that no rows were returned, this could be a race condition
      // where the session was just created but not yet visible in the database
      if (sessionError.code === 'PGRST116') {
        console.log('Session not found in database yet, might be a new session');
        // Give new sessions the benefit of the doubt
        return true;
      }
      return false;
    }
    
    if (!sessionData) {
      console.error('Session verification failed: No session found');
      return false;
    }
    
    // Check if the session belongs to the current user
    const { user } = useAuthStore.getState();
    if (!user || sessionData.user_id !== user.id) {
      console.error('Session verification failed: Session does not belong to current user');
      return false;
    }
    
    // Check if the session is not too old (e.g., more than 24 hours)
    const startTime = new Date(sessionData.start_time);
    const now = new Date();
    const hoursDiff = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      console.error('Session verification failed: Session is too old');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying session:', error);
    return false;
  }
};

export const useTimeStore = create<TimeState>((set, get) => ({
  userTimeBalance: null,
  timeBalanceHistory: [],
  userSessionLogs: [],
  allUserTimeData: [],
  activeSessionId: null,
  sessionStartTime: null,
  remainingTimeSeconds: 0,
  isLoading: false,
  isTimerActive: false,
  
  fetchUserTimeBalance: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('user_time_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching time balance:', error);
        
        // If no time balance exists, create one
        if (error.code === 'PGRST116') {
          const { data: newBalance, error: createError } = await supabase
            .from('user_time_balances')
            .insert({
              user_id: user.id,
              balance_hours: 0
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating time balance:', createError);
            set({ isLoading: false });
            return;
          }
          
          set({ 
            userTimeBalance: newBalance,
            remainingTimeSeconds: newBalance ? Math.floor(newBalance.balance_hours * 3600) : 0,
            isLoading: false 
          });
          return;
        }
        
        set({ isLoading: false });
        return;
      }
      
      set({ 
        userTimeBalance: data,
        remainingTimeSeconds: data ? Math.floor(data.balance_hours * 3600) : 0,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching time balance:', error);
      set({ isLoading: false });
    }
  },
  
  fetchTimeBalanceHistory: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('time_balance_history')
        .select(`
          *,
          created_by_profile:profiles!created_by(full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching time balance history:', error);
        set({ isLoading: false });
        return;
      }
      
      const historyWithNames = data.map(item => ({
        ...item,
        created_by_name: item.created_by_profile?.full_name || 'Unknown'
      }));
      
      set({ timeBalanceHistory: historyWithNames, isLoading: false });
    } catch (error) {
      console.error('Error fetching time balance history:', error);
      set({ isLoading: false });
    }
  },
  
  fetchUserSessionLogs: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('user_session_logs')
        .select(`
          *,
          server:servers(name)
        `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });
      
      if (error) {
        console.error('Error fetching session logs:', error);
        set({ isLoading: false });
        return;
      }
      
      const logsWithServerNames = data.map(log => ({
        ...log,
        server_name: log.server?.name || 'Unknown Server'
      }));
      
      set({ userSessionLogs: logsWithServerNames, isLoading: false });
    } catch (error) {
      console.error('Error fetching session logs:', error);
      set({ isLoading: false });
    }
  },
  
  fetchAllUserTimeData: async () => {
    const isAdmin = useAuthStore.getState().isAdmin;
    if (!isAdmin) return;
    
    set({ isLoading: true });
    
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        set({ isLoading: false });
        return;
      }
      
      const { data: timeBalances, error: timeBalancesError } = await supabase
        .from('user_time_balances')
        .select('*');
      
      if (timeBalancesError) {
        console.error('Error fetching time balances:', timeBalancesError);
        set({ isLoading: false });
        return;
      }
      
      // Combine profiles with their time balances
      const userData = profiles.map(profile => {
        const timeBalance = timeBalances.find(tb => tb.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          balance_hours: timeBalance ? timeBalance.balance_hours : 0
        };
      });
      
      set({ allUserTimeData: userData, isLoading: false });
    } catch (error) {
      console.error('Error fetching user time data:', error);
      set({ isLoading: false });
    }
  },
  
  startSession: async (serverId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return null;
    
    const { userTimeBalance } = get();
    
    if (!userTimeBalance || userTimeBalance.balance_hours <= 0) {
      toast.error('You have no time balance remaining');
      return null;
    }
    
    try {
      // Create a new session log
      const { data, error } = await supabase
        .from('user_session_logs')
        .insert({
          user_id: user.id,
          server_id: serverId,
          start_time: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error starting session:', error);
        toast.error('Failed to start session');
        return null;
      }
      
      if (!data || !data.id) {
        console.error('Error starting session: No session ID returned');
        toast.error('Failed to start session');
        return null;
      }
      
      console.log('Session started successfully with ID:', data.id);
      
      // Set state after successful session creation
      set({
        activeSessionId: data.id,
        sessionStartTime: new Date(),
        isTimerActive: true
      });
      
      // Start timer to update remaining time
      const timer = setInterval(() => {
        get().updateSessionTime();
      }, 1000);
      
      // Store timer ID in window object to clear it later
      window.sessionTimer = timer;
      
      return data.id;
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
      return null;
    }
  },
  
  pauseSession: async (sessionId: string) => {
    try {
      // Dismiss any existing toasts to prevent multiple notifications
      toast.dismiss();
      
      // Get current session duration
      const { data: session, error: sessionError } = await supabase
        .from('user_session_logs')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        toast.error('Failed to pause session');
        return;
      }
      
      // Calculate duration so far
      const startTime = new Date(session.start_time);
      const now = new Date();
      const durationMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);
      
      // Update session with end time and duration
      const { error } = await supabase
        .from('user_session_logs')
        .update({
          end_time: now.toISOString(),
          duration_minutes: durationMinutes
        })
        .eq('id', sessionId);
      
      if (error) {
        console.error('Error pausing session:', error);
        toast.error('Failed to pause session');
        return;
      }
      
      // Clear timer
      if (window.sessionTimer) {
        clearInterval(window.sessionTimer);
      }
      
      set({ isTimerActive: false });
      toast.success('Session paused');
    } catch (error) {
      console.error('Error pausing session:', error);
      toast.error('Failed to pause session');
    }
  },
  
  resumeSession: async (sessionId: string) => {
    try {
      // Dismiss any existing toasts to prevent multiple notifications
      toast.dismiss();
      
      // Create a new session log
      const { data, error } = await supabase
        .from('user_session_logs')
        .insert({
          user_id: useAuthStore.getState().user?.id,
          server_id: 'resumed', // This would need to be updated with actual server ID
          start_time: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error resuming session:', error);
        toast.error('Failed to resume session');
        return;
      }
      
      set({
        activeSessionId: data.id,
        sessionStartTime: new Date(),
        isTimerActive: true
      });
      
      // Start timer to update remaining time
      const timer = setInterval(() => {
        get().updateSessionTime();
      }, 1000);
      
      // Store timer ID in window object to clear it later
      window.sessionTimer = timer;
      
      toast.success('Session resumed');
    } catch (error) {
      console.error('Error resuming session:', error);
      toast.error('Failed to resume session');
    }
  },
  
  endSession: async (sessionId: string) => {
    try {
      // Dismiss any existing toasts to prevent multiple notifications
      toast.dismiss();
      
      // Get current session duration
      const { data: session, error: sessionError } = await supabase
        .from('user_session_logs')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        toast.error('Failed to end session');
        return;
      }
      
      // Calculate duration
      const startTime = new Date(session.start_time);
      const now = new Date();
      const durationMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);
      const durationHours = durationMinutes / 60;
      
      // Update session with end time and duration
      const { error: updateError } = await supabase
        .from('user_session_logs')
        .update({
          end_time: now.toISOString(),
          duration_minutes: durationMinutes
        })
        .eq('id', sessionId);
      
      if (updateError) {
        console.error('Error updating session:', updateError);
        toast.error('Failed to end session');
        return;
      }
      
      // Deduct time from user's balance
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      const { data: timeBalance, error: timeBalanceError } = await supabase
        .from('user_time_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (timeBalanceError) {
        console.error('Error fetching time balance:', timeBalanceError);
        toast.error('Failed to update time balance');
        return;
      }
      
      const newBalance = Math.max(0, timeBalance.balance_hours - durationHours);
      
      const { error: updateBalanceError } = await supabase
        .from('user_time_balances')
        .update({
          balance_hours: newBalance
        })
        .eq('user_id', user.id);
      
      if (updateBalanceError) {
        console.error('Error updating time balance:', updateBalanceError);
        toast.error('Failed to update time balance');
        return;
      }
      
      // Add to time balance history
      const { error: historyError } = await supabase
        .from('time_balance_history')
        .insert({
          user_id: user.id,
          amount_hours: -durationHours,
          balance_after: newBalance,
          operation_type: 'session',
          notes: `Session ended: ${durationMinutes.toFixed(1)} minutes`,
          created_by: user.id
        });
      
      if (historyError) {
        console.error('Error adding to history:', historyError);
      }
      
      // Clear timer
      if (window.sessionTimer) {
        clearInterval(window.sessionTimer);
      }
      
      // Fetch the latest time balance from the database to ensure UI consistency
      await get().fetchUserTimeBalance();
      
      // Now update the local state
      set({
        activeSessionId: null,
        sessionStartTime: null,
        isTimerActive: false,
        remainingTimeSeconds: 0  // Reset to 0 since no active session
      });
      
      toast.success('Session ended');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Failed to end session');
    }
  },
  
  updateSessionTime: () => {
    const { userTimeBalance, sessionStartTime, isTimerActive } = get();
    
    if (!userTimeBalance || !sessionStartTime || !isTimerActive) return;
    
    // Calculate elapsed time in seconds
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
    
    // Calculate remaining time
    const totalSeconds = Math.floor(userTimeBalance.balance_hours * 3600);
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
    
    set({ remainingTimeSeconds: remainingSeconds });
    
    // If time is up, end the session
    if (remainingSeconds <= 0 && get().activeSessionId) {
      const sessionId = get().activeSessionId;
      if (sessionId) {
        get().endSession(sessionId);
        toast.error('Your time balance has been depleted');
      }
    }
  },
  
  addTimeBalance: async (userId: string, hours: number, notes: string) => {
    if (hours <= 0) {
      toast.error('Time amount must be greater than 0');
      return;
    }
    
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    try {
      // Get current balance
      const { data: timeBalance, error: timeBalanceError } = await supabase
        .from('user_time_balances')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (timeBalanceError) {
        // If no balance exists, create one
        if (timeBalanceError.code === 'PGRST116') {
          const { error: createError } = await supabase
            .from('user_time_balances')
            .insert({
              user_id: userId,
              balance_hours: hours
            });
          
          if (createError) throw createError;
          
          // Add to history
          const { error: historyError } = await supabase
            .from('time_balance_history')
            .insert({
              user_id: userId,
              amount_hours: hours,
              balance_after: hours,
              operation_type: 'add',
              notes,
              created_by: currentUser.id
            });
          
          if (historyError) throw historyError;
          
          toast.success(`Added ${hours} hours to user's balance`);
          return;
        }
        
        throw timeBalanceError;
      }
      
      // Update balance
      const newBalance = timeBalance.balance_hours + hours;
      
      const { error: updateError } = await supabase
        .from('user_time_balances')
        .update({
          balance_hours: newBalance
        })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // Add to history
      const { error: historyError } = await supabase
        .from('time_balance_history')
        .insert({
          user_id: userId,
          amount_hours: hours,
          balance_after: newBalance,
          operation_type: 'add',
          notes,
          created_by: currentUser.id
        });
      
      if (historyError) throw historyError;
      
      toast.success(`Added ${hours} hours to user's balance`);
      
      // Update local state if this is the current user
      if (userId === currentUser.id) {
        set({
          userTimeBalance: {
            ...timeBalance,
            balance_hours: newBalance
          },
          remainingTimeSeconds: Math.floor(newBalance * 3600)
        });
      }
      
      // Refresh all user data if needed
      await get().fetchAllUserTimeData();
    } catch (error) {
      console.error('Error managing time balance:', error);
      toast.error('Failed to add time');
      throw error;
    }
  },
  
  deductTimeBalance: async (userId: string, hours: number, notes: string) => {
    // For deduction, we accept the absolute value of hours
    const deductionAmount = Math.abs(hours);
    
    if (deductionAmount <= 0) {
      toast.error('Time amount must be greater than 0');
      return;
    }
    
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    try {
      // Get current balance
      const { data: timeBalance, error: timeBalanceError } = await supabase
        .from('user_time_balances')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (timeBalanceError) throw timeBalanceError;
      
      // Calculate new balance, don't allow negative
      const newBalance = Math.max(0, timeBalance.balance_hours - deductionAmount);
      
      // Update balance
      const { error: updateError } = await supabase
        .from('user_time_balances')
        .update({
          balance_hours: newBalance
        })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // Add to history
      const { error: historyError } = await supabase
        .from('time_balance_history')
        .insert({
          user_id: userId,
          amount_hours: -deductionAmount,
          balance_after: newBalance,
          operation_type: 'deduct',
          notes,
          created_by: currentUser.id
        });
      
      if (historyError) throw historyError;
      
      toast.success(`Deducted ${deductionAmount} hours from user's balance`);
      
      // Update local state if this is the current user
      if (userId === currentUser.id) {
        set({
          userTimeBalance: {
            ...timeBalance,
            balance_hours: newBalance
          },
          remainingTimeSeconds: Math.floor(newBalance * 3600)
        });
      }
      
      // Refresh all user data if needed
      await get().fetchAllUserTimeData();
    } catch (error) {
      console.error('Error managing time balance:', error);
      toast.error('Failed to deduct time');
      throw error;
    }
  },
  
  batchAddTimeBalance: async (userIds: string[], hours: number, notes: string) => {
    if (hours <= 0) {
      toast.error('Time amount must be greater than 0');
      return;
    }
    
    if (userIds.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    try {
      // Process each user
      for (const userId of userIds) {
        // Get current balance
        const { data: timeBalance, error: timeBalanceError } = await supabase
          .from('user_time_balances')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (timeBalanceError) {
          // If no balance exists, create one
          if (timeBalanceError.code === 'PGRST116') {
            await supabase
              .from('user_time_balances')
              .insert({
                user_id: userId,
                balance_hours: hours
              });
            
            // Add to history
            await supabase
              .from('time_balance_history')
              .insert({
                user_id: userId,
                amount_hours: hours,
                balance_after: hours,
                operation_type: 'add',
                notes: `${notes} (Batch)`,
                created_by: currentUser.id
              });
            
            continue;
          }
          
          console.error(`Error getting balance for user ${userId}:`, timeBalanceError);
          continue;
        }
        
        // Update balance
        const newBalance = timeBalance.balance_hours + hours;
        
        await supabase
          .from('user_time_balances')
          .update({
            balance_hours: newBalance
          })
          .eq('user_id', userId);
        
        // Add to history
        await supabase
          .from('time_balance_history')
          .insert({
            user_id: userId,
            amount_hours: hours,
            balance_after: newBalance,
            operation_type: 'add',
            notes: `${notes} (Batch)`,
            created_by: currentUser.id
          });
      }
      
      toast.success(`Added ${hours} hours to ${userIds.length} users`);
      
      // Refresh all user data
      await get().fetchAllUserTimeData();
      
      // Refresh current user's balance if included
      if (userIds.includes(currentUser.id)) {
        await get().fetchUserTimeBalance();
      }
    } catch (error) {
      console.error('Error batch adding time:', error);
      toast.error('Failed to add time to some users');
      throw error;
    }
  },
  
  verifyActiveSession
}));

// Add type definition for window object
declare global {
  interface Window {
    sessionTimer?: NodeJS.Timeout;
  }
}