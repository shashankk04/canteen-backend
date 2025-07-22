import Transaction from "../models/Transaction.js";

export const getTransactionSummary = async (req, res) => {
  try {
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
      totalCredited: creditSummary[0]?.totalCredited || 0,
      creditTransactions: creditSummary[0]?.creditCount || 0,
      totalDebited: debitSummary[0]?.totalDebited || 0,
      debitTransactions: debitSummary[0]?.debitCount || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('employee', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.find({ employee: userId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
