import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { createProduct, getMyProducts, updateProduct } from "../product/product.controller";
import { upload } from "../../middlewares/multer.middleware";


const router = Router();

// GET VENDOR PRODUCTS
router.get(
    "/products",
    authMiddleware,
    roleMiddleware(["vendor"]),
    getMyProducts
);

// CREATE PRODUCT
router.post(
    "/products",
    authMiddleware,
    roleMiddleware(["vendor"]),
    upload.single("image"),
    createProduct
);

// UPDATE PRODUCT
router.put(
    "/products/:id",
    authMiddleware,
    roleMiddleware(["vendor"]),
    upload.single("image"),
    updateProduct
);