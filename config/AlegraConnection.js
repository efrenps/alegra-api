/* eslint-disable no-console */
/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import Sequelize from 'sequelize';

import Ingredient from '../models/Ingredient.js';
import Menu from '../models/Menu.js';
import MenuIngredient from '../models/MenuIngredient.js';
import MenuOrder from '../models/MenuOrder.js';
import Invoice from '../models/Invoice.js';

dotenv.config();
const { 
    DB_URL, DB_PORT, DB_NAME, DB_USER, DB_PASS,
 } = process.env;

 const options = {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_URL,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    port: DB_PORT,
    logging: false,
};

const modules = [
    Ingredient, Menu, MenuIngredient, MenuOrder, Invoice,
];

const AlegraConnection = {};
let sequelize;

try {
    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, options);
} catch (e) {
    console.log(e);
}
modules
    .forEach((module) => {
        const model = module(sequelize, Sequelize, options);

        AlegraConnection[model.name] = model;
    });


Object.keys(AlegraConnection).forEach((modelName) => {
    if (AlegraConnection[modelName].associate) {
        AlegraConnection[modelName].associate(AlegraConnection); 
    }
});
    
AlegraConnection.sequelize = sequelize;
AlegraConnection.Sequelize = Sequelize;

export default AlegraConnection;
 