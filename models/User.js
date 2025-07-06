import mongoose from "mongoose";
import { type } from "os";

const userSchema =new mongoose.Schema({
    name :{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee",
    },
    employeeId:{
        type: String,
        unique: true,
        sparse: true, // Allows for unique constraint to be applied only when the field is present
    },
    balance:{
        type: Number,
        default: 0,
    }
},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;