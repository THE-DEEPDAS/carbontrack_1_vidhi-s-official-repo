import React from 'react';
import { LineChart, BarChart, Activity } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Carbon Conservation Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Carbon Footprint</h3>
            <Activity className="text-green-600" />
          </div>
          <p className="text-3xl font-bold">2.4 tons</p>
          <p className="text-sm text-gray-500">Monthly average</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Energy Savings</h3>
            <LineChart className="text-green-600" />
          </div>
          <p className="text-3xl font-bold">15.2%</p>
          <p className="text-sm text-gray-500">Compared to last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            <BarChart className="text-green-600" />
          </div>
          <p className="text-3xl font-bold">4</p>
          <p className="text-sm text-gray-500">Conservation initiatives</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { date: '2024-03-10', action: 'Completed energy audit', impact: '-0.5 tons CO2' },
            { date: '2024-03-08', action: 'Started new recycling program', impact: '-0.3 tons CO2' },
            { date: '2024-03-05', action: 'Solar panel installation', impact: '-1.2 tons CO2' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <span className="text-green-600 font-medium">{activity.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};