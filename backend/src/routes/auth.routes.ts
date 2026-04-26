import { Router } from "express";
import { authLimiter } from "../middlewares/rateLimiter.middleware";
import { login, register } from "../controllers/auth.controller";
const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);


export default router;