// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Bar, Line, Doughnut } from "react-chartjs-2";
// // import { User, LineChart, TrendingUp, Activity } from "lucide-react";
// // import {
// //   Chart as ChartJS,
// //   BarElement,
// //   CategoryScale,
// //   LinearScale,
// //   PointElement,
// //   LineElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // import Form from "./Form"; // Import the Form component

// // // Register the required components
// // ChartJS.register(
// //   BarElement,
// //   CategoryScale,
// //   LinearScale,
// //   PointElement,
// //   LineElement,
// //   ArcElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );

// // const Dashboard = () => {
// //   const [userData, setUserData] = useState(null);
// //   const [error, setError] = useState(null); // Track errors
// //   const [selectedMetric, setSelectedMetric] = useState("carbonFootprint"); // Initialize selectedMetric
// //   const [isEditing, setIsEditing] = useState(false); // Track if the form is being edited

// //   useEffect(() => {
// //     // Fetch user data from the backend
// //     axios
// //       .get("/api/user-data", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
// //         },
// //       })
// //       .then((response) => {
// //         setUserData(response.data);
// //       })
// //       .catch((err) => {
// //         console.error("Error fetching user data:", err.message);
// //         setError("Failed to load user data. Please try again later.");
// //       });
// //   }, []);

// //   const handleFormComplete = () => {
// //     setIsEditing(false);
// //     // Refetch user data after form submission
// //     axios
// //       .get("/api/user-data", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       })
// //       .then((response) => {
// //         setUserData(response.data);
// //       })
// //       .catch((err) => {
// //         console.error("Error fetching user data:", err.message);
// //         setError("Failed to load user data. Please try again later.");
// //       });
// //   };

// //   if (error) {
// //     return <div className="text-red-500 text-center">{error}</div>;
// //   }

// //   if (isEditing || !userData || Object.keys(userData).length === 0) {
// //     // Show the form if editing or if user data is empty
// //     return <Form onComplete={handleFormComplete} />;
// //   }

// //   // Safely access nested properties with optional chaining
// //   const transport = userData.transport || {};
// //   const energy = userData.energy || {};
// //   const water = userData.water || {};
// //   const lifestyle = userData.lifestyle || {};

// //   // Metrics Data
// //   const metrics = {
// //     carbonFootprint: {
// //       label: "Carbon Footprint",
// //       value: "2.4 tons",
// //       description: "Monthly average",
// //       icon: <TrendingUp className="text-green-500" />,
// //     },
// //     energySavings: {
// //       label: "Energy Savings",
// //       value: "15.2%",
// //       description: "Compared to last month",
// //       icon: <LineChart className="text-blue-500" />,
// //     },
// //     activeProjects: {
// //       label: "Active Projects",
// //       value: "4",
// //       description: "Conservation initiatives",
// //       icon: <Activity className="text-yellow-500" />,
// //     },
// //   };

// //   // Carbon Footprint Bar Chart Data
// //   const chartData = {
// //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
// //     datasets: [
// //       {
// //         label: "Carbon Footprint (tons)",
// //         data: [3.2, 2.8, 2.6, 2.5, 2.4, 2.2],
// //         backgroundColor: "rgba(34, 197, 94, 0.5)",
// //       },
// //     ],
// //   };

// //   // Rewards Progress (Doughnut Chart)
// //   const rewardsProgress = {
// //     datasets: [
// //       {
// //         data: [7, 3],
// //         backgroundColor: ["#22C55E", "#E5E7EB"],
// //         borderWidth: 0,
// //       },
// //     ],
// //   };

// //   // Recent Activity Logs
// //   const recentLogs = [
// //     { action: "Reduced energy usage", date: "Mar 10", impact: "-0.3" },
// //     { action: "Planted 5 trees", date: "Mar 12", impact: "-0.2" },
// //     { action: "Carpooling initiative", date: "Mar 14", impact: "-0.4" },
// //   ];

// //   return (
// //     <div className="container mx-auto p-6 space-y-6">
// //       {/* Edit Form Button */}
// //       <div className="flex justify-end">
// //         <button
// //           onClick={() => setIsEditing(true)}
// //           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
// //         >
// //           Edit Form
// //         </button>
// //       </div>

