import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom"; // Buat pindah halaman pas logout
import "./Settings.css";

const Settings = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 1. AMBIL DATA USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/profile/${userId}`);
        const data = await res.json();
        if (res.ok) {
            setUser(data.user || data);
            setNewName(data.user?.name || data.name);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [userId]);

  // 2. FUNGSI GANTI NAMA
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        alert("✅ Nama berhasil diupdate!");
        window.location.reload(); // Refresh biar sidebar juga berubah
      }
    } catch (err) {
      alert("Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  // 3. FUNGSI RESET DATA (HAPUS SEMUA)
  const handleResetData = async () => {
    const confirm = window.confirm(
      "⚠️ PERINGATAN KERAS!\n\nSemua Transaksi & Target Mimpi akan DIHAPUS PERMANEN.\nStatus AI akan kembali ke 'New Member'.\n\nAnda yakin mau mulai dari nol?"
    );

    if (confirm) {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/reset/${userId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("✨ Data berhasil di-reset! Kembali bersih seperti baru.");
          window.location.href = "/dashboard"; // Lempar balik ke dashboard
        }
      } catch (err) {
        alert("Gagal reset data.");
      }
    }
  };

  // 4. FUNGSI LOGOUT
  const handleLogout = () => {
    const confirm = window.confirm("Yakin mau keluar?");
    if (confirm) {
        localStorage.removeItem("userId"); // Hapus kunci masuk
        localStorage.removeItem("token");
        navigate("/"); // Tendang ke halaman Login/Home
    }
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="settings-container">
        <h1 className="settings-title">Settings ⚙️</h1>

        {/* KARTU 1: EDIT PROFIL */}
        <div className="settings-card">
          <div className="card-header">
            <h3>👤 Profil Kamu</h3>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Email (Tidak bisa diubah)</label>
              <input type="text" value={user.email} disabled style={{background:'#f3f4f6', cursor:'not-allowed'}} />
            </div>
            <button type="submit" className="btn-save">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>

        {/* KARTU 2: DANGER ZONE */}
        <div className="settings-card danger-zone">
          <div className="card-header" style={{borderBottomColor:'#fca5a5'}}>
            <h3>🚨 Danger Zone</h3>
          </div>
          <div className="danger-text">
            <p><strong>Reset Data:</strong> Menghapus semua riwayat transaksi, target planner, dan reset status AI. Tindakan ini tidak bisa dibatalkan.</p>
          </div>
          
          <button onClick={handleResetData} className="btn-danger">
            🗑️ Reset Semua Data
          </button>
          
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;