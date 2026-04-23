import { AppError } from "../../utils/AppError";
import { Inventory } from "../../models/inventory.model";

export class InventoryService {

  /* ======================================================
     REDUCE STOCK
  ====================================================== */
  async reduceStock(productId: string, quantity: number) {

    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than 0", 400);
    }

    const inventory = await Inventory.findOneAndUpdate(
      {
        product: productId,
        stock: { $gte: quantity }
      },
      {
        $inc: { stock: -quantity }
      },
      {
        new: true
      }
    );

    if (!inventory) {
      throw new AppError("Insufficient stock or inventory not found", 400);
    }

    return inventory;
  }

  /* ======================================================
     INCREASE STOCK
  ====================================================== */
  async increaseStock(productId: string, quantity: number) {

    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than 0", 400);
    }

    const inventory = await Inventory.findOneAndUpdate(
      {
        product: productId
      },
      {
        $inc: { stock: quantity }
      },
      {
        new: true
      }
    );

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }

  /* ======================================================
     GET INVENTORY
  ====================================================== */
  async getInventory(productId: string) {

    const inventory = await Inventory.findOne({
      product: productId
    }).populate("product");

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }

  /* ======================================================
     SET STOCK (ADMIN)
  ====================================================== */
  async setStock(productId: string, quantity: number) {

    if (quantity < 0) {
      throw new AppError("Stock cannot be negative", 400);
    }

    const inventory = await Inventory.findOneAndUpdate(
      { product: productId },
      { stock: quantity },
      { new: true }
    );

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }
}

/* ======================================================
   SINGLETON INSTANCE
====================================================== */

export const inventoryService = new InventoryService();