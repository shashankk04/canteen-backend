import express from "express";
import {
  addEmployee,
  creditEmployeeBalance,
  getAllEmployees,
  getEmployeeTransactions,
  selfCredit,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can add or view employees
router.post("/", authMiddleware("admin"), addEmployee);
router.get("/", authMiddleware("admin"), getAllEmployees);
router.post("/credit", authMiddleware("admin"), creditEmployeeBalance);
router.post("/self-credit", authMiddleware("employee"), selfCredit);
router.get(
  "/:id/transactions",
  authMiddleware("admin"),
  getEmployeeTransactions
);
router.get("/profile", authMiddleware("employee"), getMyProfile);
router.put("/profile", authMiddleware("employee"), updateMyProfile);
router.put("/profile/password", authMiddleware("employee"), changeMyPassword);

export default router;
