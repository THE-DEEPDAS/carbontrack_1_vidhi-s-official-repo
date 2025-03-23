import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

// Define TypeScript interfaces
interface Organization {
  _id: string;
  email: string;
  role: string;
  fullName?: string;
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const AdminOrganizations = () => {
  const { user, token, loading: authLoading, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([] as Organization[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token || user.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchOrganizations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          signOut();
          navigate("/login");
          return;
        }

        const data = await response.json();
        if (data.success) {
          // Filter users with role "organization"
          const filteredOrganizations = (data.users || []).filter(
            (u: Organization) => u.role === "organization"
          );
          setOrganizations(filteredOrganizations);
        } else {
          setError(data.message || "Failed to fetch organizations");
          setOrganizations([]);
        }
      } catch (error) {
        setError("An error occurred while fetching organizations");
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [user, token, authLoading, navigate, signOut]);

  if (authLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <div className="container mx-auto p-6">Unauthorized</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      {loading && <p className="text-blue-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <h1 className="text-3xl font-bold mb-8 text-[#21094E]">Organizations</h1>

      {/* Filter Tabs (Mocked for UI) */}
      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 bg-[#551281] text-white rounded-lg">
          Active
        </button>
        <button className="px-4 py-2 bg-[#A5E1AD] text-[#21094E] rounded-lg">
          Inactive
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
          Pending
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <select className="border rounded-lg px-3 py-1 text-gray-700">
              <option>Columns</option>
            </select>
            <select className="border rounded-lg px-3 py-1 text-gray-700">
              <option>Status</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-lg px-3 py-1 text-gray-700"
            />
            <button className="p-2 bg-gray-200 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387A8 8 0 012 10z" />
              </svg>
            </button>
            <button className="p-2 bg-gray-200 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </button>
            <button className="p-2 bg-gray-200 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
              </svg>
            </button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-[#21094E]">
                <th className="py-3 px-4 text-left">
                  <input type="checkbox" />
                </th>
                <th className="py-3 px-4 text-left">Organization Name</th>
                <th className="py-3 px-4 text-left">Admin Email</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr
                  key={org._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <input type="checkbox" />
                  </td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span>{org.fullName || org.email}</span>
                  </td>
                  <td className="py-3 px-4">{org.email}</td>
                  <td className="py-3 px-4">{org.createdAt || "N/A"}</td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 bg-[#4CA1A3] text-white rounded-lg">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
