// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { Bar, Line } from "react-chartjs-2";
// // import { Routes, Route, Navigate } from "react-router-dom";
// // import OrgData from "./OrgData";
// // import { OrgEmployees } from "./OrgEmployees";
// // import { OrgReports } from "./OrgReports";

// // export const OrgDashboard = () => {
// //   const [departments, setDepartments] = useState([]);
// //   const [historicalData, setHistoricalData] = useState([]);

// //   useEffect(() => {
// //     axios
// //       .get("/api/departments")
// //       .then((res) => setDepartments(res.data))
// //       .catch((err) => console.error("Error fetching departments:", err));
// //     // Simulate historical trends (replace with API when available)
// //     const trends = [];
// //     for (let i = 5; i >= 0; i--) {
// //       trends.push({
// //         month: `Month ${i + 1}`,
// //         totalEnergy: Math.floor(1000 + Math.random() * 500),
// //         totalCarbon: Math.floor(500 + Math.random() * 300),
// //         totalLogistic: Math.floor(200 + Math.random() * 100),
// //       });
// //     }
// //     setHistoricalData(trends);
// //   }, []);

// //   // Sum current departments
// //   const totalEnergy = departments.reduce((sum, d) => sum + d.energyUsage, 0);
// //   const totalCarbon = departments.reduce(
// //     (sum, d) => sum + d.carbonFootprint,
// //     0
// //   );
// //   const totalLogistic = departments.reduce(
// //     (sum, d) => sum + (d.logisticScore || 0),
// //     0
// //   );

// //   const barDataEnergy = {
// //     labels: ["Total Energy"],
// //     datasets: [
// //       {
// //         label: "Energy Usage (kWh)",
// //         data: [totalEnergy],
// //         backgroundColor: "rgba(54,162,235,0.6)",
// //       },
// //     ],
// //   };

// //   const barDataCarbon = {
// //     labels: ["Total Carbon Footprint"],
// //     datasets: [
// //       {
// //         label: "Carbon Footprint (kg CO₂)",
// //         data: [totalCarbon],
// //         backgroundColor: "rgba(255,99,132,0.6)",
// //       },
// //     ],
// //   };

// //   const barDataLogistic = {
// //     labels: ["Total Logistic Score"],
// //     datasets: [
// //       {
// //         label: "Logistic",
// //         data: [totalLogistic],
// //         backgroundColor: "rgba(75,192,192,0.6)",
// //       },
// //     ],
// //   };

// //   const lineDataHistorical = {
// //     labels: historicalData.map((t) => t.month),
// //     datasets: [
// //       {
// //         label: "Historical Energy Usage",
// //         data: historicalData.map((t) => t.totalEnergy),
// //         borderColor: "rgba(54,162,235,1)",
// //         fill: false,
// //       },
// //       {
// //         label: "Historical Carbon Footprint",
// //         data: historicalData.map((t) => t.totalCarbon),
// //         borderColor: "rgba(255,99,132,1)",
// //         fill: false,
// //       },
// //       {
// //         label: "Historical Logistic Score",
// //         data: historicalData.map((t) => t.totalLogistic),
// //         borderColor: "rgba(75,192,192,1)",
// //         fill: false,
// //       },
// //     ],
// //   };

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-3xl font-bold mb-4">Organization Dashboard</h1>
// //       <div className="grid grid-cols-3 gap-4 mb-8">
// //         <div>
// //           <Bar
// //             data={barDataEnergy}
// //             options={{
// //               plugins: { title: { display: true, text: "Total Energy Usage" } },
// //             }}
// //           />
// //         </div>
// //         <div>
// //           <Bar
// //             data={barDataCarbon}
// //             options={{
// //               plugins: {
// //                 title: { display: true, text: "Total Carbon Footprint" },
// //               },
// //             }}
// //           />
// //         </div>
// //         <div>
// //           <Bar
// //             data={barDataLogistic}
// //             options={{
// //               plugins: {
// //                 title: { display: true, text: "Total Logistic Score" },
// //               },
// //             }}
// //           />
// //         </div>
// //       </div>
// //       <div className="mb-8">
// //         <h2 className="text-xl font-bold mb-4">Historical Trends</h2>
// //         <Line
// //           data={lineDataHistorical}
// //           options={{
// //             plugins: { title: { display: true, text: "Historical Trends" } },
// //           }}
// //         />
// //       </div>
// //       <Routes>
// //         <Route path="/" element={<OrgData />} />
// //         <Route path="/employees" element={<OrgEmployees />} />
// //         <Route path="/reports" element={<OrgReports />} />
// //         {/* Catch-all subroute */}
// //         <Route path="*" element={<Navigate to="/" replace />} />
// //       </Routes>
// //     </div>
// //   );
// // };

// // export default OrgDashboard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   BarChart as BarChartIcon,
//   Leaf,
//   Truck,
//   TrendingUp,
//   TrendingDown,
//   Building2
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line,
//   ResponsiveContainer
// } from "recharts";

