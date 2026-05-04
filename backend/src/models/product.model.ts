import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image?: string;
  category: string; 
  restaurant?: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  unit: string;
  isVeg: boolean;
  stock: number;
  isOutOfStock: boolean;
  rating: number;
  numReviews: number;
  isActive: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    category: { type: String, required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    unit: { type: String, required: true },
    isVeg: { type: Boolean, required: true, default: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isOutOfStock: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * ✅ MODERN PRE-SAVE HOOK (Without next())
 * Mongoose లో async ఫంక్షన్ వాడితే next() అవసరం లేదు.
 */
ProductSchema.pre("save", async function (this: IProduct) {
  // స్టాక్ 0 అయితే ఆటోమేటిక్ గా out of stock అవుతుంది
  this.isOutOfStock = this.stock <= 0;
});

// Virtual for Discount Percentage
ProductSchema.virtual("discountPercentage").get(function () {
  if (this.discountPrice && this.discountPrice > 0 && this.price > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;