import { Op } from 'sequelize';
import _ from 'lodash';
import { PublishHelper } from '../helpers/PublishHelper.js'
import IngredientController from './IngredientController.js';
import MenuOrderDataAccess from '../dataAccess/MenuOrderDataAccess.js'
import MenuDataAccess from '../dataAccess/MenuDataAccess.js'
import MenuIngredientDataAccess from '../dataAccess/MenuIngredientDataAccess.js'
import IngredientDataAccess from '../dataAccess/IngredientDataAccess.js'
import { HandledError, UnhandledError } from '../utilities/CustomError.js'
import { MENU_ORDER_STATUS, SUBSCRIPTION_ACTION_TYPES, PUBLICATIONS } from '../utilities/Enums.js'

export default class MenuOrderController {
    constructor(connection) {
        this.dataAccess = new MenuOrderDataAccess(connection);
    }

    //TODO: Add filters from getMenuOrders
    static filterMenuOrders(payload, args, { connection }) {
        return true;
    }

    async executeSubscription(menuOrderId, subscriptionType) {
        const attributes = ['menuOrderId', 'menuId', 'status', 'quantity', 'createdAt'];
        const condition = {
            menuOrderId,
        };
        const includes = [
            {
                association: 'menu',
                required: false,
                attributes: ['menuId', 'name'],
            },
        ];

        const record =  await this.dataAccess.findOne(attributes, condition, includes);
        if (record) {
            const { menu } = record;
            const payload = {
                data: {
                    ...record.dataValues,
                },
                type: subscriptionType,

            };
            if (menu) {
                payload.data.menu = {
                    ...menu.dataValues
                }
            }
            PublishHelper.execute(PUBLICATIONS.MENU_ORDERS, payload)
        }
    }

    async getMenuOrders(attributes, filter, sort, offset, limit) {
        try {
            const {
                status
            } = filter;
            const columnName = sort.fieldName || 'menuOrderId';
            const dir = sort.dir || 'DESC';
            const order = [
                [columnName, dir],
            ];

            let condition = {};
            if (!_.isEmpty(status)) {
                condition = {
                    status: { [Op.in]: status }
                }
            }

            const include = [
                {
                    association: 'menu',
                    required: false,
                    attributes: ['menuId', 'name'],
                },
            ];
            const menuOrders =  await this.dataAccess.getMenuOrders(attributes, condition, include, { offset, limit }, order);

            if (menuOrders) {
                menuOrders.forEach((item) => {
                    if (item.menuId) {
                        item.menu  = {
                            menuId: item['menu.menuId'],
                            name: item['menu.name'],
                        }
                    }
                    
                });
            }
            return menuOrders;
        } catch (error) {
            return new UnhandledError(error);
        }
    }

    // Fired when the manager request a meal
    async createMenuOrder(){
        try {
            const record = {
                status: MENU_ORDER_STATUS.PENDING,
                quantity: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            return this.dataAccess.create(record).then(inserted => {
                this.executeSubscription(inserted.dataValues.menuOrderId, SUBSCRIPTION_ACTION_TYPES.CREATED);
                return true;
            });
        } catch (error) {
            return new UnhandledError(error);
        }
    }

    // Fired when Kitchen try to sort a meal
    async assingMenuInOrder(menuOrderId, menuId, connection) {
        try {
            const menuDA = new MenuDataAccess(connection);
            const menu = await menuDA.findAll(['menuId'], { menuId });

            if (menu) {
                const parameters = { 
                    menuId,
                    status: MENU_ORDER_STATUS.STORAGE,
                    updatedAt: new Date(),
                };
                return this.dataAccess.update(parameters, { menuOrderId }).then(() => {
                    this.executeSubscription(menuOrderId, SUBSCRIPTION_ACTION_TYPES.UPDATED);
                    return true;
                });
            }
            return true;
        } catch (error) {
            return new UnhandledError(error);
        }
    }

    /*
    *  Read the current status of the order and apply the
    *  steps to move to the next status.
    * */
    async updateMenuOrderStatus(menuOrderId, connection) {
        try {
            const record =  await this.dataAccess.findOne(['status'], { menuOrderId });

            if (record) {
                const { status: currentStatus } = record;

                if(currentStatus === MENU_ORDER_STATUS.STORAGE) {
                    return this.dispatchIngredients(menuOrderId, connection);
                } else if(currentStatus === MENU_ORDER_STATUS.COOKING) {
                    return this.dataAccess.update({ status: MENU_ORDER_STATUS.READY, updatedAt: new Date() }, { menuOrderId }).then(() => {
                        this.executeSubscription(menuOrderId, SUBSCRIPTION_ACTION_TYPES.UPDATED);
                        return true;
                    });
                } else if(currentStatus === MENU_ORDER_STATUS.READY) {
                    return this.dataAccess.update({ status: MENU_ORDER_STATUS.DELIVERED, updatedAt: new Date() }, { menuOrderId }).then(() => {
                        this.executeSubscription(menuOrderId, SUBSCRIPTION_ACTION_TYPES.UPDATED);
                        return true;
                    });
                } 
            }
            return false;
        } catch (error) {
            return new UnhandledError(error);
        }
    }

    // Fired when we try to grant the ingredients requested by kitchen
    async dispatchIngredients(menuOrderId, connection) {
        const ingredientDA = new IngredientDataAccess(connection);
        const menuIngredientDA = new MenuIngredientDataAccess(connection);
        const menuOrder =  await this.dataAccess.findOne(['menuId'], { menuOrderId });
        const menuIngredients =  await menuIngredientDA.findAll(['ingredientId', ['quantity', 'quantityRequired']], { menuId: menuOrder.menuId });
        const transaction = await connection.sequelize.transaction();
        try {
            for (let index = 0; index < menuIngredients.length; index++) {
                const menuIngredient = menuIngredients[index];
                const ingredientId = menuIngredient.ingredientId; 
                const quantityRequired = menuIngredient.quantityRequired; 

                const ingredient = await ingredientDA.findOneWithTransaction([['quantity', 'stock']], { ingredientId }, transaction);
                if (!ingredient || (ingredient.stock - quantityRequired) < 0) {
                    throw new HandledError('Some ingredients are out of stock');
                }

                await ingredientDA.decrementWithTransaction('quantity', quantityRequired, { ingredientId }, transaction);

                await this.dataAccess.updateWithTransaction({ status: MENU_ORDER_STATUS.COOKING, updatedAt: new Date() }, { menuOrderId }, transaction);
            }

            return transaction.commit()
                .then(() => {
                    const ingredientController = new IngredientController(connection);
                    menuIngredients.forEach(ingredient => {
                        ingredientController.executeSubscription(ingredient.ingredientId, SUBSCRIPTION_ACTION_TYPES.UPDATED);
                    });
                    this.executeSubscription(menuOrderId, SUBSCRIPTION_ACTION_TYPES.UPDATED);
                    return true;
                });
        } catch (error) {
            await transaction.rollback();
            if (error instanceof HandledError) return error;
            return new UnhandledError(error);
        }

    }
}