import { gql } from 'apollo-server';

const typeDefs = gql`
    type Ingredient {
        ingredientId: Int!
        name: String!
        quantity: Int
    }

    type MenuReceipe {
        menuId: Int!
        name: String!
        ingredients: [Ingredient]
    }

    type Menu {
        menuId: Int!
        name: String!
    }

    input MenuOrderFilter {
        status: [String]
    }

    input Paginate {
        init: Int
        limit: Int
    }

    input Sort {
        fieldName: String
        dir: String
    }

    type MenuOrder {
        menuOrderId: Int!
        menuId: Int
        quantity: Int!
        status: String!
        createdAt: String!
        menu: Menu
    }

    type Invoice {
        invoiceId: Int!
        ingredientId: Int!
        quantity: Int!
        createdAt: String
        ingredient: Ingredient!
    }

    type MenuOrderSubscription {
        type: String,
        data: MenuOrder,
    }

    type IngredientSubscription {
        type: String,
        data: Ingredient,
    }

    type Query {
        getIngredients: [Ingredient]
        getIngredient(ingredientId: Int!): Ingredient
        getMenus: [MenuReceipe]
        getMenuOrders(filter: MenuOrderFilter, paginate: Paginate, sort: Sort): [MenuOrder]
        getInvoices(paginate: Paginate, sort: Sort): [Invoice]
    }

    type Mutation {
        createMenuOrder: Boolean!
        assingMenuInOrder (menuOrderId: Int!, menuId: Int!): Boolean!
        updateMenuOrderStatus (menuOrderId: Int!): Boolean!
        buyIngredient (ingredientId: Int!): Boolean!
    }

    type Subscription {
       menuOrders: MenuOrderSubscription
    }

    type Subscription {
       ingredients: IngredientSubscription
    }
`


export default typeDefs;