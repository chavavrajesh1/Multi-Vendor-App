import { Types } from "mongoose";
import { Menu } from "../models/menu.model";

export class MenuRepository {
    async create(data: any) {
        return Menu.create(data);
    }

    async findById(id: string) {
        return Menu.findById(id);
    }

    async findByRestaurant(restaurantId: Types.ObjectId) {
        return Menu.find({ restaurant: restaurantId });
    }

    async update(id: string, data: any) {
        return Menu.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return Menu.findByIdAndDelete(id);
    }
}