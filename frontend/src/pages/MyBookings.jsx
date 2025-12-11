import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const demoUserId = localStorage.getItem("demoUserId");
  useEffect(()=> {
    if (!demoUserId) return;
    axios.get(`/api/bookings?user=${demoUserId}`).then(res=> setBookings(res.data)).catch(console.error);
  }, [demoUserId]);

  if (!demoUserId) return <div className="p-6">No demo user set. Run seed.js and copy demo user id to localStorage as demoUserId.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <ul className="space-y-3">
        {bookings.map(b => (
          <li key={b._id} className="p-3 bg-white rounded shadow">
            <div><strong>{b.court?.name || "Court"}</strong></div>
            <div>{new Date(b.startTime).toLocaleString()} — {new Date(b.endTime).toLocaleString()}</div>
            <div>Price: ₹{b.pricingBreakdown?.total}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
