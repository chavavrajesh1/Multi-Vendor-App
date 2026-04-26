import { AppError } from "../utils/AppError";
import { Order, OrderStatus } from "../models/order.model";

export class OrderTrackingService {

    async getOrderStatus(orderId: string) {

        const order = await Order.findById(orderId)
            .populate("restaurant", "name")
            .populate("products.product", "name.price");

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        return {
            orderId: order._id,
            orderNumber: order.orderNumber,
            status: order.status,
            statusHistory: order.statusHistory,
            totalAmount: order.totalAmount
        };
    }

    async updateOrderStatus(
        orderId: string,
        status: OrderStatus
    ){
        const order = await Order.findById(orderId);

        if(!order){
            throw new AppError("Order not found", 404);
        }

        order.status = status;

        order.statusHistory.push({
            status,
            updatedAt: new Date()
        });

        await order.save();

        return order;
    }
}