import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const AdminSidebar = () => {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin" className="block p-2 hover:bg-gray-700 rounded">
          Overview
        </Link>
        <Link to="/admin/users" className="block p-2 hover:bg-gray-700 rounded">
          Users
        </Link>
        <Link
          to="/admin/organizations"
          className="block p-2 hover:bg-gray-700 rounded"
        >
          Organizations
        </Link>
        <button
          onClick={signOut}
          className="w-full text-left p-2 hover:bg-gray-700 rounded mt-8 text-red-400"
        >
          Sign Out
        </button>
      </nav>
    </div>
  );
};
