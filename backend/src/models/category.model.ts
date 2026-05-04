import mongoose, { Document, Schema } from "mongoose";

// Interface Update: Please add Image and isActive fields
export interface ICategory extends Document {
    name: string;
    image?: string;
    isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);