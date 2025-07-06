import User from "../models/User.js";
import Item from "../models/Item.js";
import Transaction from "../models/Transaction.js";

export const purchaseItemByAdmin = async(req,res)=>{
    try {
        const {employeeId, itemId, quantity} = req.body;
        if(!employeeId || !itemId || !quantity || quantity <= 0){
            return res.status(400).json({ message: "Missing required fields or invalid quantity" });
        }
        const employee = await User.findById(employeeId, { role: "employee" });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const item = await Item.findById(itemId);
        if (!item || item.quantity < quantity) {
          return res
            .status(400)
            .json({ message: "Item unavailable or insufficient quantity" });
        }
        const totalCost = item.price * quantity;
        if (employee.balance < totalCost) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        employee.balance -= totalCost;
        item.quantity -= quantity;

        await employee.save();
        await item.save();
        await Transaction.create({
          employee: employee._id,
          type: "debit",
          amount: totalCost,
          source: "admin",
          description: `Purchased ${item.name} x${quantity}`,
        });
        res.status(200).json({
          message: `Purchase successful: ${item.name} x${quantity}`,
          remainingBalance: employee.balance,
          remainingItemQty: item.quantity,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}

export const purchaseItemByEmployee = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user.userId;

    if (!itemId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid item or quantity" });
    }

    const employee = await User.findById(userId);
    if (!employee || employee.role !== "employee") {
      return res.status(403).json({ message: "Access denied" });
    }

    const item = await Item.findById(itemId);
    if (!item || !item.isTodayAvailable || item.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Item not available or insufficient quantity" });
    }

    const totalCost = item.price * quantity;

    if (employee.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Proceed with deduction
    employee.balance -= totalCost;
    item.quantity -= quantity;

    await employee.save();
    await item.save();

    await Transaction.create({
      employee: employee._id,
      type: "debit",
      amount: totalCost,
      source: "employee",
      description: `Purchased ${item.name} x${quantity}`,
    });

    res.status(200).json({
      message: `Purchase successful: ${item.name} x${quantity}`,
      balance: employee.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
