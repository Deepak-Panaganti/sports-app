import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EquipmentAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", totalStock: 1, rentalPrice: 1 });

  useEffect(()=> load(), []);
  async function load(){ const res = await axios.get("/api/equipment"); setItems(res.data); }

  async function create(e){
    e.preventDefault();
    await axios.post("/api/equipment", form);
    setForm({ name: "", totalStock: 1, rentalPrice: 1 });
    load();
  }

  async function update(id){
    const name = prompt("Name?");
    const stock = prompt("Stock?");
    const price = prompt("Price?");
    const payload = {};
    if (name) payload.name = name;
    if (stock) payload.totalStock = Number(stock);
    if (price) payload.rentalPrice = Number(price);
    await axios.put(`/api/equipment/${id}`, payload);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Equipment</h1>
      <form onSubmit={create} className="mb-4 space-y-2">
        <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border p-2" />
        <input type="number" value={form.totalStock} onChange={e=>setForm({...form,totalStock:Number(e.target.value)})} className="border p-2" />
        <input type="number" value={form.rentalPrice} onChange={e=>setForm({...form,rentalPrice:Number(e.target.value)})} className="border p-2" />
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Add Equipment</button>
      </form>

      <ul className="space-y-2">
        {items.map(i => (
          <li key={i._id} className="bg-white p-3 rounded shadow flex justify-between">
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-gray-600">Stock: {i.totalStock} — ₹{i.rentalPrice}</div>
            </div>
            <div><button onClick={()=>update(i._id)} className="px-2 py-1 bg-gray-200 rounded">Edit</button></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
