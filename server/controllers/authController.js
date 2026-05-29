import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Goal from "../models/Goal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Pastikan udah npm install bcrypt

// === 1. REGISTER (DAFTAR BARU) ===
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email udah ada?
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar bro." });

    // Enkripsi Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat User Baru
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      clusterLabel: "New Member 🌱", // Default label AI
      ratio: 0
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// === 2. LOGIN (MASUK) ===
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User tidak ditemukan." });

    // Cek Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah!" });

    // Bikin Token (KTP Digital)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "rahasia_negara", { expiresIn: "30d" });
    
    // Kirim data user & token ke frontend
    res.status(200).json({ token, user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// === 3. GET USER PROFILE (AMBIL DATA USER) ===
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) return res.status(404).json({ message: "User ga ketemu bro" });

    // Jangan kirim passwordnya balik, bahaya.
    const { password, ...userData } = user._doc;
    
    res.status(200).json(userData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// === 4. UPDATE USER (GANTI NAMA) ===
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body; 

    // Update nama, balikin data yang baru
    const user = await User.findByIdAndUpdate(id, { name }, { new: true });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === 5. RESET DATA (HAPUS TRANSAKSI & GOALS) ===
export const resetUserData = async (req, res) => {
  try {
    const { id } = req.params;

    // Hapus semua transaksi milik user ini
    await Transaction.deleteMany({ userId: id });
    
    // Hapus semua goals milik user ini
    await Goal.deleteMany({ userId: id });

    // Reset status AI User jadi nol
    await User.findByIdAndUpdate(id, { 
        clusterLabel: "New Member 🌱", 
        ratio: 0 
    });

    res.status(200).json({ message: "Data berhasil di-reset bersih! ✨" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};