import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Award, Leaf, Zap, Car } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Form from "./Form";
import Sidebar from "./Sidebar";

// Register the required ChartJS components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"; // Use environment variable

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [comparisonData, setComparisonData] = useState([]); // For comparison graph
  const [comparisonUser, setComparisonUser] = useState(""); // Selected user for comparison
  const [previousCO2, setPreviousCO2] = useState(null); // Track previous CO2 for notifications
  const [notifications, setNotifications] = useState([
    {
      title: "Welcome!",
      description:
        "Thank you for signing up. Start tracking your carbon footprint today!",
      time: "Just now",
      icon: <Award className="h-5 w-5 text-green-500" />,
    },
  ]); // Notifications state
  const [vouchers, setVouchers] = useState([]); // Store available vouchers
  const [wallet, setWallet] = useState(0); // Store wallet balance

  useEffect(() => {
    // Fetch user data from the backend
    axios
      .get(`${API_URL}/user-data`, {
        // Corrected endpoint
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        setPreviousCO2(response.data.totalCO2 || null); // Initialize previous CO2
      })
      .catch((err) => {
        console.error("Error fetching user data:", err.message);
        setError("Failed to load user data. Please try again later.");
      });

    // Fetch comparison data dynamically
    axios
      .get(`${API_URL}/users`, {
        // Corrected endpoint
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          const validUsers = response.data.filter(
            (user) =>
              user.fullName && user.transport && user.transport.weeklyDistance
          ); // Ensure valid user data
          setComparisonData(validUsers);
        } else {
          console.error("Invalid response format for comparison data");
        }
      })
      .catch((err) => {
        console.error("Error fetching user list for comparison:", err.message);
      });

    // Fetch vouchers and wallet balance
    axios
      .get(`${API_URL}/vouchers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setVouchers(response.data.vouchers || []);
        setWallet(response.data.wallet || 0);
      })
      .catch((err) => {
        console.error("Error fetching vouchers:", err.message);
      });
  }, []);

  const handleFormComplete = () => {
    setIsEditing(false);
    // Refetch user data after form submission
    axios
      .get(`${API_URL}/user-data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const updatedData = response.data;
        setUserData(updatedData);

        // Check for CO2 reduction and add notification
        if (previousCO2 && updatedData.totalCO2 < previousCO2) {
          const reduction = previousCO2 - updatedData.totalCO2;
          setNotifications((prev) => [
            ...prev,
            {
              title: "Great Job!",
              description: `Your carbon emissions have decreased by ${reduction.toFixed(
                2
              )} kg CO₂. Keep it up!`,
              time: "Just now",
              icon: <Award className="h-5 w-5 text-green-500" />,
            },
          ]);
        }
        setPreviousCO2(updatedData.totalCO2);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err.message);
        setError("Failed to load user data. Please try again later.");
      });
  };

  const handleComparisonUserChange = (e) => {
    setComparisonUser(e.target.value);
  };

  const handleClaimVoucher = (voucherId) => {
    axios
      .post(
        `${API_URL}/claim-voucher`,
        { voucherId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        alert("Voucher claimed successfully!");
        setWallet(response.data.wallet); // Update wallet balance
        setVouchers((prev) => prev.filter((v) => v._id !== voucherId)); // Remove claimed voucher
      })
      .catch((err) => {
        console.error("Error claiming voucher:", err.message);
        alert("Failed to claim voucher. Please try again.");
      });
  };

  const filteredComparisonData = comparisonData.filter(
    (user) => !comparisonUser || user.fullName === comparisonUser
  );

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (isEditing || !userData || Object.keys(userData).length === 0) {
    return <Form onComplete={handleFormComplete} />;
  }

  // Safely access nested properties with optional chaining
  const transport = userData?.transport || {};
  const energy = userData?.energy || {};
  const water = userData?.water || {};
  const fuel = userData?.fuel || {};
  const lifestyle = userData?.lifestyle || {};

  // Calculate Carbon Footprint
  const transportCO2 =
    transport.primaryMode === "Car"
      ? (transport.weeklyDistance || 0) * 0.2 * 4.33
      : 0;
  const energyCO2 = (energy.electricity || 0) * 0.5;
  const gasCO2 = (fuel.gasUsage || 0) * 2.3;
  const cookingCO2 = fuel.cookingFuelType === "LPG" ? 0.3 : 0;
  const waterCO2 = (water.usage || 0) * 0.001;
  let totalCO2 = transportCO2 + energyCO2 + gasCO2 + cookingCO2 + waterCO2;

  if (lifestyle.compostRecycle) {
    totalCO2 *= 0.95;
  }

  const totalCarbonFootprint = Math.round(totalCO2);
  const roundedTransportCO2 = Math.round(transportCO2);
  const totalFuelUsage =
    fuel.cookingFuelType === "LPG"
      ? (fuel.gasUsage || 0) + 0.5
      : fuel.gasUsage || 0;

  // Refined user level logic based on CO2 ranges
  const getUserLevel = (totalCO2) => {
    if (totalCO2 < 50) return "Eco Champion";
    if (totalCO2 < 100) return "Eco Warrior";
    if (totalCO2 < 200) return "Eco Enthusiast";
    return "Eco Beginner";
  };

  const userLevel = getUserLevel(totalCarbonFootprint);

  // Quick Insights Data
  const quickInsights = [
    {
      title: "Carbon Footprint",
      value: `${totalCarbonFootprint} kg`,
      unit: "CO₂/month",
      change: "-15%",
      icon: <Leaf className="h-6 w-6 text-green-500" />,
      positive: true,
    },
    {
      title: "Energy Usage",
      value: `${energy.electricity || 0} kWh, ${totalFuelUsage.toFixed(1)} m³`,
      unit: "Electricity, Fuel",
      change:
        (energy.electricity || 0) > 200 || totalFuelUsage > 10
          ? "+20%"
          : "-10%",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      positive: (energy.electricity || 0) <= 200 && totalFuelUsage <= 10,
    },
    {
      title: "Transport Emissions",
      value: `${roundedTransportCO2} kg`,
      unit: "CO₂/month",
      change: "-8%",
      icon: <Car className="h-6 w-6 text-blue-500" />,
      positive: roundedTransportCO2 <= 50,
    },
  ];

  // Trends Chart Data
  const trendsChartData = {
    labels: ["This Month"],
    datasets: [
      {
        label: "Carbon Footprint (kg CO₂)",
        data: [totalCarbonFootprint],
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Comparison Chart Data
  const comparisonChartData = {
    labels: filteredComparisonData.map((user) => user.name),
    datasets: [
      {
        label: "Carbon Footprint (kg CO₂)",
        data: filteredComparisonData.map((user) => user.totalCO2),
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        userData={userData}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        userLevel={userLevel} // Pass user level to Sidebar
      />

      {/* Main Content */}
      <div className="flex-1 bg-white">
        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-black">EcoTracker</h1>
              <p className="text-sm text-gray-500">Level: {userLevel}</p>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1 rounded-md text-black hover:bg-gray-100 focus:outline-none"
                >
                  <Bell className="h-5 w-5 text-black" />
                  <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-black">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <div key={index} className="px-4 py-3 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              {notification.icon}
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className="text-sm font-medium text-black">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {notification.description}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Insights */}
            <section className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {insight.title}
                        </p>
                        <div className="flex items-baseline mt-1">
                          <p className="text-2xl font-semibold text-black">
                            {insight.value}
                          </p>
                          <p className="ml-1 text-sm text-gray-500">
                            {insight.unit}
                          </p>
                        </div>
                        {insight.change && (
                          <p
                            className={`text-xs mt-1 ${
                              insight.positive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {insight.change} this month
                          </p>
                        )}
                      </div>
                      <div className="p-2 rounded-md bg-gray-50">
                        {insight.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Carbon Footprint Chart */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-lg font-medium text-black">
                    Carbon Footprint
                  </h2>
                </div>
                <div className="h-80">
                  <Line
                    data={trendsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0, 0, 0, 0.1)" },
                          ticks: { color: "rgba(0, 0, 0, 0.7)" },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: "rgba(0, 0, 0, 0.7)" },
                        },
                      },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Comparison Chart */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-lg font-medium text-black">
                    Compare with Other Users
                  </h2>
                  <select
                    value={comparisonUser}
                    onChange={handleComparisonUserChange}
                    className="border rounded p-2"
                  >
                    <option value="">All Users</option>
                    {comparisonData.map((user, index) => (
                      <option key={index} value={user.fullName}>
                        {user.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="h-80">
                  <Line
                    data={{
                      labels: filteredComparisonData.map(
                        (user) => user.fullName
                      ),
                      datasets: [
                        {
                          label: "Weekly Distance (km)",
                          data: filteredComparisonData.map(
                            (user) => user.transport.weeklyDistance
                          ),
                          borderColor: "rgba(34, 197, 94, 1)",
                          backgroundColor: "rgba(34, 197, 94, 0.2)",
                          tension: 0.4,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0, 0, 0, 0.1)" },
                          ticks: { color: "rgba(0, 0, 0, 0.7)" },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: "rgba(0, 0, 0, 0.7)" },
                        },
                      },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Vouchers Section */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-medium text-black mb-4">
                  Available Vouchers
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Wallet Balance: <strong>${wallet}</strong>
                </p>
                {vouchers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vouchers.map((voucher) => (
                      <div
                        key={voucher._id}
                        className="bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-200"
                      >
                        <h3 className="text-sm font-medium text-black">
                        {voucher.description || "No description provided"}
                        </h3>
                        
                        <p className="text-sm font-semibold text-green-600 mt-2">
                          ${voucher.amount || "N/A"}
                        </p>
                        <button
                          onClick={() => handleClaimVoucher(voucher._id)}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                        >
                          Claim Voucher
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No vouchers available.
                  </p>
                )}
              </div>
            </section>

            {/* Edit Form Button */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
              >
                Edit Your Data
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
