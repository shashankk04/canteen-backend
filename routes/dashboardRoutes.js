import express from "express";
import { getAdminDashboardMetrics, getEmployeeDashboardMetrics } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/metrics", authMiddleware("admin"), getAdminDashboardMetrics);
router.get("/employee-metrics", authMiddleware("employee"), getEmployeeDashboardMetrics);

export default router;