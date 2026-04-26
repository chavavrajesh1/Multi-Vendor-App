import { Types } from "mongoose";
import { cartRepository } from "../repositories/cart.repository";
import { Order, OrderStatus } from "../models/order.model";
import { Payment, PaymentMethod, PaymentStatus } from "../models/payment.model";
import { AppError } from "../utils/AppError";

export class CheckOutService {
  private cartRepo = new cartRepository();

  async checkout(customerId: Types.ObjectId, paymentMethod: "cod" | "card" | "upi") {
    const cart = await this.cartRepo.findByCustomer(customerId);

    console.log("CHECKOUT CUSTOMER ID:", customerId);

    if (!cart || cart.items.length === 0)
      throw new AppError("Cart is Empty", 400);

    const deliveryFee = 40;
    const tax = cart.totalAmount * 0.05;

    const finalAmount = cart.totalAmount + deliveryFee + tax;

    const order = await Order.create({
      user: customerId,
      restaurant: cart.restaurant,
      products: cart.items.map((item: any) => ({
        product: item.menuItem,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: finalAmount,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod, 
    });

    try {
      console.log("🔥 BEFORE PAYMENT CREATE");

      const payment = await Payment.create({
        order: order._id,
        user: customerId,
        amount: finalAmount,
        method: PaymentMethod.COD,
        status: PaymentStatus.PENDING,
      });

      console.log("🔥 PAYMENT CREATED:", payment);
    } catch (err) {
      console.error("❌ PAYMENT ERROR:", err);
    }

    // Clear Cart after order creation
    await this.cartRepo.deleteByCustomer(customerId);

    return {
      orderId: order._id,
      itemsTotal: cart.totalAmount,
      deliveryFee,
      tax,
      finalAmount,
    };
  }
}
