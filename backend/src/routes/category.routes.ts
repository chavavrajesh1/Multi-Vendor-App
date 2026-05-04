import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createCategory, getCategories } from "../controllers/category.controller";
import { upload } from "../config/cloudinary"; // ఇమేజ్ అప్‌లోడ్ కోసం

const router = Router();

/**
 * @POST /api/categories
 * కేవలం ADMIN మాత్రమే కేటగిరీలను క్రియేట్ చేయాలి.
 * 'image' అనేది ఫ్రంటెండ్ నుండి వచ్చే ఫైల్ ఫీల్డ్ పేరు.
 */
router.post(
    "/", 
    authMiddleware,
    roleMiddleware(["admin"]), // ఇక్కడ 'vendor' ని తొలగించడం సురక్షితం
    upload.single("image"),    // ఇమేజ్ హ్యాండ్లింగ్ కోసం మిడిల్‌వేర్
    createCategory
);

/**
 * @GET /api/categories
 * అందరూ (Customers, Vendors, Guests) కేటగిరీలను చూడవచ్చు.
 */
router.get("/", getCategories);

export default router;