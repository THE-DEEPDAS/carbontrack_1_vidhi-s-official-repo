import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Leaf } from 'lucide-react';

export const Navbar = () => {
  const { user, signOut } = useAuthStore();

  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6" />
          <span className="text-xl font-bold">Carbon Conservation</span>
        </Link>
        
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-green-200">Dashboard</Link>
              <Link to="/monitoring" className="hover:text-green-200">Monitoring</Link>
              <Link to="/certificates" className="hover:text-green-200">Certificates</Link>
              <Link to="/analysis" className="hover:text-green-200">Analysis</Link>
              <button
                onClick={() => signOut()}
                className="bg-green-700 px-4 py-2 rounded hover:bg-green-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-200">Login</Link>
              <Link
                to="/signup"
                className="bg-green-700 px-4 py-2 rounded hover:bg-green-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};