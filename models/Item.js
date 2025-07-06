import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    inMasterList: { type: Boolean, default: true },
    isTodayAvailable: { type: Boolean, default: false },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;
