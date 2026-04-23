import { Request } from "express";
import { UserRole } from "../models/user.model";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: UserRole;
    };
}