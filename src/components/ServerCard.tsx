import React from 'react';
import { Server, ExternalLink, Lock, X } from 'lucide-react';
import { useServerStore } from '../store/serverStore';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';
import { useThemeStore } from '../store/themeStore';

interface ServerCardProps {
  id: string;
  name: string;
  description: string | null;
  url: string;
  isAssigned: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  showRequestButton?: boolean;
  showAccessButton?: boolean;
  assignmentId?: string;
}

const ServerCard: React.FC<ServerCardProps> = ({
  id,
  name,
  description,
  url,
  isAssigned,
  status,
  showRequestButton = false,
  showAccessButton = false,
  assignmentId,
}) => {
  const { requestServer, unassignServer } = useServerStore();
  const { isDarkMode } = useThemeStore();

  const handleRequestServer = () => {
    requestServer(id);
  };

  const handleUnassignServer = () => {
    if (assignmentId && confirm('Are you sure you want to unassign this server?')) {
      unassignServer(assignmentId);
    }
  };

  const getStatusBadge = () => {
    if (!status) return null;
    
    const statusColors = {
      pending: isDarkMode 
        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
        : 'bg-yellow-100 text-yellow-800',
      approved: isDarkMode 
        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
        : 'bg-green-100 text-green-800',
      rejected: isDarkMode 
        ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
        : 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Determine beam colors based on status
  const getBeamClassName = () => {
    if (!status) return "";
    
    switch(status) {
      case 'approved':
        return "from-transparent via-green-500/40 to-transparent";
      case 'pending':
        return "from-transparent via-yellow-500/40 to-transparent";
      case 'rejected':
        return "from-transparent via-red-500/40 to-transparent";
      default:
        return "";
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 p-0"
      withBeam={!!status}
      beamClassName={getBeamClassName()}
      beamDuration={8}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={cn(
              "p-2 rounded-lg mr-3",
              isDarkMode ? "bg-primary/20" : "bg-primary/10"
            )}>
              <Server className="h-6 w-6 text-primary" />
            </div>
            <h3 className={isDarkMode ? "text-lg font-semibold text-white" : "text-lg font-semibold text-gray-800"}>
              {name}
            </h3>
          </div>
          {getStatusBadge()}
        </div>
        
        {description && (
          <p className={isDarkMode ? "mt-3 text-white/70 text-sm" : "mt-3 text-gray-600 text-sm"}>
            {description}
          </p>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          {showRequestButton && !isAssigned && !status && (
            <button
              onClick={handleRequestServer}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm transition-colors duration-200"
            >
              Request Access
            </button>
          )}
          
          {showAccessButton && status === 'approved' && (
            <>
              <Link
                to={`/lab/${id}`}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center transition-colors duration-200"
              >
                Access Lab <Lock className="ml-1 h-4 w-4" />
              </Link>
              
              {assignmentId && (
                <button
                  onClick={handleUnassignServer}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center transition-colors duration-200"
                >
                  Unassign <X className="ml-1 h-4 w-4" />
                </button>
              )}
            </>
          )}
          
          {status === 'pending' && (
            <div className={isDarkMode 
              ? "text-sm text-yellow-300 flex items-center" 
              : "text-sm text-yellow-600 flex items-center"
            }>
              Your request is pending approval
            </div>
          )}
          
          {status === 'rejected' && (
            <div className={isDarkMode 
              ? "text-sm text-red-300 flex items-center" 
              : "text-sm text-red-600 flex items-center"
            }>
              Your request was rejected
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServerCard;