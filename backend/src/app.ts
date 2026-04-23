import express, { Application } from "express";
import cors from "cors";
import path from "node:path";

import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import restaurantRoutes from "./modules/restaurant/restaurant.routes";
import orderRoutes from "./modules/order/order.routes";
import productRoutes from "./modules/product/product.routes";
import vendorProductRoutes from "./modules/vendor/vendor.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import { paymentWebhookHandler } from "./modules/payment/payment.controller";
import { errorHandler } from "./middlewares/error.middleware";
import checkoutRoutes from "./modules/checkout/checkout.routes";
import orderTrackingRoutes from "./modules/orderTracking/orderTracking.routes";
import couponRoutes from "./modules/coupon/coupon.routes";
import reviewRoutes from "./modules/review/review.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import deliveryRoutes from "./modules/delivery/delivery.routes";
import searchRoutes from "./modules/search/search.routes";
import categoryRoutes from "./modules/category/category.routes";
import menuRoutes from "./modules/menu/menu.routes";
import cartRoutes from "./modules/cart/cart.routes";

const app: Application = express();

/* =========================================
   CORS
========================================= */
app.use(
  cors({
    origin: ["http://localhost:5173",
    "http://10.136.167.136:5173"],
    credentials: true,
  })
);
// app.use(cors({ origin: "*", credentials: true }));

/* =========================================
   WEBHOOK ROUTE
   raw body must come BEFORE express.json()
========================================= */
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhookHandler
);

/* =========================================
   JSON MIDDLEWARE
========================================= */
app.use(express.json());

/* =========================================
   STATIC FILES
   very important for product images
========================================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================================
   API ROUTES
========================================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vendor", vendorProductRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/order-tracking", orderTrackingRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/cart", cartRoutes);

/* =========================================
   HEALTH CHECK ROUTE
   optional but useful for testing
========================================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running...",
  });
});

/* =========================================
   ERROR HANDLER
========================================= */
app.use(errorHandler);

export default app;