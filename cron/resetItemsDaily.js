import cron from "node-cron";
import Item from "../models/Item.js";

export const scheduleItemReset = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      await Item.updateMany(
        { isTodayAvailable: true },
        { $set: { isTodayAvailable: false, quantity: 0 } }
      );
      console.log("✅ Items of the Day reset automatically at midnight");
    } catch (err) {
      console.error("❌ Error resetting items of the day:", err.message);
    }
  });
};
