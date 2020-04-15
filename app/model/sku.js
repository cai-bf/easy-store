'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, DECIMAL } = app.Sequelize;

  const Sku = app.model.define('sku', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    goods_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'goods',
        key: 'id',
      },
    },
    price: {
      type: DECIMAL(12, 2),
      allowNull: false,
    },
    stock_num: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sale_num: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    purchase_price: {
      type: DECIMAL(12, 2),
      allowNull: false,
    },
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updated_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
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
    tableName: 'skus',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Sku.associate = () => {
    app.model.Sku.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id' });
    app.model.Sku.belongsToMany(app.model.Option, { as: 'options', through: app.model.SkuSpec });
    app.model.Sku.hasMany(app.model.SkuSpec, { as: 'sku_spec', foreignKey: 'sku_id' });
  };

  return Sku;
};
