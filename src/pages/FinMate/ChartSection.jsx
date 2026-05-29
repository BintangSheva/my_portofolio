import React from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";

// Kita terima 3 props baru: allTransactions, monthlyData, dan selectedMonth
const ChartSection = ({ allTransactions = [], monthlyData = [], selectedMonth }) => {

  // ===== 1. PIE DATA (Hanya untuk bulan yang dipilih) =====
  const categories = {};
  monthlyData.forEach((t) => {
    if (t.type === "expense") {
      categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
    }
  });

  const pieData = Object.keys(categories).map((cat) => ({
    name: cat,
    value: categories[cat],
  }));

  const COLORS = ["#2d4a22", "#88ab75", "#a67c52", "#e8f0e6", "#f4f7f0"];

  // ===== 2. BAR DATA (Menampilkan semua bulan dari allTransactions) =====
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  
  // Inisialisasi data 12 bulan dengan nilai 0
  const yearlyData = monthNames.map((name, index) => {
    const total = allTransactions
      .filter(t => new Date(t.date).getMonth() === index && t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return { 
      month: name, 
      expense: total,
      index: index // Simpan index untuk pengecekan highlight
    };
  });

  // Filter biar cuma nampilin bulan yang emang ada datanya (biar chart gak kepanjangan)
  const barData = yearlyData.filter(d => d.expense > 0 || d.index <= new Date().getMonth());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

      {/* ================= Pie Chart (Breakdown Bulan Aktif) ================= */}
      <div className="bg-white rounded-[2.5rem] shadow-sm p-6 border border-zinc-50">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 text-center">Expense Breakdown</h2>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Bikin jadi Donut Chart biar lebih modern
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= Bar Chart (Overview Bulanan + Highlight) ================= */}
      <div className="bg-white rounded-[2.5rem] shadow-sm p-6 border border-zinc-50 lg:col-span-2">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 text-center">Monthly Expense Overview</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#88ab75', fontSize: 12, fontWeight: 600 }}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}
            />
            <Bar dataKey="expense" radius={[10, 10, 10, 10]} animationDuration={1000}>
              {barData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  // EFEK POP UP: Jika index bulan sama dengan selectedMonth, warnanya jadi hijau tua
                  fill={entry.index === Number(selectedMonth) ? "#2d4a22" : "#e8f0e6"} 
                  className="transition-all duration-500"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ChartSection;