import React from "react";

export const AdminUsers = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Add user management table/controls here */}
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{/* Add user list rendering logic */}</tbody>
        </table>
      </div>
    </div>
  );
};
