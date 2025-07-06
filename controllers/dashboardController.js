import User from "../models/User.js";
import Item from "../models/Item.js";
import Transaction from "../models/Transaction.js";

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
