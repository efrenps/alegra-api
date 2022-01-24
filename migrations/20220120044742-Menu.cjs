'use strict';
const tableName = 'Menu';
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable(tableName, {
      menuId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      isAvailable: {
        type: Sequelize.BOOLEAN
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
