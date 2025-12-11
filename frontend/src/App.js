import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import AdminLayout from "./pages/admin/AdminLayout";
import CourtsAdmin from "./pages/admin/CourtsAdmin";
import EquipmentAdmin from "./pages/admin/EquipmentAdmin";
import CoachesAdmin from "./pages/admin/CoachesAdmin";
import PricingRulesAdmin from "./pages/admin/PricingRulesAdmin";
import MyBookings from "./pages/MyBookings";
import "./theme.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<CourtsAdmin />} />
          <Route path="courts" element={<CourtsAdmin />} />
          <Route path="equipment" element={<EquipmentAdmin />} />
          <Route path="coaches" element={<CoachesAdmin />} />
          <Route path="pricing-rules" element={<PricingRulesAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
