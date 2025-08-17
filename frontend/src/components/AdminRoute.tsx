import React from 'react';
import { Navigate } from 'react-router-dom';
import { type User } from '../utils/api';

interface AdminRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
            🚫 Access Denied
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">
            You need administrator privileges to access this page.
          </p>
          <p className="text-sm text-red-500 dark:text-red-400">
            Current role: <span className="font-semibold">{user.role}</span>
          </p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default AdminRoute;