import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import Transaction from "../models/Transaction.js";
import ClusterResult from "../models/ClusterResult.js";
import User from "../models/User.js"; // WAJIB IMPORT INI BUAT UPDATE UI

// Konfigurasi path buat nyari file Python
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeFinancialProfile = async (req, res) => {
  try {
    // Ambil ID dari URL params
    const userId = req.params.userId || req.body.userId;
    
    // Tangkep filter bulan & tahun dari Frontend React
    const { month, year } = req.query; 
    const targetMonth = month ? parseInt(month) : new Date().getMonth();
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    // 1. Ambil SEMUA transaksi milik user ini
    const allTransactions = await Transaction.find({ userId: userId });

    // 2. FILTER TRANSAKSI KHUSUS BULAN YANG DIPILIH AJA
    const transactions = allTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === targetMonth && tDate.getFullYear() === targetYear;
    });

    // 3. LOGIKA SATPAM (GUARD CLAUSE) 
    // Kalau bulan itu beneran kosong, langsung tembak No Activity tanpa manggil Python
    if (!transactions || transactions.length === 0) {
      await User.findByIdAndUpdate(userId, { clusterLabel: "No Activity 💤", ratio: 0 });
      return res.status(200).json({ 
        cluster: "No Activity 💤", 
        ratio: 0, 
        message: "Belum ada aktivitas di bulan yang dipilih." 
      });
    }

    // 4. JIKA ADA DATA, LANJUT PANGGIL PYTHON K-MEANS
    const stringifiedData = JSON.stringify(transactions);
    const scriptPath = path.join(__dirname, "..", "ml_model", "kmeans_clustering.py");
    
    const pythonProcess = spawn("python", [scriptPath, stringifiedData]);

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error(`Python Error: ${pythonError}`);
        return res.status(500).json({ message: "Gagal memproses AI Engine." });
      }

      try {
        const mlResult = JSON.parse(pythonOutput);

        if (mlResult.error) {
          return res.status(400).json({ message: mlResult.error });
        }

        // Simpan metrik ilmiah (Silhouette & DBI) ke ClusterResult
        await ClusterResult.findOneAndUpdate(
          { userId: userId },
          {
            clusterId: 1, // Dummy ID, sesuaikan kalau perlu
            runDate: new Date(),
            // Opsional: lu bisa nambahin kolom evaluasi di model ClusterResult lu nanti
          },
          { upsert: true, new: true }
        );

        // UPDATE DATABASE USER BIAR BANNER REACT BERUBAH
        await User.findByIdAndUpdate(userId, {
          clusterLabel: mlResult.cluster,
          ratio: mlResult.ratio
        });

        return res.status(200).json(mlResult);

      } catch (parseErr) {
        console.error("Gagal parsing JSON:", parseErr);
        return res.status(500).json({ message: "Error parsing AI result." });
      }
    });

  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({ message: "Terjadi kesalahan internal server." });
  }
};