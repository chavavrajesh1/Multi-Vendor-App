import { Router } from "express";
import { assignDeliveryController, updateDeliveryStatusController } from "../controllers/delivery.controller";

const router = Router();

router.post("/assign", assignDeliveryController);
router.put("/:deliveryId/status", updateDeliveryStatusController);

export default router;