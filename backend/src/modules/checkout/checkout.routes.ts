import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { checkoutController } from "./checkout.controller";


const router = Router();

router.post("/",authMiddleware, roleMiddleware(["customer"]), checkoutController);

export default router;