import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getOrderStatusController, updateOrderStatusController } from "./orderTracking.controller";
import { roleMiddleware } from "../../middlewares/role.middleware";


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