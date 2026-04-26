import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createProduct, getAllProducts, getProductsByRestaurant, updateProduct, deleteProduct, getMyProducts } 
from "../controllers/product.controller";
import multer from "multer";


const router = Router();
const upload = multer();

// vendor creates a product
router.post(
    "/", 
    authMiddleware,
    roleMiddleware(["vendor"]),
    upload.single("image"), // for image upload
    createProduct
);

// get all products
router.get("/", getAllProducts);

 router.get(
    "/my-products",
    authMiddleware,
    roleMiddleware(["vendor"]),
    getMyProducts
 )

// get all products by Restaurant
router.get("/:restaurantId", getProductsByRestaurant);

// update product 
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["vendor"]),
    upload.single("image"), // for image upload
    updateProduct
);

router.delete("/:id", authMiddleware, deleteProduct);

export default router