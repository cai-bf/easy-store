'use strict';

const moment = require('moment');

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
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updated_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
  }, {
      underscored: true,
      tableName: 'carts',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

  Cart.associate = () => {
    app.model.Cart.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
    app.model.Cart.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
  };

  return Cart;
};
