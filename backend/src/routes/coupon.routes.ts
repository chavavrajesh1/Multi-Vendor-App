import { Router } from "express";
import { applyCoupon, createCoupon, deleteCoupon, getCoupons } from "./coupon.controller";

const router = Router();

router.post("/", createCoupon);
router.get("/", getCoupons);
router.post("/apply", applyCoupon);
router.delete("/:id", deleteCoupon);

export default router;
