import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/notification.controller";
const router = Router();

router.get("/", authMiddleware, getMyNotifications);
router.put("/:id/read", authMiddleware, markNotificationRead);
router.put("/read-all", authMiddleware, markAllNotificationsRead);

export default router;