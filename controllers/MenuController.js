import MenuDataAccess from '../dataAccess/MenuDataAccess.js'
import { UnhandledError } from '../utilities/CustomError.js'

export default class MenuController {
    constructor(con) {
        this.dataAccess = new MenuDataAccess(con);
    }

    async getMenus(attributes) {
        try {
            const menus = [];
            const data = await this.dataAccess.getMenus(attributes);

            if (data) {
                data.forEach((item) => {
                    const { menuId, name } = item;
                    const menuExist = (record) => record.menuId === menuId;

                    if (!menus.some(menuExist)) {
                        menus.push({
                            menuId,
                            name,
                            ingredients: [],
                        });
                    }

                    const menuIndex = menus.findIndex(record => record.menuId === menuId);
                    const ingredientId = item['ingredients.ingredientId'];

                    const ingredientExist = (record) => record.ingredientId === ingredientId;
                    if (!menus.some(ingredientExist)) {
                        menus[menuIndex].ingredients.push({
                            ingredientId,
                            name: item['ingredients.name'],
                            quantity: item['ingredients.MenuIngredient.quantity'], // quantity required by receipe
                        })
                    }
                });
            }
            return menus;
        } catch (error) {
            return new UnhandledError(error);
        }
    }
}