import { Response } from "express";
import { AuthRequest } from "../../types/express";
import { Category } from "./category.model";


export const createCategory = async (req: AuthRequest, res: Response) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create category" });
    }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await Category.find();

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories" })
    }
};