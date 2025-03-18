import React from 'react';
import { Gauge, Thermometer, Wind, Droplets } from 'lucide-react';

export const Monitoring = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Real-Time Monitoring</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Gauge className="text-blue-600" />
            <h3 className="text-lg font-semibold">Carbon Intensity</h3>
          </div>
          <p className="text-3xl font-bold">245 gCO2/kWh</p>
          <div className="mt-2 text-sm text-gray-500">Updated 5 min ago</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Thermometer className="text-red-600" />
            <h3 className="text-lg font-semibold">Temperature</h3>
          </div>
          <p className="text-3xl font-bold">23.5°C</p>
          <div className="mt-2 text-sm text-gray-500">Optimal range: 20-24°C</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Wind className="text-green-600" />
            <h3 className="text-lg font-semibold">Air Quality</h3>
          </div>
          <p className="text-3xl font-bold">Good</p>
          <div className="mt-2 text-sm text-gray-500">AQI: 42</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Droplets className="text-blue-600" />
            <h3 className="text-lg font-semibold">Water Usage</h3>
          </div>
          <p className="text-3xl font-bold">128L</p>
          <div className="mt-2 text-sm text-gray-500">Daily consumption</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <div className="space-y-4">
          {[
            {
              title: 'Optimize HVAC Schedule',
              description: 'Adjust temperature settings during off-peak hours',
              impact: 'Potential savings: 15%',
              priority: 'High'
            },
            {
              title: 'Install LED Lighting',
              description: 'Replace traditional bulbs with LED alternatives',
              impact: 'Potential savings: 10%',
              priority: 'Medium'
            },
            {
              title: 'Water Conservation',
              description: 'Implement water-efficient fixtures',
              impact: 'Potential savings: 8%',
              priority: 'Medium'
            }
          ].map((rec, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-gray-600">{rec.description}</p>
                  <p className="text-green-600 text-sm">{rec.impact}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {rec.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};