import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { scheduleItemReset } from "./cron/resetItemsDaily.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());



// Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);




app.get("/", (req, res) => res.send("API is running"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));


  scheduleItemReset();