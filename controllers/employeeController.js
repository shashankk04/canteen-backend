import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Transaction from "../models/Transaction.js";

export const addEmployee=async(req,res)=>{
    try {
        const {name, email, password, employeeId}= req.body;
        if (!name || !email || !password || !employeeId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const exists = await User.findOne({
            $or:[{email},{employeeId}]
        });
        if(exists){
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = await User.create({
          name,
          email,
          password: hashedPassword,
          role: "employee",
          employeeId,
          balance: 0,
        });
        res.status(201).json({
          message: "Employee added successfully",
          employee: {
            id: newEmployee._id,
            name: newEmployee.name,
            email: newEmployee.email,
            employeeId: newEmployee.employeeId,
            balance: newEmployee.balance,
          },
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getAllEmployees = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      role: "employee",
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { employeeId: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const employees = await User.find(query).select("-password");

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const creditEmployeeBalance = async(req,res)=>{
  try {
    const { employeeId, amount } = req.body;

    if (!employeeId || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid employeeId or amount" });
    }

    const employee = await User.findOne({ employeeId, role: "employee" });
    if(!employee){
      return res.status(404).json({ message: "Employee not found" });
    }
    employee.balance = (employee.balance || 0) + amount;

    await employee.save();
    await Transaction.create({
      employee: employee._id,
      type: "credit",
      amount,
      source: "admin",
      description: `Credited ₹${amount} by Admin`,
    });

    res.status(200).json({
      message: `₹${amount} credited to ${employee.name}'s account.`,
      balance: employee.balance,
    });


  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
}

export const getEmployeeTransactions = async(req,res)=>{
  try {
    const employeeId = req.params.id;
    const employee = await User.findById(employeeId);
    if(!employee || employee.role !== "employee") {
      return res.status(404).json({ message: "Employee not found" });
    }
    const transactions = await Transaction.find({
      employee: employee._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
}
