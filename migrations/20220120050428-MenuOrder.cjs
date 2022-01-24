'use strict';
const tableName = 'MenuOrder';
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable(tableName, {
      menuOrderId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menuId: {
        type: Sequelize.INTEGER,
        references: { model: 'Menu', key: 'menuId' }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: [
          'pending',
          'storage',
          'cooking',
          'ready',
          'delivered'
        ],
        defaultValue: 'pending',
        allowNull: false,
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
