import React, { useState } from 'react';
import { Save, User, Mail, Key, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    language: 'en',
    timezone: 'UTC'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailSettings, setEmailSettings] = useState({
    notifyOnNewEmail: true,
    dailyDigest: false,
    autoArchive: false,
    showUnread: true
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error',
    message: string
  } | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: checked }));
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Saving profile data:', profileData);
    
    // Show notification
    setNotification({
      type: 'success',
      message: 'Profile settings saved successfully'
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        type: 'error',
        message: 'New passwords do not match'
      });
      return;
    }
    
    // Here you would typically send the password change request to your API
    console.log('Changing password');
    
    // Show notification
    setNotification({
      type: 'success',
      message: 'Password changed successfully'
    });
    
    // Clear form and notification after 3 seconds
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const saveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Saving email settings:', emailSettings);
    
    // Show notification
    setNotification({
      type: 'success',
      message: 'Email settings saved successfully'
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="h-full bg-white rounded-lg shadow">
      {/* Settings header */}
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      {/* Settings content */}
      <div className="p-4 sm:p-6">
        {notification && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}
        
        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
            </div>
            <div className="p-4">
              <form onSubmit={saveProfile}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <div className="mt-1">
                      <select
                        id="language"
                        name="language"
                        value={profileData.language}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <div className="mt-1">
                      <select
                        id="timezone"
                        name="timezone"
                        value={profileData.timezone}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="UTC">UTC</option>
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC+1">Central European Time (UTC+1)</option>
                        <option value="UTC+5:30">Indian Standard Time (UTC+5:30)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
              <Key className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Password Settings</h2>
            </div>
            <div className="p-4">
              <form onSubmit={savePassword}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center">
              <Mail className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Email Settings</h2>
            </div>
            <div className="p-4">
              <form onSubmit={saveEmailSettings}>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifyOnNewEmail"
                        name="notifyOnNewEmail"
                        type="checkbox"
                        checked={emailSettings.notifyOnNewEmail}
                        onChange={handleCheckboxChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifyOnNewEmail" className="font-medium text-gray-700">
                        Notify me when I receive a new email
                      </label>
                      <p className="text-gray-500">Get desktop notifications for new emails.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="dailyDigest"
                        name="dailyDigest"
                        type="checkbox"
                        checked={emailSettings.dailyDigest}
                        onChange={handleCheckboxChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="dailyDigest" className="font-medium text-gray-700">
                        Send me a daily digest
                      </label>
                      <p className="text-gray-500">Receive a summary of your inbox activity every day.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoArchive"
                        name="autoArchive"
                        type="checkbox"
                        checked={emailSettings.autoArchive}
                        onChange={handleCheckboxChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoArchive" className="font-medium text-gray-700">
                        Auto-archive read emails after 30 days
                      </label>
                      <p className="text-gray-500">Automatically move read emails to archive after 30 days.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="showUnread"
                        name="showUnread"
                        type="checkbox"
                        checked={emailSettings.showUnread}
                        onChange={handleCheckboxChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="showUnread" className="font-medium text-gray-700">
                        Show unread emails first
                      </label>
                      <p className="text-gray-500">Prioritize unread emails at the top of your inbox.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Email Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;