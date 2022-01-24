'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const menus = ['Fried Chicken', 'Chicken Salad', 'Grilled Meat',
      'Grilled Chicken', 'French Beef', 'Cheesy Beef'];

    menus.forEach((menu) => {
      menusData.push(
        {
          name: menu,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    });
    return queryInterface.bulkInsert('Menu', menusData);
  },

   down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Menu', null, {});
  }
};
