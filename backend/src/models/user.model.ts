import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "customer" | "vendor" | "admin";

// అడ్రస్ కోసం ప్రత్యేక Interface
interface IAddress {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    addressType: "Home" | "Work" | "Other";
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string; // ఫోన్ నంబర్
    addresses: IAddress[]; // అడ్రస్ ల లిస్ట్
    role: UserRole;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        phoneNumber: { type: String, trim: true },
        addresses: [
            {
                addressLine: String,
                city: String,
                state: String,
                pincode: String,
                addressType: {
                    type: String,
                    enum: ["Home", "Work", "Other"],
                    default: "Home"
                }
            }
        ],
        role: {
            type: String,
            enum: ["customer", "vendor", "admin"],
            default: "customer",
        },
        isApproved: {
            type: Boolean,
            default: false, 
        },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);