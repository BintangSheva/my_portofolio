import React from "react";

const Topbar = () => {
  // HAPUS props { user } di atas.
  // KITA AMBIL LANGSUNG DARI SUMBERNYA (Local Storage)
  // Sama persis kayak logika di Sidebar.jsx
  const nameToDisplay = localStorage.getItem("activeUser") || "Bintang Sheva";

  return (
    <header className="topbar-container">
      <div className="user-greeting">
        {/* Langsung tampilin namanya */}
        <h2>Hi, {nameToDisplay} 👋</h2>
        <p>Ready to manage your salary?</p>
      </div>
    </header>
  );
};

export default Topbar;