import express from "express";
import { login, register, getUserProfile, updateUser, resetUserData } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", getUserProfile);

// 👇 TAMBAHIN 2 BARIS INI DER
router.put("/profile/:id", updateUser);      // Buat Edit Nama
router.delete("/reset/:id", resetUserData);  // Buat Reset Data

export default router;