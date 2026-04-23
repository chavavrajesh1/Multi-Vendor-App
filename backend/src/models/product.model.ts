import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image?: string;

  category: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;

  stock: number;
  isOutOfStock: boolean;

  rating: number;
  numReviews: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    isOutOfStock: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto update stock status
ProductSchema.pre("save", function () {
  const product = this as IProduct;
  product.isOutOfStock = product.stock === 0;
});

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;