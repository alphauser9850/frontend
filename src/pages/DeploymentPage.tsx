import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock, FileText, GitCommit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '@/store/themeStore';

interface DeploymentStatus {
  status: 'idle' | 'deploying' | 'success' | 'error';
  message: string;
  timestamp?: string;
  lastDeployment?: {
    timestamp: string;
    status: 'success' | 'error';
    message: string;
  };
}

interface CommitHistory {
  hash: string;
  message: string;
  author: string;
  timestamp: string;
}

interface DeploymentNote {
  timestamp: string;
  notes: string;
  deploymentId: string;
}

export default function DeploymentPage() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: 'idle',
    message: 'Ready to deploy'
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentNotes, setDeploymentNotes] = useState('');
  const [commitHistory, setCommitHistory] = useState<CommitHistory[]>([]);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentNote[]>([]);
  const { isDarkMode } = useThemeStore();

  // Load data on component mount
  useEffect(() => {
    fetchLastDeployment();
    fetchCommitHistory();
    fetchDeploymentHistory();
  }, []);

  const fetchLastDeployment = async () => {
    try {
      const response = await fetch('/api/deployment/last');
      if (response.ok) {
        const data = await response.json();
        setDeploymentStatus(prev => ({
          ...prev,
          lastDeployment: data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch last deployment:', error);
    }
  };

  const fetchCommitHistory = async () => {
    try {
      const response = await fetch('/api/deployment/commits');
      if (response.ok) {
        const data = await response.json();
        setCommitHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch commit history:', error);
    }
  };

  const fetchDeploymentHistory = async () => {
    try {
      const response = await fetch('/api/deployment/notes');
      if (response.ok) {
        const data = await response.json();
        setDeploymentHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch deployment history:', error);
    }
  };

  const handleDeploy = async () => {
    if (!deploymentNotes.trim()) {
      toast.error('Please add deployment notes before deploying');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus({
      status: 'deploying',
      message: 'Starting deployment...'
    });

    try {
      const response = await fetch('/api/deployment/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: deploymentNotes })
      });

      const data = await response.json();

      if (response.ok) {
        setDeploymentStatus({
          status: 'success',
          message: data.message,
          timestamp: new Date().toISOString(),
          lastDeployment: {
            timestamp: new Date().toISOString(),
            status: 'success',
            message: data.message
          }
        });
        
        // Save deployment notes
        await saveDeploymentNotes(deploymentNotes);
        setDeploymentNotes('');
        
        // Refresh data
        fetchCommitHistory();
        fetchDeploymentHistory();
        
        toast.success('Deployment completed successfully!');
      } else {
        throw new Error(data.message || 'Deployment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDeploymentStatus({
        status: 'error',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        lastDeployment: {
          timestamp: new Date().toISOString(),
          status: 'error',
          message: errorMessage
        }
      });
      toast.error(`Deployment failed: ${errorMessage}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const saveDeploymentNotes = async (notes: string) => {
    try {
      await fetch('/api/deployment/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes, timestamp: new Date().toISOString() })
      });
    } catch (error) {
      console.error('Failed to save deployment notes:', error);
    }
  };

  const getStatusIcon = () => {
    switch (deploymentStatus.status) {
      case 'deploying':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (deploymentStatus.status) {
      case 'deploying':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Deploying</Badge>;
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Success</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Error</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatCommitTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Commit History */}
          <div className="lg:col-span-1">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <GitCommit className="h-5 w-5" />
                  Recent Commits
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Live commit history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {commitHistory.map((commit, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {commit.message}
                      </div>
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {commit.author} • {formatCommitTime(commit.timestamp)}
                      </div>
                      <div className={`text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {commit.hash.substring(0, 8)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`text-3xl font-bold flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <RefreshCw className="h-8 w-8" />
                  Production Deployment
                </CardTitle>
                <CardDescription className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Automate the deployment process for production server
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Current Status */}
                <div className={`flex items-center justify-between p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    {getStatusIcon()}
                    <div>
                      <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {deploymentStatus.message}
                      </p>
                      <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Status: {getStatusBadge()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Deployment Info */}
                {deploymentStatus.lastDeployment && (
                  <div className={`p-6 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Last Deployment</h3>
                    <div className="space-y-2 text-lg">
                      <p>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Time:</span> 
                        <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {formatTimestamp(deploymentStatus.lastDeployment.timestamp)}
                        </span>
                      </p>
                      <p>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Status:</span> 
                        <Badge 
                          variant="secondary" 
                          className={`ml-2 ${
                            deploymentStatus.lastDeployment.status === 'success' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {deploymentStatus.lastDeployment.status}
                        </Badge>
                      </p>
                      <p>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Message:</span> 
                        <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {deploymentStatus.lastDeployment.message}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Deployment Notes Form */}
                <div className={`p-6 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <FileText className="h-5 w-5" />
                    Deployment Notes
                  </h3>
                  <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    What changes are you deploying? What has the dev team worked on?
                  </p>
                  <textarea
                    value={deploymentNotes}
                    onChange={(e) => setDeploymentNotes(e.target.value)}
                    placeholder="Describe the changes, features, or fixes being deployed..."
                    className={`w-full p-4 rounded-lg border text-lg resize-none ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                    rows={4}
                  />
                </div>

                {/* Deployment Steps */}
                <div className={`p-6 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Deployment Process</h3>
                  <div className="space-y-3 text-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Pull latest changes from repository</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Build production assets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Verify service status</span>
                    </div>
                  </div>
                </div>

                {/* Deploy Button */}
                <Button 
                  onClick={handleDeploy}
                  disabled={isDeploying || !deploymentNotes.trim()}
                  className="w-full text-xl py-6"
                  size="lg"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-3 h-6 w-6" />
                      Deploy to Production
                    </>
                  )}
                </Button>

                {/* Warning */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <p className={`text-lg ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                    <strong>Warning:</strong> This will deploy changes to the production server. 
                    Make sure all changes have been tested and committed to the repository.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}