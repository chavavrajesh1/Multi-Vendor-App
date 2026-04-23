import { z } from "zod";

export const createRestaurantSchema = z.object({
    name: z
        .string()
        .min(3, "Restaurant name must be at least 3 characters long"),

    address: z
        .string()
        .min(5, "Address must be at least 5 characters long"),

    cuisine: z
        .string()
        .min(3, "Cuisine type must be at least 3 characters long"),

});