import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes.js";
import MLRoutes from "./routes/MLRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import goalRoutes from "./routes/goalRoutes.js"; // 👈 Tambah ini

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/transactions", transactionRoutes);
app.use("/api/ml", MLRoutes);
app.use("/api/auth", authRoutes); // <--- Daftar User


// 👇 TAMBAHIN BARIS INI 👇
app.use("/api/goals", goalRoutes);

app.use("/api/dashboard", dashboardRoutes);

// 👇 RUTE DARURAT (Cuma buat ngetes)
app.post("/test-goals", (req, res) => {
  console.log("✅ Rute Darurat Terpanggil!");
  res.json({ message: "Server Hidup Bos!" });
});

// CONNECT DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
