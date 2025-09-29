import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  message: string;
  is_read: boolean;
  type: 'request' | 'approval' | 'rejection' | 'system';
  related_id: string | null;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  playNotificationSound: () => void;
  subscribeToNotifications: () => (() => void);
  debugNotificationSound: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  
  fetchNotifications: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    set({ isLoading: true });
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      set({
        notifications: data,
        unreadCount: data.filter(n => !n.is_read).length,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },
  
  markAsRead: async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (!error) {
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));
    }
  },
  
  markAllAsRead: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    if (!error) {
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    }
  },
  
  playNotificationSound: () => {
    try {
      console.log('Playing notification sound');
      
      // Try to get the notification sound element
      const audio = document.getElementById('notification-sound') as HTMLAudioElement;
      
      if (audio) {
        // Reset the audio to the beginning if it's already playing
        audio.currentTime = 0;
        
        // Set volume to ensure it's audible
        audio.volume = 1.0;
        
        // Play the sound
        const playPromise = audio.play();
        
        // Handle play promise
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Notification sound played successfully');
            })
            .catch(e => {
              console.error('Error playing notification sound:', e);
              
              // Try an alternative approach if the first one fails
              const newAudio = new Audio(audio.src);
              newAudio.play().catch(err => {
                console.error('Alternative approach also failed:', err);
              });
            });
        }
      } else {
        console.error('Notification sound element not found, creating a new one');
        
        // Create a new audio element if the existing one wasn't found
        const newAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3');
        newAudio.play().catch(e => {
          console.error('Failed to play new audio element:', e);
        });
      }
    } catch (error) {
      console.error('Exception in playNotificationSound:', error);
    }
  },
  
  debugNotificationSound: () => {
    const audio = document.getElementById('notification-sound') as HTMLAudioElement;
    if (audio) {
      console.log('Notification sound element found:', audio);
      console.log('Source:', audio.src);
      console.log('Ready state:', audio.readyState);
      console.log('Paused:', audio.paused);
      console.log('Muted:', audio.muted);
      console.log('Volume:', audio.volume);
      
      // Try to play the sound
      audio.currentTime = 0;
      audio.play()
        .then(() => console.log('Notification sound played successfully'))
        .catch(e => console.error('Failed to play notification sound:', e));
    } else {
      console.error('Notification sound element not found');
      
      // Try to create and play a new audio element
      console.log('Attempting to create and play a new audio element...');
      const newAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3');
      newAudio.play()
        .then(() => console.log('New audio element played successfully'))
        .catch(e => console.error('Failed to play new audio element:', e));
    }
  },
  
  subscribeToNotifications: () => {
    const user = useAuthStore.getState().user;
    if (!user) return () => {};
    
    console.log('Setting up notification subscription for user:', user.id);
    
    // First, fetch existing notifications
    get().fetchNotifications();
    
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        console.log('New notification received:', payload);
        const newNotification = payload.new as Notification;
        
        // Update the notifications list and unread count
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
        
        // Play notification sound with a slight delay to ensure DOM is updated
        setTimeout(() => {
          console.log('Playing notification sound for new notification');
          get().playNotificationSound();
          
          // Show a toast notification
          try {
            // @ts-ignore - toast might not be imported
            if (typeof toast !== 'undefined') {
              toast({
                title: 'New Notification',
                description: newNotification.message,
                status: 'info',
                duration: 5000,
                isClosable: true,
              });
            }
          } catch (error) {
            console.error('Error showing toast notification:', error);
          }
        }, 100);
      })
      .subscribe();
    
    console.log('Notification subscription set up successfully');
    
    return () => {
      console.log('Cleaning up notification subscription');
      supabase.removeChannel(subscription);
    };
  },
}));