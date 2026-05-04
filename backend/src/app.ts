import express, { Application } from "express";
import cors from "cors";
import path from "node:path";

/* =========================================
   IMPORT ROUTES
========================================= */
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import restaurantRoutes from "./routes/restaurant.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import vendorProductRoutes from "./routes/vendor.routes";
import paymentRoutes from "./routes/payment.routes";
import checkoutRoutes from "./routes/checkout.routes";
import orderTrackingRoutes from "./routes/orderTracking.routes";
import couponRoutes from "./routes/coupon.routes";
import reviewRoutes from "./routes/review.routes";
import notificationRoutes from "./routes/notification.routes";
import deliveryRoutes from "./routes/delivery.routes";
import searchRoutes from "./routes/search.routes";
import categoryRoutes from "./routes/category.routes";
import menuRoutes from "./routes/menu.routes";
import cartRoutes from "./routes/cart.routes";

// కొత్తగా యాడ్ చేసిన యూజర్ రూట్స్
import userRoutes from "./routes/user.routes"; 

import { paymentWebhookHandler } from "./controllers/payment.controller";
import { errorHandler } from "./middlewares/error.middleware";

const app: Application = express();

/* =========================================
   CORS CONFIGURATION
========================================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* =========================================
   WEBHOOK ROUTE (Raw body must come BEFORE express.json)
========================================= */
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhookHandler
);

/* =========================================
   JSON & URLENCODED MIDDLEWARE
========================================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================
   STATIC FILES
========================================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================================
   API ROUTES
========================================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // <-- యూజర్ ప్రొఫైల్ & అడ్రస్ రూట్స్ ఇక్కడ ఉన్నాయి
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