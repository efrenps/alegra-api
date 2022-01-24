import { TableHints } from 'sequelize';
import GenericDataAccess from './GenericDataAccess.js';

export default class MenuDataAccess extends GenericDataAccess {
    constructor(connection) {
        super(connection, 'Menu');
        this.connection = connection;
    }

    async getMenus(attributes, condition = {}) {
        return this.connection.Menu.findAll({
            attributes,
            include: [{
                model: this.connection.Ingredient,
                as: 'ingredients'
            }],
            where: condition,
            returning: true,
            raw: true,
            tableHint: TableHints.NOLOCK,
        });
    }

    async getMenu(attributes, includes, condition = {}) {
        return this.connection.Menu.findOne({
            attributes,
            include: includes,
            where: condition,
            returning: true,
            raw: true,
            tableHint: TableHints.NOLOCK,
        });
    }
}