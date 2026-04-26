import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createPaymentOrder, paymentWebhookHandler, verifyPayment } from "../controllers/payment.controller";

const router = Router();

/* =====================================================
   RAZORPAY WEBHOOK
   (NO AUTH REQUIRED)
===================================================== */

router.post(
  "/webhook",
  paymentWebhookHandler
);

/* =====================================================
   CREATE RAZORPAY ORDER
===================================================== */

router.post(
  "/create-order",
  authMiddleware,
  createPaymentOrder
);

/* =====================================================
   VERIFY PAYMENT
===================================================== */

router.post(
  "/verify",
  authMiddleware,
  verifyPayment
);

export default router;