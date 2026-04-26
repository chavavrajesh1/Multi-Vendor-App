import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { CheckOutService } from "../services/checkout.service";

const checkoutService = new CheckOutService();

export const checkoutController = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Token User:", req.user);

    const { paymentMethod } = req.body; // ✅ GET FROM FRONTEND

    const result = await checkoutService.checkout(
      new Types.ObjectId(req.user.userId),
      paymentMethod // ✅ PASS TO SERVICE
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};