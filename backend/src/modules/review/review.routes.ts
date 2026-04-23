import { Router } from "express";
import { addReview, getMenuReviews, getRestaurantRating, getRestaurantReviews } from "./review.controller";


const router = Router();

router.post("/", addReview);
router.get("/restaurant/:restaurantId", getRestaurantReviews);
router.get("/menu/:menuId", getMenuReviews);
router.get("/rating/:restaurantId", getRestaurantRating);

export default router;