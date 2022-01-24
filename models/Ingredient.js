import Sequelize from 'sequelize';
const Ingredient = function(sequelize, DataTypes) {
  const ingredient = sequelize.define('Ingredient', {
    ingredientId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Ingredient',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ingredientId" },
        ]
      },
    ]
  });

  ingredient.associate = function(models) {
    ingredient.belongsToMany(models.Menu, { through: models.MenuIngredient, as: 'menus', foreignKey: 'ingredientId' });
  };

  return ingredient;
};

export default Ingredient;
