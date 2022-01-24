'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const ingredients = ['tomato', 'lemon', 'potato', 'rice', 'ketchup', 'lettuce', 'onion', 'cheese', 'meat', 'chicken'];
    const ingredientsData = [];

    ingredients.forEach((ingredient) => {
      ingredientsData.push(
        {
          name: ingredient,
          quantity: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    });
    return queryInterface.bulkInsert('Ingredient', ingredientsData);
  },

   down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Ingredient', null, {});
  }
};
