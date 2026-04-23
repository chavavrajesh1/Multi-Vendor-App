import { AppError } from "../../utils/AppError";
import { Order, OrderStatus } from "../../models/order.model";
import { Delivery, DeliveryStatus } from "../../models/delivery.model";


export class DeliveryService {

    async assignDelivery(orderId: string, deliveryPartnerId: string) {

        const order = await Order.findById(orderId);

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        const delivery = await Delivery.create({
            order: orderId,
            deliveryPartner: deliveryPartnerId,
        });

        return delivery;
    }

    async updateDeliveryStatus(deliveryId: string, status: DeliveryStatus) {

        const delivery = await Delivery.findById(deliveryId);

        if(!delivery) {
            throw new AppError("Delivery not found", 404);
        }

        delivery.status = status;
        await delivery.save();

        if (status === DeliveryStatus.DELIVERED) {
            const order = await Order.findById(delivery.order);

            if (order) {
                order.status = OrderStatus.DELIVERED;
                await order.save();
            }
        }
        return delivery;
    }
}