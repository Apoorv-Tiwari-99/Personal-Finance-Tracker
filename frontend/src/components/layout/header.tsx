'use client';

import { useAuth } from '@/contexts/auth-context';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 ">Finance Tracker</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 hidden sm:block">
              Welcome, {user?.name}
            </span>
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}