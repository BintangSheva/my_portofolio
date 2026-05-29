import express from "express";
import { getTransaction, createTransaction, deleteTransaction, updateTransaction } from "../controllers/transactionController.js";

// Tarik fungsi K_Means yang baru dari MLController
import { analyzeFinancialProfile } from "../controllers/MLController.js";

const router = express.Router();

router.get("/", getTransaction);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransaction);

// Ganti fungsi lamanya pakai fungsi K-Means yang asli
router.get("/analyze/:userId", analyzeFinancialProfile);

export default router;