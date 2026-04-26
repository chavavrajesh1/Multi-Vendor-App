import { Types } from "mongoose";
import { Cart } from "../models/cart.model";

export class cartRepository {
    async findByCustomer(customerId: Types.ObjectId) {
        return Cart.findOne({ customer: new Types.ObjectId(customerId) });
    }

    async create(data: any){
        return Cart.create(data);
    }

    async save(cart: any){
        return cart.save();
    }

    async deleteByCustomer(customerId: Types.ObjectId){
        return Cart.findOneAndDelete({ customer: customerId });
    }
}