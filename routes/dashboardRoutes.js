import express from "express";
import { getAdminDashboardMetrics } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/metrics", authMiddleware("admin"), getAdminDashboardMetrics);

export default router;
