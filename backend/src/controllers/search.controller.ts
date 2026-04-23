import { Request, Response, NextFunction } from "express";
import { SearchService } from "./search.service";

const searchService = new SearchService();

export const searchRestaurantsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        
        const result = await searchService.searchRestaurants(
            req.query.q as string
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const searchMenuController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        
        const result = await searchService.searchMenuItems(
            req.query.q as string
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const globalSearchController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        
        const result = await searchService.globalSearch(
            req.query.q as string
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};