// //       {/* Profile Section */}
// //       <div className="bg-white p-6 rounded-lg shadow w-full flex flex-col items-center text-center">
// //         <h2 className="text-xl font-semibold">{userData.fullName || "N/A"}</h2>
// //         <p className="text-sm text-gray-500">{userData.email || "N/A"}</p>
// //         <p className="text-sm text-gray-500">
// //           {userData.city || "N/A"}, {userData.country || "N/A"}
// //         </p>
// //       </div>

// //       {/* Gamified Metrics */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         <div className="bg-white p-6 rounded-lg shadow">
// //           <h3 className="text-lg font-semibold">Transportation Impact</h3>
// //           <p className="text-sm text-gray-500">
// //             Primary Mode: {transport.primaryMode || "N/A"}
// //           </p>
// //           <p className="text-sm text-gray-500">
// //             Weekly Distance: {transport.weeklyDistance || 0} km
// //           </p>
// //         </div>
// //         <div className="bg-white p-6 rounded-lg shadow">
// //           <h3 className="text-lg font-semibold">Energy Usage</h3>
// //           <p className="text-sm text-gray-500">
// //             Electricity: {energy.electricity || 0} kWh/month
// //           </p>
// //           <p className="text-sm text-gray-500">
// //             LED Lights: {energy.ledLights ? "Yes" : "No"}
// //           </p>
// //         </div>
// //         <div className="bg-white p-6 rounded-lg shadow">
// //           <h3 className="text-lg font-semibold">Water Consumption</h3>
// //           <p className="text-sm text-gray-500">
// //             Monthly Usage: {water.usage || 0} liters
// //           </p>
// //         </div>
// //         <div className="bg-white p-6 rounded-lg shadow">
// //           <h3 className="text-lg font-semibold">Sustainability Efforts</h3>
// //           <p className="text-sm text-gray-500">
// //             Compost/Recycle: {lifestyle.compostRecycle ? "Yes" : "No"}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Profile + Metrics + Chart Section */}
// //       <div className="flex flex-col lg:flex-row lg:space-x-6">
// //         {/* Profile Section */}
// //         <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/3 flex flex-col items-center text-center">
// //           <User className="w-24 h-24 text-gray-500 mb-4" />
// //           <h2 className="text-xl font-semibold">John Doe</h2>
// //           <p className="text-sm text-gray-500">Environmental Analyst</p>

// //           {/* Reward Progress */}
// //           <div className="w-full mt-6 flex flex-col items-center">
// //             <h3 className="text-lg font-semibold mb-2">Rewards Progress</h3>
// //             <div className="w-32 h-32">
// //               <Doughnut data={rewardsProgress} options={{ cutout: "70%" }} />
// //             </div>
// //             <p className="text-md font-semibold">
// //               Next Reward: Eco-Friendly Badge
// //             </p>
// //           </div>
// //         </div>

// //         {/* Metrics + Chart */}
// //         <div className="w-full lg:w-2/3 flex flex-col space-y-6">
// //           {/* Metrics Section */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             {Object.keys(metrics).map((key) => (
// //               <div
// //                 key={key}
// //                 onClick={() => setSelectedMetric(key)}
// //                 className={`cursor-pointer bg-white p-6 rounded-lg shadow transition-all duration-300 ${
// //                   selectedMetric === key ? "border-2 border-green-500" : ""
// //                 }`}
// //               >
// //                 <div className="flex items-center justify-between mb-4">
// //                   <h3 className="text-lg font-semibold">
// //                     {metrics[key].label}
// //                   </h3>
// //                   {metrics[key].icon}
// //                 </div>
// //                 <p className="text-3xl font-bold">{metrics[key].value}</p>
// //                 <p className="text-sm text-gray-500">
// //                   {metrics[key].description}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Chart Section */}
// //           <div className="bg-white p-6 rounded-lg shadow w-full h-80">
// //             <h2 className="text-xl font-semibold mb-4">
// //               {metrics[selectedMetric].label} Progress
// //             </h2>
// //             <Bar
// //               data={chartData}
// //               options={{ responsive: true, maintainAspectRatio: false }}
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Logs & Activity Impact */}
// //       <div className="flex flex-col lg:flex-row lg:space-x-6">
// //         {/* Recent Logs */}
// //         <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2">
// //           <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
// //           <div className="space-y-4">
// //             {recentLogs.map((log, index) => (
// //               <div
// //                 key={index}
// //                 className="flex items-center justify-between py-2 border-b"
// //               >
// //                 <div>
// //                   <p className="font-medium">{log.action}</p>
// //                   <p className="text-sm text-gray-500">{log.date}</p>
// //                 </div>
// //                 <span className="text-green-600 font-medium">
// //                   {log.impact} tons
// //                 </span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Activity Impact Chart */}
// //         <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2 h-80">
// //           <h2 className="text-xl font-semibold mb-4">Activity Impact</h2>
// //           <Line
// //             data={{
// //               labels: recentLogs.map((log) => log.date),
// //               datasets: [
// //                 {
// //                   label: "CO2 Reduction (tons)",
// //                   data: recentLogs.map((log) => log.impact),
// //                   borderColor: "rgb(34, 197, 94)",
// //                   backgroundColor: "rgba(34, 197, 94, 0.2)",
// //                   tension: 0.3,
// //                 },
// //               ],
// //             }}
// //             options={{ responsive: true, maintainAspectRatio: false }}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Bar, Line, Doughnut } from "react-chartjs-2";
// import {
//   User,
//   LineChart,
//   Home,
//   Car,
//   Zap,
//   Award,
//   Bell,
//   ChevronRight,
//   Gift,
//   Lightbulb,
//   Leaf,
// } from "lucide-react";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import Form from "./Form";

