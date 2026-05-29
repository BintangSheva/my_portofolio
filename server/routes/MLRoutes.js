import express from "express" ;
import { analyzeFinancialProfile } from "../controllers/MLController.js";

const router = express.Router();
router.post("/analyze", analyzeFinancialProfile);

export default router;