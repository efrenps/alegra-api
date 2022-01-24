import { TableHints } from 'sequelize';
import GenericDataAccess from './GenericDataAccess.js';

export default class InvoiceDataAccess extends GenericDataAccess {
    constructor(connection) {
        super(connection, 'Invoice');
        this.connection = connection;
    }

    async getInvoices(attributes, condition, includes, { offset, limit }, order) {
        return this.connection.Invoice.findAll({
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
}