// // StatCard component from bolt.new
// function StatCard({ title, value, icon: Icon, trend, color }: {
//   title: string;
//   value: string;
//   icon: React.ElementType;
//   trend: "up" | "down";
//   color: string;
// }) {
//   return (
//     <div className={`bg-white rounded-xl shadow-lg p-6 ${color} transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
//       <div className="flex items-center justify-between mb-4">
//         <Icon className="w-6 h-6 text-gray-700" />
//         <div className={`flex items-center ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
//           {trend === "up" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
//           <span className="ml-1 text-sm font-semibold">8.2%</span> {/* Hardcoded for now; could be dynamic */}
//         </div>
//       </div>
//       <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
//       <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{value}</p>
//     </div>
//   );
// }

// export function OrgDashboard() {
//   const [departments, setDepartments] = useState([]);
//   const [historicalData, setHistoricalData] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch departments from API
//         const deptResponse = await axios.get("/api/departments");
//         const fetchedDepartments = deptResponse.data;
//         setDepartments(fetchedDepartments);

//         // Simulate historical trends (replace with real API if available)
//         const trends = [];
//         for (let i = 5; i >= 0; i--) {
//           trends.push({
//             name: `Month ${i + 1}`, // Changed to "name" to match recharts
//             energy: Math.floor(1000 + Math.random() * 500),
//             carbon: Math.floor(500 + Math.random() * 300),
//             logistic: Math.floor(200 + Math.random() * 100),
//           });
//         }
//         setHistoricalData(trends);

//         // Set initial selected department
//         if (fetchedDepartments.length > 0) {
//           setSelectedDepartment(fetchedDepartments[0].name || "Department 1");
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         // Fallback data
//         setDepartments([
//           { name: "Department 1", energyUsage: 1200, carbonFootprint: 800, logisticScore: 85 },
//           { name: "Department 2", energyUsage: 2800, carbonFootprint: 1600, logisticScore: 90 },
//         ]);
//         setHistoricalData([
//           { name: "Month 1", energy: 1000, carbon: 500, logistic: 200 },
//           { name: "Month 2", energy: 1200, carbon: 600, logistic: 220 },
//           { name: "Month 3", energy: 1100, carbon: 550, logistic: 210 },
//         ]);
//         setSelectedDepartment("Department 1");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Calculate totals from departments
//   const totalEnergy = departments.reduce((sum, d) => sum + (d.energyUsage || 0), 0);
//   const totalCarbon = departments.reduce((sum, d) => sum + (d.carbonFootprint || 0), 0);
//   const totalLogistic = departments.reduce((sum, d) => sum + (d.logisticScore || 0), 0);

//   // Transform department data for recharts
//   const departmentData = departments.reduce((acc, dept) => {
//     acc[dept.name] = [
//       { month: "Current", energy: dept.energyUsage, carbon: dept.carbonFootprint }
//     ]; // Simplified; could fetch historical per dept if API supports
//     return acc;
//   }, {});

//   if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <StatCard
//             title="Total Energy Usage"
//             value={`${totalEnergy} kWh`}
//             icon={BarChartIcon}
//             trend="up" // Could be dynamic based on data
//             color="bg-gradient-to-br from-blue-100 via-blue-50 to-white"
//           />
//           <StatCard
//             title="Carbon Footprint"
//             value={`${totalCarbon} kg CO₂`}
//             icon={Leaf}
//             trend="down" // Could be dynamic
//             color="bg-gradient-to-br from-rose-100 via-rose-50 to-white"
//           />
//           <StatCard
//             title="Logistic Score"
//             value={`${totalLogistic}`}
//             icon={Truck}
//             trend="up" // Could be dynamic
//             color="bg-gradient-to-br from-emerald-100 via-emerald-50 to-white"
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Monthly Metrics Bar Chart */}
//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <h2 className="text-lg font-semibold mb-4 text-gray-800">Monthly Metrics</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={historicalData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" stroke="#374151" />
//                 <YAxis stroke="#374151" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "rgba(255, 255, 255, 0.95)",
//                     border: "none",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="energy" fill="#60a5fa" name="Energy (kWh)" />
//                 <Bar dataKey="carbon" fill="#f87171" name="Carbon (kg CO₂)" />
//                 <Bar dataKey="logistic" fill="#34d399" name="Logistic Score" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Historical Trends Line Chart */}
//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <h2 className="text-lg font-semibold mb-4 text-gray-800">Historical Trends</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={historicalData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" stroke="#374151" />
//                 <YAxis stroke="#374151" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "rgba(255, 255, 255, 0.95)",
//                     border: "none",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                   }}
//                 />
//                 <Legend />
//                 <Line type="monotone" dataKey="energy" stroke="#60a5fa" strokeWidth={2} dot={{ fill: "#60a5fa" }} name="Energy (kWh)" />
//                 <Line type="monotone" dataKey="carbon" stroke="#f87171" strokeWidth={2} dot={{ fill: "#f87171" }} name="Carbon (kg CO₂)" />
//                 <Line type="monotone" dataKey="logistic" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399" }} name="Logistic Score" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Department Analytics */}
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <Building2 className="w-6 h-6 text-gray-700 mr-2" />
//               <h2 className="text-lg font-semibold text-gray-800">Department Analytics</h2>
//             </div>
//             <select
//               value={selectedDepartment}
//               onChange={(e) => setSelectedDepartment(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
//             >
//               {departments.map((dept) => (
//                 <option key={dept.name} value={dept.name}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={departmentData[selectedDepartment] || []}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis dataKey="month" stroke="#374151" />
//               <YAxis stroke="#374151" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "rgba(255, 255, 255, 0.95)",
//                   border: "none",
//                   borderRadius: "8px",
//                   boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                 }}
//               />
//               <Legend />
//               <Bar dataKey="energy" name="Energy Usage (kWh)" fill="#60a5fa" />
//               <Bar dataKey="carbon" name="Carbon Footprint (kg CO₂)" fill="#f87171" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default OrgDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart as BarChartIcon,
  Leaf,
  Truck,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// StatCard component
