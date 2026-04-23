import { Router } from "express";
import { register, login } from "./auth.controller";
import { authLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);


export default router;