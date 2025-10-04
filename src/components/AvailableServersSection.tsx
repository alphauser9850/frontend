import React, { useEffect, useState } from 'react';
import { useServerStore } from '../store/serverStore';
import ServerCard from './ServerCard';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Server, AlertCircle, Search, Filter } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

const AvailableServersSection: React.FC = () => {
  const { servers, fetchServers, isLoading } = useServerStore();
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

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
    <div className="mt-6">
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
    </div>
  );
};

export default AvailableServersSection; 