import GenericDataAccess from './GenericDataAccess.js';

export default class IngredientDataAccess extends GenericDataAccess {
    constructor(connection) {
        super(connection, 'Ingredient');
        this.connection = connection;
    }
}