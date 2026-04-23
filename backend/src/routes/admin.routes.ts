import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { approveVendor, getAllVendors } from "../../controllers/admin.controller";

const router = Router();

router.patch(
    "/approve-vendor/:vendorId",
    authMiddleware,
    roleMiddleware(["admin"]),
    approveVendor
);

router.get(
    "/vendors",
    authMiddleware,
    roleMiddleware(["admin"]),
    getAllVendors
);

export default router;
