import InvoiceDataAccess from '../dataAccess/InvoiceDataAccess.js'
import { UnhandledError } from '../utilities/CustomError.js'

export default class InvoiceController {
    constructor(con) {
        this.dataAccess = new InvoiceDataAccess(con);
    }

    async getInvoices(attributes, sort, offset, limit) {
        try {
            const columnName = sort.fieldName || 'invoiceId';
            const dir = sort.dir || 'DESC';
            const order = [
                [columnName, dir],
            ];

            const include = [
                {
                    association: 'invoiceIngredient',
                    required: false,
                    attributes: ['name'],
                },
            ];
            const invoices =  await this.dataAccess.getInvoices(attributes, {}, include, { offset, limit }, order);

            if (invoices) {
                invoices.forEach((item) => {
                    if (item['invoiceIngredient.name']) {
                        item.ingredient  = {
                            name: item['invoiceIngredient.name'],
                        }
                    }
                });
            }
            return invoices;
        } catch (error) {
            return new UnhandledError(error);
        }
    }
}