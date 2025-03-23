import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { AdminUsers } from "./AdminUsers";
import { AdminOrganizations } from "./AdminOrganizations";
//import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface User {
  _id: string;
  fullName: string;
  transport: string;
  role: string;
  createdAt: string;
}

export const AdminDashboard = () => {
  return (
    <div className="flex">
      {/* <AdminSidebar /> */}
      <div className="flex-1 p-4 sm:p-8">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/organizations" element={<AdminOrganizations />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const { token } = useAuthStore();
  const [allUsers, setAllUsers] = useState([] as User[]);
  const [users, setUsers] = useState([] as User[]);
  const [organizations, setOrganizations] = useState([] as User[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);


  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          const fetchedUsers = data.users || [];
          setAllUsers(fetchedUsers);

          // Separate users and organizations based on role
          const userList = fetchedUsers.filter((u: User) => u.role === "user");
          const orgList = fetchedUsers.filter((u: User) => u.role === "organization");
          setUsers(userList);
          setOrganizations(orgList);
        } else {
          setError(data.message || "Failed to fetch users");
          setAllUsers([]);
          setUsers([]);
          setOrganizations([]);
        }
      } catch (error: any) {
        console.error("Fetch users error:", error.message);
        setError(error.message || "An error occurred while fetching users");
        setAllUsers([]);
        setUsers([]);
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [token]);

  // Calculate growth (number of new users/organizations in the last 30 days)
  const calculateGrowth = (entities: { createdAt: string }[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newEntities = entities.filter(
      (entity) => new Date(entity.createdAt) >= thirtyDaysAgo
    );
    return newEntities.length;
  };

  const userGrowth = calculateGrowth(users);
  const orgGrowth = calculateGrowth(organizations);

  // Prepare data for charts (users and organizations over time)
  const getMonthlyData = (entities: { createdAt: string }[]) => {
    const monthlyCounts: { [key: string]: number } = {};
    entities.forEach((entity) => {
      const date = new Date(entity.createdAt);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    const labels = Object.keys(monthlyCounts).sort();
    const data = labels.map((label) => monthlyCounts[label]);
    return { labels, data };
  };

  const userChartData = getMonthlyData(users);
  const orgChartData = getMonthlyData(organizations);

  // User Line Chart
  const userLineChartData = {
    labels: userChartData.labels,
    datasets: [
      {
        label: "Users Created",
        data: userChartData.data,
        borderColor: "#551281", // Purple
        backgroundColor: "rgba(85, 18, 129, 0.2)", // Purple with opacity
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Organization Line Chart
  const orgLineChartData = {
    labels: orgChartData.labels,
    datasets: [
      {
        label: "Organizations Created",
        data: orgChartData.data,
        borderColor: "#4CA1A3", // Teal
        backgroundColor: "rgba(76, 161, 163, 0.2)", // Teal with opacity
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Bar Chart comparing Users vs Organizations
  const barChartData = {
    labels: userChartData.labels, // Use user labels (assuming they align with org labels)
    datasets: [
      {
        label: "Users",
        data: userChartData.data,
        backgroundColor: "#551281", // Purple
        borderColor: "#551281",
        borderWidth: 1,
      },
      {
        label: "Organizations",
        data: orgChartData.data,
        backgroundColor: "#4CA1A3", // Teal
        borderColor: "#4CA1A3",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#21094E", // Dark Blue for legend text
        },
      },
      title: {
        display: true,
        color: "#21094E", // Dark Blue for title
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#21094E", // Dark Blue for x-axis labels
        },
      },
      y: {
        ticks: {
          color: "#21094E", // Dark Blue for y-axis labels
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#21094E]">
        Admin Overview
      </h1>

      {loading && <p className="text-blue-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* Cards for Users and Organizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Users Card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-[#21094E] mb-2">
            Total Users
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-[#551281]">
            {users.length}
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Growth (Last 30 Days):{" "}
            <span className="text-[#4CA1A3] font-medium">+{userGrowth}</span>
          </p>
        </div>

        {/* Organizations Card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-[#21094E] mb-2">
            Total Organizations
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-[#551281]">
            {organizations.length}
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Growth (Last 30 Days):{" "}
            <span className="text-[#4CA1A3] font-medium">+{orgGrowth}</span>
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* User Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#21094E] mb-4">
            User Growth Over Time
          </h2>
          <div className="h-64 sm:h-80">
            <Line
              data={userLineChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: "Users Created Per Month",
                    color: "#21094E",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Organization Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#21094E] mb-4">
            Organization Growth Over Time
          </h2>
          <div className="h-64 sm:h-80">
            <Line
              data={orgLineChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: "Organizations Created Per Month",
                    color: "#21094E",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bar Chart Comparing Users and Organizations */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#21094E] mb-4">
          Users vs Organizations Usage
        </h2>
        <div className="h-64 sm:h-80">
          <Bar
            data={barChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Users vs Organizations Per Month",
                  color: "#21094E",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};