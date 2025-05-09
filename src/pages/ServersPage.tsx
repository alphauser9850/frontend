import React, { useEffect, useState } from 'react';
import { useServerStore } from '../store/serverStore';
import { useTimeStore } from '../store/timeStore';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import ServerCard from '../components/ServerCard';
import PageWrapper from '../components/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Server, AlertCircle, Search, Filter, Clock } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

const ServersPage: React.FC = () => {
  const { servers, fetchServers, isLoading } = useServerStore();
  const { userTimeBalance, fetchUserTimeBalance } = useTimeStore();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Redirect logged-in users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchServers();
    fetchUserTimeBalance();
  }, [fetchServers, fetchUserTimeBalance]);

  // Filter servers based on search term and filter status
  const filteredServers = servers.filter(server => {
    const matchesSearch = 
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (server.description && server.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!filterStatus) return matchesSearch;
    
    if (filterStatus === 'assigned') {
      return matchesSearch && server.is_assigned;
    } else if (filterStatus === 'available') {
      return matchesSearch && !server.is_assigned;
    }
    
    return matchesSearch;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status: string | null) => {
    setFilterStatus(status === filterStatus ? null : status);
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Available Servers</h1>
        <p className={isDarkMode ? "text-white/70 mt-1" : "text-gray-600 mt-1"}>
          Browse and request access to Cisco CML lab servers
        </p>
      </div>
      
      {/* Time Balance Card */}
      <div className="mb-6">
        <Card 
          className={cn(
            "overflow-hidden border",
            isDarkMode 
              ? "border-primary-800 bg-primary-900/20" 
              : "border-primary-100 bg-primary-50"
          )}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn(
                "p-2 rounded-full mr-3",
                isDarkMode ? "bg-primary-800" : "bg-primary-100"
              )}>
                <Clock className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h3 className={cn(
                  "font-medium",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  Your Time Balance
                </h3>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-white/70" : "text-gray-600"
                )}>
                  Available time for lab sessions
                </p>
              </div>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-primary-400" : "text-primary-600"
            )}>
              {userTimeBalance 
                ? `${userTimeBalance.balance_hours.toFixed(1)} hours` 
                : "Loading..."}
            </div>
          </div>
        </Card>
      </div>
      
      <Card 
        withBeam 
        beamDuration={10}
        beamClassName="from-transparent via-blue-500/40 to-transparent"
      >
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2 text-primary" />
              Available Lab Servers
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className={cn(
                "relative rounded-md shadow-sm",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={cn(
                    "h-4 w-4",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )} />
                </div>
                <input
                  type="text"
                  placeholder="Search servers..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 rounded-md text-sm focus:ring-2 focus:outline-none",
                    isDarkMode 
                      ? "bg-gray-800 text-white border-gray-700 focus:ring-primary-500" 
                      : "bg-white text-gray-900 border-gray-300 focus:ring-primary-500"
                  )}
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    filterStatus === null
                      ? isDarkMode 
                        ? "bg-primary-700 text-white" 
                        : "bg-primary-100 text-primary-800"
                      : isDarkMode 
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                        : "bg-white text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('assigned')}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    filterStatus === 'assigned'
                      ? isDarkMode 
                        ? "bg-primary-700 text-white" 
                        : "bg-primary-100 text-primary-800"
                      : isDarkMode 
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                        : "bg-white text-gray-700 hover:bg-gray-100"
                  )}
                >
                  Assigned
                </button>
                <button
                  onClick={() => handleFilterChange('available')}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    filterStatus === 'available'
                      ? isDarkMode 
                        ? "bg-primary-700 text-white" 
                        : "bg-primary-100 text-primary-800"
                      : isDarkMode 
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                        : "bg-white text-gray-700 hover:bg-gray-100"
                  )}
                >
                  Available
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className={isDarkMode ? "mt-2 text-white/70" : "mt-2 text-gray-600"}>
                Loading servers...
              </p>
            </div>
          ) : filteredServers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServers.map((server) => (
                <ServerCard
                  key={server.id}
                  id={server.id}
                  name={server.name}
                  description={server.description}
                  url={server.url}
                  isAssigned={server.is_assigned}
                  showRequestButton={!server.is_assigned}
                  showAccessButton={server.is_assigned}
                />
              ))}
            </div>
          ) : (
            <div className={cn(
              "text-center py-8 rounded-lg",
              isDarkMode 
                ? "bg-white/5 border border-white/10" 
                : "bg-gray-50"
            )}>
              <AlertCircle className={isDarkMode ? "h-12 w-12 text-white/40 mx-auto" : "h-12 w-12 text-gray-400 mx-auto"} />
              <h3 className={isDarkMode ? "mt-2 text-lg font-medium text-white" : "mt-2 text-lg font-medium text-gray-900"}>
                {searchTerm 
                  ? "No matching servers found" 
                  : "No servers available"}
              </h3>
              <p className={isDarkMode ? "mt-1 text-white/50" : "mt-1 text-gray-500"}>
                {searchTerm 
                  ? "Try adjusting your search or filter criteria" 
                  : "There are no servers available at the moment. Please check back later."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

export default ServersPage;