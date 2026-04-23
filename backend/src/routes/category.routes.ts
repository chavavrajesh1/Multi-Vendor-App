import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createCategory, getCategories } from "./category.controller";

const router = Router();

router.post(
    "/", 
    authMiddleware,
    roleMiddleware(["admin","vendor"]),
    createCategory
);

router.get("/", getCategories);

export default router;