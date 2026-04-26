import { NextFunction, Response } from "express";
import { createRestaurantService, getVendorRestaurantsService, updateRestaurantService, deleteRestaurantService, getAllRestaurantsService } from "../services/restaurant.service";
import { AuthRequest } from "../types/express";

export const createRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const vendorId = req.user?.userId;

    if (!vendorId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const restaurant = await createRestaurantService(vendorId, req.body);

    return res.status(201).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const getVendorRestaurants = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const vendorId = req.user?.userId;

    if (!vendorId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const restaurants = await getVendorRestaurantsService(vendorId);

    return res.status(200).json({
      success: true,
      restaurants,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (
  req: AuthRequest & { params: { id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const vendorId = req.user?.userId;

    if (!vendorId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const updateRestaurant = await updateRestaurantService(
      vendorId,
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      restaurant: updateRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (
  req: AuthRequest & { params: { id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const vendorId = req.user?.userId;

    if (!vendorId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await deleteRestaurantService(vendorId, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRestaurants = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const cuisine = req.query.cuisine as string | undefined;

    const data = await getAllRestaurantsService(
      page,
      limit,
      cuisine
    );

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);    
  }
}
