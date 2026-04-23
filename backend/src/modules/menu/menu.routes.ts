import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { createMenu, deleteMenu, getRestaurantMenu, updateMenu } from "./menu.controller";

const router = Router();

router.post("/", authMiddleware, roleMiddleware(["vendor"]), createMenu);

router.put("/:id", authMiddleware, roleMiddleware(["vendor"]), updateMenu);

router.delete("/:id", authMiddleware, roleMiddleware(["vendor"]), deleteMenu);

router.get("/:restaurantId", getRestaurantMenu);

export default router;