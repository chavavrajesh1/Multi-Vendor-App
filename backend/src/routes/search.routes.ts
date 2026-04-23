import { Router } from "express";
import { globalSearchController, searchMenuController, searchRestaurantsController } from "./search.controller";

const router = Router();

router.get("/", globalSearchController);
router.get("/restaurants", searchRestaurantsController);
router.get("/menu", searchMenuController);

export default router;