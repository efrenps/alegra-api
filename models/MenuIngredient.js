import Sequelize from 'sequelize';
const MenuIngredient = function(sequelize, DataTypes) {
  const menuIngredient = sequelize.define('MenuIngredient', {
    menuIngredientId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    menuId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Menu',
        key: 'menuId'
      }
    },
    ingredientId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    tableName: 'MenuIngredient',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "menuIngredientId" },
        ]
      },
      {
        name: "menuId",
        using: "BTREE",
        fields: [
          { name: "menuId" },
        ]
      },
    ]
  });

  menuIngredient.associate = function(models) {
    menuIngredient.belongsTo(models.Menu, {foreignKey: 'menuId', as: 'menu'});
  };

  return menuIngredient;
};

export default MenuIngredient;
