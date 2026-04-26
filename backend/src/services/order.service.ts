import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { Order, OrderStatus } from "../models/order.model";
import { Payment, PaymentMethod, PaymentStatus } from "../models/payment.model";
import { Restaurant } from "../models/restaurant.model";
import  productModel  from "../models/product.model";

/* ======================================================
    1. CREATE ORDER (Supports COD, UPI, CARD)
====================================================== */
export const createOrderService = async (
  userId: string,
  restaurantId: string,
  items: { productId: string; quantity: number }[],
  deliveryAddress: string,
  paymentMethod: PaymentMethod
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check Restaurant
    const restaurant = await Restaurant.findById(restaurantId).session(session);
    if (!restaurant) {
      throw new AppError("Restaurant not found", 404);
    }

    let totalAmount = 0;
    const orderItems: any[] = [];

    // Check Products + Stock
    for (const item of items) {
      const product = await productModel.findById(item.productId).session(session);

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`${product.name} is out of stock`, 400);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Reduce Stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    /* LOGIC: ఆన్‌లైన్ పేమెంట్ (UPI/CARD) అయితే పేమెంట్ గేట్‌వే నుండి 
       కన్ఫర్మేషన్ వచ్చే వరకు status 'PENDING' లోనే ఉండాలి.
    */
    const initialPaymentStatus = PaymentStatus.PENDING;

    // Create Order
    const order = await Order.create(
      [
        {
          user: userId,
          vendor: restaurant.vendor,
          restaurant: restaurantId,
          items: orderItems,
          totalAmount,
          deliveryAddress,
          paymentMethod,
          status: OrderStatus.PENDING,
          paymentStatus: initialPaymentStatus,
        },
      ],
      { session }
    );

    // Create Payment Record
    const payment = await Payment.create(
      [
        {
          order: order[0]._id,
          user: userId,
          amount: totalAmount,
          method: paymentMethod,
          status: initialPaymentStatus,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      order: order[0],
      payment: payment[0],
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/* ======================================================
    2. VERIFY ONLINE PAYMENT (New for UPI/CARD)
====================================================== */
export const verifyPaymentService = async (
  orderId: string,
  paymentId: string,
  signature?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new AppError("Order not found", 404);

    const payment = await Payment.findOne({ order: orderId }).session(session);
    if (!payment) throw new AppError("Payment record not found", 404);

    // Update Payment Status
    payment.status = PaymentStatus.PAID;
    payment.transactionId = paymentId; // Ensure transactionId exists in your Payment Model
    await payment.save({ session });

    // Update Order Status
    order.paymentStatus = PaymentStatus.PAID;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/* ======================================================
    3. GET ORDER BY ID
====================================================== */
export const getOrderByIdService = async (orderId: string) => {
  const order = await Order.findById(orderId)
    .populate("items.product", "name price image")
    .populate("restaurant", "name address")
    .populate("user", "name email phone");

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

/* ======================================================
    4. UPDATE ORDER STATUS (Support for COD Collection)
====================================================== */
export const updateOrderStatusService = async (
  orderId: string,
  status: OrderStatus,
  paymentCollected?: boolean
) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  order.status = status;

  // Delivery సమయంలో COD అమౌంట్ కలెక్ట్ చేస్తే
  if (status === OrderStatus.DELIVERED) {
    const payment = await Payment.findOne({ order: orderId });

    if (payment && payment.method === PaymentMethod.COD) {
      if (!paymentCollected) {
        throw new AppError("Please confirm payment collection for COD", 400);
      }
      payment.status = PaymentStatus.PAID;
      await payment.save();
      order.paymentStatus = PaymentStatus.PAID;
    }
  }

  await order.save();
  return order;
};

/* ======================================================
    5. GET LIST SERVICES
====================================================== */
export const getUserOrdersService = async (userId: string) => {
  return await Order.find({ user: userId })
    .populate("items.product", "name price")
    .populate("restaurant", "name")
    .sort({ createdAt: -1 });
};

export const getVendorOrdersService = async (vendorId: string) => {
  return await Order.find({ vendor: vendorId })
    .populate("items.product", "name price")
    .populate("restaurant", "name")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};