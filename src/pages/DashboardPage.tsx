import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useServerStore } from '../store/serverStore';
import { useNotificationStore } from '../store/notificationStore';
import ServerCard from '../components/ServerCard';
import PageWrapper from '../components/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Server, AlertCircle } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import EnrolledCoursesSection from '../components/EnrolledCoursesSection';
import TimeBalanceCard from '../components/TimeBalanceCard';
import AvailableServersSection from '../components/AvailableServersSection';

const DashboardPage: React.FC = () => {
  const { profile } = useAuthStore();
  const { userAssignments, fetchUserAssignments, isLoading } = useServerStore();
  const { subscribeToNotifications } = useNotificationStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    fetchUserAssignments();
    const unsubscribe = subscribeToNotifications();
    return () => unsubscribe();
  }, [fetchUserAssignments, subscribeToNotifications]);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || 'User'}</h1>
        <p className={isDarkMode ? "text-white/70 mt-1" : "text-gray-600 mt-1"}>
          Manage your Cisco CML lab access and requests
        </p>
      </div>
      
      {/* Time Balance Card */}
      <div className="mb-6">
        <TimeBalanceCard />
      </div>
      
      <Card 
        withBeam 
        beamDuration={8}
        beamClassName="from-transparent via-primary/40 to-transparent"
      >
        <CardHeader>
          <CardTitle>
            <Server className="h-5 w-5 mr-2 text-primary" />
            Your Lab Servers
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className={isDarkMode ? "mt-2 text-white/70" : "mt-2 text-gray-600"}>Loading your servers...</p>
            </div>
          ) : userAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAssignments.map((assignment) => (
                <ServerCard
                  key={assignment.id}
                  id={assignment.server?.id || ''}
                  name={assignment.server?.name || ''}
                  description={assignment.server?.description || null}
                  url={assignment.server?.url || ''}
                  isAssigned={assignment.server?.is_assigned || false}
                  status={assignment.status}
                  showAccessButton={true}
                  assignmentId={assignment.id}
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
                No servers assigned
              </h3>
              <p className={isDarkMode ? "mt-1 text-white/50" : "mt-1 text-gray-500"}>
                You don't have any servers assigned yet. Check out the available servers below to request access.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Available Servers Section */}
      <AvailableServersSection />
      
      {/* Enrolled Courses Section */}
      <EnrolledCoursesSection />
    </PageWrapper>
  );
};

export default DashboardPage;