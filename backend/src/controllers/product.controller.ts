import { Response } from "express";
import { AuthRequest } from "../types/express";
import Product from "../models/product.model";
import { Restaurant } from "../models/restaurant.model";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

/**
 * ✅ 1. CREATE PRODUCT
 */
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      name, price, stock, category, restaurant, 
      description, isVeg, unit, discountPrice 
    } = req.body;

    let imageUrl = "";
    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, "/");
      imageUrl = `http://localhost:5000/${filePath}`;
    }

    const existingRestaurant = await Restaurant.findById(restaurant);
    if (!existingRestaurant) {
      return res.status(400).json({ success: false, message: "Invalid restaurant ID" });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: Number(discountPrice || 0),
      stock: Number(stock),
      category, // ఇది ఇప్పుడు స్ట్రింగ్ గా సేవ్ అవుతుంది (Ex: "Sweets")
      restaurant,
      isVeg: String(isVeg) === "true",
      unit,
      vendor: req.user?.userId,
      image: imageUrl,
    });

    res.status(201).json({ success: true, message: "Product created successfully!", data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * ✅ 2. GET ALL PRODUCTS (Customer Home Page కోసం)
 */
export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    // ఇక్కడ ఒకవేళ కేటగిరీ ID లాగా ఉంటే దాన్ని పేరుతో నింపడానికి populate వాడుతున్నాం
    const products = await Product.find()
      .populate("restaurant", "name location")
      .populate("category", "name") // కేటగిరీ ఒకవేళ Ref అయితే పేరు వస్తుంది
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

/**
 * ✅ 3. GET VENDOR PRODUCTS
 */
export const getMyProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user?.userId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const products = await Product.find({ vendor: vendorId })
    .populate("restaurant", "name")
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: products.length, data: products });
});

/**
 * ✅ 4. UPDATE PRODUCT
 */
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.vendor.toString() !== req.user?.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { name, price, stock, category, restaurant, description, isVeg, unit, discountPrice } = req.body;

    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, "/");
      product.image = `http://localhost:5000/${filePath}`;
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (stock !== undefined) product.stock = Number(stock);
    if (category !== undefined) product.category = category; // కొత్త స్ట్రింగ్ కేటగిరీ ఇక్కడ అప్‌డేట్ అవుతుంది
    if (restaurant !== undefined) product.restaurant = restaurant;
    if (unit !== undefined) product.unit = unit;
    if (isVeg !== undefined) product.isVeg = String(isVeg) === "true";

    await product.save();
    res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ 5. DELETE PRODUCT & 6, 7 (యథాతథంగా ఉంచండి...)
 */
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.vendor.toString() !== req.user?.userId) return res.status(403).json({ success: false, message: "Unauthorized" });
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

export const getProductsByRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const products = await Product.find({ restaurant: restaurantId }).populate("category", "name").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};