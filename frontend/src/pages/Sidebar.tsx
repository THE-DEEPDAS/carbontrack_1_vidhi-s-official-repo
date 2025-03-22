import React from "react";
import { User, Home, Car, LineChart, ChevronRight, Gift } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  userData: any;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  userLevel: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  userData,
  sidebarCollapsed,
  setSidebarCollapsed,
  userLevel,
}) => {
  const location = useLocation();

  // Sidebar Navigation Links
  const navLinks = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/" },
    // { name: 'Transport & Energy', icon: <Car className="h-5 w-5" />, path: '/transport-energy' },
    // { name: 'Progress', icon: <LineChart className="h-5 w-5" />, path: '/progress' },
  ];

  // Rewards Progress (Random data)
  const rewardsProgress = {
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#22C55E", "#E5E7EB"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : "w-64"
      } flex-shrink-0`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-500" />
            </div>
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          {!sidebarCollapsed && (
            <>
              <h3 className="mt-2 font-semibold text-black">
                {userData?.fullName || "Jane Smith"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Level: {userLevel}</p>
              <div className="w-full mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">25% more to go</p>
              </div>
            </>
          )}
        </div>
      </div>

      {!sidebarCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-black mb-2">
            Reward Progress
          </h4>
          <div className="relative w-24 h-24 mx-auto">
            <Doughnut
              data={rewardsProgress}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gift className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            75% to next reward
          </p>
          <p className="text-xs text-center text-gray-500 mt-1">
            Next Reward: $10 Gift Card
          </p>
        </div>
      )}

      <div className="p-4">
        {!sidebarCollapsed && (
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Navigation
          </h4>
        )}
        <nav className="space-y-1">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "justify-between"
              } px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === link.path
                  ? "bg-green-50 text-green-600"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <span className={`${sidebarCollapsed ? "" : "mr-3"}`}>
                  {link.icon}
                </span>
                {!sidebarCollapsed && <span>{link.name}</span>}
              </div>
              {!sidebarCollapsed && location.pathname === link.path && (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500">Your Level</p>
        <p className="text-lg font-semibold text-black">{userLevel}</p>
      </div>
    </div>
  );
};

export default Sidebar;
