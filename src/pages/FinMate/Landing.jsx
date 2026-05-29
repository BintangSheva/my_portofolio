import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; // JANGAN LUPA IMPORT CSS NYA

const Landing = () => {
  return (
    <div className="landing-container">
      
      {/* HERO SECTION (Bagian Atas Hijau) */}
      <main className="landing-hero">
        {/* Logo Sederhana di atas */}
        <div className="brand-logo">
          Isi Logo Disini
          <span>FinMate*</span>
        </div>

        {/* Headline Utama */}
        <h1 className="hero-title">
          Asisten keuangan cerdas <br/> bertenaga AI.
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Kami menganalisis pola pengeluaranmu (Boros/Hemat) secara real-time menggunakan Machine Learning K-Means agar kamu bisa mencapai kebebasan finansial.
        </p>

        {/* Tombol CTA */}
        <div className="cta-container">
          <Link to="/register" className="btn-primary">
            Daftar Sekarang
          </Link>
          <Link to="/login" className="btn-outline">
            Sudah Punya Akun?
          </Link>
        </div>
      </main>

      {/* FOOTER (Bagian Bawah Putih) */}
      <footer className="landing-footer">
        <p>© 2025 FinMate Project. Built with MERN Stack + ML. Designed for Financial Freedom.</p>
      </footer>

    </div>
  );
};

export default Landing;