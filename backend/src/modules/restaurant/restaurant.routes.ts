import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { createRestaurantSchema } from "./restaurant.validation";
import { validate } from "../../middlewares/validate.middleware";
import { createRestaurant, deleteRestaurant, getAllRestaurants, getVendorRestaurants, updateRestaurant } from "./restaurant.controller";

const router = Router();

router.get("/", getAllRestaurants);

router.post(
    "/create",
    authMiddleware,
    roleMiddleware(["vendor"]),
    validate(createRestaurantSchema),
    createRestaurant
);

router.get(
    "/my-restaurants",
    authMiddleware,
    roleMiddleware(["vendor"]),
    getVendorRestaurants
)

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["vendor"]),
    updateRestaurant
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["vendor"]),
    deleteRestaurant
)


export default router;