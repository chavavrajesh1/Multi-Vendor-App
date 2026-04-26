import { Router } from "express";
import { createCoupon, getCoupons, applyCoupon, deleteCoupon } from "../controllers/coupon.controller";

const router = Router();

router.post("/", createCoupon);
router.get("/", getCoupons);
router.post("/apply", applyCoupon);
router.delete("/:id", deleteCoupon);

export default router;
