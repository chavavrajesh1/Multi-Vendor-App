import { Response, Request, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { AuthRequest } from "../types/express";

const reviewService = new ReviewService();

export const addReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const review = await reviewService.addReview(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await reviewService.getRestaurantReviews(
      req.params.restaurantId as string
    );

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await reviewService.getMenuReviews(
      req.params.menuId as string
    );

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantRating = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rating = await reviewService.getRestaurantRating(
      req.params.restaurantId as string
    );

    res.status(200).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    next(error);
  }
};