import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { getOrderStatusController, updateOrderStatusController } from "../controllers/orderTracking.controller";

const router = Router();

// Customer Tracking Order
router.get(
    "/:orderId",
    authMiddleware,
    getOrderStatusController
);

// Vendor Update Order Status
router.patch(
    "/:orderId",
    authMiddleware,
    roleMiddleware(["vendor"]),
    updateOrderStatusController
);

export default router;