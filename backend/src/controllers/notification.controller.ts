import { NextFunction, Response } from "express";
import { NotificationService } from "./notification.service";
import { AuthRequest } from "../../types/express";
import mongoose from "mongoose";

const notificationService = new NotificationService();

export const getMyNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const notifications = await notificationService.getUserNotifications(
      new mongoose.Types.ObjectId(req.user.userId)
    );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
