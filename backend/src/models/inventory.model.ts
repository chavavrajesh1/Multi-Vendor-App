import mongoose, { Schema } from "mongoose";

export interface IInventory {
    product: mongoose.Types.ObjectId;
    restaurant: mongoose.Types.ObjectId;
    stock: number;
    lowStockThreshold: number;
}

const InventorySchema = new Schema<IInventory>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        restaurant: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 5,
        },        
    },
    {timestamps: true}
);

export const Inventory = mongoose.model<IInventory>(
    "Inventory", InventorySchema
);