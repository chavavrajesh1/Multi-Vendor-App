import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";
import { registerSchema, loginSchema } from "./auth.validation";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email: validatedData.email });
        if(existingUser){
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const user = await User.create({
            ...validatedData,
            password: hashedPassword,
            isApproved: validatedData.role === "vendor" ? false : true,
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await User.findOne({ email: validatedData.email });
        if(!user){
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(validatedData.password, user.password);
        if(!isMatch){
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }

        if(user.role === "vendor" && !user.isApproved){
            res.status(403).json({ message: "Vendor not approved by admin "});
            return;
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        // ✅ FIXED RESPONSE
        res.status(200).json({
            success: true,
            data: {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });

    } catch (error: any) {
        res.status(400).json({ message: error.message });   
    }
};