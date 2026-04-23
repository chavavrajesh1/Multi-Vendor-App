import { User } from "../user/user.model";
import { Restaurant } from "./restaurant.model";


export const createRestaurantService = async (
    vendorId: string,
    data: {
        name: string;
        address: string;
        cuisine: string;
    }
) => {
    const vendor = await User.findById(vendorId);

    if (!vendor) {
        throw new Error("Vendor not found");
    }

    if (vendor.role !== "vendor") {
        throw new Error("Only vendors can create restaurants");
    }

    if (!vendor.isApproved) {
        throw new Error("Vendor is not approved by admin");
    }   

    const restaurant = await Restaurant.create({
        ...data,
        vendor: vendorId
    });

    return restaurant;
};

export const getVendorRestaurantsService = async (vendorId: string) => {
    const restaurants = await Restaurant.find({ vendor: vendorId });

    return restaurants;
};

export const updateRestaurantService = async (
    vendorId: string,
    restaurantId: string,
    data: {
        name?: string;
        address?: string;
        cuisine?: string;
    }
) => {
    const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        vendor: vendorId,
    });

    if (!restaurant) {
        throw new Error("Restaurant not found or you don't have permission to update it");
    }

    Object.assign(restaurant, data);

    await restaurant.save();

    return restaurant;
};

export const deleteRestaurantService = async (
    vendorId: string,
    restaurantId: string
) => {
    const restaurant = await Restaurant.findOneAndDelete({
        _id: restaurantId,
        vendor: vendorId
    });

    if (!restaurant) {
        throw new Error("Restaurant not found or unauthorized");
    }

    return restaurant;
};

export const getAllRestaurantsService = async (
    page: number,
    limit: number,
    cuisine?: string
) => {
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (cuisine) {
        filter.cuisine = cuisine;
    }

    const restaurants = await Restaurant.find(filter)
        .skip(skip)
        .limit(limit);

    const total = await Restaurant.countDocuments(filter);

    return {
        restaurants,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};