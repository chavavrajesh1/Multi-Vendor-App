import { Response } from "express";
import { AuthRequest } from "../types/express";
import { Category } from "../models/category.model";

// 1. Create Category
export const createCategory = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        // ఒకే పేరుతో కేటగిరీ ఉందో లేదో చెక్ చేయాలి
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return res.status(400).json({ 
                success: false, 
                message: "ఈ కేటగిరీ ఇప్పటికే ఉంది (Category already exists)" 
            });
        }

        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message || "Failed to create category" 
        });
    }
};

// 2. Get All Categories
export const getCategories = async (req: AuthRequest, res: Response) => {
    try {
        // ఇక్కడ కేవలం isActive: true ఉన్నవి మాత్రమే కావాలనుకుంటే అలా కూడా ఫిల్టర్ చేయొచ్చు
        const categories = await Category.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch categories" 
        });
    }
};