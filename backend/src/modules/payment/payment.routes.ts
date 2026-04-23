import { Router } from "express";
import {
  paymentWebhookHandler,
  verifyPayment,
  createPaymentOrder
} from "./payment.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

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