import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CourtsAdmin() {
  const [courts, setCourts] = useState([]);
  const [form, setForm] = useState({ name: "", type: "indoor", basePrice: 10 });

  // Load courts on first render
  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await axios.get("/api/courts");
    setCourts(res.data);
  }

  async function createCourt(e) {
    e.preventDefault();
    await axios.post("/api/courts", form);
    setForm({ name: "", type: "indoor", basePrice: 10 });
    load();
  }

  async function toggleEnabled(id, enabled) {
    await axios.patch(`/api/courts/${id}/disable`, { enabled });
    load();
  }

  async function updateCourt(id, data) {
    await axios.put(`/api/courts/${id}`, data);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Courts</h1>

      {/* CREATE COURT FORM */}
      <form onSubmit={createCourt} className="mb-4 space-y-2">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Court name"
          className="border p-2"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2"
        >
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>

        <input
          type="number"
          value={form.basePrice}
          onChange={(e) =>
            setForm({ ...form, basePrice: Number(e.target.value) })
          }
          className="border p-2"
        />

        <div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            Add Court
          </button>
        </div>
      </form>

      {/* COURTS TABLE */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2">Name</th>
            <th>Type</th>
            <th>Base Price</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courts.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.type}</td>
              <td className="p-2">₹{c.basePrice}</td>
              <td className="p-2">{c.enabled ? "Yes" : "No"}</td>

              <td className="p-2">
                {/* Toggle Enabled */}
                <button
                  onClick={() => toggleEnabled(c._id, !c.enabled)}
                  className="mr-2 px-2 py-1 bg-gray-200 rounded"
                >
                  Toggle
                </button>

                {/* Edit Name */}
                <button
                  onClick={() => {
                    const newName = prompt("Enter new court name:", c.name);
                    if (newName) updateCourt(c._id, { name: newName });
                  }}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  Edit Name
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
