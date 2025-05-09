import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimeStore, UserTimeData } from '../store/timeStore';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import { 
  Clock, Search, Filter, Plus, History, Users, Check, 
  AlertTriangle, Download, Upload, ClipboardList
} from 'lucide-react';
import toast from 'react-hot-toast';

const TimeManagementPage: React.FC = () => {
  const { 
    allUserTimeData, 
    fetchAllUserTimeData, 
    addTimeBalance, 
    deductTimeBalance,
    batchAddTimeBalance,
    fetchTimeBalanceHistory,
    timeBalanceHistory,
    isLoading 
  } = useTimeStore();
  
  const { isAdmin } = useAuthStore();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [showBatchAddModal, setShowBatchAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [timeAmount, setTimeAmount] = useState<number>(1);
  const [isDeductMode, setIsDeductMode] = useState<boolean>(false);
  const [timeNotes, setTimeNotes] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    fetchAllUserTimeData();
    fetchTimeBalanceHistory();
    
    // Check for dark mode preference
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    }
  }, [isAdmin, navigate, fetchAllUserTimeData, fetchTimeBalanceHistory]);
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const filteredUsers = allUserTimeData.filter(user => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply role filter
    const matchesRole = userFilter === 'all' || 
      (userFilter === 'admin' && user.role === 'admin') ||
      (userFilter === 'user' && user.role === 'user');
    
    return matchesSearch && matchesRole;
  });
  
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  const openAddTimeModal = (userId: string, userName: string, deduct: boolean = false) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName || 'User');
    setTimeAmount(1);
    setIsDeductMode(deduct);
    setTimeNotes('');
    setShowAddTimeModal(true);
  };
  
  const openBatchAddModal = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    
    setTimeAmount(1);
    setTimeNotes('');
    setShowBatchAddModal(true);
  };
  
  const openHistoryModal = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName || 'User');
    setShowHistoryModal(true);
    fetchTimeBalanceHistory();
  };
  
  const handleAddTime = async () => {
    if (!selectedUserId) return;
    
    if (timeAmount <= 0) {
      toast.error('Time amount must be greater than 0');
      return;
    }
    
    try {
      if (isDeductMode) {
        await deductTimeBalance(selectedUserId, timeAmount, timeNotes);
      } else {
        await addTimeBalance(selectedUserId, timeAmount, timeNotes);
      }
      
      setShowAddTimeModal(false);
      fetchAllUserTimeData();
    } catch (error) {
      console.error('Error managing time balance:', error);
      toast.error('Failed to update time balance');
    }
  };
  
  const handleBatchAddTime = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    
    if (timeAmount <= 0) {
      toast.error('Time amount must be greater than 0');
      return;
    }
    
    try {
      await batchAddTimeBalance(selectedUsers, timeAmount, timeNotes);
      setShowBatchAddModal(false);
      setSelectedUsers([]);
      fetchAllUserTimeData();
    } catch (error) {
      console.error('Error batch adding time:', error);
      toast.error('Failed to update time balances');
    }
  };
  
  const exportUserData = () => {
    const dataToExport = filteredUsers.map(user => ({
      id: user.id,
      name: user.full_name || 'N/A',
      email: user.email,
      role: user.role,
      balance_hours: user.balance_hours
    }));
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `time_balance_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getUserHistoryItems = () => {
    if (!selectedUserId) return [];
    return timeBalanceHistory.filter(item => item.user_id === selectedUserId);
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <div className="pt-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Time Balance Management
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage user time credits and view usage history
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'} transition-colors duration-200`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={exportUserData}
              className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} text-white flex items-center transition-colors duration-200`}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden mb-8 transition-colors duration-300`}>
          <div className={`p-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300`}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value as 'all' | 'admin' | 'user')}
                    className={`border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 py-2 px-3 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    } transition-colors duration-300`}
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Admins Only</option>
                    <option value="user">Regular Users Only</option>
                  </select>
                </div>
                
                <button
                  onClick={openBatchAddModal}
                  disabled={selectedUsers.length === 0}
                  className={`px-4 py-2 rounded-md ${
                    selectedUsers.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'
                  } text-white flex items-center transition-colors duration-200`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Batch Add Time
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 ${isDarkMode ? 'border-purple-500 border-t-purple-800' : 'border-purple-600 border-t-transparent'}`}></div>
              <p className="mt-4">Loading user data...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={handleSelectAllUsers}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </div>
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      User
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Role
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Time Balance
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 ${isDarkMode ? 'bg-gray-600' : 'bg-purple-100'} rounded-full flex items-center justify-center`}>
                            <Users className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {user.full_name || 'N/A'}
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800' 
                            : isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          user.balance_hours <= 0 
                            ? 'text-red-500' 
                            : user.balance_hours < 1 
                              ? 'text-orange-500' 
                              : isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {user.balance_hours.toFixed(1)} hours
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openAddTimeModal(user.id, user.full_name || user.email, false)}
                            className={`p-1 rounded-md ${isDarkMode ? 'text-green-400 hover:text-green-300 hover:bg-gray-700' : 'text-green-600 hover:text-green-900 hover:bg-green-50'}`}
                            title="Add Time"
                          >
                            <Upload className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openAddTimeModal(user.id, user.full_name || user.email, true)}
                            className={`p-1 rounded-md ${isDarkMode ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' : 'text-red-600 hover:text-red-900 hover:bg-red-50'}`}
                            title="Deduct Time"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openHistoryModal(user.id, user.full_name || user.email)}
                            className={`p-1 rounded-md ${isDarkMode ? 'text-purple-400 hover:text-purple-300 hover:bg-gray-700' : 'text-purple-600 hover:text-purple-900 hover:bg-purple-50'}`}
                            title="View History"
                          >
                            <History className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className={`mt-2 text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>No users found</h3>
              <p className="mt-1">
                {searchTerm ? 'No users match your search criteria.' : 'There are no users in the system.'}
              </p>
            </div>
          )}
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden transition-colors duration-300`}>
          <div className={`p-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex items-center`}>
            <ClipboardList className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Time Management Guidelines
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg transition-colors duration-300`}>
                <h3 className={`text-lg font-medium mb-2 flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <Clock className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  Time Allocation
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    Assign time credits based on user needs and course requirements
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    Use batch assignment for class-wide time allocation
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    Consider course duration when allocating time
                  </li>
                </ul>
              </div>
              
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg transition-colors duration-300`}>
                <h3 className={`text-lg font-medium mb-2 flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <AlertTriangle className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                  Time Restrictions
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    Users are automatically disconnected when time balance reaches zero
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    Warning notifications appear when balance is below 1 hour
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    Time is deducted in real-time during active lab sessions
                  </li>
                </ul>
              </div>
              
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg transition-colors duration-300`}>
                <h3 className={`text-lg font-medium mb-2 flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <History className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  Audit & Tracking
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    All time balance changes are logged with timestamps
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    Session duration is tracked and recorded
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    Export data for reporting and analysis
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add/Deduct Time Modal */}
      {showAddTimeModal && selectedUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md transition-colors duration-300`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {isDeductMode ? 'Deduct Time Balance' : 'Add Time Balance'} for {selectedUserName}
            </h3>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Amount (hours)
              </label>
              <input
                type="number"
                value={timeAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value)) return;
                  setTimeAmount(value);
                }}
                min="0.1"
                step="0.1"
                className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes
              </label>
              <textarea
                value={timeNotes}
                onChange={(e) => setTimeNotes(e.target.value)}
                rows={3}
                className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter reason for time adjustment"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddTimeModal(false)}
                className={`px-4 py-2 border rounded-md ${
                  isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTime}
                className={`px-4 py-2 rounded-md text-white ${
                  isDeductMode 
                    ? isDarkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700' 
                    : isDarkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isDeductMode ? 'Deduct Time' : 'Add Time'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Batch Add Time Modal */}
      {showBatchAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md transition-colors duration-300`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Batch Add Time
            </h3>
            
            <div className="mb-4">
              <div className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Adding time to <span className="font-semibold">{selectedUsers.length}</span> selected users
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Amount (hours)
              </label>
              <input
                type="number"
                value={timeAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value)) return;
                  setTimeAmount(value);
                }}
                min="0.1"
                step="0.1"
                className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes
              </label>
              <textarea
                value={timeNotes}
                onChange={(e) => setTimeNotes(e.target.value)}
                rows={3}
                className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter reason for time adjustment"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBatchAddModal(false)}
                className={`px-4 py-2 border rounded-md ${
                  isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleBatchAddTime}
                className={`px-4 py-2 rounded-md text-white ${
                  isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Add Time to All
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* History Modal */}
      {showHistoryModal && selectedUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Time Balance History for {selectedUserName}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className={`inline-block animate-spin rounded-full h-8 w-8 border-4 ${isDarkMode ? 'border-purple-500 border-t-purple-800' : 'border-purple-600 border-t-transparent'}`}></div>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading history...</p>
              </div>
            ) : (
              <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Date & Time
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Change
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Balance After
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Type
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                    {getUserHistoryItems().length > 0 ? (
                      getUserHistoryItems().map((item) => (
                        <tr key={item.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {formatDateTime(item.created_at)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            item.amount_hours > 0 
                              ? isDarkMode ? 'text-green-400' : 'text-green-600' 
                              : isDarkMode ? 'text-red-400' : 'text-red-600'
                          }`}>
                            {item.amount_hours > 0 ? '+' : ''}{item.amount_hours.toFixed(1)} hours
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {item.balance_after.toFixed(1)} hours
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.operation_type === 'add' 
                                ? isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                : item.operation_type === 'deduct' 
                                  ? isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                  : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.operation_type}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {item.notes || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No history records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeManagementPage;