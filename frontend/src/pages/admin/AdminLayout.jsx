import React from "react";
import { NavLink, Outlet } from "react-router-dom";


export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 p-4 bg-white border-r">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <NavLink to="/admin/courts" className={({isActive}) => isActive ? "font-semibold text-blue-600" : ""}>Courts</NavLink>
          <NavLink to="/admin/equipment" className={({isActive}) => isActive ? "font-semibold text-blue-600" : ""}>Equipment</NavLink>
          <NavLink to="/admin/coaches" className={({isActive}) => isActive ? "font-semibold text-blue-600" : ""}>Coaches</NavLink>
          <NavLink to="/admin/pricing-rules" className={({isActive}) => isActive ? "font-semibold text-blue-600" : ""}>Pricing Rules</NavLink>
          <NavLink to="/" className="mt-4 text-sm text-gray-600">Back to Booking</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
