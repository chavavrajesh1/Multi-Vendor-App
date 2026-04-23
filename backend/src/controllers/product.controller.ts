import { Response } from "express";
import { AuthRequest } from "../types/express";
import Product from "../models/product.model";
import { Restaurant } from "../models/restaurant.model"; // 👈 import
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

// ✅ Create Product (Vendor)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, stock, category, restaurant } = req.body;

    // const image = req.file ? req.file.path : ""; // 🔥 handle image path
    const image = req.file
      ? `http://localhost:5000/${req.file.path.replace(/\\/g, "/")}`
      : "";

    // 🔥 Check restaurant exists
    const existingRestaurant = await Restaurant.findById(restaurant);

    if (!existingRestaurant) {
      return res.status(400).json({
        message: "Invalid restaurant ID",
      });
    }

    // 🔥 Check vendor owns this restaurant (VERY IMPORTANT)
    if (existingRestaurant.vendor.toString() !== req.user?.userId) {
      return res.status(403).json({
        message: "You can only add products to your own restaurant",
      });
    }

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      restaurant,
      vendor: req.user?.userId, // 🔥 link vendor
      image, // 🔥 save image path
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to create product",
    });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("restaurant", "name");

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// ✅ Get Products by Restaurant
export const getProductsByRestaurant = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { restaurantId } = req.params;

    const products = await Product.find({ restaurant: restaurantId });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

export const getMyProducts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const vendorId = req.user?.userId;

    if (!vendorId) {
      throw new AppError("Unauthorized", 401);
    }

    const products = await Product.find({ vendor: vendorId })
      .populate("restaurant", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  },
);

// ✅ Update Product (Stock / Price / etc.)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // if (req.file) {
    //   product.image = req.file.path; // 🔥 update image if new one uploaded
    // }

    if (req.file) {
      product.image = `http://localhost:5000/${req.file.path.replace(/\\/g, "/")}`;
    }

    console.log("TOKEN USER:", req.user?.userId);
    console.log("PRODUCT VENDOR:", product.vendor?.toString());

    // 🔐 Vendor ownership check
    if (!product.vendor || product.vendor.toString() !== req.user?.userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const { name, price, stock, category, restaurant } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (restaurant !== undefined) product.restaurant = restaurant;

    // 🔥 Auto stock status
    product.isOutOfStock = product.stock === 0;

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Failed to update product",
    });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.vendor.toString() !== req.user?.userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};
