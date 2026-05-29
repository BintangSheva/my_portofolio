import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Planner.css"; // Pastikan import CSS ini ada!

const Planner = () => {
  const [goals, setGoals] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State Form Input
  const [newGoal, setNewGoal] = useState({ title: "", targetAmount: "", category: "lifestyle" });
  const [isAdding, setIsAdding] = useState(false);
  
  // State Modal (Pop Up)
  const [strategyModal, setStrategyModal] = useState(null);

  const userId = localStorage.getItem("userId");

  // === FETCH DATA ===
  const fetchData = async () => {
    try {
      if (!userId) return;
      const resGoals = await fetch(`http://localhost:5000/api/goals?userId=${userId}`);
      const dataGoals = await resGoals.json();
      const resProfile = await fetch(`http://localhost:5000/api/auth/profile/${userId}`);
      const dataProfile = await resProfile.json();

      if (resGoals.ok) setGoals(dataGoals);
      if (resProfile.ok) setUserProfile(dataProfile.user || dataProfile);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [userId]);

  // === OTAK STRATEGI (LOGIKA) ===
  const handleStrategy = (goal) => {
    const aiStatus = userProfile?.clusterLabel || "Balanced"; 
    const gap = goal.targetAmount - goal.currentAmount;
    
    if (gap <= 0) {
        setStrategyModal({
            title: "Target Lunas! 🎉",
            icon: "🏆",
            advice: "Hebat! Target ini sudah tercapai. Kamu bisa hapus kartu ini dan bikin mimpi baru.",
            instrument: "Tabungan / Cash",
            daily: 0,
            goalName: goal.title
        });
        return;
    }

    const dailySave = Math.round(gap / 30); 
    const category = goal.category || "lifestyle"; 

    let strategyTitle = "";
    let icon = "";
    let advice = "";
    let instrument = "";

    // LOGIKA MATRIX (Sama kayak tadi, cuma output ke Modal)
    if (category === "lifestyle") {
        strategyTitle = "The Latte Factor";
        icon = "☕";
        if (aiStatus.includes("Spender") || aiStatus.includes("Boros")) {
            advice = `⚠️ AI mendeteksi kamu Boros. Kurangi 1 gelas kopi/jajan per hari. Alihkan uang jajan itu langsung ke sini!`;
            instrument = "Bank Jago / Seabank (Pocket)";
        } else {
            advice = `✅ Gaya hidupmu Hemat. Pakai rumus 50/30/20. Ambil dari pos 'Keinginan' (30%) kamu.`;
            instrument = "Reksadana Pasar Uang";
        }
    } 
    else if (category === "emergency") {
        strategyTitle = "Liquidity First";
        icon = "🛡️";
        if (aiStatus.includes("Spender")) {
            advice = `🚨 PRIORITAS UTAMA! Jangan mikir beli barang dulu sebelum ini kumpul minimal 3x gaji.`;
            instrument = "Emas Digital (Liquid)";
        } else {
            advice = `🛡️ Jangan tumpuk di bank (kalah sama inflasi). Pindahkan ke instrumen liquid berbunga.`;
            instrument = "Reksadana Pendapatan Tetap";
        }
    }
    else if (category === "future") {
        strategyTitle = "Compound Interest";
        icon = "📈";
        if (aiStatus.includes("Saver") || aiStatus.includes("Hemat")) {
            advice = `💎 Uangmu banyak 'nganggur'. Manfaatkan waktu panjang untuk bunga berbunga.`;
            instrument = "Saham Bluechip (BBCA/BBRI)";
        } else {
            advice = `🌱 Pakai fitur 'Autodebit' tiap gajian biar gak kerasa berat nabung jangka panjang.`;
            instrument = "Obligasi Negara (ORI/SBR)";
        }
    }

    // Buka Modal
    setStrategyModal({
        title: strategyTitle,
        icon: icon,
        advice: advice,
        instrument: instrument,
        daily: dailySave,
        goalName: goal.title
    });
  };

  // CRUD Functions
  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/goals", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newGoal, userId, currentAmount: 0 }),
      });
      if (res.ok) { fetchData(); setIsAdding(false); setNewGoal({ title: "", targetAmount: "", category: "lifestyle" }); }
    } catch (err) { }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus target ini?")) return;
    await fetch(`http://localhost:5000/api/goals/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleAddMoney = async (goal) => {
    const amount = prompt(`Tabung berapa untuk '${goal.title}'?`);
    if (!amount) return;
    const updatedAmount = (goal.currentAmount || 0) + parseInt(amount);
    await fetch(`http://localhost:5000/api/goals/${goal._id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentAmount: updatedAmount }),
    });
    fetchData();
  };

  const formatRupiah = (num) => "Rp " + Number(num).toLocaleString("id-ID");

  return (
    <div className="planner-page">
      <Sidebar />
      <div className="planner-container">
        
        {/* HEADER */}
        <div className="planner-header">
          <div>
            <h1 className="page-title">Financial Dreams 🚀</h1>
            <p className="page-subtitle">Pilih kategori, atur strategi, wujudkan mimpi.</p>
          </div>
          <button className="btn-add-goal" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? "Batal ❌" : "+ Target Baru"}
          </button>
        </div>

        {/* FORM TAMBAH */}
        {isAdding && (
          <div style={{background:'white', padding:'25px', borderRadius:'15px', marginBottom:'30px', boxShadow:'0 4px 6px rgba(0,0,0,0.05)'}}>
            <form onSubmit={handleAddGoal} style={{display:'grid', gap:'15px'}}>
                <div style={{display:'flex', gap:'15px'}}>
                    <input type="text" placeholder="Nama Target" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} required style={{flex:2, padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}/>
                    <input type="number" placeholder="Butuh Rp?" value={newGoal.targetAmount} onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})} required style={{flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}/>
                </div>
                <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                    <select value={newGoal.category} onChange={e => setNewGoal({...newGoal, category: e.target.value})} style={{flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #ddd', background:'#f9fafb'}}>
                        <option value="lifestyle">🏍️ Lifestyle / Barang Impian</option>
                        <option value="emergency">🛡️ Dana Darurat / Keamanan</option>
                        <option value="future">👴 Masa Depan / Investasi</option>
                    </select>
                </div>
                <button type="submit" style={{padding:'15px', background:'#2d6a4f', color:'white', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer'}}>Simpan Target ✨</button>
            </form>
          </div>
        )}

        {/* LIST GOALS (GRID KARTU) */}
        {loading ? <p>Loading...</p> : (
            <div className="goals-grid">
                {goals.map((goal) => {
                    const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) || 0;
                    let catColor = goal.category === 'emergency' ? "#ef4444" : goal.category === 'future' ? "#8b5cf6" : "#3b82f6";
                    return (
                        <div key={goal._id} className="goal-card">
                            <div className="card-top">
                                <span style={{fontSize:'0.75rem', background: catColor, color:'white', padding:'4px 10px', borderRadius:'20px', fontWeight:'bold'}}>
                                    {goal.category?.toUpperCase() || "LIFESTYLE"}
                                </span>
                                <button onClick={() => handleDelete(goal._id)} className="btn-icon">🗑️</button>
                            </div>
                            
                            <h3 className="goal-title">{goal.title}</h3>
                            <div className="money-info">
                                <div className="current-money">{formatRupiah(goal.currentAmount)}</div>
                                <div className="target-money">dari {formatRupiah(goal.targetAmount)}</div>
                            </div>

                            <div className="progress-container">
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: percent >= 100 ? '#10b981' : catColor }}></div>
                                </div>
                                <span className="progress-text">{percent}% Terkumpul</span>
                            </div>

                            <div className="card-actions">
                                <button onClick={() => handleStrategy(goal)} className="btn-secondary">
                                    💡 Strategi
                                </button>
                                <button onClick={() => handleAddMoney(goal)} className="btn-primary-small">
                                    💰 Tabung
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}

        {/* === MODAL POP-UP (YANG BARU) === */}
        {strategyModal && (
            <div className="modal-overlay" onClick={() => setStrategyModal(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <span className="modal-icon">{strategyModal.icon}</span>
                    <span className="strategy-badge">{strategyModal.title}</span>
                    
                    <h2 className="modal-title">Analisa: {strategyModal.goalName}</h2>
                    
                    <p className="modal-body">"{strategyModal.advice}"</p>

                    <div className="recommendation-grid">
                        <div className="rec-box" style={{borderLeftColor: '#3b82f6'}}>
                            <span className="rec-label">💰 Wajib Nabung</span>
                            <span className="rec-val" style={{color: '#2563eb'}}>{formatRupiah(strategyModal.daily)}/hari</span>
                        </div>
                        <div className="rec-box" style={{borderLeftColor: '#10b981'}}>
                            <span className="rec-label">📈 Rekomendasi</span>
                            <span className="rec-val" style={{color: '#059669', fontSize:'0.9rem'}}>{strategyModal.instrument}</span>
                        </div>
                    </div>

                    <button className="btn-close" onClick={() => setStrategyModal(null)}>
                        Siap, Mengerti! 🫡
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Planner;