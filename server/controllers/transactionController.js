import Transaction from "../models/Transaction.js";
import User from "../models/User.js"; 
import mongoose from "mongoose";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// --- KONFIGURASI PATH ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 1. AMBIL DATA (GET)
// ==========================================
export const getTransaction = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(200).json([]); 
    }

    const transactions = await Transaction.find({ userId: userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ==========================================
// 2. TAMBAH DATA (POST)
// ==========================================
export const createTransaction = async (req, res) => {
  const transaction = req.body;
  const newTransaction = new Transaction(transaction);

  try {
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// 3. HAPUS DATA (DELETE)
// ==========================================
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) 
    return res.status(404).send(`No transaction with id: ${id}`);

  await Transaction.findByIdAndDelete(id);

  res.json({ message: "Transaction deleted successfully" });
};

// ==========================================
// 4. UPDATE DATA (EDIT)
// ==========================================
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(404).send(`No transaction with id: ${id}`);

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id, 
      req.body,
      { new: true } 
    ); 
    
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// 5. ANALISA AI (PYTHON K-MEANS) - DENGAN FILTER BULAN 📅
// ==========================================