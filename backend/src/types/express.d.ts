import { Request } from "express";
import { UserRole } from "../modules/user/user.model";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: UserRole;
    };
}