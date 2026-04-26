import { Response, NextFunction } from "express";
import { createRestaurantService, getVendorRestaurantsService, updateRestaurantService, deleteRestaurantService } from "../services/restaurant.service";
import { AuthRequest } from "../types/express";
import { AppError } from "../utils/AppError";
import { Restaurant } from "../models/restaurant.model";
import { Order, OrderStatus } from "../models/order.model";

/* =====================================================
    ADD NEW RESTAURANT
===================================================== */
export const addRestaurant = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { name, address, cuisine } = req.body;
    const vendorId = req.user?.userId;

    if (!vendorId) {
      throw new AppError("Unauthorized: Vendor information missing", 401);
    }

    if (!name || !address || !cuisine) {
      throw new AppError("Please provide all required fields (name, address, cuisine)", 400);
    }

    const newRestaurant = new Restaurant({
      name,
      address,
      cuisine,
      vendor: vendorId,
    });

    await newRestaurant.save();

    res.status(201).json({ 
      success: true, 
      message: "Restaurant added successfully",
      data: newRestaurant 
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
    GET VENDOR ORDERS
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
    if (!restaurant) throw new AppError("No restaurants found for this vendor", 404);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const filter: any = { restaurant: restaurant._id };
    if (status) filter.status = status;

    const totalOrders = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "name email")
      // FIX: 'products.product' ని 'items.product' గా మార్చాను (మీ Schema ప్రకారం)
      .populate("items.product", "name price") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalOrders,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
    VENDOR DASHBOARD STATS
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
    if (!restaurant) throw new AppError("No restaurants found for this vendor", 404);

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
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        preparingOrders,
        deliveredOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
    VENDOR REVENUE ANALYTICS
===================================================== */
export const getVendorRevenueAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.user?.userId;
    if (!vendorId) throw new AppError("Unauthorized", 401);

    const restaurant = await Restaurant.findOne({ vendor: vendorId });
    if (!restaurant) throw new AppError("Restaurant not found", 404);

    const revenueData = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
          status: OrderStatus.DELIVERED,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    const totalOrders = revenueData.reduce((acc, curr) => acc + curr.totalOrders, 0);

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue: revenueData,
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
    GET MY RESTAURANTS
===================================================== */
export const getMyRestaurants = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.user?.userId;
    if (!vendorId) throw new AppError("Unauthorized", 401);

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