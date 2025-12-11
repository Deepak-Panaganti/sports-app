import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PricingRulesAdmin() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({ name: "", condition: "peak", type: "multiplier", value: 1.2, metadata: {} });

  useEffect(()=>load(), []);
  async function load(){ const res = await axios.get("/api/pricing-rules"); setRules(res.data); }

  async function create(e){
    e.preventDefault();
    await axios.post("/api/pricing-rules", form);
    setForm({ name: "", condition: "peak", type: "multiplier", value: 1.2, metadata:{} });
    load();
  }

  async function toggle(id, enabled){
    await axios.patch(`/api/pricing-rules/${id}/toggle`, { enabled });
    load();
  }

  async function edit(id){
    const name = prompt("Name?");
    const value = prompt("Value?");
    const payload = {};
    if (name) payload.name = name;
    if (value) payload.value = Number(value);
    await axios.put(`/api/pricing-rules/${id}`, payload);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pricing Rules</h1>

      <form onSubmit={create} className="mb-4 space-y-2">
        <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border p-2" />
        <select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} className="border p-2">
          <option value="peak">peak</option>
          <option value="weekend">weekend</option>
          <option value="indoor">indoor</option>
        </select>
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="border p-2">
          <option value="multiplier">multiplier</option>
          <option value="fixed">fixed</option>
        </select>
        <input type="number" step="0.1" value={form.value} onChange={e=>setForm({...form,value:Number(e.target.value)})} className="border p-2" />
        <div><button className="bg-blue-600 text-white px-3 py-1 rounded">Add Rule</button></div>
      </form>

      <ul className="space-y-2">
        {rules.map(r => (
          <li key={r._id} className="bg-white p-3 rounded flex justify-between">
            <div>
              <div className="font-semibold">{r.name} ({r.condition})</div>
              <div className="text-sm text-gray-600">type: {r.type} — value: {r.value} — enabled: {r.enabled ? "yes" : "no"}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>edit(r._id)} className="px-2 py-1 bg-gray-200 rounded">Edit</button>
              <button onClick={()=>toggle(r._id, !r.enabled)} className="px-2 py-1 bg-gray-200 rounded">{r.enabled ? "Disable" : "Enable"}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
