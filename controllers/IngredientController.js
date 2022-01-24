import dotenv from 'dotenv';
import IngredientDataAccess from '../dataAccess/IngredientDataAccess.js'
import InvoiceDataAccess from '../dataAccess/InvoiceDataAccess.js'
import { HandledError, UnhandledError } from '../utilities/CustomError.js'
import { PublishHelper } from '../helpers/PublishHelper.js'
import { PUBLICATIONS, SUBSCRIPTION_ACTION_TYPES } from '../utilities/Enums.js'
import HttpClientHelper from '../helpers/HttpClientHelper.js';

dotenv.config();
const {
    FARMER_MARKET
} = process.env;

export default class IngredientController {
    constructor(con) {
        this.dataAccess = new IngredientDataAccess(con);
    }

    /* TODO: We could remove this method because 
    *  getIngredients query has no filters
    */
    static filterIngredients(payload, args, { connection }) {
        return true;
    }

    async getIngredients(attributes) {
        try {
            return this.dataAccess.findAll(attributes);
        } catch (error) {
            return new UnhandledError(error);
        }
    }

    async getIngredient(ingredientId, attributes) {
        try {
            return this.dataAccess.findOne(attributes, { ingredientId });
        } catch (error) {
            return new UnhandledError(error);
        }
    }

    // Fired whe we try to buy ingredients
    async buyIngredient(ingredientId, connection) {
        try {
            const ingredient = await this.dataAccess.findOne(['name'], { ingredientId });
            if (!ingredient) {
                throw new HandledError('Ingredient not found');
            }

            const { name } = ingredient;
            const farmerData = await this.getFromMarket(name);

            if(farmerData && farmerData.quantitySold) {
                const { quantitySold } = farmerData;
                if (quantitySold > 0) {
                    const invoiceDA = new InvoiceDataAccess(connection);
                    const invoice = {
                        ingredientId,
                        quantity: quantitySold,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    await invoiceDA.create(invoice);
                    return this.dataAccess.increment('quantity', quantitySold, { ingredientId })
                    .then(() => {
                        this.executeSubscription(ingredientId, SUBSCRIPTION_ACTION_TYPES.UPDATED);
                        return true;
                    });
                }
            }

            throw new HandledError(`Currently ${name} is not available at the market`);
        } catch (error) {
            if (error instanceof HandledError) return error;
            return new UnhandledError(error);
        }
    }

    async getFromMarket(ingredientName) {
        const httpClient = new HttpClientHelper(FARMER_MARKET, 'application/json');
        return httpClient.GET(ingredientName, {}).then(response => response.data).catch((err) => {
            return err;
        });
    }

    async executeSubscription(ingredientId, subscriptionType) {
        const attributes = ['ingredientId', 'name', 'quantity'];
        const condition = {
            ingredientId,
        };
        
        const record =  await this.dataAccess.findOne(attributes, condition);
        if (record) {
            const payload = {
                data: record,
                type: subscriptionType,
            };
            PublishHelper.execute(PUBLICATIONS.INGREDIENTS, payload)
        }
    }
}