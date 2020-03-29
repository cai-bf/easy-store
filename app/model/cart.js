'use strict';

module.exports = app => {
  const { DATE, INTEGER } = app.Sequelize;

  const Cart = app.model.define('cart', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    sku_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'skus',
        key: 'id',
      },
    },
    num: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    created_at: DATE,
    updated_at: DATE,
  }, {
    underscored: true,
    tableName: 'carts',
  });

  Cart.associate = () => {
    app.model.Cart.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
    app.model.Cart.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
  };

  return Cart;
};
