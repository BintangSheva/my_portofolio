import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi buat ngecek halaman mana yang lagi aktif
  const isActive = (path) => location.pathname === path ? "active" : "";

  // Fungsi buat tombol (+) di tengah
  const handleAddClick = () => {
    // Arahin ke dashboard lalu scroll halus ke form input transaksi
    navigate("/dashboard");
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="bottom-nav-container">
      <nav className="bottom-nav">
        
        {/* Menu 1: Home / Overview */}
        <Link to="/dashboard" className={`nav-item ${isActive("/dashboard")}`}>
          <span className="icon">🏠</span>
          <span className="label">Home</span>
        </Link>

        {/* Menu 2: History / Transactions */}
        <Link to="/transactions" className={`nav-item ${isActive("/transactions")}`}>
          <span className="icon">📊</span>
          <span className="label">History</span>
        </Link>

        {/* Menu 3: FLOATING ACTION BUTTON (TENGAH) */}
        <div className="nav-item fab-container">
          <button className="fab-btn" onClick={handleAddClick}>
            +
          </button>
        </div>

        {/* Menu 4: Target Planner */}
        <Link to="/planner" className={`nav-item ${isActive("/planner")}`}>
          <span className="icon">🎯</span>
          <span className="label">Target</span>
        </Link>

        {/* Menu 5: Settings / Profile */}
        <Link to="/settings" className={`nav-item ${isActive("/settings")}`}>
          <span className="icon">👤</span>
          <span className="label">Profile</span>
        </Link>

      </nav>
    </div>
  );
};

export default Sidebar;