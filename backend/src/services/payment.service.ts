import mongoose, { Types } from "mongoose";
import { AppError } from "../utils/AppError";
import { Order, OrderStatus } from "../models/order.model";
import { Payment, PaymentMethod, PaymentStatus } from "../models/payment.model";

export const handlePaymentWebhookService = async (event: any) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { orderId, paymentStatus } = event.data;

    if (!orderId) {
      throw new AppError("OrderId missing in webhook", 400);
    }

    const objectOrderId = new Types.ObjectId(orderId);

    /* ----------------------------------
       FIND ORDER
    ---------------------------------- */

    const order = await Order.findById(objectOrderId).session(session);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    /* ----------------------------------
       FIND PAYMENT
    ---------------------------------- */

    const payment = await Payment.findOne({ order: objectOrderId }).session(session);

    if (!payment) {
      throw new AppError("Payment record not found", 404);
    }

    /* ----------------------------------
       PREVENT DUPLICATE WEBHOOK UPDATE
    ---------------------------------- */

    if (payment.status === PaymentStatus.PAID) {
      await session.commitTransaction();
      session.endSession();
      return;
    }

    /* ----------------------------------
       PAYMENT SUCCESS
    ---------------------------------- */

    if (paymentStatus === "success") {

      payment.status = PaymentStatus.PAID;

      order.paymentStatus = PaymentStatus.PAID;

      order.paymentHistory.push({
        status: PaymentStatus.PAID,
        updatedAt: new Date(),
      });

    }

    /* ----------------------------------
       PAYMENT FAILED
    ---------------------------------- */

    if (paymentStatus === "failed") {

      payment.status = PaymentStatus.FAILED;

      order.paymentStatus = PaymentStatus.FAILED;

      order.paymentHistory.push({
        status: PaymentStatus.FAILED,
        updatedAt: new Date(),
      });

    }

    await payment.save({ session });
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};