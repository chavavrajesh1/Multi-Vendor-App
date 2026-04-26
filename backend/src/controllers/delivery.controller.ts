import { RequestHandler } from "express";
import { DeliveryService } from "../services/delivery.service";

const deliveryService = new DeliveryService();

export const assignDeliveryController: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        
        const delivery = await deliveryService.assignDelivery(
            req.body.orderId,
            req.body.deliveryPartnerId
        );

        res.status(201).json({
            success: true,
            data: delivery
        });

    } catch (error) {
        next(error);       
    }
};

export const updateDeliveryStatusController: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        
        const result = await deliveryService.updateDeliveryStatus(
            req.params.deliveryId as string,
            req.body.status
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};