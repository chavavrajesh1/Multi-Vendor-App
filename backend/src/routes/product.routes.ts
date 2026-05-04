import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { 
  createProduct, 
  getAllProducts, 
  getProductsByRestaurant, 
  updateProduct, 
  deleteProduct, 
  getMyProducts, 
  getProductById 
} from "../controllers/product.controller";

// ⚠️ పాత 'multer' ఇంపోర్ట్ తీసేసి, మీరు కాన్ఫిగర్ చేసిన ఫైల్ నుండి 'upload' ని ఇంపోర్ట్ చేయండి
// మీ ముల్టర్ ఫైల్ ఎక్కడ ఉందో ఆ పాత్ ఇవ్వండి (ఉదాహరణకు: ../middlewares/multer లేదా ../config/multer)
import { upload } from "../middlewares/multer.middleware"; // మీ ముల్టర్ కాన్ఫిగరేషన్ ఫైల్ నుండి ఇంపోర్ట్ చేయ

const router = Router();

// ✅ గమనిక: 'const upload = multer();' అనే లైన్ ఇక్కడ ఉండకూడదు. 

// 1. Create Product
router.post(
    "/", 
    authMiddleware,
    roleMiddleware(["vendor"]),
    upload.single("image"), // ఇప్పుడు ఇది మనం కాన్ఫిగర్ చేసిన DiskStorage ని వాడుతుంది
    createProduct
);

// 2. Get all products
router.get("/", getAllProducts);

// 3. Get Vendor's own products
router.get(
    "/my-products",
    authMiddleware,
    roleMiddleware(["vendor"]),
    getMyProducts
);

// 4. Get Single Product
router.get("/single/:id", getProductById);

// 5. Update Product
router.put(
    "/single/:id",
    authMiddleware,
    roleMiddleware(["vendor"]),
    upload.single("image"),
    updateProduct
);

// 6. Delete Product
router.delete("/single/:id", authMiddleware, deleteProduct);

// 7. Get products by Restaurant
router.get("/:restaurantId", getProductsByRestaurant);

export default router;