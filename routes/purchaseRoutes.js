import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { purchaseItemByAdmin, purchaseItemByEmployee } from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/", authMiddleware("admin"), purchaseItemByAdmin);
router.post("/employee", authMiddleware("employee"), purchaseItemByEmployee);

export default router;
