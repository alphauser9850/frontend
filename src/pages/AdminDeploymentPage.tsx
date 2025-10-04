import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, RefreshCw, Terminal } from 'lucide-react';

interface DeploymentStatus {
  status: 'idle' | 'deploying' | 'success' | 'error';
  message: string;
  lastDeployment?: string;
  logs: string[];
}

export default function AdminDeploymentPage() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: 'idle',
    message: '',
    logs: []
  });

  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    fetchLastDeployment();
  }, []);

  const fetchLastDeployment = async () => {
    try {
      const response = await fetch('/api/admin/last-deployment');
      if (response.ok) {
        const data = await response.json();
        setDeploymentStatus(prev => ({
          ...prev,
          lastDeployment: data.lastDeployment
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
      message: 'Starting deployment...',
      logs: ['Initializing deployment process...']
    });

    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDeploymentStatus({
          status: 'success',
          message: 'Deployment completed successfully!',
          lastDeployment: data.timestamp,
          logs: data.logs || []
        });
      } else {
        setDeploymentStatus({
          status: 'error',
          message: data.error || 'Deployment failed',
          logs: data.logs || []
        });
      }
    } catch (error) {
      setDeploymentStatus({
        status: 'error',
        message: 'Network error during deployment',
        logs: [`Error: ${error}`]
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = () => {
    switch (deploymentStatus.status) {
      case 'deploying':
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
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
        return <Badge variant="outline">Idle</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Deployment</h1>
          <p className="text-gray-600">Automated deployment system for production updates</p>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon()}
                Deployment Status
              </CardTitle>
              <CardDescription>
                Current deployment status and last deployment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge()}
              </div>
              
              {deploymentStatus.lastDeployment && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Last Deployment:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(deploymentStatus.lastDeployment).toLocaleString()}
                  </span>
                </div>
              )}

              {deploymentStatus.message && (
                <div className="p-3 bg-gray-100 rounded-md">
                  <p className="text-sm">{deploymentStatus.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deploy Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Deploy to Production
              </CardTitle>
              <CardDescription>
                Pull latest changes, build, and restart the production server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className="w-full"
                size="lg"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Deploy Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Deployment Logs */}
          {deploymentStatus.logs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Deployment Logs</CardTitle>
                <CardDescription>
                  Real-time deployment process logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm max-h-96 overflow-y-auto">
                  {deploymentStatus.logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
