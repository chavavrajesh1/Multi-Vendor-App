import mongoose, { Schema } from "mongoose";


export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    restaurant: mongoose.Types.ObjectId;
    menuItem?: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
}

const reviewSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        restaurant: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        menuItem: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);