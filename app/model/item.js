'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, DECIMAL } = app.Sequelize;

  const Item = app.model.define('item', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    order_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'order',
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
    price: {
      type: DECIMAL(12, 2),
      allowNull: false,
    },
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updated_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    deleted_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('deleted_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'items',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Item.associate = () => {
    app.model.Item.belongsTo(app.model.Order, { as: 'order', foreignKey: 'order_id' });
    app.model.Item.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
    app.model.Item.hasOne(app.model.Comment, { as: 'comment', foreignKey: 'item_id' });
  };

  return Item;
};
