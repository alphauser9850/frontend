import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AdminState {
  selectedUsers: string[];
  setSelectedUsers: (users: string[]) => void;
  toggleUserSelection: (userId: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedUsers: [],
  setSelectedUsers: (users) => set({ selectedUsers: users }),
  toggleUserSelection: (userId) => set((state) => {
    if (state.selectedUsers.includes(userId)) {
      return { selectedUsers: state.selectedUsers.filter(id => id !== userId) };
    } else {
      return { selectedUsers: [...state.selectedUsers, userId] };
    }
  }),
})); 