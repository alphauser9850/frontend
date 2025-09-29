// This file provides a client-side proxy simulation since we can't run a separate server in StackBlitz

import { supabase } from './supabase';

// Function to check if a user has access to a server
export const checkServerAccess = async (serverId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('server_assignments')
      .select('*')
      .eq('server_id', serverId)
      .eq('user_id', userId)
      .eq('status', 'approved')
      .single();
    
    return !error && !!data;
  } catch (error) {
    console.error('Error checking server access:', error);
    return false;
  }
};

// Function to get server URL with access token
export const getSecureServerUrl = async (serverId: string): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const userId = session.user.id;
    const hasAccess = await checkServerAccess(serverId, userId);
    
    if (!hasAccess) return null;
    
    // Get the server URL
    const { data: server, error } = await supabase
      .from('servers')
      .select('url')
      .eq('id', serverId)
      .single();
    
    if (error || !server) return null;
    
    // In a real implementation, we would proxy this through our server
    // For now, we'll just return the URL with a token parameter to simulate security
    const url = new URL(server.url);
    url.searchParams.append('access_token', session.access_token);
    url.searchParams.append('secure_access', 'true');
    
    return url.toString();
  } catch (error) {
    console.error('Error getting secure server URL:', error);
    return null;
  }
};

// Function to log access to a server
export const logServerAccess = async (serverId: string): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    // In a real implementation, we would log this on the server
    // For now, we'll just log to the console
    console.log(`User ${session.user.id} accessed server ${serverId} at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Error logging server access:', error);
  }
};