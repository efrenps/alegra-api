import Sequelize from 'sequelize';
const MenuOrder = function(sequelize, DataTypes) {
  const menuOrder = sequelize.define('MenuOrder', {
    menuOrderId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Menu',
        key: 'menuId'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','storage','cooking','ready','delivered'),
      allowNull: false,
      defaultValue: "pending"
    }
  }, {
    sequelize,
    tableName: 'MenuOrder',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MenuOrderId" },
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

  menuOrder.associate = function(models) {
    menuOrder.belongsTo(models.Menu, {foreignKey: 'menuId', as: 'menu'});
  };

  return menuOrder;
};

export default MenuOrder;
