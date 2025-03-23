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
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: "up" | "down";
  color: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 ${color} transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-6 h-6 text-gray-700" />
        <div
          className={`flex items-center ${
            trend === "up" ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp size={20} />
          ) : (
            <TrendingDown size={20} />
          )}
          <span className="ml-1 text-sm font-semibold">8.2%</span>
        </div>
      </div>
      <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
}

export function OrgDashboard() {
  const [departments, setDepartments] = useState([]);
  const [historicalData, setHistoricalData] = useState<
    { name: string; energy: number; carbon: number; logistic: number }[]
  >([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [voucherAmount, setVoucherAmount] = useState(0);
  const [voucherDescription, setVoucherDescription] = useState("");
  const [vouchers, setVouchers] = useState([]); // State to store vouchers
  const [wallet, setWallet] = useState(0); // State to store wallet balance

  const API_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handleOfferVoucher = () => {
    if (!voucherAmount || !voucherDescription) {
      alert("Please provide both amount and description for the voucher.");
      return;
    }

    if (voucherAmount <= 0) {
      alert("Voucher amount must be greater than zero.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authorized. Please log in again.");
      return;
    }

    axios
      .post(
        `${API_URL}/vouchers/offer`, // Ensure this matches the backend route
        { amount: voucherAmount, description: voucherDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(response.data.message || "Voucher offered successfully!");
        setVoucherAmount(0);
        setVoucherDescription("");
        fetchVouchers(); // Refetch vouchers after offering one
      })
      .catch((err) => {
        console.error(
          "Error offering voucher:",
          err.response?.data || err.message
        );
        const errorMessage =
          err.response?.data?.error ||
          "Failed to offer voucher. Please try again.";
        alert(errorMessage);
      });
  };

  const fetchVouchers = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/vouchers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Fetched vouchers response:", response.data); // Debug log
        setVouchers(response.data.vouchers || []);
        setWallet(response.data.wallet || 0); // Set wallet balance
      })
      .catch((err) => {
        console.error("Error fetching vouchers:", err.message);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptResponse = await axios.get(`${API_URL}/departments`);
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

        fetchVouchers(); // Fetch vouchers on component mount
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalEnergy = departments.reduce(
    (sum, d) => sum + (d.energyUsage || 0),
    0
  );
  const totalCarbon = departments.reduce(
    (sum, d) => sum + (d.carbonFootprint || 0),
    0
  );
  const totalLogistic = departments.reduce(
    (sum, d) => sum + (d.logisticScore || 0),
    0
  );

  const departmentData = departments.reduce((acc, dept) => {
    acc[dept.name] = [
      {
        month: "Current",
        energy: dept.energyUsage,
        carbon: dept.carbonFootprint,
      },
    ];
    return acc;
  }, {});

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );

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
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Monthly Metrics
            </h2>
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
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Historical Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ fill: "#60a5fa" }}
                  name="Energy (kWh)"
                />
                <Line
                  type="monotone"
                  dataKey="carbon"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ fill: "#f87171" }}
                  name="Carbon (kg CO₂)"
                />
                <Line
                  type="monotone"
                  dataKey="logistic"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={{ fill: "#34d399" }}
                  name="Logistic Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Building2 className="w-6 h-6 text-gray-700 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">
                Department Analytics
              </h2>
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
              <Bar
                dataKey="carbon"
                name="Carbon Footprint (kg CO₂)"
                fill="#f87171"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Offer Voucher Section */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-black mb-4">
              Offer Voucher
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Voucher Amount
              </label>
              <input
                type="number"
                value={voucherAmount}
                onChange={(e) => setVoucherAmount(Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={voucherDescription}
                onChange={(e) => setVoucherDescription(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <button
              onClick={handleOfferVoucher}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Create Voucher
            </button>
          </div>
        </section>

        {/* Vouchers Section */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-black mb-4">
              Offered Vouchers
            </h2>
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
                    <p className="text-xs text-gray-500 mt-1">
                      Created At:{" "}
                      {voucher.createdAt
                        ? new Date(voucher.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No vouchers offered yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrgDashboard;
