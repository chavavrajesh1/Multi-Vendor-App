import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";

export class SearchService {

    async searchRestaurants(query: string) {
        return await Restaurant.find({
            name: { $regex: query, $options: "i" }
        }).limit(10);
    }

    async searchMenuItems(query: string) {
        return await Menu.find({
            name: { $regex: query, $options: "i" }
        }).limit(10);
    }

    async globalSearch(query: string) {
        
        const restaurants = await Restaurant.find({
            name: { $regex: query, $options: "i" }
        }).limit(5);

        const menuItems = await Menu.find({
            name: { $regex: query, $options: "i" }
        }).limit(5);

        return {
            restaurants,
            menuItems
        };
    }
}