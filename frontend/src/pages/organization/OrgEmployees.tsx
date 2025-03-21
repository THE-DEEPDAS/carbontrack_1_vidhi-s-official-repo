import React from "react";

export const OrgEmployees = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Add Employee
        </button>
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{/* Add employee list rendering logic */}</tbody>
        </table>
      </div>
    </div>
  );
};
