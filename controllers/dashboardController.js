import User from "../models/User.js";
import Item from "../models/Item.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const getAdminDashboardMetrics = async (req, res) => {
  try {
    const [employeeCount, totalItems, todayItems] = await Promise.all([
      User.countDocuments({ role: "employee" }),
      Item.countDocuments({ inMasterList: true }),
      Item.countDocuments({ isTodayAvailable: true }),
    ]);

    const creditSummary = await Transaction.aggregate([
      { $match: { type: "credit" } },
      {
        $group: {
          _id: null,
          totalCredited: { $sum: "$amount" },
          creditCount: { $sum: 1 },
        },
      },
    ]);

    const debitSummary = await Transaction.aggregate([
      { $match: { type: "debit" } },
      {
        $group: {
          _id: null,
          totalDebited: { $sum: "$amount" },
          debitCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      employeeCount,
      totalItems,
      todayItems,
      totalCredited: creditSummary[0]?.totalCredited || 0,
      totalDebited: debitSummary[0]?.totalDebited || 0,
      creditTransactions: creditSummary[0]?.creditCount || 0,
      debitTransactions: debitSummary[0]?.debitCount || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('DEBUG: userId from JWT:', userId, 'type:', typeof userId);
    // Try to find the user
    const user = await User.findById(userId);
    console.log('DEBUG: User found:', user);
    if (!user || user.role !== 'employee') {
      console.log('DEBUG: Employee not found or role mismatch');
      return res.status(404).json({ message: 'Employee not found' });
    }
    // Get all debit transactions for this user
    const debitTxs = await Transaction.find({ employee: userId, type: 'debit' });
    const totalSpent = debitTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const purchases = debitTxs.length;
    res.status(200).json({
      balance: user.balance || 0,
      totalSpent,
      purchases,
    });
  } catch (error) {
    console.error('DEBUG: Error in getEmployeeDashboardMetrics:', error);
    res.status(500).json({ message: error.message });
  }
};
