import { AppError } from "../../utils/AppError";
import { MenuRepository } from "./menu.repository";


export class MenuService {
    private menuRepo = new MenuRepository();

    async createMenu(vendorId: string, data: any) {
        const menu = await this.menuRepo.create({
            ...data,
            vendor: vendorId,
        });
        return menu;
    }

    async updateMenu(menuId: string, vendorId: string, data: any) {
        const menu = await this.menuRepo.findById(menuId);
        if (!menu) throw new AppError("Menu not found", 404);

        if(menu.vendor.toString() !== vendorId)
            throw new AppError("Unauthorized", 403);

        return this.menuRepo.update(menuId, data);
    }

    async deleteMenu(menuId: string, vendorId: string) {
        const menu = await this.menuRepo.findById(menuId);
        if (!menu) throw new AppError("Menu not found", 404);

        if (menu.vendor.toString() !== vendorId)
            throw new AppError("unauthorized0", 403);

        return this.menuRepo.delete(menuId);
    }

    async getRestaurantMenu(restaurantId: string) {
        return this.menuRepo.findByRestaurant(restaurantId as any);
    }
}