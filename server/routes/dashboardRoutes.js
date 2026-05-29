import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

// simple path

router.get("/", getDashboardData);

export default router;