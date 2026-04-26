import { Types } from "mongoose";
import  Coupon  from "../models/coupon.model";

export class CouponService {

    async createCoupon(data: any){
        const coupon = await Coupon.create(data);
        return coupon;
    }

    async getAllCoupons(){
        return Coupon.find();
    }

    async validateCoupon(code: string, cartTotal: number) {
        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if(!coupon) {
            throw new Error("Invalid Coupon");
        }

        if (coupon.expirtyDate < new Date()) {
            throw new Error("Coupon Expired");
        }

        if (cartTotal < coupon.minOrderAmount) {
            throw new Error(`Minimum order Amount is ${coupon.minOrderAmount}`);
        }

        let discount = 0;

        if (coupon.discountType === "percentage") {
            discount = (cartTotal * coupon.discountValue) / 100;

            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        const finalAmount = cartTotal - discount;

        return {
            couponCode: coupon.code,
            discount,
            finalAmount
        };
    }

    async deleteCoupon(couponId: string) {
        return Coupon.findByIdAndDelete(couponId);
    }
}