import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CoachesAdmin(){
  const [coaches, setCoaches] = useState([]);
  const [form, setForm] = useState({ name: "", hourlyFee: 10 });

  useEffect(()=> load(), []);
  async function load(){ const res = await axios.get("/api/coaches"); setCoaches(res.data); }

  async function create(e){ e.preventDefault(); await axios.post("/api/coaches", form); setForm({ name: "", hourlyFee: 10 }); load(); }
  async function update(id){ const name = prompt("Name?"); const fee = prompt("Hourly Fee?"); const payload = {}; if(name) payload.name = name; if(fee) payload.hourlyFee = Number(fee); await axios.put(`/api/coaches/${id}`, payload); load(); }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Coaches</h1>
      <form onSubmit={create} className="mb-4">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="border p-2 mr-2" />
        <input type="number" value={form.hourlyFee} onChange={e=>setForm({...form,hourlyFee:Number(e.target.value)})} className="border p-2 mr-2" />
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {coaches.map(c => (
          <li key={c._id} className="bg-white p-3 rounded flex justify-between">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-600">₹{c.hourlyFee}/hr</div>
            </div>
            <div><button onClick={()=>update(c._id)} className="px-2 py-1 bg-gray-200 rounded">Edit</button></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
