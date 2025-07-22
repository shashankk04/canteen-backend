import express from "express";
import { getTransactionSummary, getAllTransactions, getMyTransactions } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can view this
router.get("/summary", authMiddleware("admin"), getTransactionSummary);
router.get("/", authMiddleware("admin"), getAllTransactions);
router.get("/me", authMiddleware("employee"), getMyTransactions);

export default router;
