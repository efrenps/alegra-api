'use strict';
const tableName = 'MenuIngredient';
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable(tableName, {
      menuIngredientId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menuId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Menu', key: 'menuId' }
      },
      ingredientId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      quantity: {
        allowNull: false,
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
