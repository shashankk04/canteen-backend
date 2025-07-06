import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware(), (req, res) => {
  res.json({ message: `Hello, ${req.user.role} with ID ${req.user.userId}` });
});

export default router;
