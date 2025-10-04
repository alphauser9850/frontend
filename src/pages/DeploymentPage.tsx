import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

export default function DeploymentPage() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: 'idle',
    message: 'Ready to deploy'
  });
  const [isDeploying, setIsDeploying] = useState(false);

  // Load last deployment info on component mount
  useEffect(() => {
    fetchLastDeployment();
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

  const handleDeploy = async () => {
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

  const getStatusIcon = () => {
    switch (deploymentStatus.status) {
      case 'deploying':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (deploymentStatus.status) {
      case 'deploying':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Deploying</Badge>;
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6" />
              Production Deployment
            </CardTitle>
            <CardDescription>
              Automate the deployment process for production server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <p className="font-medium">{deploymentStatus.message}</p>
                  <p className="text-sm text-gray-500">
                    Status: {getStatusBadge()}
                  </p>
                </div>
              </div>
            </div>

            {/* Last Deployment Info */}
            {deploymentStatus.lastDeployment && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Last Deployment</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Time:</span> {formatTimestamp(deploymentStatus.lastDeployment.timestamp)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> 
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 ${
                        deploymentStatus.lastDeployment.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {deploymentStatus.lastDeployment.status}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-medium">Message:</span> {deploymentStatus.lastDeployment.message}
                  </p>
                </div>
              </div>
            )}

            {/* Deployment Steps */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Deployment Process</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Pull latest changes from repository</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Build production assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Restart production service</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Verify service status</span>
                </div>
              </div>
            </div>

            {/* Deploy Button */}
            <Button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full"
              size="lg"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Deploy to Production
                </>
              )}
            </Button>

            {/* Warning */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This will deploy changes to the production server. 
                Make sure all changes have been tested and committed to the repository.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
