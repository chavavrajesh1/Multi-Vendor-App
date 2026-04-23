import cron from "node-cron";
import { Order, OrderStatus, PaymentStatus } from "./order.model";

cron.schedule("* * * * *", async () => {

  const now = new Date();

  const expiredOrders = await Order.find({
    paymentStatus: PaymentStatus.PENDING,
    expiresAt: { $lt: now },
    status: OrderStatus.PENDING
  });

  for (const order of expiredOrders) {

    order.status = OrderStatus.CANCELLED;
    order.paymentStatus = PaymentStatus.FAILED;

    await order.save();
  }

});