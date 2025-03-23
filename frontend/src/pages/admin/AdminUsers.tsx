import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

// Define TypeScript interfaces
interface User {
  _id: string;
  email: string;
  role: string;
}

interface Goal {
  _id: string;
  title: string;
  description?: string;
}

interface UserGoal {
  goalId: string;
  completed: boolean;
  proof?: string;
  verified: boolean;
}

interface Certificate {
  _id: string;
  name: string;
  description: string;
  goals: Goal[];
  requirements: string[];
}

interface UserCertificate {
  _id: string;
  userId: User;
  certificateId: Certificate | null;
  goals: UserGoal[];
  progress: number;
  eligible: boolean;
  verified: boolean;
}

interface GroupedUserData {
  user: User;
  userCertificates: UserCertificate[];
}

interface GroupedByUser {
  [userId: string]: GroupedUserData;
}

const API_URL = import.meta.env.VITE_API_URL;

export const AdminUsers = () => {
  const { user, token, loading: authLoading, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([] as User[]);
  const [userCertificates, setUserCertificates] = useState(
    [] as UserCertificate[]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);
  const [expandedUser, setExpandedUser] = useState(null as string | null); // Track expanded user
  const [selectedProof, setSelectedProof] = useState(null as string | null); // Track selected proof for modal

  useEffect(() => {
    console.log(
      "AdminUsers.tsx - User:",
      user,
      "Token:",
      token,
      "Auth Loading:",
      authLoading
    );
    if (authLoading) {
      console.log("AdminUsers.tsx - Waiting for auth state to load...");
      return;
    }

    if (!user || !token || user.role !== "admin") {
      console.log(
        "AdminUsers.tsx - Redirecting to login: user, token, or role missing"
      );
      navigate("/login");
      return;
    }

    const fetchAllUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await fetch(`${API_URL}/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fetch users error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("AdminUsers.tsx - Fetched users:", data);
        if (data.success) {
          setUsers(data.users || []);
        } else {
          setError(data.message || "Failed to fetch users");
          setUsers([]);
        }
      } catch (error) {
        console.error("Fetch users error:", error.message);
        setError(error.message || "An error occurred while fetching users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserCertificates = async () => {
      try {
        const response = await fetch(`${API_URL}/certificates/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          signOut();
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          "AdminUsers.tsx - Fetched userCertificates:",
          data.userCertificates
        );
        if (data.success) {
          setUserCertificates(data.userCertificates || []);
        } else {
          setError(data.message || "Failed to fetch user certificates");
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          setError("Invalid JSON response from server");
        } else {
          setError(
            error.message ||
              "An error occurred while fetching user certificates"
          );
        }
        console.error("Fetch user certificates error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
    fetchUserCertificates();
  }, [user, token, authLoading, navigate, signOut]);

  const handleVerify = async (certId: string, goalId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/certificates/verify/${certId}/${goalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        signOut();
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setUserCertificates((prevUserCertificates) =>
          prevUserCertificates.map((uc) =>
            uc._id === certId ? data.userCertificate : uc
          )
        );
      } else {
        setError(data.message || "Failed to verify goal");
      }
    } catch (error) {
      setError("An error occurred while verifying the goal");
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowProof = (proof: string) => {
    setSelectedProof(proof);
  };

  const closeModal = () => {
    setSelectedProof(null);
  };

  const toggleUser = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  if (authLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    console.log(
      "AdminUsers.tsx - Rendering Unauthorized: user or role mismatch",
      user
    );
    return <div className="container mx-auto p-6">Unauthorized</div>;
  }

  // Group user certificates by user
  const groupedByUser: GroupedByUser = (users || []).reduce(
    (acc: GroupedByUser, user: User) => {
      const userId = user._id;
      acc[userId] = {
        user,
        userCertificates: userCertificates.filter(
          (uc) => uc.userId._id === userId
        ),
      };
      return acc;
    },
    {} as GroupedByUser
  );

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      {loading && <p className="text-blue-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <h1 className="text-3xl font-bold mb-8 text-[#21094E]">Users</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 bg-[#551281] text-white rounded-lg">
          All Users
        </button>
        <button className="px-4 py-2 bg-[#A5E1AD] text-[#21094E] rounded-lg">
          Pending Verification
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
          Verified
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <select className="border rounded-lg px-3 py-1 text-gray-700">
              <option>Columns</option>
            </select>
            <select className="border rounded-lg px-3 py-1 text-gray-700">
              <option>Certificate</option>
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
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Certificate</th>
                <th className="py-3 px-4 text-left">Progress</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            {Object.values(groupedByUser).map((userData: GroupedUserData) => (
              <tbody key={userData.user._id}>
                <tr className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      onClick={() => toggleUser(userData.user._id)}
                      checked={expandedUser === userData.user._id}
                    />
                  </td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span>{userData.user.fullName || userData.user.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    {userData.userCertificates[0]?.certificateId?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {userData.userCertificates[0]?.progress.toFixed(2) || "0"}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        userData.userCertificates[0]?.verified
                          ? "bg-[#A5E1AD] text-[#21094E]"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {userData.userCertificates[0]?.verified
                        ? "Verified"
                        : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleUser(userData.user._id)}
                      className="px-3 py-1 bg-[#4CA1A3] text-white rounded-lg"
                    >
                      {expandedUser === userData.user._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </td>
                </tr>

                {/* Collapsible Details */}
                {expandedUser === userData.user._id && (
                  <tr>
                    <td colSpan={6} className="p-4 bg-gray-50">
                      {userData.userCertificates.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600">
                            No certificates assigned to this user.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userData.userCertificates.map((userCert) => {
                            if (!userCert.certificateId) {
                              console.warn(
                                `AdminUsers.tsx - Certificate not found for UserCertificate ID: ${userCert._id}, User ID: ${userCert.userId._id}`
                              );
                              return (
                                <div
                                  key={userCert._id}
                                  className="bg-red-50 rounded-lg p-4"
                                >
                                  <h3 className="text-xl font-medium mb-2 text-red-500">
                                    Certificate Not Found
                                  </h3>
                                  <p className="text-gray-600">
                                    The certificate associated with this user
                                    certificate could not be found.
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={userCert._id}
                                className="bg-gray-50 rounded-lg p-4 shadow-sm"
                              >
                                <h3 className="text-lg font-medium text-[#21094E]">
                                  {userCert.certificateId.name}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                  {userCert.certificateId.description}
                                </p>
                                <p className="text-gray-600 mb-4">
                                  Progress: {userCert.progress.toFixed(2)}%
                                </p>

                                {/* Goals Table */}
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2 text-gray-700">
                                    Goals to Verify:
                                  </h4>
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                      <thead>
                                        <tr className="bg-gray-100">
                                          <th className="py-2 px-4 text-left text-gray-700">
                                            Goal
                                          </th>
                                          <th className="py-2 px-4 text-left text-gray-700">
                                            Status
                                          </th>
                                          <th className="py-2 px-4 text-left text-gray-700">
                                            Proof
                                          </th>
                                          <th className="py-2 px-4 text-left text-gray-700">
                                            Action
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {userCert.goals.map(
                                          (userGoal, index) => {
                                            const goal =
                                              userCert.certificateId?.goals.find(
                                                (g) => g._id === userGoal.goalId
                                              );
                                            return (
                                              <tr
                                                key={userGoal.goalId}
                                                className="border-t border-gray-200 hover:bg-gray-50"
                                              >
                                                <td className="py-2 px-4 text-gray-600">
                                                  {goal?.title ||
                                                    "Goal Not Found"}
                                                </td>
                                                <td className="py-2 px-4">
                                                  <span
                                                    className={
                                                      userGoal.verified
                                                        ? "text-green-500"
                                                        : userGoal.completed
                                                        ? "text-yellow-500"
                                                        : "text-red-500"
                                                    }
                                                  >
                                                    {userGoal.completed
                                                      ? userGoal.verified
                                                        ? "✅ Verified"
                                                        : "⏳ Pending Verification"
                                                      : "❌ Not Completed"}
                                                  </span>
                                                </td>
                                                <td className="py-2 px-4">
                                                  {userGoal.proof ? (
                                                    userGoal.proof.includes(
                                                      "application/pdf"
                                                    ) ? (
                                                      <a
                                                        href={userGoal.proof}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                      >
                                                        View PDF
                                                      </a>
                                                    ) : (
                                                      <button
                                                        onClick={() =>
                                                          handleShowProof(
                                                            userGoal.proof!
                                                          )
                                                        }
                                                        className="text-blue-500 hover:underline"
                                                      >
                                                        View Image
                                                      </button>
                                                    )
                                                  ) : (
                                                    <span className="text-gray-500">
                                                      No proof uploaded
                                                    </span>
                                                  )}
                                                </td>
                                                <td className="py-2 px-4">
                                                  <button
                                                    onClick={() =>
                                                      handleVerify(
                                                        userCert._id,
                                                        userGoal.goalId
                                                      )
                                                    }
                                                    disabled={
                                                      userGoal.verified ||
                                                      !userGoal.completed ||
                                                      loading
                                                    }
                                                    className={`px-4 py-1 rounded text-sm font-medium transition ${
                                                      userGoal.verified ||
                                                      !userGoal.completed
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-[#4CA1A3] text-white hover:bg-[#3A7D80]"
                                                    }`}
                                                  >
                                                    {userGoal.verified
                                                      ? "Verified"
                                                      : "Verify"}
                                                  </button>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Pending Goals */}
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2 text-gray-700">
                                    Pending Goals:
                                  </h4>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {userCert.goals
                                      .filter(
                                        (userGoal) =>
                                          userGoal.completed &&
                                          !userGoal.verified
                                      )
                                      .map((userGoal) => {
                                        const goal =
                                          userCert.certificateId?.goals.find(
                                            (g) => g._id === userGoal.goalId
                                          );
                                        return (
                                          <li key={userGoal.goalId}>
                                            {goal?.title || "Goal Not Found"}
                                          </li>
                                        );
                                      })}
                                    {userCert.goals.filter(
                                      (userGoal) =>
                                        userGoal.completed && !userGoal.verified
                                    ).length === 0 && <li>No pending goals</li>}
                                  </ul>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </table>
        </div>
      </div>

      {/* Modal for Viewing Proof Image */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Proof Image</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <img
              src={selectedProof}
              alt="Proof"
              className="w-full h-auto rounded-lg max-h-[70vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
