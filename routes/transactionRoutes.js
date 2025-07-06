import express from "express";
import { getTransactionSummary } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can view this
router.get("/summary", authMiddleware("admin"), getTransactionSummary);

export default router;
