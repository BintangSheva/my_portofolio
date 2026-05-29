import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css"; // Pake CSS Sakti yang tadi

export default function Login() {
  // 1. State Animasi (Default: True biar intro dulu)
  const [isIntro, setIsIntro] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // 1. Simpan Token & ID
        localStorage.setItem("token", data.token); 
        localStorage.setItem("userId", data.user._id || data.user.id); 
        
        // 2. Simpan Nama
        const namaUser = data.user.name || "User";
        localStorage.setItem("activeUser", namaUser);

        alert(`Login Berhasil! Welcome back, ${namaUser}`);
        
        // ❌ HAPUS YANG INI (Bikin error karena gak refresh):
        // navigate("/dashboard"); 

        // ✅ GANTI JADI INI (Paksa Reload Halaman):
        // Perhatikan ada '/my_portofolio' karena lu pake basename di App.jsx
        window.location.href = "/my_portofolio/dashboard"; 

      } else {
        setError(data.message || "Email atau Password salah");
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
    }
  };
  
  // Fungsi Buka Tirai
  const handleIntroClick = () => {
    if (isIntro) setIsIntro(false);
  };

  return (
    <div className={`auth-container ${isIntro ? "intro-active" : ""}`}>
      
      <div className="auth-card">
        
        {/* === BAGIAN KIRI (HIJAU) === */}
        <div className="auth-left" onClick={handleIntroClick}>
          
          {/* KONTEN INTRO (PAS FULL SCREEN) */}
          {isIntro && (
            <div className="intro-content">
              <h1 className="intro-title">Welcome*</h1>
              <p className="intro-desc">Click to access your finance</p>
            </div>
          )}

          {/* KONTEN NORMAL (PAS UDAH KEBUKA) */}
          {!isIntro && (
            <div className="normal-content">
              <div className="brand-logo" style={{fontSize: '24px', fontWeight:'bold'}}>FinMate*</div>
              <div className="left-text">
                <h1 style={{fontSize: '42px', marginBottom:'20px', fontWeight:'800'}}>
                  Welcome Back,<br />Saver!
                </h1>
                <p style={{fontSize: '16px', lineHeight:'1.6', maxWidth:'80%'}}>
                  Lanjutkan progres hematmu dan lihat seberapa jauh kamu berkembang hari ini.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* === BAGIAN KANAN (FORM) === */}
        <div className="auth-right">
          <div className="auth-header">
            <h2 style={{fontSize:'32px', fontWeight:'800', marginBottom:'10px'}}>Log in</h2>
            <p style={{color:'#6b7280'}}>Masuk ke akun FinMate kamu</p>
          </div>

          {error && <div className="error-msg" style={{color: 'red', marginBottom: '20px', textAlign:'center', backgroundColor:'#fee2e2', padding:'10px', borderRadius:'8px'}}>{error}</div>}

          <form onSubmit={handleSubmit}>
            
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block', fontWeight:'600', marginBottom:'8px'}}>Email</label>
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                placeholder="nama@email.com" 
                onChange={handleChange} 
                required 
                style={{width:'100%', padding:'16px', border:'2px solid #e5e7eb', borderRadius:'8px'}}
              />
            </div>

            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block', fontWeight:'600', marginBottom:'8px'}}>Password</label>
              <input 
                type="password" 
                name="password" 
                className="form-input" 
                placeholder="••••••••" 
                onChange={handleChange} 
                required 
                style={{width:'100%', padding:'16px', border:'2px solid #e5e7eb', borderRadius:'8px'}}
              />
            </div>

            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', fontSize:'14px'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                    <input type="checkbox" id="remember" style={{marginRight:'8px'}} />
                    <label htmlFor="remember">Ingat Saya</label>
                </div>
                <a href="#" style={{color:'#16a34a', fontWeight:'600', textDecoration:'none'}}>Lupa Password?</a>
            </div>

            <button type="submit" className="btn-submit" 
                    style={{width:'100%', padding:'16px', background:'#15803d', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>
              Masuk Dashboard
            </button>
          </form>

          <p style={{marginTop:'30px', textAlign:'center', color:'#6b7280'}}>
            Belum punya akun? <Link to="/register" style={{color:'#16a34a', fontWeight:'bold', textDecoration:'none'}}>Daftar Sekarang</Link>
          </p>
        </div>

      </div>
    </div>
  );
}