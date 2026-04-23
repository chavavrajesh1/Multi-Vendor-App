import { Router } from "express";
import { 
  getVendorDashboardStats, 
  getVendorOrders, 
  getVendorRevenueAnalytics,
  addRestaurant,
  getMyRestaurants
} from "./vendor.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { updateOrderStatus } from "../order/order.controller";

const router = Router();

// 1. Add Restaurant
router.post("/add-restaurant", authMiddleware, roleMiddleware(["vendor"]), addRestaurant);

// 2. Vendor Orders - Dashboard లో వస్తున్న డేటానే ఇక్కడ కూడా వస్తుంది
router.get(
  "/orders", 
  authMiddleware, 
  roleMiddleware(["vendor"]), 
  getVendorOrders
);

// 3. Dashboard Stats
router.get("/dashboard-stats", authMiddleware, roleMiddleware(["vendor"]), getVendorDashboardStats);

// 4. Update Status
router.patch("/orders/:id/status", authMiddleware, roleMiddleware(["vendor"]), updateOrderStatus);

// 5. Analytics & Restaurants
router.get("/revenue-analytics", authMiddleware, roleMiddleware(["vendor"]), getVendorRevenueAnalytics);
router.get("/my-restaurants", authMiddleware, roleMiddleware(["vendor"]), getMyRestaurants);

export default router;