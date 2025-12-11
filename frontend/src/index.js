import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./theme.css";

import axios from "axios";

// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

// 🔥 Auto-seed DB + store demo user (DEV MODE ONLY)
if (process.env.NODE_ENV === "development") {
  (async () => {
    try {
      console.log("🔄 Running auto-seed...");
      const res = await fetch("http://localhost:5000/__seed");
      const data = await res.json();

      if (data.user?._id) {
        localStorage.setItem("demoUserId", data.user._id);
        console.log("🌱 Auto-seeded & demoUserId stored:", data.user._id);
      } else {
        console.warn("⚠ No user returned from seed route");
      }
    } catch (err) {
      console.warn("⚠ Auto-seed skipped:", err.message);
    }
  })();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
