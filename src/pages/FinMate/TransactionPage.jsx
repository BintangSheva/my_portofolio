import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; 
import "./dashboard.css"; // Boleh dinyalain kalau mau stylenya ngikut dashboard

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth()); // Filter Bulan
  
  // === STATE KHUSUS EDIT ===
  const [editId, setEditId] = useState(null); // Kalau null = Mode Input Baru, Kalau ada ID = Mode Edit

  const [formData, setFormData] = useState({
    name: "", amount: "", date: new Date().toISOString().split('T')[0], type: "expense"
  });

  const userId = localStorage.getItem("userId");

  // 1. AMBIL DATA
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        // Urutkan dari yang terbaru
        setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (userId) fetchTransactions();
  }, [userId]);

  // 2. HANDLE SUBMIT (Bisa SIMPAN atau UPDATE) 🧠
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Cek: Ini lagi Edit atau Bikin Baru?
    const url = editId 
        ? `http://localhost:5000/api/transactions/${editId}` // Jalur Edit (PUT)
        : "http://localhost:5000/api/transactions";          // Jalur Baru (POST)
    
    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (response.ok) {
        alert(editId ? "Data Berhasil Direvisi! ✨" : "Transaksi Berhasil Disimpan! 💾");
        setFormData({ name: "", amount: "", date: new Date().toISOString().split('T')[0], type: "expense" }); // Reset Form
        setEditId(null); // Keluar dari mode edit
        fetchTransactions(); // Refresh List
      } else {
        alert("Gagal menyimpan data");
      }
    } catch (err) { alert("Error connecting to server"); }
  };

  // 3. FUNGSI KLIK TOMBOL EDIT ✏️
  const handleEditClick = (trx) => {
    setEditId(trx._id); // Tandain kita lagi ngedit ID ini
    setFormData({
        name: trx.name,
        amount: trx.amount,
        date: trx.date.split('T')[0], // Format tanggal biar masuk ke input date
        type: trx.type || (trx.category === 'income' ? 'income' : 'expense')
    });
    // Scroll ke atas biar user liat formnya
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. FUNGSI HAPUS
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus permanen?")) return;
    await fetch(`http://localhost:5000/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  // 5. TOMBOL BATAL EDIT
  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ name: "", amount: "", date: new Date().toISOString().split('T')[0], type: "expense" });
  };

  const formatRupiah = (num) => "Rp " + Number(num).toLocaleString('id-ID');

  // Filter Data di Frontend (Biar cepet)
  const filteredData = transactions.filter(t => new Date(t.date).getMonth() === Number(filterMonth));

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#fdfbf7'}}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        
        <h1 style={{color:'#2d6a4f', marginTop:0}}>Kelola Transaksi 📝</h1>
        <p style={{color:'#6b7280', marginBottom:'20px'}}>Input, edit, atau hapus riwayat keuanganmu di sini.</p>
        
        {/* === FORM INPUT / EDIT === */}
        <div style={{background:'white', padding:'25px', borderRadius:'15px', boxShadow:'0 4px 6px rgba(0,0,0,0.05)', marginBottom:'30px', borderLeft: editId ? '5px solid #f59e0b' : '5px solid #10b981'}}>
            <h3 style={{marginTop:0, color:'#374151'}}>{editId ? "✏️ Mode Edit Transaksi" : "➕ Tambah Transaksi Baru"}</h3>
            
            <form onSubmit={handleSubmit} style={{display:'grid', gap:'15px'}}>
                <div style={{display:'flex', gap:'15px', flexWrap:'wrap'}}>
                    <input type="text" placeholder="Nama Transaksi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{flex:2, minWidth:'200px', padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}} />
                    <input type="number" placeholder="Nominal" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required style={{flex:1, minWidth:'150px', padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}} />
                </div>
                <div style={{display:'flex', gap:'15px', flexWrap:'wrap'}}>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required style={{flex:1, minWidth:'150px', padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}} />
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{flex:1, minWidth:'150px', padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}>
                        <option value="expense">Pengeluaran 🔴</option>
                        <option value="income">Pemasukan 🟢</option>
                    </select>
                </div>
                
                <div style={{display:'flex', gap:'10px'}}>
                    <button type="submit" style={{flex:1, padding:'12px', background: editId ? '#f59e0b' : '#10b981', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer', fontSize:'1rem'}}>
                        {editId ? "Update Data 🔄" : "Simpan Data 💾"}
                    </button>
                    {editId && (
                        <button type="button" onClick={handleCancelEdit} style={{padding:'12px 20px', background:'#ef4444', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>
                            Batal ❌
                        </button>
                    )}
                </div>
            </form>
        </div>

        {/* === LIST TRANSAKSI === */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
            <h3 style={{margin:0, color:'#374151'}}>Riwayat Bulan Ini</h3>
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{padding:'10px', borderRadius:'10px', border:'1px solid #ddd', cursor:'pointer'}}>
                <option value="0">Januari</option>
                <option value="1">Februari</option>
                <option value="2">Maret</option>
                <option value="3">April</option>
                <option value="4">Mei</option>
                <option value="5">Juni</option>
                {/* Tambahin bulan lain kalau perlu */}
            </select>
        </div>

        {loading ? <p>Loading...</p> : (
            <div style={{background:'white', borderRadius:'15px', overflow:'hidden', boxShadow:'0 4px 6px rgba(0,0,0,0.05)'}}>
                {filteredData.length === 0 ? (
                    <div style={{padding:'40px', textAlign:'center', color:'#9ca3af'}}>
                        <p>Belum ada transaksi di bulan ini.</p>
                        <p style={{fontSize:'0.8rem'}}>Coba ganti filter bulan atau input data baru di atas.</p>
                    </div>
                ) : (
                    <table style={{width:'100%', borderCollapse:'collapse'}}>
                        <thead>
                            <tr style={{background:'#f3f4f6', textAlign:'left', borderBottom:'1px solid #e5e7eb'}}>
                                <th style={{padding:'15px', color:'#4b5563'}}>Tanggal</th>
                                <th style={{padding:'15px', color:'#4b5563'}}>Keterangan</th>
                                <th style={{padding:'15px', color:'#4b5563'}}>Nominal</th>
                                <th style={{padding:'15px', color:'#4b5563', textAlign:'center'}}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((trx) => (
                                <tr key={trx._id} style={{borderBottom:'1px solid #f3f4f6'}}>
                                    <td style={{padding:'15px', color:'#6b7280', fontSize:'0.9rem'}}>{new Date(trx.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</td>
                                    <td style={{padding:'15px', fontWeight:'bold', color:'#374151'}}>{trx.name}</td>
                                    <td style={{padding:'15px', fontWeight:'bold', color: (trx.type === 'income' || trx.category === 'income') ? '#10b981' : '#ef4444'}}>
                                        {(trx.type === 'income' || trx.category === 'income') ? '+' : '-'} {formatRupiah(trx.amount)}
                                    </td>
                                    <td style={{padding:'15px', textAlign:'center'}}>
                                        <button onClick={() => handleEditClick(trx)} style={{marginRight:'15px', background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'8px', padding:'5px 10px', cursor:'pointer', fontSize:'1rem', color:'#2563eb'}} title="Edit">✏️</button>
                                        <button onClick={() => handleDelete(trx._id)} style={{background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'8px', padding:'5px 10px', cursor:'pointer', fontSize:'1rem', color:'#dc2626'}} title="Hapus">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default Transactions;