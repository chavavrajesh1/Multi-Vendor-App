import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMenu extends Document {
  name: string;
  description?: string;
  price: number;
  category: string;
  restaurant: Types.ObjectId;
  vendor: Types.ObjectId;
  isAvailable: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema = new Schema<IMenu>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
  },
  {
    timestamps: true, // automatically creates createdAt and updatedAt
  }
);

export const Menu = mongoose.model<IMenu>("Menu", menuSchema);