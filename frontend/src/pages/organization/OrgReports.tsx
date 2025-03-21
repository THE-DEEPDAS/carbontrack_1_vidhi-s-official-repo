import React from "react";

export const OrgReports = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Organization Reports</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Carbon Footprint</h3>
          {/* Add carbon footprint chart/data */}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Energy Usage</h3>
          {/* Add energy usage chart/data */}
        </div>
      </div>
    </div>
  );
};
