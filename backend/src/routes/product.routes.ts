import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { createProduct,deleteProduct,getAllProducts,getMyProducts,getProductsByRestaurant, updateProduct } from "../../controllers/product.controller";
import { upload } from "../../middlewares/multer.middleware";

const router = Router();

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

export default router;