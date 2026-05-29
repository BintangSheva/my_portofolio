import Transaction from "../models/Transaction.js";
import Goal from "../models/Goal.js";

export const getDashboardData = async (req, res) => {
  try {
    const { userId } = req.query;

    // 1. Cek User ID
    console.log("-------------------------------------------------");
    console.log("🔍 REQUEST MASUK: User minta data dashboard.");
    console.log("🔑 ID yang dikirim Frontend:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID wajib ada!" });
    }

    // 2. Ambil Transaksi (Filter pake User ID)
    const transactions = await Transaction.find({ userId });
    console.log(`✅ Ditemukan ${transactions.length} transaksi milik user ini.`);

    // 3. Hitung Duit (Income vs Expense)
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((trx) => {
      // Pastikan logic ini sesuai sama cara lu nyimpen category/type di database
      if (trx.category === "Pemasukan" || trx.type === "income" || trx.category === "income") {
        totalIncome += Number(trx.amount);
      } else {
        totalExpense += Number(trx.amount);
      }
    });

    // 4. Hitung Saldo Cash
    const balance = totalIncome - totalExpense;

    // 5. Ambil Tabungan Mimpi (Planner)
    const goals = await Goal.find({ userId });
    const totalSavings = goals.reduce((acc, curr) => acc + (curr.currentAmount || 0), 0);
    console.log(`✅ Ditemukan ${goals.length} target mimpi. Total tabungan: ${totalSavings}`);

    // 6. Ambil 5 Transaksi Terakhir
    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1 }) // Paling baru di atas
      .limit(5);

    console.log("-------------------------------------------------");

    // 7. Kirim Data Mateng ke Frontend
    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      totalSavings,
      recentTransactions
    });

  } catch (error) {
    console.error("❌ ERROR Dashboard:", error.message);
    res.status(500).json({ message: error.message });
  }
};