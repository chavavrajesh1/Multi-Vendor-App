import express from "express";
import { 
    updateProfile, 
    addAddress, 
    deleteAddress, 
    updatePassword, 
    getMyProfile 
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

// ప్రొఫైల్ వివరాల కోసం
router.get("/me", authMiddleware, getMyProfile);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/update-password", authMiddleware, updatePassword);

// అడ్రస్ మేనేజ్‌మెంట్ కోసం
router.post("/add-address", authMiddleware, addAddress);
router.delete("/delete-address/:addressId", authMiddleware, deleteAddress);

export default router;