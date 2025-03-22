import React, { useState, useEffect } from "react";
import { Award, Check, Clock, Upload } from "lucide-react";
import { useAuthStore } from "../store/authStore";
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
  certificateId?: string; // Added for debugging
  name: string;
  description: string;
  goals: Goal[];
  requirements: string[];
  userProgress: number;
  userGoals: UserGoal[];
  eligible: boolean;
  verified: boolean;
}

export const Certificates = () => {
  const { user, token, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([] as Certificate[]);
  const [loading, setLoading] = useState(false as boolean);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    console.log("Certificates.tsx - User:", user, "Token:", token);
    if (!user || !token) {
      console.log("Certificates.tsx - Redirecting to login: user or token missing");
      navigate("/login");
      return;
    }

    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/certificates", {
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
          setCertificates(data.certificates);
        } else {
          setError(data.message || "Failed to fetch certificates");
        }
      } catch (error) {
        setError("An error occurred while fetching certificates");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user, token, navigate, signOut]);

  const handleFileUpload = async (certId: string, goalId: string, file: File | null) => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("proof", file);

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/certificates/upload-proof/${certId}/${goalId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        signOut();
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setCertificates((prevCertificates) =>
          prevCertificates.map((cert) =>
            cert._id === certId
              ? {
                  ...cert,
                  userGoals: data.userCertificate.goals,
                  userProgress: data.userCertificate.progress,
                  eligible: data.userCertificate.eligible,
                  verified: data.userCertificate.verified,
                }
              : cert
          )
        );
      } else {
        setError(data.message || "Failed to upload proof");
      }
    } catch (error) {
      setError("An error occurred while uploading the proof");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certId: string) => {
    console.log("Downloading certificate with certId:", certId);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/certificates/download/${certId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        console.log("handleDownload - Unauthorized, signing out...");
        signOut();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.log("handleDownload - Server error:", errorData);
        throw new Error(errorData.message || "Failed to download certificate");
      }

      const blob = await response.blob();
      console.log("handleDownload - Blob received, size:", blob.size);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "certificate.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("handleDownload - Download initiated");
    } catch (error) {
      setError(error.message || "An error occurred while downloading the certificate");
      console.error("Download error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h1 className="text-3xl font-bold mb-8">Certifications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => {
          console.log(`Certificate - _id: ${cert._id}, certificateId: ${cert.certificateId}, name: ${cert.name}, verified: ${cert.verified}`);
          // Check if all goals are verified
          const allGoalsVerified = cert.userGoals.every((userGoal) => userGoal.verified);

          return (
            <div
              key={cert._id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                cert.eligible ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{cert.name}</h2>
                {cert.eligible ? (
                  <Check className="text-green-500" />
                ) : (
                  <Clock className="text-gray-400" />
                )}
              </div>

              <p className="text-gray-600 mb-4">{cert.description}</p>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{cert.userProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      cert.eligible ? "bg-green-500" : "bg-gray-400"
                    }`}
                    style={{ width: `${cert.userProgress}%` }}
                  ></div>
                </div>
              </div>

              {cert.goals.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Goals to Complete:</h3>
                  {allGoalsVerified ? (
                    <p className="text-green-500 font-medium">All Goals Verified ✅</p>
                  ) : (
                    <ul className="list-none text-sm text-gray-600">
                      {cert.goals.map((goal, index) => {
                        const userGoal = cert.userGoals.find(
                          (ug) => ug.goalId === goal._id
                        );
                        return (
                          <li
                            key={goal._id}
                            className="grid grid-cols-3 gap-4 items-center mb-2"
                          >
                            <span
                              className={
                                userGoal?.completed ? "line-through text-gray-400" : ""
                              }
                            >
                              {goal.title}
                            </span>
                            <span
                              className={
                                userGoal?.verified ? "text-green-500" : "text-red-500"
                              }
                            >
                              {userGoal?.verified
                                ? "✅ Verified"
                                : userGoal?.completed
                                ? "⏳ Pending Verification"
                                : "❌ Not Completed"}
                            </span>

                            {/* Show Upload button only if the goal is not verified */}
                            {!userGoal?.verified && (
                              <label className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-xs flex items-center justify-center w-fit">
                                <Upload size={14} className="inline-block mr-1" /> Upload
                                <input
                                  type="file"
                                  accept="image/*, application/pdf"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      cert._id,
                                      goal._id,
                                      e.target.files ? e.target.files[0] : null
                                    )
                                  }
                                />
                              </label>
                            )}

                            {userGoal?.proof && (
                              userGoal.proof.includes("application/pdf") ? (
                                <a
                                  href={userGoal.proof}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 text-xs"
                                >
                                  View Proof (PDF)
                                </a>
                              ) : (
                                <img
                                  src={userGoal.proof}
                                  alt="Proof"
                                  className="w-20 h-20 rounded-md"
                                />
                              )
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              <div className="space-y-2 mt-4">
                <h3 className="font-medium">Requirements:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {cert.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <button
                className={`mt-4 w-full py-2 px-4 rounded ${
                  cert.verified
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => cert.verified && handleDownload(cert._id)}
                disabled={!cert.verified || loading}
              >
                {cert.verified ? "Download Certificate" : "Not Verified"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Award className="text-green-500 mr-2" />
          <h2 className="text-xl font-semibold">Your Achievements</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Completed Certifications</h3>
            <p className="text-3xl font-bold text-green-500">
              {certificates.filter((cert) => cert.eligible).length}
            </p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-blue-500">
              {
                certificates.filter(
                  (cert) => !cert.eligible && cert.userProgress > 0
                ).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;