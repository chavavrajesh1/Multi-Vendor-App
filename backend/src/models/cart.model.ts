import mongoose, { Schema, Types } from "mongoose";

export interface ICartItem {
    menuItem: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    restaurant: Types.ObjectId;
}

export interface ICart extends Document {
    customer: Types.ObjectId;
    restaurant: Types.ObjectId;
    items: ICartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
    {
        menuItem: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    },
    { _id: false }
);

const cartSchema = new Schema<ICart>(
    {
        customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
        items: [cartItemSchema],
        totalAmount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);