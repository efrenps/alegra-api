export const MENU_ORDER_STATUS = Object.freeze({
    PENDING: 'pending',
    STORAGE: 'storage',
    COOKING: 'cooking',
    READY: 'ready',
    DELIVERED: 'delivered',
});


export const PUBLICATIONS = Object.freeze({
    MENU_ORDERS: 'MENU_ORDERS',
    INGREDIENTS: 'INGREDIENTS',
});

export const SUBSCRIPTION_ACTION_TYPES = Object.freeze({
    CREATED: 'CREATED',
    UPDATED: 'UPDATED',
    DELETED: 'DELETED',
});

export const GRAPHQL_OPERATION = {
    QUERY: 'query',
    MUTATION: 'mutation',
    SUBSCRIPTION: 'subscription',
};
