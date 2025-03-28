import React from 'react';
import { useAuth } from './utils_auth';

const Navbar = () => {
  const { isAuthenticated, isInitializing, login, logout, principal } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-teal-600 font-bold text-xl">🥷 Clean Ninja</span>
        </div>
        <button
          onClick={isAuthenticated ? logout : login}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm"
        >
          {isInitializing ? 'Loading...' : isAuthenticated ? 'Logout' : 'Login with Internet Identity'}
        </button>
      </div>
      {isAuthenticated && principal && (
        <div className="bg-teal-100 text-xs text-teal-800 py-1 px-4 text-center">
          <p className="truncate">Logged in as: {principal}</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;