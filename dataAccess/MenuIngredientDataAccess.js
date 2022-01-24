import GenericDataAccess from './GenericDataAccess.js';

export default class MenuIngredientDataAccess extends GenericDataAccess {
    constructor(connection) {
        super(connection, 'MenuIngredient');
        this.connection = connection;
    }
}