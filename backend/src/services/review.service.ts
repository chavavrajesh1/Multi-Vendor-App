import Review  from "../models/review.model";

export class ReviewService {

    async addReview(userId: string, data: any) {

        const review = await Review.create({
            user: userId,
            ...data,
        });

        return review;
    }

    async getRestaurantReviews(restaurantId: string) {

        const reviews = await Review.find({
            restaurant: restaurantId            
        })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        return reviews;
    }

    async getMenuReviews(menuId: string) {

        const reviews = await Review.find({
            menuItem: menuId
        })
            .populate("user", "name");

        return reviews;
    }

    async getRestaurantRating(restaurantId: string) {

        const result = await Review.aggregate([
            { $match: { restaurant: new (require("mongoose").Types.ObjectId)(restaurantId) } },
            {
                $group: {
                    _id: "$restaurant",
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        return result[0] || { avgRating: 0, totalReviews: 0 };
    }
}

