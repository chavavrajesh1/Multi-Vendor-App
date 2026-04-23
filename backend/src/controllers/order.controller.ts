import mongoose from "mongoose";
import { Response } from "express";
import { AuthRequest } from "../types/express";
import { createOrderService } from "../modules/order/order.service";
import { asyncHandler } from "../utils/asyncHandler";
import { Order, OrderStatus } from "../models/order.model";
import { Restaurant } from "../models/restaurant.model";
import { AppError } from "../utils/AppError";

/* =====================================================
    1. CREATE ORDER (Customer Side)
===================================================== */
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;

  const { order, payment } = await createOrderService(
    userId,
    restaurantId,
    items,
    deliveryAddress,
    paymentMethod
  );

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    order,
    payment
  });
});

/* =====================================================
    2. GET VENDOR ORDERS (Dashboard View)
===================================================== */
export const getVendorOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user!.userId;

  // వెండర్ యొక్క అన్ని రెస్టారెంట్లను కనుగొనడం
  const restaurants = await Restaurant.find({ vendor: vendorId });
  const restaurantIds = restaurants.map(r => r._id);

  const orders = await Order.find({
    restaurant: { $in: restaurantIds }
  })
    .populate("user", "name email phone")
    .populate("items.product", "name price image")
    .populate("restaurant", "name address")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    orders
  });
});

/* =====================================================
    3. UPDATE ORDER STATUS (The Logic for Confirmed & Preparing)
===================================================== */
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orderId = req.params.id;
  const { status } = req.body; // Frontend నుండి 'confirmed', 'preparing', మొదలైనవి వస్తాయి

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  // స్టేటస్ మార్చడం
  order.status = status;

  // లాజిక్: ఒకవేళ ఆర్డర్ డెలివరీ అయితే పేమెంట్ స్టేటస్ అప్‌డేట్ చేయడం
  if (status === "delivered") {
    if (order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }
  }

  await order.save();

  // కస్టమర్‌కి పంపే మెసేజ్
  let customerMessage = `Your order is now ${status}`;
  if (status === "confirmed") customerMessage = "Someswari Foods accepted your order!";
  if (status === "preparing") customerMessage = "We are currently packing your delicious items!";

  res.json({
    success: true,
    message: customerMessage,
    order
  });
});

/* =====================================================
    4. VENDOR DASHBOARD STATS
===================================================== */
export const getVendorDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user!.userId;

  const restaurants = await Restaurant.find({ vendor: vendorId });
  const restaurantIds = restaurants.map(r => r._id);

  const totalOrders = await Order.countDocuments({
    restaurant: { $in: restaurantIds }
  });

  const totalRevenue = await Order.aggregate([
    {
      $match: {
        restaurant: { $in: restaurantIds },
        status: "delivered"
      }
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalAmount" }
      }
    }
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0
    }
  });
});

/* =====================================================
    5. GET CUSTOMER ORDERS (Tracking)
===================================================== */
export const getCustomerOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const orders = await Order.find({ user: userId })
    .populate("restaurant", "name address")
    .populate("items.product", "name price image")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders
  });
});

/* =====================================================
    6. GET ORDER BY ID
===================================================== */
export const getOrderByIdController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("user", "name email phone")
    .populate("items.product", "name price image")
    .populate("restaurant", "name address");

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  res.json({
    success: true,
    order
  });
});