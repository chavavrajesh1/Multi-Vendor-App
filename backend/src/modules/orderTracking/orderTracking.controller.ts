import { Response, NextFunction } from "express";
import { OrderTrackingService } from "./orderTracking.service";
import {  OrderStatus } from "../order/order.model"

const orderTrackingService = new OrderTrackingService();

export const getOrderStatusController = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await orderTrackingService.getOrderStatus(
            req.params.orderId
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatusController = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await orderTrackingService.updateOrderStatus(
            req.params.orderId,
            req.body.status as OrderStatus
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}