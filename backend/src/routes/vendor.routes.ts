import { Router } from "express";
import { 
  addRestaurant, 
  getVendorOrders, 
  getVendorDashboardStats, 
  getVendorProducts, 
  getMyRestaurants 
} from "../controllers/vendor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { updateOrderStatus } from "../controllers/order.controller";

const router = Router();

/**
 * వెండర్ కి సంబంధించిన అన్ని రూట్స్ కి 
 * Authentication మరియు Role Check అవసరం.
 * అందుకే ఒకేసారి 'vendorAuth' మిడిల్‌వేర్ వాడుతున్నాం.
 */
const vendorAuth = [authMiddleware, roleMiddleware(["vendor"])];

/* =====================================================
    VENDOR BUSINESS & DASHBOARD ROUTES
===================================================== */

// 1. Dashboard Stats (Revenue, Order counts, etc.)
router.get("/dashboard-stats", vendorAuth, getVendorDashboardStats);

// 2. Vendor Orders List
router.get("/orders", vendorAuth, getVendorOrders);

// 3. Vendor Products List (దీని వల్లే మీకు 404 ఎర్రర్ వచ్చింది)
router.get("/products", vendorAuth, getVendorProducts);

// 4. Get Vendor's Registered Shops/Restaurants
router.get("/my-restaurants", vendorAuth, getMyRestaurants);

// 5. Add or Update Restaurant Profile
router.post("/add-restaurant", vendorAuth, addRestaurant);

// 6. Shop Settings (Add Restaurant కి ఇది Alias లాగా పనిచేస్తుంది)
router.post("/shop-settings", vendorAuth, addRestaurant);

/* =====================================================
    ORDER MANAGEMENT ROUTES
===================================================== */

// 7. Update Status of an Order (Pending to Confirmed, etc.)
router.patch("/orders/:id/status", vendorAuth, updateOrderStatus);

export default router;
