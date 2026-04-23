import { Types } from "mongoose";
import { cartRepository } from "./cart.repository";
import { Menu } from "../menu/menu.model";
import { AppError } from "../../utils/AppError";

export class CartService {
  private cartRepo = new cartRepository();

  /* =================================
     ADD TO CART
  ================================= */

  async addToCart(
    customerId: Types.ObjectId,
    menuItemId: string,
    quantity: number
  ) {

    console.log("Customer:", customerId);
    console.log("MenuItem:", menuItemId);

    const menuItem = await Menu.findById(menuItemId);

    console.log("Menu Found:", menuItem);

    if (!menuItem) throw new AppError("Menu item not found", 404);

    if (!menuItem.isAvailable)
      throw new AppError("Item is currently unavailable", 400);

    if (menuItem.stock !== undefined && menuItem.stock <= 0)
      throw new AppError("Item out of stock", 400);

    if (menuItem.stock !== undefined && quantity > menuItem.stock)
      throw new AppError("Requested quantity exceeds stock", 400);

    let cart = await this.cartRepo.findByCustomer(customerId);

    // Only one restaurant rule
    if (cart && cart.restaurant.toString() !== menuItem.restaurant.toString()) {
      throw new AppError(
        "You can only order from one restaurant at a time",
        400
      );
    }

    // Create new cart
    if (!cart) {

      console.log("Creating new cart");

      cart = await this.cartRepo.create({
        customer: customerId,
        restaurant: menuItem.restaurant,
        items: [],
      });

      console.log("Cart Created:", cart);
    }

    const existingItem = cart.items.find(
      (item: any) => item.menuItem.toString() === menuItemId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (menuItem.stock !== undefined && newQuantity > menuItem.stock)
        throw new AppError("Total quantity exceeds stock", 400);

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        restaurant: menuItem.restaurant,
      });

      console.log("Items after push:", cart.items);
    }

    cart.totalAmount = this.calculateTotal(cart.items);

    const savedCart = await this.cartRepo.save(cart);

    console.log("Saved Cart:", savedCart);

    // return this.cartRepo.save(cart);
    return savedCart;
  }

  /* =================================
     GET CART
  ================================= */

  async getCart(customerId: Types.ObjectId) {
    const cart = await this.cartRepo.findByCustomer(customerId);

    if (!cart) {
      return {
        items: [],
        totalAmount: 0,
      };
    }

    return cart;
  }

  /* =================================
     REMOVE ITEM FROM CART
  ================================= */

  async removeFromCart(customerId: Types.ObjectId, menuItemId: string) {
    const cart = await this.cartRepo.findByCustomer(customerId);

    if (!cart) throw new AppError("Cart not found", 404);

    cart.items = cart.items.filter(
      (item: any) => item.menuItem.toString() !== menuItemId
    );

    cart.totalAmount = this.calculateTotal(cart.items);

    return this.cartRepo.save(cart);
  }

  /* =================================
     CLEAR CART
  ================================= */

  async clearCart(customerId: Types.ObjectId) {
    return this.cartRepo.deleteByCustomer(customerId);
  }

  /* =================================
     UPDATE QUANTITY
  ================================= */

  async updateQuantity(
    customerId: Types.ObjectId,
    menuItemId: string,
    quantity: number
  ) {
    const cart = await this.cartRepo.findByCustomer(customerId);

    if (!cart) throw new AppError("Cart not found", 404);

    const item = cart.items.find(
      (i: any) => i.menuItem.toString() === menuItemId
    );

    if (!item) throw new AppError("Item not in cart", 404);

    const menuItem = await Menu.findById(menuItemId);

    if (!menuItem) throw new AppError("Menu item not found", 404);

    if (menuItem.stock !== undefined && quantity > menuItem.stock)
      throw new AppError("Requested quantity exceeds stock", 400);

    item.quantity = quantity;

    cart.totalAmount = this.calculateTotal(cart.items);

    return this.cartRepo.save(cart);
  }

  /* =================================
     CALCULATE TOTAL
  ================================= */

  private calculateTotal(items: any[]) {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}