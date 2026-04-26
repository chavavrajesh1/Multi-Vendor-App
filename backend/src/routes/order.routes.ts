import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createOrderSchema } from "../validations/order.validation";

import {
  createOrder,
  getCustomerOrders,
  getOrderByIdController,
  updateOrderStatus
} from "../controllers/order.controller";

import { orderLimiter } from "../middlewares/rateLimiter.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

/* =====================================================
    CUSTOMER ROUTES
===================================================== */
router.post("/", authMiddleware, orderLimiter, roleMiddleware(["customer"]), validate(createOrderSchema), createOrder);
router.get("/customer", authMiddleware, roleMiddleware(["customer"]), getCustomerOrders);

/* =====================================================
    GENERAL / DELIVERY ROUTES (మార్పులు ఇక్కడ ఉన్నాయి)
===================================================== */

/** * 1. UPDATE ORDER STATUS: 
 * ఇక్కడ నుండి authMiddleware మరియు roleMiddleware ని తీసేశాను. 
 * దీనివల్ల డెలివరీ బాయ్ లాగిన్ లేకుండా స్టేటస్ మార్చగలడు.
 */
router.patch("/:id/status", updateOrderStatus);

/** * 2. GET ORDER BY ID: 
 * ఇక్కడ కూడా authMiddleware తీసేశాను. 
 * ఇది అందరికంటే చివరన ఉండాలి.
 */
router.get("/:orderId", getOrderByIdController);

export default router;