// // Register the required ChartJS components
// ChartJS.register(
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   useEffect(() => {
//     // Fetch user data from the backend
//     axios
//       .get("/api/user-data", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })
//       .then((response) => {
//         setUserData(response.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching user data:", err.message);
//         setError("Failed to load user data. Please try again later.");
//       });
//   }, []);

//   const handleFormComplete = () => {
//     setIsEditing(false);
//     // Refetch user data after form submission
//     axios
//       .get("/api/user-data", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })
//       .then((response) => {
//         setUserData(response.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching user data:", err.message);
//         setError("Failed to load user data. Please try again later.");
//       });
//   };

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   if (isEditing || !userData || Object.keys(userData).length === 0) {
//     return <Form onComplete={handleFormComplete} />;
//   }

//   // Safely access nested properties with optional chaining
//   const transport = userData.transport || {};
//   const energy = userData.energy || {};
//   const water = userData.water || {};
//   const fuel = userData.fuel || {};
//   const lifestyle = userData.lifestyle || {};

//   // Calculate Carbon Footprint (for Carbon Footprint card and chart)
//   // 1. Transport CO₂
//   const transportCO2 =
//     transport.primaryMode === "Car"
//       ? transport.weeklyDistance * 0.2 * 4.33 // 0.2 kg CO₂/km, 4.33 weeks/month
//       : 0; // Bicycle has 0 emissions

//   // 2. Energy CO₂
//   const energyCO2 = energy.electricity * 0.5; // 0.5 kg CO₂/kWh

//   // 3. Fuel CO₂
//   const gasCO2 = fuel.gasUsage * 2.3; // 2.3 kg CO₂/m³
//   const cookingCO2 = fuel.cookingFuelType === "LPG" ? 0.3 : 0; // 0.3 kg CO₂/month for LPG

//   // 4. Water CO₂
//   const waterCO2 = water.usage * 0.001; // 0.001 kg CO₂/liter

//   // 5. Total CO₂
//   let totalCO2 = transportCO2 + energyCO2 + gasCO2 + cookingCO2 + waterCO2;
//   if (lifestyle.compostRecycle) {
//     totalCO2 *= 0.95; // 5% reduction for composting/recycling
//   }

//   // Round the values for display
//   const totalCarbonFootprint = Math.round(totalCO2);
//   const roundedTransportCO2 = Math.round(transportCO2);

//   // Calculate Total Fuel Usage for Energy Card
//   const totalFuelUsage = fuel.cookingFuelType === "LPG" ? fuel.gasUsage + 0.5 : fuel.gasUsage; // Add 0.5 m³ for LPG cooking

//   // Quick Insights Data (with placeholder percentage changes)
//   const quickInsights = [
//     {
//       title: "Carbon Footprint",
//       value: `${totalCarbonFootprint} kg`,
//       unit: "CO₂/month",
//       change: "-15%", // Placeholder, to be replaced with database data
//       icon: <Leaf className="h-6 w-6 text-green-500" />,
//       positive: true,
//     },
//     {
//       title: "Energy Usage",
//       value: `${energy.electricity} kWh, ${totalFuelUsage.toFixed(1)} m³`,
//       unit: "Electricity, Fuel",
//       change: energy.electricity > 200 || totalFuelUsage > 10 ? "+20%" : "-10%", // Placeholder, to be replaced with database data
//       icon: <Zap className="h-6 w-6 text-yellow-500" />,
//       positive: energy.electricity <= 200 && totalFuelUsage <= 10,
//     },
//     {
//       title: "Transport Emissions",
//       value: `${roundedTransportCO2} kg`,
//       unit: "CO₂/month",
//       change: "-8%", // Placeholder, to be replaced with database data
//       icon: <Car className="h-6 w-6 text-blue-500" />,
//       positive: roundedTransportCO2 <= 50,
//     },
//   ];

//   // Recommendations Data
//   const recommendations = [
//     {
//       title: "Install LED Lighting",
//       description: "Save energy and reduce emissions by 15kg CO₂ per month",
//       impact: "Medium Impact",
//       icon: <Lightbulb className="h-8 w-8 text-green-500" />,
//     },
//     {
//       title: "Start Composting/Recycling",
//       description: "Reduce waste and save 10kg CO₂ per month",
//       impact: "Medium Impact",
//       icon: <Leaf className="h-8 w-8 text-green-500" />,
//       show: !lifestyle.compostRecycle,
//     },
//   ].filter((rec) => rec.show !== false);

//   // Notifications Data
//   const notifications = [
//     {
//       title: "Achievement Unlocked",
//       description: "You've started tracking your carbon footprint!",
//       time: "2 hours ago",
//       icon: <Award className="h-5 w-5 text-green-500" />,
//     },
//     {
//       title: "Energy Usage Alert",
//       description: "Your energy usage is high this month.",
//       time: "Yesterday",
//       icon: <Zap className="h-5 w-5 text-yellow-500" />,
//       show: energy.electricity > 200 || totalFuelUsage > 10,
//     },
//     {
//       title: "Transport Emissions Notice",
//       description: "Your transport emissions are significant. Consider alternatives!",
//       time: "3 days ago",
//       icon: <Car className="h-5 w-5 text-blue-500" />,
//       show: roundedTransportCO2 > 50,
//     },
//   ].filter((notif) => notif.show !== false);

//   // Trends Chart Data (Single point for the current month)
//   const trendsChartData = {
//     labels: ["This Month"],
//     datasets: [
//       {
//         label: "Carbon Footprint (kg CO₂)",
//         data: [totalCarbonFootprint], // Only the current calculated value
//         borderColor: "rgba(34, 197, 94, 1)",
//         backgroundColor: "rgba(34, 197, 94, 0.2)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   // Sidebar Navigation Links
//   const navLinks = [
//     { name: "Dashboard", icon: <Home className="h-5 w-5" />, active: true },
//     { name: "Transport & Energy", icon: <Car className="h-5 w-5" />, active: false },
//     { name: "Progress", icon: <LineChart className="h-5 w-5" />, active: false },
//   ];

//   // Rewards Progress (Random data)
//   const rewardsProgress = {
//     datasets: [
//       {
//         data: [75, 25],
//         backgroundColor: ["#22C55E", "#E5E7EB"],
//         borderWidth: 0,
//         cutout: "80%",
//       },
//     ],
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Left Sidebar */}
//       <div
//         className={`bg-white border-r border-gray-200 transition-all duration-300 ${
//           sidebarCollapsed ? "w-20" : "w-64"
//         } flex-shrink-0`}
//       >
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex flex-col items-center">
//             <div className="relative">
//               <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
//                 <User className="h-8 w-8 text-gray-500" />
//               </div>
//               <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
//             </div>
//             {!sidebarCollapsed && (
//               <>
//                 <h3 className="mt-2 font-semibold text-black">
//                   {userData.fullName || "Jane Smith"}
//                 </h3>
//                 <p className="text-xs text-gray-500">Eco Warrior - Level 12</p>
//                 <div className="w-full mt-2">
//                   <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                     <div className="h-full bg-green-500 rounded-full" style={{ width: "75%" }}></div>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">25% more to go</p>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {!sidebarCollapsed && (
//           <div className="p-4 border-b border-gray-200">
//             <h4 className="text-sm font-medium text-black mb-2">Reward Progress</h4>
//             <div className="relative w-24 h-24 mx-auto">
//               <Doughnut
//                 data={rewardsProgress}
//                 options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }}
//               />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Gift className="h-6 w-6 text-green-500" />
//               </div>
//             </div>
//             <p className="text-xs text-center text-gray-500 mt-2">75% to next reward</p>
//             <p className="text-xs text-center text-gray-500 mt-1">Next Reward: $10 Gift Card</p>
//           </div>
//         )}

//         <div className="p-4">
//           {!sidebarCollapsed && (
//             <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Navigation</h4>
//           )}
//           <nav className="space-y-1">
//             {navLinks.map((link, index) => (
//               <a
//                 key={index}
//                 href="#"
//                 className={`flex items-center ${
//                   sidebarCollapsed ? "justify-center" : "justify-between"
//                 } px-3 py-2 rounded-md text-sm font-medium ${
//                   link.active
//                     ? "bg-green-50 text-green-600"
//                     : "text-black hover:bg-gray-100"
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <span className={`${sidebarCollapsed ? "" : "mr-3"}`}>{link.icon}</span>
//                   {!sidebarCollapsed && <span>{link.name}</span>}
//                 </div>
//                 {!sidebarCollapsed && link.active && <ChevronRight className="h-4 w-4" />}
//               </a>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 bg-white">
//         <main className="p-4 md:p-6">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-2xl font-semibold text-black">EcoTracker</h1>
//               {/* Bell Icon for Notifications */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowNotifications(!showNotifications)}
//                   className="p-1 rounded-md text-black hover:bg-gray-100 focus:outline-none"
//                 >
//                   <Bell className="h-5 w-5 text-black" />
//                   <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
//                 </button>

//                 {showNotifications && (
//                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
//                     <div className="px-4 py-2 border-b border-gray-200">
//                       <h3 className="text-sm font-medium text-black">Notifications</h3>
//                     </div>
//                     <div className="max-h-60 overflow-y-auto">
//                       {notifications.map((notification, index) => (
//                         <div key={index} className="px-4 py-3 hover:bg-gray-50">
//                           <div className="flex items-start">
//                             <div className="flex-shrink-0 mt-0.5">{notification.icon}</div>
//                             <div className="ml-3 w-0 flex-1">
//                               <p className="text-sm font-medium text-black">{notification.title}</p>
//                               <p className="text-sm text-gray-500">{notification.description}</p>
//                               <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                       {notifications.length === 0 && (
//                         <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Quick Insights */}
//             <section className="mb-8">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {quickInsights.map((insight, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">{insight.title}</p>
//                         <div className="flex items-baseline mt-1">
//                           <p className="text-2xl font-semibold text-black">{insight.value}</p>
//                           <p className="ml-1 text-sm text-gray-500">{insight.unit}</p>
//                         </div>
//                         {insight.change && (
//                           <p
//                             className={`text-xs mt-1 ${
//                               insight.positive ? "text-green-600" : "text-red-600"
//                             }`}
//                           >
//                             {insight.change} this month
//                           </p>
//                         )}
//                       </div>
//                       <div className="p-2 rounded-md bg-gray-50">{insight.icon}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Carbon Footprint Chart */}
//             <section className="mb-8">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//                   <h2 className="text-lg font-medium text-black">Carbon Footprint</h2>
//                 </div>
//                 <div className="h-80">
//                   <Line
//                     data={trendsChartData}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       scales: {
//                         y: {
//                           beginAtZero: true,
//                           grid: {
//                             color: "rgba(0, 0, 0, 0.1)",
//                           },
//                           ticks: {
//                             color: "rgba(0, 0, 0, 0.7)",
//                           },
//                         },
//                         x: {
//                           grid: {
//                             display: false,
//                           },
//                           ticks: {
//                             color: "rgba(0, 0, 0, 0.7)",
//                           },
//                         },
//                       },
//                       plugins: {
//                         legend: {
//                           display: false,
//                         },
//                       },
//                     }}
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Recommendations */}
//             <section className="mb-8">
//               <div className="grid grid-cols-1 gap-4">
//                 {recommendations.map((recommendation, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md"
//                   >
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 p-2 bg-gray-50 rounded-md">
//                         {recommendation.icon}
//                       </div>
//                       <div className="ml-4 flex-1">
//                         <h3 className="text-sm font-medium text-black">{recommendation.title}</h3>
//                         <p className="mt-1 text-xs text-gray-500">{recommendation.description}</p>
//                         <div className="mt-2 flex items-center justify-between">
//                           <span className="text-xs font-medium text-gray-500">
//                             {recommendation.impact}
//                           </span>
//                           <button className="text-xs font-medium text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded">
//                             Apply Now
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Edit Form Button */}
//             <div className="flex justify-end mb-8">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
//               >
//                 Edit Your Data
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Award, Leaf, Zap, Car } from 'lucide-react';
import { Line } from 'react-chartjs-2';
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
} from 'chart.js';
import Form from './Form';
import Sidebar from './Sidebar';

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

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Fetch user data from the backend
    axios
      .get('/api/user-data', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err.message);
        setError('Failed to load user data. Please try again later.');
      });
  }, []);

  const handleFormComplete = () => {
    setIsEditing(false);
    // Refetch user data after form submission
    axios
      .get('/api/user-data', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err.message);
        setError('Failed to load user data. Please try again later.');
      });
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (isEditing || !userData || Object.keys(userData).length === 0) {
    return <Form onComplete={handleFormComplete} />;
  }

  // Safely access nested properties with optional chaining
  const transport = userData.transport || {};
  const energy = userData.energy || {};
  const water = userData.water || {};
  const fuel = userData.fuel || {};
  const lifestyle = userData.lifestyle || {};

  // Calculate Carbon Footprint
  const transportCO2 =
    transport.primaryMode === 'Car' ? transport.weeklyDistance * 0.2 * 4.33 : 0;
  const energyCO2 = energy.electricity * 0.5;
  const gasCO2 = fuel.gasUsage * 2.3;
  const cookingCO2 = fuel.cookingFuelType === 'LPG' ? 0.3 : 0;
  const waterCO2 = water.usage * 0.001;
  let totalCO2 = transportCO2 + energyCO2 + gasCO2 + cookingCO2 + waterCO2;
  if (lifestyle.compostRecycle) {
    totalCO2 *= 0.95;
  }

  const totalCarbonFootprint = Math.round(totalCO2);
  const roundedTransportCO2 = Math.round(transportCO2);
  const totalFuelUsage = fuel.cookingFuelType === 'LPG' ? fuel.gasUsage + 0.5 : fuel.gasUsage;

  // Quick Insights Data
  const quickInsights = [
    {
      title: 'Carbon Footprint',
      value: `${totalCarbonFootprint} kg`,
      unit: 'CO₂/month',
      change: '-15%',
      icon: <Leaf className="h-6 w-6 text-green-500" />,
      positive: true,
    },
    {
      title: 'Energy Usage',
      value: `${energy.electricity} kWh, ${totalFuelUsage.toFixed(1)} m³`,
      unit: 'Electricity, Fuel',
      change: energy.electricity > 200 || totalFuelUsage > 10 ? '+20%' : '-10%',
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      positive: energy.electricity <= 200 && totalFuelUsage <= 10,
    },
    {
      title: 'Transport Emissions',
      value: `${roundedTransportCO2} kg`,
      unit: 'CO₂/month',
      change: '-8%',
      icon: <Car className="h-6 w-6 text-blue-500" />,
      positive: roundedTransportCO2 <= 50,
    },
  ];

  // Trends Chart Data
  const trendsChartData = {
    labels: ['This Month'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO₂)',
        data: [totalCarbonFootprint],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Notifications Data
  const notifications = [
    {
      title: 'Achievement Unlocked',
      description: "You've started tracking your carbon footprint!",
      time: '2 hours ago',
      icon: <Award className="h-5 w-5 text-green-500" />,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        userData={userData}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 bg-white">
        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-black">EcoTracker</h1>
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
                      <h3 className="text-sm font-medium text-black">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <div key={index} className="px-4 py-3 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">{notification.icon}</div>
                            <div className="ml-3 w-0 flex-1">
                              <p className="text-sm font-medium text-black">{notification.title}</p>
                              <p className="text-sm text-gray-500">{notification.description}</p>
                              <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
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
                        <p className="text-sm font-medium text-gray-500">{insight.title}</p>
                        <div className="flex items-baseline mt-1">
                          <p className="text-2xl font-semibold text-black">{insight.value}</p>
                          <p className="ml-1 text-sm text-gray-500">{insight.unit}</p>
                        </div>
                        {insight.change && (
                          <p
                            className={`text-xs mt-1 ${
                              insight.positive ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {insight.change} this month
                          </p>
                        )}
                      </div>
                      <div className="p-2 rounded-md bg-gray-50">{insight.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Carbon Footprint Chart */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-lg font-medium text-black">Carbon Footprint</h2>
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
                          grid: { color: 'rgba(0, 0, 0, 0.1)' },
                          ticks: { color: 'rgba(0, 0, 0, 0.7)' },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: 'rgba(0, 0, 0, 0.7)' },
                        },
                      },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
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