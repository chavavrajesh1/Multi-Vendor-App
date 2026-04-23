import { Response, NextFunction } from "express";
import { MenuService } from "./menu.service";
import { AuthRequest } from "../../types/express";
import { AppError } from "../../utils/AppError";

const menuService = new MenuService();

/* ==============================
   CREATE MENU
============================== */
export const createMenu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const menu = await menuService.createMenu(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

/* ==============================
   UPDATE MENU
============================== */
export const updateMenu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const menu = await menuService.updateMenu(
      req.params.id as string,
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

/* ==============================
   DELETE MENU
============================== */
export const deleteMenu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    await menuService.deleteMenu(
      req.params.id as string,
      req.user.userId,
    );

    res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ==============================
   GET RESTAURANT MENU
============================== */
export const getRestaurantMenu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const menu = await menuService.getRestaurantMenu(
      req.params.restaurantId as string,
    );

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};