import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- IMPORT KOMPONEN PORTOFOLIO ---
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Hello from "./components/Hello";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import Landing from "./pages/FinMate/Landing";

// --- IMPORT HALAMAN FINMATE ---
import Login from "./pages/FinMate/Login";
import Register from "./pages/FinMate/Register";
import FinMateDashboard from "./pages/FinMate/FinMateDashboard";
import TransactionPage from "./pages/FinMate/TransactionPage";
import Planner from "./pages/FinMate/Planner";

// 👇 1. IMPORT SETTINGS DI SINI (PENTING!)
import Settings from "./pages/FinMate/settings"; 

function App() {
  // 👇 2. DEFINISIKAN VARIABLE INI (INI YANG BIKIN ERROR TADI)
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    // Basename memastikan semua rute dimulai dengan /my_portofolio
    <Router basename="/my_portofolio">
      <Routes>
        
        {/* ZONA 1: HALAMAN PORTOFOLIO */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Hello />
              <About />
              <Projects />
              <Contact />
            </>
          }
        />

        {/* ZONA 2: HALAMAN FINMATE */}
        
        {/* Akses: localhost:5173/my_portofolio/login */}
        <Route path="/login" element={<Login />} />
        
        {/* Akses: localhost:5173/my_portofolio/register */}
        <Route path="/register" element={<Register />} />

        {/* Akses: localhost:5173/my_portofolio/finmate */}
        <Route path="/finmate" element={<Landing />} />

        {/* === PROTECTED ROUTES (HARUS LOGIN) === */}
        {/* Kalau user belum login (isAuthenticated false), lempar ke /login */}

        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <FinMateDashboard /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/transactions" 
          element={isAuthenticated ? <TransactionPage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/planner" 
          element={isAuthenticated ? <Planner /> : <Navigate to="/login" />} 
        />

        {/* 👇 3. ROUTE SETTINGS (Udah dibenerin: Pake Huruf Besar <Settings />) */}
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
        />

        {/* REDIRECT: Kalau ada yang akses path aneh-aneh, lempar ke home portofolio */}
        {/* Taruh ini PALING BAWAH */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;