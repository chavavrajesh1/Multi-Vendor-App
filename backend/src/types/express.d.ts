import { Request } from "express";
import { UserRole } from "../models/user.model";

export interface AuthRequest extends Request {
    user?: {
        // _id: string;
        userId: string;
        role: UserRole;
    };
}