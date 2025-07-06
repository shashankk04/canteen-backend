import express from "express";
import {
  addItemToMasterList,
  getMasterItemList,
  setItemOfTheDay,
  getItemsOfTheDay,
  updateMasterItem,
  deleteMasterItem,
} from "../controllers/itemController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Master list routes
router.post("/master", authMiddleware("admin"), addItemToMasterList);
router.get("/master", authMiddleware("admin"), getMasterItemList);
router.patch("/master/:itemId", authMiddleware("admin"), updateMasterItem);
router.delete("/master/:itemId", authMiddleware("admin"), deleteMasterItem);

// Items of the Day routes
router.post("/today", authMiddleware("admin"), setItemOfTheDay);
router.get("/today", getItemsOfTheDay); // accessible by both roles

export default router;
