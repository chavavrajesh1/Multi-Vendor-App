import { z } from "zod";

const orderStatuses = ["confirmed", "preparing", "delivered"] as const;

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),

  deliveryAddress: z.string().min(1, "Delivery address is required"),

  paymentMethod: z.enum(["cod", "card", "upi"]),

  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),

        quantity: z
          .number()
          .int("Quantity must be an integer")
          .positive("Quantity must be greater than 0"),
      })
    )
    .min(1, "At least one product is required"),
});

// update order status validation schema
export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});