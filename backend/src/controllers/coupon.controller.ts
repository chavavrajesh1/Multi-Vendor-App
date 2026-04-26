import { Request, Response, NextFunction } from "express";
import { CouponService } from "../services/coupon.service";

const couponService = new CouponService();

export const createCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        
        const coupon = await couponService.createCoupon(req.body);

        res.status(201).json({
            success: true,
            data: coupon
        });

    } catch (error) {
        next(error);
    }
};

export const getCoupons = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        
        const coupons = await couponService.getAllCoupons();

        res.status(200).json({
            success: true,
            data: coupons
        });

    } catch (error) {
        next(error);
    }
};

export const applyCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        
        const { code, cartTotal } = req.body

        const result = await couponService.validateCoupon(code, cartTotal);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const deleteCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        await couponService.deleteCoupon(req.params.id as string);

        res.status(200).json({
            success: true,
            message: "Coupon deleted"
        });

    } catch (error) {
        next(error);
    }
}
