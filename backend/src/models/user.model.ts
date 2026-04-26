import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "customer" | "vendor" | "admin";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["customer", "vendor", "admin"],
            default: "customer",
        },
        isApproved: {
            type: Boolean,
            default: false, // Vendor needs admin approval 
        },
    },
    { timestamps: true }
);
""
export const User = mongoose.model<IUser>("User", userSchema);