import React, { useState, useEffect } from "react";

const TipsSection = () => {
  const [clusterData, setClusterData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Ambil User ID yang lagi login
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    // Kalau gak ada user login, gak usah fetch
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    // --- DEFINISI FUNGSI FETCH ADA DI SINI (BIAR GAK ERROR) ---
    const fetchCluster = async () => {
      try {
        // Nembak API ML
        const response = await fetch("http://localhost:5000/api/ml/cluster");
        
        if (response.ok) {
          const data = await response.json();
          
          // Karena backend sekarang balikin LIST semua user, 
          // kita harus cari data punya user yang lagi login ini.
          if (data.analysis) {
             const myResult = data.analysis.find(item => item.userId === currentUserId);
             if (myResult) {
                setClusterData(myResult); 
             }
          }
        } else {
          console.log("Belum cukup data atau error dari server.");
        }
      } catch (error) {
        console.error("Gagal mengambil data cluster:", error);
      } finally {
        setLoading(false);
      }
    };

    // Panggil fungsinya
    fetchCluster();
  }, [currentUserId]);

  // 3. Tentukan Tips berdasarkan Label (Hemat/Boros/Seimbang)
  const getTipContent = () => {
    // A. Masih Loading
    if (loading) return {
        title: "⏳ Menganalisis...", 
        text: "Sabar ya, AI lagi mikir..." 
    };

    // B. Belum ada data cluster (User Baru / Data Kurang)
    if (!clusterData) return {
        title: "👋 Halo Pengguna Baru!",
        text: "Klik tombol 'Analisa Keuangan Saya' di atas buat tau gaya keuanganmu!"
    };

    // C. Udah ada hasil (Cek Label-nya)
    const { label } = clusterData; 

    if (label.includes("Hemat")) {
        return {
           title: "💰 Si Sultan Hemat",
           text: "Mantap! Rasio pengeluaranmu kecil banget. Tabunganmu aman!"
        };
    } else if (label.includes("Boros")) {
        return {
          title: "⚠️ Si Boros (Spender)",
          text: "Waduh! Rasio pengeluaranmu tinggi hampir mepet gaji. Rem dikit jajannya!"
        };
    } else {
        return {
          title: "⚖️ Si Seimbang",
          text: "Keuanganmu stabil. Gak boros, tapi nabungnya bisa ditingkatin lagi."
        };
    }
  };

  const content = getTipContent();

  // 4. Tampilkan UI
  return (
    <div className={`mt-8 p-6 rounded-xl shadow-md border-l-8 transition-all duration-500 ${
        !clusterData ? "bg-blue-50 border-blue-500" : 
        content.title.includes("Boros") ? "bg-red-50 border-red-500" : 
        content.title.includes("Hemat") ? "bg-green-50 border-green-500" :
        "bg-yellow-50 border-yellow-500"
    }`}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">
            {!clusterData ? "🤖" : content.title.includes("Boros") ? "🚨" : content.title.includes("Hemat") ? "💎" : "⚖️"}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${
             !clusterData ? "text-blue-800" :
             content.title.includes("Boros") ? "text-red-800" : 
             content.title.includes("Hemat") ? "text-green-800" :
             "text-yellow-800"
          }`}>
            {content.title}
          </h3>
          <p className="text-gray-700 mt-2 text-lg">
            {content.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipsSection;