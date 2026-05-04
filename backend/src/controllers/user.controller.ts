import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { AuthRequest } from "../types/express";

// 1. ప్రొఫైల్ వివరాలు (Name, Email, Phone) అప్‌డేట్ చేయడానికి
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, email, phoneNumber } = req.body;
        const currentUserId = req.user?.userId; // ఇక్కడ userId వాడుతున్నాం

        const updatedData: any = { name, email, phoneNumber };

        const user = await User.findByIdAndUpdate(
            currentUserId,
            { $set: updatedData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. కొత్త అడ్రస్‌ని యాడ్ చేయడానికి
export const addAddress = async (req: AuthRequest, res: Response) => {
    try {
        const { addressLine, city, state, pincode, addressType } = req.body;
        const currentUserId = req.user?.userId;

        const user = await User.findById(currentUserId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const newAddress = { addressLine, city, state, pincode, addressType };
        
        user.addresses.push(newAddress as any);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Address added successfully",
            addresses: user.addresses
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. ఉన్న అడ్రస్‌ని డిలీట్ చేయడానికి
export const deleteAddress = async (req: AuthRequest, res: Response) => {
    try {
        const { addressId } = req.params;
        const currentUserId = req.user?.userId;

        const user = await User.findByIdAndUpdate(
            currentUserId,
            { $pull: { addresses: { _id: addressId } } }, // అడ్రస్ లోపల ఉండే ఐడి ఎప్పుడూ _id గానే ఉంటుంది
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            addresses: user?.addresses
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. పాస్‌వర్డ్ మార్చడానికి
export const updatePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const currentUserId = req.user?.userId;

        const user = await User.findById(currentUserId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// 5. లాగిన్ అయిన యూజర్ వివరాలు పొందడం
export const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.userId;
        const user = await User.findById(currentUserId).select("-password");
        
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};