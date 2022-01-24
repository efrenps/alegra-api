const Menu = function(sequelize, DataTypes) {
  const menu = sequelize.define('Menu', {
    menuId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Menu',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "menuId" },
        ]
      },
    ]
  });

  menu.associate = function(models) {
    menu.belongsToMany(models.Ingredient, { through: models.MenuIngredient, as: 'ingredients', foreignKey: 'menuId' });
    menu.hasMany(models.MenuOrder, {foreignKey:'menuId', as: 'order'});
    menu.hasMany(models.MenuIngredient, {foreignKey:'menuId', as: 'ingredient'});
  };

  return menu;
};

export default Menu;
