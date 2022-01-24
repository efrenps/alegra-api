'use strict';
const tableName = 'Invoice';
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable(tableName, {
      invoiceId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ingredientId: {
        type: Sequelize.INTEGER,
        references: { model: 'Ingredient', key: 'ingredientId' }
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
