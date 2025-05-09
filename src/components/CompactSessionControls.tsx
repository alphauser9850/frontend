import React, { useState, useEffect } from 'react';
import { Play, StopCircle } from 'lucide-react';
import { useTimeStore } from '../store/timeStore';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface CompactSessionControlsProps {
  serverId?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
  isFullScreen?: boolean;
}

const CompactSessionControls: React.FC<CompactSessionControlsProps> = ({ 
  serverId, 
  iframeRef,
  isFullScreen = false
}) => {
  const navigate = useNavigate();
  const { 
    isTimerActive,
    activeSessionId,
    startSession,
    endSession,
    userTimeBalance,
    verifyActiveSession,
    fetchUserTimeBalance
  } = useTimeStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Function to disable iframe interaction
  const disableIframeInteraction = () => {
    if (iframeRef?.current) {
      // Remove any existing overlay first to prevent duplicates
      enableIframeInteraction();
      
      // Create an overlay div to prevent interaction
      const overlay = document.createElement('div');
      overlay.id = isFullScreen ? 'iframe-overlay-fullscreen' : 'iframe-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '1000';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.pointerEvents = 'all'; // Ensure it blocks all interactions
      
      const message = document.createElement('div');
      message.textContent = 'Session ended';
      message.style.color = 'white';
      message.style.fontSize = '24px';
      message.style.fontWeight = 'bold';
      message.style.padding = '20px';
      message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      message.style.borderRadius = '8px';
      
      overlay.appendChild(message);
      
      // Add the overlay as a sibling to the iframe
      if (iframeRef.current.parentNode) {
        iframeRef.current.parentNode.appendChild(overlay);
      }
    }
  };
  
  // Function to enable iframe interaction
  const enableIframeInteraction = () => {
    // Remove both possible overlay IDs to ensure cleanup in both modes
    const regularOverlay = document.getElementById('iframe-overlay');
    if (regularOverlay && regularOverlay.parentNode) {
      regularOverlay.parentNode.removeChild(regularOverlay);
    }
    
    const fullscreenOverlay = document.getElementById('iframe-overlay-fullscreen');
    if (fullscreenOverlay && fullscreenOverlay.parentNode) {
      fullscreenOverlay.parentNode.removeChild(fullscreenOverlay);
    }
  };
  
  // Effect to verify session status when component mounts
  useEffect(() => {
    // Check if we have an active session that matches what we expect
    const checkSessionStatus = async () => {
      // If we claim to have an active session, verify it
      if (isTimerActive && activeSessionId) {
        try {
          // Add a small delay to allow the database to update
          // This prevents race conditions where verification happens before the session is fully saved
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // If verifyActiveSession exists in timeStore, use it
          if (typeof verifyActiveSession === 'function') {
            const isValid = await verifyActiveSession(activeSessionId);
            if (!isValid) {
              console.error('Session verification failed: Session is not valid');
              // Force end the invalid session
              if (activeSessionId) {
                await endSession(activeSessionId);
                toast.error('Your session was invalid and has been ended');
              }
            }
          } else {
            // Simple check - just ensure the activeSessionId is valid
            if (!activeSessionId) {
              console.error('Session verification failed: No active session ID');
              toast.error('Session verification failed');
            }
          }
        } catch (error) {
          console.error('Error verifying session:', error);
        }
      }
    };
    
    // Don't run verification immediately on component mount
    // Instead, set a timeout to run it after a delay
    const verificationTimeout = setTimeout(checkSessionStatus, 2000);
    
    // Clean up the timeout when the component unmounts
    return () => {
      clearTimeout(verificationTimeout);
    };
  }, [isTimerActive, activeSessionId, endSession, verifyActiveSession]);
  
  // Effect to clean up overlay when component unmounts
  useEffect(() => {
    return () => {
      enableIframeInteraction();
    };
  }, []);
  
  const handleStartSession = async () => {
    if (!serverId) {
      console.error('Cannot start session: No server ID provided');
      return;
    }
    
    if (!userTimeBalance || userTimeBalance.balance_hours <= 0) {
      toast.error('You have no time balance remaining');
      return;
    }
    
    // Prevent multiple clicks
    if (isProcessing) {
      console.log('Ignoring start request: Already processing');
      return;
    }
    
    console.log('Starting session for server:', serverId);
    setIsProcessing(true);
    
    try {
      const sessionId = await startSession(serverId);
      console.log('Session started with ID:', sessionId);
      
      if (sessionId) {
        enableIframeInteraction();
        toast.success('Session started successfully');
        
        // Log the current session state
        console.log('Current session state after start:', {
          isTimerActive,
          activeSessionId,
          sessionId
        });
      } else {
        console.error('Failed to start session: No session ID returned');
        toast.error('Failed to start session');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndSession = async () => {
    if (!activeSessionId) return;
    
    // Prevent multiple clicks
    if (isProcessing) return;
    
    if (!confirm('Are you sure you want to end this session? This will stop the timer and save your remaining time.')) {
      return;
    }
    
    setIsProcessing(true);
    try {
      await endSession(activeSessionId);
      
      // Explicitly fetch the updated time balance after ending the session
      await fetchUserTimeBalance();
      
      // Disable iframe interaction
      disableIframeInteraction();
      
      // Clear any existing toasts to prevent multiple notifications
      toast.dismiss();
      toast.success('Session ended successfully');
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Failed to end session');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {!isTimerActive ? (
        <button
          onClick={handleStartSession}
          disabled={!serverId || !userTimeBalance || userTimeBalance.balance_hours <= 0 || isProcessing}
          className={cn(
            "p-2 rounded-full text-white transition-colors",
            !serverId || !userTimeBalance || userTimeBalance.balance_hours <= 0 || isProcessing
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          )}
          title="Start Session"
        >
          {isProcessing ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>
      ) : (
        <button
          onClick={handleEndSession}
          disabled={isProcessing}
          className={cn(
            "p-2 rounded-full text-white transition-colors",
            isProcessing ? "opacity-70" : "",
            "bg-red-600 hover:bg-red-700"
          )}
          title="End Session & Return to Dashboard"
        >
          {isProcessing ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <StopCircle className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default CompactSessionControls; 