import mongoose, { Schema, HydratedDocument } from "mongoose";

export interface IRestaurant {
  name: string;
  address: string;
  cuisine: string;
  vendor: mongoose.Types.ObjectId;
}

export type RestaurantDocument = HydratedDocument<IRestaurant>;

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    cuisine: { type: String, required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model<IRestaurant>(
  "Restaurant",
  restaurantSchema
);