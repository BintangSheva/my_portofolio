import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar"; 
import { Link } from "react-router-dom";
// Pastikan install: npm install recharts
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'; 
import Swal from 'sweetalert2';
import "./dashboard.css"; 

const FinMateDashboard = () => {
  // === STATE ===
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]); 
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // Filter Bulan
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // 👇 STATE FORM BARU (Ada Category)
  const [newTrans, setNewTrans] = useState({
    name: "", 
    amount: "", 
    date: new Date().toISOString().split('T')[0], 
    type: "expense",
    category: "Makanan" // Default kategori awal
  });

  const amountInputRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // === DATA KATEGORI (BIAR RAPI) ===
  const expenseCategories = ["Makanan", "Transport", "Belanja", "Hiburan", "Tagihan", "Kesehatan", "Pendidikan", "Lainnya"];
  const incomeCategories = ["Gaji", "Bonus", "Usaha", "Investasi", "Hadiah", "Lainnya"];

  // Pilih list kategori berdasarkan tipe transaksi (Expense/Income)
  const currentCategories = newTrans.type === "expense" ? expenseCategories : incomeCategories;

  // === 1. FETCH DATA ===
  const fetchRealData = async () => {
    if (!userId) return;

    try {
      const resProfile = await fetch(`http://localhost:5000/api/auth/profile/${userId}`);
      const dataProfile = await resProfile.json();
      
      const resTrans = await fetch(`http://localhost:5000/api/transactions?userId=${userId}`);
      const dataTrans = await resTrans.json();

      const resGoals = await fetch(`http://localhost:5000/api/goals?userId=${userId}`);
      const dataGoals = await resGoals.json();

      if (resProfile.ok) setUserProfile(dataProfile.user || dataProfile);
      if (resTrans.ok) setTransactions(dataTrans);
      if (resGoals.ok) setGoals(dataGoals);

    } catch (err) {
      console.error("Gagal konek:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  // === 2. LOGIKA HITUNG DUIT ===
  const monthlyTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === Number(selectedMonth) && tDate.getFullYear() === Number(selectedYear);
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income" || t.category === "income" || t.category === "Pemasukan")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = monthlyTransactions
    .filter((t) => t.type === "expense" || t.category === "expense" || t.category === "Pengeluaran")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalPlannerSavings = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  const currentMonthBalance = totalIncome - totalExpense;

  // === 3. LOGIKA INPUT TRANSAKSI ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTrans, userId }), 
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Transaksi ${newTrans.category} disimpan 💾`,
          showConfirmButton: false,
          timer: 1500 
        });
        fetchRealData(); 
        // Reset form
        setNewTrans({ ...newTrans, name: "", amount: "", category: "Makanan" }); 
      }
    } catch (err) { 
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Gagal menyimpan transaksi!' });
    }
  };

  // === 4. FITUR DELETE ===
  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Yakin mau hapus?',
        text: "Data yang dihapus gak bisa balik lagi lho! 🗑️",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`http://localhost:5000/api/transactions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                Swal.fire('Terhapus!', 'Transaksi berhasil dihapus.', 'success');
                fetchRealData(); 
            }
        } catch (error) {
            Swal.fire('Gagal', 'Terjadi kesalahan.', 'error');
        }
    }
  };

  // === 5. QUICK FILL (DENGAN KATEGORI OTOMATIS) ===
  const quickActions = [
    { label: "🍛 Makan", type: "expense", category: "Makanan", name: "Makan Siang/Malam" },
    { label: "☕ Ngopi", type: "expense", category: "Hiburan", name: "Kopi/Snack" },
    { label: "🛵 Ojol", type: "expense", category: "Transport", name: "Transport Ojol" },
    { label: "🛒 Minimarket", type: "expense", category: "Belanja", name: "Belanja Harian" },
    { label: "⛽ Bensin", type: "expense", category: "Transport", name: "Isi Bensin" },
  ];

  const handleQuickFill = (action) => {
    setNewTrans({ 
        ...newTrans, 
        name: action.name, 
        type: action.type, 
        category: action.category, // 👇 Otomatis pilih kategori
        amount: "" 
    });
    if(amountInputRef.current) amountInputRef.current.focus();
  };

  // === 6. AI ANALYZE ===
  const handleAnalyze = async () => {
    try {
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const namaBulan = monthNames[selectedMonth];
      
      Swal.fire({
        title: `Menganalisa ${namaBulan}...`,
        text: 'AI sedang bekerja, mohon tunggu sebentar 🧠',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      const res = await fetch(`http://localhost:5000/api/transactions/analyze/${userId}?month=${selectedMonth}&year=${selectedYear}`);
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Analisa Selesai!',
            html: `Status Bulan <b>${namaBulan}</b>: <br/> <h2>${data.cluster}</h2>`,
            confirmButtonColor: '#10b981'
        });
        fetchRealData(); 
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: data.message || "Terjadi kesalahan pada AI." });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error Koneksi', text: 'Gagal menghubungi server AI.' });
    }
  };

  // === CONFIG UI ===
  const getStatusConfig = (label) => {
    const safeLabel = label || "New Member";
    if (safeLabel.includes("No Activity") || safeLabel.includes("New Member") || safeLabel.includes("Hibernating")) {
        return { text: "NO ACTIVITY", icon: "💤", color: "#64748b", textColor: "white", desc: "Belum ada transaksi bulan ini." };
    }
    if (safeLabel.includes("Hemat") || safeLabel.includes("Saver")) {
        return { text: "RICH SAVER", icon: "💎", color: "#10b981", textColor: "white", desc: "Mantap! Pertahankan gaya hidup hematmu." };
    }
    if (safeLabel.includes("Boros") || safeLabel.includes("Spender")) {
        return { text: "BIG SPENDER", icon: "🔥", color: "#ef4444", textColor: "white", desc: "Warning! Pengeluaranmu besar." };
    }
    return { text: "BALANCED", icon: "⚖️", color: "#f59e0b", textColor: "white", desc: "Keuangan stabil, tetap waspada." };
  };

  const statusConfig = getStatusConfig(userProfile?.clusterLabel || "New Member");
  const savingRatio = totalIncome > 0 ? ((currentMonthBalance / totalIncome) * 100).toFixed(0) : 0;
  const formatRupiah = (num) => "Rp " + Number(num).toLocaleString('id-ID');

  const chartData = [
    { name: 'Sisa Bulan Ini', value: currentMonthBalance > 0 ? currentMonthBalance : 0, color: '#10b981' }, 
    { name: 'Pengeluaran', value: totalExpense, color: '#ef4444' },
    { name: 'Tabungan Planner', value: totalPlannerSavings, color: '#3b82f6' }
  ];

  if (loading) return <div style={{textAlign:"center", padding:"50px"}}>Loading FinMate... ⏳</div>;

  return (
    <div className="dashboard-wrapper">
      
      {/* OVERLAY HITAM (HP ONLY) */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      {/* BOTTOM NAVIGATION (Pengganti Sidebar Lama) */}
      <Sidebar />

      {/* KONTEN UTAMA */}
      <div className="main-content">
        
      
        
        {/* HEADER & BANNER */}
        <section className="status-banner" style={{ 
            background: `linear-gradient(135deg, ${statusConfig.color} 0%, ${statusConfig.color}dd 100%)`, 
            color: statusConfig.textColor, 
        }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.85rem', opacity: 0.9, margin:0 }}>FINMATE AI STATUS</p>
              <h1 className="status-label">{statusConfig.text} {statusConfig.icon}</h1>
              <p style={{fontSize:'1rem', opacity:0.9, fontStyle:'italic'}}>{statusConfig.desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 800, opacity: 0.9, margin:0 }}>SAVING RATIO</p>
              <p style={{ fontSize: '3.5rem', fontWeight: 900, margin:0 }}>{savingRatio}%</p>
            </div>
        </section>

        {/* FILTER BULAN */}
        <div className="filter-container" style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <select className="input-field" style={{ padding: '0.5rem 1rem', borderRadius: '50px', border:'1px solid #ccc' }} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="0">Januari</option>
              <option value="1">Februari</option>
              <option value="2">Maret</option>
              <option value="3">April</option>
              <option value="4">Mei</option>
            </select>
            <span style={{ background: '#2d6a4f', color: 'white', padding: '0.6rem 2rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '800' }}>
              DATA: {new Date(selectedYear, selectedMonth).toLocaleString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()} 📅
            </span>
        </div>

        {/* KARTU PLANNER CANGGIH (DENGAN RINCIAN) */}
            <div className="stat-card savings" style={{borderLeft:'5px solid #3b82f6', alignItems: 'stretch', textAlign:'left'}}>
                {/* BAGIAN ATAS: TOTAL */}
                <div style={{textAlign:'center', marginBottom:'15px'}}>
                    <p style={{color:'#3b82f6', margin:0, fontSize:'0.8rem'}}>Total Tabungan</p>
                    <h3 style={{color:'#3b82f6', fontSize:'1.8rem', margin:'5px 0'}}>{formatRupiah(totalPlannerSavings)}</h3>
                </div>

                {/* GARIS PEMBATAS TIPIS */}
                <div style={{borderTop:'1px solid #e5e7eb', marginBottom:'15px'}}></div>

                {/* BAGIAN BAWAH: LIST TARGET (Maksimal 3) */}
                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                    {goals.length === 0 ? (
                        <p style={{textAlign:'center', fontSize:'0.8rem', color:'#9ca3af', fontStyle:'italic'}}>
                            Belum ada target impian.
                        </p>
                    ) : (
                        goals.slice(0, 3).map((goal, idx) => {
                            // Hitung Persentase
                            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                            
                            return (
                                <div key={idx} style={{fontSize:'0.75rem'}}>
                                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'3px', color:'#4b5563', fontWeight:'600'}}>
                                        <span>{goal.title || "Target"}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    {/* Progress Bar Background */}
                                    <div style={{width:'100%', height:'6px', background:'#dbeafe', borderRadius:'10px', overflow:'hidden'}}>
                                        {/* Progress Bar Isi */}
                                        <div style={{
                                            width: `${progress}%`, 
                                            height:'100%', 
                                            background:'#3b82f6', 
                                            borderRadius:'10px',
                                            transition: 'width 0.5s ease-in-out'
                                        }}></div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    
                    {/* Tulisan 'Lihat Semua' kalo targetnya banyak */}
                    {goals.length > 3 && (
                        <div style={{textAlign:'center', marginTop:'5px'}}>
                            <small style={{color:'#3b82f6', fontSize:'0.7rem'}}>+ {goals.length - 3} target lainnya</small>
                        </div>
                    )}
                </div>
            </div>
            
        {/* CHART & HISTORY */}
        <div className="chart-history-wrapper" style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
            {/* GRAFIK */}
            <div style={{flex:1, background:'white', padding:'25px', borderRadius:'20px', minWidth:'300px', boxShadow:'0 4px 6px rgba(0,0,0,0.05)'}}>
                <h3 style={{color:'#1f2937', marginTop:0, textAlign:'center'}}>Analisa Bulan Ini 📊</h3>
                {(totalIncome === 0 && totalExpense === 0) ? (
                    <div style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>Belum ada data bulan ini.</div>
                ) : (
                    <div style={{width:'100%', height:'300px'}}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => formatRupiah(value)} />
                                <Legend verticalAlign="bottom"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* LIST RIWAYAT - MENAMPILKAN KATEGORI */}
            <div style={{flex:1, background:'white', padding:'25px', borderRadius:'20px', minWidth:'300px', boxShadow:'0 4px 6px rgba(0,0,0,0.05)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                    <h3 style={{color:'#1f2937', margin:0}}>Transaksi Terakhir 📜</h3>
                    <Link to="/transactions" style={{textDecoration:'none', color:'#2d6a4f', fontWeight:'bold'}}>Lihat Semua →</Link>
                </div>
                {monthlyTransactions.length === 0 ? (
                    <p style={{textAlign:'center', color:'#9ca3af'}}>Sepi nih, belum ada transaksi.</p>
                ) : (
                    <ul style={{listStyle:'none', padding:0}}>
                        {monthlyTransactions.slice(0, 5).map((t) => (
                            <li key={t._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 0', borderBottom:'1px solid #f3f4f6'}}>
                                <div>
                                    <strong style={{display:'block', fontSize:'0.95rem'}}>{t.name}</strong>
                                    {/* 👇 TAMPILKAN KATEGORI DI SINI */}
                                    <span style={{fontSize:'0.75rem', color:'#64748b', background:'#f1f5f9', padding:'2px 8px', borderRadius:'10px', marginRight:'8px'}}>
                                        {t.category || "Lainnya"}
                                    </span>
                                    <span style={{fontSize:'0.8rem', color:'#9ca3af'}}>{new Date(t.date).toLocaleDateString()}</span>
                                </div>
                                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                                    <span style={{fontWeight:'bold', color: (t.type === 'income' || t.category === 'income') ? '#10b981' : '#ef4444'}}>
                                        {(t.type === 'income' || t.category === 'income') ? '+' : '-'} {formatRupiah(t.amount)}
                                    </span>
                                    <button 
                                        onClick={() => handleDelete(t._id)}
                                        style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.1rem', opacity: 0.6}}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        {/* AI BUTTON & INPUT */}
        <div style={{ paddingBottom: '3rem' }}>
            
            {/* KARTU AI ENGINE (Udah disesuaikan margin & paddingnya) */}
            <div style={{ background: 'white', padding: '24px', margin: '0 24px 24px 24px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}>
                <h3 style={{ marginBottom: '1rem', color: '#2d6a4f', fontSize: '1.1rem', fontWeight: '700' }}>AI Intelligent Engine 🧠</h3>
                <button onClick={handleAnalyze} className="btn-submit" style={{ backgroundColor: '#10b981', margin: 0, width: '100%' }}>
                  RE-ANALYZE GAYA HIDUP 🚀
                </button>
            </div>

            {/* KARTU CATAT TRANSAKSI BARU */}
            <section className="input-section">
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#2d6a4f' }}>Catat Transaksi Baru 📝</h3>
                
                {/* QUICK FILL */}
                <div className="quick-fill-container" style={{marginBottom: '20px'}}>
                  <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '10px', textAlign:'center'}}>Jalan Pintas (Quick Fill):</p>
                  <div className="quick-fill-scroll">
                    {quickActions.map((action, index) => (
                      <button 
                        key={index}
                        type="button" 
                        onClick={() => handleQuickFill(action)}
                        style={{
                          padding: '8px 15px', border: '1px solid #e2e8f0', borderRadius: '20px',
                          background: '#f1f5f9', color: '#334155', cursor: 'pointer',
                          fontSize: '0.85rem', fontWeight: '600', transition: '0.2s'
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FORM INPUTNYA (Udah 100% rapi pake flex column) */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <input type="text" className="input-field" placeholder="Keterangan" value={newTrans.name} onChange={e => setNewTrans({...newTrans, name: e.target.value})} required style={{ margin: 0 }} />
                    <input ref={amountInputRef} type="number" className="input-field" placeholder="Jumlah (Rp)" value={newTrans.amount} onChange={e => setNewTrans({...newTrans, amount: e.target.value})} required style={{ margin: 0 }} />

                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                        <select className="input-field" value={newTrans.type} onChange={e => setNewTrans({...newTrans, type: e.target.value, category: "Lainnya"})} style={{ flex: 1, margin: 0 }}>
                            <option value="expense">Pengeluaran 🔴</option>
                            <option value="income">Pemasukan 🟢</option>
                        </select>
                        <select className="input-field" value={newTrans.category} onChange={e => setNewTrans({...newTrans, category: e.target.value})} style={{ flex: 1, margin: 0 }}>
                            {currentCategories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <input type="date" className="input-field" value={newTrans.date} onChange={e => setNewTrans({...newTrans, date: e.target.value})} required style={{ margin: 0 }} />

                    <button type="submit" className="btn-submit" style={{ marginTop: '5px', width: '100%' }}>
                        Simpan Transaksi ✨
                    </button>
                </form>
            </section>
        </div>

      </div>
    </div>
  );
};

export default FinMateDashboard;