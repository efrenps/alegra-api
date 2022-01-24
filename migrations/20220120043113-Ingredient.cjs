'use strict';
const tableName = 'Ingredient';
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable(tableName, {
      ingredientId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down (queryInterface, Sequelize) {
     return queryInterface.dropTable(tableName);
  }
};
