import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  // State: Default TRUE (Layar Full Hijau)
  const [isIntro, setIsIntro] = useState(true);

  // State Form
  const [formData, setFormData] = useState({
    name: "",
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
    // Logic register sama kayak sebelumnya...
    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Registrasi Berhasil!");
          navigate("/login");
        } else {
          setError(data.message || "Registrasi Gagal");
        }
      } catch (err) {
        setError("Terjadi kesalahan server");
      }
  };

  // Handler klik buat buka tirai
  const handleIntroClick = () => {
    if (isIntro) setIsIntro(false);
  };

  return (
    // Class 'intro-active' ditempel di container utama
    <div className={`auth-container ${isIntro ? "intro-active" : ""}`}>
      
      <div className="auth-card">
        
        {/* === BAGIAN KIRI (HIJAU) === */}
        <div className="auth-left" onClick={handleIntroClick}>
          
          {/* KONTEN 1: TAMPIL SAAT FULL SCREEN (INTRO) */}
          {isIntro && (
            <div className="intro-content">
              <h1 className="intro-title">FinMate*</h1>
              <p className="intro-desc">Click anywhere to start journey</p>
            </div>
          )}

          {/* KONTEN 2: TAMPIL SETELAH DIKLIK (NORMAL) */}
          {!isIntro && (
            <div className="normal-content">
              <div className="brand-logo" style={{fontSize: '24px', fontWeight:'bold'}}>FinMate*</div>
              <div className="left-text">
                <h1 style={{fontSize: '42px', marginBottom:'20px', fontWeight:'800'}}>
                  Kelola Keuangan<br />Jadi Lebih Cerdas.
                </h1>
                <p style={{fontSize: '16px', lineHeight:'1.6', maxWidth:'80%'}}>
                  Bergabunglah dengan AI FinMate untuk mendeteksi pola borosmu 
                  dan capai kebebasan finansial hari ini.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* === BAGIAN KANAN (FORM) === */}
        <div className="auth-right">
          <div className="auth-header">
            <h2 style={{fontSize:'32px', fontWeight:'800', marginBottom:'10px'}}>Create an account</h2>
            <p style={{color:'#6b7280'}}>Mulai perjalanan hematmu sekarang</p>
          </div>

          {error && <p style={{color:'red', marginBottom:'10px'}}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block', fontWeight:'600', marginBottom:'8px'}}>Nama Lengkap</label>
              <input type="text" name="name" className="form-input" placeholder="Ex: Bintang Sheva" onChange={handleChange} required 
                     style={{width:'100%', padding:'16px', border:'2px solid #e5e7eb', borderRadius:'8px'}}/>
            </div>

            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block', fontWeight:'600', marginBottom:'8px'}}>Email</label>
              <input type="email" name="email" className="form-input" placeholder="nama@email.com" onChange={handleChange} required 
                     style={{width:'100%', padding:'16px', border:'2px solid #e5e7eb', borderRadius:'8px'}}/>
            </div>

            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block', fontWeight:'600', marginBottom:'8px'}}>Password</label>
              <input type="password" name="password" className="form-input" placeholder="••••••••" onChange={handleChange} required 
                     style={{width:'100%', padding:'16px', border:'2px solid #e5e7eb', borderRadius:'8px'}}/>
            </div>

            <button type="submit" className="btn-submit" 
                    style={{width:'100%', padding:'16px', background:'#15803d', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', marginTop:'10px'}}>
              Get Started
            </button>
          </form>

          <p style={{marginTop:'30px', textAlign:'center', color:'#6b7280'}}>
            Sudah punya akun? <Link to="/login" style={{color:'#16a34a', fontWeight:'bold', textDecoration:'none'}}>Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
}