'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const menuIngredients = [
      {
        name: 'Fried Chicken',
        ingredients: ['chicken', 'ketchup', 'potato', 'rice'],
      },
      {
        name: 'Chicken Salad',
        ingredients: ['chicken', 'tomato', 'lemon', 'lettuce', 'onion'],
      },
      {
        name: 'Grilled Meat',
        ingredients: ['meat', 'rice', 'potato', 'tomato', 'lettuce', 'lemon'],
      },
      {
        name: 'Grilled Chicken',
        ingredients: ['chicken', 'rice', 'potato', 'tomato', 'lettuce', 'lemon'],
      },
      {
        name: 'French Beef',
        ingredients: ['meat', 'rice', 'onion', 'tomato', 'potato'],
      },
      {
        name: 'Cheesy Beef',
        ingredients: ['meat', 'rice', 'cheese', 'tomato', 'onion', 'lemon'],
      }
    ];

    const menuIngredientsData = [];
    for (let i = 0; i < menuIngredients.length; i++) {
      const menu = menuIngredients[i];
      const menuId = await queryInterface.rawSelect('Menu', {
        where: {
          name: menu.name,
        },
      }, ['menuId']);
  
      if(menuId) {
         for (let j = 0; j < menu.ingredients.length; j++) {
           const ingredient = menu.ingredients[j];
           const ingredientId = await queryInterface.rawSelect('Ingredient', {
              where: {
                name: ingredient,
              },
            }, ['ingredientId']);

            if(ingredientId){
              menuIngredientsData.push(
                {
                  menuId: menuId,
                  ingredientId: ingredientId,
                  quantity: 1,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
              )
            }
         }
      }
    }
    return queryInterface.bulkInsert('MenuIngredient', menuIngredientsData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
