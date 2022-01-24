import Sequelize from 'sequelize';
const Invoice = function(sequelize, DataTypes) {
  const invoice = sequelize.define('Invoice', {
    invoiceId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Ingredient',
        key: 'ingredientId'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Invoice',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "invoiceId" },
        ]
      },
      {
        name: "ingredientId",
        using: "BTREE",
        fields: [
          { name: "ingredientId" },
        ]
      },
    ]
  });

  invoice.associate = function(models) {
    invoice.belongsTo(models.Ingredient, {foreignKey: 'ingredientId', as: 'invoiceIngredient'});
  };

  return invoice;
};

export default Invoice;
