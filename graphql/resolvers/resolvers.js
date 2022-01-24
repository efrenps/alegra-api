import { withFilter } from 'graphql-subscriptions';
import { getSelectionFieldNodes } from '../../helpers/GraphQLHelper.js'
import { PUBLICATIONS } from '../../utilities/Enums.js'
import IngredientController from '../../controllers/IngredientController.js';
import MenuController from '../../controllers/MenuController.js';
import MenuOrderController from '../../controllers/MenuOrderController.js';
import InvoiceController from '../../controllers/InvoiceController.js';
import { PublishHelper } from '../../helpers/PublishHelper.js'

const resolvers = {
    Query: {
        getIngredients (_parent, _args, { connection }, info) {
            const attributes = getSelectionFieldNodes(info);
            const controller = new IngredientController(connection);
            return controller.getIngredients(attributes);
        },
        getIngredient (_parent, args, { connection }, info) {
            const attributes = getSelectionFieldNodes(info);
            const { ingredientId } = args;
            const controller = new IngredientController(connection);
            return controller.getIngredient(ingredientId, attributes);
        },
        getMenus (_parent, _args, { connection }, info) {
            const attributes = getSelectionFieldNodes(info);
            const controller = new MenuController(connection);
            return controller.getMenus(attributes);
        },
        getMenuOrders (_parent, args, { connection }, info) {
            const { filter = {}, paginate, sort = {} } = args;
            const { init = 0, limit = 25 } = paginate;
            const offset = init;

            const attributes = getSelectionFieldNodes(info);
            const controller = new MenuOrderController(connection);
            return controller.getMenuOrders(attributes, filter, sort, offset, limit);
        },
        getInvoices (_parent, args, { connection }, info) {
            const { paginate, sort = {} } = args;
            const { init = 0, limit = 25 } = paginate;
            const offset = init;

            const attributes = getSelectionFieldNodes(info);
            const controller = new InvoiceController(connection);
            return controller.getInvoices(attributes, sort, offset, limit);
        },
    },
    Mutation: {
       createMenuOrder: (parent, args, { connection }) => {
            const controller = new MenuOrderController(connection);
            return controller.createMenuOrder();
        },
        assingMenuInOrder: (parent, args, { connection }) => {
            const  { menuOrderId, menuId }= args;
            const controller = new MenuOrderController(connection);
            return controller.assingMenuInOrder(menuOrderId, menuId, connection);
        },
        updateMenuOrderStatus: (parent, args, { connection }) => {
            const  { menuOrderId }= args;
            const controller = new MenuOrderController(connection);
            return controller.updateMenuOrderStatus(menuOrderId, connection);
        },
        buyIngredient: (parent, args, { connection }) => {
            const  { ingredientId }= args;
            const controller = new IngredientController(connection);
            return controller.buyIngredient(ingredientId, connection);
        },
    },
    Subscription: {
        menuOrders: {
            subscribe: withFilter(
                () => PublishHelper.getPubSub().asyncIterator(PUBLICATIONS.MENU_ORDERS),
                (payload, args, context) => {
                    return MenuOrderController.filterMenuOrders(payload, args, context)
                }
            ),
            resolve: payload => payload,
        },
        ingredients: {
            subscribe: withFilter(
                () => PublishHelper.getPubSub().asyncIterator(PUBLICATIONS.INGREDIENTS),
                (payload, args, context) => {
                    return IngredientController.filterIngredients(payload, args, context)
                }
            ),
            resolve: payload => payload,
        },
    }
};

export default resolvers;