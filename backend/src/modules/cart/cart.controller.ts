import { NextFunction, Response } from "express";
import { CartService } from "./cart.service";
import { Types } from "mongoose";

const cartService = new CartService();

// Add Item to cart
export const addToCart = async (req: any, res: Response, next: NextFunction) => {
    try {

        console.log("USER:", req.user);
        console.log("BODY:", req.body);

        const { menuItemId, quantity } = req.body;

        const result = await cartService.addToCart(
            new Types.ObjectId(req.user.userId),
            menuItemId,
            quantity
        );
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// Update Quantity
export const updateQuantityController = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await cartService.updateQuantity(
            req.user.id,
            req.params.menuItemId,
            req.body.quantity
        );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

// Remove Item from Cart
export const removeFromCart = async (req: any, res: Response, next: NextFunction) => {
    try {
        const result = await cartService.removeFromCart(
            req.user.id,
            req.params.menuItemId
        );
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req: any, res: Response, next: NextFunction) => {
    try {
        await cartService.clearCart(req.user.id);
        res.status(200).json({ success: true, message: "Cart Cleared" });
    } catch (error) {
        next(error);
    }
};

export const getCart = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {

        console.log("Token User:", req.user);

        const cart = await cartService.getCart(req.user.userId);

        res.status(200).json({
            success: true,
            data: cart
        })
    } catch (error) {
        next(error);
    }
}