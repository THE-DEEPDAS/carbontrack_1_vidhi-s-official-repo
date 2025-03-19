import React, { useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { User, LineChart, TrendingUp, Activity } from "lucide-react";
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

// Register the required components
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
  const [selectedMetric, setSelectedMetric] = useState("carbonFootprint");

  // Metrics Data
  const metrics = {
    carbonFootprint: {
      label: "Carbon Footprint",
      value: "2.4 tons",
      description: "Monthly average",
      icon: <TrendingUp className="text-green-500" />,
    },
    energySavings: {
      label: "Energy Savings",
      value: "15.2%",
      description: "Compared to last month",
      icon: <LineChart className="text-blue-500" />,
    },
    activeProjects: {
      label: "Active Projects",
      value: "4",
      description: "Conservation initiatives",
      icon: <Activity className="text-yellow-500" />,
    },
  };

  // Carbon Footprint Bar Chart Data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Carbon Footprint (tons)",
        data: [3.2, 2.8, 2.6, 2.5, 2.4, 2.2],
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
    ],
  };

  // Rewards Progress (Doughnut Chart)
  const rewardsProgress = {
    datasets: [
      {
        data: [7, 3],
        backgroundColor: ["#22C55E", "#E5E7EB"],
        borderWidth: 0,
      },
    ],
  };

  // Recent Activity Logs
  const recentLogs = [
    { action: "Reduced energy usage", date: "Mar 10", impact: "-0.3" },
    { action: "Planted 5 trees", date: "Mar 12", impact: "-0.2" },
    { action: "Carpooling initiative", date: "Mar 14", impact: "-0.4" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Profile + Metrics + Chart Section */}
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/3 flex flex-col items-center text-center">
          <User className="w-24 h-24 text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-sm text-gray-500">Environmental Analyst</p>


          {/* Reward Progress */}
          <div className="w-full mt-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Rewards Progress</h3>
            <div className="w-32 h-32">
              <Doughnut data={rewardsProgress} options={{ cutout: "70%" }} />
            </div>
            <p className="text-md font-semibold">Next Reward: Eco-Friendly Badge</p>
          </div>
        </div>


        {/* Metrics + Chart */}
        <div className="w-full lg:w-2/3 flex flex-col space-y-6">
          {/* Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(metrics).map((key) => (
              <div
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`cursor-pointer bg-white p-6 rounded-lg shadow transition-all duration-300 ${
                  selectedMetric === key ? "border-2 border-green-500" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{metrics[key].label}</h3>
                  {metrics[key].icon}
                </div>
                <p className="text-3xl font-bold">{metrics[key].value}</p>
                <p className="text-sm text-gray-500">{metrics[key].description}</p>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-lg shadow w-full h-80">
            <h2 className="text-xl font-semibold mb-4">{metrics[selectedMetric].label} Progress</h2>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Logs & Activity Impact */}
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Recent Logs */}
        <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{log.action}</p>
                  <p className="text-sm text-gray-500">{log.date}</p>
                </div>
                <span className="text-green-600 font-medium">{log.impact} tons</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Impact Chart */}
        <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2 h-80">
          <h2 className="text-xl font-semibold mb-4">Activity Impact</h2>
          <Line
            data={{
              labels: recentLogs.map((log) => log.date),
              datasets: [
                {
                  label: "CO2 Reduction (tons)",
                  data: recentLogs.map((log) => log.impact),
                  borderColor: "rgb(34, 197, 94)",
                  backgroundColor: "rgba(34, 197, 94, 0.2)",
                  tension: 0.3,
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;