function StatCard({ title, value, icon: Icon, trend, color }: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: "up" | "down";
  color: string;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${color} transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-6 h-6 text-gray-700" />
        <div className={`flex items-center ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
          {trend === "up" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="ml-1 text-sm font-semibold">8.2%</span>
        </div>
      </div>
      <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{value}</p>
    </div>
  );
}

export function OrgDashboard() {
  const [departments, setDepartments] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptResponse = await axios.get("/api/departments");
        const fetchedDepartments = deptResponse.data;
        setDepartments(fetchedDepartments);

        const trends = [];
        for (let i = 5; i >= 0; i--) {
          trends.push({
            name: `Month ${i + 1}`,
            energy: Math.floor(1000 + Math.random() * 500),
            carbon: Math.floor(500 + Math.random() * 300),
            logistic: Math.floor(200 + Math.random() * 100),
          });
        }
        setHistoricalData(trends);

        if (fetchedDepartments.length > 0) {
          setSelectedDepartment(fetchedDepartments[0].name || "Department 1");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setDepartments([
          { name: "Department 1", energyUsage: 1200, carbonFootprint: 800, logisticScore: 85 },
          { name: "Department 2", energyUsage: 2800, carbonFootprint: 1600, logisticScore: 90 },
        ]);
        setHistoricalData([
          { name: "Month 1", energy: 1000, carbon: 500, logistic: 200 },
          { name: "Month 2", energy: 1200, carbon: 600, logistic: 220 },
          { name: "Month 3", energy: 1100, carbon: 550, logistic: 210 },
        ]);
        setSelectedDepartment("Department 1");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate totals from departments
  const totalEnergy = departments.reduce((sum, d) => sum + (d.energyUsage || 0), 0);
  const totalCarbon = departments.reduce((sum, d) => sum + (d.carbonFootprint || 0), 0);
  const totalLogistic = departments.reduce((sum, d) => sum + (d.logisticScore || 0), 0);

  // Export totals for use in RagPage
  window.OrgDashboardTotals = { totalEnergy, totalCarbon, totalLogistic };

  const departmentData = departments.reduce((acc, dept) => {
    acc[dept.name] = [
      { month: "Current", energy: dept.energyUsage, carbon: dept.carbonFootprint },
    ];
    return acc;
  }, {});

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Energy Usage"
            value={`${totalEnergy} kWh`}
            icon={BarChartIcon}
            trend="up"
            color="bg-gradient-to-br from-blue-100 via-blue-50 to-white"
          />
          <StatCard
            title="Carbon Footprint"
            value={`${totalCarbon} kg CO₂`}
            icon={Leaf}
            trend="down"
            color="bg-gradient-to-br from-rose-100 via-rose-50 to-white"
          />
          <StatCard
            title="Logistic Score"
            value={`${totalLogistic}`}
            icon={Truck}
            trend="up"
            color="bg-gradient-to-br from-emerald-100 via-emerald-50 to-white"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Monthly Metrics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Legend />
                <Bar dataKey="energy" fill="#60a5fa" name="Energy (kWh)" />
                <Bar dataKey="carbon" fill="#f87171" name="Carbon (kg CO₂)" />
                <Bar dataKey="logistic" fill="#34d399" name="Logistic Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Historical Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energy" stroke="#60a5fa" strokeWidth={2} dot={{ fill: "#60a5fa" }} name="Energy (kWh)" />
                <Line type="monotone" dataKey="carbon" stroke="#f87171" strokeWidth={2} dot={{ fill: "#f87171" }} name="Carbon (kg CO₂)" />
                <Line type="monotone" dataKey="logistic" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399" }} name="Logistic Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Building2 className="w-6 h-6 text-gray-700 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Department Analytics</h2>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
            >
              {departments.map((dept) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={departmentData[selectedDepartment] || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip />
              <Legend />
              <Bar dataKey="energy" name="Energy Usage (kWh)" fill="#60a5fa" />
              <Bar dataKey="carbon" name="Carbon Footprint (kg CO₂)" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

export default OrgDashboard;
