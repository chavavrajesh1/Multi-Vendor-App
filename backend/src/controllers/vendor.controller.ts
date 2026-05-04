import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { AppError } from "../utils/AppError";
import { Restaurant } from "../models/restaurant.model";
import { Order, OrderStatus } from "../models/order.model";
import  Product  from "../models/product.model"; // ప్రొడక్ట్ కౌంట్ కోసం

/* =====================================================
    1. ADD NEW RESTAURANT / SHOP
===================================================== */
export const addRestaurant = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { name, address, cuisine, phone, type } = req.body;
    const vendorId = req.user?.userId;

    if (!vendorId) {
      throw new AppError("Unauthorized: Vendor information missing", 401);
    }

    if (!name || !address) {
      throw new AppError("Please provide Business Name and Address", 400);
    }

    // వెండర్‌కి ఆల్రెడీ షాప్ ఉంటే దాన్ని అప్‌డేట్ చేయాలి లేదా కొత్తది క్రియేట్ చేయాలి
    const existingShop = await Restaurant.findOne({ vendor: vendorId });
    
    if (existingShop) {
      existingShop.name = name;
      existingShop.address = address;
      existingShop.cuisine = cuisine || existingShop.cuisine;
      await existingShop.save();
      
      return res.status(200).json({ 
        success: true, 
        message: "Business profile updated", 
        data: existingShop 
      });
    }

    const newRestaurant = new Restaurant({
      name,
      address,
      cuisine: cuisine || "General",
      vendor: vendorId,
      phone,
      type
    });

    await newRestaurant.save();

    res.status(201).json({ 
      success: true, 
      message: "Business registered successfully",
      data: newRestaurant 
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
    2. GET VENDOR DASHBOARD STATS (FIXED)
===================================================== */
export const getVendorDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.user?.userId;
    if (!vendorId) throw new AppError("Unauthorized", 401);

    const restaurant = await Restaurant.findOne({ vendor: vendorId });
    const activeProducts = await Product.countDocuments({ vendor: vendorId });

    // FIX: రెస్టారెంట్ లేకపోతే ఎర్రర్ ఇవ్వకుండా జీరో డేటా పంపడం
    if (!restaurant) {
      return res.status(200).json({
        success: true,
        data: {
          totalOrders: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          preparingOrders: 0,
          deliveredOrders: 0,
          totalRevenue: 0,
          activeProducts: activeProducts || 0
        },
      });
    }

    const stats = await Order.aggregate([
      { $match: { restaurant: restaurant._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    let totalOrders = 0;
    let pendingOrders = 0;
    let confirmedOrders = 0;
    let preparingOrders = 0;
    let deliveredOrders = 0;
    let totalRevenue = 0;

    stats.forEach((item) => {
      totalOrders += item.count;
      if (item._id === OrderStatus.PENDING) pendingOrders = item.count;
      else if (item._id === OrderStatus.CONFIRMED) confirmedOrders = item.count;
      else if (item._id === OrderStatus.PREPARING) preparingOrders = item.count;
      else if (item._id === OrderStatus.DELIVERED) {
        deliveredOrders = item.count;
        totalRevenue += item.revenue;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        preparingOrders,
        deliveredOrders,
        totalRevenue,
        activeProducts
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
    3. GET VENDOR ORDERS (FIXED)
===================================================== */
export const getVendorOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.user?.userId;
    if (!vendorId) throw new AppError("Unauthorized", 401);

    const restaurant = await Restaurant.findOne({ vendor: vendorId });
    
    if (!restaurant) {
      return res.status(200).json({
        success: true,
        data: [] // Empty array
      });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("user", "name email")
      .populate("items.product", "name price") 
      .sort({ createdAt: -1 })
      .limit(10); // Dashboard కోసం టాప్ 10

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
    4. GET VENDOR PRODUCTS
===================================================== */
export const getVendorProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.user?.userId;
    if (!vendorId) throw new AppError("Unauthorized", 401);

    const products = await Product.find({ vendor: vendorId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
    5. GET MY RESTAURANTS / SHOP LIST
===================================================== */
export const getMyRestaurants = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.user?.userId;
    const restaurants = await Restaurant.find({ vendor: vendorId });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};