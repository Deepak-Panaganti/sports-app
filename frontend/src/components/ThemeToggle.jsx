import React, { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        padding: "8px 14px",
        background: "var(--accent)",
        borderRadius: "8px",
        border: "none",
        color: "white",
        cursor: "pointer",
        fontWeight: "600"
      }}
    >
      {theme === "dark" ? "Light Mode ☀️" : "Dark Mode 🌙"}
    </button>
  );
}

export default ThemeToggle;
