import React, { useEffect, useState } from "react";
import axios from "axios";

function PriceCalculator({ courtId, startTime, endTime, equipmentId, coachId }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (!courtId || !startTime || !endTime) {
      setPrice(null);
      return;
    }

    let mounted = true;

    const fetchPrice = async () => {
      try {
        const payload = {
          courtId,
          startTime: new Date(`2025-01-01T${startTime}:00Z`),
          endTime: new Date(`2025-01-01T${endTime}:00Z`),
          equipment: equipmentId ? [{ equipmentId, quantity: 1 }] : [],
          coachId,
        };

        // ✔ Correct backend path — DO NOT change backend
        const res = await axios.post("/api/bookings/calculate", payload);

        if (!mounted) return;
        setPrice(res.data);
      } catch (err) {
        console.log("price calc error", err.response?.data || err.message);
        if (mounted) setPrice(null);
      }
    };

    fetchPrice();
    return () => { mounted = false; };
  }, [courtId, startTime, endTime, equipmentId, coachId]);

  if (!price) return null;

  return (
    <div className="panel-inner mt-4">
      <h4 className="text-lg font-semibold mb-2">Price Breakdown</h4>

      <div className="mb-2 flex justify-between">
        <div className="price-label">Base Price:</div>
        <div className="price-value">₹{price.base}</div>
      </div>

      {price.indoor > 0 && (
        <div className="mb-1 flex justify-between text-orange-400">
          <div>Indoor Premium:</div>
          <div>₹{price.indoor}</div>
        </div>
      )}

      {price.peak > 0 && (
        <div className="mb-1 flex justify-between text-yellow-300">
          <div>Peak Fee:</div>
          <div>₹{price.peak}</div>
        </div>
      )}

      {price.weekend > 0 && (
        <div className="mb-1 flex justify-between text-blue-300">
          <div>Weekend Fee:</div>
          <div>₹{price.weekend}</div>
        </div>
      )}

      {price.equipment > 0 && (
        <div className="mb-1 flex justify-between text-green-300">
          <div>Equipment Fee:</div>
          <div>₹{price.equipment}</div>
        </div>
      )}

      {price.coach > 0 && (
        <div className="mb-1 flex justify-between text-purple-300">
          <div>Coach Fee:</div>
          <div>₹{price.coach}</div>
        </div>
      )}

      <hr className="my-2 border-gray-700" />

      <div className="flex justify-between text-xl font-bold">
        <div>Total:</div>
        <div>₹{price.total}</div>
      </div>
    </div>
  );
}





export default PriceCalculator;
