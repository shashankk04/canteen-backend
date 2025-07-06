import express from "express";
import {
  addEmployee,
  creditEmployeeBalance,
  getAllEmployees,
  getEmployeeTransactions,
} from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can add or view employees
router.post("/", authMiddleware("admin"), addEmployee);
router.get("/", authMiddleware("admin"), getAllEmployees);
router.post("/credit", authMiddleware("admin"), creditEmployeeBalance);
router.get(
  "/:id/transactions",
  authMiddleware("admin"),
  getEmployeeTransactions
);

export default router;
