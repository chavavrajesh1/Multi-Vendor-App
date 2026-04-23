import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { success } from "zod";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    // Handle AppError (our custom errors)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Handle Mongoose Bad ObjectId
    else if (err instanceof Error && err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    // Handle Duplicate key (Mongo Unique)
    else if (err instanceof Error && "code" in err && (err as any).code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }

    // unknown errors (programmer bugs)
    else if (err instanceof Error) {
        message = err.message;
    }

    // Log full error for debugging
    console.error("Error:", err);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== "production" && err instanceof Error && { stack: err.stack }),
    })

};