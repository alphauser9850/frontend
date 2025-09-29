import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useTimeStore } from '../store/timeStore';
import { useThemeStore } from '../store/themeStore';
import Navbar from '../components/Navbar';
import LiveSessionTimer from '../components/LiveSessionTimer';
import CompactSessionControls from '../components/CompactSessionControls';
import { ArrowLeft, RefreshCw, Shield, AlertTriangle, Maximize, Minimize, Clock, Server } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSecureServerUrl, logServerAccess } from '../lib/proxyService';

interface ServerDetails {
  id: string;
  name: string;
  description: string | null;
  url: string;
}

const LabPage: React.FC = () => {
  const { serverId } = useParams<{ serverId: string }>();
  const location = useLocation();
  const { user, isAdmin } = useAuthStore();
  const { 
    userTimeBalance, 
    fetchUserTimeBalance, 
    isTimerActive, 
    activeSessionId,
    startSession,
    endSession
  } = useTimeStore();
  const { isDarkMode } = useThemeStore();
  const [server, setServer] = useState<ServerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [accessCheckDetails, setAccessCheckDetails] = useState<any>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  
  const hasTimeBalance = userTimeBalance && userTimeBalance.balance_hours > 0;
  const isActiveSession = isTimerActive && activeSessionId;
  const navigate = useNavigate();

  useEffect(() => {
    // Check for debug mode in URL parameters
    const searchParams = new URLSearchParams(location.search);
    const debug = searchParams.get('debug') === 'true';
    setDebugMode(debug);
  }, [location.search]);

  const fetchServerDetails = async () => {
    if (!serverId || !user) return;
    
    setIsLoading(true);
    const accessDetails: any = {
      userId: user.id,
      serverId,
      isAdmin,
      checks: []
    };
    
    try {
      // Check if user has time balance
      await fetchUserTimeBalance();
      
      // Fetch server details
      const { data: serverData, error: serverError } = await supabase
        .from('servers')
        .select('*')
        .eq('id', serverId)
        .single();
      
      if (serverError) {
        console.error('Server fetch error:', serverError);
        toast.error(`Server not found: ${serverError.message}`);
        setIsLoading(false);
        return;
      }
      
      if (!serverData) {
        toast.error('Server not found');
        setIsLoading(false);
        return;
      }
      
      setServer(serverData);
      accessDetails.serverName = serverData.name;
      
      // Check if user has access to this server
      const { data: accessData, error: accessError } = await supabase
        .from('user_server_access')
        .select('*')
        .eq('user_id', user.id)
        .eq('server_id', serverId)
        .eq('status', 'approved')
        .single();
      
      // Handle the case where no access record is found (PGRST116 is "no rows returned")
      // But also check if the user is an admin, as admins should have access to all servers
      let hasServerAccess = !!accessData;
      accessDetails.checks.push({
        table: 'user_server_access',
        result: !!accessData,
        data: accessData,
        error: accessError
      });
      
      // If user is an admin, grant access regardless of assignment
      if (isAdmin) {
        hasServerAccess = true;
        accessDetails.checks.push({
          check: 'isAdmin',
          result: true
        });
      }
      
      // Also check server_assignments table for backward compatibility
      if (!hasServerAccess) {
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('server_assignments')
          .select('*')
          .eq('server_id', serverId)
          .eq('user_id', user.id)
          .single();
        
        accessDetails.checks.push({
          table: 'server_assignments',
          result: !!assignmentData,
          data: assignmentData,
          error: assignmentError
        });
        
        if (assignmentData) {
          hasServerAccess = true;
        }
      }
      
      setAccessCheckDetails(accessDetails);
      setHasAccess(hasServerAccess);
      
      // Only proceed to get secure URL if user has access
      if (hasServerAccess) {
        try {
          // First try using the Edge Function
          const { data: urlData, error: urlError } = await supabase
            .functions.invoke('get-secure-server-url', {
              body: { serverId }
            });
          
          if (urlError) {
            console.error('Edge Function error:', urlError);
            
            // Fallback to direct proxy service if Edge Function fails
            console.log('Falling back to direct proxy service...');
            const directUrl = await getSecureServerUrl(serverId || '');
            
            if (directUrl) {
              setSecureUrl(directUrl);
              // Log access
              await logServerAccess(serverId || '');
              console.log('Successfully retrieved URL via direct proxy service');
            } else {
              throw new Error('Failed to get secure URL via both methods');
            }
          } else {
            setSecureUrl(urlData?.secureUrl || null);
            console.log('Successfully retrieved URL via Edge Function');
          }
        } catch (error) {
          console.error('Error getting secure URL:', error);
          setErrorType('edge_function');
          toast.error('Failed to establish secure connection to the lab');
          setSecureUrl(null);
        }
      }
    } catch (error) {
      console.error('Error fetching server details:', error);
      
      // Identify the type of error
      if (error instanceof Error) {
        if (error.message.includes('Edge Function')) {
          setErrorType('edge_function');
          toast.error('Connection issue with lab server. Try using direct connection.');
        } else {
          setErrorType('general');
          toast.error(`Failed to load server details: ${error.message}`);
        }
      } else {
        setErrorType('unknown');
        toast.error('Failed to load server details: Unknown error');
      }
      
      // Log additional information for debugging
      console.log('User ID:', user?.id);
      console.log('Server ID:', serverId);
      console.log('Is Admin:', isAdmin);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check database tables directly
  const checkDatabaseTables = async () => {
    if (!serverId || !user) return;
    
    try {
      toast.loading('Checking database tables...');
      
      // Check all tables that might contain access information
      const tables = [
        'user_server_access',
        'server_assignments',
        'servers'
      ];
      
      const results: Record<string, any> = {};
      
      for (const table of tables) {
        // Get all records related to this server and user
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .or(`server_id.eq.${serverId},id.eq.${serverId}`);
        
        results[table] = { data, error };
      }
      
      // Also check user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      results['user'] = { data: userData, error: userError };
      
      // Display results
      console.log('Database check results:', results);
      
      // Update debug info
      setAccessCheckDetails({
        ...accessCheckDetails,
        databaseCheck: results
      });
      
      toast.dismiss();
      toast.success('Database check complete. See console for details.');
      
      // If in debug mode, show a more detailed toast
      if (debugMode) {
        toast((t) => (
          <div>
            <p className="font-bold">Database Check Results:</p>
            <ul className="mt-2 text-sm">
              {Object.keys(results).map(table => (
                <li key={table}>
                  {table}: {results[table].data ? 
                    `${Array.isArray(results[table].data) ? results[table].data.length : 1} records` : 
                    'Error'}
                </li>
              ))}
            </ul>
            <button 
              className="mt-2 px-2 py-1 bg-gray-200 rounded text-xs"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(results, null, 2));
                toast.success('Copied to clipboard');
              }}
            >
              Copy to clipboard
            </button>
          </div>
        ), { duration: 10000 });
      }
      
      return results;
    } catch (error) {
      console.error('Error checking database tables:', error);
      toast.error('Failed to check database tables');
      return null;
    }
  };

  useEffect(() => {
    if (serverId && user) {
      fetchServerDetails();
    }
  }, [serverId, user]);

  // Handle session cleanup on component unmount
  useEffect(() => {
    return () => {
      // If there's an active session when navigating away, end it
      if (isActiveSession && activeSessionId) {
        endSession(activeSessionId);
        toast.success('Lab session ended due to navigation');
      }
    };
  }, [isActiveSession, activeSessionId, endSession]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setIframeLoaded(false);
    setIframeError(false);
    
    try {
      // Check time balance first
      await fetchUserTimeBalance();
      
      if (!userTimeBalance || userTimeBalance.balance_hours <= 0) {
        toast.error('You have no time balance remaining');
        setIsRefreshing(false);
        return;
      }
      
      // Try to get secure URL using both methods
      try {
        // First try Edge Function
        const { data: urlData, error: urlError } = await supabase
          .functions.invoke('get-secure-server-url', {
            body: { serverId }
          });
        
        if (urlError) {
          console.error('Edge Function error during refresh:', urlError);
          
          // Fallback to direct proxy service
          console.log('Falling back to direct proxy service during refresh...');
          const directUrl = await getSecureServerUrl(serverId || '');
          
          if (directUrl) {
            setSecureUrl(directUrl);
            // Log access
            await logServerAccess(serverId || '');
            
            // If iframe exists, reload it
            if (iframeRef.current) {
              iframeRef.current.src = directUrl;
            }
            
            console.log('Successfully refreshed URL via direct proxy service');
          } else {
            throw new Error('Failed to refresh secure URL via both methods');
          }
        } else {
          setSecureUrl(urlData?.secureUrl || null);
          
          // If iframe exists, reload it
          if (iframeRef.current) {
            iframeRef.current.src = urlData?.secureUrl || '';
          }
          
          console.log('Successfully refreshed URL via Edge Function');
        }
        
        toast.success('Lab refreshed successfully');
      } catch (urlError) {
        console.error('Error refreshing secure URL:', urlError);
        setErrorType('edge_function');
        toast.error('Failed to establish secure connection to the lab');
        setIframeError(true);
        setIsRefreshing(false);
        return;
      }
    } catch (error) {
      console.error('Error refreshing lab:', error);
      toast.error('Failed to refresh lab');
      setIframeError(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleFullScreen = () => {
    // Simply toggle the fullscreen state
    setIsFullScreen(!isFullScreen);
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
    
    // Security check: If iframe loads but no active session, block access
    if (!isTimerActive || !activeSessionId) {
      console.warn('Security check: iframe loaded without active session');
      // The useEffect above will handle adding the security overlay
    }
  };

  const handleIframeError = () => {
    setIframeLoaded(false);
    setIframeError(true);
    toast.error('Failed to load lab environment');
  };

  // Add debug information to the UI
  const renderDebugInfo = () => {
    if (!debugMode || !accessCheckDetails) return null;
    
    return (
      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        <h3 className="text-lg font-bold mb-2">Debug Information</h3>
        <div className="overflow-auto max-h-96">
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(accessCheckDetails, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  // Add a function to try direct connection
  const tryDirectConnection = async () => {
    if (!serverId || !user) return;
    
    toast.loading('Trying direct connection...');
    setIsLoading(true);
    
    try {
      // Check if user has access to this server first
      if (!hasAccess) {
        toast.error('You need access to this server first');
        return;
      }
      
      // Try to get secure URL using direct proxy service
      const directUrl = await getSecureServerUrl(serverId || '');
      
      if (directUrl) {
        setSecureUrl(directUrl);
        // Log access
        await logServerAccess(serverId || '');
        toast.success('Connected successfully via direct method');
        setErrorType(null);
      } else {
        toast.error('Failed to connect via direct method');
      }
    } catch (error) {
      console.error('Error with direct connection:', error);
      toast.error('Failed to connect via direct method');
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  // Update the session verification useEffect
  useEffect(() => {
    // Function to verify session status
    const verifySessionStatus = () => {
      // If iframe is loaded but no active session, apply security overlay
      if (iframeLoaded && (!isTimerActive || !activeSessionId)) {
        console.warn('Session verification: No active session detected');
        
        // Apply the security overlay
        applySecurityOverlay();
      }
    };
    
    // Add a delay before first verification to avoid race conditions with new sessions
    const initialVerificationTimeout = setTimeout(() => {
      verifySessionStatus();
      
      // Set up periodic session verification (every 10 seconds)
      const intervalId = setInterval(() => {
        console.log('Periodic session verification check');
        verifySessionStatus();
      }, 10000);
      
      // Store the interval ID for cleanup
      return () => {
        clearInterval(intervalId);
      };
    }, 3000); // 3 second delay for initial verification
    
    // Add event listener for when user returns to the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('User returned to the page, verifying session status');
        // Add a small delay to allow state to update
        setTimeout(verifySessionStatus, 1000);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add event listener for when the window regains focus
    const handleFocus = () => {
      console.log('Window regained focus, verifying session status');
      // Add a small delay to allow state to update
      setTimeout(verifySessionStatus, 1000);
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Cleanup event listeners and interval
    return () => {
      clearTimeout(initialVerificationTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [iframeLoaded, isTimerActive, activeSessionId]);

  // Add the security overlay implementation
  const applySecurityOverlay = () => {
    // Create security overlay to prevent unauthorized access
    const securityOverlay = document.createElement('div');
    securityOverlay.id = 'security-overlay';
    securityOverlay.style.position = 'absolute';
    securityOverlay.style.top = '0';
    securityOverlay.style.left = '0';
    securityOverlay.style.width = '100%';
    securityOverlay.style.height = '100%';
    securityOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    securityOverlay.style.zIndex = '2000'; // Higher than any other overlay
    securityOverlay.style.display = 'flex';
    securityOverlay.style.flexDirection = 'column';
    securityOverlay.style.alignItems = 'center';
    securityOverlay.style.justifyContent = 'center';
    securityOverlay.style.pointerEvents = 'all';
    
    const warningIcon = document.createElement('div');
    warningIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`;
    warningIcon.style.color = '#f87171';
    warningIcon.style.marginBottom = '16px';
    
    const message = document.createElement('div');
    message.textContent = 'Session Required';
    message.style.color = 'white';
    message.style.fontSize = '24px';
    message.style.fontWeight = 'bold';
    message.style.marginBottom = '8px';
    
    const subMessage = document.createElement('div');
    subMessage.textContent = 'You must start a session to access this lab';
    subMessage.style.color = '#d1d5db';
    subMessage.style.fontSize = '16px';
    subMessage.style.marginBottom = '24px';
    
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Session';
    startButton.style.backgroundColor = '#10b981';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.padding = '10px 20px';
    startButton.style.borderRadius = '6px';
    startButton.style.fontWeight = 'bold';
    startButton.style.cursor = 'pointer';
    startButton.style.transition = 'background-color 0.2s';
    startButton.onmouseover = () => { startButton.style.backgroundColor = '#059669'; };
    startButton.onmouseout = () => { startButton.style.backgroundColor = '#10b981'; };
    
    // Add click handler to start session
    startButton.onclick = async () => {
      if (!serverId || !userTimeBalance || userTimeBalance.balance_hours <= 0) {
        toast.error('You have no time balance remaining');
        return;
      }
      
      try {
        const sessionId = await startSession(serverId || '');
        if (sessionId) {
          // Remove the security overlay after successful session start
          const overlay = document.getElementById('security-overlay');
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          toast.success('Session started successfully');
        }
      } catch (error) {
        console.error('Error starting session:', error);
        toast.error('Failed to start session');
      }
    };
    
    securityOverlay.appendChild(warningIcon);
    securityOverlay.appendChild(message);
    securityOverlay.appendChild(subMessage);
    securityOverlay.appendChild(startButton);
    
    // Add the overlay to the iframe container
    if (iframeRef.current && iframeRef.current.parentNode) {
      // First remove any existing security overlay
      const existingOverlay = document.getElementById('security-overlay');
      if (existingOverlay && existingOverlay.parentNode) {
        existingOverlay.parentNode.removeChild(existingOverlay);
      }
      
      iframeRef.current.parentNode.appendChild(securityOverlay);
      
      // Log security violation attempt
      console.warn('Security violation: Attempted to access lab without active session');
    }
  };

  // Add a useEffect to enforce strict session security
  useEffect(() => {
    // This effect enforces strict security for iframe access
    // If there's no active session but the iframe is loaded, block access
    if (iframeLoaded && (!isTimerActive || !activeSessionId)) {
      applySecurityOverlay();
    } else if (isTimerActive && activeSessionId) {
      // If session is active, ensure security overlay is removed
      const securityOverlay = document.getElementById('security-overlay');
      if (securityOverlay && securityOverlay.parentNode) {
        securityOverlay.parentNode.removeChild(securityOverlay);
      }
    }
  }, [iframeLoaded, isTimerActive, activeSessionId, serverId, userTimeBalance]);

  // Add a function to check if the session is valid before rendering the iframe
  const isSessionValid = () => {
    // Check both timer active state and session ID
    const hasActiveSession = isTimerActive && activeSessionId !== null;
    
    // Log the session state for debugging
    console.log('Session state check:', { 
      isTimerActive, 
      activeSessionId, 
      hasActiveSession 
    });
    
    return hasActiveSession;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="pt-16"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <div className={`inline-block animate-spin rounded-full h-8 w-8 border-4 ${isDarkMode ? 'border-purple-500 border-t-purple-800' : 'border-purple-600 border-t-transparent'}`}></div>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading lab...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="pt-16"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-red-600">Server not found</p>
            <button
              onClick={() => navigate('/dashboard')}
              className={`mt-4 px-4 py-2 ${isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md transition-colors duration-200`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFullScreen && hasAccess && hasTimeBalance && secureUrl) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex items-center justify-between p-2 bg-gray-900">
          <h1 className="text-white text-lg font-semibold truncate">{server.name}</h1>
          <div className="flex items-center space-x-3">
            {/* Add compact timer in fullscreen mode */}
            <LiveSessionTimer serverId={serverId} compact={true} />
            <CompactSessionControls serverId={serverId} iframeRef={iframeRef} isFullScreen={true} />
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full hover:bg-gray-800 text-gray-300"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-full hover:bg-gray-800 text-gray-300"
            >
              <Minimize className="h-5 w-5" />
            </button>
          </div>
        </div>
        {isSessionValid() ? (
          <iframe
            ref={iframeRef}
            src={secureUrl}
            className="flex-1 w-full h-full border-0"
            title={`${server.name} Lab`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            loading="eager"
          ></iframe>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center p-8 bg-gray-800 rounded-lg max-w-md">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M12 8v4"/>
                  <path d="M12 16h.01"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Session Required</h2>
              <p className="text-gray-300 mb-6">You must start a session to access this lab</p>
              <button
                onClick={() => serverId && startSession(serverId)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                disabled={!serverId || !userTimeBalance || userTimeBalance.balance_hours <= 0}
              >
                Start Session
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'} transition-colors duration-200`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>
        </div>
        
        {/* Replace grid with flex column layout */}
        <div className="flex flex-col space-y-6">
          {/* Main content - now full width */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden transition-colors duration-300`}>
            <div className={`p-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{server.name}</h1>
                {server.description && (
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{server.description}</p>
                )}
              </div>
              
              {hasAccess && hasTimeBalance && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* Add compact timer in the header */}
                  <LiveSessionTimer serverId={serverId} compact={true} />
                  <div className="flex-shrink-0">
                    <CompactSessionControls serverId={serverId} iframeRef={iframeRef} isFullScreen={false} />
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleRefresh}
                      className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors duration-200`}
                      title="Refresh lab"
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={toggleFullScreen}
                      className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ml-2 transition-colors duration-200`}
                      title="Full screen mode"
                    >
                      <Maximize className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <div className="hidden sm:flex items-center text-green-600 bg-green-50 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-300 px-3 py-1 rounded-full">
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Secure</span>
                  </div>
                </div>
              )}
            </div>
            
            {hasAccess ? (
              hasTimeBalance ? (
                secureUrl ? (
                  <div className="h-[calc(100vh-200px)] min-h-[650px] relative">
                    {!iframeLoaded && !iframeError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 dark:bg-gray-900">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Loading lab environment...
                          </p>
                        </div>
                      </div>
                    )}
                    {isSessionValid() ? (
                      <iframe
                        ref={iframeRef}
                        src={secureUrl}
                        className="w-full h-full border-0"
                        title={`${server.name} Lab`}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                        loading="eager"
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
                        <div className="text-center p-8 bg-gray-700 rounded-lg max-w-md">
                          <div className="text-red-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                              <path d="M12 8v4"/>
                              <path d="M12 16h.01"/>
                            </svg>
                          </div>
                          <h2 className="text-xl font-bold text-white mb-2">Session Required</h2>
                          <p className="text-gray-300 mb-6">You must start a session to access this lab</p>
                          <button
                            onClick={() => serverId && startSession(serverId)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                            disabled={!serverId || !userTimeBalance || userTimeBalance.balance_hours <= 0}
                          >
                            Start Session
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`p-6 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    <AlertTriangle className={`h-12 w-12 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} mx-auto mb-4`} />
                    
                    {errorType === 'edge_function' ? (
                      <>
                        <h3 className={`text-lg font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'} mb-2`}>
                          Connection Issue Detected
                        </h3>
                        <p className="mb-4">
                          Unable to establish a secure connection to the lab via Edge Function.
                          This could be a temporary issue with the server.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button
                            onClick={tryDirectConnection}
                            className={`px-4 py-2 ${isDarkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md transition-colors duration-200 flex items-center`}
                          >
                            <Server className="h-4 w-4 mr-2" />
                            Try Direct Connection
                          </button>
                          <button
                            onClick={handleRefresh}
                            className={`px-4 py-2 ${isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md transition-colors duration-200`}
                          >
                            Try Again
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-4">
                          Unable to establish a secure connection to the lab.
                        </p>
                        <button
                          onClick={handleRefresh}
                          className={`px-4 py-2 ${isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md transition-colors duration-200`}
                        >
                          Try Again
                        </button>
                      </>
                    )}
                  </div>
                )
              ) : (
                <div className="p-6 text-center">
                  <div className={`max-w-md mx-auto ${isDarkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'} p-6 rounded-lg border ${isDarkMode ? 'border-red-800' : 'border-red-200'}`}>
                    <AlertTriangle className={`h-12 w-12 ${isDarkMode ? 'text-red-400' : 'text-red-500'} mx-auto mb-4`} />
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'} mb-2`}>
                      No Time Balance Available
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                      You don't have any time balance remaining. Please contact an administrator to add time to your account.
                    </p>
                    <div className="flex items-center justify-center">
                      <Clock className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Time balance: 0 hours
                      </span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="p-6 text-center">
                <div className={`max-w-md mx-auto ${isDarkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'} p-6 rounded-lg border ${isDarkMode ? 'border-red-800' : 'border-red-200'}`}>
                  <AlertTriangle className={`h-12 w-12 ${isDarkMode ? 'text-red-400' : 'text-red-500'} mx-auto mb-4`} />
                  <h3 className={`text-lg font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'} mb-2`}>
                    Access Denied
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    You don't have access to this lab. If you believe this is an error, try refreshing or request access.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={fetchServerDetails}
                      className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-md transition-colors duration-200 flex items-center`}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Access Check
                    </button>
                    {debugMode && (
                      <button
                        onClick={checkDatabaseTables}
                        className={`px-4 py-2 ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors duration-200 flex items-center`}
                      >
                        <Server className="h-4 w-4 mr-2" />
                        Check Database
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/servers')}
                      className={`px-4 py-2 ${isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md transition-colors duration-200`}
                    >
                      Request Access
                    </button>
                  </div>
                  {debugMode && (
                    <div className="mt-4 text-xs text-left">
                      <details>
                        <summary className={`cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Show Access Check Details
                        </summary>
                        <div className="mt-2 p-2 rounded bg-black/20 overflow-auto max-h-60">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(accessCheckDetails, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className={`p-4 ${isDarkMode ? 'bg-gray-700 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t flex justify-between items-center`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Lab ID: {server.id}
              </p>
              {hasAccess && hasTimeBalance && (
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Secure access via CCIE LAB proxy
                </div>
              )}
            </div>
          </div>
          
          {/* Debug information */}
          {renderDebugInfo()}
        </div>
      </div>
    </div>
  );
};

export default LabPage;