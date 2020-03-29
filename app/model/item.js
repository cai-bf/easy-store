'use strict';

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
    created_at: DATE,
    updated_at: DATE,
    deleted_at: DATE,
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'items',
  });

  Item.associate = () => {
    app.model.Item.belongsTo(app.model.Order, { as: 'order', foreignKey: 'order_id' });
    app.model.Item.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
    app.model.Item.hasOne(app.model.Comment, { as: 'comment', foreignKey: 'item_id' });
  };

  return Item;
};
