import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { addToCart, getCart, updateQuantityController, clearCart, removeFromCart } from "../controllers/cart.controller";


const router = Router();

router.post("/", authMiddleware, roleMiddleware(["customer"]), addToCart);
router.get("/", authMiddleware, roleMiddleware(["customer"]), getCart);
router.put("/:menuItemId", authMiddleware, roleMiddleware(["customer"]), updateQuantityController )
router.delete("/:menuItemId", authMiddleware, roleMiddleware(["customer"]), removeFromCart);
router.delete("/", authMiddleware, roleMiddleware(["customer"]), clearCart);

export default router;