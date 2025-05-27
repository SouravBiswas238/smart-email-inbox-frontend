import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmailInbox from './EmailInbox';
import EmailCategories from './EmailCategories';
import Appointments from './Appointments';
import Settings from './Settings';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <a href="/dashboard" className="flex flex-col items-center py-2 text-blue-600">
            <span className="text-xs">Inbox</span>
          </a>
          <a href="/dashboard/categories" className="flex flex-col items-center py-2 text-gray-600">
            <span className="text-xs">Categories</span>
          </a>
          <a href="/dashboard/appointments" className="flex flex-col items-center py-2 text-gray-600">
            <span className="text-xs">Appointments</span>
          </a>
          {/* <a href="/dashboard/settings" className="flex flex-col items-center py-2 text-gray-600">
            <span className="text-xs">Settings</span>
          </a> */}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<EmailInbox />} />
                <Route path="/categories" element={<EmailCategories />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;