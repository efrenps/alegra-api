import { TableHints } from 'sequelize';
import GenericDataAccess from './GenericDataAccess.js';

export default class MenuOrderDataAccess extends GenericDataAccess {
    constructor(connection) {
        super(connection, 'MenuOrder');
        this.connection = connection;
    }

    async getMenuOrders(attributes, condition, includes, { offset, limit }, order) {
        return this.connection.MenuOrder.findAll({
            attributes,
            where: condition,
            include: includes,
            offset,
            limit,
            order,
            returning: true,
            raw: true,
            tableHint: TableHints.NOLOCK,
        });
    }

    async getMenuOrder(attributes, condition, includes) {
        return this.connection.MenuOrder.findOne({
            attributes,
            where: condition,
            include: includes,
            returning: true,
            raw: true,
            tableHint: TableHints.NOLOCK,
        });
    }
}